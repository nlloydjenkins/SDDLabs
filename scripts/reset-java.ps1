<#
.SYNOPSIS
    Resets the Java/Spring Boot lab by removing generated code and build artifacts.

.DESCRIPTION
    This script removes generated calculator code from the java-server project
    while preserving the base Application.java and configuration files.
    
    Requirements documents and style guides are always preserved.

.PARAMETER SkipBuild
    If specified, skips the Maven build step after cleanup.

.PARAMETER RemoveFeatures
    If specified, removes generated feature code (calculator package).

.EXAMPLE
    .\reset-java.ps1
    Cleans build artifacts only.

.EXAMPLE
    .\reset-java.ps1 -RemoveFeatures
    Removes generated calculator code and cleans build artifacts.
#>

param(
    [switch]$SkipBuild,
    [switch]$RemoveFeatures
)

$ErrorActionPreference = "SilentlyContinue"

# Get script directory and project root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$javaServerDir = Join-Path $projectRoot "java-server"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SDDLabs Java Reset Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if java-server exists
if (-not (Test-Path $javaServerDir)) {
    Write-Host "Error: java-server directory not found at $javaServerDir" -ForegroundColor Red
    exit 1
}

Push-Location $javaServerDir

try {
    # --- Remove Maven build artifacts ---
    Write-Host "[1/3] Removing Maven build artifacts..." -ForegroundColor Yellow
    
    $buildPaths = @(
        "target"
    )
    
    foreach ($path in $buildPaths) {
        if (Test-Path $path) {
            Write-Host "  Removing: $path" -ForegroundColor Gray
            Remove-Item -Recurse -Force $path
        }
    }
    Write-Host "  Done." -ForegroundColor Green

    # --- Remove IDE-specific files ---
    Write-Host "[2/3] Removing IDE artifacts..." -ForegroundColor Yellow
    
    $idePaths = @(
        ".idea",
        "*.iml",
        ".settings",
        ".classpath",
        ".project",
        ".factorypath"
    )
    
    foreach ($pattern in $idePaths) {
        $items = Get-ChildItem -Path . -Filter $pattern -Recurse -ErrorAction SilentlyContinue
        foreach ($item in $items) {
            Write-Host "  Removing: $($item.FullName)" -ForegroundColor Gray
            Remove-Item -Recurse -Force $item.FullName
        }
    }
    Write-Host "  Done." -ForegroundColor Green

    # --- Optionally remove generated feature code ---
    if ($RemoveFeatures) {
        Write-Host "" -ForegroundColor Yellow
        Write-Host "========================================" -ForegroundColor Magenta
        Write-Host "  Removing Generated Feature Code" -ForegroundColor Magenta
        Write-Host "========================================" -ForegroundColor Magenta
        Write-Host ""

        # Define feature mappings
        $featureMappings = @(
            @{
                Name            = "Calculator"
                RequirementsDoc = "..\docs\java-calcreqs"
                GeneratedCode   = @(
                    "src\main\java\com\sddlabs\calculator",
                    "src\test\java\com\sddlabs\calculator"
                )
            }
        )

        foreach ($feature in $featureMappings) {
            $reqPath = Join-Path $javaServerDir $feature.RequirementsDoc
            $hasRequirements = Test-Path $reqPath
            
            if ($hasRequirements) {
                Write-Host "Feature: $($feature.Name)" -ForegroundColor Cyan
                Write-Host "  Requirements: $($feature.RequirementsDoc) (preserved)" -ForegroundColor Gray
                
                foreach ($codePath in $feature.GeneratedCode) {
                    $fullPath = Join-Path $javaServerDir $codePath
                    if (Test-Path $fullPath) {
                        Write-Host "  Removing: $codePath" -ForegroundColor Gray
                        Remove-Item -Recurse -Force $fullPath
                    }
                    else {
                        Write-Host "  Not found: $codePath (already removed)" -ForegroundColor DarkGray
                    }
                }
            }
        }

        Write-Host ""
        Write-Host "Feature code removed. Requirements documents preserved." -ForegroundColor Green
    }

    # --- Run Maven clean ---
    if (-not $SkipBuild) {
        Write-Host "[3/3] Running Maven clean..." -ForegroundColor Yellow
        
        # Check if Maven wrapper exists
        if (Test-Path "mvnw.cmd") {
            Write-Host "  Running: .\mvnw.cmd clean" -ForegroundColor Gray
            & .\mvnw.cmd clean
        }
        elseif (Get-Command mvn -ErrorAction SilentlyContinue) {
            Write-Host "  Running: mvn clean" -ForegroundColor Gray
            & mvn clean
        }
        else {
            Write-Host "  Maven not found. Skipping clean step." -ForegroundColor Yellow
            Write-Host "  Install Maven or use the Maven wrapper." -ForegroundColor Yellow
        }
        Write-Host "  Done." -ForegroundColor Green
    }
    else {
        Write-Host "[3/3] Skipping Maven clean (-SkipBuild specified)." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Java Reset Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    if ($RemoveFeatures) {
        Write-Host "  1. Ask Copilot to create the calculator feature:" -ForegroundColor Gray
        Write-Host "     'Create the calculator REST API based on docs/java-calcreqs/reqs.md'" -ForegroundColor DarkGray
        Write-Host "  2. Run: cd java-server && mvnw spring-boot:run" -ForegroundColor Gray
        Write-Host "  3. Test: curl http://localhost:8080/actuator/health" -ForegroundColor Gray
    }
    else {
        Write-Host "  1. Run: cd java-server && mvnw spring-boot:run" -ForegroundColor Gray
        Write-Host "  2. Test: curl http://localhost:8080/actuator/health" -ForegroundColor Gray
    }
    Write-Host ""

}
finally {
    Pop-Location
}
