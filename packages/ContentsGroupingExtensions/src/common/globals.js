class GlobalEvent {
    static eventName(key) {
        return `rcms-vue.globals.${key}`;
    }
    static dispatch(key, detail) {
        const event = new CustomEvent(this.eventName(key), { detail });
        window.document.dispatchEvent(event);
    }
    static listen(key, callback) {
        window.document.addEventListener(this.eventName(key), (e) => callback(e.detail));
        return true;
    }
}

class GlobalCustomEvent extends GlobalEvent {
    static eventName(key) {
        return `rcms-vue.custom.${key}`;
    }
}

export { GlobalEvent, GlobalCustomEvent };
