# Spec-Driven Development Labs

## What This Lab Proves

This laboratory demonstrates **Spec-Driven Development (SDD)** — a methodology where AI coding assistants generate production-quality code from detailed specification documents.

> Given well-structured requirements, style guides, and evaluation criteria, an AI assistant can generate code that meets professional standards for functionality, security, accessibility, and maintainability.

---

## Lab Structure

```
docs/
├── calcreqs/reqs.md          # Feature specification (the input)
├── tsstyle/                   # TypeScript style guide (coding standards)
└── unit-testing.md           # Testing strategy

.github/
└── copilot-instructions.md   # Project guidelines for AI

client/src/                    # Generated code (the output)
scripts/
└── reset-app.ps1             # Reset tool to repeat experiments
```

---

## Running the Lab

### Prerequisites

- Node.js 18+
- VS Code with GitHub Copilot
- Git

### Setup

```bash
git clone https://github.com/nlloydjenkins/SDDLabs.git
cd SDDLabs
npm run install:all
```

---

## Lab Exercise: Generate a Feature from Specification

### Step 1: Reset to Clean State

Remove any previously generated code to start fresh:

```bash
npm run reset:features
```

This removes generated feature code while preserving all specifications.

### Step 2: Review the Specification

Open and read the calculator requirements:

```
docs/calcreqs/reqs.md
```

Note how the specification covers:

- Functional requirements (what it does)
- Design requirements (how it looks)
- Accessibility requirements (who can use it)
- Security requirements (what it prevents)
- Performance requirements (how fast it responds)

### Step 3: Generate the Feature

Ask Copilot to create the feature:

```
Create the calculator feature based on the requirements in docs/calcreqs/reqs.md.
Follow the project guidelines in .github/copilot-instructions.md.
```

Observe how Copilot:

- Interprets the specification
- Structures the code according to guidelines
- Implements accessibility features
- Creates tests

### Step 4: Verify the Output

Run the application:

```bash
npm run dev
```

Navigate to `http://localhost:3000/calculator`:

Run the tests:

```bash
npm test
```

---

## Evaluating the Output

### Automated Evaluation

Ask Copilot to assess the generated code:

```
Assess the calculator page for best practices, adherence to our guidelines
for style, testing and requirements. Give a Mark in the form A, B, C, etc.

Include sections for security, accessibility, maintainability and other
well-written code and solution benchmarks.
```

### Evaluation Criteria

| Category               | What's Assessed                             |
| ---------------------- | ------------------------------------------- |
| **Requirements**       | Does it do what the spec says?              |
| **Style & Guidelines** | Does it follow the coding standards?        |
| **Testing**            | Are there sufficient tests?                 |
| **Security**           | Is input validated? No XSS risks?           |
| **Accessibility**      | WCAG 2.1 AA compliant? Keyboard accessible? |
| **Maintainability**    | Separation of concerns? Easy to extend?     |
| **Performance**        | No unnecessary re-renders?                  |

### Grade Scale

| Grade | Meaning                                        |
| ----- | ---------------------------------------------- |
| **A** | Production-ready, meets all criteria           |
| **B** | Good, minor improvements needed                |
| **C** | Acceptable, notable issues to address          |
| **D** | Below standard, significant refactoring needed |
| **F** | Does not meet requirements                     |

### Recording Results

After each lab run, note:

1. The grade received for each category
2. Specific issues identified
3. What prompts or specifications could be improved

---

## Repeating the Experiment

### Full Reset

To run the lab again with the same specifications:

```bash
npm run reset:features
```

This:

- Removes all generated feature code
- Restores `App.tsx` to its template state
- Preserves all specifications and guidelines
- Reinstalls dependencies

### Varying the Experiment

Try modifying these inputs and observe how output quality changes:

| Variable             | How to Modify                          |
| -------------------- | -------------------------------------- |
| Specification detail | Edit `docs/calcreqs/reqs.md`           |
| Coding standards     | Edit `.github/copilot-instructions.md` |
| Style guide          | Edit `docs/tsstyle/*.md`               |
| Testing requirements | Edit `docs/unit-testing.md`            |

---

## Lab Commands Reference

| Command                  | Purpose                         |
| ------------------------ | ------------------------------- |
| `npm run install:all`    | Install all dependencies        |
| `npm run dev`            | Run the application             |
| `npm test`               | Run tests                       |
| `npm run reset`          | Reset dependencies only         |
| `npm run reset:features` | Reset and remove generated code |
| `npm run reset:all`      | Full reset including lock files |

---

## Key Documents

| Document                          | Purpose                          |
| --------------------------------- | -------------------------------- |
| `docs/calcreqs/reqs.md`           | Calculator feature specification |
| `docs/tsstyle/`                   | TypeScript style guide           |
| `docs/unit-testing.md`            | Testing strategy                 |
| `.github/copilot-instructions.md` | Project coding guidelines        |

---

## Adding New Lab Exercises

To create a new feature lab:

1. Create a specification: `docs/<feature>reqs/reqs.md`
2. Add to reset script in `scripts/reset-app.ps1`:
   ```powershell
   @{
       Name = "FeatureName"
       RequirementsDoc = "docs\featurereqs"
       GeneratedCode = @("client\src\feature")
   }
   ```
3. Run `npm run reset:features` and generate the feature
4. Evaluate the output

---

## License

MIT
