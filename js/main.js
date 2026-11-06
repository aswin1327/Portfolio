/**
 * main.js - Core Portfolio Controller
 * Coordinates Preloader, Lenis Smooth Scroll, GSAP ScrollTrigger,
 * Text Decode Scramble, Theme Toggle, Modals, and Easter Eggs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Cyber Background Canvas
  const canvasEl = document.getElementById('cyber-canvas');
  let cyberCanvas = null;
  if (canvasEl && window.CyberCanvas) {
    cyberCanvas = new CyberCanvas('cyber-canvas');
  }

  // 2. Initialize In-Browser Interactive Terminal
  const termEl = document.getElementById('interactive-terminal');
  if (termEl && window.CyberTerminal) {
    window.cyberTerminal = new CyberTerminal('interactive-terminal', { cyberCanvas });
  }

  // 3. Preloader Boot Sequence
  initPreloader();

  // 4. Smooth Scrolling (Lenis) & GSAP Integration
  initSmoothScroll();

  // 5. Custom Glowing Reticle Cursor
  initCustomCursor();

  // 6. Hero Typewriter & 3D Avatar Tilt
  initHeroAnimations();

  // 7. Navbar Behaviors & Scroll Progress
  initNavbar();

  // 8. Theme Toggle (Dark / Light)
  initThemeToggle(cyberCanvas);

  // 9. Scroll-Triggered Animations (Text Scramble, Counters, Skill Meters)
  initScrollAnimations();

  // 10. Project Filtering & 3D Tilt Glow
  initProjects();

  // 11. Security Write-ups Modal Reader
  initWriteupModals();

  // 12. Contact Form Validation & Simulated Transmission
  initContactForm();

  // 13. Easter Eggs (Konami Code)
  initKonamiCode(cyberCanvas);
});

/* ==========================================================================
   1. Preloader Boot Sequence
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('boot-preloader');
  const logsEl = document.getElementById('boot-logs');
  const progressFill = document.getElementById('boot-progress-fill');
  const progressPercent = document.getElementById('boot-percent');
  const skipBtn = document.getElementById('boot-skip-btn');

  if (!preloader) return;

  // Check if previously booted in this session
  const hasBooted = sessionStorage.getItem('ak_portfolio_booted');
  if (hasBooted) {
    preloader.style.display = 'none';
    return;
  }

  const bootLogs = [
    { prefix: '[SYSTEM_INIT]', text: 'BIOS v4.19-SEC initialized... OK' },
    { prefix: '[KERNEL]', text: 'Loading core modules: memory_guard, firewall, crypto... OK' },
    { prefix: '[NETWORK]', text: 'Establishing encrypted TLS 1.3 tunnel to target... OK' },
    { prefix: '[IDENTITY]', text: 'Verifying subject: Aswin Kumar [SNS College of Technology]... MATCH' },
    { prefix: '[CLEARANCE]', text: 'Clearance level: Aspiring Ethical Hacker // GRANTED', success: true },
    { prefix: '[READY]', text: 'Mounting portfolio interface... 100%', success: true }
  ];

  let currentStep = 0;
  let isSkipped = false;

  function endPreloader() {
    if (isSkipped) return;
    isSkipped = true;
    sessionStorage.setItem('ak_portfolio_booted', 'true');
    preloader.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s ease';
    preloader.style.opacity = '0';
    preloader.style.transform = 'scale(1.03)';
    setTimeout(() => {
      preloader.style.display = 'none';
      // Trigger hero entrance
      if (window.gsap) {
        gsap.from('.hero-content > *', {
          y: 25,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        });
      }
    }, 600);
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', endPreloader);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') endPreloader();
  });

  function processNextLog() {
    if (isSkipped) return;
    if (currentStep < bootLogs.length) {
      const item = bootLogs[currentStep];
      const lineDiv = document.createElement('div');
      lineDiv.className = 'boot-line';
      lineDiv.innerHTML = `
        <span class="boot-prefix">${item.prefix}</span>
        <span class="boot-text ${item.success ? 'success' : ''}">${item.text}</span>
      `;
      if (logsEl) logsEl.appendChild(lineDiv);

      const percent = Math.round(((currentStep + 1) / bootLogs.length) * 100);
      if (progressFill) progressFill.style.width = `${percent}%`;
      if (progressPercent) progressPercent.textContent = `${percent}%`;

      currentStep++;
      setTimeout(processNextLog, 240);
    } else {
      setTimeout(endPreloader, 450);
    }
  }

  setTimeout(processNextLog, 200);
}

/* ==========================================================================
   2. Lenis Smooth Scrolling & GSAP
   ========================================================================== */
function initSmoothScroll() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) return;

  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
    });

    window.lenisInstance = lenis;

    // Connect Lenis to GSAP ScrollTrigger if present
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Anchor links with Lenis
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: -80 });
          }
        }
      });
    });
  }
}

/* ==========================================================================
   3. Custom Glowing Reticle Cursor
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('cyber-cursor');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.22;
    cursorY += (mouseY - cursorY) * 0.22;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states for interactive elements
  const interactives = 'a, button, input, textarea, select, .project-card, .term-chip, .clickable';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      cursor.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      cursor.classList.remove('hover');
    }
  });
}

/* ==========================================================================
   4. Hero Typewriter & 3D Avatar Tilt
   ========================================================================== */
function initHeroAnimations() {
  // Typewriter
  const typewriterText = document.getElementById('hero-typewriter-text');
  if (typewriterText) {
    const titles = [
      'Ethical Hacker',
      'Cybersecurity Enthusiast',
      'Problem Solver',
      'Bug Hunter in Training'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 45;
    const pauseTime = 1800;

    function tick() {
      const current = titles[titleIndex];
      if (isDeleting) {
        charIndex--;
        typewriterText.textContent = current.substring(0, charIndex);
      } else {
        charIndex++;
        typewriterText.textContent = current.substring(0, charIndex);
      }

      let timeout = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === current.length) {
        timeout = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        timeout = 400;
      }

      setTimeout(tick, timeout);
    }

    tick();
  }

  // 3D Tilt on Hero Avatar
  const frameWrap = document.querySelector('.cyber-frame-wrapper');
  const frameInner = document.querySelector('.cyber-frame-inner');
  if (frameWrap && frameInner && !window.matchMedia('(pointer: coarse)').matches) {
    frameWrap.addEventListener('mousemove', (e) => {
      const rect = frameWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      frameInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    frameWrap.addEventListener('mouseleave', () => {
      frameInner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }
}

/* ==========================================================================
   5. Navbar Behaviors & Scroll Progress
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('hud-navbar');
  const progressBar = document.getElementById('scroll-progress');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar
    if (progressBar && docHeight > 0) {
      const progress = (currentScrollY / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Hide on scroll down, show on scroll up
    if (navbar) {
      if (currentScrollY > 150 && currentScrollY > lastScrollY && !mobileDrawer?.classList.contains('open')) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }
    }

    lastScrollY = currentScrollY;

    // Active Section Tracking
    updateActiveNav();
  }, { passive: true });

  // Mobile Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking mobile links
    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 140;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   6. Theme Toggle (Dark / Light)
   ========================================================================== */
function initThemeToggle(cyberCanvas) {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const root = document.documentElement;

  // Retrieve stored theme or default to dark
  const storedTheme = localStorage.getItem('ak_portfolio_theme') || 'dark';
  setTheme(storedTheme);

  window.toggleTheme = function () {
    const cur = root.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      window.toggleTheme();
    });
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('ak_portfolio_theme', theme);
    updateThemeIcon(theme);
    if (cyberCanvas) {
      cyberCanvas.theme = theme;
      if (cyberCanvas.isReducedMotion) {
        cyberCanvas.drawStaticFallback();
      }
    }
  }

  function updateThemeIcon(theme) {
    if (!toggleBtn) return;
    if (theme === 'light') {
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      toggleBtn.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      toggleBtn.setAttribute('aria-label', 'Switch to light theme');
    }
  }
}

/* ==========================================================================
   7. Scroll Animations (Text Scramble, Counters, Skill Meters)
   ========================================================================== */
function initScrollAnimations() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Text Scramble Effect on Section Titles
  const titles = document.querySelectorAll('.scramble-title');
  const scrambleChars = '!<>-_\\/[]{}—=+*^?#________0123456789';

  function scrambleText(element) {
    if (element.dataset.scrambled === 'true' || isReducedMotion) return;
    element.dataset.scrambled = 'true';

    const originalText = element.getAttribute('data-original-text') || element.textContent;
    let iteration = 0;
    const maxIterations = originalText.length * 2.5;

    const interval = setInterval(() => {
      element.innerText = originalText
        .split('')
        .map((letter, index) => {
          if (index < iteration / 2.5) {
            return originalText[index];
          }
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join('');

      if (iteration >= maxIterations) {
        element.innerText = originalText;
        clearInterval(interval);
      }
      iteration++;
    }, 28);
  }

  // Intersection Observer for Section Titles & Animations
  const observerOptions = {
    threshold: 0.25,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Scramble title
        const titleEl = entry.target.querySelector('.scramble-title');
        if (titleEl) scrambleText(titleEl);

        // Fill skill meters if within this section
        const meters = entry.target.querySelectorAll('.skill-meter-fill');
        meters.forEach((meter) => {
          const targetPercent = meter.getAttribute('data-level') || '50';
          meter.style.width = `${targetPercent}%`;
        });

        // Fill horizontal language bars if within this section
        const langBars = entry.target.querySelectorAll('.lang-bar-fill');
        langBars.forEach((bar) => {
          const targetPercent = bar.getAttribute('data-level') || '50';
          bar.style.width = `${targetPercent}%`;
        });

        // Trigger stat counters
        const counters = entry.target.querySelectorAll('.stat-counter');
        counters.forEach((counter) => {
          animateCounter(counter);
        });

        // Reveal card elements with stagger
        const animCards = entry.target.querySelectorAll('.reveal-card');
        animCards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 90);
        });
      }
    });
  }, observerOptions);

  document.querySelectorAll('.portfolio-section').forEach((sec) => {
    revealObserver.observe(sec);
  });

  // Animated Counter Function
  function animateCounter(el) {
    if (el.dataset.counted === 'true') return;
    el.dataset.counted = 'true';

    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + (target - start) * ease);

      el.textContent = `${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    }
    requestAnimationFrame(step);
  }
}

/* ==========================================================================
   8. Projects Filtering & 3D Tilt Glow
   ========================================================================== */
function initProjects() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Filter functionality
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter || (filter === 'featured' && card.dataset.featured === 'true')) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 3D Tilt & Radial Mouse Glow on Hover
  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (!window.matchMedia('(pointer: coarse)').matches) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = ((y - centerY) / centerY) * -5;
        const tiltY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   9. Write-up Modals & Resume Preview
   ========================================================================== */
function initWriteupModals() {
  const modalBackdrop = document.getElementById('writeup-modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close-btn');

  // Full technical content for each writeup
  const writeupArticles = {
    sql_injection: {
      title: 'Deconstructing SQL Injection: From Query Flaws to Prepared Statements',
      content: `
        <p><strong>Overview:</strong> SQL Injection (SQLi) consistently ranks in the OWASP Top 10 as one of the most critical web application vulnerabilities. It occurs when untrusted user input is directly concatenated into SQL queries without proper sanitization or parameterization.</p>
        
        <h3>1. The Anatomy of an Injection Point</h3>
        <p>Consider a standard authentication query built dynamically:</p>
        <pre><code>SELECT * FROM users WHERE username = 'admin' AND password = 'user_input';</code></pre>
        <p>If the application accepts <code>' OR '1'='1</code> as the password payload, the evaluated SQL statement becomes:</p>
        <pre><code>SELECT * FROM users WHERE username = 'admin' AND password = '' OR '1'='1';</code></pre>
        <p>Because <code>'1'='1'</code> always evaluates to TRUE, the query bypasses credential checks and returns the administrator row.</p>

        <h3>2. Types of SQL Injection</h3>
        <ul>
          <li><strong>In-band (Classic):</strong> Data extracted through standard application output (e.g. UNION-based, Error-based).</li>
          <li><strong>Inferential (Blind):</strong> No data visible on page; verified via boolean conditions or database sleep delays (Time-based).</li>
          <li><strong>Out-of-band:</strong> Data exfiltration triggered through DNS or SMB requests when outbound channels are open.</li>
        </ul>

        <h3>3. Defensive Mitigation: Parameterized Queries</h3>
        <p>Modern defense mandates parameterized queries (Prepared Statements). The database engine compiles query structure before binding user variables, guaranteeing data can never alter execution logic.</p>
        <pre><code># Secure Python implementation using parameterized input
cursor.execute(
    "SELECT id, role FROM accounts WHERE user = %s AND pass_hash = %s",
    (sanitized_user, hashed_password)
)</code></pre>
        <p><em>Takeaway:</em> Never concatenate string literals into database calls. Combine prepared statements with least-privilege database user permissions.</p>
      `
    },
    nmap_basics: {
      title: 'Nmap Essentials: Port Scanning Techniques & Host Discovery',
      content: `
        <p><strong>Overview:</strong> Network Mapper (Nmap) is an indispensable tool for network administrators and penetration testers to discover live hosts, open ports, running services, and OS signatures.</p>

        <h3>1. Core Scanning Methodologies</h3>
        <ul>
          <li><strong>SYN Stealth Scan (-sS):</strong> Sends TCP SYN packets without completing the 3-way handshake. Fast, reliable, and less prone to full socket logging.</li>
          <li><strong>TCP Connect Scan (-sT):</strong> Completes full SYN-SYN/ACK-ACK cycle. Useful when raw socket privileges are unavailable.</li>
          <li><strong>UDP Scan (-sU):</strong> Analyzes ICMP port unreachable responses to inspect UDP services like DNS (53), DHCP (67), and SNMP (161).</li>
        </ul>

        <h3>2. Essential Command Profiles</h3>
        <pre><code># Standard service version & default NSE script audit
nmap -sV -sC -T4 -p- target.domain.lab

# Fast host discovery without port scan
nmap -sn 192.168.1.0/24

# Outputting in all formats (Normal, XML, Grepable) for reporting
nmap -sV -oA recon_results 10.10.11.24</code></pre>

        <h3>3. Nmap Scripting Engine (NSE)</h3>
        <p>NSE scripts extend capabilities to vulnerability detection (<code>--script vuln</code>) and safe service banner grabbing (<code>--script banner</code>). Always verify target authorization prior to executing aggressive scripts.</p>
      `
    },
    owasp_top10: {
      title: 'OWASP Top 10 Explained: Broken Access Control & Prevention',
      content: `
        <p><strong>Overview:</strong> The OWASP Top 10 lists the most critical web application security risks. In recent revisions, <strong>Broken Access Control (A01)</strong> climbed to the #1 spot, representing vulnerabilities where users act outside their intended permissions.</p>

        <h3>1. Common Manifestations</h3>
        <ul>
          <li><strong>Insecure Direct Object References (IDOR):</strong> Accessing <code>/api/user/104/records</code> by changing the numerical ID to <code>105</code> when authorization checks are missing.</li>
          <li><strong>Privilege Escalation:</strong> Modifying client-side JWT claims or form values like <code>role: "admin"</code> to gain administrative powers.</li>
          <li><strong>CORS Misconfiguration:</strong> Overly permissive Cross-Origin Resource Sharing headers leaking sensitive authenticated data.</li>
        </ul>

        <h3>2. Remediation Architecture</h3>
        <p>Access control decisions must be enforced server-side. Deny access by default, validate record ownership against the session user ID, and disable client-side trust.</p>
        <pre><code>// Express.js middleware example enforcing ownership
function verifyRecordOwnership(req, res, next) {
  const currentUserId = req.session.userId;
  const requestedRecord = Document.findById(req.params.docId);
  
  if (!requestedRecord || requestedRecord.ownerId !== currentUserId) {
    return res.status(403).json({ error: "Access Denied: Unauthorized Subject" });
  }
  next();
}</code></pre>
      `
    },
    linux_hardening: {
      title: 'Linux Server Hardening: Essential Steps for Securing Debian/Ubuntu',
      content: `
        <p><strong>Overview:</strong> Securing a base Linux operating system minimizes attack surface, prevents unauthorized lateral movement, and defends against automated exploitation bots.</p>

        <h3>1. SSH Configuration Hardening</h3>
        <p>Edit <code>/etc/ssh/sshd_config</code> to enforce modern security standards:</p>
        <pre><code># Enforce SSH key authentication only
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222
X11Forwarding no
MaxAuthTries 3</code></pre>

        <h3>2. Firewall Rules with UFW</h3>
        <p>Implement a default-deny inbound strategy:</p>
        <pre><code>sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp comment 'Hardened SSH'
sudo ufw allow 80,443/tcp comment 'Web Traffic'
sudo ufw enable</code></pre>

        <h3>3. Continuous Auditing</h3>
        <p>Deploy <code>fail2ban</code> to ban brute-force IPs, enable automatic security updates via <code>unattended-upgrades</code>, and review audit logs in <code>/var/log/auth.log</code>.</p>
      `
    }
  };

  // Open modal triggers
  document.querySelectorAll('[data-writeup]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-writeup');
      const article = writeupArticles[key];
      if (article && modalBackdrop && modalTitle && modalBody) {
        modalTitle.textContent = article.title;
        modalBody.innerHTML = article.content;
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Resume Modal Preview Trigger
  document.querySelectorAll('.btn-resume, [data-action="resume"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalBackdrop && modalTitle && modalBody) {
        modalTitle.textContent = 'Aswin Kumar - Technical Resume';
        modalBody.innerHTML = `
          <div style="background:var(--bg-secondary); padding:1.5rem; border-radius:6px; border:1px solid var(--border-neon); margin-bottom:1.5rem;">
            <p><strong class="term-green" style="font-size:1.15rem;">ASWIN KUMAR</strong> — Aspiring Ethical Hacker &amp; Cybersecurity Enthusiast</p>
            <p style="margin-top:0.25rem;">2nd Year B.E. Computer Science and Design | SNS College of Technology, Coimbatore</p>
            <p style="margin-top:0.5rem; display:flex; flex-wrap:wrap; gap:0.75rem; font-family:var(--font-mono); font-size:0.85rem;">
              <span>✉ <a href="mailto:aswinkumar1327@gmail.com" class="term-cyan">aswinkumar1327@gmail.com</a></span>
              <span>📱 <a href="tel:8870535530" class="term-green">+91 8870535530</a></span>
              <span>🔗 <a href="https://www.linkedin.com/in/aswin-kumar-j" target="_blank" rel="noopener" class="term-cyan">linkedin.com/in/aswin-kumar-j</a></span>
              <span>⚡ <a href="https://leetcode.com/u/aswin1327/" target="_blank" rel="noopener" class="term-yellow">leetcode.com/u/aswin1327</a></span>
            </p>
          </div>
          <h3>Education</h3>
          <p><strong>B.E. Computer Science and Design</strong> (2024 - 2028)<br/>SNS College of Technology, Coimbatore</p>
          
          <h3>Core Technical Skills</h3>
          <p>• <strong>Programming:</strong> Python Basics<br/>
             • <strong>Operating Systems:</strong> Linux, Kali Linux<br/>
             • <strong>Command Line:</strong> Bash Basics<br/>
             • <strong>Networking:</strong> TCP/IP, DNS, HTTP, OSI Model<br/>
             • <strong>Cybersecurity:</strong> Security Fundamentals, Ethical Hacking<br/>
             • <strong>Soft Skills:</strong> Problem-solving, Critical Thinking<br/>
             • <strong>Languages:</strong> Tamil (100%), English (70%), Telugu (70%)
          </p>

          <h3>Strengths</h3>
          <p>• Analytical and logical thinking<br/>
             • Quick learning and adaptability<br/>
             • Problem-solving mindset<br/>
             • Self-motivation and consistency<br/>
             • Attention to detail<br/>
             • Curiosity about cybersecurity and emerging technologies
          </p>

          <h3>Areas of Growth</h3>
          <p>• Continuously developing practical cybersecurity experience through hands-on projects.<br/>
             • Working on improving time management and task prioritization.<br/>
             • Developing confidence in technical communication and public speaking.<br/>
             • Learning to balance detailed analysis with faster decision-making.<br/>
             • Expanding knowledge of industry-standard security tools and technologies.
          </p>

          <h3>Projects &amp; Security Labs</h3>
          <p>• <strong>AI Online Interview Web Platform:</strong> Multi-round candidate interview system built for companies.<br/>
             • <strong>Hackathon Innovation Sprint:</strong> Rapid collaborative development under 24-hr constraints.<br/>
             • <strong>Python Network Security Labs:</strong> Multi-threaded port scanner and password entropy analyzer (In progress).
          </p>
          <div style="margin-top:2rem; display:flex; gap:1rem; flex-wrap:wrap;">
            <a href="mailto:aswinkumar1327@gmail.com?subject=Interview%20/%20Internship%20Offer%20for%20Aswin%20Kumar" class="btn-primary" style="font-size:0.85rem; padding:0.6rem 1.2rem;">
              [ Contact Directly ]
            </a>
            <button class="btn-secondary" onclick="document.getElementById('modal-close-btn').click()" style="font-size:0.85rem; padding:0.6rem 1.2rem;">
              Close Viewer
            </button>
          </div>
        `;
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal
  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. Contact Form Validation & Simulated Packet Transmission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('cyber-contact-form');
  const feedback = document.getElementById('contact-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name']?.value.trim();
    const email = form.elements['email']?.value.trim();
    const category = form.elements['category']?.value;
    const message = form.elements['message']?.value.trim();

    // Validation
    if (!name || name.length < 2) {
      showFeedback('error', '[VALIDATION ERROR] Please provide a valid sender name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showFeedback('error', '[VALIDATION ERROR] Invalid email address format.');
      return;
    }

    if (!message || message.length < 10) {
      showFeedback('error', '[VALIDATION ERROR] Message body too brief (minimum 10 characters).');
      return;
    }

    // Transmission Simulation
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="typewriter-cursor" style="width:6px; height:1em; margin-right:6px;"></span>
        [ ENCRYPTING PAYLOAD... ]
      `;
    }

    setTimeout(() => {
      if (submitBtn) submitBtn.innerHTML = `[ ROUTING TLS 1.3 PACKET... ]`;
    }, 600);

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>[ TRANSMIT ENCRYPTED PACKET ]</span>`;
      }
      form.reset();
      showFeedback('success', `
        ✓ [TRANSMISSION SUCCESSFUL]
        Packet routed securely. Thank you, ${escapeHtml(name)}. Aswin will review your transmission and reply to ${escapeHtml(email)}.
      `);
    }, 1400);
  });

  function showFeedback(type, text) {
    if (!feedback) return;
    feedback.className = `form-feedback ${type}`;
    feedback.innerHTML = text;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
  }
}

/* ==========================================================================
   11. Easter Eggs: Konami Code & Cyber God Mode
   ========================================================================== */
function initKonamiCode(cyberCanvas) {
  const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let position = 0;

  const banner = document.getElementById('god-mode-banner');

  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const required = konamiSequence[position].toLowerCase();

    if (key === required) {
      position++;
      if (position === konamiSequence.length) {
        activateGodMode();
        position = 0;
      }
    } else {
      position = 0;
    }
  });

  function activateGodMode() {
    if (banner) {
      banner.classList.add('active');
      setTimeout(() => banner.classList.remove('active'), 6500);
    }

    // Switch background canvas to matrix mode
    if (cyberCanvas) {
      cyberCanvas.setMode('matrix');
    }

    // Terminal notification
    if (window.cyberTerminal) {
      window.cyberTerminal.appendRaw(`
        <div class="term-response term-green">
          ★ [EASTER EGG UNLOCKED] KONAMI CODE ACCEPTED!<br/>
          Overriding system constraints. Matrix Rain streaming engaged. Welcome to God Mode!
        </div>
      `);
      window.cyberTerminal.scrollToBottom();
    }
  }
}
