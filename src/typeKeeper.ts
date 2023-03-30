/* eslint-disable @typescript-eslint/no-explicit-any */
type Type =
    | 'Array'
    | 'Object'
    | 'String'
    | 'Date'
    | 'RegExp'
    | 'Function'
    | 'Boolean'
    | 'Number'
    | 'Null'
    | 'Undefined';

export type MethodKeys = `is${Type | 'NaN'}`;

function isType<T extends Type>(
    elem: unknown,
    type: T
): elem is T extends 'Null'
    ? null
    : T extends 'Undefined'
    ? undefined
    : T extends 'Array'
    ? any[]
    : T extends 'Object'
    ? Record<string, any>
    : T extends 'Function'
    ? (...args: any[]) => any
    : Exclude<T, 'Array' | 'Object' | 'Function'> extends never
    ? never
    : unknown {
    return Object.prototype.toString.call(elem) === `[object ${type}]`;
}

export const typeKeeper = {
    isArray: <T extends any = any>(elem: unknown, check?: (value: unknown) => value is T): elem is T[] =>
        isType(elem, 'Array') && (!check || elem.every(check)),
    isObject: <T extends any = any>(elem: unknown, check?: (value: unknown) => value is T): elem is T =>
        isType(elem, 'Object') && (!check || check(elem)),
    isString: (elem: unknown): elem is string => isType(elem, 'String'),
    isDate: (elem: unknown): elem is Date => isType(elem, 'Date'),
    isRegExp: (elem: unknown): elem is RegExp => isType(elem, 'RegExp'),
    isFunction: (elem: unknown): elem is (...args: any[]) => any => isType(elem, 'Function'),
    isBoolean: (elem: unknown): elem is boolean => isType(elem, 'Boolean'),
    isNumber: (elem: unknown): elem is number => isType(elem, 'Number'),
    isNull: (elem: unknown): elem is null => isType(elem, 'Null'),
    isUndefined: (elem: unknown): elem is undefined => isType(elem, 'Undefined'),
    isNaN: (elem: unknown): elem is typeof NaN => isType(elem, 'Number') && elem !== elem,
};
