# Project Instructions

This is a full-stack React TypeScript application with an Express API backend.

## Project Structure

- `/client` - React TypeScript frontend
- `/server` - Express TypeScript API backend

## Development Guidelines

- Use TypeScript for all code
- Follow React best practices with functional components and hooks
- API routes should follow RESTful conventions
- Use proper error handling in both frontend and backend

## Running the Project

- Frontend: `cd client && npm run dev`
- Backend: `cd server && npm run dev`
- Or run both: `npm run dev` from root

---

## Good Coding Practices

The following principles must be adhered to when writing or modifying code in this project.

### 1. Component Decomposition

- Break large components into smaller, focused units with single responsibilities
- If a component exceeds 200-300 lines, split it into smaller components
- Each component should have one clear purpose

### 2. Data-Driven Rendering

- Replace repetitive UI code with data structures and mapping functions
- Use arrays/objects of configuration and `.map()` instead of copy-pasting JSX
- Example:
  ```typescript
  const ITEMS = [
    { id: "a", label: "Alpha" },
    { id: "b", label: "Beta" },
  ];
  {
    ITEMS.map((item) => <Component key={item.id} {...item} />);
  }
  ```

### 3. Constants Extraction

- Move magic strings, numbers, and configuration values to dedicated constants files
- Use `as const` for type safety on constant objects
- Create a `constants.ts` file for shared values

### 4. Custom Hooks for Logic

- Extract stateful logic and side effects into reusable custom hooks
- Separate UI rendering from business logic
- Name hooks with `use` prefix (e.g., `useCalculator`, `useApi`)

### 5. CSS Encapsulation

- Prefer CSS Modules or scoped styling over global CSS
- Co-locate styles with their components
- Avoid style collisions with unique class names

### 6. Utility Functions

- Extract pure transformation logic into standalone utility functions
- Place utilities in a `utils/` directory
- Keep utility functions pure (no side effects) for easy testing

### 7. Strong Typing (React-Specific)

- Follow the TypeScript Style Guide in `docs/tsstyle/06-type-system.md` for general typing rules
- For React components, type props with explicit interfaces
- Use discriminated unions for component state machines
- Prefer `ComponentProps<typeof X>` for extending native element props

### 8. Error Boundaries

- Wrap feature areas in error boundaries to prevent cascading failures
- Provide meaningful fallback UI for error states
- Log errors appropriately for debugging

### 9. Performance Optimisation

- Use `useMemo` for expensive computations
- Use `useCallback` for functions passed as props
- Use `React.memo` for components that render often with same props
- Avoid unnecessary re-renders by keeping state close to where it's used

### 10. Comprehensive Testing Strategy

Follow these testing approaches:

| Test Type                | Purpose                      | When to Use                         |
| ------------------------ | ---------------------------- | ----------------------------------- |
| **Unit Tests**           | Verify pure logic            | Utilities, reducers, pure functions |
| **Integration Tests**    | Verify component behaviour   | User interactions, data flow        |
| **Snapshot Tests**       | Detect unintended UI changes | Stable UI components                |
| **Property-Based Tests** | Find edge cases              | Mathematical operations, parsers    |

### SOLID Principles for React

| Principle                 | Application                           |
| ------------------------- | ------------------------------------- |
| **Single Responsibility** | One component = one purpose           |
| **Open/Closed**           | Extend via props, not modification    |
| **Liskov Substitution**   | Consistent prop interfaces            |
| **Interface Segregation** | Small, focused prop types             |
| **Dependency Inversion**  | Inject dependencies via props/context |
