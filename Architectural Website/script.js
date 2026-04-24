/* ============================================================
   ARCHITECTURE — Behavior-Reactive Site Engine
   "This site adapts to how you explore it."

   HOW IT WORKS:
   ─────────────
   • Scroll speed  → calm (slow) or dynamic (fast) mood
   • Click bursts  → ripple effects + glow boost
   • Idle 7s       → floating hint appears
   • Scroll reveal → sections fade in as you scroll down
   • Parallax      → landing & about images move with depth
   ============================================================ */


// ============================================================
// 0. FORCE-INJECT a <style> block AFTER your style.css loads
//    so our rules have higher priority. Uses !important only
//    where your CSS would otherwise fight us.
// ============================================================
(function injectGlobalStyles() {
    const css = document.createElement('style');
    css.id = 'architecture-reactive';
    css.textContent = `
        /* ── Reveal system base ──────────────────────────── */
        .arch-reveal {
            opacity: 0 !important;
            transform: translateY(32px) !important;
            transition: opacity 1s cubic-bezier(0.22,1,0.36,1),
                        transform 1s cubic-bezier(0.22,1,0.36,1) !important;
            will-change: opacity, transform;
        }
        .arch-reveal.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        /* ── Dynamic mood overrides ──────────────────────── */
        html[data-mood="dynamic"] .arch-reveal {
            transition-duration: 0.45s !important;
        }

        /* ── Parallax containers need overflow hidden ───── */
        .landing-img {
            overflow: hidden !important;
        }
        .about-img-wrapper {
            overflow: hidden !important;
        }

        /* ── Card hover lift ─────────────────────────────── */
        .card {
            transition: transform 0.4s cubic-bezier(0.22,1,0.36,1),
                        box-shadow 0.4s ease !important;
            cursor: pointer;
        }
        .card:hover {
            transform: translateY(-8px) !important;
            box-shadow: 0 12px 40px rgba(0,0,0,0.18) !important;
        }
        html[data-mood="dynamic"] .card:hover {
            transform: translateY(-14px) !important;
            box-shadow: 0 16px 50px rgba(0,0,0,0.25) !important;
        }

        /* ── Customer card hover ─────────────────────────── */
        .customers-card {
            transition: transform 0.4s cubic-bezier(0.22,1,0.36,1) !important;
        }
        .customers-card:hover {
            transform: translateY(-6px) !important;
        }

        /* ── Button micro-interactions ───────────────────── */
        .about-left button,
        .banner-content button {
            position: relative !important;
            overflow: hidden !important;
            transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
                        box-shadow 0.3s ease !important;
            cursor: pointer;
        }
        .about-left button:hover,
        .banner-content button:hover {
            transform: scale(1.04) !important;
        }
        html[data-mood="dynamic"] .about-left button:hover,
        html[data-mood="dynamic"] .banner-content button:hover {
            transform: scale(1.07) !important;
            box-shadow: 0 0 22px rgba(180,160,130,0.3) !important;
        }

        /* ── Nav link underline reveal ───────────────────── */
        .navigation a {
            position: relative !important;
        }
        .navigation a::after {
            content: '' !important;
            position: absolute !important;
            bottom: -2px !important;
            left: 0 !important;
            width: 100% !important;
            height: 1px !important;
            background: rgba(180,160,130,0.7) !important;
            transform: scaleX(0) !important;
            transform-origin: left !important;
            transition: transform 0.35s cubic-bezier(0.22,1,0.36,1) !important;
        }
        .navigation a:hover::after {
            transform: scaleX(1) !important;
        }

        /* ── Heading glow in dynamic + energetic mode ────── */
        html[data-mood="dynamic"][data-energetic="true"] .about-left h1,
        html[data-mood="dynamic"][data-energetic="true"] .projects-heading,
        html[data-mood="dynamic"][data-energetic="true"] .customers-heading {
            text-shadow: 0 0 40px rgba(180,160,130,0.22) !important;
            transition: text-shadow 0.5s ease !important;
        }

        /* ── Input focus glow ────────────────────────────── */
        .search-bar input:focus,
        .contact-right input:focus {
            outline: none !important;
            box-shadow: 0 0 16px rgba(180,160,130,0.3) !important;
            transition: box-shadow 0.4s ease !important;
        }

        /* ── Idle hint ───────────────────────────────────── */
        #idle-hint {
            position: fixed !important;
            bottom: 36px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 99999 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 12px !important;
            pointer-events: none !important;
            opacity: 0 !important;
            transition: opacity 1.4s ease !important;
        }
        #idle-hint.show {
            opacity: 1 !important;
        }
        #idle-hint .hint-line {
            width: 1px !important;
            height: 44px !important;
            background: linear-gradient(to bottom, transparent, rgba(180,160,130,0.7), transparent) !important;
            animation: hintPulse 2.2s ease-in-out infinite !important;
        }
        #idle-hint .hint-text {
            font-family: 'Abel', sans-serif !important;
            font-size: 10px !important;
            letter-spacing: 3.5px !important;
            text-transform: uppercase !important;
            color: rgba(180,160,130,0.75) !important;
            white-space: nowrap !important;
        }
        @keyframes hintPulse {
            0%, 100% { opacity: 0.25; transform: scaleY(0.65); }
            50%      { opacity: 1;    transform: scaleY(1);    }
        }

        /* ── Ripple animation ────────────────────────────── */
        .arch-ripple {
            position: absolute !important;
            border-radius: 50% !important;
            background: radial-gradient(circle, rgba(180,160,130,0.3) 0%, transparent 70%) !important;
            pointer-events: none !important;
            transform: scale(0) !important;
            animation: rippleOut 0.7s cubic-bezier(0.22,1,0.36,1) forwards !important;
        }
        html[data-mood="dynamic"] .arch-ripple {
            animation-duration: 0.42s !important;
        }
        @keyframes rippleOut {
            to { transform: scale(2.2); opacity: 0; }
        }

        /* ── Landing banner entrance (one-time on load) ─── */
        .banner-heading {
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 1.3s cubic-bezier(0.22,1,0.36,1),
                        transform 1.3s cubic-bezier(0.22,1,0.36,1);
        }
        .banner-heading.in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .banner-content {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 1.1s cubic-bezier(0.22,1,0.36,1) 0.25s,
                        transform 1.1s cubic-bezier(0.22,1,0.36,1) 0.25s;
        }
        .banner-content.in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(css);
})();


// ============================================================
// 1. MOOD SYSTEM
//    Two states: 'calm' and 'dynamic'.
//    Sets data-mood on <html>. All CSS reacts to this.
// ============================================================
const MoodSystem = (() => {
    let mood = 'calm';
    const root = document.documentElement;
    root.setAttribute('data-mood', mood);

    function set(newMood) {
        if (newMood === mood) return;
        mood = newMood;
        root.setAttribute('data-mood', mood);
    }

    function get() { return mood; }

    return { set, get };
})();


// ============================================================
// 2. SCROLL SPEED DETECTOR
//    Samples scroll position every frame. Calculates px/sec.
//    Fast scroll (>700 px/s) → dynamic. Slow (<250) → calm.
// ============================================================
(function ScrollDetector() {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let samples = [];       // last 6 speed readings
    const MAX = 6;

    function tick() {
        const now = performance.now();
        const y   = window.scrollY;
        const dt  = now - lastT;

        if (dt > 0) {
            const speed = Math.abs(y - lastY) / (dt / 1000);
            samples.push(speed);
            if (samples.length > MAX) samples.shift();

            const avg = samples.reduce((a, b) => a + b, 0) / samples.length;

            if (avg > 700)  MoodSystem.set('dynamic');
            if (avg < 250)  MoodSystem.set('calm');
        }

        lastY = y;
        lastT = now;
        requestAnimationFrame(tick);
    }
    tick();
})();


// ============================================================
// 3. PARALLAX ENGINE
//    Runs every frame. Moves .landing-img img and
//    .about-img-wrapper img based on scroll + current mood.
// ============================================================
(function ParallaxEngine() {
    const landingImg = document.querySelector('.landing-img img');
    const aboutImg   = document.querySelector('.about-img-wrapper img');
    const landing    = document.querySelector('.landing');
    const about      = document.querySelector('.about');

    function tick() {
        const scrollY = window.scrollY;
        const isDynamic = MoodSystem.get() === 'dynamic';
        const strength = isDynamic ? 0.55 : 0.28;  // how much the image moves

        // ── Landing image ──
        if (landingImg && landing) {
            const rect = landing.getBoundingClientRect();
            // Only move while landing section is visible
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                const offset = scrollY * strength * 0.4;
                landingImg.style.transform = `scale(1.1) translateY(${offset}px)`;
                landingImg.style.transition = 'none'; // no easing — follows scroll directly
            }
        }

        // ── About image ──
        if (aboutImg && about) {
            const rect = about.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                // progress: 0 when top of about is at bottom of viewport → 1 when at top
                const progress = 1 - (rect.top / window.innerHeight);
                const offset = (progress - 0.5) * strength * 120;
                aboutImg.style.transform = `translateY(${offset}px)`;
                aboutImg.style.transition = 'none';
            }
        }

        requestAnimationFrame(tick);
    }
    tick();
})();


// ============================================================
// 4. SCROLL REVEAL
//    Adds .arch-reveal to target elements on page load.
//    IntersectionObserver adds .visible when they enter view.
//    Uses a two-frame delay so the browser paints opacity:0 first.
// ============================================================
(function ScrollReveal() {
    // Which elements to reveal (in order of appearance)
    const selectors = [
        '.about-left h1',
        '.about-left p',
        '.about-left button',
        '.about-right',
        '.experience',
        '.projects-heading',
        '.card',
        '.customers-heading',
        '.customers-card',
        '.designs',
        '.contact-left h1',
        '.contact-right'
    ];

    // Collect all target elements
    const targets = [];
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => targets.push(el));
    });

    // Add base class + staggered delay for cards
    targets.forEach(el => {
        el.classList.add('arch-reveal');

        // Stagger .card elements by index
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, i) => {
            card.style.transitionDelay = (i * 0.13) + 's';
        });

        // Stagger .customers-card
        const custCards = document.querySelectorAll('.customers-card');
        custCards.forEach((card, i) => {
            card.style.transitionDelay = (i * 0.2) + 's';
        });
    });

    // Observer — triggers reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Two requestAnimationFrame calls guarantee the browser has
            // painted the element in its hidden state before we reveal it.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                });
            });

            observer.unobserve(entry.target); // only reveal once
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    });

    targets.forEach(el => observer.observe(el));
})();


// ============================================================
// 5. LANDING BANNER ENTRANCE
//    Fires once on page load after a short delay so the
//    browser has painted the page first.
// ============================================================
(function LandingEntrance() {
    const heading = document.querySelector('.banner-heading');
    const content = document.querySelector('.banner-content');

    // Wait two frames then trigger
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (heading) heading.classList.add('in');
            if (content) content.classList.add('in');
        });
    });
})();


// ============================================================
// 6. CLICK DETECTOR — Ripples + Energetic State
//    Tracks click timestamps. 3+ clicks within 1.5s
//    activates energetic mode (data-energetic="true").
//    Every click on an interactive element spawns a ripple.
// ============================================================
(function ClickDetector() {
    const timestamps = [];
    const WINDOW   = 1500;  // ms
    const NEEDED   = 3;     // clicks to trigger energetic
    let energeticTimer = null;

    document.addEventListener('click', function(e) {
        const now = Date.now();
        timestamps.push(now);

        // Prune old
        while (timestamps.length && timestamps[0] < now - WINDOW) {
            timestamps.shift();
        }

        // Check burst
        if (timestamps.length >= NEEDED) {
            document.documentElement.setAttribute('data-energetic', 'true');
            clearTimeout(energeticTimer);
            energeticTimer = setTimeout(() => {
                document.documentElement.removeAttribute('data-energetic');
            }, 3500);
        }

        // Spawn ripple on interactive targets
        spawnRipple(e);

        // Reset idle
        IdleDetector.reset();
    });

    function spawnRipple(e) {
        // Find closest interactive ancestor
        const target = e.target.closest('button, .card, .customers-card, .navigation a');
        if (!target) return;

        // Make sure target can hold the absolutely-positioned ripple
        const pos = getComputedStyle(target).position;
        if (pos === 'static') target.style.position = 'relative';
        target.style.overflow = 'hidden';

        const ripple = document.createElement('span');
        ripple.className = 'arch-ripple';

        // Size = diagonal of the element so ripple covers it fully
        const rect = target.getBoundingClientRect();
        const size = Math.hypot(rect.width, rect.height);
        ripple.style.width  = size + 'px';
        ripple.style.height = size + 'px';

        // Position at click point relative to element
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ripple.style.left = (x - size / 2) + 'px';
        ripple.style.top  = (y - size / 2) + 'px';

        target.appendChild(ripple);

        // Remove after animation ends
        ripple.addEventListener('animationend', () => ripple.remove());
    }
})();


// ============================================================
// 7. IDLE DETECTOR
//    7 seconds of no activity → show a contextual hint.
//    ANY interaction hides it immediately.
// ============================================================
const IdleDetector = (() => {
    const DELAY = 7000;
    let timer = null;
    let hintEl = null;

    // Context hints mapped to scroll depth
    const hints = [
        { at: 0.00, text: 'Scroll to experience the space' },
        { at: 0.12, text: 'Explore the structure below'    },
        { at: 0.30, text: 'Discover our latest projects'   },
        { at: 0.55, text: 'Hear what our clients say'      },
        { at: 0.78, text: 'Stay connected with us'         }
    ];

    function getHint() {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct  = docH > 0 ? window.scrollY / docH : 0;
        let chosen = hints[0];
        hints.forEach(h => { if (pct >= h.at) chosen = h; });
        return chosen.text;
    }

    function show() {
        if (hintEl) return;

        hintEl = document.createElement('div');
        hintEl.id = 'idle-hint';
        hintEl.innerHTML =
            '<div class="hint-line"></div>' +
            '<span class="hint-text">' + getHint() + '</span>';

        document.body.appendChild(hintEl);

        // Trigger show on next frames
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                hintEl && hintEl.classList.add('show');
            });
        });
    }

    function hide() {
        if (!hintEl) return;
        hintEl.classList.remove('show');
        const el = hintEl;
        hintEl = null;
        setTimeout(() => el.remove(), 1400);
    }

    function reset() {
        clearTimeout(timer);
        hide();
        timer = setTimeout(show, DELAY);
    }

    // Listen on everything
    ['mousemove','scroll','keydown','click','touchstart','touchmove','wheel']
        .forEach(ev => document.addEventListener(ev, reset, { passive: true }));

    // Start on load
    reset();

    return { reset };
})();


// ============================================================
// 8. CONSOLE SIGNATURE
// ============================================================
console.log(
    '%c— ARCHITECTURE —\n%cThis site adapts to how you explore it.',
    'color:rgba(180,160,130,0.9);font-family:"Abel",sans-serif;font-size:14px;letter-spacing:3px;padding:6px 0;border-bottom:1px solid rgba(180,160,130,0.25);',
    'color:rgba(180,160,130,0.5);font-family:"Abel",sans-serif;font-size:11px;letter-spacing:2px;'
);