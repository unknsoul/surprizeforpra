/* ═══════════════════════════════════════════════════════════════════════════
   PREMIUM BIRTHDAY EXPERIENCE - INTERACTIONS
   Scroll animations · Floating particles · Heart effects · Sparkles
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────────────────────
    // CONFIGURATION
    // ─────────────────────────────────────────────────────────────────────────
    const CONFIG = {
        particles: {
            count: 40,           // Increased particle count
            maxSize: 5,
            minSize: 1,
            speed: 0.4,
            heartChance: 0.2     // 20% chance for a particle to be a heart
        },
        animation: {
            letterLineDelay: 120,  // Faster letter reveal
            heartCount: 18         // More hearts in closing
        },
        sparkles: {
            enabled: true,
            maxSparkles: 25,
            spawnInterval: 400    // ms between sparkle spawns
        },
        confetti: {
            count: 80,            // Number of confetti pieces
            /* Velvet Dusk Palette: Dusty Pink, Soft Gold, Pale Rose, Deep Mauve */
            colors: ['#D48C9D', '#E6C288', '#F2E6E8', '#C7B2B8', '#8F7E84'],
            heartChance: 0.3      // 30% chance for heart-shaped confetti
        },
        birthday: {
            month: 2,  // February (1-indexed)
            day: 19
        }
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─────────────────────────────────────────────────────────────────────────
    // COUNTDOWN TIMER SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    class CountdownTimer {
        constructor() {
            this.countdownScreen = document.getElementById('countdown-screen');
            this.mainContent = document.getElementById('main-content');
            this.daysEl = document.getElementById('days');
            this.hoursEl = document.getElementById('hours');
            this.minutesEl = document.getElementById('minutes');
            this.secondsEl = document.getElementById('seconds');
            this.starsContainer = document.getElementById('countdown-stars');
            this.heartsContainer = document.getElementById('countdown-hearts');

            if (!this.countdownScreen || !this.mainContent) return;

            this.targetDate = this.getTargetDate();
            this.init();
        }

        getTargetDate() {
            const now = new Date();
            let year = now.getFullYear();
            const targetMonth = CONFIG.birthday.month - 1; // 0-indexed for Date
            const targetDay = CONFIG.birthday.day;

            // Create target date for this year
            let target = new Date(year, targetMonth, targetDay, 0, 0, 0, 0);

            // If the date has passed this year, use next year
            if (now > target) {
                target = new Date(year + 1, targetMonth, targetDay, 0, 0, 0, 0);
            }

            return target;
        }

        init() {
            // Check if it's the birthday
            if (this.isBirthday()) {
                this.showMainContent();
                return;
            }

            // Show countdown
            this.createStars();
            this.createFloatingHearts();
            this.startCountdown();
        }

        isBirthday() {
            const now = new Date();
            const targetMonth = CONFIG.birthday.month - 1;
            const targetDay = CONFIG.birthday.day;

            return now.getMonth() === targetMonth && now.getDate() === targetDay;
        }

        createStars() {
            if (!this.starsContainer || prefersReducedMotion) return;

            for (let i = 0; i < 50; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.animationDelay = `${Math.random() * 3}s`;
                star.style.animationDuration = `${2 + Math.random() * 2}s`;
                this.starsContainer.appendChild(star);
            }
        }

        createFloatingHearts() {
            if (!this.heartsContainer || prefersReducedMotion) return;

            const hearts = ['♡', '❤', '💕', '♥', '💗'];

            // Create initial hearts
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    this.addFloatingHeart(hearts);
                }, i * 2000);
            }

            // Continuously add hearts
            setInterval(() => {
                this.addFloatingHeart(hearts);
            }, 3000);
        }

        addFloatingHeart(hearts) {
            const heart = document.createElement('span');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = `${5 + Math.random() * 90}%`;
            heart.style.animationDuration = `${12 + Math.random() * 8}s`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            heart.style.fontSize = `${0.8 + Math.random() * 0.8}rem`;

            this.heartsContainer.appendChild(heart);

            // Remove after animation
            setTimeout(() => {
                heart.remove();
            }, 20000);
        }

        startCountdown() {
            this.updateCountdown();
            this.countdownInterval = setInterval(() => {
                this.updateCountdown();
            }, 1000);
        }

        updateCountdown() {
            const now = new Date();
            const diff = this.targetDate - now;

            if (diff <= 0) {
                clearInterval(this.countdownInterval);
                this.showMainContent();
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // Update with animation
            this.updateDigit(this.daysEl, days);
            this.updateDigit(this.hoursEl, hours);
            this.updateDigit(this.minutesEl, minutes);
            this.updateDigit(this.secondsEl, seconds);
        }

        updateDigit(element, value) {
            if (!element) return;

            const newValue = value.toString().padStart(2, '0');
            if (element.textContent !== newValue) {
                element.style.transform = 'scale(1.1)';
                element.textContent = newValue;
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 150);
            }
        }

        showMainContent() {
            // Hide countdown screen with beautiful transition
            this.countdownScreen.classList.add('hidden');

            // Show main content after transition
            setTimeout(() => {
                this.mainContent.classList.remove('hidden');
                this.countdownScreen.style.display = 'none';
            }, 1500);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // INTERACTIVE BALL GRID BACKGROUND
    // ─────────────────────────────────────────────────────────────────────────
    class InteractiveBallGrid {
        constructor() {
            this.canvas = document.getElementById('ball-grid-canvas');
            if (!this.canvas || prefersReducedMotion) return;

            this.ctx = this.canvas.getContext('2d');
            this.balls = [];
            this.mouse = { x: -1000, y: -1000 };
            this.gridSpacing = 50;
            this.ballRadius = 3;
            this.interactionRadius = 120;
            this.isRunning = true;

            this.init();
        }

        init() {
            this.resize();
            this.createBalls();
            this.addEventListeners();
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createBalls();
        }

        createBalls() {
            this.balls = [];
            const cols = Math.ceil(this.canvas.width / this.gridSpacing) + 1;
            const rows = Math.ceil(this.canvas.height / this.gridSpacing) + 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * this.gridSpacing;
                    const y = j * this.gridSpacing;
                    this.balls.push({
                        originX: x,
                        originY: y,
                        x: x,
                        y: y,
                        vx: 0,
                        vy: 0,
                        color: this.getRandomColor()
                    });
                }
            }
        }

        getRandomColor() {
            const colors = [
                'rgba(147, 51, 234, 0.6)',   // Purple
                'rgba(236, 72, 153, 0.6)',   // Pink
                'rgba(59, 130, 246, 0.5)',   // Blue
                'rgba(168, 85, 247, 0.5)',   // Violet
                'rgba(212, 175, 55, 0.4)'    // Gold
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        addEventListeners() {
            window.addEventListener('resize', () => this.resize());

            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });

            this.canvas.addEventListener('mouseleave', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });

            this.canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                this.mouse.x = touch.clientX - rect.left;
                this.mouse.y = touch.clientY - rect.top;
            }, { passive: false });

            this.canvas.addEventListener('touchend', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });
        }

        animate() {
            if (!this.isRunning) return;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let ball of this.balls) {
                // Calculate distance from mouse
                const dx = this.mouse.x - ball.x;
                const dy = this.mouse.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.interactionRadius) {
                    // Push balls away from mouse
                    const force = (this.interactionRadius - distance) / this.interactionRadius;
                    const angle = Math.atan2(dy, dx);
                    const pushX = Math.cos(angle) * force * -30;
                    const pushY = Math.sin(angle) * force * -30;

                    ball.vx += pushX * 0.1;
                    ball.vy += pushY * 0.1;
                }

                // Spring back to origin
                const springForce = 0.08;
                const damping = 0.85;

                ball.vx += (ball.originX - ball.x) * springForce;
                ball.vy += (ball.originY - ball.y) * springForce;

                ball.vx *= damping;
                ball.vy *= damping;

                ball.x += ball.vx;
                ball.y += ball.vy;

                // Draw ball with glow
                const glowIntensity = Math.min(1, Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy) / 5);

                // Glow effect
                if (glowIntensity > 0.1) {
                    this.ctx.beginPath();
                    const gradient = this.ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, this.ballRadius * 4);
                    gradient.addColorStop(0, `rgba(236, 72, 153, ${glowIntensity * 0.5})`);
                    gradient.addColorStop(1, 'transparent');
                    this.ctx.fillStyle = gradient;
                    this.ctx.arc(ball.x, ball.y, this.ballRadius * 4, 0, Math.PI * 2);
                    this.ctx.fill();
                }

                // Main ball
                this.ctx.beginPath();
                this.ctx.arc(ball.x, ball.y, this.ballRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = ball.color;
                this.ctx.fill();

                // Draw connecting lines to nearby balls
                for (let other of this.balls) {
                    if (other === ball) continue;
                    const distX = other.x - ball.x;
                    const distY = other.y - ball.y;
                    const dist = Math.sqrt(distX * distX + distY * distY);

                    if (dist < this.gridSpacing * 1.5) {
                        const opacity = (1 - dist / (this.gridSpacing * 1.5)) * 0.15;
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(147, 51, 234, ${opacity})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.moveTo(ball.x, ball.y);
                        this.ctx.lineTo(other.x, other.y);
                        this.ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(() => this.animate());
        }

        stop() {
            this.isRunning = false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CONFETTI BURST ON PAGE LOAD
    // ─────────────────────────────────────────────────────────────────────────
    class ConfettiBurst {
        constructor() {
            this.container = document.getElementById('confetti-container');
            if (!this.container || prefersReducedMotion) return;

            // Trigger confetti after a short delay for dramatic effect
            setTimeout(() => this.burst(), 800);
        }

        burst() {
            const { count, colors, heartChance } = CONFIG.confetti;

            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    this.createConfettiPiece(colors, heartChance);
                }, i * 30); // Stagger the confetti
            }

            // Clean up container after animation
            setTimeout(() => {
                this.container.innerHTML = '';
            }, 6000);
        }

        createConfettiPiece(colors, heartChance) {
            const piece = document.createElement('div');
            const isHeart = Math.random() < heartChance;
            const color = colors[Math.floor(Math.random() * colors.length)];

            if (isHeart) {
                piece.className = 'confetti heart';
                piece.textContent = ['♡', '❤', '♥', '💕'][Math.floor(Math.random() * 4)];
                piece.style.color = color;
            } else {
                const shape = Math.random() > 0.5 ? 'circle' : 'square';
                piece.className = `confetti ${shape}`;
                piece.style.backgroundColor = color;
                piece.style.width = `${6 + Math.random() * 8}px`;
                piece.style.height = piece.style.width;
            }

            // Random starting position (spread across top)
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.top = '-20px';

            // Random animation timing
            const duration = 3 + Math.random() * 2;
            const delay = Math.random() * 0.5;
            piece.style.animationDuration = `${duration}s`;
            piece.style.animationDelay = `${delay}s`;

            // Random horizontal drift
            const drift = (Math.random() - 0.5) * 200;
            piece.style.setProperty('--drift', `${drift}px`);

            this.container.appendChild(piece);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FLOATING BACKGROUND IMAGES
    // ─────────────────────────────────────────────────────────────────────────
    class FloatingBackgroundImages {
        constructor() {
            this.images = document.querySelectorAll('.floating-bg-image');
            if (!this.images.length) return;

            this.init();
        }

        init() {
            // Add load event to show images with fade when they load
            this.images.forEach(img => {
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                    // Handle error - hide broken images
                    img.addEventListener('error', () => {
                        img.style.display = 'none';
                    });
                }
            });

            // Random repositioning on scroll for dynamic feel
            if (!prefersReducedMotion) {
                this.addScrollParallax();
            }
        }

        addScrollParallax() {
            let ticking = false;

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const scrollY = window.scrollY;
                        this.images.forEach((img, index) => {
                            const speed = 0.02 + (index * 0.01);
                            const yOffset = scrollY * speed;
                            img.style.transform = `translateY(${yOffset}px) rotate(${Math.sin(scrollY * 0.001 + index) * 2}deg)`;
                        });
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SPARKLE EFFECTS SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    class SparkleSystem {
        constructor() {
            this.container = document.getElementById('sparkles-container');
            if (!this.container || prefersReducedMotion) return;

            this.sparkleCount = 0;
            this.init();
        }

        init() {
            // Add styles for sparkle container
            this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 100;
                overflow: hidden;
            `;

            // Spawn sparkles periodically
            setInterval(() => this.spawnSparkle(), CONFIG.sparkles.spawnInterval);

            // Add mouse move sparkle trail
            this.addMouseSparkles();
        }

        spawnSparkle() {
            if (this.sparkleCount >= CONFIG.sparkles.maxSparkles) return;

            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';

            // Random position
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;

            sparkle.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(232,212,206,0.6) 50%, transparent 100%);
                border-radius: 50%;
                pointer-events: none;
                animation: sparkle 2s ease-out forwards;
            `;

            this.container.appendChild(sparkle);
            this.sparkleCount++;

            // Remove after animation
            setTimeout(() => {
                sparkle.remove();
                this.sparkleCount--;
            }, 2000);
        }

        addMouseSparkles() {
            let lastSparkle = 0;

            document.addEventListener('mousemove', (e) => {
                const now = Date.now();
                if (now - lastSparkle < 100) return; // Throttle
                lastSparkle = now;

                if (Math.random() > 0.3) return; // Only spawn 30% of moves

                const sparkle = document.createElement('div');
                sparkle.className = 'mouse-sparkle';

                sparkle.style.cssText = `
                    position: absolute;
                    left: ${e.clientX}px;
                    top: ${e.clientY}px;
                    width: 4px;
                    height: 4px;
                    background: rgba(232, 196, 196, 0.8);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: sparkle 1s ease-out forwards;
                    box-shadow: 0 0 6px rgba(232, 196, 196, 0.5);
                `;

                this.container.appendChild(sparkle);

                setTimeout(() => sparkle.remove(), 1000);
            }, { passive: true });
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FLOATING PARTICLES SYSTEM (Enhanced)
    // ─────────────────────────────────────────────────────────────────────────
    class ParticleSystem {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.animationId = null;
            this.isRunning = false;
            this.mouseX = 0;
            this.mouseY = 0;

            this.resize();
            this.init();

            window.addEventListener('resize', () => this.resize());

            // Track mouse for interactive particles
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            }, { passive: true });
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        init() {
            if (prefersReducedMotion) return;

            // Create particles
            for (let i = 0; i < CONFIG.particles.count; i++) {
                this.particles.push(this.createParticle());
            }

            this.start();
        }

        createParticle() {
            const isHeart = Math.random() < CONFIG.particles.heartChance;
            const isStar = !isHeart && Math.random() < 0.1; // 10% chance for stars
            return {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: CONFIG.particles.minSize + Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize),
                speedX: (Math.random() - 0.5) * CONFIG.particles.speed,
                speedY: -Math.random() * CONFIG.particles.speed - 0.1,
                opacity: 0.1 + Math.random() * 0.4,
                isHeart: isHeart,
                isStar: isStar,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.02,
                originX: 0,
                originY: 0
            };
        }

        drawParticle(p) {
            this.ctx.save();

            // Pulsing opacity
            const pulsingOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

            if (p.isHeart) {
                // Draw faint heart outline
                this.ctx.strokeStyle = `rgba(232, 196, 196, ${pulsingOpacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();

                const size = p.size * 3;
                const x = p.x;
                const y = p.y;

                // Heart shape path
                this.ctx.moveTo(x, y + size * 0.3);
                this.ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.3);
                this.ctx.bezierCurveTo(x - size, y + size * 0.6, x, y + size, x, y + size);
                this.ctx.bezierCurveTo(x, y + size, x + size, y + size * 0.6, x + size, y + size * 0.3);
                this.ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.3);

                this.ctx.stroke();
            } else if (p.isStar) {
                // Draw small star/cross shape
                this.ctx.strokeStyle = `rgba(212, 175, 55, ${pulsingOpacity * 0.7})`; // Gold color
                this.ctx.lineWidth = 1;
                const size = p.size * 2;

                this.ctx.beginPath();
                this.ctx.moveTo(p.x - size, p.y);
                this.ctx.lineTo(p.x + size, p.y);
                this.ctx.moveTo(p.x, p.y - size);
                this.ctx.lineTo(p.x, p.y + size);
                this.ctx.stroke();
            } else {
                // Draw light particle (circle) with glow
                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
                gradient.addColorStop(0, `rgba(232, 212, 206, ${pulsingOpacity})`);
                gradient.addColorStop(1, `rgba(232, 212, 206, 0)`);

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        update() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let p of this.particles) {
                // Update position
                p.x += p.speedX;
                p.y += p.speedY;
                p.pulse += p.pulseSpeed;

                // Gentle mouse repulsion effect
                const dx = p.x - this.mouseX;
                const dy = p.y - this.mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    p.x += (dx / distance) * force * 0.5;
                    p.y += (dy / distance) * force * 0.5;
                }

                // Wrap around edges
                if (p.y < -20) {
                    p.y = this.canvas.height + 20;
                    p.x = Math.random() * this.canvas.width;
                }
                if (p.x < -20) p.x = this.canvas.width + 20;
                if (p.x > this.canvas.width + 20) p.x = -20;

                this.drawParticle(p);
            }

            if (this.isRunning) {
                this.animationId = requestAnimationFrame(() => this.update());
            }
        }

        start() {
            if (this.isRunning) return;
            this.isRunning = true;
            this.update();
        }

        stop() {
            this.isRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS (Enhanced)
    // ─────────────────────────────────────────────────────────────────────────
    class ScrollAnimator {
        constructor() {
            this.observedElements = new Set();
            this.quoteHeartAdded = new Set();

            const options = {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.15
            };

            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                options
            );

            this.init();
        }

        init() {
            // Observe all animatable elements
            const elements = document.querySelectorAll('[data-animate]');
            elements.forEach(el => {
                this.observer.observe(el);
                this.observedElements.add(el);
            });
        }

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    // Staggered animation for gallery items
                    if (el.classList.contains('memory-card')) {
                        const delay = el.dataset.delay || 0;
                        setTimeout(() => {
                            el.classList.add('visible');
                            this.triggerSparklesNear(el);
                        }, delay);
                    } else {
                        el.classList.add('visible');
                    }

                    // Special handling for quotes - add heart pulse
                    if (el.classList.contains('editorial-quote') && !this.quoteHeartAdded.has(el)) {
                        this.addHeartPulse(el);
                        this.quoteHeartAdded.add(el);
                    }

                    // Special handling for letter section
                    if (el.classList.contains('letter-container')) {
                        this.animateLetterLines(el);
                    }

                    // Unobserve after animation (one-time trigger)
                    this.observer.unobserve(el);
                }
            });
        }

        triggerSparklesNear(el) {
            if (prefersReducedMotion) return;

            const rect = el.getBoundingClientRect();
            const container = document.getElementById('sparkles-container');
            if (!container) return;

            // Create burst of sparkles around the element
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.style.cssText = `
                        position: absolute;
                        left: ${rect.left + Math.random() * rect.width}px;
                        top: ${rect.top + Math.random() * rect.height}px;
                        width: 8px;
                        height: 8px;
                        background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(232,196,196,0.6) 50%, transparent 100%);
                        border-radius: 50%;
                        pointer-events: none;
                        animation: sparkle 1.5s ease-out forwards;
                    `;
                    container.appendChild(sparkle);
                    setTimeout(() => sparkle.remove(), 1500);
                }, i * 100);
            }
        }

        addHeartPulse(quoteEl) {
            if (prefersReducedMotion) return;

            const heart = document.createElement('span');
            heart.className = 'heart-pulse';
            heart.textContent = '♡';
            heart.style.cssText = `
                position: absolute;
                right: -24px;
                top: 50%;
                transform: translateY(-50%);
            `;

            const p = quoteEl.querySelector('p');
            if (p) {
                p.style.position = 'relative';
                p.appendChild(heart);
            }
        }

        animateLetterLines(container) {
            const lines = container.querySelectorAll('.letter-line');

            if (prefersReducedMotion) {
                lines.forEach(line => line.classList.add('visible'));
                return;
            }

            lines.forEach((line, index) => {
                setTimeout(() => {
                    line.classList.add('visible');
                }, index * CONFIG.animation.letterLineDelay);
            });
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CLOSING HEARTS ANIMATION (Enhanced)
    // ─────────────────────────────────────────────────────────────────────────
    class ClosingAnimation {
        constructor() {
            this.triggered = false;
            this.closingSection = document.getElementById('closing');
            this.heartsContainer = document.getElementById('closing-hearts');

            if (!this.closingSection || !this.heartsContainer) return;

            this.init();
        }

        init() {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.4
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.triggered) {
                        this.triggered = true;
                        this.playAnimation();
                        observer.unobserve(this.closingSection);
                    }
                });
            }, options);

            observer.observe(this.closingSection);
        }

        playAnimation() {
            if (prefersReducedMotion) {
                const content = this.closingSection.querySelector('.closing-content');
                if (content) content.classList.add('visible');
                return;
            }

            // Fade in closing content
            const content = this.closingSection.querySelector('.closing-content');
            if (content) {
                content.style.animation = `fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
            }

            // Create rising hearts
            setTimeout(() => {
                this.createRisingHearts();
            }, 600);

            // Add dim effect after hearts
            setTimeout(() => {
                this.closingSection.classList.add('dimmed');
            }, 3000);
        }

        createRisingHearts() {
            const heartSymbols = ['♡', '❤', '♥', '💕'];

            for (let i = 0; i < CONFIG.animation.heartCount; i++) {
                setTimeout(() => {
                    const heart = document.createElement('span');
                    heart.className = 'heart';
                    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

                    // Random horizontal position
                    heart.style.left = `${5 + Math.random() * 90}%`;
                    heart.style.bottom = '0';

                    // Random duration
                    const duration = 3 + Math.random() * 3;

                    heart.style.animationDuration = `${duration}s`;
                    heart.style.fontSize = `${0.7 + Math.random() * 0.8}rem`;

                    this.heartsContainer.appendChild(heart);
                }, i * 150);
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PARALLAX EFFECT FOR HERO (Enhanced)
    // ─────────────────────────────────────────────────────────────────────────
    class ParallaxEffect {
        constructor() {
            this.hero = document.getElementById('hero');
            this.heroContent = this.hero?.querySelector('.hero-content');

            if (!this.heroContent || prefersReducedMotion) return;

            this.init();
        }

        init() {
            let ticking = false;

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.update();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }

        update() {
            const scrollY = window.scrollY;
            const heroHeight = this.hero.offsetHeight;

            // Only apply effect while hero is visible
            if (scrollY < heroHeight) {
                const progress = scrollY / heroHeight;
                this.heroContent.style.transform = `translateY(${scrollY * 0.4}px)`;
                this.heroContent.style.opacity = 1 - (progress * 0.6);
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SMOOTH SCROLL REVEAL FOR IMAGES
    // ─────────────────────────────────────────────────────────────────────────
    class ImageReveal {
        constructor() {
            const memoryCards = document.querySelectorAll('.memory-card');
            memoryCards.forEach((card, index) => {
                card.dataset.delay = index * 150; // Stagger animation
            });
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3D TILT EFFECT FOR CARDS (Enhanced with Magnetic Hover)
    // ─────────────────────────────────────────────────────────────────────────
    class TiltEffect {
        constructor() {
            if (prefersReducedMotion) return;
            this.cards = document.querySelectorAll('.memory-card');
            this.quotes = document.querySelectorAll('.editorial-quote');
            this.init();
        }

        init() {
            // Apply to memory cards
            this.cards.forEach(card => {
                card.addEventListener('mousemove', (e) => this.handleMove(e, card));
                card.addEventListener('mouseleave', () => this.handleLeave(card));
                card.addEventListener('mouseenter', () => this.handleEnter(card));
            });

            // Apply subtle magnetic effect to quotes
            this.quotes.forEach(quote => {
                quote.addEventListener('mousemove', (e) => this.handleQuoteMove(e, quote));
                quote.addEventListener('mouseleave', () => this.handleQuoteLeave(quote));
            });
        }

        handleEnter(card) {
            card.style.transition = 'transform 0.15s ease-out';
        }

        handleMove(e, card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            // Magnetic pull towards cursor
            const pullX = ((x - centerX) / centerX) * 5;
            const pullY = ((y - centerY) / centerY) * 5;

            // Preserve base rotation
            let baseRotate = -1;
            if (card.classList.contains('offset-right')) baseRotate = 1.5;
            if (card.classList.contains('offset-left')) baseRotate = -2;

            card.style.transition = 'transform 0.15s ease-out';
            card.style.transform = `
                perspective(1200px) 
                rotate(${baseRotate}deg) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateX(${pullX}px) 
                translateY(${pullY}px) 
                scale(1.03)
            `;
        }

        handleLeave(card) {
            // Spring-like return
            let baseRotate = -1;
            if (card.classList.contains('offset-right')) baseRotate = 1.5;
            if (card.classList.contains('offset-left')) baseRotate = -2;

            card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.transform = `rotate(${baseRotate}deg)`;
        }

        handleQuoteMove(e, quote) {
            const rect = quote.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const moveX = ((x - centerX) / centerX) * 3;
            const moveY = ((y - centerY) / centerY) * 3;

            quote.style.transition = 'transform 0.2s ease-out';
            quote.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
        }

        handleQuoteLeave(quote) {
            quote.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            quote.style.transform = 'translateX(0) translateY(0)';
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // INITIALIZATION
    // ─────────────────────────────────────────────────────────────────────────
    function init() {
        // Initialize countdown timer first (handles date checking)
        const countdown = new CountdownTimer();

        // Initialize interactive ball grid for countdown screen
        new InteractiveBallGrid();

        // Initialize all systems
        new ConfettiBurst();        // Confetti burst on page load
        new FloatingBackgroundImages();
        new SparkleSystem();
        new ParticleSystem('particles-canvas');
        new ImageReveal();
        new ScrollAnimator();
        new ClosingAnimation();
        new ParallaxEffect();
        new TiltEffect();

        // Hide scroll indicator after first scroll
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            let hidden = false;
            window.addEventListener('scroll', () => {
                if (!hidden && window.scrollY > 100) {
                    hidden = true;
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.transition = 'opacity 0.5s ease';
                }
            }, { passive: true });
        }

        console.log('✨ Birthday experience initialized with enhanced effects');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
