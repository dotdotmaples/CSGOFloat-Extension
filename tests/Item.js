import test from 'ava';
import Item from '../lib/Item';

test('Item attributes are properly defined', t => {
    const item = new Item('1234', 'steam://test');

    t.is(item.listingId, '1234');
    t.is(item.inspectLink, 'steam://test');
});

test('Item can add info later on', t => {
    const item = new Item('1234', 'steam://test');

    t.false(item.hasItemInfo());

    const itemInfo = {float: 1.23};

    item.addItemInfo(itemInfo);

    t.is(item.iteminfo, itemInfo);
});

test('Item returns proper environment vars', t => {
    const item = new Item('1234', 'steam://test');

    t.is(item.filterVars, undefined);

    const itemInfo = {floatvalue: 0.10, paintseed: 123, min: 0, max: 1};

    item.addItemInfo(itemInfo);

    t.deepEqual(item.filterVars, {
        float: 0.10,
        seed: 123,
        minfloat: 0,
        maxfloat: 1
    });
});
