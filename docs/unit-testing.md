# Unit Testing Best Practices — React/TypeScript with Playwright

**Version:** 1.0  
**Status:** Active  
**Tech Stack:** React, TypeScript, Vitest, React Testing Library, Playwright

---

## 1. Testing Philosophy

### 1.1 The Testing Trophy

Follow Kent C. Dodds' "Testing Trophy" model (preferred over the traditional pyramid for frontend):

```
        ╱╲
       ╱  ╲        End-to-End (Playwright)
      ╱────╲
     ╱      ╲      Integration (Testing Library)
    ╱────────╲
   ╱          ╲    Unit (Vitest)
  ╱────────────╲
 ╱   Static     ╲  (TypeScript, ESLint)
╱────────────────╲
```

**Priority order:**

1. **Static Analysis** — TypeScript + ESLint catch bugs before tests run
2. **Integration Tests** — Test components as users interact with them
3. **Unit Tests** — Test pure logic, utilities, and complex calculations
4. **E2E Tests** — Test critical user journeys through the full application

### 1.2 Core Principles

- **Test behaviour, not implementation** — Tests should not break when refactoring
- **Write tests that give confidence** — Focus on what matters to users
- **Avoid testing implementation details** — Don't test internal state or private methods
- **Keep tests isolated** — Each test should be independent and repeatable
- **Prefer integration over unit** — A single integration test often replaces many unit tests

---

## 2. Project Structure

```
src/
├── calculator/
│   ├── Calculator.tsx
│   ├── Calculator.test.tsx       # Component integration tests
│   ├── calculatorEngine.ts
│   └── calculatorEngine.test.ts  # Pure unit tests
├── utils/
│   ├── format.ts
│   └── format.test.ts
tests/
├── e2e/                          # Playwright E2E tests
│   ├── calculator.spec.ts
│   └── navigation.spec.ts
├── fixtures/                     # Shared test data
│   └── calculatorFixtures.ts
└── setup.ts                      # Global test setup
```

### 2.1 File Naming Conventions

| Type             | Pattern          | Example                    |
| ---------------- | ---------------- | -------------------------- |
| Unit/Integration | `*.test.ts(x)`   | `calculatorEngine.test.ts` |
| E2E (Playwright) | `*.spec.ts`      | `calculator.spec.ts`       |
| Test utilities   | `*.testutils.ts` | `render.testutils.ts`      |
| Fixtures         | `*Fixtures.ts`   | `calculatorFixtures.ts`    |

---

## 3. Unit Testing with Vitest

### 3.1 Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: ["**/*.test.{ts,tsx}", "tests/**"],
    },
  },
});
```

### 3.2 Test Setup

```typescript
// tests/setup.ts
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
```

### 3.3 Unit Test Best Practices

#### Structure: Arrange-Act-Assert (AAA)

```typescript
// Good: Clear AAA structure
describe("performOperation", () => {
  it("adds two positive numbers correctly", () => {
    // Arrange
    const left = 5;
    const right = 3;

    // Act
    const result = performOperation(left, right, "+");

    // Assert
    expect(result).toBe(8);
  });
});
```

#### Descriptive Test Names

```typescript
// Good: Describes behaviour and expected outcome
describe("inputDigit", () => {
  it("replaces display zero with the entered digit", () => { ... });
  it("appends digit to existing non-zero display", () => { ... });
  it("ignores input when maximum digits reached", () => { ... });
  it("clears error state and starts fresh input", () => { ... });
});

// Bad: Vague or implementation-focused
describe("inputDigit", () => {
  it("works correctly", () => { ... });
  it("sets state", () => { ... });
  it("test case 1", () => { ... });
});
```

#### Test Edge Cases

```typescript
describe("formatDisplayValue", () => {
  it("returns the number as string for small integers", () => {
    expect(formatDisplayValue(42)).toBe("42");
  });

  it("handles negative numbers", () => {
    expect(formatDisplayValue(-123)).toBe("-123");
  });

  it("returns 'Error' for Infinity", () => {
    expect(formatDisplayValue(Infinity)).toBe("Error");
  });

  it("returns 'Error' for NaN", () => {
    expect(formatDisplayValue(NaN)).toBe("Error");
  });

  it("uses exponential notation for very large numbers", () => {
    expect(formatDisplayValue(12345678901)).toMatch(/e\+/);
  });

  it("handles decimal precision without floating-point artefacts", () => {
    expect(formatDisplayValue(0.1 + 0.2)).toBe("0.3");
  });
});
```

#### Group Related Tests

```typescript
describe("calculatorEngine", () => {
  describe("digit input", () => {
    it("handles single digit", () => { ... });
    it("handles multiple digits", () => { ... });
  });

  describe("operator input", () => {
    it("stores first operand", () => { ... });
    it("chains operations", () => { ... });
  });

  describe("error handling", () => {
    it("handles division by zero", () => { ... });
    it("recovers from error state", () => { ... });
  });
});
```

---

## 4. Component Testing with React Testing Library

### 4.1 Core Principles

> "The more your tests resemble the way your software is used, the more confidence they can give you."
> — React Testing Library guiding principle

### 4.2 Query Priority

Use queries in this priority order:

1. **Accessible queries (preferred)**

   - `getByRole` — Most preferred, matches accessibility tree
   - `getByLabelText` — For form elements
   - `getByPlaceholderText` — For inputs
   - `getByText` — For non-interactive elements
   - `getByDisplayValue` — For filled form elements

2. **Semantic queries**

   - `getByAltText` — For images
   - `getByTitle` — For elements with title attribute

3. **Test IDs (last resort)**
   - `getByTestId` — Only when other queries aren't possible

```typescript
// Good: Uses accessible queries
it("displays the current value", () => {
  render(<Calculator />);

  const display = screen.getByRole("status");
  expect(display).toHaveTextContent("0");
});

it("performs addition when buttons are clicked", () => {
  render(<Calculator />);

  fireEvent.click(screen.getByRole("button", { name: /five/i }));
  fireEvent.click(screen.getByRole("button", { name: /add/i }));
  fireEvent.click(screen.getByRole("button", { name: /three/i }));
  fireEvent.click(screen.getByRole("button", { name: /equals/i }));

  expect(screen.getByRole("status")).toHaveTextContent("8");
});

// Bad: Uses test IDs unnecessarily
it("performs addition", () => {
  render(<Calculator />);

  fireEvent.click(screen.getByTestId("btn-5"));
  fireEvent.click(screen.getByTestId("btn-plus"));
  fireEvent.click(screen.getByTestId("btn-3"));
  fireEvent.click(screen.getByTestId("btn-equals"));

  expect(screen.getByTestId("display")).toHaveTextContent("8");
});
```

### 4.3 User Event over fireEvent

```typescript
import userEvent from "@testing-library/user-event";

// Good: userEvent simulates real user interactions
it("allows typing numbers via keyboard", async () => {
  const user = userEvent.setup();
  render(<Calculator />);

  const calculator = screen.getByRole("application");
  await user.click(calculator);
  await user.keyboard("123");

  expect(screen.getByRole("status")).toHaveTextContent("123");
});

// Acceptable: fireEvent for simple clicks
it("clears display when AC is pressed", () => {
  render(<Calculator />);

  fireEvent.click(screen.getByRole("button", { name: /seven/i }));
  fireEvent.click(screen.getByRole("button", { name: /clear all/i }));

  expect(screen.getByRole("status")).toHaveTextContent("0");
});
```

### 4.4 Async Testing

```typescript
// Good: Wait for async operations properly
it("fetches and displays API data", async () => {
  render(<App />);

  // Wait for loading to complete
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for data to appear
  await waitFor(() => {
    expect(screen.getByText(/message:/i)).toBeInTheDocument();
  });

  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});

// Good: Use findBy for elements that appear asynchronously
it("shows error message on fetch failure", async () => {
  server.use(rest.get("/api/hello", (req, res, ctx) => res(ctx.status(500))));

  render(<App />);

  const errorMessage = await screen.findByText(/error/i);
  expect(errorMessage).toBeInTheDocument();
});
```

### 4.5 Mocking

```typescript
// Mock modules
vi.mock("./api", () => {
  return {
    fetchData: vi.fn(),
  };
});

// Mock specific functions
import { fetchData } from "./api";

const mockFetchData = vi.mocked(fetchData);

beforeEach(() => {
  mockFetchData.mockReset();
});

it("handles API errors gracefully", async () => {
  mockFetchData.mockRejectedValueOnce(new Error("Network error"));

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

---

## 5. End-to-End Testing with Playwright

### 5.1 Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 12"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

### 5.2 E2E Test Best Practices

#### Test User Journeys

```typescript
// tests/e2e/calculator.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calculator");
  });

  test("performs basic arithmetic operations", async ({ page }) => {
    // Addition
    await page.getByRole("button", { name: /five/i }).click();
    await page.getByRole("button", { name: /add/i }).click();
    await page.getByRole("button", { name: /three/i }).click();
    await page.getByRole("button", { name: /equals/i }).click();

    await expect(page.getByRole("status")).toHaveText("8");
  });

  test("supports keyboard input", async ({ page }) => {
    const calculator = page.getByRole("application", { name: /calculator/i });
    await calculator.focus();

    await page.keyboard.type("12+8=");

    await expect(page.getByRole("status")).toHaveText("20");
  });

  test("handles division by zero gracefully", async ({ page }) => {
    await page.getByRole("button", { name: /five/i }).click();
    await page.getByRole("button", { name: /divide/i }).click();
    await page.getByRole("button", { name: /zero/i }).click();
    await page.getByRole("button", { name: /equals/i }).click();

    await expect(page.getByRole("status")).toHaveText("Error");
  });

  test("clears error state with AC button", async ({ page }) => {
    // Create error state
    await page.keyboard.type("5/0=");
    await expect(page.getByRole("status")).toHaveText("Error");

    // Clear
    await page.getByRole("button", { name: /clear all/i }).click();
    await expect(page.getByRole("status")).toHaveText("0");
  });
});
```

#### Visual Regression Testing

```typescript
test("matches visual design", async ({ page }) => {
  await page.goto("/calculator");

  // Full page screenshot
  await expect(page).toHaveScreenshot("calculator-initial.png");

  // Component screenshot
  const calculator = page.getByRole("application", { name: /calculator/i });
  await expect(calculator).toHaveScreenshot("calculator-component.png");
});

test("displays expression preview correctly", async ({ page }) => {
  await page.goto("/calculator");

  await page.keyboard.type("8*2=");

  await expect(page).toHaveScreenshot("calculator-with-expression.png");
});
```

#### Accessibility Testing

```typescript
import AxeBuilder from "@axe-core/playwright";

test("meets accessibility standards", async ({ page }) => {
  await page.goto("/calculator");

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

#### Mobile Testing

```typescript
test.describe("Mobile experience", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("buttons are large enough for touch", async ({ page }) => {
    await page.goto("/calculator");

    const button = page.getByRole("button", { name: /five/i });
    const box = await button.boundingBox();

    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test("displays correctly on narrow screens", async ({ page }) => {
    await page.goto("/calculator");

    // No horizontal scrollbar
    const scrollWidth = await page.evaluate(() => {
      return document.documentElement.scrollWidth;
    });
    const clientWidth = await page.evaluate(() => {
      return document.documentElement.clientWidth;
    });

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
```

### 5.3 Page Object Model (Optional)

For larger applications, use Page Object Model:

```typescript
// tests/e2e/pages/CalculatorPage.ts
import { Page, Locator } from "@playwright/test";

export class CalculatorPage {
  readonly page: Page;
  readonly display: Locator;
  readonly clearButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.display = page.getByRole("status");
    this.clearButton = page.getByRole("button", { name: /clear all/i });
  }

  async goto() {
    await this.page.goto("/calculator");
  }

  async pressDigit(digit: string) {
    const names: Record<string, string> = {
      "0": "zero",
      "1": "one",
      "2": "two",
      "3": "three",
      "4": "four",
      "5": "five",
      "6": "six",
      "7": "seven",
      "8": "eight",
      "9": "nine",
    };
    await this.page
      .getByRole("button", { name: new RegExp(names[digit], "i") })
      .click();
  }

  async pressOperator(op: "+" | "-" | "×" | "÷" | "=") {
    const names: Record<string, string> = {
      "+": "add",
      "-": "subtract",
      "×": "multiply",
      "÷": "divide",
      "=": "equals",
    };
    await this.page
      .getByRole("button", { name: new RegExp(names[op], "i") })
      .click();
  }

  async clear() {
    await this.clearButton.click();
  }

  async calculate(expression: string) {
    for (const char of expression) {
      if (/\d/.test(char)) {
        await this.pressDigit(char);
      } else if (["+", "-", "×", "÷", "="].includes(char)) {
        await this.pressOperator(char as "+" | "-" | "×" | "÷" | "=");
      }
    }
  }
}

// Usage in test
test("calculates complex expression", async ({ page }) => {
  const calculator = new CalculatorPage(page);
  await calculator.goto();

  await calculator.calculate("12+34=");

  await expect(calculator.display).toHaveText("46");
});
```

---

## 6. Test Coverage Guidelines

### 6.1 Coverage Targets

| Type           | Target | Rationale                               |
| -------------- | ------ | --------------------------------------- |
| **Statements** | ≥80%   | Ensures most code paths are tested      |
| **Branches**   | ≥75%   | Catches conditional logic errors        |
| **Functions**  | ≥85%   | All exported functions should be tested |
| **Lines**      | ≥80%   | Similar to statements                   |

### 6.2 What to Test

**Must test:**

- All exported functions and components
- User-facing behaviour
- Error handling paths
- Edge cases and boundary conditions
- Accessibility features

**Avoid testing:**

- Implementation details (internal state, private methods)
- Third-party library code
- Trivial code (simple getters, pass-through functions)
- Styles (use visual regression testing instead)

---

## 7. Quick Reference

### Package Installation

```bash
# Unit & Integration Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# E2E Testing
npm install -D @playwright/test
npx playwright install
```

### NPM Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

### Common Matchers

```typescript
// Vitest / Jest matchers
expect(value).toBe(expected); // Strict equality
expect(value).toEqual(expected); // Deep equality
expect(value).toBeTruthy(); // Truthy check
expect(value).toContain(item); // Array/string contains
expect(fn).toThrow(error); // Throws error
expect(fn).toHaveBeenCalledWith(args); // Mock called with

// Testing Library matchers
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent(text);
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toHaveAttribute(attr, value);

// Playwright matchers
await expect(locator).toBeVisible();
await expect(locator).toHaveText(text);
await expect(locator).toHaveAttribute(attr, value);
await expect(page).toHaveURL(url);
await expect(page).toHaveScreenshot(name);
```

---

## 8. References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)
- [Kent C. Dodds — Write Tests. Not Too Many. Mostly Integration.](https://kentcdodds.com/blog/write-tests)
