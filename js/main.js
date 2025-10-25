// main.js - Ana JavaScript Dosyası
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mertt Luxury Website loaded successfully');
    
    // Hamburger menü işlevselliği
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Hamburger ikon değişimi
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Form gönderim işlevselliği
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Form verilerini al
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Form validasyonu
            if (validateForm(data)) {
                // Başarı mesajı göster
                showNotification('Mesajınız başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.', 'success');
                contactForm.reset();
            } else {
                showNotification('Lütfen tüm alanları doğru şekilde doldurun.', 'error');
            }
        });
    }
    
    // Scroll ile header rengi değişimi
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
        }
    });

    // Smooth scroll için
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Mobilde menüyü kapat
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Sayfa yüklendiğinde animasyonlar
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);

    // Resim yüklenme animasyonları
    document.querySelectorAll('.image-placeholder').forEach(img => {
        img.style.opacity = '0';
        setTimeout(() => {
            img.style.transition = 'opacity 0.6s ease';
            img.style.opacity = '1';
        }, 300);
    });
});

// Form validasyonu
function validateForm(data) {
    const { name, email, subject, message } = data;
    
    // İsim kontrolü
    if (!name || name.length < 2) {
        return false;
    }
    
    // Email kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return false;
    }
    
    // Konu kontrolü
    if (!subject || subject.length < 3) {
        return false;
    }
    
    // Mesaj kontrolü
    if (!message || message.length < 10) {
        return false;
    }
    
    return true;
}

// Bildirim sistemi
function showNotification(message, type = 'info') {
    // Mevcut bildirimleri temizle
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Yeni bildirim oluştur
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Stil ekle
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animasyon
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Otomatik kapanma
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #4CAF50, #45a049)',
        error: 'linear-gradient(135deg, #f44336, #d32f2f)',
        info: 'linear-gradient(135deg, #2196F3, #1976D2)',
        warning: 'linear-gradient(135deg, #ff9800, #f57c00)'
    };
    return colors[type] || colors.info;
}

// Sayfa görünürlüğü değişikliği
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Sayfa tekrar görünür olduğunda
        console.log('Mertt website is now visible');
    }
});

// Hata yönetimi
window.addEventListener('error', function(e) {
    console.error('Website error:', e.error);
});