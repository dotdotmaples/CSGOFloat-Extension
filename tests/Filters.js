import test from 'ava';
import Filters from '../lib/Filters';
import Item from '../lib/Item';

test('Can add filters', t => {
    const filters = new Filters();

    filters.addFilter('1 < 2', '#123456');

    t.is(filters.filters.length, 1);
    t.is(filters.filters[0].expression, '1 < 2');
    t.is(filters.filters[0].colour, '#123456');
});

test('Can set filter colour', t => {
    const filters = new Filters();

    filters.addFilter('1 < 2', '#123456');

    const filter = filters.filters[0];
    t.is(filter.colour, '#123456');

    filters.setFilterColour(filter, '#111111');
    t.is(filter.colour, '#111111');
});

test('Can remove filter', t => {
    const filters = new Filters();

    filters.addFilter('1 < 2', '#123456');

    const filter = filters.filters[0];
    filters.removeFilter(filter);

    t.is(filters.filters.length, 0);
});

test('Generates proper matching colour', t => {
    const filters = new Filters();

    filters.addFilter('float < 0.2', '#111111');

    const item = new Item('1234', 'steam://test');
    const itemInfo = {floatvalue: 0.10, paintseed: 123, min: 0, max: 1};
    item.addItemInfo(itemInfo);

    t.is(filters.getMatchColour(item.filterVars), '#111111');
});
