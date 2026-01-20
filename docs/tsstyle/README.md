# My TypeScript Style Guide

This guide is based on my TypeScript style guide.

There is no automatic deployment process for this version as it's pushed on-demand by volunteers.

---

## Table of Contents

1. [Introduction](./01-introduction.md)

   - [Terminology notes](./01-introduction.md#terminology-notes)
   - [Guide notes](./01-introduction.md#guide-notes)

2. [Source file basics](./02-source-file-basics.md)

   - [File encoding: UTF-8](./02-source-file-basics.md#file-encoding-utf-8)

3. [Source file structure](./03-source-file-structure.md)

   - [Copyright information](./03-source-file-structure.md#file-copyright)
   - [@fileoverview JSDoc](./03-source-file-structure.md#fileoverview)
   - [Imports](./03-source-file-structure.md#imports)
   - [Exports](./03-source-file-structure.md#exports)
   - [Import and export type](./03-source-file-structure.md#import-export-type)

4. [Language features](./04-language-features/README.md)

   - [Local variable declarations](./04-language-features/01-local-variables.md)
   - [Array literals](./04-language-features/02-arrays.md)
   - [Object literals](./04-language-features/03-objects.md)
   - [Classes](./04-language-features/04-classes.md)
   - [Functions](./04-language-features/05-functions.md)
   - [this](./04-language-features/06-this.md)
   - [Interfaces](./04-language-features/07-interfaces.md)
   - [Primitive literals](./04-language-features/08-primitives.md)
   - [Control structures](./04-language-features/09-control-structures.md)
   - [Decorators](./04-language-features/10-decorators.md)
   - [Disallowed features](./04-language-features/11-disallowed-features.md)

5. [Naming](./05-naming.md)

   - [Identifiers](./05-naming.md#identifiers)
   - [Rules by identifier type](./05-naming.md#naming-rules-by-identifier-type)

6. [Type system](./06-type-system.md)

   - [Type inference](./06-type-system.md#type-inference)
   - [Undefined and null](./06-type-system.md#undefined-and-null)
   - [Use structural types](./06-type-system.md#use-structural-types)
   - [Prefer interfaces over type literal aliases](./06-type-system.md#prefer-interfaces)
   - [Array\<T\> Type](./06-type-system.md#arrayt-type)
   - [Mapped and conditional types](./06-type-system.md#mapped-conditional-types)
   - [any Type](./06-type-system.md#any)
   - [{} Type](./06-type-system.md#empty-interface-type)
   - [Tuple types](./06-type-system.md#tuple-types)
   - [Wrapper types](./06-type-system.md#wrapper-types)

7. [Toolchain requirements](./07-toolchain-requirements.md)

   - [TypeScript compiler](./07-toolchain-requirements.md#typescript-compiler)
   - [Conformance](./07-toolchain-requirements.md#conformance)

8. [Comments and documentation](./08-comments-and-documentation.md)

   - [JSDoc general form](./08-comments-and-documentation.md#jsdoc-general-form)
   - [Markdown](./08-comments-and-documentation.md#jsdoc-markdown)
   - [JSDoc tags](./08-comments-and-documentation.md#jsdoc-tags)
   - [Document all top-level exports](./08-comments-and-documentation.md#document-all-top-level-exports-of-modules)
   - [Class comments](./08-comments-and-documentation.md#jsdoc-class-comments)
   - [Method and function comments](./08-comments-and-documentation.md#method-and-function-comments)

9. [Policies](./09-policies.md)
   - [Consistency](./09-policies.md#consistency)
   - [Deprecation](./09-policies.md#deprecation)
   - [Generated code](./09-policies.md#generated-code)
