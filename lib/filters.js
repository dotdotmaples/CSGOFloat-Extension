import {hexToRgb, removeButtons, rgbToHex} from './utils';
import Filter from './Filter';

export default class Filters {
    constructor() {
        this.filters = [];
        this.expressionTimer = false;
    }

    getMatchColour(vars) {
        let colours = [];

        for (let filter of this.filters) {
            if (filter.func(vars) === 1) colours.push(hexToRgb(filter.colour));
        }

        if (colours.length > 0) {
            // Get the average colour between each matching filter
            let avg_colours = [0, 0, 0];

            for (let colour of colours) {
                for (let index in colour) {
                    avg_colours[index] += colour[index];
                }
            }

            for (let index in avg_colours) {
                avg_colours[index] = parseInt(avg_colours[index]/colours.length);
            }
            
            return rgbToHex(avg_colours);
        }
    }

    addFilter(expression, colour) {
        if (arguments.length === 0) {
            expression = document.querySelector('#float_expression_filter').value;
            colour = document.querySelector('#floatFilterColour').value;
        }

        let filter = new Filter(expression, colour, this);

        filter.addToUI();

        this.filters.push(filter);
        this.saveFilters();
    }

    setFilterColour(filter, colour) {
        let index = this.filters.indexOf(filter);

        if (index === -1) return;

        this.filters[index].colour = colour;

        this.saveFilters();
    }

    removeFilter(filter) {
        let index = this.filters.indexOf(filter);

        if (index === -1) return;

        filter.div.parentNode.removeChild(filter.div);
        this.filters.splice(index, 1);

        this.saveFilters();
    }

    getSaveKey() {
        let itemName = document.querySelector('.market_listing_nav a:nth-child(2)');

        if (itemName) return itemName.innerText + '_expressions';
    }

    getSavedFilters(cb) {
        let key = this.getSaveKey();

        if (!key) cb([]);

        let syncFilters = {};
        syncFilters[key] = [];

        let storageType = chrome.storage.sync;
        if (!storageType) storageType = chrome.storage.local;

        storageType.get(syncFilters, (items) => {
            cb(items[key]);
        });
    }

    saveFilters() {
        let key = this.getSaveKey();

        if (!key) return;

        let savedFilters = this.filters.map((filter) => filter.serialize());

        const syncFilters = {};
        syncFilters[key] = savedFilters;

        let storageType = chrome.storage.sync;
        if (!storageType) storageType = chrome.storage.local;

        storageType.set(syncFilters);

        // update UI
        removeButtons();
    }
}
