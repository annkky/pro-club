// ============================================
// ClubPro — Landing Page Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // === Check reduced motion preference ===
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // === Navbar scroll ===
    const navbar = document.getElementById('navbar');

    // === Burger menu ===
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');

    burger.addEventListener('click', () => {
        const isActive = !burger.classList.contains('active');
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
        burger.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            burger.focus();
        }
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // === Animated counters ===
    const counters = document.querySelectorAll('.stat-number[data-target]');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                const suffix = counter.dataset.suffix || '';
                
                if (prefersReducedMotion) {
                    counter.textContent = target + suffix;
                    return;
                }

                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + suffix;
                    }
                };
                updateCounter();
            });
        }
    };

    // === AOS (Animate On Scroll) ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (prefersReducedMotion) {
                    entry.target.classList.add('aos-animate');
                } else {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, delay);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

    // === Smooth scroll for links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // === Parallax orbs on mouse move ===
    if (!prefersReducedMotion) {
        const orbs = document.querySelectorAll('.hero-orb');
        
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 10;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }

    // === Active nav link highlighting ===
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.classList.add('nav-active');
                } else {
                    link.classList.remove('nav-active');
                }
            }
        });
    };

    // === Scroll to Top Button ===
    const scrollToTopBtn = document.getElementById('scrollToTop');

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === Unified scroll handler (single listener, all logic) ===
    let ticking = false;

    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Navbar bg
                navbar.classList.toggle('scrolled', window.scrollY > 50);
                // Counters
                animateCounters();
                // Nav highlight
                highlightNav();
                // Scroll-to-top button
                scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial calls
    onScroll();
});
