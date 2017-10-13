import test from 'ava';
import ItemInfo from '../lib/ItemInfo';
import Item from '../lib/Item';

test('Can Add Item', t => {
    const item = new Item('123456', 'steam://test');
    item.addItemInfo({float: 1});

    const itemInfo = new ItemInfo();

    t.false(itemInfo.hasItem(item));

    itemInfo.addItem(item);

    t.true(itemInfo.hasItem(item));
});

test('Cannot Add Item Without Iteminfo', t => {
    const item = new Item('123456', 'steam://test');
    const itemInfo = new ItemInfo();

    t.throws(() => itemInfo.addItem(item), Error);
});

test('Can Get Info for Item', t => {
    const item = new Item('123456', 'steam://test');
    item.addItemInfo({float: 1});

    const itemInfo = new ItemInfo();
    itemInfo.addItem(item);

    t.deepEqual(itemInfo.getItemInfo(item), {float: 1});
    t.is(itemInfo.getItemForId(item.listingId), item);
    t.deepEqual(itemInfo.getInfo(item.listingId), {float: 1});
});
