export default class FloatQueue {
    constructor() {
        this.queue = [];
    }

    addItem(listingId, inspectLink) {
        this.queue.push({listingId, inspectLink});
    }

    process(cb) {
        this.cb = cb;
        this.processFloatQueue();
    }

    processFloatQueue() {
        if (this.queue.length === 0) { return setTimeout(this.processFloatQueue.bind(this), 100); }

        const item = this.queue.shift();
        this.cb(item).then(this.processFloatQueue.bind(this));
    }
}
