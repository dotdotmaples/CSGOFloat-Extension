export default class ItemInfo {
    constructor() {
        this.items = {};
    }

    hasListingId(id) {
        return id in this.items;
    }

    getInfo(id) {
        if (this.hasListingId(id)) {
            return this.items[id];
        }
    }

    addInfo(id, info) {
        if (info.iteminfo) {
            info = info.iteminfo;
        }

        this.items[id] = info;
    }
}
