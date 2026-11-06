# Aswin Kumar — Cybersecurity & Ethical Hacking Portfolio

A production-quality, high-performance, single-page animated portfolio website engineered for **Aswin Kumar** (Aspiring Ethical Hacker | Cybersecurity Enthusiast). Designed to impress tech recruiters and security internship managers while capturing an authentic, cinematic cyber-hacker aesthetic.

---

## ⚡ Key Highlights & Features

- **Cinematic Cyber HUD & Dark Theme**: Deep dark void `#05070a`, electric cyber green `#00ff9c`, cyan `#00e5ff`, and purple `#7c3aed` accents with glassmorphism, subtle CRT scanlines, and high contrast.
- **Boot-Up Terminal Preloader**: Simulates a high-tech boot sequence (`[SYSTEM_INIT]`, `[KERNEL]`, `[CLEARANCE: GRANTED]`) with an instant `[SKIP BOOT]` option and `ESC` key support.
- **Dual Interactive Background Canvas**: Custom lightweight canvas engine supporting real-time particle network mesh and Matrix digital rain with zero external heavy frameworks.
- **Simulated In-Browser Terminal (`sec-cli v1.0.4`)**: Interactive bash simulator supporting `help`, `whoami`, `skills`, `projects`, `education`, `contact`, `matrix`, `theme`, `cat mission.txt`, `sudo` easter eggs, tab autocomplete, and clickable suggestion chips for mobile users.
- **Smooth Animations**:
  - Lenis smooth scrolling with GSAP ScrollTrigger sync.
  - Text scramble / decode effect on section titles.
  - Typewriter header cycling through technical titles.
  - 3D parallax tilt and scanning laser line on the cyber avatar photo.
  - 3D card tilt with cursor-following radial spotlight glow on project cards.
  - Animated skill meters and stat counters.
- **Security Write-ups Reader**: Built-in modal reader for technical deep-dives (SQL Injection, Nmap, OWASP Top 10, Linux Hardening).
- **Easter Eggs**: Konami Code (`↑ ↑ ↓ ↓ ← → ← → B A`) activates "Cyber God Mode" and matrix streaming; `sudo` in the terminal outputs a witty security alert.
- **Accessibility & SEO**: WCAG AA color contrast, `prefers-reduced-motion` compliance, mobile-first responsive layout (320px to 4K), Schema.org Person JSON-LD, and Open Graph tags.

---

## 📁 Project Structure

```
Portfolio/
├── assets/
│   ├── aswin.jpg         # Professional headshot (1254x1254 formal blazer)
│   ├── aswin.jpeg        # Original asset backup
│   └── favicon.svg       # Glowing cyber shield SVG favicon
├── css/
│   └── style.css         # Complete cyber design system, tokens, and responsive styles
├── js/
│   ├── cyber-canvas.js   # Interactive particle mesh & matrix rain canvas engine
│   ├── terminal.js       # In-browser CLI sandbox logic and commands
│   └── main.js           # Preloader, Lenis, GSAP, modals, forms & easter eggs
├── index.html            # Semantic, SEO-optimized single-page structure
└── README.md             # Customization, local preview, and deployment guide
```

---

## 🛠️ Local Development & Preview

Because the site uses standard vanilla web standards, you can preview it immediately without installing heavy dependencies:

### Option 1: Python HTTP Server (Built-in)
```bash
# In the portfolio directory:
python -m http.server 3000
```
Then open `http://localhost:3000` in your web browser.

### Option 2: Node.js `npx serve`
```bash
npx -y serve .
```

### Option 3: VS Code / Antigravity Live Server
Right-click `index.html` and click **Open with Live Server**.

---

## ✏️ Customization Checklist for Aswin

Search for `[PLACEHOLDER` in `index.html`, `js/terminal.js`, and `js/main.js` to customize:

1. **Contact Information**:
   - Update `aswin.cybersec@example.com` to your real personal/college email address in `index.html:L473` and `js/terminal.js:L299`.
   - Update `github.com/[PLACEHOLDER_USER]` with your exact GitHub username.
   - Update `linkedin.com/in/[PLACEHOLDER_USER]` with your exact LinkedIn profile URL.
2. **Hackathon Experience**:
   - Replace `[PLACEHOLDER: Hackathon Event Name]` in Section 05 (`#experience`) with the specific hackathon you attended (e.g. Smart India Hackathon, College Hackfest 2025).
   - Add dates and team roles (e.g. Lead Prototyper).
3. **Practice Statistics & Cyber Labs**:
   - In Section 06 (`#cyber-lab`), update the `data-target="25"` attribute on the TryHackMe card with your exact number of completed rooms.
   - Update your TryHackMe ranking percentage if desired.
4. **Resume File**:
   - Place your official `Aswin_Kumar_Resume.pdf` in the `assets/` directory and update the link in `.btn-resume` or within `js/main.js`.

---

## 🚀 Deployment Guide

### 1. GitHub Pages (Free & Recommended)
1. Repository is already initialized and committed on `main`.
2. Create an empty new repository on [GitHub](https://github.com/new) named `portfolio`.
3. Push to GitHub:
   ```bash
   git push -u origin main
   ```
4. Go to **Settings** > **Pages** in your GitHub repository.
5. Under **Branch**, select `main` and root `/`, then click **Save**.
6. Your live site will be ready at `https://aswin1327.github.io/portfolio/`.

### 2. Netlify (Drag and Drop / Git)
1. Go to [app.netlify.com](https://app.netlify.com/).
2. Drag and drop the `Portfolio` folder directly into the Netlify dashboard, OR link your GitHub repository.
3. Publish directory: `./` (root).
4. Instant deployment with automatic SSL certificate and custom domain support!

### 3. Vercel
1. Run `npx vercel` in the project directory, or import your GitHub repository at [vercel.com](https://vercel.com).
2. Framework Preset: **Other**.
3. Root Directory: `./`.
4. Click **Deploy**.

---

## 🔒 Security & Ethics Disclosure
All visual elements, animations, and in-browser terminal commands (`sec-cli`) on this portfolio are 100% client-side simulations intended for educational showcase and portfolio presentation. No exploit code, automated network attacks, or unauthorized penetration testing tools exist in this codebase.
