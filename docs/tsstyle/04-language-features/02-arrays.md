# 4.2 Array Literals {#array-literals}

## 4.2.1 Do not use the `Array` constructor {#array-constructor}

_Do not_ use the `Array()` constructor, with or without `new`. It has confusing and contradictory usage:

```ts
// Bad:
const a = new Array(2); // [undefined, undefined]
const b = new Array(2, 3); // [2, 3];
```

Instead, always use bracket notation to initialize arrays, or `from` to initialize an `Array` with a certain size:

```ts
// Good:
const a = [2];
const b = [2, 3];

// Equivalent to Array(2):
const c = [];
c.length = 2;

// [0, 0, 0, 0, 0]
Array.from<number>({ length: 5 }).fill(0);
```

## 4.2.2 Do not define properties on arrays {#do-not-define-properties-on-arrays}

Do not define or use non-numeric properties on an array (other than `length`). Use a `Map` (or `Object`) instead.

## 4.2.3 Using spread syntax {#array-spread-syntax}

Using spread syntax `[...foo];` is a convenient shorthand for shallow-copying or concatenating iterables.

```ts
// Good:
const foo = [1];

const foo2 = [...foo, 6, 7];

const foo3 = [5, ...foo];

foo2[1] === 6;
foo3[1] === 1;
```

When using spread syntax, the value being spread _must_ match what is being created. When creating an array, only spread iterables. Primitives (including `null` and `undefined`) _must not_ be spread.

```ts
// Bad:
const foo = [7];
const bar = [5, ...(shouldUseFoo && foo)]; // might be undefined

// Creates {0: 'a', 1: 'b', 2: 'c'} but has no length
const fooStrings = ["a", "b", "c"];
const ids = { ...fooStrings };
```

```ts
// Good:
const foo = shouldUseFoo ? [7] : [];
const bar = [5, ...foo];
const fooStrings = ["a", "b", "c"];
const ids = [...fooStrings, "d", "e"];
```

## 4.2.4 Array destructuring {#array-destructuring}

Array literals may be used on the left-hand side of an assignment to perform destructuring (such as when unpacking multiple values from a single array or iterable). A final "rest" element may be included (with no space between the `...` and the variable name). Elements should be omitted if they are unused.

```ts
// Good:
const [a, b, c, ...rest] = generateResults();
let [, b, , d] = someArray;
```

Destructuring may also be used for function parameters. Always specify `[]` as the default value if a destructured array parameter is optional, and provide default values on the left hand side:

```ts
// Good:
function destructured([a = 4, b = 2] = []) { … }
```

Disallowed:

```ts
// Bad:
function badDestructuring([a, b] = [4, 2]) { … }
```

> **Tip:** For (un)packing multiple values into a function's parameter or return, prefer object destructuring to array destructuring when possible, as it allows naming the individual elements and specifying a different type for each.
