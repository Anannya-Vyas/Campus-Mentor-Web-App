# 🎵 Music Player - Now Available Throughout App!

## ✅ Pages with Music Player (DONE)

1. **index.html** - Splash screen ✅
2. **pages/student-dashboard.html** - Main dashboard ✅
3. **pages/games.html** - Mind games ✅

## 📋 To Add Music Player to Remaining Pages

Copy this code to each page:

### In `<head>` section:
```html
<link rel="stylesheet" href="../styles/music-player.css">
```

### Right after `<body>` tag:
```html
<!-- Music Player -->
<div class="music-player" id="musicPlayer">
    <i class="fas fa-music"></i>
    <span>Chill Lofi</span>
    <button id="musicPrev"><i class="fas fa-backward"></i></button>
    <button id="musicToggle"><i class="fas fa-play"></i></button>
    <button id="musicNext"><i class="fas fa-forward"></i></button>
    <button id="musicSelect"><i class="fas fa-list"></i></button>
</div>

<!-- Track Selector -->
<div id="trackSelector">
    <h3>🎵 Select Music</h3>
    <div class="track-option active" onclick="window.musicPlayer.selectTrack(0)">
        <i class="fas fa-music"></i><span>Chill Lofi</span>
    </div>
    <div class="track-option" onclick="window.musicPlayer.selectTrack(1)">
        <i class="fas fa-brain"></i><span>Focus Music</span>
    </div>
    <div class="track-option" onclick="window.musicPlayer.selectTrack(2)">
        <i class="fas fa-book"></i><span>Study Beats</span>
    </div>
    <div class="track-option" onclick="window.musicPlayer.selectTrack(3)">
        <i class="fas fa-piano"></i><span>Relaxing Piano</span>
    </div>
    <div class="track-option" onclick="window.musicPlayer.selectTrack(4)">
        <i class="fas fa-cloud"></i><span>Ambient Chill</span>
    </div>
    <div class="track-option" onclick="window.musicPlayer.selectTrack(5)">
        <i class="fas fa-bolt"></i><span>Upbeat Energy</span>
    </div>
</div>
```

### Before `</body>` tag:
```html
<script src="../scripts/music.js"></script>
```

## 📝 Remaining Pages to Update:

- [ ] pages/login.html
- [ ] pages/signup.html
- [ ] pages/community.html
- [ ] pages/marketplace.html
- [ ] pages/todo.html
- [ ] pages/diet-planner.html
- [ ] pages/alarm.html
- [ ] pages/chat.html
- [ ] pages/video-call.html
- [ ] pages/teacher-dashboard.html
- [ ] pages/teacher-profile.html
- [ ] pages/find-teachers.html

## 🎮 How Music Player Works:

1. **Play/Pause** - Click ▶/⏸ button
2. **Next Track** - Click ▶ button
3. **Previous Track** - Click ◀ button
4. **Select Track** - Click ☰ button to see all 6 tracks
5. **Auto-continues** - Music keeps playing when you navigate between pages

## 🎵 Available Tracks:

1. Chill Lofi
2. Focus Music
3. Study Beats
4. Relaxing Piano
5. Ambient Chill
6. Upbeat Energy
