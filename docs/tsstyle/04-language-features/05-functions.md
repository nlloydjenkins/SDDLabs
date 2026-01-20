# 4.5 Functions {#functions}

## 4.5.1 Terminology {#terminology}

There are many different types of functions, with subtle distinctions between them. This guide uses the following terminology, which aligns with [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions):

- "function declaration": a declaration (i.e. not an expression) using the `function` keyword
- "function expression": an expression, typically used in an assignment or passed as a parameter, using the `function` keyword
- "arrow function": an expression using the `=>` syntax
- "block body": right hand side of an arrow function with braces
- "concise body": right hand side of an arrow function without braces

Methods and classes/constructors are not covered in this section.

## 4.5.2 Prefer function declarations for named functions {#function-declarations}

Prefer function declarations over arrow functions or function expressions when defining named functions.

```ts
// Good:
function foo() {
  return 42;
}
```

```ts
// Bad:
const foo = () => 42;
```

Arrow functions _may_ be used, for example, when an explicit type annotation is required.

```ts
// Good:
interface SearchFunction {
  (source: string, subString: string): boolean;
}

const fooSearch: SearchFunction = (source, subString) => { ... };
```

## 4.5.3 Nested functions {#nested-functions}

Functions nested within other methods or functions _may_ use function declarations or arrow functions, as appropriate. In method bodies in particular, arrow functions are preferred because they have access to the outer `this`.

## 4.5.4 Do not use function expressions {#function-expressions}

Do not use function expressions. Use arrow functions instead.

```ts
// Good:
bar(() => {
  this.doSomething();
});
```

```ts
// Bad:
bar(function() { ... })
```

**Exception:** Function expressions _may_ be used _only if_ code has to dynamically rebind `this` (but this is [discouraged](#rebinding-this)), or for generator functions (which do not have an arrow syntax).

## 4.5.5 Arrow function bodies {#arrow-function-bodies}

Use arrow functions with concise bodies (i.e. expressions) or block bodies as appropriate.

```ts
// Good:
// Top level functions use function declarations.
function someFunction() {
  // Block bodies are fine:
  const receipts = books.map((b: Book) => {
    const receipt = payMoney(b.price);
    recordTransaction(receipt);
    return receipt;
  });

  // Concise bodies are fine, too, if the return value is used:
  const longThings = myValues
    .filter((v) => v.length > 1000)
    .map((v) => String(v));

  function payMoney(amount: number) {
    // function declarations are fine, but must not access `this`.
  }

  // Nested arrow functions may be assigned to a const.
  const computeTax = (amount: number) => amount * 0.12;
}
```

Only use a concise body if the return value of the function is actually used. The block body makes sure the return type is `void` then and prevents potential side effects.

```ts
// Bad:
// BAD: use a block body if the return value of the function is not used.
myPromise.then((v) => console.log(v));
// BAD: this typechecks, but the return value still leaks.
let f: () => void;
f = () => 1;
```

```ts
// Good:
// GOOD: return value is unused, use a block body.
myPromise.then((v) => {
  console.log(v);
});
// GOOD: code may use blocks for readability.
const transformed = [1, 2, 3].map((v) => {
  const intermediate = someComplicatedExpr(v);
  const more = acrossManyLines(intermediate);
  return worthWrapping(more);
});
// GOOD: explicit `void` ensures no leaked return value
myPromise.then((v) => void console.log(v));
```

> **Tip:** The `void` operator can be used to ensure an arrow function with an expression body returns `undefined` when the result is unused.

## 4.5.6 Rebinding `this` {#rebinding-this}

Function expressions and function declarations _must not_ use `this` unless they specifically exist to rebind the `this` pointer. Rebinding `this` can in most cases be avoided by using arrow functions or explicit parameters.

```ts
// Bad:
function clickHandler() {
  // Bad: what's `this` in this context?
  this.textContent = "Hello";
}
// Bad: the `this` pointer reference is implicitly set to document.body.
document.body.onclick = clickHandler;
```

```ts
// Good:
// Good: explicitly reference the object from an arrow function.
document.body.onclick = () => {
  document.body.textContent = "hello";
};
// Alternatively: take an explicit parameter
const setTextFn = (e: HTMLElement) => {
  e.textContent = "hello";
};
document.body.onclick = setTextFn.bind(null, document.body);
```

Prefer arrow functions over other approaches to binding `this`, such as `f.bind(this)`, `goog.bind(f, this)`, or `const self = this`.

## 4.5.7 Prefer passing arrow functions as callbacks {#functions-as-callbacks}

Callbacks can be invoked with unexpected arguments that can pass a type check but still result in logical errors.

Avoid passing a named callback to a higher-order function, unless you are sure of the stability of both functions' call signatures. Beware, in particular, of less-commonly-used optional parameters.

```ts
// Bad:
// BAD: Arguments are not explicitly passed, leading to unintended behavior
// when the optional `radix` argument gets the array indices 0, 1, and 2.
const numbers = ["11", "5", "10"].map(parseInt);
// > [11, NaN, 2];
```

Instead, prefer passing an arrow-function that explicitly forwards parameters to the named callback.

```ts
// Good:
// GOOD: Arguments are explicitly passed to the callback
const numbers = ["11", "5", "3"].map((n) => parseInt(n));
// > [11, 5, 3]

// GOOD: Function is locally defined and is designed to be used as a callback
function dayFilter(element: string | null | undefined) {
  return element != null && element.endsWith("day");
}

const days = ["tuesday", undefined, "juice", "wednesday"].filter(dayFilter);
```

## 4.5.8 Arrow functions as properties {#arrow-functions-as-properties}

Classes usually _should not_ contain properties initialized to arrow functions. Arrow function properties require the calling function to understand that the callee's `this` is already bound, which increases confusion about what `this` is, and call sites and references using such handlers look broken (i.e. require non-local knowledge to determine that they are correct). Code _should_ always use arrow functions to call instance methods (`const handler = (x) => { this.listener(x); };`), and _should not_ obtain or pass references to instance methods (~~`const handler = this.listener; handler(x);`~~).

> **Note:** in some specific situations, e.g. when binding functions in a template, arrow functions as properties are useful and create much more readable code. Use judgement with this rule. Also, see the [Event Handlers](#event-handlers) section below.

```ts
// Bad:
class DelayHandler {
  constructor() {
    // Problem: `this` is not preserved in the callback. `this` in the callback
    // will not be an instance of DelayHandler.
    setTimeout(this.patienceTracker, 5000);
  }
  private patienceTracker() {
    this.waitedPatiently = true;
  }
}
```

```ts
// Bad:
// Arrow functions usually should not be properties.
class DelayHandler {
  constructor() {
    // Bad: this code looks like it forgot to bind `this`.
    setTimeout(this.patienceTracker, 5000);
  }
  private patienceTracker = () => {
    this.waitedPatiently = true;
  };
}
```

```ts
// Good:
// Explicitly manage `this` at call time.
class DelayHandler {
  constructor() {
    // Use anonymous functions if possible.
    setTimeout(() => {
      this.patienceTracker();
    }, 5000);
  }
  private patienceTracker() {
    this.waitedPatiently = true;
  }
}
```

## 4.5.9 Event handlers {#event-handlers}

Event handlers _may_ use arrow functions when there is no need to uninstall the handler (for example, if the event is emitted by the class itself). If the handler requires uninstallation, arrow function properties are the right approach, because they automatically capture `this` and provide a stable reference to uninstall.

```ts
// Good:
// Event handlers may be anonymous functions or arrow function properties.
class Component {
  onAttached() {
    // The event is emitted by this class, no need to uninstall.
    this.addEventListener("click", () => {
      this.listener();
    });
    // this.listener is a stable reference, we can uninstall it later.
    window.addEventListener("onbeforeunload", this.listener);
  }
  onDetached() {
    // The event is emitted by window. If we don't uninstall, this.listener will
    // keep a reference to `this` because it's bound, causing a memory leak.
    window.removeEventListener("onbeforeunload", this.listener);
  }
  // An arrow function stored in a property is bound to `this` automatically.
  private listener = () => {
    confirm("Do you want to exit the page?");
  };
}
```

Do not use `bind` in the expression that installs an event handler, because it creates a temporary reference that can't be uninstalled.

```ts
// Bad:
// Binding listeners creates a temporary reference that prevents uninstalling.
class Component {
  onAttached() {
    // This creates a temporary reference that we won't be able to uninstall
    window.addEventListener("onbeforeunload", this.listener.bind(this));
  }
  onDetached() {
    // This bind creates a different reference, so this line does nothing.
    window.removeEventListener("onbeforeunload", this.listener.bind(this));
  }
  private listener() {
    confirm("Do you want to exit the page?");
  }
}
```

## 4.5.10 Parameter initializers {#parameter-initializers}

Optional function parameters _may_ be given a default initializer to use when the argument is omitted. Initializers _must not_ have any observable side effects. Initializers _should_ be kept as simple as possible.

```ts
// Good:
function process(name: string, extraContext: string[] = []) {}
function activate(index = 0) {}
```

```ts
// Bad:
// BAD: side effect of incrementing the counter
let globalCounter = 0;
function newId(index = globalCounter++) {}

// BAD: exposes shared mutable state, which can introduce unintended coupling
// between function calls
class Foo {
  private readonly defaultPaths: string[];
  frobnicate(paths = defaultPaths) {}
}
```

Use default parameters sparingly. Prefer [destructuring](#object-destructuring) to create readable APIs when there are more than a small handful of optional parameters that do not have a natural order.

## 4.5.11 Prefer rest and spread when appropriate {#rest-and-spread}

Use a _rest_ parameter instead of accessing `arguments`. Never name a local variable or parameter `arguments`, which confusingly shadows the built-in name.

```ts
// Good:
function variadic(array: string[], ...numbers: number[]) {}
```

Use function spread syntax instead of `Function.prototype.apply`.

## 4.5.12 Formatting functions {#formatting-functions}

Blank lines at the start or end of the function body are not allowed.

A single blank line _may_ be used within function bodies sparingly to create _logical groupings_ of statements.

Generators should attach the `*` to the `function` and `yield` keywords, as in `function* foo()` and `yield* iter`, rather than ~~`function *foo()`~~ or ~~`yield *iter`~~.

Parentheses around the left-hand side of a single-argument arrow function are recommended but not required.

Do not put a space after the `...` in rest or spread syntax.

```ts
// Good:
function myFunction(...elements: number[]) {}
myFunction(...array, ...iterable, ...generator());
```
