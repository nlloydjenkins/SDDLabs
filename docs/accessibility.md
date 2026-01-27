# Accessibility Requirements — WCAG 2.1 AAA Compliance

**Version:** 1.0  
**Status:** Active  
**Applies to:** All calculator implementations (React, Java/Spring Boot)

---

## 1. Overview

All implementations must meet **WCAG 2.1 Level AAA** compliance. This is the highest level of accessibility conformance and ensures the application is usable by the widest possible audience, including users with severe disabilities.

> **Note:** Level AAA compliance is mandatory for financial services applications serving regulated industries.

---

## 2. Perceivable

### 2.1 Text Alternatives (1.1.1 AAA)

- All non-text content has a text alternative
- All buttons have descriptive `aria-label` attributes
- Icons have accessible names that describe their function
- Decorative images are hidden from assistive technologies

### 2.2 Captions and Audio (1.2.x AAA)

- If audio feedback is added, provide visual alternatives
- No auto-playing audio without user consent

### 2.3 Adaptable Content (1.3.x AAA)

- Content structure conveyed through proper semantic HTML
- Reading order matches visual order
- Orientation not restricted (portrait/landscape)
- Input purpose identified for autocomplete where applicable

### 2.4 Distinguishable (1.4.x AAA)

| Requirement                        | Criterion | Value                         |
| ---------------------------------- | --------- | ----------------------------- |
| **Contrast Ratio (Normal Text)**   | 1.4.6 AAA | **7:1 minimum**               |
| **Contrast Ratio (Large Text)**    | 1.4.6 AAA | **4.5:1 minimum**             |
| **Contrast Ratio (UI Components)** | 1.4.11 AA | **3:1 minimum**               |
| **Text Resize**                    | 1.4.4 AA  | Up to 200% without loss       |
| **Text Spacing**                   | 1.4.12 AA | Adjustable without breaking   |
| **Images of Text**                 | 1.4.9 AAA | None (use real text)          |
| **Reflow**                         | 1.4.10 AA | No horizontal scroll at 320px |
| **Non-Text Contrast**              | 1.4.11 AA | 3:1 for interactive elements  |

#### Colour Requirements

```css
/* Required contrast ratios for calculator */
--display-text: #ffffff; /* White on black = 21:1 ✓ */
--button-text: #ffffff; /* White on dark grey ≥ 7:1 ✓ */
--operator-text: #ffffff; /* White on orange ≥ 4.5:1 ✓ */
--error-text: #ff6b6b; /* Must meet 7:1 on background */
```

---

## 3. Operable

### 3.1 Keyboard Accessible (2.1.x AAA)

| Requirement                 | Details                               |
| --------------------------- | ------------------------------------- |
| **Full Keyboard Access**    | All functions accessible via keyboard |
| **No Keyboard Traps**       | Focus can always be moved away        |
| **Character Key Shortcuts** | Must be remappable or disableable     |
| **Keyboard Shortcuts**      | Documented and consistent             |

#### Required Keyboard Mappings

| Key                  | Action                    |
| -------------------- | ------------------------- |
| `0-9`                | Enter digit               |
| `.`                  | Decimal point             |
| `+`                  | Addition                  |
| `-`                  | Subtraction               |
| `*`                  | Multiplication            |
| `/`                  | Division                  |
| `Enter` or `=`       | Calculate                 |
| `Escape` or `Delete` | Clear all                 |
| `Backspace`          | Clear last digit          |
| `Tab`                | Navigate between controls |

### 3.2 Timing (2.2.x AAA)

- **No time limits** on user interactions
- **No auto-updating content** without user control
- **No session timeouts** for calculation state

### 3.3 Seizures and Physical Reactions (2.3.x AAA)

- **No flashing content** at any frequency
- **No animation** that cannot be disabled
- **Motion reduced** when `prefers-reduced-motion` is set

### 3.4 Navigable (2.4.x AAA)

| Requirement             | Criterion  | Implementation                  |
| ----------------------- | ---------- | ------------------------------- |
| **Skip Links**          | 2.4.1 AA   | Bypass navigation to calculator |
| **Page Title**          | 2.4.2 A    | Descriptive title on each page  |
| **Focus Order**         | 2.4.3 A    | Logical tab sequence            |
| **Link Purpose**        | 2.4.9 AAA  | Links clear from text alone     |
| **Multiple Ways**       | 2.4.5 AA   | Multiple navigation methods     |
| **Headings and Labels** | 2.4.6 AA   | Descriptive, unique labels      |
| **Focus Visible**       | 2.4.7 AA   | Always visible focus indicator  |
| **Focus Appearance**    | 2.4.11 AAA | 2px minimum focus ring          |
| **Section Headings**    | 2.4.10 AAA | Content organised with headings |

#### Focus Indicator Requirements

```css
/* AAA-compliant focus indicator */
:focus-visible {
  outline: 3px solid #4a90d9;
  outline-offset: 2px;
  /* Contrast ratio ≥ 3:1 against adjacent colours */
}
```

### 3.5 Input Modalities (2.5.x AAA)

| Requirement              | Details                            |
| ------------------------ | ---------------------------------- |
| **Pointer Gestures**     | Simple single-pointer actions only |
| **Pointer Cancellation** | Action on up-event, cancellable    |
| **Target Size**          | **44×44px minimum** (AAA)          |
| **Concurrent Input**     | Support touch, mouse, keyboard     |
| **Dragging**             | Alternative to any drag action     |
| **Motion Actuation**     | No motion-based input required     |

---

## 4. Understandable

### 4.1 Readable (3.1.x AAA)

- Language of page declared (`lang="en"`)
- Language of parts identified if different
- Unusual words explained or avoided
- Abbreviations expanded on first use
- Reading level appropriate (lower secondary)
- Pronunciation guidance where ambiguous

### 4.2 Predictable (3.2.x AAA)

- **No context changes on focus**
- **No context changes on input** (without warning)
- **Consistent navigation** across pages
- **Consistent identification** of components
- **Change on request** only

### 4.3 Input Assistance (3.3.x AAA)

| Requirement                | Criterion | Implementation                   |
| -------------------------- | --------- | -------------------------------- |
| **Error Identification**   | 3.3.1 A   | Clear error messages             |
| **Labels or Instructions** | 3.3.2 A   | All inputs labelled              |
| **Error Suggestion**       | 3.3.3 AA  | How to fix errors                |
| **Error Prevention**       | 3.3.6 AAA | Confirm destructive actions      |
| **Help**                   | 3.3.5 AAA | Context-sensitive help available |

#### Error Message Requirements

All error states must:

1. Be announced to screen readers immediately
2. Include the error type and how to resolve
3. Not rely on colour alone
4. Persist until user acknowledges

---

## 5. Robust

### 5.1 Compatible (4.1.x)

- **Valid HTML** (no parsing errors)
- **Name, Role, Value** properly defined for all controls
- **Status Messages** announced without focus change

#### ARIA Requirements

```html
<!-- Calculator display -->
<div
  role="region"
  aria-label="Calculator display"
  aria-live="polite"
  aria-atomic="true"
>
  <span class="expression">8 × 2</span>
  <span class="result">16</span>
</div>

<!-- Calculator button -->
<button type="button" aria-label="Add" aria-pressed="false">+</button>

<!-- Error state -->
<div role="alert" aria-live="assertive">Cannot divide by zero</div>
```

---

## 6. Screen Reader Announcements

### Required Announcements

| Event              | Announcement               | Priority  |
| ------------------ | -------------------------- | --------- |
| Result calculated  | "Result: [value]"          | Polite    |
| Error occurred     | "Error: [message]"         | Assertive |
| Calculator cleared | "Calculator cleared"       | Polite    |
| Operator selected  | "[Operator name] selected" | Polite    |
| Sign toggled       | "Negative" or "Positive"   | Polite    |

### Screen Reader Testing

Test with:

| Platform | Screen Reader |
| -------- | ------------- |
| Windows  | NVDA, JAWS    |
| macOS    | VoiceOver     |
| iOS      | VoiceOver     |
| Android  | TalkBack      |

---

## 7. Testing Requirements

### Automated Testing

| Tool       | Purpose                       |
| ---------- | ----------------------------- |
| axe-core   | Automated accessibility audit |
| Lighthouse | Performance and accessibility |
| WAVE       | Visual accessibility review   |
| Pa11y      | CI/CD accessibility testing   |

### Manual Testing Checklist

- [ ] Navigate entire calculator using only keyboard
- [ ] Complete calculation using only screen reader
- [ ] Verify all announcements are correct
- [ ] Test with browser zoom at 200%
- [ ] Test with `prefers-reduced-motion`
- [ ] Test with high contrast mode
- [ ] Verify focus order is logical
- [ ] Measure all contrast ratios
- [ ] Verify touch targets are 44×44px minimum

### Accessibility Statement

All implementations must include an accessibility statement page documenting:

- Conformance level claimed
- Known limitations
- Contact information for accessibility issues
- Date of last accessibility review

---

## 8. References

- [WCAG 2.1 Specification](https://www.w3.org/TR/WCAG21/)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
