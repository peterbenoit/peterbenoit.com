let scriptLoaded = false;

function include(url) {
    return new Promise((resolve, reject) => {
        if (scriptLoaded) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = url;
        script.async = true;

        script.onload = () => {
            console.log(`Library loaded from: ${url}`);
            scriptLoaded = true; // Mark as loaded
            resolve();
        };

        script.onerror = () => {
            console.error(`Failed to load library from: ${url}`);
            reject(new Error(`Failed to load script ${url}`));
        };

        document.head.appendChild(script);
    });
}

class StorageManager {
    constructor(useSession = false, options = {}) {
        this.storage = useSession ? window.sessionStorage : window.localStorage;
        this.namespace = options.namespace || '';
        this.defaultExpiration = options.defaultExpiration || {};
        this.listeners = {};
        this.expirationTimers = {};
        this.initStorageListener();

        // Load LZString once during initialization
        this._ensureLZStringLoaded();
    }
    async _ensureLZStringLoaded() {
        if (!this.lzStringLoaded) {
            await include('https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.js');
            this.lzStringLoaded = true;
        }
    }

    _getNamespacedKey(key) {
        return this.namespace ? `${this.namespace}:${key}` : key;
    }

    async set(key, value) {
        const namespacedKey = this._getNamespacedKey(key);
        const compressedData = LZString.compressToUTF16(JSON.stringify({ value }));

        console.log('Setting data:', compressedData);
        this.storage.setItem(namespacedKey, compressedData);
        this.triggerListeners(namespacedKey);

        if (this.defaultExpiration[key]) {
            await this.expires(key, this.defaultExpiration[key]);
        }
    }

    async expires(key, expiresIn) {
        const namespacedKey = this._getNamespacedKey(key);
        const storedData = this.storage.getItem(namespacedKey);

        if (!storedData) {
            console.error(`No data found for key: ${namespacedKey}`);
            return;
        }

        const decompressedData = LZString.decompressFromUTF16(storedData);
        console.log('Decompressed data:', decompressedData);

        if (!decompressedData) {
            console.error('Failed to decompress data.');
            return;
        }

        const data = JSON.parse(decompressedData);
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

    async get(key) {
        const namespacedKey = this._getNamespacedKey(key);
        const compressedData = this.storage.getItem(namespacedKey);

        if (!compressedData) return null;

        const decompressedData = LZString.decompressFromUTF16(compressedData);
        console.log('Decompressed for get:', decompressedData);

        if (!decompressedData) {
            console.error('Failed to decompress data for get.');
            return null;
        }

        const data = JSON.parse(decompressedData);

        if (data.expiration && Date.now() > data.expiration) {
            this.remove(key);
            return null;
        }

        return data.value;
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

    async batchSet(items) {
        for (const { key, value, expiresIn } of items) {
            await this.set(key, value);
            if (expiresIn) {
                await this.expires(key, expiresIn);
            }
        }
    }

    batchGet(keys) {
        return keys.reduce((result, key) => {
            result[key] = this.get(key);
            return result;
        }, {});
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
