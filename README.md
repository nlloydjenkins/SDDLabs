# Spec-Driven Development Labs

Generate features from specifications using AI coding assistants.

---

## Prerequisites

### Required

- Node.js 18+ (for TypeScript lab)
- Java 17+ (for Java lab)
- Git
- GitHub Copilot subscription

### VS Code Extensions

Install these extensions for full support:

```
GitHub.copilot
vscjava.vscode-java-pack
vmware.vscode-boot-dev-pack
```

### Alternative: IntelliJ IDEA

- Install [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- Install plugin: GitHub Copilot (Settings → Plugins)

---

## Setup

```bash
git clone https://github.com/nlloydjenkins/SDDLabs.git
cd SDDLabs
npm run install:all
```

---

## TypeScript Lab: Calculator UI

### 1. Reset

```bash
npm run reset:features
```

### 2. Generate

Open Copilot Chat and enter:

```
Create the calculator feature based on the requirements in docs/calcreqs/reqs.md.
Follow the project guidelines in .github/copilot-instructions.md.
```

### 3. Run

```bash
npm run dev
```

Open: http://localhost:3000/calculator

### 4. Test

```bash
npm test
```

### 5. Evaluate

In Copilot Chat:

```
Assess the calculator page for best practices, adherence to our guidelines
for style, testing and requirements. Give a grade (A, B, C, D, F).

Include sections for security, accessibility, maintainability.
```

---

## Java Lab: Calculator REST API

### 1. Reset

```powershell
.\scripts\reset-java.ps1 -RemoveFeatures
```

### 2. Generate

Open Copilot Chat and enter:

```
Create the calculator REST API based on the requirements in docs/java-calcreqs/reqs.md.
Follow the project guidelines in .github/copilot-instructions.md.
```

### 3. Run

```bash
cd java-server
./mvnw spring-boot:run
```

Test: http://localhost:8080/actuator/health

### 4. Test

```bash
cd java-server
./mvnw test
```

### 5. Evaluate

In Copilot Chat:

```
Assess the calculator REST API for best practices, adherence to our guidelines
for style, testing and requirements. Give a grade (A, B, C, D, F).

Include sections for security, input validation, maintainability.
```

---

## Commands

### TypeScript

| Command                  | Description                       |
| ------------------------ | --------------------------------- |
| `npm run install:all`    | Install dependencies              |
| `npm run dev`            | Start development server          |
| `npm test`               | Run tests                         |
| `npm run reset:features` | Remove generated code, keep specs |
| `npm run reset:all`      | Full reset including lock files   |

### Java

| Command                                    | Description              |
| ------------------------------------------ | ------------------------ |
| `cd java-server && ./mvnw spring-boot:run` | Start Spring Boot server |
| `cd java-server && ./mvnw test`            | Run tests                |
| `.\scripts\reset-java.ps1`                 | Clean build artifacts    |
| `.\scripts\reset-java.ps1 -RemoveFeatures` | Remove generated code    |

---

## Specifications

### TypeScript Lab

| Document                | Description                |
| ----------------------- | -------------------------- |
| `docs/calcreqs/reqs.md` | Calculator UI requirements |
| `docs/tsstyle/`         | TypeScript style guide     |
| `docs/unit-testing.md`  | Testing guidelines         |

### Java Lab

| Document                     | Description                 |
| ---------------------------- | --------------------------- |
| `docs/java-calcreqs/reqs.md` | Calculator API requirements |
| `docs/javastyle/`            | Java style guide            |

### Shared

| Document                          | Description             |
| --------------------------------- | ----------------------- |
| `.github/copilot-instructions.md` | Coding standards (both) |

---

## Adding a New Lab

### TypeScript

1. Create specification: `docs/<feature>reqs/reqs.md`
2. Register in `scripts/reset-app.ps1`:
   ```powershell
   @{
       Name = "FeatureName"
       RequirementsDoc = "docs\featurereqs"
       GeneratedCode = @("client\src\feature")
   }
   ```
3. Run: `npm run reset:features`

### Java

1. Create specification: `docs/java-<feature>reqs/reqs.md`
2. Register in `scripts/reset-java.ps1`:
   ```powershell
   @{
       Name = "FeatureName"
       RequirementsDoc = "..\docs\java-featurereqs"
       GeneratedCode = @(
           "src\main\java\com\sddlabs\feature",
           "src\test\java\com\sddlabs\feature"
       )
   }
   ```
3. Run: `.\scripts\reset-java.ps1 -RemoveFeatures`

---

## License

MIT

```bash
npm run reset:features
```

---

## License

MIT
