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
});