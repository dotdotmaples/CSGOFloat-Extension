export default class FloatQueue {
    constructor() {
        this.queue = [];
    }

    addItem(item) {
        this.queue.push(item);

        if (!this.processing) {
            this.processFloatQueue();
        }
    }

    process(cb) {
        this.cb = cb;

        if (!this.processing) {
            this.processFloatQueue();
        }
    }

    processFloatQueue() {
        if (this.queue.length === 0) { return; }

        this.processing = true;

        const item = this.queue.shift();
        this.cb(item).then(() => {
            this.processing = false;
            this.processFloatQueue();
        });
    }
}
