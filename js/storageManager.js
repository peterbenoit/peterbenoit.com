class StorageManager {
    constructor(useSession = false) {
        this.storage = useSession ? window.sessionStorage : window.localStorage;
        this.listeners = {};
        this.expirationTimers = {}; // Store expiration timers for each key
        this.initStorageListener();
    }

    set(key, value) {
        const data = { value };
        this.storage.setItem(key, JSON.stringify(data));
        this.triggerListeners(key);
    }

    // Set expiration and handle it with a timeout
    expires(key, expiresIn) {
        const storedData = this.storage.getItem(key);
        if (!storedData) {
            console.error(`No data found for key: ${key}`);
            return;
        }
        const data = JSON.parse(storedData);
        const expirationTime = Date.now() + expiresIn * 1000;
        data.expiration = expirationTime;
        this.storage.setItem(key, JSON.stringify(data));

        // Clear previous timer, if any, and set a new one
        if (this.expirationTimers[key]) {
            clearTimeout(this.expirationTimers[key]);
        }
        this.expirationTimers[key] = setTimeout(() => {
            this.remove(key); // Remove the item when it expires
            this.triggerListeners(key); // Update listeners/UI when expired
        }, expiresIn * 1000);

        this.triggerListeners(key);
    }

    get(key) {
        const storedData = this.storage.getItem(key);
        if (!storedData) return null;
        const data = JSON.parse(storedData);

        // Check for expiration when accessing
        if (data.expiration && Date.now() > data.expiration) {
            this.remove(key); // Remove expired data
            return null;
        }
        return data.value;
    }

    remove(key) {
        this.storage.removeItem(key);

        // Clear any existing expiration timer
        if (this.expirationTimers[key]) {
            clearTimeout(this.expirationTimers[key]);
            delete this.expirationTimers[key];
        }

        this.triggerListeners(key);
    }

    clear() {
        this.storage.clear();
    }

    onChange(key, callback) {
        this.listeners[key] = callback;
    }

    initStorageListener() {
        window.addEventListener('storage', (event) => {
            const { key, newValue, oldValue } = event;
            if (this.listeners[key]) {
                const newData = newValue ? JSON.parse(newValue).value : null;
                const oldData = oldValue ? JSON.parse(oldValue).value : null;
                this.listeners[key](newData, oldData);
            }
        });
    }

    triggerListeners(key) {
        if (this.listeners[key]) {
            const newValue = this.storage.getItem(key);
            const newData = newValue ? JSON.parse(newValue).value : null;
            this.listeners[key](newData, null);
        }
    }
}
