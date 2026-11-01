# UE Debate and Speech Society — Animated Website

A static GitHub Pages website designed to match the red, cream, and typography-first UE DebSSoc Canva website. No coding framework or paid hosting required.

## Files

- `index.html` — Home, About Us, Programs, Featured Events, Gallery, External Engagements, Membership, Contact
- `debate.html` — Debate & Argumentation page
- `speech.html` — Speech & Oratory page
- `leadership.html` — Leadership & Communication page
- `styles.css` — responsive design and animations
- `script.js` — accessible menu, anchor navigation, photos, scroll animations, progress bar
- `images/` — existing DebSSoc and University of the East logos

## Six included animations

1. **Scroll reveal:** content gently rises into view; only used with IntersectionObserver; never hides content if JavaScript is disabled.
2. **Smooth navigation:** anchors land below the sticky header; same-page nav links work from `/` and `/index.html`.
3. **Animated opening:** four staggered hero lines and subtle supporting-content entrance, also on program pages.
4. **Interactive cards:** program, gallery, and information cards respond to hover and keyboard focus.
5. **Parallax photos:** lightweight `requestAnimationFrame` updates of uploaded images, only while visible; posters stay uncropped.
6. **Scroll progress bar:** a narrow red/gold bar at the top indicates reading progress.

All motion respects the visitor's **Reduce Motion** accessibility setting. Animations are mobile-responsive and avoid dependencies.

## Upload to GitHub Pages

1. Open your repository on `github.com`, not `github.dev`.
2. Choose **Add file > Upload files**.
3. Extract `UE_DebSSoc_Animated_Update.zip`, then upload these six files to the repository root: `index.html`, `debate.html`, `speech.html`, `leadership.html`, `styles.css`, `script.js`.
4. Commit changes to `main`. Do **not** delete your existing `images` folder.
5. Refresh your GitHub Pages URL with Ctrl+Shift+R after the publishing action finishes.

Full-backup ZIP also includes the two official logo images.

## Add real photos without editing code

Upload these files to `images/` when ready:

- `hero-photo.jpg` — homepage hero (landscape recommended)
- `society-photo.jpg` — About Us photo
- `voice-of-valor-poster.jpg` — event poster (shown uncropped)
- `gallery-1.jpg` through `gallery-6.jpg` — gallery photos

Recommended: compress large photographs to 200–700 KB where possible for faster mobile loading. Missing images automatically display the original Canva-style placeholders. The two logos are expected at `images/debssoc-logo.png` and `images/ue-logo.png`.

To change headline text, dates, or sections: edit `index.html`. To change colors, edit CSS variables at the top of `styles.css`. To tune animation duration, see the bottom `ANIMATION ENHANCEMENTS` section of the CSS file.

## Notes

- No JavaScript libraries, Node.js, or npm required.
- Existing program links and hamburger navigation retained.
- The website is independent of Canva; changes in Canva do not automatically sync to GitHub Pages.
