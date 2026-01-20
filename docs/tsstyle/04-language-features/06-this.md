# 4.6 this {#features-this}

Only use `this` in class constructors and methods, functions that have an explicit `this` type declared (e.g. `function func(this: ThisType, ...)`), or in arrow functions defined in a scope where `this` may be used.

Never use `this` to refer to the global object, the context of an `eval`, the target of an event, or unnecessarily `call()`ed or `apply()`ed functions.

```ts
// Bad:
this.alert("Hello");
```
