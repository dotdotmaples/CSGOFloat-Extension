import test from 'ava';
import {Filter} from '../lib/filters';

test(t => {
    const filter = new Filter('1 < 2');
    t.is(filter.expression, 'aaa');
    t.is('aaa', 'aaa');
});
