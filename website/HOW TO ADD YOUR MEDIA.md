# How to Add Your Photos, Video & Music to the Website

## Music (MP3) — Most Important Right Now

1. Find your MP3 file on your computer
2. Copy it into this folder: `website/music/`
3. Rename the file to exactly: `theme.mp3`
   - OR tell Claude the exact filename and Claude will update the code
4. Open `index.html` in your browser — the music player will appear in the bottom-right corner

The music player:
- Has a Play/Pause button (gold circle, bottom-right of screen)
- Shows the song title "Housing for Heroes Theme"
- Has a progress bar
- Can be closed with the X button
- Tries to start playing after the user first clicks anywhere on the page

---

## Hero Background Photo

Add a dramatic, high-resolution photo of veterans, a concert, or the tour.

1. Save your photo as: `images/hero-bg.jpg`
2. Recommended: 1920x1080 pixels or larger, landscape orientation
3. The website will automatically display it as the full-screen background

---

## Mission Section Photo

A photo showing the mission — veterans, housing, or the band.

1. Save as: `images/mission.jpg`
2. Recommended: 800x600 pixels or larger

---

## Background Video (Optional — makes site very dramatic)

If you have a video of the tour, a concert, or veterans:

1. Save as: `video/hero.mp4`
2. The website will automatically use it as an animated background behind the hero text
3. Keep file size under 20MB for fast loading

---

## Partner Logos

Add actual logos for your media partners (Live It Up TV, Rock Rage Radio, etc.):
- Save logo files in `images/` folder
- Tell Claude which logo is which and Claude will add them to the Partners section

---

## Opening the Website

Double-click `index.html` to open it in your browser.
It works completely offline — no internet needed except for the Google Fonts (the nice lettering).

---

## To Deploy Online (make it live on the internet)

Options:
1. **Netlify** — free, drag and drop the whole `website/` folder at netlify.com
2. **GitHub Pages** — free hosting, Claude can set this up
3. **Railway** — same place as your Quantum Compete AI app
4. **Custom domain** — if you have www.PhoenixxRisingVentures.com, point it here
