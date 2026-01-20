# 4 Language features {#language-features}

This section delineates which features may or may not be used, and any additional constraints on their use.

Language features which are not discussed in this style guide _may_ be used with no recommendations of their usage.

---

## Table of Contents

1. [Local variable declarations](./01-local-variables.md)

   - [Use const and let](./01-local-variables.md#use-const-and-let)
   - [One variable per declaration](./01-local-variables.md#one-variable-per-declaration)

2. [Array literals](./02-arrays.md)

   - [Do not use the Array constructor](./02-arrays.md#array-constructor)
   - [Do not define properties on arrays](./02-arrays.md#do-not-define-properties-on-arrays)
   - [Using spread syntax](./02-arrays.md#array-spread-syntax)
   - [Array destructuring](./02-arrays.md#array-destructuring)

3. [Object literals](./03-objects.md)

   - [Do not use the Object constructor](./03-objects.md#object-constructor)
   - [Iterating objects](./03-objects.md#iterating-objects)
   - [Using spread syntax](./03-objects.md#object-spread-syntax)
   - [Computed property names](./03-objects.md#computed-property-names)
   - [Object destructuring](./03-objects.md#object-destructuring)

4. [Classes](./04-classes.md)

   - [Class declarations](./04-classes.md#class-declarations)
   - [Class method declarations](./04-classes.md#class-method-declarations)
   - [Static methods](./04-classes.md#static-methods)
   - [Constructors](./04-classes.md#constructors)
   - [Class members](./04-classes.md#class-members)
   - [Visibility](./04-classes.md#visibility)
   - [Disallowed class patterns](./04-classes.md#disallowed-class-patterns)

5. [Functions](./05-functions.md)

   - [Terminology](./05-functions.md#terminology)
   - [Prefer function declarations](./05-functions.md#function-declarations)
   - [Nested functions](./05-functions.md#nested-functions)
   - [Do not use function expressions](./05-functions.md#function-expressions)
   - [Arrow function bodies](./05-functions.md#arrow-function-bodies)
   - [Rebinding this](./05-functions.md#rebinding-this)
   - [Arrow functions as callbacks](./05-functions.md#functions-as-callbacks)
   - [Arrow functions as properties](./05-functions.md#arrow-functions-as-properties)
   - [Event handlers](./05-functions.md#event-handlers)
   - [Parameter initializers](./05-functions.md#parameter-initializers)
   - [Rest and spread](./05-functions.md#rest-and-spread)
   - [Formatting functions](./05-functions.md#formatting-functions)

6. [this](./06-this.md)

7. [Interfaces](./07-interfaces.md)

8. [Primitive literals](./08-primitives.md)

   - [String literals](./08-primitives.md#string-literals)
   - [Number literals](./08-primitives.md#number-literals)
   - [Type coercion](./08-primitives.md#type-coercion)

9. [Control structures](./09-control-structures.md)

   - [Control flow statements and blocks](./09-control-structures.md#control-flow-statements-blocks)
   - [Grouping parentheses](./09-control-structures.md#grouping-parentheses)
   - [Exception handling](./09-control-structures.md#exception-handling)
   - [Switch statements](./09-control-structures.md#switch-statements)
   - [Equality checks](./09-control-structures.md#equality-checks)
   - [Type and non-nullability assertions](./09-control-structures.md#type-and-non-nullability-assertions)
   - [Keep try blocks focused](./09-control-structures.md#keep-try-blocks-focused)

10. [Decorators](./10-decorators.md)

11. [Disallowed features](./11-disallowed-features.md)
    - [Wrapper objects for primitive types](./11-disallowed-features.md#primitive-types-wrapper-classes)
    - [Automatic Semicolon Insertion](./11-disallowed-features.md#automatic-semicolon-insertion)
    - [Const enums](./11-disallowed-features.md#enums)
    - [Debugger statements](./11-disallowed-features.md#debugger-statements)
    - [with](./11-disallowed-features.md#disallowed-features-with)
    - [Dynamic code evaluation](./11-disallowed-features.md#dynamic-code-evaluation)
    - [Non-standard features](./11-disallowed-features.md#non-standard-features)
    - [Modifying builtin objects](./11-disallowed-features.md#modifying-builtin-objects)
