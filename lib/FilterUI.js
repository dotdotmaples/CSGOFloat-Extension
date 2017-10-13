import {createElement, createButton, helpHTML} from './utils';
import Filter from './Filter';

export default class FilterUI {
    tryCompile(expression) {
        new Filter(expression, '', this);
    }

    addUIToElement(parent) {
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

    onHelpClick() {
        let filterDiv = document.querySelector('#floatFilter');

        let helpDiv = filterDiv.querySelector('#filterHelp');
        if (helpDiv) filterDiv.removeChild(helpDiv);
        else {
            // create it
            helpDiv = createElement('div', {
                id: 'filterHelp',
                style: {
                    fontFamily: 'Consolas'
                },
                innerHTML: helpHTML
            });

            filterDiv.appendChild(helpDiv);
        }
    }
}
