document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.parallax-section');
    let lockedSection = null;
    let virtualScroll = 0;
    let startScroll = 0;
    let endScroll = 0;
    let maxScroll = 0;
    let ticking = false;

    function getSectionScrollInfo(section) {
        const rect = section.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const sectionHeight = rect.height;
        const start = sectionTop;
        const end = sectionTop + sectionHeight - window.innerHeight;
        return { start, end, sectionHeight };
    }

    function lockScroll(y) {
        window.scrollTo(0, y);
    }

    function updateHorizontalScroll() {
        let foundLock = false;
        sections.forEach(section => {
            const imagesStrip = section.querySelector('.parallax-images');
            const { start, end, sectionHeight } = getSectionScrollInfo(section);
            if (window.scrollY >= start && window.scrollY <= end) {
                if (!lockedSection) {
                    lockedSection = section;
                    virtualScroll = 0;
                    startScroll = start;
                    endScroll = end;
                    maxScroll = imagesStrip.scrollWidth - imagesStrip.parentElement.clientWidth;
                    // Lock the scroll position
                    lockScroll(start);
                }
                foundLock = true;
                // Move images horizontally based on virtualScroll
                const clampedProgress = Math.max(0, Math.min(1, virtualScroll / (endScroll - startScroll)));
                if (imagesStrip) {
                    imagesStrip.style.transform = `translateX(${-maxScroll * clampedProgress}px)`;
                }
            } else if (imagesStrip) {
                // Set to start or end position
                if (window.scrollY < start) {
                    imagesStrip.style.transform = 'translateX(0)';
                } else if (window.scrollY > end) {
                    const maxScroll = imagesStrip.scrollWidth - imagesStrip.parentElement.clientWidth;
                    imagesStrip.style.transform = `translateX(${-maxScroll}px)`;
                }
            }
        });
        if (!foundLock) {
            lockedSection = null;
        }
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHorizontalScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Strict scroll lock and virtual scroll
    window.addEventListener('wheel', (e) => {
        if (lockedSection) {
            e.preventDefault();
            const delta = e.deltaY;
            virtualScroll += delta;
            virtualScroll = Math.max(0, Math.min(virtualScroll, endScroll - startScroll));
            // If at the end, release the lock and allow vertical scroll
            if (virtualScroll >= endScroll - startScroll && delta > 0) {
                lockedSection = null;
                window.scrollTo(0, endScroll + 1);
            } else if (virtualScroll <= 0 && delta < 0) {
                lockedSection = null;
                window.scrollTo(0, startScroll - 1);
            } else {
                lockScroll(startScroll);
                updateHorizontalScroll();
            }
        }
    }, { passive: false });

    // Initial call
    updateHorizontalScroll();
}); 