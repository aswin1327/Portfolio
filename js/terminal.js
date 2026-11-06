/**
 * terminal.js - Interactive In-Browser Cyber Terminal Simulator
 * 100% simulated JavaScript sandbox with zero attack code, command history,
 * autocomplete, and mobile-friendly tap command execution.
 */

class CyberTerminal {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.outputEl = this.container.querySelector('.term-output');
    this.inputEl = this.container.querySelector('.term-input');
    this.formEl = this.container.querySelector('.term-form');
    this.chipsContainer = this.container.querySelector('.term-chips');
    this.cyberCanvas = options.cyberCanvas || null;

    this.history = [];
    this.historyIndex = -1;
    this.bootTime = Date.now();

    this.commands = {
      help: {
        desc: 'List all available terminal commands',
        action: () => this.cmdHelp()
      },
      whoami: {
        desc: 'Display identity, role, and student overview',
        action: () => this.cmdWhoami()
      },
      skills: {
        desc: 'Print technical competencies and honesty ratings',
        action: () => this.cmdSkills()
      },
      projects: {
        desc: 'List college, hackathon, and in-progress security labs',
        action: () => this.cmdProjects()
      },
      education: {
        desc: 'View academic institution and degree details',
        action: () => this.cmdEducation()
      },
      certifications: {
        desc: 'List completed foundations and planned certs',
        action: () => this.cmdCertifications()
      },
      hackathons: {
        desc: 'View hackathon participation and sprint experience',
        action: () => this.cmdHackathons()
      },
      mission: {
        desc: 'Read Aswin\'s cybersecurity mission statement',
        action: () => this.cmdMission()
      },
      ethics: {
        desc: 'Display ethical hacking pledge & compliance rules',
        action: () => this.cmdEthics()
      },
      contact: {
        desc: 'Show contact channels and social links',
        action: () => this.cmdContact()
      },
      story: {
        desc: 'Play the cinematic cybersecurity journey animation',
        action: () => this.cmdStory()
      },
      matrix: {
        desc: 'Toggle Matrix Digital Rain background stream',
        action: () => this.cmdMatrix()
      },
      theme: {
        desc: 'Toggle between Dark Neon and Clean Light modes',
        action: () => this.cmdTheme()
      },
      clear: {
        desc: 'Clear the terminal output screen',
        action: () => this.cmdClear()
      },
      uptime: {
        desc: 'Display time elapsed since session initialization',
        action: () => this.cmdUptime()
      },
      date: {
        desc: 'Display current system UTC timestamp',
        action: () => this.cmdDate()
      },
      sudo: {
        desc: 'Attempt elevated privileges',
        action: (args) => this.cmdSudo(args)
      },
      cat: {
        desc: 'Read simulated files (e.g., cat mission.txt)',
        action: (args) => this.cmdCat(args)
      },
      history: {
        desc: 'Display previously entered commands',
        action: () => this.cmdHistory()
      }
    };

    this.init();
  }

  init() {
    // Form submission
    if (this.formEl) {
      this.formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCommand(this.inputEl.value.trim());
      });
    }

    // Keydown handlers for history and tab completion
    if (this.inputEl) {
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.navigateHistory(1);
        } else if (e.key === 'Tab') {
          e.preventDefault();
          this.autoComplete();
        }
      });
    }

    // Interactive chips
    if (this.chipsContainer) {
      this.chipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.term-chip');
        if (chip && chip.dataset.cmd) {
          const cmd = chip.dataset.cmd;
          if (this.inputEl) this.inputEl.value = cmd;
          this.handleCommand(cmd);
          if (this.inputEl) this.inputEl.focus();
        }
      });
    }

    // Welcome banner
    this.printInitialBanner();
  }

  printInitialBanner() {
    this.appendRaw(`
<div class="term-banner">
  <span class="term-green">╔══════════════════════════════════════════════════════════════════╗</span>
  <span class="term-green">║</span>  <span class="term-bold term-white">SEC-CLI v1.0.4 [x86_64-antigravity]</span>                            <span class="term-green">║</span>
  <span class="term-green">║</span>  Logged in as: <span class="term-cyan">guest@aswin-sec-lab</span> (Restricted Sandbox)          <span class="term-green">║</span>
  <span class="term-green">║</span>  Type <span class="term-accent">'help'</span> to see commands or click chips below.              <span class="term-green">║</span>
  <span class="term-green">╚══════════════════════════════════════════════════════════════════╝</span>
</div>
    `);
  }

  handleCommand(inputStr) {
    if (!inputStr) return;

    // Record in history
    this.history.push(inputStr);
    this.historyIndex = this.history.length;

    // Display prompt echo
    this.appendRaw(`
      <div class="term-line">
        <span class="term-prompt"><span class="term-green">guest@aswin-sec</span>:<span class="term-cyan">~</span>$</span>
        <span class="term-cmd">${this.escapeHtml(inputStr)}</span>
      </div>
    `);

    if (this.inputEl) this.inputEl.value = '';

    const parts = inputStr.split(/\s+/);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (this.commands[cmdName]) {
      this.commands[cmdName].action(args);
    } else {
      this.appendRaw(`
        <div class="term-response term-error">
          bash: command not found: <span class="term-white">${this.escapeHtml(cmdName)}</span>.
          Type <span class="term-cyan pointer" onclick="window.cyberTerminal.exec('help')">'help'</span> for a list of simulated commands.
        </div>
      `);
    }

    this.scrollToBottom();
  }

  exec(cmdName) {
    if (this.inputEl) this.inputEl.value = cmdName;
    this.handleCommand(cmdName);
  }

  navigateHistory(direction) {
    if (this.history.length === 0) return;

    this.historyIndex += direction;
    if (this.historyIndex < 0) this.historyIndex = 0;
    if (this.historyIndex >= this.history.length) {
      this.historyIndex = this.history.length;
      if (this.inputEl) this.inputEl.value = '';
      return;
    }

    if (this.inputEl) {
      this.inputEl.value = this.history[this.historyIndex] || '';
    }
  }

  autoComplete() {
    if (!this.inputEl) return;
    const current = this.inputEl.value.trim().toLowerCase();
    if (!current) return;

    const matches = Object.keys(this.commands).filter(c => c.startsWith(current));
    if (matches.length === 1) {
      this.inputEl.value = matches[0];
    } else if (matches.length > 1) {
      this.appendRaw(`
        <div class="term-response term-muted">
          Suggestions: ${matches.map(m => `<span class="term-cyan">${m}</span>`).join('  ')}
        </div>
      `);
      this.scrollToBottom();
    }
  }

  cmdHelp() {
    let out = '<div class="term-response"><div class="term-help-grid">';
    for (const [name, meta] of Object.entries(this.commands)) {
      out += `
        <div class="term-help-row">
          <span class="term-cmd-name term-green">${name}</span>
          <span class="term-cmd-desc">${meta.desc}</span>
        </div>
      `;
    }
    out += '</div><p class="term-muted" style="margin-top:8px">Tip: You can click command chips or run <span class="term-cyan">matrix</span> to toggle the digital rain!</p></div>';
    this.appendRaw(out);
  }

  cmdWhoami() {
    this.appendRaw(`
      <div class="term-response">
        <p><span class="term-bold term-white">NAME:</span> Aswin Kumar</p>
        <p><span class="term-bold term-white">TITLE:</span> Aspiring Ethical Hacker | Cybersecurity Enthusiast</p>
        <p><span class="term-bold term-white">ACADEMICS:</span> 2nd year B.E. Computer Science and Design</p>
        <p><span class="term-bold term-white">CAMPUS:</span> SNS College of Technology, Coimbatore, Tamil Nadu</p>
        <p><span class="term-bold term-white">FOCUS:</span> Network Security, Web Vulnerabilities (OWASP Top 10), Virtual Security Labs</p>
        <p><span class="term-muted">"Passionate about understanding how vulnerabilities form and how to build resilient defense mechanisms."</span></p>
      </div>
    `);
  }

  cmdSkills() {
    this.appendRaw(`
      <div class="term-response">
        <p class="term-cyan term-bold">=== TECHNICAL SKILL RATINGS (HONEST & PRACTICAL) ===</p>
        <div style="margin: 8px 0;">
          <p><span class="term-green">Programming:</span>         Python Basics</p>
          <p><span class="term-green">Operating Systems:</span>   Linux, Kali Linux</p>
          <p><span class="term-green">Command Line:</span>        Bash Basics</p>
          <p><span class="term-green">Networking:</span>          TCP/IP, DNS, HTTP, OSI Model</p>
          <p><span class="term-green">Cybersecurity:</span>       Security Fundamentals, Ethical Hacking</p>
          <p><span class="term-green">Soft Skills:</span>         Problem-solving, Critical Thinking</p>
        </div>
        <p class="term-cyan term-bold" style="margin-top:10px;">=== LANGUAGES (HORIZONTAL METRICS) ===</p>
        <p><span class="term-green">Tamil:</span>               [██████████] 100% (Native / Fluent)</p>
        <p><span class="term-cyan">English:</span>             [███████░░░] 70% (Professional Working)</p>
        <p><span class="term-cyan">Telugu:</span>              [███████░░░] 70% (Conversational)</p>
        <p class="term-cyan term-bold" style="margin-top:10px;">=== CURRENTLY LEARNING & LAB TOOLS ===</p>
        <p>• Linux / Bash CLI & Permissions</p>
        <p>• Nmap (Network reconnaissance & port discovery)</p>
        <p>• Wireshark (Packet inspection & protocol analysis)</p>
        <p>• Burp Suite (HTTP proxy & request interception)</p>
        <p>• OWASP Top 10 Security Risks</p>
        <p>• TryHackMe & Hack The Box Fundamental Rooms</p>
      </div>
    `);
  }

  cmdProjects() {
    this.appendRaw(`
      <div class="term-response">
        <p class="term-cyan term-bold">=== FEATURED PROJECTS & LABS ===</p>
        <div style="margin: 8px 0;">
          <p><span class="term-green">1. AI Online Interview Web Platform</span> <span class="term-badge">[COLLEGE MINI PROJECT]</span></p>
          <p class="term-muted">   - Web platform designed for companies to conduct multi-round candidate interviews online.</p>
          <p class="term-muted">   - Stack: HTML5, CSS3, JavaScript, Web APIs.</p>
          
          <p style="margin-top:8px;"><span class="term-green">2. Hackathon Project</span> <span class="term-badge">[HACKATHON INNOVATION]</span></p>
          <p class="term-muted">   - Rapid team sprint prototype addressing tech challenges under tight timelines.</p>
          <p class="term-muted">   - Status: Completed presentation & prototype demonstration.</p>

          <p style="margin-top:8px;"><span class="term-yellow">3. Python Multi-Threaded Port Scanner</span> <span class="term-badge">[IN PROGRESS - LAB]</span></p>
          <p class="term-muted">   - Socket-based port discovery script with configurable timeouts and thread pool.</p>

          <p style="margin-top:8px;"><span class="term-yellow">4. Password Strength & Entropy Analyzer</span> <span class="term-badge">[IN PROGRESS - LAB]</span></p>
          <p class="term-muted">   - Evaluates password complexity, entropy bits, and common dictionary pattern checks.</p>

          <p style="margin-top:8px;"><span class="term-yellow">5. Phishing Awareness Demo (Educational)</span> <span class="term-badge">[IN PROGRESS - LAB]</span></p>
          <p class="term-muted">   - Visual educational simulator illustrating deceptive URLs and email spoofing markers.</p>
        </div>
      </div>
    `);
  }

  cmdEducation() {
    this.appendRaw(`
      <div class="term-response">
        <p><span class="term-cyan term-bold">DEGREE:</span> Bachelor of Engineering (B.E.) in Computer Science and Design</p>
        <p><span class="term-cyan term-bold">YEAR:</span> 2nd Year (2024 - 2028)</p>
        <p><span class="term-cyan term-bold">INSTITUTION:</span> SNS College of Technology, Coimbatore</p>
        <p><span class="term-cyan term-bold">CORE SUBJECTS:</span> Data Structures, Computer Networks, Operating Systems, Web Technologies</p>
        <p><span class="term-cyan term-bold">ACTIVITIES:</span> Tech Hackathons, Cybersecurity Club, Coding Challenges</p>
      </div>
    `);
  }

  cmdCertifications() {
    this.appendRaw(`
      <div class="term-response">
        <p class="term-cyan term-bold">=== CERTIFICATIONS & LEARNING GOALS ===</p>
        <p class="term-green">✓ Foundational Networking Coursework & Labs (Completed)</p>
        <p class="term-green">✓ Python Programming Foundations (Completed)</p>
        <p class="term-yellow">⏳ Google Cybersecurity Certificate (Actively in Progress)</p>
        <p class="term-muted">🎯 CompTIA Security+ (Planned Target for 2026/2027)</p>
        <p class="term-muted">🎯 eJPT - Junior Penetration Tester (Planned Hands-on Goal)</p>
        <p class="term-muted">🎯 CEH - Certified Ethical Hacker (Long-term Target)</p>
        <p class="term-muted" style="margin-top:6px;">*Note: Planned targets are clearly labeled. I do not claim certificates I do not currently hold.*</p>
      </div>
    `);
  }

  cmdHackathons() {
    this.appendRaw(`
      <div class="term-response">
        <p class="term-cyan term-bold">=== HACKATHONS & ACTIVE SPRINTS ===</p>
        <p><span class="term-green">✓ College Hackathon Participation:</span> Team-based 24-36hr innovation hackathons focusing on scalable web platforms and problem solving.</p>
        <p><span class="term-green">✓ Mini Project Showcase:</span> Deployed and presented the AI Online Interview Platform to academic faculty and peers.</p>
        <p><span class="term-green">✓ CTF Exercises:</span> Beginner Jeopardy-style CTF challenges (Cryptography, Web, Forensics basics).</p>
      </div>
    `);
  }

  cmdMission() {
    this.appendRaw(`
      <div class="term-response">
        <p class="term-bold term-green">MY CYBERSECURITY MISSION:</p>
        <p class="term-white" style="margin: 6px 0; line-height: 1.6;">
          "To master defensive and offensive security principles through continuous hands-on practice,
          ethical research, and responsible vulnerability disclosure, ultimately safeguarding digital
          infrastructure and empowering communities against evolving cyber threats."
        </p>
      </div>
    `);
  }

  cmdEthics() {
    this.appendRaw(`
      <div class="term-response">
        <p class="term-bold term-yellow">=== ETHICAL HACKING PLEDGE & CODE OF CONDUCT ===</p>
        <p>1. I only test systems for which I have explicit, documented authorization.</p>
        <p>2. All vulnerability research is conducted strictly within legal virtual labs, CTF challenges, or sanctioned bug bounty scopes.</p>
        <p>3. I strictly respect privacy, confidentiality, and data integrity.</p>
        <p>4. I adhere to responsible disclosure principles to help organizations remediate risks before public disclosure.</p>
        <p class="term-green" style="margin-top: 6px;">Status: 100% Compliant & Dedicated to Defensive Integrity.</p>
      </div>
    `);
  }

  cmdContact() {
    this.appendRaw(`
      <div class="term-response">
        <p><span class="term-cyan term-bold">Location:</span> Tamil Nadu, India</p>
        <p><span class="term-cyan term-bold">Email:</span> <a href="mailto:aswinkumar1327@gmail.com" class="term-link">aswinkumar1327@gmail.com</a></p>
        <p><span class="term-cyan term-bold">Mobile:</span> <a href="tel:8870535530" class="term-link">+91 8870535530</a></p>
        <p><span class="term-cyan term-bold">LinkedIn:</span> <a href="https://www.linkedin.com/in/aswin-kumar-j" target="_blank" rel="noopener" class="term-link">linkedin.com/in/aswin-kumar-j</a></p>
        <p><span class="term-cyan term-bold">LeetCode:</span> <a href="https://leetcode.com/u/aswin1327/" target="_blank" rel="noopener" class="term-link">leetcode.com/u/aswin1327</a></p>
        <p><span class="term-cyan term-bold">PGP Fingerprint:</span> <span class="term-muted">4D9A 28C1 9F04 B831 E640 102A 7B5C 882E 31A0</span></p>
      </div>
    `);
  }

  cmdStory() {
    this.appendRaw(`
      <div class="term-response term-green">
        ▶ Initializing Cinematic Storytelling Experience: <span class="term-white">[THE DIGITAL JOURNEY]</span>...<br/>
        Routing view to animated documentary sequence...
      </div>
    `);
    const storySection = document.getElementById('story');
    if (storySection) {
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(storySection, { offset: -70 });
      } else {
        storySection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  cmdMatrix() {
    if (this.cyberCanvas) {
      const newMode = this.cyberCanvas.mode === 'matrix' ? 'mesh' : 'matrix';
      this.cyberCanvas.setMode(newMode);
      this.appendRaw(`
        <div class="term-response term-green">
          Canvas background mode switched to: <span class="term-white term-bold">[${newMode.toUpperCase()}]</span>.
        </div>
      `);
    } else {
      this.appendRaw(`<div class="term-response term-muted">Matrix stream toggled.</div>`);
    }
  }

  cmdTheme() {
    if (window.toggleTheme) {
      const cur = window.toggleTheme();
      this.appendRaw(`
        <div class="term-response term-cyan">
          Active theme switched to: <span class="term-bold term-white">[${cur.toUpperCase()}]</span>
        </div>
      `);
    } else {
      this.appendRaw(`<div class="term-response term-muted">Theme toggle executed.</div>`);
    }
  }

  cmdClear() {
    if (this.outputEl) {
      this.outputEl.innerHTML = '';
      this.printInitialBanner();
    }
  }

  cmdUptime() {
    const secs = Math.floor((Date.now() - this.bootTime) / 1000);
    const mins = Math.floor(secs / 60);
    this.appendRaw(`
      <div class="term-response">
        uptime: <span class="term-green">${mins}m ${secs % 60}s</span> | Active terminal session | load average: 0.12, 0.08, 0.05
      </div>
    `);
  }

  cmdDate() {
    this.appendRaw(`
      <div class="term-response">
        ${new Date().toUTCString()} (Host UTC)
      </div>
    `);
  }

  cmdSudo(args) {
    this.appendRaw(`
      <div class="term-response term-error">
        [SECURITY ALERT] guest is not in the sudoers file.<br/>
        This incident will be reported to /dev/null ;) Nice try, fellow hacker!<br/>
        Try typing <span class="term-cyan">'matrix'</span> or <span class="term-cyan">'mission'</span> instead.
      </div>
    `);
  }

  cmdCat(args) {
    const file = (args[0] || '').toLowerCase();
    if (file === 'mission.txt' || file === 'mission') {
      this.cmdMission();
    } else if (file === 'pledge.txt' || file === 'ethics.txt' || file === 'ethics') {
      this.cmdEthics();
    } else if (file === 'flag.txt' || file === 'flag') {
      this.appendRaw(`
        <div class="term-response term-green">
          🚩 FLAG{4sw1n_kUM4r_3th1c4l_h4ck1ng_2026_s3cur3}
          <br/><span class="term-muted">Congratulations on exploring the simulated filesystem!</span>
        </div>
      `);
    } else {
      this.appendRaw(`
        <div class="term-response term-error">
          cat: ${this.escapeHtml(file || '')}: No such file or directory.<br/>
          Available files: <span class="term-cyan">mission.txt</span>, <span class="term-cyan">pledge.txt</span>, <span class="term-cyan">flag.txt</span>
        </div>
      `);
    }
  }

  cmdHistory() {
    if (this.history.length === 0) {
      this.appendRaw(`<div class="term-response term-muted">No commands in history yet.</div>`);
      return;
    }
    let out = '<div class="term-response">';
    this.history.forEach((h, i) => {
      out += `<div><span class="term-muted">${i + 1}</span>  ${this.escapeHtml(h)}</div>`;
    });
    out += '</div>';
    this.appendRaw(out);
  }

  appendRaw(html) {
    if (!this.outputEl) return;
    const div = document.createElement('div');
    div.innerHTML = html;
    this.outputEl.appendChild(div);
  }

  scrollToBottom() {
    if (this.outputEl) {
      this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }
  }

  escapeHtml(str) {
    return str.replace(/[&<>'"]/g,
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

window.CyberTerminal = CyberTerminal;
