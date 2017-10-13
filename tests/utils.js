import test from 'ava';
import {rgbToHex, hexToRgb, createElement} from '../lib/utils';

test('Convert RGB to Hex', t => {
    t.is(rgbToHex([10, 10, 10]), '#0a0a0a');
    t.is(rgbToHex([10, 10, 200]), '#0a0ac8');
    t.is(rgbToHex([0, 255, 0]), '#00ff00');
});

test('Convert Hex to RGB', t => {
    t.deepEqual(hexToRgb('#0a0a0a'), [10, 10, 10]);
    t.deepEqual(hexToRgb('#0a0ac8'), [10, 10, 200]);
    t.deepEqual(hexToRgb('#00ff00'), [0, 255, 0]);
});

test('Create element shallow properties', t => {
    const e = createElement('div', {id: 'test', name: 'hello'});
    t.is(e.id, 'test');
    t.is(e.name, 'hello');
});

test('Create element deep properties', t => {
    const e = createElement('div', {style: {float: 'left', marginLeft: '10px'}});
    t.is(e.style.float, 'left');
    t.is(e.style.marginLeft, '10px');
});
