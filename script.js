/* =========================================================
   Meraj Ali — Portfolio interactions
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const ICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/';
  const EMAIL = 'merajali45425@gmail.com';

  /* ---------- Data ---------- */
  const tech = [
    ['React', 'react/react-original'],
    ['Next.js', 'nextjs/nextjs-original', true],
    ['Node.js', 'nodejs/nodejs-original'],
    ['Express', 'express/express-original', true],
    ['PostgreSQL', 'postgresql/postgresql-original'],
    ['Prisma', 'prisma/prisma-original', true],
    ['MongoDB', 'mongodb/mongodb-original'],
    ['JavaScript', 'javascript/javascript-original'],
    ['Tailwind CSS', 'tailwindcss/tailwindcss-original'],
    ['MUI', 'materialui/materialui-original'],
    ['Firebase', 'firebase/firebase-original'],
    ['Docker', 'docker/docker-original'],
    ['Git', 'git/git-original'],
    ['GitHub', 'github/github-original', true],
    ['Postman', 'postman/postman-original'],
  ];

  const skillGroups = [
    { title: 'Frontend', icon: 'fa-solid fa-display', items: [
      ['HTML5', 'html5/html5-original'], ['CSS3', 'css3/css3-original'], ['JavaScript', 'javascript/javascript-original'],
      ['React', 'react/react-original'], ['Next.js', 'nextjs/nextjs-original', true] ] },
    { title: 'Backend', icon: 'fa-solid fa-server', items: [
      ['Node.js', 'nodejs/nodejs-original'], ['Express', 'express/express-original', true],
      ['REST APIs', null, false, 'fa-solid fa-plug'], ['JWT Auth', null, false, 'fa-solid fa-key'], ['Postman', 'postman/postman-original'] ] },
    { title: 'Databases', icon: 'fa-solid fa-database', items: [
      ['PostgreSQL', 'postgresql/postgresql-original'], ['MongoDB', 'mongodb/mongodb-original'],
      ['Prisma ORM', 'prisma/prisma-original', true], ['Firebase / Firestore', 'firebase/firebase-original'] ] },
    { title: 'UI & Styling', icon: 'fa-solid fa-palette', items: [
      ['Tailwind CSS', 'tailwindcss/tailwindcss-original'], ['MUI', 'materialui/materialui-original'],
      ['Bootstrap', 'bootstrap/bootstrap-original'], ['Responsive design', null, false, 'fa-solid fa-mobile-screen'] ] },
    { title: 'DevOps & Cloud', icon: 'fa-solid fa-cloud', items: [
      ['Docker', 'docker/docker-original'], ['AWS Rekognition', null, false, 'fa-brands fa-aws'],
      ['Netlify / Vercel', null, false, 'fa-solid fa-rocket'] ] },
    { title: 'Workflow', icon: 'fa-solid fa-code-branch', items: [
      ['Git', 'git/git-original'], ['GitHub', 'github/github-original', true],
      ['Team leadership', null, false, 'fa-solid fa-people-group'], ['Project management', null, false, 'fa-solid fa-list-check'] ] },
  ];

  const iconImg = (path, invert) =>
    `<img src="${ICON}${path}.svg" alt="" width="20" height="20" loading="lazy"${invert ? ' class="invert-dark"' : ''}>`;

  /* ---------- Render marquee + skills ---------- */
  const track = $('.marquee-track');
  if (track) {
    const items = tech.map(([n, p, inv]) => `<span class="marquee-item">${iconImg(p, inv)}${n}</span>`).join('');
    track.innerHTML = items + items.replace(/<span class="marquee-item">/g, '<span class="marquee-item" aria-hidden="true">');
  }

  const skillsGrid = $('#skills-grid');
  if (skillsGrid) {
    skillsGrid.innerHTML = skillGroups.map((g) => `
      <article class="card skill-group reveal">
        <h3><i class="${g.icon}" aria-hidden="true"></i>${g.title}</h3>
        <ul class="skill-list">
          ${g.items.map(([n, p, inv, fa]) => `<li class="skill">${p ? iconImg(p, inv) : `<i class="${fa}" aria-hidden="true"></i>`}${n}</li>`).join('')}
        </ul>
      </article>`).join('');
  }

  /* ---------- Theme ---------- */
  const themeBtn = $('#theme-toggle');
  const currentTheme = () =>
    root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const syncThemeIcon = () => {
    const t = currentTheme();
    themeBtn.innerHTML = `<i class="fa-solid ${t === 'dark' ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>`;
    $('meta[name="theme-color"]').setAttribute('content', t === 'dark' ? '#0a0b10' : '#f6f5f1');
  };
  syncThemeIcon();
  themeBtn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeIcon();
  });

  /* ---------- Nav: scrolled state, mobile menu, active link ---------- */
  const nav = $('#nav');
  const menuBtn = $('#menu-btn');
  const navLinks = $('#nav-links');
  const fab = $('#recruiter-open');
  const progress = $('#progress-bar');

  // Swap the icon's class rather than its element, so a click on the icon
  // still counts as "inside the nav" for the outside-click handler below.
  const menuIcon = $('i', menuBtn);
  const setMenu = (open) => {
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuIcon.classList.toggle('fa-bars', !open);
    menuIcon.classList.toggle('fa-xmark', open);
  };
  const closeMenu = () => setMenu(false);
  menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  $$('a', navLinks).forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !nav.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) { closeMenu(); menuBtn.focus(); }
  });

  const sections = $$('main section[id]');
  const linkFor = (id) => $(`.nav-links a[href="#${id}"]`);

  const timeline = $('#timeline');
  const tlFill = $('#timeline-fill');
  const tlItems = $$('.tl-item');

  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('scrolled', y > 20);
    fab.classList.toggle('show', y > window.innerHeight * 0.6);
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    // active nav link
    let current = '';
    for (const s of sections) if (s.offsetTop - 140 <= y) current = s.id;
    $$('.nav-links a').forEach((a) => a.classList.remove('active'));
    const l = current && linkFor(current);
    if (l) l.classList.add('active');

    // timeline fill
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const mid = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      tlFill.style.transform = `scaleY(${p})`;
      tlItems.forEach((it) => {
        const ir = it.getBoundingClientRect();
        it.classList.toggle('lit', ir.top + 40 < mid);
      });
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Cursor spotlight ---------- */
  if (finePointer && !reduceMotion) {
    window.addEventListener('pointermove', (e) => {
      root.style.setProperty('--mx', e.clientX + 'px');
      root.style.setProperty('--my', e.clientY + 'px');
    }, { passive: true });
  }

  /* ---------- Typed roles ---------- */
  const typed = $('#typed');
  const roles = ['MERN Stack Developer', 'Full-Stack Engineer', 'Computer Systems Engineer', 'Team Lead @ UniChalo', 'React · Node · PostgreSQL'];
  if (typed && !reduceMotion) {
    let ri = 0, ci = roles[0].length, deleting = true;
    const tick = () => {
      const word = roles[ri];
      ci += deleting ? -1 : 1;
      typed.textContent = word.slice(0, ci);
      let delay = deleting ? 35 : 70;
      if (!deleting && ci === word.length) { deleting = true; delay = 2200; }
      else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 300; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2600);
  }

  /* ---------- Reveal on scroll (with stagger) ---------- */
  const reveals = $$('.reveal');
  // stagger siblings in the same parent
  const groups = new Map();
  reveals.forEach((el) => {
    const p = el.parentElement;
    const i = groups.get(p) || 0;
    el.style.setProperty('--d', `${Math.min(i, 5) * 0.06}s`);
    groups.set(p, i + 1);
  });

  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target.toFixed(dec) + suffix; return; }
    const dur = 1400; const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = (target * eased).toFixed(dec) + (k === 1 ? suffix : '');
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add('in');
        $$('[data-count]', el).forEach(countUp);
        if (el.matches('[data-count]')) countUp(el);
        const ring = el.querySelector('.gpa-ring');
        if (ring) setTimeout(() => ring.classList.add('in'), 200);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
    $$('[data-count]').forEach(countUp);
    $$('.gpa-ring').forEach((r) => r.classList.add('in'));
  }

  /* ---------- Karachi clock ---------- */
  const clock = $('#clock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Karachi' });
    const upd = () => { clock.textContent = fmt.format(new Date()); };
    upd(); setInterval(upd, 15000);
  }

  /* ---------- Toast + copy email ---------- */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  };
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) {}
      ta.remove();
      return ok;
    }
  };
  $$('.copy-email').forEach((b) => b.addEventListener('click', async () => {
    const ok = await copyText(b.dataset.email || EMAIL);
    showToast(ok ? '✓ Email copied — talk soon!' : EMAIL);
  }));

  /* ---------- Recruiter quick view ---------- */
  const dlg = $('#recruiter');
  fab.addEventListener('click', () => {
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else location.hash = '#snapshot';
  });
  $('#recruiter-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  /* ---------- Project card tilt ---------- */
  if (finePointer && !reduceMotion) {
    $$('.project').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Interactive terminal ---------- */
  const body = $('#term-body');
  const form = $('#term-form');
  const input = $('#term-cmd');
  const history = [];
  let hIndex = -1;

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const print = (html, cls = '') => {
    const div = document.createElement('div');
    div.className = 'line ' + cls;
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  };

  const commands = {
    help: () => [
      '<span class="d">Available commands:</span>',
      '  <span class="k">whoami</span>       who is Meraj?',
      '  <span class="k">experience</span>   where I\'ve worked',
      '  <span class="k">projects</span>     things I\'ve built',
      '  <span class="k">stack</span>        my toolkit (as JSON)',
      '  <span class="k">education</span>    degree & certifications',
      '  <span class="k">contact</span>      how to reach me',
      '  <span class="k">resume</span>       download my CV',
      '  <span class="k">hire meraj</span>   you know you want to ;)',
      '  <span class="k">clear</span>        clear the screen',
    ].join('\n'),
    whoami: () =>
      '<span class="s">Meraj Ali</span>\n' +
      'MERN Stack Developer · Computer Systems Engineer\n' +
      '<span class="d">📍 Karachi, Pakistan  ·  🟢 open to new opportunities</span>',
    experience: () => [
      '<span class="y">2026</span>  MERN Stack Developer Intern   <span class="k">@ Quanrio</span>',
      '<span class="y">2025</span>  MERN Stack Developer          <span class="k">@ FMZ Fire Safety Engineering</span>',
      '<span class="y">2025</span>  Frontend Developer Intern     <span class="k">@ Softech Digital Group</span>',
      '<span class="d">→ scroll to "Experience" for details</span>',
    ].join('\n'),
    projects: () => [
      '<span class="s">UniChalo</span>        AI-powered social & education app <span class="d">(team lead · live on Google Play)</span>',
      '<span class="s">Restaurant POS</span>  menus, orders & admin roles <span class="d">(React)</span>',
      '<span class="s">Knotsy Knot</span>     serverless e-commerce <span class="d">(Firebase)</span>',
      '<span class="s">Scenzz</span>          trust-first meetup app <span class="d">(coming soon to Google Play)</span>',
      '<span class="s">FMZ Fire Safety</span> corporate website',
      '<span class="s">OUF Global</span>      import & export company website',
    ].join('\n'),
    stack: () =>
      '{\n' +
      '  <span class="k">"frontend"</span>: [<span class="s">"React"</span>, <span class="s">"Next.js"</span>, <span class="s">"JavaScript"</span>, <span class="s">"HTML"</span>, <span class="s">"CSS"</span>],\n' +
      '  <span class="k">"backend"</span>:  [<span class="s">"Node.js"</span>, <span class="s">"Express"</span>, <span class="s">"REST APIs"</span>],\n' +
      '  <span class="k">"database"</span>: [<span class="s">"PostgreSQL"</span>, <span class="s">"MongoDB"</span>, <span class="s">"Prisma"</span>],\n' +
      '  <span class="k">"ui"</span>:       [<span class="s">"Tailwind"</span>, <span class="s">"MUI"</span>, <span class="s">"Bootstrap"</span>],\n' +
      '  <span class="k">"tools"</span>:    [<span class="s">"Docker"</span>, <span class="s">"Git"</span>, <span class="s">"GitHub"</span>, <span class="s">"Postman"</span>]\n' +
      '}',
    education: () =>
      '🎓 <span class="s">B.E. Computer Systems Engineering</span>\n' +
      '   Dawood University of Engineering & Technology · 2022–2026\n' +
      '   CGPA: <span class="y">3.71</span>\n' +
      '📜 Full Stack Web Engineering — Jawan Pakistan\n' +
      '📜 Project Management Foundations — Google',
    contact: () =>
      `✉️  <a class="s" href="mailto:${EMAIL}">${EMAIL}</a>\n` +
      '📞 +92 315 8417553\n' +
      '🔗 <a class="s" href="https://www.linkedin.com/in/merajali1" target="_blank" rel="noopener">linkedin.com/in/merajali1</a>\n' +
      '🐙 <a class="s" href="https://github.com/MerajAli1" target="_blank" rel="noopener">github.com/MerajAli1</a>',
    resume: () => {
      const a = document.createElement('a');
      a.href = 'assets/Meraj-Ali-Resume.pdf'; a.download = 'Meraj-Ali-Resume.pdf';
      document.body.appendChild(a); a.click(); a.remove();
      return '<span class="s">✓</span> Downloading Meraj-Ali-Resume.pdf…';
    },
    'hire meraj': () => {
      setTimeout(() => $('#contact').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 900);
      return '<span class="s">✓ Excellent decision.</span> Opening contact…';
    },
    sudo: () => '<span class="y">Nice try.</span> But you can just <span class="k">hire meraj</span> instead.',
    ls: () => '<span class="k">experience/</span>  <span class="k">projects/</span>  <span class="k">stack.json</span>  <span class="s">resume.pdf</span>',
    clear: () => { body.innerHTML = ''; return null; },
  };
  const aliases = { 'cat stack.json': 'stack', skills: 'stack', about: 'whoami', hire: 'hire meraj', cv: 'resume', 'hire me': 'hire meraj' };

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!cmd) return;
    print(esc(raw.trim()), 'cmd');
    history.unshift(raw.trim()); hIndex = -1;
    const key = commands[cmd] ? cmd : aliases[cmd] || (cmd.startsWith('sudo') ? 'sudo' : null);
    const out = key ? commands[key]() : `<span class="d">command not found:</span> ${esc(cmd)} <span class="d">— try</span> <span class="k">help</span>`;
    if (out) print(out);
  };

  if (body) {
    print('<span class="d">Welcome! This terminal actually works.</span>');
    print('<span class="d">Type</span> <span class="k">help</span> <span class="d">or tap a command below.</span>');

    form.addEventListener('submit', (e) => { e.preventDefault(); run(input.value); input.value = ''; });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' && history.length) {
        hIndex = Math.min(hIndex + 1, history.length - 1); input.value = history[hIndex]; e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        hIndex = Math.max(hIndex - 1, -1); input.value = hIndex < 0 ? '' : history[hIndex]; e.preventDefault();
      }
    });
    $$('#term-chips button').forEach((b) => b.addEventListener('click', () => run(b.dataset.cmd)));
    $('#terminal').addEventListener('click', (e) => {
      if (!e.target.closest('button, a') && finePointer) input.focus({ preventScroll: true });
    });

    // auto-run "whoami" the first time the terminal scrolls into view
    if ('IntersectionObserver' in window) {
      const tio = new IntersectionObserver((en) => {
        if (en[0].isIntersecting) { setTimeout(() => run('whoami'), 500); tio.disconnect(); }
      }, { threshold: 0.5 });
      tio.observe(body);
    }
  }

  /* ---------- Footer year ---------- */
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
