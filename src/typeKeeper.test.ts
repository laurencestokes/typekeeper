import { typeKeeper, MethodKeys } from './typeKeeper';

describe('typeKeeper', () => {
    const testCases: Array<[unknown, string, boolean]> = [
        [123, 'Number', true],
        ['hello', 'String', true],
        [null, 'Null', true],
        [undefined, 'Undefined', true],
        [{}, 'Object', true],
        [[], 'Array', true],
        [new Date(), 'Date', true],
        [/regex/, 'RegExp', true],
        [() => null, 'Function', true],
        [true, 'Boolean', true],
        [NaN, 'NaN', true],
        ['hello', 'Array', false],
        [123, 'String', false],
        [null, 'Object', false],
        [undefined, 'Null', false],
        [{}, 'Array', false],
        [[], 'Object', false],
        [new Date(), 'RegExp', false],
        [/regex/, 'Date', false],
        [() => null, 'Boolean', false],
        [true, 'Function', false],
        [NaN, 'String', false],
    ];

    testCases.forEach(([value, type, expected]) => {
        it(`typeKeeper.is${type} should return ${expected.toString()} for ${value as string} with type ${type}`, () => {
            expect(typeKeeper[`is${type}` as MethodKeys](value)).toBe(expected);
        });
    });
});
