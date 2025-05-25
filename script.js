document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect for images
    const parallaxImages = document.querySelectorAll('.parallax-image');
    const experienceCards = document.querySelectorAll('.experience-card');

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    experienceCards.forEach(card => {
        observer.observe(card);
    });

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxImages.forEach(image => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            image.style.transform = `translateX(${yPos}px)`;
        });
    });

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