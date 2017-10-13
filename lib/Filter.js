import compileExpression from './filtrex';
import {createElement, createButton} from './utils';

export default class Filter {
    constructor(expression, colour, filters) {
        this.expression = expression;
        this.colour = colour;
        this.validExpressionVars = ['float', 'seed', 'minfloat', 'maxfloat'];
        this.filters = filters;

        this.compileExpression();
    }

    static filtrexMatch(str, reg) {
        let thisMatch = str.toString().match(reg);

        if (thisMatch !== null) return thisMatch.length;
        else return 0;
    }

    compileExpression() {
        this.func = compileExpression(this.expression, {match: Filter.filtrexMatch}, this.validExpressionVars);
    }

    onFilterColourChange(e) {
        let colourSwitch = e.target || e.srcElement;

        this.filters.setFilterColour(this, colourSwitch.value);
    }

    addToUI() {
        const parentDiv = document.querySelector('#floatFilters');
        const thisDiv = createElement('div', {innerText: this.expression});

        const colourDiv = createElement('input', {
            type: 'color',
            value: this.colour,
            style: {
                float: 'left',
                marginRight: '10px',
                marginTop: '-3px'
            }
        });
        colourDiv.addEventListener('change', (e) => this.onFilterColourChange(e));
        thisDiv.appendChild(colourDiv);

        // Add remove filter btn
        const removeFilterBtn = createButton('Remove Filter', 'grey', {
            style: {
                marginTop: '-3px',
                float: 'right'
            }
        });

        removeFilterBtn.addEventListener('click', (e) => this.removeFilter(e));
        thisDiv.appendChild(removeFilterBtn);

        // Add line break
        thisDiv.appendChild(createElement('hr'));

        this.div = thisDiv;

        if (parentDiv) {
            parentDiv.appendChild(thisDiv);
        }
    }

    removeFilter() {
        this.filters.removeFilter(this);
    }

    serialize() {
        return {expression: this.expression, colour: this.colour}
    }

    static deserialize(serialized, filters) {
        return new Filter(serialized.expression, serialized.colour, filters);
    }
}
