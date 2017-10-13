import test from 'ava';
import Filter from '../lib/Filter';

test('Filter Attributes Set Properly', t => {
    const filter = new Filter('1 < 2', '#123456');
    t.is(filter.expression, '1 < 2');
    t.is(filter.colour, '#123456');
});

test('Filter Expression Compilation Fail', t => {
    t.throws(() => new Filter('abcdef', '#123456'), Error);
});

test('Ensure Expression Vars Work in Compilation', t => {
    const filter = new Filter('float < 0.2 and seed == 200', '#123456');
    t.pass();
});

test('Whether Filter Deserialization Works', t => {
    const expression = '1 < 2';
    const colour = '#12346';

    const filter = Filter.deserialize({expression, colour});
    t.is(filter.expression, expression);
    t.is(filter.colour, colour);
});
