import {createElement, createButton, hexToRgb, removeButtons, rgbToHex, helpHTML} from './utils';
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

    tryCompile(expression) {
        new Filter(expression, '', this);
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

    onHelpClick() {
        let filterdiv = document.querySelector('#floatFilter');

        let helpdiv = filterdiv.querySelector('#filterHelp');
        if (helpdiv) filterdiv.removeChild(helpdiv);
        else {
            // create it
            helpdiv = createElement('div', {
                id: 'filterHelp',
                style: {
                    fontFamily: 'Consolas'
                },
                innerHTML: helpHTML
            });

            filterdiv.appendChild(helpdiv);
        }
    }

    addFilterUI(parent) {
        const filterDiv = createElement('div', {id: 'floatFilter'});
        parent.appendChild(filterDiv);

        // Add separator
        filterDiv.appendChild(createElement('hr'));

        // Adds filters div
        filterDiv.appendChild(createElement('div', {id: 'floatFilters'}));

        // Adds colour picker
        const colourDiv = createElement('input', {
            id: 'floatFilterColour',
            type: 'color',
            value: '#354908',
            style: {
                float: 'left',
                marginTop: '2px'
            }
        });
        filterDiv.appendChild(colourDiv);

        // Add new filter input box
        const input = createElement('input', {
            id: 'float_expression_filter',
            placeholder: 'Add Float Highlight Filter',
            style: {
                width: '350px',
                marginLeft: '10px'
            }
        });
        input.classList.add('filter_search_box');
        input.addEventListener('keyup', (e) => this.filterKeyPress(e));
        filterDiv.appendChild(input);

        // Add filter help link
        let helpText = createElement('a', {
            innerText: 'ⓘ',
            title: 'Filter Help',
            href: 'javascript:void(0)',
            style: {
                fontSize: '18px',
                marginLeft: '5px'
            }
        });
        helpText.addEventListener('click', (e) => this.onHelpClick(e));
        filterDiv.appendChild(helpText);

        // Add compile status indicator
        const status = createElement('div', {id: 'compileStatus'});
        filterDiv.appendChild(status);

        // Add new filter btn
        const addFilterBtn = createButton('Add Filter', 'green', {
            id: 'addFloatFilter',
            style: {
                display: 'none',
                marginLeft: '10px'
            }
        });
        addFilterBtn.addEventListener('click', (e) => this.addFilter());
        filterDiv.appendChild(addFilterBtn);

        // Compile error div
        const compileError = createElement('div', {id: 'compileError'});
        filterDiv.appendChild(compileError);

        // Add any saved filters
        this.getSavedFilters((savedFilters) => {
            for (let serializedFilter of savedFilters) {
                this.filters.push(Filter.deserialize(serializedFilter, this));
                newFilter.addToUI();
            }
        });
    }

    filterKeyPress() {
        if (this.expressionTimer) clearTimeout(this.expressionTimer);

        this.expressionTimer = setTimeout(() => {
            let input = document.querySelector('#float_expression_filter');
            let compileError = document.querySelector('#compileError');
            let status = document.querySelector('#compileStatus');
            let addFilterBtn = document.querySelector('#addFloatFilter');

            let expression = input.value;

            // try to compile the expression
            try {
                this.tryCompile(expression);
                status.setAttribute('error', 'false');
                status.innerText = '✓';
                compileError.innerText = '';
                addFilterBtn.style.display = '';
            }
            catch (e) {
                status.setAttribute('error', 'true');
                status.innerText = '✗';
                compileError.innerText = e.message;
                addFilterBtn.style.display = 'none';
            }
        }, 250);
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
