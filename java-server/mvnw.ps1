<# : batch script
@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF)
@REM ----------------------------------------------------------------------------
@echo off
@REM Maven Wrapper script for Windows PowerShell
powershell -noprofile -file "%~dpn0.ps1" %*
@goto :eof
: end batch / begin powershell #>

# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.

param (
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$MavenArgs
)

$ErrorActionPreference = "Stop"

$WRAPPER_PROPERTIES = ".mvn\wrapper\maven-wrapper.properties"
$MAVEN_PROJECTBASEDIR = $PSScriptRoot

if (-not (Test-Path "$MAVEN_PROJECTBASEDIR\$WRAPPER_PROPERTIES")) {
    Write-Error "Maven wrapper properties not found at: $MAVEN_PROJECTBASEDIR\$WRAPPER_PROPERTIES"
    exit 1
}

# Read wrapper properties
$properties = Get-Content "$MAVEN_PROJECTBASEDIR\$WRAPPER_PROPERTIES" | Where-Object { $_ -match "=" } | ForEach-Object {
    $key, $value = $_ -split "=", 2
    @{ $key.Trim() = $value.Trim() }
}

$distributionUrl = ($properties | Where-Object { $_.ContainsKey("distributionUrl") })["distributionUrl"]

if (-not $distributionUrl) {
    Write-Error "distributionUrl not found in wrapper properties"
    exit 1
}

$MAVEN_HOME = "$env:USERPROFILE\.m2\wrapper\dists"
$fileName = [System.IO.Path]::GetFileNameWithoutExtension($distributionUrl)
$MAVEN_HOME = "$MAVEN_HOME\$fileName"

if (-not (Test-Path "$MAVEN_HOME\bin\mvn.cmd")) {
    Write-Host "Downloading Maven from: $distributionUrl"
    $zipFile = "$env:TEMP\maven-wrapper.zip"
    
    try {
        Invoke-WebRequest -Uri $distributionUrl -OutFile $zipFile -UseBasicParsing
    } catch {
        Write-Error "Failed to download Maven: $_"
        exit 1
    }
    
    Write-Host "Extracting Maven..."
    if (-not (Test-Path $MAVEN_HOME)) {
        New-Item -ItemType Directory -Path $MAVEN_HOME -Force | Out-Null
    }
    
    Expand-Archive -Path $zipFile -DestinationPath $MAVEN_HOME -Force
    
    # Move contents up one level if needed
    $extractedDir = Get-ChildItem -Path $MAVEN_HOME -Directory | Select-Object -First 1
    if ($extractedDir) {
        Get-ChildItem -Path $extractedDir.FullName | Move-Item -Destination $MAVEN_HOME -Force
        Remove-Item $extractedDir.FullName -Force -Recurse -ErrorAction SilentlyContinue
    }
    
    Remove-Item $zipFile -Force -ErrorAction SilentlyContinue
}

$env:MAVEN_HOME = $MAVEN_HOME
$mvnCmd = "$MAVEN_HOME\bin\mvn.cmd"

if (-not (Test-Path $mvnCmd)) {
    Write-Error "Maven executable not found at: $mvnCmd"
    exit 1
}

Push-Location $MAVEN_PROJECTBASEDIR
try {
    & $mvnCmd $MavenArgs
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
