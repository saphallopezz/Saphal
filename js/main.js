/* ================================================================
   MAIN INTERACTIONS
   Boot sequence, nav, typed roles, reveal on scroll, cursor glow,
   terminal animation, magnetic buttons, project card tilt.
   ================================================================ */

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // Boot loader
  // ------------------------------------------------------------------
  const boot = document.querySelector('.boot-loader');
  if (boot) {
    const lines = boot.querySelectorAll('.line');
    lines.forEach((l, i) => {
      l.style.animationDelay = (i * 0.18) + 's';
    });
    const total = Math.max(1400, lines.length * 200 + 800);
    window.addEventListener('load', () => {
      setTimeout(() => {
        boot.classList.add('done');
        setTimeout(() => boot.remove(), 900);
        document.body.classList.add('booted');
      }, total);
    });
    // fallback
    setTimeout(() => {
      if (!boot.classList.contains('done')) {
        boot.classList.add('done');
        document.body.classList.add('booted');
        setTimeout(() => boot && boot.remove(), 900);
      }
    }, 4500);
  }

  // ------------------------------------------------------------------
  // Nav toggle (mobile)
  // ------------------------------------------------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ------------------------------------------------------------------
  // Cursor glow follower
  // ------------------------------------------------------------------
  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(hover: hover)').matches) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let tx = gx, ty = gy;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });
    function animateGlow() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ------------------------------------------------------------------
  // Typed roles
  // ------------------------------------------------------------------
  const typedEl = document.querySelector('[data-typed]');
  if (typedEl) {
    const roles = (typedEl.getAttribute('data-typed') || '').split('|').map(s => s.trim()).filter(Boolean);
    let roleIdx = 0, charIdx = 0, deleting = false;
    const span = document.createElement('span');
    const caret = document.createElement('span');
    caret.className = 'caret';
    typedEl.innerHTML = '';
    typedEl.appendChild(span);
    typedEl.appendChild(caret);
    function tick() {
      const word = roles[roleIdx];
      if (!deleting) {
        span.textContent = word.slice(0, ++charIdx);
        if (charIdx === word.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 55 + Math.random() * 40);
      } else {
        span.textContent = word.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(tick, 260);
          return;
        }
        setTimeout(tick, 28);
      }
    }
    if (roles.length) setTimeout(tick, 800);
  }

  // ------------------------------------------------------------------
  // Hero terminal reveal
  // ------------------------------------------------------------------
  const term = document.querySelector('.terminal-body');
  if (term) {
    const lines = term.querySelectorAll('.line');
    lines.forEach((l, i) => {
      setTimeout(() => {
        l.style.transition = 'opacity 0.3s, transform 0.3s';
        l.style.opacity = '1';
        l.style.transform = 'translateY(0)';
      }, 1800 + i * 180);
    });
  }

  // ------------------------------------------------------------------
  // Stat counters
  // ------------------------------------------------------------------
  const counters = document.querySelectorAll('[data-count]');
  const seenCounters = new WeakSet();
  if (counters.length) {
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting && !seenCounters.has(ent.target)) {
          seenCounters.add(ent.target);
          const el = ent.target;
          const end = parseFloat(el.getAttribute('data-count')) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const dur = 1500;
          const t0 = performance.now();
          function step(now) {
            const p = Math.min(1, (now - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = end >= 10 ? Math.round(end * eased) : (end * eased).toFixed(1);
            el.textContent = prefix + val + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => ob.observe(c));
  }

  // ------------------------------------------------------------------
  // Reveal on scroll
  // ------------------------------------------------------------------
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if (revealEls.length) {
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          ent.target.classList.add('in');
          rio.unobserve(ent.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => rio.observe(el));
  }

  // ------------------------------------------------------------------
  // Proficiency bar fill
  // ------------------------------------------------------------------
  const bars = document.querySelectorAll('.prof-bar .fill');
  if (bars.length) {
    const bio = new IntersectionObserver((entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          const val = ent.target.getAttribute('data-val') || '50';
          setTimeout(() => {
            ent.target.style.width = val + '%';
          }, 80);
          bio.unobserve(ent.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(b => bio.observe(b));
  }

  // ------------------------------------------------------------------
  // Project card cursor-follow radial light
  // ------------------------------------------------------------------
  document.querySelectorAll('.project-card, .expertise-card, .cert-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  // ------------------------------------------------------------------
  // Magnetic buttons
  // ------------------------------------------------------------------
  document.querySelectorAll('.btn, .nav-link').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ------------------------------------------------------------------
  // Orbit nodes layout (polar positions)
  // ------------------------------------------------------------------
  document.querySelectorAll('.skill-orbit').forEach((orbit) => {
    const nodes = orbit.querySelectorAll('.orbit-node');
    nodes.forEach((n, i) => {
      const r = parseFloat(n.getAttribute('data-radius') || '40');
      const angle = parseFloat(n.getAttribute('data-angle') || (i * (360 / nodes.length)));
      const rad = (angle - 90) * Math.PI / 180;
      const x = 50 + Math.cos(rad) * r;
      const y = 50 + Math.sin(rad) * r;
      n.style.left = x + '%';
      n.style.top = y + '%';
    });
  });

  // ------------------------------------------------------------------
  // Network map — draw lines between nodes
  // ------------------------------------------------------------------
  document.querySelectorAll('.netmap').forEach((map) => {
    const nodes = map.querySelectorAll('.netnode');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('viewBox', '0 0 100 100');
    map.prepend(svg);

    const coords = Array.from(nodes).map(n => ({
      x: parseFloat(n.style.left),
      y: parseFloat(n.style.top),
      el: n
    }));

    // Connect each node to 2 closest neighbors
    coords.forEach((a, i) => {
      const dists = coords
        .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
        .filter(o => o.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 2);
      dists.forEach((o) => {
        const b = coords[o.j];
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', a.x);
        line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x);
        line.setAttribute('y2', b.y);
        line.setAttribute('stroke', 'rgba(0,240,255,0.3)');
        line.setAttribute('stroke-width', '0.15');
        line.setAttribute('stroke-dasharray', '1 1');
        svg.appendChild(line);
      });
    });
  });

  // ------------------------------------------------------------------
  // Threat log auto-append
  // ------------------------------------------------------------------
  const log = document.querySelector('.threatlog');
  if (log) {
    const sources = [
      { lvl: 'info', msg: 'Port scan completed :: 0 open on perimeter' },
      { lvl: 'succ', msg: 'TLS handshake verified [AES-256-GCM]' },
      { lvl: 'warn', msg: 'Anomalous traffic pattern — 10.0.2.45' },
      { lvl: 'info', msg: 'Firewall rules synced (iptables)' },
      { lvl: 'succ', msg: 'Kernel signatures refreshed' },
      { lvl: 'crit', msg: 'Intrusion attempt blocked @ :22' },
      { lvl: 'info', msg: 'WLAN sweep — 14 devices enumerated' },
      { lvl: 'succ', msg: 'Vulnerability patched: CVE-2024-21893' },
      { lvl: 'warn', msg: 'Rate limit threshold — geo: RU' },
      { lvl: 'info', msg: 'HIDS baseline updated' },
      { lvl: 'succ', msg: 'Packet capture saved: dump_04.pcap' },
      { lvl: 'info', msg: 'SSH session terminated (safe)' }
    ];
    function fmtTime() {
      const d = new Date();
      return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
    }
    function addRow() {
      const s = sources[Math.floor(Math.random() * sources.length)];
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `
        <span class="ts">${fmtTime()}</span>
        <span class="lvl ${s.lvl}">${s.lvl.toUpperCase()}</span>
        <span class="msg">${s.msg}</span>
      `;
      row.style.opacity = '0';
      row.style.transform = 'translateY(-4px)';
      row.style.transition = 'opacity .3s, transform .3s';
      log.insertBefore(row, log.firstChild);
      requestAnimationFrame(() => {
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
      });
      while (log.children.length > 10) log.removeChild(log.lastChild);
    }
    // seed
    for (let i = 0; i < 6; i++) addRow();
    setInterval(addRow, 2800);
  }

  // ------------------------------------------------------------------
  // Contact form with email submission
  // ------------------------------------------------------------------
  const cf = document.querySelector('.contact-form');
  if (cf) {
    cf.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = cf.querySelector('[type="submit"]');
      if (!btn) return;
      
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span class="mono">TRANSMITTING…</span>';
      btn.disabled = true;
      
      // Get form data
      const formData = new FormData(cf);
      const name = formData.get('name') || 'Anonymous';
      const email = formData.get('email') || 'Not provided';
      const subject = formData.get('subject') || 'General Inquiry';
      const message = formData.get('message') || '';
      
      try {
        // Submit to Formspree
        const response = await fetch(cf.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Store in sessionStorage for success page
          sessionStorage.setItem('contactName', name);
          sessionStorage.setItem('contactEmail', email);
          sessionStorage.setItem('contactSubject', subject);
          sessionStorage.setItem('contactMessage', message);
          
          // Redirect to success page
          window.location.href = 'success.html';
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Error:', error);
        btn.innerHTML = '✗ TRANSMISSION FAILED';
        btn.style.borderColor = 'var(--alert-red)';
        btn.style.color = 'var(--alert-red)';
        
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 3000);
      }
    });
  }

  // ------------------------------------------------------------------
  // Highlight active nav (based on filename)
  // ------------------------------------------------------------------
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-link').forEach((a) => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ------------------------------------------------------------------
  // Clock in nav (Nepal Time)
  // ------------------------------------------------------------------
  const clock = document.querySelector('[data-clock]');
  if (clock) {
    function tick() {
      const now = new Date();
      // Nepal is UTC+5:45
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const nepalOffset = (5 * 60 + 45) * 60000; // 5 hours 45 minutes in milliseconds
      const nepalDate = new Date(utcTime + nepalOffset);
      
      const hours = String(nepalDate.getHours()).padStart(2, '0');
      const minutes = String(nepalDate.getMinutes()).padStart(2, '0');
      const seconds = String(nepalDate.getSeconds()).padStart(2, '0');
      
      clock.textContent = `${hours}:${minutes}:${seconds} NPT`;
    }
    tick();
    setInterval(tick, 1000);
  }

  // ------------------------------------------------------------------
  // Nepal time in hero (UTC+5:45)
  // ------------------------------------------------------------------
  const nepalTime = document.getElementById('nepal-time');
  if (nepalTime) {
    function updateNepalTime() {
      const now = new Date();
      // Nepal is UTC+5:45
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const nepalOffset = (5 * 60 + 45) * 60000; // 5 hours 45 minutes in milliseconds
      const nepalDate = new Date(utcTime + nepalOffset);
      
      const hours = String(nepalDate.getHours()).padStart(2, '0');
      const minutes = String(nepalDate.getMinutes()).padStart(2, '0');
      const seconds = String(nepalDate.getSeconds()).padStart(2, '0');
      
      nepalTime.textContent = `${hours}:${minutes}:${seconds} NPT`;
    }
    updateNepalTime();
    setInterval(updateNepalTime, 1000);
  }

})();
