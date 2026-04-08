document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');

    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navbar.classList.toggle('active');
        });
    }

    // --- Progressive Carousel ---
    const images = document.querySelectorAll('.carousel-image');
    const buttons = document.querySelectorAll('.carousel-btn');
    const bars = document.querySelectorAll('.carousel-progress-bar');
    if (!images.length) return;

    const DURATION = 5000;
    const FAST_DURATION = 400;
    let current = 0;
    let startTime = performance.now();
    let isFastForward = false;
    let fastTarget = null;
    let fastStartProgress = 0;
    let frame;

    function setActive(index) {
        images.forEach(img => img.classList.remove('active'));
        buttons.forEach(btn => btn.classList.remove('active'));
        bars.forEach(bar => bar.style.width = '0%');
        images[index].classList.add('active');
        buttons[index].classList.add('active');
        current = index;
    }

    function animate(now) {
        const elapsed = now - startTime;

        if (isFastForward) {
            const fraction = Math.min(elapsed / FAST_DURATION, 1);
            const progress = fastStartProgress + (100 - fastStartProgress) * fraction;
            bars[current].style.width = progress + '%';

            if (fraction >= 1) {
                isFastForward = false;
                bars[current].style.width = '0%';
                setActive(fastTarget);
                fastTarget = null;
                startTime = performance.now();
            }
        } else {
            const fraction = Math.min(elapsed / DURATION, 1);
            bars[current].style.width = (fraction * 100) + '%';

            if (fraction >= 1) {
                bars[current].style.width = '0%';
                const next = (current + 1) % images.length;
                setActive(next);
                startTime = performance.now();
            }
        }

        frame = requestAnimationFrame(animate);
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            if (index === current) return;

            const elapsed = performance.now() - startTime;
            fastStartProgress = Math.min((elapsed / DURATION) * 100, 100);
            fastTarget = index;
            isFastForward = true;
            startTime = performance.now();
        });
    });

    frame = requestAnimationFrame(animate);

    // --- Scramble Button ---
    const scrambleBtn = document.querySelector('.scramble-btn');
    if (scrambleBtn) {
        const originalText = scrambleBtn.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let isScrambling = false;

        scrambleBtn.addEventListener('mouseenter', () => {
            if (isScrambling) return;
            isScrambling = true;
            let iteration = 0;
            const maxIterations = originalText.length;

            const interval = setInterval(() => {
                scrambleBtn.textContent = originalText
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) return originalText[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iteration >= maxIterations) {
                    clearInterval(interval);
                    isScrambling = false;
                }
                iteration += 1 / 3;
            }, 30);
        });
    }

    // --- Contact Form → WhatsApp ---
    const contactForm = document.getElementById('contacto-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const servicio = document.getElementById('servicio').value;
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const empresa = document.getElementById('empresa').value;
            const mensaje = document.getElementById('mensaje').value;

            const text = `¡Hola Nook Agency! 👋\n\n` +
                `*Servicio de interés:* ${servicio}\n` +
                `*Nombre:* ${nombre}\n` +
                `*Email:* ${email}\n` +
                `*Marca / Empresa:* ${empresa}\n` +
                `*Mensaje:* ${mensaje}`;

            const url = `https://wa.me/529982327232?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        });
    }
});