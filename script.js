'
// Loading
window.addEventListener(''load'', function() {
    const loading = document.getElementById(''loading'');
    if (loading) {
        loading.style.opacity = ''0'';
        setTimeout(() => {
            loading.style.display = ''none'';
        }, 500);
    }
});

// Initialize Swiper
document.addEventListener(''DOMContentLoaded'', function() {
    const swiper = new Swiper(''.swiper'', {
        direction: ''horizontal'',
        loop: true,
        effect: ''fade'',
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        parallax: true,
        pagination: {
            el: ''.swiper-pagination'',
            clickable: true,
        },
        navigation: {
            nextEl: ''.swiper-button-next'',
            prevEl: ''.swiper-button-prev'',
        },
        on: {
            slideChange: function() {
                animateText(this);
            },
            init: function() {
                animateText(this);
            }
        }
    });
});

// Text Animation
function animateText(swiper) {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const headings = activeSlide.querySelectorAll(''h3'');
    const quote = activeSlide.querySelector(''.quote'');
    
    // Reset animations
    headings.forEach(h => {
        h.style.opacity = ''0'';
        h.style.transform = ''translateY(30px)'';
    });
    if (quote) {
        quote.style.opacity = ''0'';
        quote.style.transform = ''translateY(30px)'';
    }
    
    // Animate headings
    headings.forEach((h, index) => {
        setTimeout(() => {
            h.style.opacity = ''1'';
            h.style.transform = ''translateY(0)'';
        }, 100 * (index + 1));
    });
    
    // Animate quote
    if (quote) {
        setTimeout(() => {
            quote.style.opacity = ''1'';
            quote.style.transform = ''translateY(0)'';
        }, 600);
    }
}

// Header scroll effect
let lastScrollTop = 0;
window.addEventListener(''scroll'', function() {
    const header = document.getElementById(''header'');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = ''translateY(-100%)'';
    } else {
        header.style.transform = ''translateY(0)'';
    }
    
    lastScrollTop = scrollTop;
});

// Keyboard navigation
document.addEventListener(''keydown'', function(e) {
    const swiper = document.querySelector(''.swiper'').swiper;
    if (!swiper) return;
    
    if (e.key === ''ArrowLeft'' || e.key === ''ArrowUp'') {
        swiper.slidePrev();
    } else if (e.key === ''ArrowRight'' || e.key === ''ArrowDown'') {
        swiper.slideNext();
    }
});

// Touch/Swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener(''touchstart'', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener(''touchend'', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swiper = document.querySelector(''.swiper'').swiper;
    if (!swiper) return;
    
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
        swiper.slideNext();
    } else if (touchEndX > touchStartX + threshold) {
        swiper.slidePrev();
    }
}
