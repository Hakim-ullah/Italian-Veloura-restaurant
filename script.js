



(function () {
    'use strict';

    /* ── TOUCH ── */
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) document.body.classList.add('touch-device');

    /* ── LOADER ── */
    window.addEventListener('load', () => {
        setTimeout(() => {
            const l = document.getElementById('loader');
            l.classList.add('hidden');
            setTimeout(() => { l.remove(); showToast('✦ Welcome to Veloura Roma') }, 1100);
        }, 2200);
    });

    /* ── TOAST ── */
    function showToast(msg, dur = 3500) {
        const c = document.getElementById('toast-container');
        const t = document.createElement('div');
        t.className = 'toast'; t.innerHTML = `<span class="toast-dot"></span>${msg}`;
        c.appendChild(t);
        requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')) });
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 600) }, dur);
    }

    /* ── CURSOR ── */
    if (!isTouch) {
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my, dx = mx, dy = my;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY });
        (function anim() {
            rx += (mx - rx) * .12; ry += (my - ry) * .12; dx += (mx - dx) * .3; dy += (my - dy) * .3;
            ring.style.left = (rx - ring.offsetWidth / 2) + 'px'; ring.style.top = (ry - ring.offsetHeight / 2) + 'px';
            dot.style.left = (dx - dot.offsetWidth / 2) + 'px'; dot.style.top = (dy - dot.offsetHeight / 2) + 'px';
            requestAnimationFrame(anim);
        })();
        const hoverLink = document.querySelectorAll('a,button,.dish-card,.gallery-item,.menu-item,.filter-tab,.menu-tab-btn,.event-card,.t-arrow,.testimonial-dot,input,select,textarea,.btt,.hamburger,.award-card,.ing-card,.wine-card,.exp-tab');
        hoverLink.forEach(el => {
            el.addEventListener('mouseenter', () => { ring.classList.add('hover-link'); dot.classList.add('expand') });
            el.addEventListener('mouseleave', () => { ring.classList.remove('hover-link', 'hover-btn', 'hover-img'); dot.classList.remove('expand') });
        });
        document.querySelectorAll('.btn-primary,.btn-secondary,.btn-nav-reserve,.btn-submit,.nl-form button,.btn-gold-outline').forEach(el => {
            el.addEventListener('mouseenter', () => { ring.classList.add('hover-btn'); ring.classList.remove('hover-link', 'hover-img') });
            el.addEventListener('mouseleave', () => ring.classList.remove('hover-btn'));
        });
        document.querySelectorAll('.gallery-item,.dish-card-img-wrap,.chef-img-frame,.event-img-wrap,.about-img-frame,.tasting-img,.exp-panel-img,.quote-banner-bg').forEach(el => {
            el.addEventListener('mouseenter', () => { ring.classList.add('hover-img'); ring.classList.remove('hover-link', 'hover-btn') });
            el.addEventListener('mouseleave', () => ring.classList.remove('hover-img'));
        });
    }

    /* ── SCROLL PROGRESS + BTT ── */
    const prog = document.getElementById('scroll-progress');
    const btt = document.getElementById('btt');
    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
        btt.classList.toggle('visible', window.scrollY > 700);
    });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ── NAVBAR ── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

    /* ── HAMBURGER ── */
    const ham = document.getElementById('hamburger');
    const mNav = document.getElementById('mobile-nav');
    ham.addEventListener('click', () => {
        ham.classList.toggle('active'); mNav.classList.toggle('active');
        document.body.classList.toggle('modal-open', mNav.classList.contains('active'));
    });
    document.querySelectorAll('[data-close]').forEach(a => a.addEventListener('click', () => {
        ham.classList.remove('active'); mNav.classList.remove('active'); document.body.classList.remove('modal-open');
    }));

    /* ── REVEAL ── */
    const revEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
    const revObs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target) } });
    }, { threshold: .06, rootMargin: '0px 0px -20px 0px' });
    revEls.forEach(r => revObs.observe(r));

    /* ── COUNTERS ── */
    document.querySelectorAll('.counter').forEach(c => {
        const t = +c.dataset.target;
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                const s = performance.now();
                const tick = now => {
                    const p = Math.min((now - s) / 2200, 1);
                    const e = 1 - Math.pow(1 - p, 3);
                    c.textContent = Math.floor(e * t);
                    if (p < 1) requestAnimationFrame(tick); else c.textContent = t;
                };
                requestAnimationFrame(tick); obs.unobserve(c);
            }
        }, { threshold: .5 });
        obs.observe(c);
    });

    /* ── HERO PARTICLES ── */
    const canvas = document.getElementById('hero-particles');
    if (canvas && !isTouch) {
        const ctx = canvas.getContext('2d');
        const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight };
        resize();
        const pts = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            r: Math.random() * 1.4 + .3, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
            o: Math.random() * .5 + .06
        }));
        (function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pts.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201,168,76,${p.o})`; ctx.fill();
            });
            requestAnimationFrame(draw);
        })();
        window.addEventListener('resize', resize);
    }

    /* ── DISHES DATA (Unsplash URLs verified) ── */
    const dishes = [
        {
            id: 1, name: 'Capesante Dorate', price: '€58', cat: 'antipasti',
            desc: 'Seared Hokkaido scallops with saffron purée, crispy guanciale, micro herbs and oscietra caviar.',
            img: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=700&q=90&auto=format&fit=crop',
            badge: 'Signature', wine: 'Gavi di Gavi 2022 — crisp and mineral, with green apple and white flower notes.', tags: ['Gluten-Free', 'Seafood']
        },
        {
            id: 2, name: 'Carpaccio di Manzo', price: '€45', cat: 'antipasti',
            desc: 'Wagyu beef carpaccio, shaved black truffle, 36-month Parmigiano-Reggiano, rocket and white Alba truffle oil.',
            img: 'https://res.cloudinary.com/dbeotyvpg/image/upload/q_auto/f_auto/v1778825914/ChatGPT_Image_May_15_2026_11_18_13_AM_pxmpou.png',
            badge: '', wine: 'Barolo 2019 — structured with red fruit, rose petal and tar.', tags: ['Gluten-Free']
        },
        {
            id: 3, name: 'Risotto al Tartufo', price: '€72', cat: 'primi',
            desc: 'Carnaroli rice risotto with freshly shaved black truffle, 36-month Parmigiano and hand-churned brown butter.',
            img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=700&q=90&auto=format&fit=crop',
            badge: "Chef's Pick", wine: 'Brunello di Montalcino 2018 — elegant, earthy, with Morello cherry and leather.', tags: ['Vegetarian', 'Gluten-Free']
        },
        {
            id: 4, name: "Paccheri all'Astice", price: '€84', cat: 'primi',
            desc: 'Hand-drawn paccheri with whole Mediterranean lobster, sun-dried datterini tomatoes, and fresh sea basil.',
            img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=700&q=90&auto=format&fit=crop',
            badge: '', wine: 'Verdicchio dei Castelli di Jesi 2021 — fresh and saline with citrus and bitter almond.', tags: ['Seafood']
        },
        {
            id: 5, name: 'Branzino in Crosta', price: '€96', cat: 'secondi',
            desc: 'Herb-crusted Mediterranean sea bass with fennel purée, lemon beurre blanc and wild sea vegetables.',
            img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=700&q=90&auto=format&fit=crop',
            badge: 'Signature', wine: 'Chardonnay Langhe 2020 — buttery with tropical fruit and vanilla.', tags: ['Gluten-Free', 'Seafood']
        },
        {
            id: 6, name: 'Guancia di Vitello', price: '€110', cat: 'secondi',
            desc: '72-hour braised veal cheek with Barolo reduction, roasted root vegetables, and white truffle mash.',
            img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=90&auto=format&fit=crop',
            badge: '', wine: 'Amarone della Valpolicella 2015 — rich and velvety with dark fruit and dark chocolate.', tags: ['Gluten-Free']
        },
        {
            id: 7, name: 'Tiramisù Scomposto', price: '€32', cat: 'dolci',
            desc: 'Deconstructed tiramisù with mascarpone mousse, espresso caviar, cocoa crumble and gold leaf.',
            img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=700&q=90&auto=format&fit=crop',
            badge: '', wine: 'Vin Santo del Chianti 2016 — sweet and nutty with dried apricot and honey.', tags: ['Vegetarian']
        },
        {
            id: 8, name: 'Millefoglie alla Vaniglia', price: '€28', cat: 'dolci',
            desc: 'Vanilla bean millefeuille with seasonal berries, edible gold leaf and crème diplomate.',
            img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=700&q=90&auto=format&fit=crop',
            badge: '', wine: "Moscato d'Asti 2023 — lightly sparkling with peach and orange blossom.", tags: ['Vegetarian']
        },
    ];

    const dishGrid = document.getElementById('dishes-grid');
    function renderDishes(filter = 'all') {
        dishGrid.innerHTML = '';
        const items = filter === 'all' ? dishes : dishes.filter(d => d.cat === filter);
        items.forEach((d, i) => {
            const card = document.createElement('div');
            card.className = 'dish-card reveal';
            card.style.transitionDelay = (i * .06) + 's';
            card.innerHTML = `
      <div class="dish-card-img-wrap">
        <img src="${d.img}" class="dish-card-img" alt="${d.name}" loading="lazy">
        <div class="dish-card-img-overlay"></div>
        <button class="dish-view-btn">View Dish</button>
        ${d.badge ? `<span class="dish-badge">${d.badge}</span>` : ''}
      </div>
      <div class="dish-card-body">
        <span class="dish-card-cat">${d.cat}</span>
        <h4>${d.name}</h4>
        <p class="dish-desc">${d.desc.substring(0, 72)}...</p>
        <span class="dish-price">${d.price}</span>
      </div>`;
            card.addEventListener('click', () => openDishModal(d));
            dishGrid.appendChild(card);
            requestAnimationFrame(() => card.classList.add('visible'));
        });
    }
    renderDishes();
    document.querySelectorAll('.filter-tab').forEach(t => t.addEventListener('click', function () {
        document.querySelectorAll('.filter-tab').forEach(x => x.classList.remove('active'));
        this.classList.add('active'); renderDishes(this.dataset.filter);
    }));

    /* ── DISH MODAL ── */
    const modalOv = document.getElementById('dish-modal-overlay');
    function openDishModal(d) {
        document.getElementById('dish-modal-img').src = d.img;
        document.getElementById('dish-modal-cat').textContent = d.cat.toUpperCase();
        document.getElementById('dish-modal-name').textContent = d.name;
        document.getElementById('dish-modal-price').textContent = d.price;
        document.getElementById('dish-modal-desc').textContent = d.desc;
        document.getElementById('dish-modal-wine-text').textContent = d.wine;
        document.getElementById('dish-modal-tags').innerHTML = d.tags.map(t => `<span class="dish-modal-tag">${t}</span>`).join('');
        modalOv.classList.add('active'); document.body.classList.add('modal-open');
    }
    function closeDishModal() { modalOv.classList.remove('active'); document.body.classList.remove('modal-open') }
    document.getElementById('dish-modal-close').addEventListener('click', closeDishModal);
    modalOv.addEventListener('click', e => { if (e.target === modalOv) closeDishModal() });

    /* ── MENU ── */
    const menuData = {
        antipasti: [
            { name: 'Vitello Tonnato', desc: 'Thinly sliced veal, creamy tuna sauce, capers, roe', price: '€38' },
            { name: 'Burrata e Pomodoro', desc: 'Creamy burrata, heirloom tomatoes, basil, aged balsamic', price: '€32' },
            { name: 'Fiori di Zucca', desc: 'Stuffed zucchini flowers, ricotta, anchovy, lemon', price: '€28' },
            { name: 'Polpo alla Griglia', desc: 'Grilled octopus, potato cream, smoked paprika, olive oil', price: '€42' },
            { name: 'Capesante Dorate', desc: 'Seared scallops, saffron purée, guanciale, caviar', price: '€58' },
        ],
        primi: [
            { name: 'Spaghetto al Riccio', desc: 'Sea urchin, aglio, lemon zest, bottarga, toasted breadcrumbs', price: '€68' },
            { name: 'Gnocchi al Pesto', desc: 'Potato gnocchi, Ligurian basil pesto, pine nuts, Grana Padano', price: '€44' },
            { name: 'Tagliatelle al Ragù', desc: 'Hand-cut pasta, 12-hour slow-braised Bolognese', price: '€52' },
            { name: 'Risotto al Tartufo', desc: 'Carnaroli, fresh black truffle, 36-month Parmigiano', price: '€72' },
            { name: "Paccheri all'Astice", desc: 'Mediterranean lobster, datterini, fresh sea basil', price: '€84' },
        ],
        secondi: [
            { name: 'Filetto di Manzo', desc: 'Grilled beef tenderloin, truffle jus, asparagus, morels', price: '€98' },
            { name: 'Astice alla Griglia', desc: 'Whole grilled lobster, herb butter, lemon purée', price: '€120' },
            { name: 'Agnello in Crosta', desc: 'Herb-crusted rack of lamb, rosemary jus, fregola', price: '€88' },
            { name: 'Branzino in Crosta', desc: 'Sea bass, fennel purée, beurre blanc, wild sea vegetables', price: '€96' },
            { name: 'Guancia di Vitello', desc: '72-hour braised veal cheek, Barolo, truffle mash', price: '€110' },
        ],
        dolci: [
            { name: 'Cannolo Siciliano', desc: 'Sheep ricotta, pistachio, candied orange peel', price: '€26' },
            { name: 'Sgroppino al Limone', desc: 'Amalfi lemon sorbet, prosecco, vodka mist', price: '€18' },
            { name: 'Selezione di Formaggi', desc: 'Italian artisanal cheeses, quince, honey, walnuts', price: '€34' },
            { name: 'Tiramisù Scomposto', desc: 'Mascarpone mousse, espresso caviar, gold leaf', price: '€32' },
            { name: 'Millefoglie', desc: 'Vanilla bean, seasonal berries, crème diplomate', price: '€28' },
            { name: 'Amarone 2015', desc: 'Veneto — full-bodied, dark fruit, dried fig', price: '€180/glass' },
            { name: 'Barolo Riserva 2016', desc: 'Piedmont — structured, truffle, rose notes', price: '€220/glass' },
        ]
    };
    const menuItems = document.getElementById('menu-items');
    function renderMenu(cat) {
        menuItems.innerHTML = '';
        (menuData[cat] || []).forEach(i => {
            const div = document.createElement('div');
            div.className = 'menu-item';
            div.innerHTML = `<div class="menu-item-dot"></div><div class="menu-item-info"><h5>${i.name}</h5><p>${i.desc}</p></div><span class="menu-item-price">${i.price}</span>`;
            menuItems.appendChild(div);
        });
    }
    renderMenu('antipasti');
    document.querySelectorAll('#menu-tabs .menu-tab-btn').forEach(b => b.addEventListener('click', function () {
        document.querySelectorAll('#menu-tabs .menu-tab-btn').forEach(x => x.classList.remove('active'));
        this.classList.add('active'); renderMenu(this.dataset.menu);
    }));

    /* ── TASTING ── */
    const courses = [
        { num: 'I', name: 'Amuse-Bouche', desc: 'A delicate welcome — seasonal canapé trio from the Chef' },
        { num: 'II', name: 'Capesante Dorate', desc: 'Seared scallops, saffron purée, guanciale, oscietra caviar' },
        { num: 'III', name: 'Risotto al Tartufo', desc: 'Carnaroli, fresh black truffle, 36-month Parmigiano' },
        { num: 'IV', name: "Paccheri all'Astice", desc: 'Hand-drawn pasta, Mediterranean lobster, datterini' },
        { num: 'V', name: 'Branzino in Crosta', desc: 'Herb-crusted sea bass, fennel purée, beurre blanc' },
        { num: 'VI', name: 'Guancia di Vitello', desc: '72-hour braised veal cheek, Barolo reduction, truffle mash' },
        { num: 'VII', name: 'Tiramisù Scomposto', desc: 'Deconstructed tiramisù, espresso caviar, edible gold' },
    ];
    document.getElementById('tasting-courses').innerHTML = courses.map(c =>
        `<div class="tasting-course"><span class="tasting-num">${c.num}</span><div class="tasting-info"><h5>${c.name}</h5><p>${c.desc}</p></div></div>`
    ).join('');

    /* ── EXPERIENCE TABS ── */
    document.querySelectorAll('.exp-tab').forEach(t => t.addEventListener('click', function () {
        document.querySelectorAll('.exp-tab').forEach(x => x.classList.remove('active'));
        document.querySelectorAll('.exp-panel').forEach(x => x.classList.remove('active'));
        this.classList.add('active');
        const panel = document.getElementById('panel-' + this.dataset.panel);
        if (panel) panel.classList.add('active');
    }));

    /* ── WINE SECTION ── */
    const wineData = [
        { icon: '🍷', name: 'Barolo Riserva', region: 'Piedmont · DOCG', desc: 'The king of Italian wines. Full-bodied with cherries, leather, liquorice and rose petal. Aged 36 months in Slavonian oak — extraordinary structure and longevity.', price: '€220 / glass', vintage: '2016', rating: 5 },
        { icon: '🍾', name: 'Brunello di Montalcino', region: 'Tuscany · DOCG', desc: 'The pinnacle of Sangiovese. Earthy, elegant, with Morello cherry, tobacco and mineral notes. A wine that demands time and rewards patience.', price: '€195 / glass', vintage: '2018', rating: 5 },
        { icon: '🥂', name: 'Franciacorta Millesimato', region: 'Lombardy · DOCG', desc: 'Italy\'s finest sparkling wine — our house welcome glass. Persistent bubbles, brioche, white peach and almond. A flawless aperitivo.', price: '€85 / glass', vintage: '2019', rating: 4 },
    ];
    document.getElementById('wine-grid').innerHTML = wineData.map(w => `
  <div class="wine-card reveal">
    <div class="wine-card-top">
      <span class="wine-bottle-icon">${w.icon}</span>
      <div><h4>${w.name}</h4><span>${w.region}</span></div>
    </div>
    <p>${w.desc}</p>
    <div class="wine-price-row">
      <div><div class="wine-price">${w.price}</div><div class="wine-vintage">Vintage ${w.vintage}</div></div>
      <div class="wine-rating">
        ${Array.from({ length: 5 }, (_, i) => `<span${i < w.rating ? ' class="fill"' : ''}></span>`).join('')}
      </div>
    </div>
  </div>`
    ).join('');
    document.querySelectorAll('.wine-card.reveal').forEach(r => revObs.observe(r));

    /* ── AWARDS ── */
    const awardsData = [
        { icon: '★★★', name: 'Three Michelin Stars', desc: 'The highest distinction in fine dining, awarded annually since 2025 for exceptional cuisine worth a special journey.', year: '2025' },
        { icon: '🏆', name: "World's 50 Best", desc: 'Ranked No. 12 among the world\'s finest restaurants, recognised for culinary innovation and unparalleled service.', year: '2025' },
        { icon: '🍷', name: 'Wine Spectator Grand Award', desc: 'Recognising our 2,000-label cellar spanning all major Italian regions and rare international selections.', year: '2024' },
    ];
    document.getElementById('awards-grid').innerHTML = awardsData.map(a =>
        `<div class="award-card reveal">
    <span class="award-icon">${a.icon}</span>
    <div class="award-name">${a.name}</div>
    <div class="award-desc">${a.desc}</div>
    <span class="award-year">${a.year}</span>
  </div>`
    ).join('');
    document.querySelectorAll('.award-card.reveal').forEach(r => revObs.observe(r));

    /* ── TESTIMONIALS ── */
    const tData = [
        { quote: "An extraordinary evening. Every course was a revelation — the risotto al tartufo is the finest I have ever tasted. Veloura redefines Italian fine dining on every level.", author: 'Elena Rossi', role: 'Food Critic, La Repubblica', stars: 5 },
        { quote: "Chef Valentini's tasting menu is a love letter to Italy. The scallop dish alone is worth traveling to Rome for. Impeccable service, impeccable ambiance.", author: 'James Whitmore', role: 'Michelin Guide Inspector', stars: 5 },
        { quote: 'From the moment we stepped in, we were transported. The wine pairings were inspired, the veal cheek transcendent. A must-visit for any true culinary pilgrim.', author: 'Sofia Lindström', role: 'Editor, Gourmet Magazine', stars: 5 },
        { quote: "Three Michelin stars are almost not enough. The attention to detail — from the handblown glassware to the edible gold on the millefeuille — is breathtaking.", author: 'Marco Bellini', role: 'Restaurant Critic, Corriere della Sera', stars: 5 },
        { quote: 'Veloura captures the soul of Rome on every single plate. The lobster pasta was pure poetry. We left feeling like family. Grazie mille, Veloura.', author: 'Amélie Dubois', role: 'Travel Writer, Condé Nast Traveller', stars: 5 },
    ];
    const tw = document.getElementById('testimonials-wrap');
    const dotsEl = document.getElementById('t-dots');
    let curT = 0, tInterval;
    tw.innerHTML = tData.map((t, i) => `
  <div class="testimonial-slide${i === 0 ? ' active' : ''}" data-i="${i}">
    <div class="testimonial-card">
      <div class="testimonial-stars">${'★'.repeat(t.stars)}</div>
      <p class="testimonial-quote">"${t.quote}"</p>
      <p class="testimonial-author">— ${t.author}</p>
      <p class="testimonial-role">${t.role}</p>
    </div>
  </div>`
    ).join('');
    dotsEl.innerHTML = tData.map((_, i) => `<button class="testimonial-dot${i === 0 ? ' active' : ''}" data-i="${i}"></button>`).join('');
    function goT(idx) {
        const slides = tw.querySelectorAll('.testimonial-slide');
        const dots = dotsEl.querySelectorAll('.testimonial-dot');
        slides[curT].classList.remove('active'); slides[curT].classList.add('exit');
        setTimeout(() => slides[curT].classList.remove('exit'), 600);
        curT = ((idx % slides.length) + slides.length) % slides.length;
        slides[curT].classList.add('active');
        dots.forEach((d, i) => d.classList.toggle('active', i === curT));
    }
    function startT() { clearInterval(tInterval); tInterval = setInterval(() => goT(curT + 1), 5500) }
    dotsEl.querySelectorAll('.testimonial-dot').forEach(d => d.addEventListener('click', () => { goT(+d.dataset.i); startT() }));
    document.getElementById('t-prev').addEventListener('click', () => { goT(curT - 1); startT() });
    document.getElementById('t-next').addEventListener('click', () => { goT(curT + 1); startT() });
    tw.addEventListener('mouseenter', () => clearInterval(tInterval));
    tw.addEventListener('mouseleave', startT);
    startT();

    /* ── GALLERY — replaced broken URLs ── */
    const galleryImgs = [
        { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85&auto=format&fit=crop', tall: true, wide: false },
        { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85&auto=format&fit=crop', tall: false, wide: false },
        { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=85&auto=format&fit=crop', tall: false, wide: false },
        { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=85&auto=format&fit=crop', tall: true, wide: false },
        { src: 'https://res.cloudinary.com/dbeotyvpg/image/upload/q_auto/f_auto/v1778824161/ChatGPT_Image_May_15_2026_10_42_22_AM_dvfvys.png', tall: false, wide: false },
        { src: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=85&auto=format&fit=crop', tall: false, wide: true },
        { src: 'https://res.cloudinary.com/dbeotyvpg/image/upload/q_auto/f_auto/v1778825641/ChatGPT_Image_May_15_2026_11_13_23_AM_ozu9za.png', tall: false, wide: false },
        { src: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=85&auto=format&fit=crop', tall: true, wide: false },
        { src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=85&auto=format&fit=crop', tall: false, wide: false },
    ];
    const gg = document.getElementById('gallery-grid');
    let lbIdx = 0;
    galleryImgs.forEach((g, i) => {
        const div = document.createElement('div');
        div.className = 'gallery-item' + (g.tall ? ' tall' : '') + (g.wide ? ' wide' : '');
        div.innerHTML = `<img src="${g.src}" alt="Veloura Gallery" loading="lazy"><div class="gallery-overlay"><span class="gallery-zoom">View ↗</span></div>`;
        div.addEventListener('click', () => openLB(i));
        gg.appendChild(div);
    });
    function openLB(i) { lbIdx = i; updateLB(); document.getElementById('lightbox').classList.add('active'); document.body.classList.add('modal-open') }
    function updateLB() { document.getElementById('lb-img').src = galleryImgs[lbIdx].src; document.getElementById('lb-counter').textContent = `${lbIdx + 1} / ${galleryImgs.length}` }
    function closeLB() { document.getElementById('lightbox').classList.remove('active'); document.body.classList.remove('modal-open') }
    function prevLB() { lbIdx = (lbIdx - 1 + galleryImgs.length) % galleryImgs.length; updateLB() }
    function nextLB() { lbIdx = (lbIdx + 1) % galleryImgs.length; updateLB() }
    document.getElementById('lb-close').addEventListener('click', closeLB);
    document.getElementById('lb-prev').addEventListener('click', prevLB);
    document.getElementById('lb-next').addEventListener('click', nextLB);
    document.getElementById('lightbox').addEventListener('click', e => { if (e.target === document.getElementById('lightbox')) closeLB() });

    /* ── EVENTS ── */
    const eventsData = [
        { cat: 'Intimate', name: 'Private Dining', desc: 'Exclusive dining for up to 12 guests in our private wine cellar room. Bespoke menus crafted personally by Chef Valentini.', img: 'https://res.cloudinary.com/dbeotyvpg/image/upload/q_auto/f_auto/v1778824178/ChatGPT_Image_May_15_2026_10_47_57_AM_wxljlm.png' },
        { cat: 'Grand', name: 'Celebrations', desc: 'Host up to 80 guests in our main dining hall with fully bespoke menus, floral design, and dedicated service teams.', img: 'https://res.cloudinary.com/dbeotyvpg/image/upload/q_auto/f_auto/v1778824151/ChatGPT_Image_May_15_2026_10_39_48_AM_rnp1hm.png' },
        { cat: 'Connoisseur', name: 'Wine Tastings', desc: "Curated tastings from our 2,000-bottle cellar led by our award-winning head sommelier. An oenophile's dream.", img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=700&q=85&auto=format&fit=crop' },
    ];
    const eg = document.getElementById('events-grid');
    eventsData.forEach(e => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `<div class="event-img-wrap"><img src="${e.img}" alt="${e.name}" loading="lazy"></div>
    <div class="event-card-body">
      <span class="event-cat">${e.cat}</span>
      <h4>${e.name}</h4>
      <p>${e.desc}</p>
      <span class="event-cta">Enquire Now</span>
    </div>`;
        card.addEventListener('click', () => {
            document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
            showToast('✦ ' + e.name + ' enquiry noted');
        });
        eg.appendChild(card);
    });

    /* ── DATE MIN ── */
    const dateInp = document.getElementById('res-date');
    if (dateInp) { const d = new Date(); d.setDate(d.getDate() + 1); dateInp.min = d.toISOString().split('T')[0] }

    /* ── RESERVATION FORM ── */
    const form = document.getElementById('reservation-form');
    const submitBtn = document.getElementById('submit-btn');
    const succEl = document.getElementById('form-success');
    const errEl = document.getElementById('form-error');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        succEl.style.display = 'none'; errEl.style.display = 'none';
        succEl.classList.remove('success'); errEl.classList.remove('error');
        const req = this.querySelectorAll('[required]'); let ok = true;
        req.forEach(f => { if (!f.value.trim()) { ok = false; f.style.borderColor = 'rgba(248,113,113,.5)' } else f.style.borderColor = '' });
        if (!ok) { errEl.textContent = '⚠️ Please fill in all required fields.'; errEl.classList.add('error'); return }
        submitBtn.disabled = true; submitBtn.querySelector('span').textContent = 'Sending…';
        try {
            const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(this) });
            const data = await r.json();
            if (data.success) { succEl.classList.add('success'); this.reset(); showToast('✦ Reservation request sent successfully'); succEl.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
            else throw new Error(data.message || 'Failed');
        } catch (err) {
            errEl.textContent = '⚠️ Something went wrong. Please call us at +39 06 8523 4912.';
            errEl.classList.add('error');
        } finally {
            submitBtn.disabled = false; submitBtn.querySelector('span').textContent = 'Prenota Ora — Request a Table';
        }
    });

    /* ── NEWSLETTER ── */
    document.getElementById('nl-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const i = this.querySelector('input');
        if (i.value.trim()) { showToast('✦ Benvenuto! You have joined the Veloura family'); i.value = '' }
    });

    /* ── HOURS LIVE STATUS ── */
    (function setHoursStatus() {
        const now = new Date();
        const day = now.getDay(); // 0=sun,1=mon,...,6=sat
        const hour = now.getHours();
        const min = now.getMinutes();
        const t = hour * 60 + min;
        const isOpen = (day >= 2 && day <= 4 && t >= 19 * 60 + 30 && t <= 23 * 60 + 30) || (day >= 5 && day <= 6 && t >= 19 * 60 + 30 && t <= 0 * 60 + 30 + 24 * 60);
        const tueFri = ['hours-tue', 'hours-fri'];
        if (day >= 2 && day <= 4) {
            document.getElementById('hours-tue').querySelectorAll('span')[0].innerHTML = 'Tue – Thu <span class="hours-badge' + (isOpen ? '' : ' closed-badge') + '">' + (isOpen ? 'Open Now' : 'Tonight') + '</span>';
        } else if (day >= 5 && day <= 6) {
            document.getElementById('hours-fri').querySelectorAll('span')[0].innerHTML = 'Fri – Sat <span class="hours-badge' + (isOpen ? '' : ' closed-badge') + '">' + (isOpen ? 'Open Now' : 'Tonight') + '</span>';
        }
    })();

    /* ── SMOOTH ANCHOR WITH OFFSET ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const t = document.querySelector(this.getAttribute('href'));
            if (t) { e.preventDefault(); const y = t.getBoundingClientRect().top + window.scrollY - 70; window.scrollTo({ top: y, behavior: 'smooth' }) }
        });
    });

    /* ── KEYBOARD ── */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeDishModal(); closeLB() }
        if (document.getElementById('lightbox').classList.contains('active')) {
            if (e.key === 'ArrowLeft') prevLB(); if (e.key === 'ArrowRight') nextLB();
        }
    });

    /* ── DELAYED TOASTS for engagement ── */
    setTimeout(() => showToast('🍷 Seasonal truffle menu now available'), 8000);
    setTimeout(() => showToast('📅 Limited tables remain for June'), 18000);

})();