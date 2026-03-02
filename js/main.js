/* ═══════════════════════════════════════════════════════════════
   SAHARA ÉTOILE — Main JavaScript
   Loading, Navigation, Scroll Reveal, Menu Filter, Form Validation
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ──────────────────── LOADING SCREEN ──────────────────── */
    const loadingScreen = document.getElementById('loading-screen');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = '';
        }, 2200);
    });

    // Prevent scrolling during load
    document.body.style.overflow = 'hidden';

    /* ──────────────────── STICKY NAVBAR ──────────────────── */
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ──────────────────── ACTIVE NAV LINK HIGHLIGHTING ──────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveLink = () => {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* ──────────────────── MOBILE NAVIGATION ──────────────────── */
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.getElementById('nav-links');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    // Close mobile nav when a link is clicked
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });

    /* ──────────────────── SMOOTH SCROLL ──────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetEl.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ──────────────────── SCROLL REVEAL ANIMATIONS ──────────────────── */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ──────────────────── MENU FILTERING ──────────────────── */
    const menuFilters = document.querySelectorAll('.menu-filter');
    const menuCards = document.querySelectorAll('.menu-card');

    menuFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active state
            menuFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            const category = filter.dataset.filter;

            menuCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.classList.remove('hidden');
                    // Re-trigger animation
                    card.style.animation = 'none';
                    card.offsetHeight; // force reflow
                    card.style.animation = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* ──────────────────── RESERVATION FORM VALIDATION ──────────────────── */
    const form = document.getElementById('reservation-form');
    const submitBtn = document.getElementById('reservation-submit');
    const successModal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close');

    /**
     * Validates a single form field and shows/hides error messages.
     * @param {string} fieldId - The id of the input element
     * @param {string} errorId - The id of the error span
     * @param {Function} validationFn - Returns error message or empty string
     * @returns {boolean} Whether the field is valid
     */
    const validateField = (fieldId, errorId, validationFn) => {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        const parent = field.closest('.form-group');
        const message = validationFn(field.value.trim());

        if (message) {
            error.textContent = message;
            parent.classList.add('error');
            return false;
        } else {
            error.textContent = '';
            parent.classList.remove('error');
            return true;
        }
    };

    // Validation rules
    const validations = [
        {
            field: 'res-name',
            error: 'error-name',
            validate: (val) => !val ? 'Please enter your name' : val.length < 2 ? 'Name is too short' : ''
        },
        {
            field: 'res-email',
            error: 'error-email',
            validate: (val) => {
                if (!val) return 'Please enter your email';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !emailRegex.test(val) ? 'Please enter a valid email' : '';
            }
        },
        {
            field: 'res-phone',
            error: 'error-phone',
            validate: (val) => {
                if (!val) return 'Please enter your phone number';
                const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
                return !phoneRegex.test(val) ? 'Please enter a valid phone number' : '';
            }
        },
        {
            field: 'res-guests',
            error: 'error-guests',
            validate: (val) => !val ? 'Please select number of guests' : ''
        },
        {
            field: 'res-date',
            error: 'error-date',
            validate: (val) => {
                if (!val) return 'Please select a date';
                const selected = new Date(val);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selected < today ? 'Please select a future date' : '';
            }
        },
        {
            field: 'res-time',
            error: 'error-time',
            validate: (val) => !val ? 'Please select a time' : ''
        }
    ];

    // Real-time validation on blur
    validations.forEach(({ field, error, validate }) => {
        const el = document.getElementById(field);
        el.addEventListener('blur', () => {
            validateField(field, error, validate);
        });
        // Clear error on input
        el.addEventListener('input', () => {
            const errorEl = document.getElementById(error);
            const parent = el.closest('.form-group');
            errorEl.textContent = '';
            parent.classList.remove('error');
        });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        validations.forEach(({ field, error, validate }) => {
            const fieldValid = validateField(field, error, validate);
            if (!fieldValid) isValid = false;
        });

        if (!isValid) return;

        // Show loading state
        submitBtn.classList.add('loading');

        // Simulate API call
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            form.reset();
            showModal();
        }, 1500);
    });

    // Modal controls
    const showModal = () => {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) closeModal();
    });

    /* ──────────────────── PARALLAX EFFECT ──────────────────── */
    const parallaxImg = document.querySelector('.parallax-img');

    if (parallaxImg) {
        window.addEventListener('scroll', () => {
            const divider = parallaxImg.closest('.parallax-divider');
            const rect = divider.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
                const translateY = (scrollPercent - 0.5) * -60;
                parallaxImg.style.transform = `translateY(${translateY}px)`;
            }
        }, { passive: true });
    }

    /* ──────────────────── SET MINIMUM DATE FOR RESERVATION ──────────────────── */
    const dateInput = document.getElementById('res-date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
    }

    /* ──────────────────── GALLERY HOVER EFFECT (TOUCH SUPPORT) ──────────────────── */
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('touchstart', () => {
            // Remove active from all others
            galleryItems.forEach(i => i.classList.remove('touch-active'));
            item.classList.add('touch-active');
        }, { passive: true });
    });

    /* ──────────────────── NAVBAR LINK SMOOTH CLOSE ON SCROLL ──────────────────── */
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;

        // Close mobile nav on scroll
        if (Math.abs(scrollTop - lastScrollTop) > 50) {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
        }

        lastScrollTop = scrollTop;
    }, { passive: true });

});
