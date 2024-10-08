let scriptLoadedPromise = null;

async function include(url) {
    if (scriptLoadedPromise) {
        return scriptLoadedPromise;
    }

    scriptLoadedPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;

        script.onload = () => {
            console.log(`Library loaded from: ${url}`);
            resolve();
        };

        script.onerror = () => {
            console.error(`Failed to load library from: ${url}`);
            reject(new Error(`Failed to load script ${url}`));
        };

        document.head.appendChild(script);
    });

    return scriptLoadedPromise;
}

class StorageManager {
    constructor(useSession = false, options = {}) {
        this.storage = useSession ? window.sessionStorage : window.localStorage;
        this.namespace = options.namespace || '';
        this.defaultExpiration = options.defaultExpiration || {};
        this.listeners = {};
        this.expirationTimers = {};
        this.initStorageListener();

        return new Proxy(this, {
            get(target, prop, receiver) {
                if (typeof target[prop] === 'function' && prop !== '_ensureLZStringLoaded') {
                    return async (...args) => {
                        await target._ensureLZStringLoaded(); // Ensure LZString is loaded before any method
                        return target[prop](...args);
                    };
                }
                return Reflect.get(target, prop, receiver);
            },
        });
    }

    _ensureLZStringLoaded() {
        return include('https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js');
    }

    _getNamespacedKey(key) {
        return this.namespace ? `${this.namespace}:${key}` : key;
    }

    // Add a compression flag to the data
    set(key, value) {
        const namespacedKey = this._getNamespacedKey(key);
        const data = { value, _compressed: true }; // Add the flag to indicate compression
        const compressedData = LZString.compressToUTF16(JSON.stringify(data));
        this.storage.setItem(namespacedKey, compressedData);
        this.triggerListeners(namespacedKey);
        if (this.defaultExpiration[key]) {
            this.expires(key, this.defaultExpiration[key]);
        }
    }

    get(key) {
        const namespacedKey = this._getNamespacedKey(key);
        const compressedData = this.storage.getItem(namespacedKey);

        if (!compressedData) return null;

        const decompressedData = LZString.decompressFromUTF16(compressedData);
        if (!decompressedData) {
            console.error('Failed to decompress data for get.');
            return null;
        }

        const data = JSON.parse(decompressedData);

        // Check if the data is compressed by looking at the flag
        if (!data || !data._compressed) {
            console.error('Data was not compressed properly.');
            return null;
        }

        if (data.expiration && Date.now() > data.expiration) {
            this.remove(key); // Automatically clean expired items
            return null;
        }

        return data.value;
    }

    expires(key, expiresIn) {
        const namespacedKey = this._getNamespacedKey(key);
        const storedData = this.storage.getItem(namespacedKey);

        if (!storedData) {
            console.error(`No data found for key: ${namespacedKey}`);
            return;
        }

        const decompressedData = LZString.decompressFromUTF16(storedData);

        if (!decompressedData) {
            console.error('Failed to decompress data.');
            return;
        }

        const data = JSON.parse(decompressedData);

        // Ensure the data is valid and compressed
        if (!data || !data._compressed) {
            console.error('Data was not compressed properly.');
            return;
        }

        const expirationTime = Date.now() + expiresIn * 1000;
        data.expiration = expirationTime;

        const compressedData = LZString.compressToUTF16(JSON.stringify(data));
        this.storage.setItem(namespacedKey, compressedData);

        if (this.expirationTimers[namespacedKey]) {
            clearTimeout(this.expirationTimers[namespacedKey]);
        }

        this.expirationTimers[namespacedKey] = setTimeout(() => {
            this.remove(key);
            this.triggerListeners(namespacedKey);
        }, expiresIn * 1000);

        this.triggerListeners(namespacedKey);
    }

    remove(key) {
        const namespacedKey = this._getNamespacedKey(key);
        this.storage.removeItem(namespacedKey);

        if (this.expirationTimers[namespacedKey]) {
            clearTimeout(this.expirationTimers[namespacedKey]);
            delete this.expirationTimers[namespacedKey];
        }

        this.triggerListeners(namespacedKey);
    }

    clear() {
        this.storage.clear();
    }

    onChange(key, callback) {
        const namespacedKey = this._getNamespacedKey(key);
        this.listeners[namespacedKey] = callback;
    }

    batchSet(items) {
        for (const { key, value, expiresIn } of items) {
            this.set(key, value);
            if (expiresIn) {
                this.expires(key, expiresIn);
            }
        }
    }

    batchGet(keys) {
        return keys.reduce((result, key) => {
            result[key] = this.get(key);
            return result;
        }, {});
    }

    // Cleanup method to remove expired items from storage
    cleanup() {
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i);

            // Only process keys that match the namespace (if any)
            if (this.namespace && !key.startsWith(this.namespace)) {
                continue; // Skip keys outside the namespace
            }

            const actualKey = key.replace(`${this.namespace}:`, ''); // Remove namespace from the key
            const value = this.get(actualKey); // Check if the data is expired

            // If the value is null, it means it was expired and removed
            if (value === null) {
                console.log(`Removed expired item: ${actualKey}`);
            }
        }
    }

    initStorageListener() {
        window.addEventListener('storage', (event) => {
            const { key, newValue, oldValue } = event;
            if (this.listeners[key]) {
                const newData = newValue
                    ? JSON.parse(LZString.decompressFromUTF16(newValue)).value
                    : null;
                const oldData = oldValue
                    ? JSON.parse(LZString.decompressFromUTF16(oldValue)).value
                    : null;
                this.listeners[key](newData, oldData);
            }
        });
    }

    triggerListeners(key) {
        const namespacedKey = this._getNamespacedKey(key);
        if (this.listeners[namespacedKey]) {
            const newValue = this.storage.getItem(namespacedKey);
            const newData = newValue
                ? JSON.parse(LZString.decompressFromUTF16(newValue)).value
                : null;
            this.listeners[namespacedKey](newData, null);
        }
    }
}
