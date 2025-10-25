// animations.js - Animasyon Sistemi
class MerttAnimations {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadingAnimations();
        this.setupCounterAnimations();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                }
            });
        }, this.observerOptions);

        // Animasyonlu elementleri seç
        const animatedElements = document.querySelectorAll(
            '.product-card, .about-content, .contact-content, .section-title, .security-badges'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }

    animateOnScroll(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Ürün kartları için sıralı animasyon
        if (element.classList.contains('product-card')) {
            const cards = Array.from(element.parentNode.children);
            const index = cards.indexOf(element);
            element.style.transitionDelay = `${index * 0.1}s`;
        }
        
        // Güvenlik rozetleri için
        if (element.classList.contains('security-badges')) {
            const badges = element.querySelectorAll('.badge');
            badges.forEach((badge, index) => {
                badge.style.animationDelay = `${index * 0.2}s`;
                badge.classList.add('fade-in-up');
            });
        }
    }

    setupHoverAnimations() {
        // Buton hover efektleri
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', this.handleButtonHover);
            btn.addEventListener('mouseleave', this.handleButtonLeave);
        });

        // Ürün kartı hover efektleri
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleProductCardHover);
            card.addEventListener('mouseleave', this.handleProductCardLeave);
        });

        // Sosyal medya linkleri
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', this.handleSocialLinkHover);
            link.addEventListener('mouseleave', this.handleSocialLinkLeave);
        });
    }

    handleButtonHover(e) {
        const btn = e.target;
        btn.style.transform = 'translateY(-3px) scale(1.05)';
    }

    handleButtonLeave(e) {
        const btn = e.target;
        btn.style.transform = 'translateY(0) scale(1)';
    }

    handleProductCardHover(e) {
        const card = e.currentTarget;
        const price = card.querySelector('.product-price');
        
        if (price) {
            price.style.transform = 'scale(1.1)';
            price.style.color = '#FFD700';
        }
    }

    handleProductCardLeave(e) {
        const card = e.currentTarget;
        const price = card.querySelector('.product-price');
        
        if (price) {
            price.style.transform = 'scale(1)';
            price.style.color = '#D4AF37';
        }
    }

    handleSocialLinkHover(e) {
        const link = e.target.closest('.social-link');
        if (link) {
            link.style.transform = 'translateY(-5px) rotate(5deg)';
        }
    }

    handleSocialLinkLeave(e) {
        const link = e.target.closest('.social-link');
        if (link) {
            link.style.transform = 'translateY(0) rotate(0)';
        }
    }

    setupLoadingAnimations() {
        // Sayfa yüklendiğinde çalışacak animasyonlar
        window.addEventListener('load', () => {
            this.animateHeroContent();
            this.animateLogo();
        });
    }

    animateHeroContent() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const children = heroContent.children;
            Array.from(children).forEach((child, index) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(20px)';
                child.style.transition = `all 0.6s ease-out ${0.3 + index * 0.2}s`;
                
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, 100);
            });
        }
    }

    animateLogo() {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.style.opacity = '0';
            logo.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                logo.style.transition = 'all 0.5s ease-out';
                logo.style.opacity = '1';
                logo.style.transform = 'scale(1)';
            }, 500);
        }
    }

    setupCounterAnimations() {
        // İstatistik sayıcıları (gelecekte kullanılabilir)
        const counters = document.querySelectorAll('.counter');
        if (counters.length > 0) {
            counters.forEach(counter => {
                this.animateCounter(counter, parseInt(counter.getAttribute('data-target')), 2000);
            });
        }
    }

    animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Utility metodları
    shakeElement(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    pulseElement(element) {
        element.style.animation = 'pulse 1s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 1000);
    }
}

// CSS Animasyonları için stil ekleme
function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
                transform: translate3d(0,0,0);
            }
            40%, 43% {
                transform: translate3d(0,-15px,0);
            }
            70% {
                transform: translate3d(0,-7px,0);
            }
            90% {
                transform: translate3d(0,-3px,0);
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .notification {
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(style);
}

// Sayfa yüklendiğinde animasyonları başlat
document.addEventListener('DOMContentLoaded', () => {
    injectAnimationStyles();
    window.merttAnimations = new MerttAnimations();
});