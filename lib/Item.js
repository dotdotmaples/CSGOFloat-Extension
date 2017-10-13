export default class Item {
    get filterVars() {
        if (!this.hasItemInfo()) {
            return;
        }

        return {
            float: this.iteminfo.floatvalue,
            seed: this.iteminfo.paintseed,
            minfloat: this.iteminfo.min,
            maxfloat: this.iteminfo.max
        }
    }

    constructor(listingId, inspectLink) {
        this.listingId = listingId;
        this.inspectLink = inspectLink;
    }

    addItemInfo(itemInfo) {
        this.iteminfo = itemInfo;
    }

    hasItemInfo() {
        return this.iteminfo !== undefined;
    }
}
