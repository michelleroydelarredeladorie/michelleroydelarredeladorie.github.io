document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect for carousel images
    const carousel = document.querySelector('.experience-carousel');
    const images = document.querySelectorAll('.carousel-image');
    const timeline = document.querySelector('.timeline');
    const timelineMarkers = document.querySelectorAll('.timeline-marker');
    
    function updateParallax() {
        const scrollLeft = carousel.scrollLeft;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        const percent = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        images.forEach((img, i) => {
            // Parallax: move images slightly based on scroll
            img.style.transform = `translateX(${percent * 40 - i * 8}px)`;
        });
        // Move timeline markers in sync with carousel scroll
        timelineMarkers.forEach((marker, i) => {
            marker.style.transform = `translateX(-50%) translateX(${percent * 10 - i * 2}px)`;
        });
    }

    if (carousel) {
        carousel.addEventListener('scroll', updateParallax);
        // Initial update
        updateParallax();
    }

    // Optional: allow mouse wheel to scroll horizontally
    carousel.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            carousel.scrollLeft += e.deltaY;
        }
    }, { passive: false });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 