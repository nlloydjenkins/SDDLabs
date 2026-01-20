# SDDLabs

A full-stack React TypeScript application with an Express API backend.

## Project Structure

```
├── client/          # React TypeScript frontend (Vite)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── ...
│   └── package.json
├── server/          # Express TypeScript API backend
│   ├── src/
│   │   ├── index.ts
│   │   └── routes/
│   └── package.json
└── package.json     # Root package.json with scripts
```

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

Install all dependencies:

```bash
npm run install:all
```

Or install separately:

```bash
# Root dependencies
npm install

# Client dependencies
cd client && npm install

# Server dependencies
cd server && npm install
```

## Development

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Frontend only (runs on http://localhost:3000)
npm run dev:client

# Backend only (runs on http://localhost:5000)
npm run dev:server
```

## API Endpoints

| Method | Endpoint   | Description             |
| ------ | ---------- | ----------------------- |
| GET    | /api/hello | Returns a hello message |
| GET    | /api/users | Returns list of users   |
| POST   | /api/users | Create a new user       |
| GET    | /health    | Health check endpoint   |

## Build

Build both projects for production:

```bash
npm run build
```

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Vitest (testing)

### Backend

- Express.js
- TypeScript
- ts-node-dev (development)

---

## Creating and Evaluating Features

This project follows a structured workflow for creating new features and evaluating them against project standards.

### Workflow Overview

```
1. Define Requirements → 2. Create Feature → 3. Write Tests → 4. Evaluate → 5. Refine
```

### Step 1: Define Requirements

Create a requirements document in `docs/` for your feature:

```
docs/
└── <feature>reqs/
    └── reqs.md
```

See `docs/calcreqs/reqs.md` for an example requirements document covering:
- Functional requirements
- Design requirements
- Accessibility requirements
- Security requirements
- Performance requirements

### Step 2: Create the Feature

Follow the project guidelines in `.github/copilot-instructions.md`:

1. **Component Decomposition** — Break into focused, single-responsibility components
2. **Data-Driven Rendering** — Use configuration arrays with `.map()`
3. **Custom Hooks** — Extract stateful logic into `use*` hooks
4. **Pure Functions** — Separate business logic into utility modules
5. **Strong Typing** — Use explicit TypeScript interfaces

**Example Structure (Calculator):**
```
client/src/calculator/
├── index.ts              # Barrel export
├── Calculator.tsx        # UI component
├── Calculator.css        # Scoped styles
├── Calculator.test.tsx   # Integration tests
├── useCalculator.ts      # Custom hook
├── calculatorEngine.ts   # Pure business logic
└── calculatorEngine.test.ts  # Unit tests
```

### Step 3: Write Tests

Follow the testing strategy in `docs/unit-testing.md`:

| Test Type | Purpose | Location |
|-----------|---------|----------|
| Unit Tests | Pure logic verification | `*.test.ts` |
| Integration Tests | Component behaviour | `*.test.tsx` |
| Snapshot Tests | UI regression | `*.test.tsx` |

Run tests:
```bash
cd client && npm test
```

### Step 4: Evaluate the Feature

Ask Copilot to evaluate your feature against project standards:

```
Assess the <feature> page for best practices, adherence to our guidelines 
for style, testing and requirements. Give a Mark in the form A, B, C, etc.

Include a section for security, accessibility, maintainability and other 
well-written code and solution benchmarks.
```

**Evaluation Criteria:**

| Category | What's Assessed |
|----------|-----------------|
| Style & Guidelines | TypeScript, decomposition, hooks, naming |
| Requirements | Functional completeness per `reqs.md` |
| Testing | Coverage, test types, edge cases |
| Security | Input validation, data handling, XSS |
| Accessibility | WCAG 2.1 AA, ARIA, keyboard, focus |
| Maintainability | Separation of concerns, extensibility |
| Performance | Memoisation, re-renders, memory |

**Grade Scale:**
- **A** — Excellent, production-ready
- **B** — Good, minor improvements needed
- **C** — Acceptable, notable issues to address
- **D** — Below standard, significant refactoring needed
- **F** — Not acceptable, requires rewrite

### Step 5: Iterate and Improve

Address feedback from evaluation, then re-evaluate until you achieve the desired grade.

---

## Resetting the Application

To start fresh and recreate the application from scratch, use the reset script.

### Reset Commands

| Command | Description |
|---------|-------------|
| `npm run reset` | Reset dependencies and build artifacts |
| `npm run reset:clean` | Reset + remove lock files |
| `npm run reset:features` | Reset + remove generated feature code |
| `npm run reset:all` | Full reset (features + lock files) |

### Using the Reset Script

**PowerShell (Windows):**
```powershell
# Basic reset (keeps feature code)
.\scripts\reset-app.ps1

# Reset and remove generated feature code (to recreate from requirements)
.\scripts\reset-app.ps1 -RemoveFeatures

# Full clean reset
.\scripts\reset-app.ps1 -RemoveFeatures -IncludeLockFiles
```

**Or use npm scripts:**
```bash
# Reset and remove feature code to start fresh
npm run reset:features

# Then ask Copilot:
# "Create the calculator feature based on docs/calcreqs/reqs.md"
```

### What Each Reset Removes

| Item | `reset` | `reset:features` |
|------|---------|------------------|
| `node_modules/` | ✅ | ✅ |
| Build output (`dist/`) | ✅ | ✅ |
| Test cache & coverage | ✅ | ✅ |
| TypeScript build info | ✅ | ✅ |
| Lock files | ❌ (use `:clean`) | ❌ (use `:all`) |
| Generated feature code | ❌ | ✅ |
| App.tsx (restored to template) | ❌ | ✅ |

### What Is Preserved

- **Requirements documents** (`docs/calcreqs/`, etc.) — Always kept
- **App.template.tsx** — Base App.tsx without feature imports
- **Configuration files** — `package.json`, `tsconfig.json`, etc.
- **Style guides** — `docs/tsstyle/`
- **Project instructions** — `.github/copilot-instructions.md`
- **Git history** — `.git/`

### Recreating Features After Reset

After running `npm run reset:features`:

1. **App.tsx is automatically restored** — Feature imports and routes are removed
2. **Ask Copilot to recreate** — Use the requirements document:
   ```
   Create the calculator feature based on the requirements in docs/calcreqs/reqs.md.
   Follow the project guidelines in .github/copilot-instructions.md.
   ```
3. **Run tests** — `npm test`
4. **Evaluate** — Ask Copilot to assess the new implementation

### Adding New Features to Reset Script

To add a new feature to the reset script, edit `scripts/reset-app.ps1` and add to the `$featureMappings` array:

```powershell
$featureMappings = @(
    @{
        Name = "Calculator"
        RequirementsDoc = "docs\calcreqs"
        GeneratedCode = @("client\src\calculator")
    },
    @{
        Name = "YourFeature"
        RequirementsDoc = "docs\yourfeaturereqs"
        GeneratedCode = @(
            "client\src\yourfeature",
            "server\src\yourfeature"
        )
    }
)
```

---

## Project Guidelines Reference

| Document | Purpose |
|----------|---------|
| `.github/copilot-instructions.md` | Coding standards and React practices |
| `docs/tsstyle/` | TypeScript style guide |
| `docs/unit-testing.md` | Testing strategy |
| `docs/<feature>reqs/reqs.md` | Feature requirements |
