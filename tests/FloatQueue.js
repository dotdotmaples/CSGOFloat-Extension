import test from 'ava';
import FloatQueue from '../lib/FloatQueue';
import Item from '../lib/Item';

test('Item gets processed by queue', t => {
    const queue = new FloatQueue();
    const item = new Item('1234', 'steam://test');

    t.plan(1);

    queue.process((processItem) => {
        t.is(processItem, item);
        return Promise.resolve();
    });

    queue.addItem(item);
});

test('Multiple items get processed by queue', async t => {
    const queue = new FloatQueue();
    const item = new Item('1234', 'steam://test');
    const item2 = new Item('5678', 'steam://newteest');

    t.plan(2);

    queue.process((processItem) => {
        return new Promise((resolve, reject) => {
            t.pass();
            resolve();
        });
    });

    queue.addItem(item);
    queue.addItem(item2);
});

