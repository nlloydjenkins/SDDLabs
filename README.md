# Spec-Driven Development Labs

Generate features from specifications using AI coding assistants.

---

## Prerequisites

### Required Software

| Software                                              | Version      | Purpose            |
| ----------------------------------------------------- | ------------ | ------------------ |
| [Node.js](https://nodejs.org/)                        | 18+          | TypeScript lab     |
| [Java JDK](https://adoptium.net/)                     | 17+          | Java lab           |
| [Git](https://git-scm.com/)                           | Latest       | Version control    |
| [GitHub Copilot](https://github.com/features/copilot) | Subscription | AI code generation |

### Java Installation (Windows)

1. Download [Microsoft OpenJDK 17](https://learn.microsoft.com/en-us/java/openjdk/download) or [Eclipse Temurin 17](https://adoptium.net/)
2. Run the installer (ensure "Set JAVA_HOME" is checked)
3. Verify installation:
   ```powershell
   java -version
   $env:JAVA_HOME
   ```
4. If `JAVA_HOME` is not set, add it manually:

   ```powershell
   # Find your Java installation path first
   $env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"

   # To set permanently (run as Administrator):
   [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot", "Machine")
   ```

### VS Code Setup

#### Required Extensions

Install these extensions for full support:

| Extension ID                  | Purpose               |
| ----------------------------- | --------------------- |
| `GitHub.copilot`              | AI code generation    |
| `GitHub.copilot-chat`         | AI chat interface     |
| `vscjava.vscode-java-pack`    | Java language support |
| `vmware.vscode-boot-dev-pack` | Spring Boot support   |

**Quick install via command palette (`Ctrl+Shift+P`):**

```
ext install GitHub.copilot GitHub.copilot-chat vscjava.vscode-java-pack vmware.vscode-boot-dev-pack
```

**Or via terminal:**

```powershell
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat
code --install-extension vscjava.vscode-java-pack
code --install-extension vmware.vscode-boot-dev-pack
```

### Alternative: IntelliJ IDEA

- Install [IntelliJ IDEA](https://www.jetbrains.com/idea/) (Community or Ultimate)
- Install plugin: GitHub Copilot (Settings → Plugins → Marketplace)
- Java and Maven support is built-in

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

### Prerequisites

Ensure `JAVA_HOME` is set before running Maven commands:

**Windows PowerShell:**

```powershell
# Check if JAVA_HOME is set
$env:JAVA_HOME

# If not set, find your Java installation and set it:
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
# Or wherever your Java 17+ is installed
```

**Linux/macOS:**

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
```

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

> **Important:** Run the server in a **separate terminal window** so it doesn't block other commands.

**Windows - Open a new PowerShell window:**

```powershell
cd java-server
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
.\mvnw.ps1 spring-boot:run
```

**Linux/macOS:**

```bash
cd java-server
./mvnw spring-boot:run
```

**Verify the server is running:**

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/actuator/health"
```

Open the UI: http://localhost:8080/

### 4. Test

Run tests in a separate terminal (server doesn't need to be running):

```powershell
cd java-server
.\mvnw.ps1 test
```

### 5. Evaluate

In Copilot Chat:

```
Assess the calculator REST API for best practices, adherence to our guidelines
for style, testing and requirements. Give a grade (A, B, C, D, F).

Include sections for security, input validation, maintainability.
```

### Stopping the Server

Press `Ctrl+C` in the terminal running the server, or:

```powershell
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force
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

| Command                                      | Description              |
| -------------------------------------------- | ------------------------ |
| `cd java-server; .\mvnw.ps1 spring-boot:run` | Start Spring Boot server |
| `cd java-server; .\mvnw.ps1 test`            | Run tests                |
| `.\scripts\reset-java.ps1`                   | Clean build artifacts    |
| `.\scripts\reset-java.ps1 -RemoveFeatures`   | Remove generated code    |

> **Tip:** On Windows, use `.\mvnw.ps1` instead of `./mvnw` for proper PowerShell execution.

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

## Troubleshooting

### JAVA_HOME not set

If you get errors about `JAVA_HOME`, set it before running Maven:

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
```

### Port already in use

If port 8080 is in use, stop the existing Java process:

```powershell
Get-Process -Name java | Stop-Process -Force
```

### Server blocking terminal

Always run the Spring Boot server in a **separate terminal window** so you can run other commands.

---

## License

MIT
