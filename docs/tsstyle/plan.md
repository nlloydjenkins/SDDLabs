# Conversion Plan: HTML → Markdown

## Source Document

`docs/tsstyle/My TypeScript Style Guide.htm`

## Target Location

All files under `docs/tsstyle/`

---

## Target Directory + File Layout

```
docs/tsstyle/
├── README.md                          ← Master index + TOC
├── 01-introduction.md                 ← Section 1
├── 02-source-file-basics.md           ← Section 2
├── 03-source-file-structure.md        ← Section 3
├── 04-language-features/
│   ├── README.md                      ← Language features index + TOC
│   ├── 01-local-variables.md          ← 4.1 Local variable declarations
│   ├── 02-arrays.md                   ← 4.2 Array literals
│   ├── 03-objects.md                  ← 4.3 Object literals
│   ├── 04-classes.md                  ← 4.4 Classes
│   ├── 05-functions.md                ← 4.5 Functions
│   ├── 06-this.md                     ← 4.6 this
│   ├── 07-interfaces.md               ← 4.7 Interfaces
│   ├── 08-primitives.md               ← 4.8 Primitive literals
│   ├── 09-control-structures.md       ← 4.9 Control structures
│   ├── 10-decorators.md               ← 4.10 Decorators
│   └── 11-disallowed-features.md      ← 4.11 Disallowed features
├── 05-naming.md                       ← Section 5
├── 06-type-system.md                  ← Section 6
├── 07-toolchain-requirements.md       ← Section 7
├── 08-comments-and-documentation.md   ← Section 8
└── 09-policies.md                     ← Section 9
```

---

## Source Document Analysis

The HTML file contains the following major sections (based on `id` attributes and heading hierarchy):

| Section                                              | HTML ID                                          | Heading Level |
| ---------------------------------------------------- | ------------------------------------------------ | ------------- |
| Introduction                                         | `introduction`                                   | h2            |
| → Terminology notes                                  | `terminology-notes`                              | h3            |
| → Guide notes                                        | `guide-notes`                                    | h3            |
| Source file basics                                   | `source-file-basics`                             | h2            |
| → File encoding: UTF-8                               | `file-encoding-utf-8`                            | h3            |
| → → Whitespace characters                            | `whitespace-characters`                          | h4            |
| → → Special escape sequences                         | `special-escape-sequences`                       | h4            |
| → → Non-ASCII characters                             | `non-ascii-characters`                           | h4            |
| Source file structure                                | `source-file-structure`                          | h2            |
| → Copyright information                              | `file-copyright`                                 | h3            |
| → @fileoverview JSDoc                                | `fileoverview`                                   | h3            |
| → Imports                                            | `imports`                                        | h3            |
| → → Import paths                                     | `import-paths`                                   | h4            |
| → → Namespace versus named imports                   | `namespace-versus-named-imports`                 | h4            |
| → → → Apps JSPB protos                               | `jspb-import-by-path`                            | h5            |
| → → Renaming imports                                 | `renaming-imports`                               | h4            |
| → Exports                                            | `exports`                                        | h3            |
| → → Export visibility                                | `export-visibility`                              | h4            |
| → → Mutable exports                                  | `mutable-exports`                                | h4            |
| → → Container classes                                | `container-classes`                              | h4            |
| → Import and export type                             | `import-export-type`                             | h3            |
| → → Import type                                      | `import-type`                                    | h4            |
| → → Export type                                      | `export-type`                                    | h4            |
| → → Use modules not namespaces                       | `use-modules-not-namespaces`                     | h4            |
| Language features                                    | `language-features`                              | h2            |
| → Local variable declarations                        | `local-variable-declarations`                    | h3            |
| → → Use const and let                                | `use-const-and-let`                              | h4            |
| → → One variable per declaration                     | `one-variable-per-declaration`                   | h4            |
| → Array literals                                     | `array-literals`                                 | h3            |
| → → Array constructor                                | `array-constructor`                              | h4            |
| → → Do not define properties on arrays               | `do-not-define-properties-on-arrays`             | h4            |
| → → Array spread syntax                              | `array-spread-syntax`                            | h4            |
| → → Array destructuring                              | `array-destructuring`                            | h4            |
| → Object literals                                    | `object-literals`                                | h3            |
| → → Object constructor                               | `object-constructor`                             | h4            |
| → → Iterating objects                                | `iterating-objects`                              | h4            |
| → → Object spread syntax                             | `object-spread-syntax`                           | h4            |
| → → Computed property names                          | `computed-property-names`                        | h4            |
| → → Object destructuring                             | `object-destructuring`                           | h4            |
| → Classes                                            | `classes`                                        | h3            |
| → → Class declarations                               | `class-declarations`                             | h4            |
| → → Class method declarations                        | `class-method-declarations`                      | h4            |
| → → → Overriding toString                            | `overriding-tostring`                            | h5            |
| → → Static methods                                   | `static-methods`                                 | h4            |
| → → → Avoid private static methods                   | `avoid-private-static-methods`                   | h5            |
| → → → Do not rely on dynamic dispatch                | `avoid-static-method-dynamic-dispatch`           | h5            |
| → → → Avoid static this references                   | `static-this`                                    | h5            |
| → → Constructors                                     | `constructors`                                   | h4            |
| → → Class members                                    | `class-members`                                  | h4            |
| → → → No #private fields                             | `private-fields`                                 | h5            |
| → → → Use readonly                                   | `use-readonly`                                   | h5            |
| → → → Parameter properties                           | `parameter-properties`                           | h5            |
| → → → Field initializers                             | `field-initializers`                             | h5            |
| → → → Properties used outside of class lexical scope | `properties-used-outside-of-class-lexical-scope` | h5            |
| → → → Getters and setters                            | `classes-getters-and-setters`                    | h5            |
| → → → Computed properties                            | `class-computed-properties`                      | h5            |
| → → Visibility                                       | `visibility`                                     | h4            |
| → → Disallowed class patterns                        | `disallowed-class-patterns`                      | h4            |
| → → → Do not manipulate prototypes directly          | `class-prototypes`                               | h5            |
| → Functions                                          | `functions`                                      | h3            |
| → → Terminology                                      | `terminology`                                    | h4            |
| → → Prefer function declarations for named functions | `function-declarations`                          | h4            |
| → → Nested functions                                 | `nested-functions`                               | h4            |
| → → Do not use function expressions                  | `function-expressions`                           | h4            |
| → → Arrow function bodies                            | `arrow-function-bodies`                          | h4            |
| → → Rebinding this                                   | `rebinding-this`                                 | h4            |
| → → Prefer passing arrow functions as callbacks      | `functions-as-callbacks`                         | h4            |
| → → Arrow functions as properties                    | `arrow-functions-as-properties`                  | h4            |
| → → Event handlers                                   | `event-handlers`                                 | h4            |
| → → Parameter initializers                           | `parameter-initializers`                         | h4            |
| → → Prefer rest and spread when appropriate          | `rest-and-spread`                                | h4            |
| → → Formatting functions                             | `formatting-functions`                           | h4            |
| → this                                               | `features-this`                                  | h3            |
| → Interfaces                                         | `interfaces`                                     | h3            |
| → Primitive literals                                 | `primitive-literals`                             | h3            |
| → → String literals                                  | `string-literals`                                | h4            |
| → → → Use single quotes                              | `use-single-quotes`                              | h5            |
| → → → No line continuations                          | `no-line-continuations`                          | h5            |
| → → → Template literals                              | `template-literals`                              | h5            |
| → → Number literals                                  | `number-literals`                                | h4            |
| → → Type coercion                                    | `type-coercion`                                  | h4            |
| → → → Implicit coercion                              | `implicit-coercion`                              | h5            |
| → Control structures                                 | `control-structures`                             | h3            |
| → → Control flow statements and blocks               | `control-flow-statements-blocks`                 | h4            |
| → → → Assignment in control statements               | `assignment-in-control-statements`               | h5            |
| → → → Iterating containers                           | `iterating-containers`                           | h5            |
| → → Grouping parentheses                             | `grouping-parentheses`                           | h4            |
| → → Exception handling                               | `exception-handling`                             | h4            |
| → → → Instantiate errors using new                   | `instantiate-errors-using-new`                   | h5            |
| → → → Only throw errors                              | `only-throw-errors`                              | h5            |
| → → → Catching and rethrowing                        | `catching-and-rethrowing`                        | h5            |
| → → → Empty catch blocks                             | `empty-catch-blocks`                             | h5            |
| → → Switch statements                                | `switch-statements`                              | h4            |
| → → Equality checks                                  | `equality-checks`                                | h4            |
| → → Type and non-nullability assertions              | `type-and-non-nullability-assertions`            | h4            |
| → → → Type assertion syntax                          | `type-assertions-syntax`                         | h5            |
| → → → Double assertions                              | `double-assertions`                              | h5            |
| → → → Type assertions and object literals            | `type-assertions-and-object-literals`            | h5            |
| → → Keep try blocks focused                          | `keep-try-blocks-focused`                        | h4            |
| → Decorators                                         | `decorators`                                     | h3            |
| → Disallowed features                                | `disallowed-features`                            | h3            |
| → → Wrapper objects for primitive types              | `primitive-types-wrapper-classes`                | h4            |
| → → Automatic Semicolon Insertion                    | `automatic-semicolon-insertion`                  | h4            |
| → → Const enums                                      | `enums`                                          | h4            |
| → → Debugger statements                              | `debugger-statements`                            | h4            |
| → → with                                             | `diallowed-features-with`                        | h4            |
| → → Dynamic code evaluation                          | `dynamic-code-evaluation`                        | h4            |
| → → Non-standard features                            | `non-standard-features`                          | h4            |
| → → Modifying builtin objects                        | `modifying-builtin-objects`                      | h4            |
| Naming                                               | `naming`                                         | h2            |
| → Identifiers                                        | `identifiers`                                    | h3            |
| → → Naming style                                     | `naming-style`                                   | h4            |
| → → Descriptive names                                | `descriptive-names`                              | h4            |
| → → Camel case                                       | `camel-case`                                     | h4            |
| → → Dollar sign                                      | `identifiers-dollar-sign`                        | h4            |
| → Rules by identifier type                           | `naming-rules-by-identifier-type`                | h3            |
| → → Type parameters                                  | `identifiers-type-parameters`                    | h4            |
| → → Test names                                       | `identifiers-test-names`                         | h4            |
| → → \_ prefix/suffix                                 | `identifiers-underscore-prefix-suffix`           | h4            |
| → → Imports                                          | `identifiers-imports`                            | h4            |
| → → Constants                                        | `identifiers-constants`                          | h4            |
| → → Aliases                                          | `aliases`                                        | h4            |
| Type system                                          | `type-system`                                    | h2            |
| → Type inference                                     | `type-inference`                                 | h3            |
| → → Return types                                     | `return-types`                                   | h4            |
| → Undefined and null                                 | `undefined-and-null`                             | h3            |
| → → Nullable/undefined type aliases                  | `nullableundefined-type-aliases`                 | h4            |
| → → Prefer optional over \|undefined                 | `prefer-optional-over-undefined`                 | h4            |
| → Use structural types                               | `use-structural-types`                           | h3            |
| → Prefer interfaces over type literal aliases        | `prefer-interfaces`                              | h3            |
| → Array\<T\> Type                                    | `arrayt-type`                                    | h3            |
| → Indexable types / index signatures                 | `indexable-key-string-type`                      | h3            |
| → Mapped and conditional types                       | `mapped-conditional-types`                       | h3            |
| → any Type                                           | `any`                                            | h3            |
| → → Providing a more specific type                   | `any-specific`                                   | h4            |
| → → Using unknown over any                           | `any-unknown`                                    | h4            |
| → → Suppressing any lint warnings                    | `any-suppress`                                   | h4            |
| → {} Type                                            | `empty-interface-type`                           | h3            |
| → Tuple types                                        | `tuple-types`                                    | h3            |
| → Wrapper types                                      | `wrapper-types`                                  | h3            |
| → Return type only generics                          | `return-type-only-generics`                      | h3            |
| Toolchain requirements                               | `toolchain-requirements`                         | h2            |
| → TypeScript compiler                                | `typescript-compiler`                            | h3            |
| → → @ts-ignore                                       | `ts-ignore`                                      | h4            |
| → Conformance                                        | `conformance`                                    | h3            |
| Comments and documentation                           | `comments-documentation`                         | h2            |
| → JSDoc versus comments                              | `jsdoc-vs-comments`                              | h4            |
| → Multi-line comments                                | `multi-line-comments`                            | h4            |
| → JSDoc general form                                 | `jsdoc-general-form`                             | h3            |
| → Markdown                                           | `jsdoc-markdown`                                 | h3            |
| → JSDoc tags                                         | `jsdoc-tags`                                     | h3            |
| → Line wrapping                                      | `jsdoc-line-wrapping`                            | h3            |
| → Document all top-level exports of modules          | `document-all-top-level-exports-of-modules`      | h3            |
| → Class comments                                     | `jsdoc-class-comments`                           | h3            |
| → Method and function comments                       | `method-and-function-comments`                   | h3            |
| → Parameter property comments                        | `parameter-property-comments`                    | h3            |
| → JSDoc type annotations                             | `jsdoc-type-annotations`                         | h3            |
| → Make comments that actually add information        | `redundant-comments`                             | h3            |
| → → Comments when calling a function                 | `comments-when-calling-a-function`               | h4            |
| → Place documentation prior to decorators            | `place-documentation-prior-to-decorators`        | h3            |
| Policies                                             | `policies`                                       | h2            |
| → Consistency                                        | `consistency`                                    | h3            |
| → → Reformatting existing code                       | `reformatting-existing-code`                     | h4            |
| → Deprecation                                        | `deprecation`                                    | h3            |
| → Generated code: mostly exempt                      | `generated-code`                                 | h3            |
| → → Style guide goals                                | `style-guide-goals`                              | h4            |

---

## Content Mapping: Source Section → Target File

| Target File                                      | Source HTML Sections (by id)                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `README.md`                                      | Title, preamble text, TOC with links to all sections                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `01-introduction.md`                             | `introduction`, `terminology-notes`, `guide-notes`                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `02-source-file-basics.md`                       | `source-file-basics`, `file-encoding-utf-8`, `whitespace-characters`, `special-escape-sequences`, `non-ascii-characters`                                                                                                                                                                                                                                                                                                                                                                   |
| `03-source-file-structure.md`                    | `source-file-structure`, `file-copyright`, `fileoverview`, `imports`, `import-paths`, `namespace-versus-named-imports`, `jspb-import-by-path`, `renaming-imports`, `exports`, `export-visibility`, `mutable-exports`, `container-classes`, `import-export-type`, `import-type`, `export-type`, `use-modules-not-namespaces`                                                                                                                                                                |
| `04-language-features/README.md`                 | `language-features` intro paragraph + TOC linking to sub-docs                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `04-language-features/01-local-variables.md`     | `local-variable-declarations`, `use-const-and-let`, `one-variable-per-declaration`                                                                                                                                                                                                                                                                                                                                                                                                         |
| `04-language-features/02-arrays.md`              | `array-literals`, `array-constructor`, `do-not-define-properties-on-arrays`, `array-spread-syntax`, `array-destructuring`                                                                                                                                                                                                                                                                                                                                                                  |
| `04-language-features/03-objects.md`             | `object-literals`, `object-constructor`, `iterating-objects`, `object-spread-syntax`, `computed-property-names`, `object-destructuring`                                                                                                                                                                                                                                                                                                                                                    |
| `04-language-features/04-classes.md`             | `classes`, `class-declarations`, `class-method-declarations`, `overriding-tostring`, `static-methods`, `avoid-private-static-methods`, `avoid-static-method-dynamic-dispatch`, `static-this`, `constructors`, `class-members`, `private-fields`, `use-readonly`, `parameter-properties`, `field-initializers`, `properties-used-outside-of-class-lexical-scope`, `classes-getters-and-setters`, `class-computed-properties`, `visibility`, `disallowed-class-patterns`, `class-prototypes` |
| `04-language-features/05-functions.md`           | `functions`, `terminology`, `function-declarations`, `nested-functions`, `function-expressions`, `arrow-function-bodies`, `rebinding-this`, `functions-as-callbacks`, `arrow-functions-as-properties`, `event-handlers`, `parameter-initializers`, `rest-and-spread`, `formatting-functions`                                                                                                                                                                                               |
| `04-language-features/06-this.md`                | `features-this`                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `04-language-features/07-interfaces.md`          | `interfaces`                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `04-language-features/08-primitives.md`          | `primitive-literals`, `string-literals`, `use-single-quotes`, `no-line-continuations`, `template-literals`, `number-literals`, `type-coercion`, `implicit-coercion`                                                                                                                                                                                                                                                                                                                        |
| `04-language-features/09-control-structures.md`  | `control-structures`, `control-flow-statements-blocks`, `assignment-in-control-statements`, `iterating-containers`, `grouping-parentheses`, `exception-handling`, `instantiate-errors-using-new`, `only-throw-errors`, `catching-and-rethrowing`, `empty-catch-blocks`, `switch-statements`, `equality-checks`, `type-and-non-nullability-assertions`, `type-assertions-syntax`, `double-assertions`, `type-assertions-and-object-literals`, `keep-try-blocks-focused`                     |
| `04-language-features/10-decorators.md`          | `decorators`                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `04-language-features/11-disallowed-features.md` | `disallowed-features`, `primitive-types-wrapper-classes`, `automatic-semicolon-insertion`, `enums`, `debugger-statements`, `diallowed-features-with`, `dynamic-code-evaluation`, `non-standard-features`, `modifying-builtin-objects`                                                                                                                                                                                                                                                      |
| `05-naming.md`                                   | `naming`, `identifiers`, `naming-style`, `descriptive-names`, `camel-case`, `identifiers-dollar-sign`, `naming-rules-by-identifier-type`, `identifiers-type-parameters`, `identifiers-test-names`, `identifiers-underscore-prefix-suffix`, `identifiers-imports`, `identifiers-constants`, `aliases`                                                                                                                                                                                       |
| `06-type-system.md`                              | `type-system`, `type-inference`, `return-types`, `undefined-and-null`, `nullableundefined-type-aliases`, `prefer-optional-over-undefined`, `use-structural-types`, `prefer-interfaces`, `arrayt-type`, `indexable-key-string-type`, `mapped-conditional-types`, `any`, `any-specific`, `any-unknown`, `any-suppress`, `empty-interface-type`, `tuple-types`, `wrapper-types`, `return-type-only-generics`                                                                                  |
| `07-toolchain-requirements.md`                   | `toolchain-requirements`, `typescript-compiler`, `ts-ignore`, `conformance`                                                                                                                                                                                                                                                                                                                                                                                                                |
| `08-comments-and-documentation.md`               | `comments-documentation`, `jsdoc-vs-comments`, `multi-line-comments`, `jsdoc-general-form`, `jsdoc-markdown`, `jsdoc-tags`, `jsdoc-line-wrapping`, `document-all-top-level-exports-of-modules`, `jsdoc-class-comments`, `method-and-function-comments`, `parameter-property-comments`, `jsdoc-type-annotations`, `redundant-comments`, `comments-when-calling-a-function`, `place-documentation-prior-to-decorators`                                                                       |
| `09-policies.md`                                 | `policies`, `consistency`, `reformatting-existing-code`, `deprecation`, `generated-code`, `style-guide-goals`                                                                                                                                                                                                                                                                                                                                                                              |

---

## Content Mapping Rules

### 1. Preserve original section numbering

Keep original section numbering in each doc's top heading so it's searchable and traceable:

- e.g., `## 4.5 Functions` in `04-language-features/05-functions.md`
- Numbering follows the source HTML `class="numbered"` structure

### 2. Code blocks

Preserve code blocks as fenced Markdown with `ts` where appropriate:

| HTML Pattern                           | Markdown Output                          |
| -------------------------------------- | ---------------------------------------- |
| `<pre><code class="language-ts good">` | ` ```ts ` with `// Good:` comment header |
| `<pre><code class="language-ts bad">`  | ` ```ts ` with `// Bad:` comment header  |
| `<pre><code class="language-ts">`      | ` ```ts `                                |
| `<pre><code class="language-js good">` | ` ```js `                                |

Preserve all code content exactly.

### 3. Tables

Convert HTML `<table>` to Markdown tables. Tables identified:

- Import variants table (4 columns: Import type, Example, Use for)
- Naming casing table (2 columns: Style, Category)

### 4. Links

- `docs/tsstyle/README.md`: use relative links to each section file
  - e.g., `[Introduction](./01-introduction.md)`
- `04-language-features/README.md`: use relative links to sub-docs
  - e.g., `[Local variables](./01-local-variables.md)`
- Cross-references within files: use anchor links with kebab-case IDs matching the original HTML IDs

### 5. HTML entities

| HTML                   | Markdown    |
| ---------------------- | ----------- |
| `&gt;`                 | `>`         |
| `&lt;`                 | `<`         |
| `&amp;`                | `&`         |
| `<q>...</q>`           | `"..."`     |
| `<em>...</em>`         | `*...*`     |
| `<strong>...</strong>` | `**...**`   |
| `<del>...</del>`       | `~~...~~`   |
| `<code>...</code>`     | `` `...` `` |

### 6. Collapsible sections

Convert `<section class="zippy">` to Markdown details/summary:

```markdown
<details>
<summary>Why?</summary>

Content here...

</details>
```

### 7. Anchors

Preserve `id` attributes as heading anchors for cross-linking:

- Format: `## 4.5 Functions {#functions}`

---

## Execution Steps

### Step 1: Create directory structure

```
docs/tsstyle/04-language-features/
```

### Step 2: Create index files first (with TOCs)

1. `docs/tsstyle/README.md`
2. `docs/tsstyle/04-language-features/README.md`

### Step 3: Convert each section

Convert in order:

1. `01-introduction.md`
2. `02-source-file-basics.md`
3. `03-source-file-structure.md`
4. `04-language-features/01-local-variables.md`
5. `04-language-features/02-arrays.md`
6. `04-language-features/03-objects.md`
7. `04-language-features/04-classes.md`
8. `04-language-features/05-functions.md`
9. `04-language-features/06-this.md`
10. `04-language-features/07-interfaces.md`
11. `04-language-features/08-primitives.md`
12. `04-language-features/09-control-structures.md`
13. `04-language-features/10-decorators.md`
14. `04-language-features/11-disallowed-features.md`
15. `05-naming.md`
16. `06-type-system.md`
17. `07-toolchain-requirements.md`
18. `08-comments-and-documentation.md`
19. `09-policies.md`

### Step 4: Spot-check

- [ ] Verify all relative links resolve correctly
- [ ] Verify tables render properly
- [ ] Verify code blocks have correct language tags
- [ ] Verify all headings appear exactly once
- [ ] Verify anchor IDs for cross-references

---

## File Size Estimates

| File                                             | Estimated Lines |
| ------------------------------------------------ | --------------- |
| `README.md`                                      | ~80             |
| `01-introduction.md`                             | ~40             |
| `02-source-file-basics.md`                       | ~80             |
| `03-source-file-structure.md`                    | ~350            |
| `04-language-features/README.md`                 | ~50             |
| `04-language-features/01-local-variables.md`     | ~50             |
| `04-language-features/02-arrays.md`              | ~120            |
| `04-language-features/03-objects.md`             | ~150            |
| `04-language-features/04-classes.md`             | ~400            |
| `04-language-features/05-functions.md`           | ~300            |
| `04-language-features/06-this.md`                | ~30             |
| `04-language-features/07-interfaces.md`          | ~20             |
| `04-language-features/08-primitives.md`          | ~250            |
| `04-language-features/09-control-structures.md`  | ~400            |
| `04-language-features/10-decorators.md`          | ~60             |
| `04-language-features/11-disallowed-features.md` | ~150            |
| `05-naming.md`                                   | ~250            |
| `06-type-system.md`                              | ~500            |
| `07-toolchain-requirements.md`                   | ~80             |
| `08-comments-and-documentation.md`               | ~350            |
| `09-policies.md`                                 | ~150            |

**Total: ~21 files, ~3,340 lines**
