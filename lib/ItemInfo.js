export default class ItemInfo {
    constructor() {
        this.items = {};
    }

    hasListingId(id) {
        return id in this.items;
    }

    getItemInfo(item) {
        return this.getInfo(item.listingId);
    }

    getItemForId(id) {
        return this.hasListingId(id) && this.items[id];
    }

    getInfo(id) {
        if (this.hasListingId(id)) {
            return this.items[id].iteminfo;
        }
    }

    hasItem(item) {
        return this.hasListingId(item.listingId);
    }

    addItem(item) {
        if (!item.hasItemInfo()) {
            throw new Error('Item must have item info to be added');
        }

        this.items[item.listingId] = item;
    }
}
