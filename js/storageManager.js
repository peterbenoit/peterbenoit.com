const LZString = (function () {
    const f = String.fromCharCode;
    const keyStrBase64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    const getBaseValue = function (alphabet, character) {
        return alphabet.indexOf(character);
    };

    const LZString = {
        compressToUTF16(input) {
            if (input === null) return '';
            let output = '';
            let i,
                current,
                status = 0,
                currentCharCode;
            input += '\0';
            for (i = 0; i < input.length; i++) {
                currentCharCode = input.charCodeAt(i);
                switch (status++) {
                    case 0:
                        output += f(currentCharCode >> 1);
                        current = (currentCharCode & 1) << 14;
                        break;
                    case 1:
                        output += f(current | (currentCharCode >> 2));
                        current = (currentCharCode & 3) << 13;
                        break;
                    case 2:
                        output += f(current | (currentCharCode >> 3));
                        current = (currentCharCode & 7) << 12;
                        break;
                }
            }
            return output;
        },

        decompressFromUTF16(compressed) {
            if (compressed === null) return '';
            let output = '',
                i,
                status = 0,
                current,
                next,
                currentCharCode;
            for (i = 0; i < compressed.length; i++) {
                currentCharCode = compressed.charCodeAt(i);
                switch (status++) {
                    case 0:
                        current = currentCharCode << 1;
                        break;
                    case 1:
                        current |= currentCharCode >> 14;
                        output += f(current);
                        current = (currentCharCode & 16383) << 2;
                        break;
                    case 2:
                        current |= currentCharCode >> 13;
                        output += f(current);
                        current = (currentCharCode & 8191) << 3;
                        break;
                }
            }
            return output;
        },
    };
    return LZString;
})();

class StorageManager {
    constructor(useSession = false, options = {}) {
        this.storage = useSession ? window.sessionStorage : window.localStorage;
        this.namespace = options.namespace || '';
        this.defaultExpiration = options.defaultExpiration || {};
        this.listeners = {};
        this.expirationTimers = {};
        this.initStorageListener();
    }

    // Helper to namespace keys
    _getNamespacedKey(key) {
        return this.namespace ? `${this.namespace}:${key}` : key;
    }

    // Set an item with optional default expiration and compression
    async set(key, value) {
        const namespacedKey = this._getNamespacedKey(key);
        const compressedData = LZString.compressToUTF16(JSON.stringify({ value }));

        console.log('Setting data:', compressedData); // Debug: show compressed data
        this.storage.setItem(namespacedKey, compressedData);
        this.triggerListeners(namespacedKey);

        // Automatically apply default expiration if configured
        if (this.defaultExpiration[key]) {
            await this.expires(key, this.defaultExpiration[key]);
        }
    }

    // Set expiration with a timeout
    async expires(key, expiresIn) {
        const namespacedKey = this._getNamespacedKey(key);
        const storedData = this.storage.getItem(namespacedKey);

        if (!storedData) {
            console.error(`No data found for key: ${namespacedKey}`);
            return;
        }

        const decompressedData = LZString.decompressFromUTF16(storedData);
        console.log('Decompressed data:', decompressedData); // Debug: show decompressed data

        if (!decompressedData) {
            console.error('Failed to decompress data.');
            return;
        }

        const data = JSON.parse(decompressedData);
        const expirationTime = Date.now() + expiresIn * 1000;
        data.expiration = expirationTime;

        const compressedData = LZString.compressToUTF16(JSON.stringify(data));
        this.storage.setItem(namespacedKey, compressedData);

        // Clear any previous expiration timer and set a new one
        if (this.expirationTimers[namespacedKey]) {
            clearTimeout(this.expirationTimers[namespacedKey]);
        }
        this.expirationTimers[namespacedKey] = setTimeout(() => {
            this.remove(key); // Remove the item on expiration
            this.triggerListeners(namespacedKey); // Trigger UI update
        }, expiresIn * 1000);

        this.triggerListeners(namespacedKey);
    }

    // Get an item with decompression and expiration check
    async get(key) {
        const namespacedKey = this._getNamespacedKey(key);
        const compressedData = this.storage.getItem(namespacedKey);

        if (!compressedData) return null;

        const decompressedData = LZString.decompressFromUTF16(compressedData);
        console.log('Decompressed for get:', decompressedData); // Debug: show decompressed data

        if (!decompressedData) {
            console.error('Failed to decompress data for get.');
            return null;
        }

        const data = JSON.parse(decompressedData);

        if (data.expiration && Date.now() > data.expiration) {
            this.remove(key); // Automatically remove expired data
            return null;
        }

        return data.value;
    }

    // Remove an item and clear expiration timers
    remove(key) {
        const namespacedKey = this._getNamespacedKey(key);
        this.storage.removeItem(namespacedKey);

        if (this.expirationTimers[namespacedKey]) {
            clearTimeout(this.expirationTimers[namespacedKey]);
            delete this.expirationTimers[namespacedKey];
        }

        this.triggerListeners(namespacedKey);
    }

    // Clear all storage
    clear() {
        this.storage.clear();
    }

    // Listen for changes on a specific key
    onChange(key, callback) {
        const namespacedKey = this._getNamespacedKey(key);
        this.listeners[namespacedKey] = callback;
    }

    // Batch set items with optional expiration
    async batchSet(items) {
        for (const { key, value, expiresIn } of items) {
            await this.set(key, value);
            if (expiresIn) {
                await this.expires(key, expiresIn);
            }
        }
    }

    // Batch get multiple items
    batchGet(keys) {
        return keys.reduce((result, key) => {
            result[key] = this.get(key);
            return result;
        }, {});
    }

    // Event listener to catch changes across tabs/windows
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

    // Trigger change listeners manually
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
