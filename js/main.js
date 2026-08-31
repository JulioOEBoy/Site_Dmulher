(function () {
    'use strict';

    // ---------- Menu Mobile ----------
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        const overlay = document.getElementById('mobile-overlay');

        function openMenu() {
            mainNav.classList.add('open');
            menuToggle.classList.add('open');
            if (overlay) overlay.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.setAttribute('aria-label', 'Fechar menu');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            mainNav.classList.remove('open');
            menuToggle.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menu');
            document.body.style.overflow = '';
        }

        menuToggle.addEventListener('click', function () {
            if (mainNav.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Fechar ao clicar no overlay
        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        // Fechar ao clicar em link
        mainNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu();
            });
        });

        // Fechar com ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // ---------- Depoimentos Slider ----------
    const slider = document.getElementById('depoimentos-slider');
    const dotsContainer = document.getElementById('depoimentos-dots');
    const prevBtn = document.querySelector('.depoimento-prev');
    const nextBtn = document.querySelector('.depoimento-next');

    if (slider && dotsContainer) {
        const slides = Array.from(slider.querySelectorAll('.depoimento'));
        let currentIndex = 0;

        // Criar dots
        slides.forEach(function (_, i) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('aria-label', 'Ver depoimento ' + (i + 1));
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', function () {
                goTo(i);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.querySelectorAll('button'));

        function goTo(index) {
            if (slides.length === 0) return;
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');
            currentIndex = index;
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                goTo(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                goTo(currentIndex + 1);
            });
        }

        // Auto-play
        let autoPlay = setInterval(function () {
            goTo(currentIndex + 1);
        }, 8000);

        slider.addEventListener('mouseenter', function () {
            clearInterval(autoPlay);
        });

        slider.addEventListener('mouseleave', function () {
            autoPlay = setInterval(function () {
                goTo(currentIndex + 1);
            }, 8000);
        });
    }

    // ---------- Header Scroll Effect ----------
    const header = document.querySelector('.site-header');
    if (header) {
        const mobileHeaderQuery = window.matchMedia('(max-width: 768px)');

        function updateHeaderState() {
            if (mobileHeaderQuery.matches && window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        }

        updateHeaderState();
        window.addEventListener('scroll', updateHeaderState);
        mobileHeaderQuery.addEventListener('change', updateHeaderState);
    }

    // ---------- Doctoralia Floating Button ----------
    const doctoraliaFloatingBtn = document.getElementById('zl-url');
    if (doctoraliaFloatingBtn) {
        const footer = document.getElementById('rodape');
        const FOOTER_BUFFER = 12;

        function updateDoctoraliaFloatingState() {
            const revealThreshold = Math.max(220, window.innerHeight * 0.35);
            if (window.scrollY > revealThreshold) {
                doctoraliaFloatingBtn.classList.add('is-visible');
            } else {
                doctoraliaFloatingBtn.classList.remove('is-visible');
            }
            clampDoctoraliaPosition();
        }

        function clampDoctoraliaPosition() {
            if (!footer || !doctoraliaFloatingBtn.classList.contains('is-visible')) {
                doctoraliaFloatingBtn.style.position = '';
                doctoraliaFloatingBtn.style.top = '';
                doctoraliaFloatingBtn.style.bottom = '';
                return;
            }
            const btnHeight = doctoraliaFloatingBtn.offsetHeight;
            const margin = 15;
            const footerTop = footer.getBoundingClientRect().top + window.scrollY;
            const limit = footerTop - btnHeight; // topo (no documento) onde o botão trava
            const currentTop = window.scrollY + window.innerHeight - btnHeight - margin; // onde ele estaria se fixo

            if (currentTop >= limit) {
                // Chegou no footer: trava (absolute) no topo do footer
                doctoraliaFloatingBtn.style.position = 'absolute';
                doctoraliaFloatingBtn.style.top = limit + 'px';
                doctoraliaFloatingBtn.style.bottom = 'auto';
            } else {
                // Ainda rolando a página: acompanha a viewport (fixed)
                doctoraliaFloatingBtn.style.position = 'fixed';
                doctoraliaFloatingBtn.style.top = 'auto';
                doctoraliaFloatingBtn.style.bottom = margin + 'px';
            }
        }

        updateDoctoraliaFloatingState();
        window.addEventListener('scroll', updateDoctoraliaFloatingState);
        window.addEventListener('resize', updateDoctoraliaFloatingState);
        window.addEventListener('load', function () {
            updateDoctoraliaFloatingState();
            clampDoctoraliaPosition();
        });
    }

    // ---------- Smooth Scroll (fallback para browsers antigos) ----------
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

})();