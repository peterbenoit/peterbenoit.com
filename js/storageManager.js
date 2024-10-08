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

        const data = JSON.parse(LZString.decompressFromUTF16(storedData));
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

        const data = JSON.parse(LZString.decompressFromUTF16(compressedData));

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
