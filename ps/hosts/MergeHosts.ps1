[string[]]$Sources = @()

<# MAKE TEMP DIRECTORY FOR HOST FILES #>

if (-not (Test-Path ".\TMP-HOSTS\")) {
  New-Item -name "TMP-HOSTS" -type directory | Out-Null
}

<# DOWNLAOD HOSTS FILES #>

function Donwload-And-Filter-Hosts([string]$URL, [string]$FileName)
{
  Write-Host (-join ("Downloading Hosts File (", $FileName, ")"))
  Invoke-WebRequest -Uri $URL -OutFile (-join (".\TMP-HOSTS\", $FileName, "-hosts.txt"))
  Write-Host (-join ("Formatting Hosts File (", $FileName, ")"))
  (Get-Content (-join (".\TMP-HOSTS\", $FileName, "-hosts.txt"))) -Replace '0.0.0.0', '127.0.0.1' | Where-Object { $_ -notmatch "^#" -and $_.trim() -ne "" } | Set-Content (-join (".\TMP-HOSTS\", $FileName, "-hosts-filtered.txt"))
  Write-Host " "
  $script:Sources += $URL
}

Donwload-And-Filter-Hosts "https://adaway.org/hosts.txt" "adaway"
Donwload-And-Filter-Hosts "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts" "StevenBlack"
Donwload-And-Filter-Hosts "https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext" "Yoyos"
Donwload-And-Filter-Hosts "https://winhelp2002.mvps.org/hosts.txt" "MVP"

# Donwload-And-Filter-Hosts "https://sysctl.org/cameleon/hosts" "Cameleon"
# Donwload-And-Filter-Hosts "https://someonewhocares.org/hosts/hosts" "someonewhocares"
# Donwload-And-Filter-Hosts "https://www.malwaredomainlist.com/hostslist/hosts.txt" "malwaredomainlist"
# Donwload-And-Filter-Hosts "https://www.hostsfile.org/Downloads/hosts.txt" "hostsfileorg"
# Donwload-And-Filter-Hosts "https://raw.githubusercontent.com/lewisje/jansal/master/adblock/hosts" "jansal"
# Donwload-And-Filter-Hosts "https://logroid.github.io/blogger/file/hosts.txt" "logroid"
# Donwload-And-Filter-Hosts "https://raw.githubusercontent.com/eladkarako/hosts/master/build/hosts.txt" "eladkarako"
# Donwload-And-Filter-Hosts "https://raw.githubusercontent.com/yous/YousList/master/hosts.txt" "YousList"

<# MERGE HOST FILES #>

function Generate-Text-Info
{
  $Date = Get-Date
  $TextInfo = (-join ("# Simple hosts merge script by AQtun`n# https://github.com/AQtun81/aqtun81.github.io/blob/master/ps/hosts`n# Generated: ", $Date, "`n# Used Sources:"))

  for ($i = 0; $i -lt $script:Sources.Count; $i++) {
    $TextInfo += (-join ("`n# ", $script:Sources[$i]))
  }

  return $TextInfo
}

Write-Host "------------------------"
Write-Host "Merging final hosts file"

if (Test-Path ".\hosts") {
  Remove-Item .\hosts -Force
}

Add-Content .\hosts (Generate-Text-Info)

(Get-Content TMP-HOSTS\*-hosts-filtered.txt) -Replace '[" "\t]*#.*', '' -Replace '  ', ' ' | Sort-Object | Get-Unique | Add-Content -Path .\hosts

<# REMOVE TEMP DIRECTORY FOR HOST FILES #>

Remove-Item .\TMP-HOSTS -Recurse -Force