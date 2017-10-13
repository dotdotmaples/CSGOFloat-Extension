import test from 'ava';
import Filter from '../lib/Filter';

test(t => {
    const filter = new Filter('1 < 2');
    t.is(filter.expression, '1 < 2');
    t.is('aaa', 'aaa');
});
