# 4.1 Local Variable Declarations {#local-variable-declarations}

## 4.1.1 Use const and let {#use-const-and-let}

Always use `const` or `let` to declare variables. Use `const` by default, unless a variable needs to be reassigned. Never use `var`.

```ts
// Good:
const foo = otherValue; // Use if "foo" never changes.
let bar = someValue; // Use if "bar" is ever assigned into later on.
```

`const` and `let` are block scoped, like variables in most other languages. `var` in JavaScript is function scoped, which can cause difficult to understand bugs. Don't use it.

```ts
// Bad:
var foo = someValue; // Don't use - var scoping is complex and causes bugs.
```

Variables _must not_ be used before their declaration.

## 4.1.2 One variable per declaration {#one-variable-per-declaration}

Every local variable declaration declares only one variable: declarations such as `let a = 1, b = 2;` are not used.
