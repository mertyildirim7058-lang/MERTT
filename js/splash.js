// splash.js - Splash Screen JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mertt Splash Screen loaded');
    
    // Three.js arka planı başlat
    initThreeBackground();
    
    // Loading animasyonu
    const progressBar = document.querySelector('.loading-progress');
    const percentageText = document.querySelector('.loading-percentage');
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        // Rastgele artış ile daha gerçekçi loading
        const increment = 1 + Math.random() * 4;
        progress += increment;
        
        if (progress > 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Tamamlandığında ana sayfaya yönlendir
            setTimeout(() => {
                redirectToMain();
            }, 800);
        }
        
        // Progress bar ve yüzdeyi güncelle
        progressBar.style.width = progress + '%';
        percentageText.textContent = Math.floor(progress) + '%';
        
    }, 100);
    
    // Nokta animasyonları
    animateLoadingDots();
});

function initThreeBackground() {
    const canvas = document.getElementById('backgroundCanvas');
    if (!canvas) return;
    
    try {
        // Basit bir canvas animasyonu (Three.js olmadan)
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 80;
        
        // Particle sınıfı
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = `rgba(212, 175, 55, ${Math.random() * 0.3 + 0.1})`;
                this.alpha = Math.random() * 0.5 + 0.2;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                
                this.alpha = 0.2 + Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.3;
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Partikülleri oluştur
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Animasyon loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Gradient arka plan
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
            );
            gradient.addColorStop(0, 'rgba(10, 25, 49, 0.1)');
            gradient.addColorStop(1, 'rgba(26, 26, 26, 0.8)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Partikülleri çiz ve güncelle
            particles.forEach(particle => {
                particle.update();
                particle.draw();
                
                // Partiküller arası çizgiler
                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Window resize event
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
    } catch (error) {
        console.warn('Canvas animation failed:', error);
        // Canvas desteklenmiyorsa basit bir fallback
        canvas.style.background = 'linear-gradient(135deg, #0A1931 0%, #1A1A1A 100%)';
    }
}

function animateLoadingDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.style.animationDelay = `${index * 0.3}s`;
    });
}

function redirectToMain() {
    // Yönlendirmeden önce son animasyonlar
    const splashContent = document.querySelector('.splash-content');
    if (splashContent) {
        splashContent.style.opacity = '0';
        splashContent.style.transform = 'scale(0.9)';
        splashContent.style.transition = 'all 0.5s ease';
    }
    
    // 500ms sonra yönlendir
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 500);
}

// Hata yönetimi
window.addEventListener('error', function(e) {
    console.error('Splash screen error:', e.error);
    // Hata durumunda direkt yönlendir
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 2000);
});

// Sayfa kapatılırken
window.addEventListener('beforeunload', function() {
    // Temizlik yap
    const canvas = document.getElementById('backgroundCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});
