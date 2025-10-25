// security.js - Güvenlik Özellikleri
class MerttSecurity {
    constructor() {
        this.securityScore = 100;
        this.suspiciousActivities = [];
        this.init();
    }

    init() {
        this.setupCSRFProtection();
        this.setupXSSProtection();
        this.setupClickjackingProtection();
        this.setupSecurityHeaders();
        this.monitorSuspiciousActivity();
        this.setupFormSecurity();
        this.logSecurityEvent('Security system initialized');
    }

    // CSRF koruması
    setupCSRFProtection() {
        const token = this.generateCSRFToken();
        document.cookie = `XSRF-TOKEN=${token}; SameSite=Strict; Secure`;
        
        // Formlara token ekle
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                if (form.method.toLowerCase() === 'post') {
                    const tokenField = document.createElement('input');
                    tokenField.type = 'hidden';
                    tokenField.name = '_csrf';
                    tokenField.value = token;
                    form.appendChild(tokenField);
                }
            });
        });
    }

    generateCSRFToken() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `mrt_${random}_${timestamp}`;
    }

    // XSS koruması
    setupXSSProtection() {
        // Input sanitization için event listener
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.sanitizeInput(e.target);
            }
        });

        // Form submit'te sanitization
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                this.sanitizeInput(input);
            });
        });
    }

    sanitizeInput(input) {
        let value = input.value;
        
        // Basit XSS temizleme
        value = value.replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/'/g, '&#x27;')
                    .replace(/"/g, '&quot;')
                    .replace(/\//g, '&#x2F;');
        
        // JavaScript protocol'lerini temizle
        value = value.replace(/javascript:/gi, '')
                    .replace(/vbscript:/gi, '')
                    .replace(/onload/gi, 'data-onload')
                    .replace(/onerror/gi, 'data-onerror')
                    .replace(/onclick/gi, 'data-onclick');
        
        input.value = value;
    }

    // Clickjacking koruması
    setupClickjackingProtection() {
        if (window.self !== window.top) {
            // Iframe içindeysek
            window.top.location = window.self.location;
            this.logSecurityEvent('Clickjacking attempt blocked', 'high');
        }
        
        // X-Frame-Options benzeri koruma
        try {
            if (window.location !== window.parent.location) {
                window.parent.location = window.location;
            }
        } catch (e) {
            // Cross-origin durumunda
            document.body.innerHTML = '<h1>Güvenlik Uyarısı: Bu sayfa iframe içinde görüntülenemez.</h1>';
        }
    }

    // Security headers (simülasyon)
    setupSecurityHeaders() {
        // Meta tag ile CSP benzeri koruma
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = "Content-Security-Policy";
        cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: https:;";
        document.head.appendChild(cspMeta);
    }

    // Şüpheli aktivite izleme
    monitorSuspiciousActivity() {
        // Hızlı tıklama tespiti
        let clickCount = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', (e) => {
            const currentTime = Date.now();
            if (currentTime - lastClickTime < 100) {
                clickCount++;
                if (clickCount > 8) {
                    this.handleSuspiciousActivity('Rapid clicking detected', 'medium');
                }
            } else {
                clickCount = 0;
            }
            lastClickTime = currentTime;
        });

        // Form spam koruması
        let formSubmitCount = 0;
        let lastSubmitTime = 0;
        
        document.addEventListener('submit', (e) => {
            const currentTime = Date.now();
            
            if (currentTime - lastSubmitTime < 2000) {
                formSubmitCount++;
                if (formSubmitCount > 2) {
                    e.preventDefault();
                    this.handleSuspiciousActivity('Multiple form submissions detected', 'high');
                    this.showSecurityWarning('Lütfen formları çok hızlı göndermeyin.');
                }
            } else {
                formSubmitCount = 0;
            }
            
            lastSubmitTime = currentTime;
        });

        // Klavye dinleme (basit koruma)
        let keySequence = '';
        document.addEventListener('keydown', (e) => {
            // F12 ve Developer Tools tuşları
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                this.handleSuspiciousActivity('Developer tools access attempt', 'low');
            }
            
            // Uzun tuş dizileri (otomasyon tespiti)
            keySequence += e.key;
            if (keySequence.length > 20) {
                keySequence = keySequence.slice(-10);
            }
        });

        // Sayfa görünürlüğü değişikliği
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.logSecurityEvent('Page hidden/tab switched');
            }
        });
    }

    // Form güvenliği
    setupFormSecurity() {
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                // Input length sınırlamaları
                const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
                inputs.forEach(input => {
                    input.addEventListener('input', (e) => {
                        this.validateInputLength(e.target);
                    });
                });
                
                // Email validasyonu
                const emailInputs = form.querySelectorAll('input[type="email"]');
                emailInputs.forEach(input => {
                    input.addEventListener('blur', (e) => {
                        this.validateEmail(e.target);
                    });
                });
            });
        });
    }

    validateInputLength(input) {
        const maxLength = input.getAttribute('maxlength') || 1000;
        if (input.value.length > maxLength) {
            input.value = input.value.substring(0, maxLength);
            this.showSecurityWarning(`Maksimum ${maxLength} karakter girebilirsiniz.`);
        }
    }

    validateEmail(input) {
        const email = input.value;
        if (email && !this.isValidEmail(email)) {
            input.style.borderColor = '#f44336';
            this.showSecurityWarning('Lütfen geçerli bir email adresi girin.');
        } else {
            input.style.borderColor = '';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Güvenlik olaylarını işle
    handleSuspiciousActivity(message, severity = 'low') {
        this.securityScore -= this.getSeverityScore(severity);
        this.suspiciousActivities.push({
            message,
            severity,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        
        this.logSecurityEvent(message, severity);
        
        // Yüksek önem seviyesindeki olaylarda uyarı göster
        if (severity === 'high') {
            this.showSecurityWarning('Şüpheli aktivite tespit edildi. Lütfen normal kullanıma devam edin.');
        }
        
        // Skor çok düşerse
        if (this.securityScore < 50) {
            this.takeSecurityMeasures();
        }
    }

    getSeverityScore(severity) {
        const scores = {
            'low': 5,
            'medium': 15,
            'high': 30
        };
        return scores[severity] || 5;
    }

    takeSecurityMeasures() {
        // Güvenlik skoru çok düşükse ek önlemler
        console.warn('Security score critically low. Taking additional measures.');
        
        // Formları devre dışı bırak
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.style.opacity = '0.5';
            form.querySelectorAll('input, button').forEach(element => {
                element.disabled = true;
            });
        });
        
        this.showSecurityWarning('Güvenlik nedeniyle işlemler geçici olarak durduruldu. Lütfen sayfayı yenileyin.');
    }

    showSecurityWarning(message) {
        // Basit bir güvenlik uyarısı göster
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        warning.textContent = message;
        
        document.body.appendChild(warning);
        
        // 5 saniye sonra kaldır
        setTimeout(() => {
            if (warning.parentNode) {
                warning.remove();
            }
        }, 5000);
    }

    logSecurityEvent(message, severity = 'info') {
        const event = {
            message,
            severity,
            timestamp: new Date().toISOString(),
            page: window.location.href,
            userAgent: navigator.userAgent
        };
        
        console.log(`[SECURITY] ${severity.toUpperCase()}: ${message}`, event);
        
        // Gerçek uygulamada burada sunucuya log gönderilir
        this.sendToSecurityLog(event);
    }

    sendToSecurityLog(event) {
        // Gerçek uygulamada bu veriler güvenli bir şekilde sunucuya gönderilmeli
        // Şimdilik sadece console'a logluyoruz
        if (event.severity === 'high') {
            console.error('HIGH PRIORITY SECURITY EVENT:', event);
        }
    }

    // Password strength checker
    checkPasswordStrength(password) {
        let strength = 0;
        const requirements = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

        strength += Object.values(requirements).filter(Boolean).length;
        
        return {
            strength: strength,
            score: (strength / 5) * 100,
            requirements: requirements,
            level: strength >= 4 ? 'strong' : strength >= 3 ? 'medium' : 'weak'
        };
    }

    // Input validation
    validateInput(input, type = 'text') {
        const value = input.value.trim();
        
        switch(type) {
            case 'email':
                return this.isValidEmail(value);
            case 'phone':
                return /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''));
            case 'name':
                return /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,50}$/.test(value);
            case 'text':
                return value.length > 0 && value.length <= 1000;
            default:
                return value.length > 0;
        }
    }

    // Güvenlik raporu
    getSecurityReport() {
        return {
            score: this.securityScore,
            activities: this.suspiciousActivities,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
    }
}

// Sayfa yüklendiğinde güvenlik özelliklerini başlat
document.addEventListener('DOMContentLoaded', () => {
    window.merttSecurity = new MerttSecurity();
    
    // Global güvenlik fonksiyonları
    window.validatePassword = (password) => {
        return window.merttSecurity.checkPasswordStrength(password);
    };
    
    window.getSecurityReport = () => {
        return window.merttSecurity.getSecurityReport();
    };
});

// Hata yönetimi
window.addEventListener('error', (e) => {
    if (window.merttSecurity) {
        window.merttSecurity.logSecurityEvent(`JavaScript error: ${e.message}`, 'medium');
    }
});