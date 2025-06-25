document.addEventListener('DOMContentLoaded', function() {
    const bttBtn = document.querySelector('.btt-btn');
    const scrollElements = document.querySelectorAll('[data-scroll-to-id]');
    
    
    window.addEventListener('scroll', toggleBttButton);
    
    bttBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollElements.forEach(element => {
        element.addEventListener('click', function() {
            const targetId = this.getAttribute('data-scroll-to-id');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    function toggleBttButton() {
        bttBtn.style.display = (window.scrollY > 100) ? 'block' : 'none';
    }
    
    toggleBttButton();
});