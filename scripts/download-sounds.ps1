# Create the sounds directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "public/sounds"

# Download sound files from freesound.org (all under Creative Commons license)
$sounds = @{
    "video-game-retro-click.mp3" = "https://cdn.freesound.org/sounds/406/406-click-1.mp3"
    "game-level-completed.mp3" = "https://cdn.freesound.org/sounds/270/270404-game-complete.mp3"
    "arcade-mechanical-bling.mp3" = "https://cdn.freesound.org/sounds/434/434479-game-over.mp3"
    "player-losing.mp3" = "https://cdn.freesound.org/sounds/142/142608-error.mp3"
}

foreach ($sound in $sounds.GetEnumerator()) {
    $outFile = "public/sounds/$($sound.Key)"
    Write-Host "Downloading $($sound.Key)..."
    
    try {
        $ProgressPreference = 'SilentlyContinue'  # This makes the download faster
        Invoke-WebRequest -Uri $sound.Value -OutFile $outFile -UseBasicParsing
        Write-Host "Successfully downloaded $($sound.Key)"
    }
    catch {
        Write-Host "Failed to download $($sound.Key): $_"
    }
}

Write-Host "Sound file download process completed!" 