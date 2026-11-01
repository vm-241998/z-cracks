document.addEventListener('DOMContentLoaded', function () {
    const targets = document.querySelectorAll('.hero, .events-hero, .product-cards, .contact-section');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(t => observer.observe(t));
});

document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.header');
    if (!header) return;

    const threshold = 80; // px scrolled before header becomes fixed

    function updateHeader() {
        // On small screens we keep header fixed; updateHeader only handles larger screens
        if (window.innerWidth <= 700) return;

        const y = window.scrollY || window.pageYOffset;
        if (y > threshold) {
            if (!header.classList.contains('fixed')) {
                header.classList.add('fixed');
                // reserve space by adding margin to the next content element
                setContentOffset();
            }
        } else {
            if (header.classList.contains('fixed')) {
                header.classList.remove('fixed');
                setContentOffset();
            }
        }
    }

    // run on load and scroll
    updateHeader();
    // trigger header reveal animation shortly after load
    setTimeout(() => header.classList.add('in-view'), 80);
    // enforce fixed header on small screens and set body padding
    function setContentOffset() {
        // find the wrapper that contains header (commonly a .container) then shift the following element
        let wrap = header.closest('.container');
        let target = null;
        if (wrap) target = wrap.nextElementSibling;
        if (!target) target = header.nextElementSibling;

        if (!target) return;

        // Detect if the header is effectively fixed (either via the `.fixed` class
        // or CSS rules that set `position: fixed`/`sticky`). Some pages force
        // fixed via CSS on mobile, so relying only on the class causes overlap.
        const computed = window.getComputedStyle(header);
        const isFixed = header.classList.contains('fixed') || computed.position === 'fixed' || computed.position === 'sticky';

        if (isFixed) {
            const h = header.offsetHeight || parseInt(computed.height, 10) || 64;
            target.style.marginTop = h + 'px';
        } else {
            target.style.marginTop = '';
        }
    }

    // initial enforcement and on resize
    // ensure offset applied on load and resize
    setContentOffset();
    window.addEventListener('resize', () => setContentOffset(), { passive: true });
    // mobile menu toggle
    const toggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const open = header.classList.toggle('menu-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (mobileNav) mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
        });
        // close when clicking outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && header.classList.contains('menu-open')) {
                header.classList.remove('menu-open');
                toggle.setAttribute('aria-expanded', 'false');
                if (mobileNav) mobileNav.setAttribute('aria-hidden', 'true');
            }
        });
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('resize', () => { if (header.classList.contains('fixed')) setContentOffset(); });
});