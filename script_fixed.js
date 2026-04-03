// Loading
const loading = document.getElementById('loading');

function hideLoading() {
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
}

// Hide loading when page loads
window.addEventListener('load', hideLoading);

// Also hide loading after a timeout (fallback)
setTimeout(hideLoading, 2000);

// Music Player
const audioElements = {
    bgMusic1: document.getElementById('bgMusic1'),
    bgMusic2: document.getElementById('bgMusic2'),
    bgMusic3: document.getElementById('bgMusic3')
};

const playBtns = document.querySelectorAll('.play-btn');
let currentAudio = null;
let currentSlideIndex = 0;

// Initialize audio players
Object.values(audioElements).forEach(audio => {
    audio.addEventListener('ended', () => {
        // When audio ends, move to next slide
        const swiper = document.querySelector('.swiper').swiper;
        if (swiper) {
            swiper.slideNext();
        }
    });
});

// Setup play buttons
playBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const audioId = btn.dataset.audio;
        const audio = audioElements[audioId];
        
        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            // Reset previous play button
            const prevBtn = document.querySelector(`.play-btn[data-audio="${Object.keys(audioElements).find(key => audioElements[key] === currentAudio)}"]`);
            if (prevBtn) prevBtn.classList.remove('playing');
        }
        
        if (audio.paused) {
            audio.play();
            btn.classList.add('playing');
            currentAudio = audio;
        } else {
            audio.pause();
            btn.classList.remove('playing');
        }
    });
});

// Update progress bars
Object.entries(audioElements).forEach(([id, audio]) => {
    const progressBar = document.querySelector(`.play-btn[data-audio="${id}"]`).closest('.player-container').querySelector('.progress-bar');
    const progressFill = progressBar.querySelector('.progress-fill');
    
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${progress}%`;
    });
    
    // Click on progress bar to seek
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });
});

// Auto-play first music when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        const firstAudio = audioElements.bgMusic1;
        if (firstAudio) {
            firstAudio.play().then(() => {
                const firstBtn = document.querySelector('.play-btn[data-audio="bgMusic1"]');
                if (firstBtn) firstBtn.classList.add('playing');
                currentAudio = firstAudio;
            }).catch(error => {
                console.log('Auto-play prevented:', error);
            });
        }
    }, 1000);
});

// Initialize Swiper
document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        effect: 'fade',
        speed: 1000,
        on: {
            slideChange: function() {
                animateText(this);
                updatePagination(this);
                handleSlideChange(this);
            },
            init: function() {
                animateText(this);
                updatePagination(this);
                setupNavigation(this);
            }
        }
    });
});

// Handle slide change - play corresponding music
function handleSlideChange(swiper) {
    // Stop current audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        const prevBtn = document.querySelector(`.play-btn[data-audio="${Object.keys(audioElements).find(key => audioElements[key] === currentAudio)}"]`);
        if (prevBtn) prevBtn.classList.remove('playing');
    }
    
    // Determine which audio to play based on slide index
    let audioId;
    if (swiper.activeIndex === 0) {
        audioId = 'bgMusic1';
    } else if (swiper.activeIndex === 1) {
        audioId = 'bgMusic2';
    } else if (swiper.activeIndex === 2) {
        audioId = 'bgMusic3';
    } else {
        // Handle loop case
        const realIndex = swiper.activeIndex % 3;
        audioId = `bgMusic${realIndex + 1}`;
    }
    
    // Play the new audio
    const newAudio = audioElements[audioId];
    if (newAudio) {
        newAudio.play().then(() => {
            const newBtn = document.querySelector(`.play-btn[data-audio="${audioId}"]`);
            if (newBtn) newBtn.classList.add('playing');
            currentAudio = newAudio;
            currentSlideIndex = swiper.activeIndex;
        }).catch(error => {
            console.log('Auto-play prevented:', error);
        });
    }
}

// Setup navigation buttons
function setupNavigation(swiper) {
    const prevBtns = document.querySelectorAll('.prev-btn');
    const nextBtns = document.querySelectorAll('.next-btn');
    
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            swiper.slidePrev();
        });
    });
    
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            swiper.slideNext();
        });
    });
}

// Update pagination dots
function updatePagination(swiper) {
    const paginationContainers = document.querySelectorAll('.pagination-dots');
    
    paginationContainers.forEach(container => {
        // Clear existing dots
        container.innerHTML = '';
        
        // Create dots for each slide
        swiper.slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === swiper.activeIndex ? 'active' : ''}`;
            
            dot.addEventListener('click', () => {
                swiper.slideTo(index);
            });
            
            container.appendChild(dot);
        });
    });
}

// Text Animation
function animateText(swiper) {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const textContainer = activeSlide.querySelector('.text-container');
    const headings = textContainer.querySelectorAll('h3');
    const quote = textContainer.querySelector('.quote');
    
    // Reset animations
    headings.forEach(h => {
        h.style.opacity = '0';
        h.style.transform = 'translateX(-30px)';
    });
    if (quote) {
        quote.style.opacity = '0';
        quote.style.transform = 'translateX(-30px)';
    }
    
    // Animate headings
    headings.forEach((h, index) => {
        setTimeout(() => {
            h.style.opacity = '1';
            h.style.transform = 'translateX(0)';
        }, 100 * (index + 1));
    });
    
    // Animate quote
    if (quote) {
        setTimeout(() => {
            quote.style.opacity = '1';
            quote.style.transform = 'translateX(0)';
        }, 600);
    }
}

// Header scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const swiper = document.querySelector('.swiper').swiper;
    if (!swiper) return;
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        swiper.slidePrev();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        swiper.slideNext();
    }
});

// Touch/Swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swiper = document.querySelector('.swiper').swiper;
    if (!swiper) return;
    
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
        swiper.slideNext();
    } else if (touchEndX > touchStartX + threshold) {
        swiper.slidePrev();
    }
}
