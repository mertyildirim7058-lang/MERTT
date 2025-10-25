// threejs-background.js - Three.js Arka Plan Animasyonu
class ThreeBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        // Three.js kontrolü
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not available, using fallback animation');
            this.initFallbackAnimation();
            return;
        }

        try {
            this.setupScene();
            this.createParticles();
            this.animate();
            this.isInitialized = true;
        } catch (error) {
            console.error('Three.js initialization failed:', error);
            this.initFallbackAnimation();
        }
    }

    setupScene() {
        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        // Renderer
        const canvas = document.getElementById('backgroundCanvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);

        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createParticles() {
        const particlesCount = 1000;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);
        const sizes = new Float32Array(particlesCount);

        // Lüks renk paleti
        const goldColor = new THREE.Color(0xD4AF37);
        const silverColor = new THREE.Color(0xC0C0C0);
        const whiteColor = new THREE.Color(0xF8F4E9);

        for (let i = 0; i < particlesCount; i++) {
            // Pozisyon
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 10;

            // Renk - altın, gümüş ve beyaz tonları
            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.6) {
                color = goldColor;
            } else if (colorChoice < 0.8) {
                color = silverColor;
            } else {
                color = whiteColor;
            }

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Boyut
            sizes[i] = Math.random() * 0.1 + 0.05;
        }

        // Geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Material
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        // Points
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    animate() {
        if (!this.isInitialized) return;

        requestAnimationFrame(() => this.animate());

        // Particle animasyonları
        if (this.particles) {
            this.particles.rotation.x += 0.0002;
            this.particles.rotation.y += 0.0005;

            // Pulsating effect
            const time = Date.now() * 0.001;
            this.particles.material.opacity = 0.6 + Math.sin(time) * 0.2;

            // Hareket
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + positions[i] * 0.1) * 0.002;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.isInitialized) return;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    initFallbackAnimation() {
        // Three.js yoksa basit bir canvas animasyonu
        const canvas = document.getElementById('backgroundCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        class FallbackParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = this.getRandomGoldColor();
            }

            getRandomGoldColor() {
                const colors = [
                    'rgba(212, 175, 55, 0.8)',
                    'rgba(255, 215, 0, 0.6)',
                    'rgba(192, 192, 192, 0.5)',
                    'rgba(248, 244, 233, 0.4)'
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = 0.7;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Partikülleri oluştur
        for (let i = 0; i < particleCount; i++) {
            particles.push(new FallbackParticle());
        }

        // Animasyon loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Gradient arka plan
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
            );
            gradient.addColorStop(0, 'rgba(10, 25, 49, 0.3)');
            gradient.addColorStop(1, 'rgba(26, 26, 26, 0.9)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Partikülleri çiz ve güncelle
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Temizlik
    destroy() {
        if (this.isInitialized) {
            this.scene.dispose();
            this.renderer.dispose();
            this.isInitialized = false;
        }
    }
}

// Splash screen için Three.js başlatma
if (document.getElementById('backgroundCanvas')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.threeBackground = new ThreeBackground();
    });
}

// Ana sayfa için farklı bir animasyon
class MainBackground {
    constructor() {
        this.init();
    }

    init() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        // Hero section'a gradient animasyonu ekle
        const backgroundElement = document.querySelector('.hero-background');
        if (backgroundElement) {
            this.animateGradient(backgroundElement);
        }
    }

    animateGradient(element) {
        let angle = 0;
        
        function updateGradient() {
            angle = (angle + 0.2) % 360;
            const gradient = `linear-gradient(${angle}deg, 
                rgba(10, 25, 49, 0.9) 0%,
                rgba(26, 26, 26, 0.8) 50%,
                rgba(10, 25, 49, 0.9) 100%)`;
            
            element.style.background = gradient;
            requestAnimationFrame(updateGradient);
        }
        
        updateGradient();
    }
}

// Ana sayfa yüklendiğinde
if (document.querySelector('.hero')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.mainBackground = new MainBackground();
    });
}