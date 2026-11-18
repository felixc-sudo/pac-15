# CARBONCUT — Dark & Light Mode Carbon Footprint Tracking & Reduction Portal

Static web application demonstrating **JavaScript Dark & Light Mode** (event-driven `data-theme` DOM toggling, `window.matchMedia('(prefers-color-scheme: dark)')` system detection, and `localStorage` persistence), paired with a **Carbon Footprint Calculator** and a live JavaScript **CRUD** action checklist.

## Files Included
- `index.html` — Root HTML entry point for GitHub Pages and Vercel.
- `carboncut_theme_modes.css` — CSS custom property definitions for Deep-Navy Dark Mode and Crisp Daylight Mode.
- `carboncut_theme_persistence.js` — Theme switcher, `matchMedia` listener, `localStorage` persistence, carbon calculator, and CRUD task array (`addTask()`).
- `vercel.json` — Zero-config Vercel static deployment configuration.

## GitHub & Vercel Deployment Steps
1. Extract `carboncut_dual_theme_portal.zip` and open a terminal inside `carboncut_dual_theme_portal`.
2. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Add CARBONCUT dual-theme portal website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/carboncut-dual-theme-portal.git
   git push -u origin main
   ```
3. Open [vercel.com](https://vercel.com), click **Add New → Project**, import `carboncut-dual-theme-portal`, keep Framework Preset as **Other**, and click **Deploy**.
