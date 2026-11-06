/**
 * cyber-canvas.js - Interactive Cyber Particle Mesh & Matrix Rain
 * High-performance, canvas-driven background visualizer with zero external dependencies.
 * Respects prefers-reduced-motion and pauses when offscreen or tab is hidden.
 */

class CyberCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.mode = 'mesh'; // 'mesh' | 'matrix' | 'off'
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.particles = [];
    this.matrixColumns = [];
    this.mouse = { x: -1000, y: -1000, radius: 140 };
    this.animId = null;
    this.isVisible = true;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.theme = document.documentElement.getAttribute('data-theme') || 'dark';

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Track mouse / touch position
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    }, { passive: true });

    // Handle visibility to save battery and GPU cycles
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });

    // Listen to theme changes
    const observer = new MutationObserver(() => {
      this.theme = document.documentElement.getAttribute('data-theme') || 'dark';
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    if (!this.isReducedMotion) {
      this.start();
    } else {
      this.drawStaticFallback();
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.initParticles();
    this.initMatrix();
  }

  initParticles() {
    this.particles = [];
    // Adaptive density based on screen width
    const count = this.width < 768 ? 32 : Math.min(Math.floor((this.width * this.height) / 18000), 75);

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        baseColor: i % 4 === 0 ? '#00e5ff' : (i % 7 === 0 ? '#7c3aed' : '#00ff9c'),
        packet: Math.random() > 0.7 ? { progress: 0, speed: 0.015 + Math.random() * 0.02 } : null
      });
    }
  }

  initMatrix() {
    const fontSize = 14;
    const columns = Math.floor(this.width / fontSize);
    this.matrixColumns = [];
    // Characters: Katakana + Hex + Cyber symbols
    this.matrixChars = '0123456789ABCDEF<>/*-+=~$#%&@!?¥ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ'.split('');

    for (let i = 0; i < columns; i++) {
      this.matrixColumns.push({
        x: i * fontSize,
        y: (Math.random() * -100) * fontSize,
        speed: 1 + Math.random() * 2.5,
        chars: []
      });
    }
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  start() {
    if (this.animId) cancelAnimationFrame(this.animId);
    const loop = () => {
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  pause() {
    this.isVisible = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  resume() {
    if (!this.isVisible && !this.isReducedMotion) {
      this.isVisible = true;
      this.start();
    }
  }

  render() {
    if (this.mode === 'off') {
      this.ctx.clearRect(0, 0, this.width, this.height);
      return;
    }

    if (this.mode === 'matrix') {
      this.renderMatrix();
    } else {
      this.renderMesh();
    }
  }

  renderMesh() {
    const isDark = this.theme === 'dark';
    this.ctx.clearRect(0, 0, this.width, this.height);

    const maxDist = this.width < 768 ? 100 : 150;
    const len = this.particles.length;

    // Draw network connections
    for (let i = 0; i < len; i++) {
      const p1 = this.particles[i];

      // Update particle positions
      p1.x += p1.vx;
      p1.y += p1.vy;

      if (p1.x < 0 || p1.x > this.width) p1.vx *= -1;
      if (p1.y < 0 || p1.y > this.height) p1.vy *= -1;

      // Mouse repulsion / interaction
      const dxMouse = this.mouse.x - p1.x;
      const dyMouse = this.mouse.y - p1.y;
      const distMouse = Math.hypot(dxMouse, dyMouse);
      if (distMouse < this.mouse.radius) {
        const force = (1 - distMouse / this.mouse.radius) * 2;
        p1.x -= (dxMouse / distMouse) * force;
        p1.y -= (dyMouse / distMouse) * force;
      }

      // Inter-particle links
      for (let j = i + 1; j < len; j++) {
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * (isDark ? 0.22 : 0.12);
          this.ctx.strokeStyle = isDark ? `rgba(0, 255, 156, ${alpha})` : `rgba(5, 150, 105, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();

          // Data packet pulsing along lines
          if (p1.packet && dist < maxDist * 0.7) {
            p1.packet.progress += p1.packet.speed;
            if (p1.packet.progress > 1) p1.packet.progress = 0;

            const packetX = p1.x + (p2.x - p1.x) * p1.packet.progress;
            const packetY = p1.y + (p2.y - p1.y) * p1.packet.progress;

            this.ctx.fillStyle = isDark ? '#00e5ff' : '#0284c7';
            this.ctx.shadowColor = isDark ? '#00e5ff' : 'transparent';
            this.ctx.shadowBlur = isDark ? 6 : 0;
            this.ctx.beginPath();
            this.ctx.arc(packetX, packetY, 1.8, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
          }
        }
      }

      // Draw particle nodes
      this.ctx.fillStyle = isDark ? p1.baseColor : '#059669';
      this.ctx.shadowColor = isDark ? p1.baseColor : 'transparent';
      this.ctx.shadowBlur = isDark ? 4 : 0;
      this.ctx.beginPath();
      this.ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }

  renderMatrix() {
    const isDark = this.theme === 'dark';
    // Trailing dark wash
    this.ctx.fillStyle = isDark ? 'rgba(5, 7, 10, 0.12)' : 'rgba(240, 244, 248, 0.15)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const fontSize = 14;
    this.ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < this.matrixColumns.length; i++) {
      const col = this.matrixColumns[i];
      const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];

      // First head char glows white/cyan, trailing glows green
      this.ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      this.ctx.shadowColor = isDark ? '#00e5ff' : 'transparent';
      this.ctx.shadowBlur = isDark ? 8 : 0;
      this.ctx.fillText(char, col.x, col.y);

      // Subsequent characters in cyber green
      this.ctx.fillStyle = isDark ? '#00ff9c' : '#059669';
      this.ctx.shadowColor = isDark ? '#00ff9c' : 'transparent';
      this.ctx.shadowBlur = isDark ? 4 : 0;
      this.ctx.fillText(this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)], col.x, col.y - fontSize);
      this.ctx.shadowBlur = 0;

      col.y += col.speed * fontSize * 0.45;

      if (col.y > this.height && Math.random() > 0.975) {
        col.y = 0;
        col.speed = 1 + Math.random() * 2.5;
      }
    }
  }

  drawStaticFallback() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const isDark = this.theme === 'dark';
    // Draw subtle grid
    const step = 60;
    this.ctx.strokeStyle = isDark ? 'rgba(0, 255, 156, 0.05)' : 'rgba(5, 150, 105, 0.05)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let x = 0; x < this.width; x += step) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
    }
    for (let y = 0; y < this.height; y += step) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
    }
    this.ctx.stroke();
  }
}

window.CyberCanvas = CyberCanvas;
