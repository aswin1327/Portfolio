/**
 * story-engine.js - Cinematic Cybersecurity Storytelling Engine
 * "The Digital Journey – Think Like a Hacker, Protect Like a Professional"
 * Orchestrates Scene 1 to Scene 6 scroll animations, typing effects,
 * glitch transitions, terminal command simulations, and interactive scrubbing.
 */

class StoryEngine {
  constructor() {
    this.section = document.getElementById('story');
    if (!this.section) return;

    this.scenes = document.querySelectorAll('.story-scene');
    this.scrubberDots = document.querySelectorAll('.scrubber-dot');
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.hasTypedScene1 = false;
    this.hasRunMindTerminal = false;

    this.init();
  }

  init() {
    this.initBinaryStream();
    this.initSceneObservers();
    this.initScrubberClicks();
    this.initScene1Typing();
    this.initMindTerminal();
    this.initResumeCTA();
  }

  /* ------------------------------------------------------------------------
     1. Scene 1 Binary Code Rain Simulation (Subtle 0s and 1s)
     ------------------------------------------------------------------------ */
  initBinaryStream() {
    const layer = document.getElementById('scene1-binary-rain');
    if (!layer || this.isReducedMotion) return;

    const columnCount = window.innerWidth < 768 ? 10 : 22;
    for (let i = 0; i < columnCount; i++) {
      const col = document.createElement('div');
      col.className = 'binary-stream-col';
      col.style.left = `${(i / columnCount) * 100 + (Math.random() * 2 - 1)}%`;
      col.style.animationDuration = `${4 + Math.random() * 5}s`;
      col.style.animationDelay = `${Math.random() * 3}s`;

      // Generate random stream of 0s and 1s
      let str = '';
      const len = 12 + Math.floor(Math.random() * 10);
      for (let j = 0; j < len; j++) {
        str += (Math.random() > 0.5 ? '1\n' : '0\n');
      }
      col.textContent = str;
      layer.appendChild(col);
    }
  }

  /* ------------------------------------------------------------------------
     2. Scene 1 Terminal Typing Effect
     ------------------------------------------------------------------------ */
  initScene1Typing() {
    const textEl = document.getElementById('scene1-type-text');
    if (!textEl) return;

    const fullText = "IN A WORLD FULL OF DATA, SECURITY IS EVERYTHING.";

    if (this.isReducedMotion) {
      textEl.textContent = fullText;
      return;
    }

    // Trigger typing when Scene 1 enters view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.hasTypedScene1) {
          this.hasTypedScene1 = true;
          this.typeWriter(textEl, fullText, 45);
        }
      });
    }, { threshold: 0.3 });

    const scene1 = document.getElementById('scene-1');
    if (scene1) observer.observe(scene1);
  }

  typeWriter(element, text, speed) {
    element.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    setTimeout(type, 300);
  }

  /* ------------------------------------------------------------------------
     3. Scene 4 Inside the Hacker's Mind: Terminal Command Sequence
     ------------------------------------------------------------------------ */
  initMindTerminal() {
    const consoleEl = document.getElementById('mind-terminal-console');
    if (!consoleEl) return;

    const commands = [
      {
        prompt: 'aswin@sec-node:~$',
        cmd: 'nmap -sV -T4 10.10.10.0/24',
        output: '[+] Scanning 256 subnet hosts... Discovered port 443/tcp [HTTPS] Secure Enclave.',
        accent: true
      },
      {
        prompt: 'aswin@sec-node:~$',
        cmd: 'pwd',
        output: '/home/aswin/cyber-defense/security-lab'
      },
      {
        prompt: 'aswin@sec-node:~$',
        cmd: 'ls -la',
        output: 'drwx------ protocols/   drwxr-xr-x firewall_rules/   -rw-r--r-- defense_matrix.py'
      },
      {
        prompt: 'aswin@sec-node:~$',
        cmd: 'whoami',
        output: '[IDENTITY_RESOLVED] aswin_kumar // CLEARANCE: DEFENSIVE SECURITY PRACTITIONER',
        success: true
      }
    ];

    if (this.isReducedMotion) {
      // Show immediately
      consoleEl.innerHTML = commands.map(c => `
        <div class="mind-term-line revealed">
          <span class="mind-cmd-prompt">${c.prompt}</span>
          <span class="mind-cmd-input">${c.cmd}</span>
          <div class="mind-cmd-output ${c.success ? 'success' : ''} ${c.accent ? 'accent' : ''}">${c.output}</div>
        </div>
      `).join('');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.hasRunMindTerminal) {
          this.hasRunMindTerminal = true;
          this.runCommandSequence(consoleEl, commands);
        }
      });
    }, { threshold: 0.25 });

    const scene4 = document.getElementById('scene-4');
    if (scene4) observer.observe(scene4);
  }

  runCommandSequence(consoleEl, commands) {
    consoleEl.innerHTML = '';
    let cmdIndex = 0;

    const executeNext = () => {
      if (cmdIndex >= commands.length) return;

      const item = commands[cmdIndex];
      const lineDiv = document.createElement('div');
      lineDiv.className = 'mind-term-line';
      lineDiv.innerHTML = `
        <span class="mind-cmd-prompt">${item.prompt}</span>
        <span class="mind-cmd-input" id="cmd-input-${cmdIndex}"></span>
        <div class="mind-cmd-output ${item.success ? 'success' : ''} ${item.accent ? 'accent' : ''}" id="cmd-out-${cmdIndex}" style="display:none;">${item.output}</div>
      `;
      consoleEl.appendChild(lineDiv);

      // Trigger line visibility
      requestAnimationFrame(() => lineDiv.classList.add('revealed'));

      const inputSpan = document.getElementById(`cmd-input-${cmdIndex}`);
      const outputDiv = document.getElementById(`cmd-out-${cmdIndex}`);

      // Type the command string
      let charIdx = 0;
      const typeCmd = () => {
        if (charIdx < item.cmd.length) {
          inputSpan.textContent += item.cmd.charAt(charIdx);
          charIdx++;
          setTimeout(typeCmd, 35);
        } else {
          // Show simulated output after a micro delay
          setTimeout(() => {
            if (outputDiv) outputDiv.style.display = 'block';
            cmdIndex++;
            setTimeout(executeNext, 450);
          }, 200);
        }
      };

      setTimeout(typeCmd, 150);
    };

    executeNext();
  }

  /* ------------------------------------------------------------------------
     4. Intersection Observers for Glitch, Milestones & Active Scrubber
     ------------------------------------------------------------------------ */
  initSceneObservers() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');

        if (entry.isIntersecting) {
          // Synchronize active dot in scrubber
          this.scrubberDots.forEach((dot) => {
            if (dot.getAttribute('data-target') === `#${id}`) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });

          // Trigger Scene 2 Glitch Animation
          if (id === 'scene-2') {
            const glitchEl = entry.target.querySelector('.glitch-text');
            if (glitchEl) {
              glitchEl.classList.add('glitch-active');
              setTimeout(() => glitchEl.classList.remove('glitch-active'), 4000);
            }
          }

          // Trigger Milestone Stagger in Scene 3
          if (id === 'scene-3') {
            const milestones = entry.target.querySelectorAll('.milestone-item');
            milestones.forEach((m, idx) => {
              setTimeout(() => {
                m.style.opacity = '1';
                m.style.transform = 'translateY(0)';
              }, idx * 120);
            });
          }
        }
      });
    }, {
      threshold: 0.35,
      rootMargin: '0px 0px -40px 0px'
    });

    this.scenes.forEach((scene) => observer.observe(scene));
  }

  /* ------------------------------------------------------------------------
     5. Interactive Scrubber Navigation Clicks
     ------------------------------------------------------------------------ */
  initScrubberClicks() {
    this.scrubberDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = dot.getAttribute('data-target');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          if (window.lenisInstance) {
            window.lenisInstance.scrollTo(targetEl, { offset: -70 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. Scene 6 CTA: "EXPLORE MY RESUME" Transition
     ------------------------------------------------------------------------ */
  initResumeCTA() {
    const resumeBtn = document.getElementById('story-resume-btn');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', (e) => {
        // If user wants to jump to profile or open resume modal:
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          if (window.lenisInstance) {
            window.lenisInstance.scrollTo(aboutSection, { offset: -80 });
          } else {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  }
}

// Auto-instantiate when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.storyEngine = new StoryEngine();
});

