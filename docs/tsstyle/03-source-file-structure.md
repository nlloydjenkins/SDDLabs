# 3 Source file structure {#source-file-structure}

Files consist of the following, **in order**:

1. Copyright information, if present
2. JSDoc with `@fileoverview`, if present
3. Imports, if present
4. The file's implementation

**Exactly one blank line** separates each section that is present.

## 3.1 Copyright information {#file-copyright}

If license or copyright information is necessary in a file, add it in a JSDoc at the top of the file.

## 3.2 `@fileoverview` JSDoc {#fileoverview}

A file may have a top-level `@fileoverview` JSDoc. If present, it may provide a description of the file's content, its uses, or information about its dependencies. Wrapped lines are not indented.

Example:

```ts
// Good:
/**
 * @fileoverview Description of file. Lorem ipsum dolor sit amet, consectetur
 * adipiscing elit, sed do eiusmod tempor incididunt.
 */
```

## 3.3 Imports {#imports}

There are four variants of import statements in ES6 and TypeScript:

| Import type | Example                          | Use for                                                                           |
| ----------- | -------------------------------- | --------------------------------------------------------------------------------- |
| module      | `import * as foo from '...';`    | TypeScript imports                                                                |
| named       | `import {SomeThing} from '...';` | TypeScript imports                                                                |
| default     | `import SomeThing from '...';`   | Only for other external code that requires them                                   |
| side-effect | `import '...';`                  | Only to import libraries for their side-effects on load (such as custom elements) |

```ts
// Good: choose between two options as appropriate (see below).
import * as ng from "@angular/core";
import { Foo } from "./foo";

// Only when needed: default imports.
import Button from "Button";

// Sometimes needed to import libraries for their side effects:
import "jasmine";
import "@polymer/paper-button";
```

### 3.3.1 Import paths {#import-paths}

TypeScript code _must_ use paths to import other TypeScript code. Paths _may_ be relative, i.e. starting with `.` or `..`, or rooted at the base directory, e.g. `root/path/to/file`.

Code _should_ use relative imports (`./foo`) rather than absolute imports `path/to/foo` when referring to files within the same (logical) project as this allows to move the project around without introducing changes in these imports.

Consider limiting the number of parent steps (`../../../`) as those can make module and path structures hard to understand.

```ts
// Good:
import { Symbol1 } from "path/from/root";
import { Symbol2 } from "../parent/file";
import { Symbol3 } from "./sibling";
```

### 3.3.2 Namespace versus named imports {#namespace-versus-named-imports}

Both namespace and named imports can be used.

Prefer named imports for symbols used frequently in a file or for symbols that have clear names, for example Jasmine's `describe` and `it`. Named imports can be aliased to clearer names as needed with `as`.

Prefer namespace imports when using many different symbols from large APIs. A namespace import, despite using the `*` character, is not comparable to a "wildcard" import as seen in other languages. Instead, namespace imports give a name to all the exports of a module, and each exported symbol from the module becomes a property on the module name. Namespace imports can aid readability for exported symbols that have common names like `Model` or `Controller` without the need to declare aliases.

```ts
// Bad: overlong import statement of needlessly namespaced names.
import {
  Item as TableviewItem,
  Header as TableviewHeader,
  Row as TableviewRow,
  Model as TableviewModel,
  Renderer as TableviewRenderer,
} from "./tableview";

let item: TableviewItem | undefined;
```

```ts
// Good: use the module for namespacing.
import * as tableview from "./tableview";

let item: tableview.Item | undefined;
```

```ts
// Bad: The module name does not improve readability.
import * as testing from "./testing";

testing.describe("foo", () => {
  testing.it("bar", () => {
    testing.expect(null).toBeNull();
    testing.expect(undefined).toBeUndefined();
  });
});
```

```ts
// Good: give local names for these common functions.
import { describe, it, expect } from "./testing";

describe("foo", () => {
  it("bar", () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
  });
});
```

#### 3.3.2.1 Special case: Apps JSPB protos {#jspb-import-by-path}

Apps JSPB protos must use named imports, even when it leads to long import lines.

This rule exists to aid in build performance and dead code elimination since often `.proto` files contain many `message`s that are not all needed together. By leveraging destructured imports the build system can create finer grained dependencies on Apps JSPB messages while preserving the ergonomics of path based imports.

```ts
// Good: import the exact set of symbols you need from the proto file.
import {Foo, Bar} from './foo.proto';

function copyFooBar(foo: Foo, bar: Bar) {...}
```

### 3.3.3 Renaming imports {#renaming-imports}

Code _should_ fix name collisions by using a namespace import or renaming the exports themselves. Code _may_ rename imports (`import {SomeThing as SomeOtherThing}`) if needed.

Three examples where renaming can be helpful:

1. If it's necessary to avoid collisions with other imported symbols.
2. If the imported symbol name is generated.
3. If importing symbols whose names are unclear by themselves, renaming can improve code clarity. For example, when using RxJS the `from` function might be more readable when renamed to `observableFrom`.

## 3.4 Exports {#exports}

Use named exports in all code:

```ts
// Good: Use named exports:
export class Foo { ... }
```

Do not use default exports. This ensures that all imports follow a uniform pattern.

```ts
// Bad: Do not use default exports:
export default class Foo { ... } // BAD!
```

<details>
<summary>Why?</summary>

Default exports provide no canonical name, which makes central maintenance difficult with relatively little benefit to code owners, including potentially decreased readability:

```ts
// Bad:
import Foo from "./bar"; // Legal.
import Bar from "./bar"; // Also legal.
```

Named exports have the benefit of erroring when import statements try to import something that hasn't been declared. In `foo.ts`:

```ts
// Bad:
const foo = "blah";
export default foo;
```

And in `bar.ts`:

```ts
// Bad:
import { fizz } from "./foo";
```

Results in `error TS2614: Module '"./foo"' has no exported member 'fizz'.` While `bar.ts`:

```ts
// Bad:
import fizz from "./foo";
```

Results in `fizz === foo`, which is probably unexpected and difficult to debug.

Additionally, default exports encourage people to put everything into one big object to namespace it all together:

```ts
// Bad:
export default class Foo {
  static SOME_CONSTANT = ...
  static someHelpfulFunction() { ... }
  ...
}
```

With the above pattern, we have file scope, which can be used as a namespace. We also have a perhaps needless second scope (the class `Foo`) that can be ambiguously used as both a type and a value in other files.

Instead, prefer use of file scope for namespacing, as well as named exports:

```ts
// Good:
export const SOME_CONSTANT = ...
export function someHelpfulFunction()
export class Foo {
  // only class stuff here
}
```

</details>

### 3.4.1 Export visibility {#export-visibility}

TypeScript does not support restricting the visibility for exported symbols. Only export symbols that are used outside of the module. Generally minimize the exported API surface of modules.

### 3.4.2 Mutable exports {#mutable-exports}

Regardless of technical support, mutable exports can create hard to understand and debug code, in particular with re-exports across multiple modules. One way to paraphrase this style point is that `export let` is not allowed.

```ts
// Bad:
export let foo = 3;
// In pure ES6, foo is mutable and importers will observe the value change after a second.
// In TS, if foo is re-exported by a second file, importers will not see the value change.
window.setTimeout(() => {
  foo = 4;
}, 1000 /* ms */);
```

If one needs to support externally accessible and mutable bindings, they _should_ instead use explicit getter functions.

```ts
// Good:
let foo = 3;
window.setTimeout(() => {
  foo = 4;
}, 1000 /* ms */);
// Use an explicit getter to access the mutable export.
export function getFoo() {
  return foo;
}
```

For the common pattern of conditionally exporting either of two values, first do the conditional check, then the export. Make sure that all exports are final after the module's body has executed.

```ts
// Good:
function pickApi() {
  if (useOtherApi()) return OtherApi;
  return RegularApi;
}
export const SomeApi = pickApi();
```

### 3.4.3 Container classes {#container-classes}

Do not create container classes with static methods or properties for the sake of namespacing.

```ts
// Bad:
export class Container {
  static FOO = 1;
  static bar() {
    return 1;
  }
}
```

Instead, export individual constants and functions:

```ts
// Good:
export const FOO = 1;
export function bar() {
  return 1;
}
```

## 3.5 Import and export type {#import-export-type}

### 3.5.1 Import type {#import-type}

You may use `import type {...}` when you use the imported symbol only as a type. Use regular imports for values:

```ts
// Good:
import type { Foo } from "./foo";
import { Bar } from "./foo";

import { type Foo, Bar } from "./foo";
```

<details>
<summary>Why?</summary>

The TypeScript compiler automatically handles the distinction and does not insert runtime loads for type references. So why annotate type imports?

The TypeScript compiler can run in 2 modes:

- In development mode, we typically want quick iteration loops. The compiler transpiles to JavaScript without full type information. This is much faster, but requires `import type` in certain cases.
- In production mode, we want correctness. The compiler type checks everything and ensures `import type` is used correctly.

Note: If you need to force a runtime load for side effects, use `import '...';`.

</details>

### 3.5.2 Export type {#export-type}

Use `export type` when re-exporting a type, e.g.:

```ts
// Good:
export type { AnInterface } from "./foo";
```

<details>
<summary>Why?</summary>

`export type` is useful to allow type re-exports in file-by-file transpilation. See [`isolatedModules` docs](https://www.typescriptlang.org/tsconfig#exports-of-non-value-identifiers).

`export type` might also seem useful to avoid ever exporting a value symbol for an API. However it does not give guarantees, either: downstream code might still import an API through a different path. A better way to split & guarantee type vs value usages of an API is to actually split the symbols into e.g. `UserService` and `AjaxUserService`. This is less error prone and also better communicates intent.

</details>

### 3.5.3 Use modules not namespaces {#use-modules-not-namespaces}

TypeScript supports two methods to organize code: _namespaces_ and _modules_, but namespaces are disallowed. That is, your code _must_ refer to code in other files using imports and exports of the form `import {foo} from 'bar';`

Your code _must not_ use the `namespace Foo { ... }` construct. `namespace`s _may_ only be used when required to interface with external, third party code. To semantically namespace your code, use separate files.

Code _must not_ use `require` (as in `import x = require('...');`) for imports. Use ES6 module syntax.

```ts
// Bad: do not use namespaces:
namespace Rocket {
  function launch() { ... }
}

// Bad: do not use <reference>
/// <reference path="..."/>

// Bad: do not use require()
import x = require('mydep');
```

> NB: TypeScript `namespace`s used to be called internal modules and used to use the `module` keyword in the form `module Foo { ... }`. Don't use that either. Always use ES6 imports.
