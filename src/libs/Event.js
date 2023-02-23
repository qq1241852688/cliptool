class Event {
    constructor() {
        this.cache = {};
    }
    on(type, callback) {
        if (typeof callback !== "function") return;
        if (!this.cache[type]) {
            this.cache[type] = [];
        }
        this.cache[type].push(callback);
    }
    emit(type, ...data) {
        if (!this.cache[type]) return;
        for (let i = 0; i < this.cache[type].length; i++) {
            let callback = this.cache[type][i];
            callback.apply(this, data);
        }
    }

    remove(type, fn) {
        if (!this.cache[type]) return;
        const index = this.cache[type].findIndex(item => item === fn);
        if (index !== -1) {
            this.cache[type].splice(index, 1);
        }
        if (index === 0 && this.cache[type].length === 1) {
            delete this.cache[type];
        }
    }
}
export default Event;