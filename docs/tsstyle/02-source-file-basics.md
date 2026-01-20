# 2 Source file basics {#source-file-basics}

## 2.1 File encoding: UTF-8 {#file-encoding-utf-8}

Source files are encoded in **UTF-8**.

### 2.1.1 Whitespace characters {#whitespace-characters}

Aside from the line terminator sequence, the ASCII horizontal space character (0x20) is the only whitespace character that appears anywhere in a source file. This implies that all other whitespace characters in string literals are escaped.

### 2.1.2 Special escape sequences {#special-escape-sequences}

For any character that has a special escape sequence (`\'`, `\"`, `\\`, `\b`, `\f`, `\n`, `\r`, `\t`, `\v`), that sequence is used rather than the corresponding numeric escape (e.g `\x0a`, `\u000a`, or `\u{a}`). Legacy octal escapes are never used.

### 2.1.3 Non-ASCII characters {#non-ascii-characters}

For the remaining non-ASCII characters, use the actual Unicode character (e.g. `∞`). For non-printable characters, the equivalent hex or Unicode escapes (e.g. `\u221e`) can be used along with an explanatory comment.

```ts
// Good: Perfectly clear, even without a comment.
const units = "μs";

// Good: Use escapes for non-printable characters.
const output = "\ufeff" + content; // byte order mark
```

```ts
// Bad: Hard to read and prone to mistakes, even with the comment.
const units = "\u03bcs"; // Greek letter mu, 's'

// Bad: The reader has no idea what this is.
const output = "\ufeff" + content;
```
