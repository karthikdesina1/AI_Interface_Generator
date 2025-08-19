# AI_Interface_Generator

AI-driven interface generation framework — Internship Project

---

## Project Overview

This is a modular, **AI-powered prompt code generator**. Enter a prompt (e.g., “Create a responsive navbar”) and the app instantly renders a working snippet with basic syntax highlighting plus **Copy**/**Download** actions. The platform includes a **searchable Prompt Library**, dynamic component injection with **graceful error handling**, a **mobile header menu**, and a clean, accessible UI.
---
## How to Run This Project

1) **Install VS Code**  
   https://code.visualstudio.com/

2) **Open the project folder**  
   VS Code → **File → Open Folder…** → select this repo.

3) **Use Live Server (recommended)**  
   - Install the **Live Server** extension.  
   - Right-click **`Welcome.html`** and choose **Open with Live Server**.  
   - The app opens at something like `http://localhost:5500/`.  
   - Always use `http://localhost…` (not `file://`) so clipboard and fetch work reliably.

> **Tip:** Hard-refresh while developing (Cmd/Ctrl+Shift+R) to bypass cache.
---
## Project Structure
AI_INTERFACE_GENERATOR/
├── public/
│ ├── Welcome.html
│ ├── CodeGenerator.html
│ ├── PromptLibrary.html
│ ├── Login.html
│ ├── Signup.html
│ └── src/
│ ├── components/
│ │ ├── Header.html
│ │ ├── Footer.html
│ │ ├── GeneratorForm.html
│ │ ├── OutputBox.html
│ │ ├── InfoRow.html
│ │ ├── SearchBar.html
│ │ └── CTAButton.html
│ └── scripts/
│ ├── generator.js
│ ├── promptLibrary.js
│ └── headerMenu.js
├── docs/ # Documentation / weekly reports
└── README.md

> Pages dynamically fetch components from `src/components/`. If a fetch fails, an inline **role="alert"** message appears instead of crashing the UI.

---

## Final Site Map

- **Welcome / Landing**
- **Code Generator**
  - GeneratorForm (input + generate)
  - OutputBox (code preview + copy/download)
  - InfoRow (tips/help)
- **Prompt Library**
  - SearchBar (live, debounced filter)
  - Grid of prompt cards (rendered by JS)
- **Login / Signup**
- *(Optional)* Dashboard / Profile / FAQ / Settings

---

## Code Generation Pipeline

1. **Prompt Input** – User provides a description (min length enforced).  
2. **Trigger & Spinner** – **Generate Code** starts processing with a loader.  
3. **Render & Highlight** – Code appears in OutputBox with lightweight highlighting and scrollable overflow.  
4. **User Actions** – **Copy** (cross-browser fallback) and **Download** (`.txt`) with confirmation.  
5. **Error Handling** – Invalid input or simulated failures show friendly inline messages; UI never crashes.

---

## Feature Checklist

- [x] Mobile-first, no page-level horizontal scroll (tested at **375 / 390 / 414 / 768 / 1024 / 1280 / 1440**).  
- [x] **Prompt Library search**: debounced, case-insensitive; graceful “No prompts match” state.  
- [x] Generator validation for empty/short/whitespace prompts.  
- [x] Spinner during generation; safe HTML escaping to prevent injection.  
- [x] Copy/Download with fallbacks; success feedback.  
- [x] **Dynamic component loading** with try/catch + inline accessible error banners (`role="alert" aria-live="assertive"`).  
- [x] **Mobile header menu** (hamburger toggle) + desktop navigation.  
- [x] **Accessibility**: “Skip to content” link, `id="main"` on each page, `aria-busy` on long actions, visible focus rings.  
- [x] Cross-browser sanity: Chrome, Edge, Firefox.

---

## How to Test (Quick Pass)

- **Generator**
  - Empty/short prompt → inline error (announced via `aria-live`).  
  - Normal prompt (“navbar/pricing/login”) → spinner then code output; Copy/Download enabled.  
  - Include “error/fail/network” in prompt → friendly failure banner; no crash.
- **Prompt Library**
  - Search “responsive / pricing / contact / login” → filtered cards.  
  - Nonsense query → “No prompts match your search.”
- **Offline / Slow 3G**
  - Temporarily toggle **Offline** in DevTools → component loaders show inline red failure boxes.
- **Keyboard / A11y**
  - **Tab** once → “Skip to content” appears; **Enter** jumps to the page’s `<main>`.  
  - Focus states visible; tab order logical.

---

## Notes & Troubleshooting

- **Open via Live Server** (or any static server). Opening with `file://` can block clipboard and fetch.  
- **Tailwind via CDN** is fine for development. For production builds, compile with Tailwind CLI/PostCSS to remove the CDN warning.  
- **Favicon**: pages use a safe placeholder —  
  ```html
  <link rel="icon" href="data:,">
This avoids 404s for /favicon.ico. Replace with a real icon anytime.

# Common fixes

Seeing an inline red “Failed to load …” box? Check the component path (case-sensitive) or run a server.

Clipboard denied? Ensure you’re on http://localhost (secure context) and click the page before copying.

Deployment

Deploy as a static site (Netlify, Vercel, GitHub Pages).

Optionally replace the Tailwind CDN with a compiled CSS bundle for best performance.

Credits

Developed by Karthik Desina
Internship: EIM NetTech (July–September 2025)