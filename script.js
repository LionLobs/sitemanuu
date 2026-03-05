/**
 * AGÊNCIA MANU DIGITAL — JavaScript Standalone
 * Funcionalidades: Navbar scroll, Particle Canvas, Testimonials Slider, FAQ Accordion, Form Handling
 */

// ── Navbar Scroll Effect ──
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ── Smooth Scroll to Section ──
function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ── Mobile Menu Toggle ──
function toggleMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    menuToggle.classList.toggle('active');
}

// ── Particle Canvas Animation ──
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2.5 + 0.5;
            this.opacity = Math.random() * 0.7 + 0.1;
            this.pulse = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulse += 0.02;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            const alpha = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));

            // Glow
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
            gradient.addColorStop(0, `rgba(245, 215, 142, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(201, 168, 76, ${alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(139, 105, 20, 0)`);

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 215, 142, ${alpha})`;
            ctx.fill();
        }
    }

    const particleCount = Math.floor(window.innerWidth / 8);
    const particles = Array.from({ length: particleCount }, () => new Particle());

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    };

    animate();
}

// ── Testimonials Slider ──
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const totalTestimonials = testimonials.length;

function showTestimonial(index) {
    testimonials.forEach((card, i) => {
        card.classList.toggle('hidden', i !== index);
    });

    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    showTestimonial(currentTestimonial);
}

function previousTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    showTestimonial(currentTestimonial);
}

function initTestimonials() {
    // Create dots
    const dotsContainer = document.getElementById('testimonialDots');
    if (dotsContainer) {
        for (let i = 0; i < totalTestimonials; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.onclick = () => {
                currentTestimonial = i;
                showTestimonial(i);
            };
            dotsContainer.appendChild(dot);
        }
    }

    // Auto-rotate testimonials
    setInterval(nextTestimonial, 5000);

    showTestimonial(0);
}

// ── FAQ Accordion ──
function toggleFaq(button) {
    const faqItem = button.closest('.faq-item');
    faqItem.classList.toggle('open');
}

// ── Form Handling ──
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Build WhatsApp message
    const message = `Ola Agencia Manu Digital, vim atraves da sua Landing page e gostaria de informacoes sobre o servico:\n\nNome: ${data.name}\nE-mail: ${data.email}\nTelefone: ${data.phone}\nServico: ${data.service}\nMensagem: ${data.message}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5541988204539?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Show success message
    form.style.display = 'none';
    const successDiv = document.getElementById('formSuccess');
    if (successDiv) {
        successDiv.classList.remove('hidden');
    }

    // Reset after 5 seconds
    setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        if (successDiv) {
            successDiv.classList.add('hidden');
        }
    }, 5000);
}

// ── Intersection Observer for Fade-up Animation ──
function initFadeUpAnimation() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.12 }
    );

    // Note: Add fade-up class to elements you want to animate
    // For now, we'll add it dynamically to section headers
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });
}

// Add fade-up styles dynamically
function addFadeUpStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-up {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// ── Initialize on DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTestimonials();
    addFadeUpStyles();
    initFadeUpAnimation();
});

// ── Prevent form submission if needed ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}
