<#
.SYNOPSIS
    Resets the SDDLabs application by removing build artifacts and dependencies.

.DESCRIPTION
    This script removes node_modules, build outputs, caches, and lock files
    to allow a fresh installation and rebuild of the application.
    
    Use -RemoveFeatures to also remove generated feature code (e.g., calculator)
    so you can recreate them from the requirements documents.

.PARAMETER SkipInstall
    If specified, skips the npm install step after cleanup.

.PARAMETER IncludeLockFiles
    If specified, also removes package-lock.json files.

.PARAMETER RemoveFeatures
    If specified, removes generated feature code created from docs/ requirements.
    This allows you to recreate features from scratch using the requirements documents.

.EXAMPLE
    .\reset-app.ps1
    Resets the app and reinstalls dependencies.

.EXAMPLE
    .\reset-app.ps1 -SkipInstall
    Resets the app without reinstalling dependencies.

.EXAMPLE
    .\reset-app.ps1 -IncludeLockFiles
    Resets the app including lock files for a completely fresh install.

.EXAMPLE
    .\reset-app.ps1 -RemoveFeatures
    Resets the app AND removes all generated feature code to start fresh.
#>

param(
    [switch]$SkipInstall,
    [switch]$IncludeLockFiles,
    [switch]$RemoveFeatures
)

$ErrorActionPreference = "SilentlyContinue"

# Get script directory and project root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SDDLabs Application Reset Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to project root
Push-Location $projectRoot

try {
    # --- Remove node_modules directories ---
    Write-Host "[1/5] Removing node_modules directories..." -ForegroundColor Yellow
    
    $nodeModulesPaths = @(
        "node_modules",
        "client\node_modules",
        "server\node_modules"
    )
    
    foreach ($path in $nodeModulesPaths) {
        if (Test-Path $path) {
            Write-Host "  Removing: $path" -ForegroundColor Gray
            Remove-Item -Recurse -Force $path
        }
    }
    Write-Host "  Done." -ForegroundColor Green

    # --- Remove build outputs ---
    Write-Host "[2/5] Removing build outputs..." -ForegroundColor Yellow
    
    $buildPaths = @(
        "client\dist",
        "server\dist",
        "client\coverage",
        "server\coverage"
    )
    
    foreach ($path in $buildPaths) {
        if (Test-Path $path) {
            Write-Host "  Removing: $path" -ForegroundColor Gray
            Remove-Item -Recurse -Force $path
        }
    }
    Write-Host "  Done." -ForegroundColor Green

    # --- Remove cache directories ---
    Write-Host "[3/5] Removing cache directories..." -ForegroundColor Yellow
    
    $cachePaths = @(
        "client\.vite",
        "client\node_modules\.vite",
        ".npm",
        "client\.vitest"
    )
    
    foreach ($path in $cachePaths) {
        if (Test-Path $path) {
            Write-Host "  Removing: $path" -ForegroundColor Gray
            Remove-Item -Recurse -Force $path
        }
    }
    Write-Host "  Done." -ForegroundColor Green

    # --- Remove TypeScript build info ---
    Write-Host "[4/5] Removing TypeScript build info..." -ForegroundColor Yellow
    
    $tsBuildInfo = Get-ChildItem -Path . -Filter "*.tsbuildinfo" -Recurse -ErrorAction SilentlyContinue
    foreach ($file in $tsBuildInfo) {
        Write-Host "  Removing: $($file.FullName)" -ForegroundColor Gray
        Remove-Item -Force $file.FullName
    }
    Write-Host "  Done." -ForegroundColor Green

    # --- Optionally remove lock files ---
    if ($IncludeLockFiles) {
        Write-Host "[4b] Removing lock files..." -ForegroundColor Yellow
        
        $lockFiles = @(
            "package-lock.json",
            "client\package-lock.json",
            "server\package-lock.json"
        )
        
        foreach ($file in $lockFiles) {
            if (Test-Path $file) {
                Write-Host "  Removing: $file" -ForegroundColor Gray
                Remove-Item -Force $file
            }
        }
        Write-Host "  Done." -ForegroundColor Green
    }

    # --- Optionally remove generated feature code ---
    if ($RemoveFeatures) {
        Write-Host "" -ForegroundColor Yellow
        Write-Host "========================================" -ForegroundColor Magenta
        Write-Host "  Removing Generated Feature Code" -ForegroundColor Magenta
        Write-Host "========================================" -ForegroundColor Magenta
        Write-Host ""
        Write-Host "This will remove code generated from docs/ requirements." -ForegroundColor Yellow
        Write-Host "Requirements documents will be preserved." -ForegroundColor Yellow
        Write-Host ""

        # Define feature mappings: requirements folder -> generated code folders
        # Add new features here as they are created
        $featureMappings = @(
            @{
                Name            = "Calculator"
                RequirementsDoc = "docs\calcreqs"
                GeneratedCode   = @(
                    "client\src\calculator"
                )
            }
            # Add more features here as needed:
            # @{
            #     Name = "FeatureName"
            #     RequirementsDoc = "docs\featurereqs"
            #     GeneratedCode = @(
            #         "client\src\feature",
            #         "server\src\feature"
            #     )
            # }
        )

        foreach ($feature in $featureMappings) {
            $hasRequirements = Test-Path $feature.RequirementsDoc
            
            if ($hasRequirements) {
                Write-Host "Feature: $($feature.Name)" -ForegroundColor Cyan
                Write-Host "  Requirements: $($feature.RequirementsDoc) (preserved)" -ForegroundColor Gray
                
                foreach ($codePath in $feature.GeneratedCode) {
                    if (Test-Path $codePath) {
                        Write-Host "  Removing: $codePath" -ForegroundColor Gray
                        Remove-Item -Recurse -Force $codePath
                    }
                    else {
                        Write-Host "  Not found: $codePath (already removed)" -ForegroundColor DarkGray
                    }
                }
            }
        }

        # Restore App.tsx from template to remove feature imports/routes
        $appTsxPath = "client\src\App.tsx"
        $appTemplatePath = "client\src\App.template.tsx"
        
        if (Test-Path $appTemplatePath) {
            Write-Host ""
            Write-Host "Restoring App.tsx from template..." -ForegroundColor Yellow
            Copy-Item -Path $appTemplatePath -Destination $appTsxPath -Force
            Write-Host "  App.tsx restored (feature imports/routes removed)" -ForegroundColor Green
        }
        else {
            Write-Host ""
            Write-Host "Warning: App.template.tsx not found." -ForegroundColor Yellow
            Write-Host "         You may need to manually update App.tsx to remove" -ForegroundColor Yellow
            Write-Host "         imports and routes for removed features." -ForegroundColor Yellow
        }

        Write-Host ""
        Write-Host "Feature code removed. Requirements documents preserved." -ForegroundColor Green
        Write-Host ""
    }

    # --- Reinstall dependencies ---
    if (-not $SkipInstall) {
        Write-Host "[5/5] Reinstalling dependencies..." -ForegroundColor Yellow
        Write-Host "  Running: npm run install:all" -ForegroundColor Gray
        Write-Host ""
        
        npm run install:all
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "  Dependencies installed successfully." -ForegroundColor Green
        }
        else {
            Write-Host ""
            Write-Host "  Warning: npm install completed with errors." -ForegroundColor Red
        }
    }
    else {
        Write-Host "[5/5] Skipping dependency installation (use -SkipInstall was specified)." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Reset Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    if ($RemoveFeatures) {
        Write-Host "  1. Ask Copilot to recreate features from docs/ requirements" -ForegroundColor Gray
        Write-Host "  2. Run 'npm run dev' to start development" -ForegroundColor Gray
        Write-Host "  3. Run 'cd client && npm test' to run tests" -ForegroundColor Gray
    }
    else {
        Write-Host "  1. Run 'npm run dev' to start development" -ForegroundColor Gray
        Write-Host "  2. Run 'cd client && npm test' to run tests" -ForegroundColor Gray
    }
    Write-Host ""

}
finally {
    Pop-Location
}
