document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.parallax-section');
    let lockedSection = null;
    let virtualScroll = 0;
    let startScroll = 0;
    let endScroll = 0;
    let maxScroll = 0;
    let ticking = false;
    let resizeTimeout;

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
            if (!imagesStrip) return;

            const { start, end, sectionHeight } = getSectionScrollInfo(section);
            const containerWidth = imagesStrip.parentElement.clientWidth;
            const stripWidth = imagesStrip.scrollWidth;
            const maxHorizontalScroll = Math.max(0, stripWidth - containerWidth);

            if (window.scrollY >= start && window.scrollY <= end) {
                if (!lockedSection) {
                    lockedSection = section;
                    virtualScroll = 0;
                    startScroll = start;
                    endScroll = end;
                    maxScroll = maxHorizontalScroll;
                    lockScroll(start);
                }
                foundLock = true;

                // Calculate progress based on virtual scroll
                const scrollRange = endScroll - startScroll;
                const clampedProgress = Math.max(0, Math.min(1, virtualScroll / scrollRange));
                const translateX = -maxHorizontalScroll * clampedProgress;
                
                // Apply transform with hardware acceleration
                imagesStrip.style.transform = `translate3d(${translateX}px, 0, 0)`;
            } else {
                // Reset position when outside the section
                if (window.scrollY < start) {
                    imagesStrip.style.transform = 'translate3d(0, 0, 0)';
                } else if (window.scrollY > end) {
                    imagesStrip.style.transform = `translate3d(${-maxHorizontalScroll}px, 0, 0)`;
                }
            }
        });

        if (!foundLock) {
            lockedSection = null;
        }
    }

    // Debounced resize handler
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset locked section and recalculate dimensions
            lockedSection = null;
            virtualScroll = 0;
            updateHorizontalScroll();
        }, 100);
    }

    // Scroll handler with requestAnimationFrame
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHorizontalScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Wheel event handler for virtual scrolling
    function handleWheel(e) {
        if (lockedSection) {
            e.preventDefault();
            const delta = e.deltaY;
            virtualScroll += delta;
            virtualScroll = Math.max(0, Math.min(virtualScroll, endScroll - startScroll));

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
    }

    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial setup
    updateHorizontalScroll();
}); 