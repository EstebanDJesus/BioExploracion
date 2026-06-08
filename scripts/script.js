/* ============================================
   BIOEXPLORACIÓN - JavaScript Interactivo
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Añadir clase para habilitar animaciones (fallback si no hay JS)
    document.documentElement.classList.add('js-enabled');

    initNavbar();
    initScrollAnimations();
    initCounterAnimations();
    initParticles();
    initMobileMenu();
    initSmoothScroll();
});

/* ============================================
   NAVEGACIÓN: Cambio de estilo al scroll
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            // Solo quitar 'scrolled' si no estamos en una página interna
            // Las páginas internas siempre tienen navbar oscura
            if (!document.querySelector('.page-header') && !document.querySelector('.labs-hero')) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Forzar scrolled en páginas internas
    if (document.querySelector('.page-header') || document.querySelector('.labs-hero')) {
        navbar.classList.add('scrolled');
    }
}

/* ============================================
   ANIMACIONES AL SCROLL
   ============================================ */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Una vez visible, dejar de observar para no re-animar
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   CONTADORES ANIMADOS
   ============================================ */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (counters.length === 0) return;

    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60; // 60 frames ~ 1 segundo
    const duration = 1500; // ms
    const stepTime = duration / 60;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

/* ============================================
   PARTÍCULAS EN EL HERO
   ============================================ */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Posición aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Tamaño aleatorio
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Opacidad aleatoria
        particle.style.opacity = Math.random() * 0.5 + 0.1;

        // Animación personalizada
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

        container.appendChild(particle);
    }
}

/* ============================================
   MENÚ MÓVIL
   ============================================ */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.textContent = '☰';
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            menuBtn.textContent = '☰';
        }
    });
}

/* ============================================
   SCROLL SUAVE PARA ANCLAS
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ============================================
   FORMULARIO DE CONTACTO
   ============================================ */
function handleContactSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const nombre = form.nombre.value;
    const email = form.email.value;
    const asunto = form.asunto.value;
    const mensaje = form.mensaje.value;

    // Simulación de envío
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i>⏳</i> Enviando...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
        btn.innerHTML = '<i>✅</i> ¡Mensaje Enviado!';
        btn.style.background = 'linear-gradient(135deg, #2d6a4f, #40916c)';

        // Mostrar mensaje de éxito
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            background: rgba(45, 106, 79, 0.1);
            border: 2px solid var(--color-secundario);
            color: var(--color-primario);
            padding: 1rem;
            border-radius: 12px;
            margin-top: 1rem;
            text-align: center;
            font-weight: 600;
            animation: fadeInUp 0.5s ease-out;
        `;
        successMsg.innerHTML = '🎉 ¡Gracias por tu mensaje! Te responderemos pronto.';
        form.appendChild(successMsg);

        form.reset();

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.background = '';
            if (successMsg.parentNode) successMsg.remove();
        }, 4000);
    }, 1500);

    return false;
}

/* ============================================
   EFECTO PARALLAX SUAVE
   ============================================ */
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.quote-section');

    parallaxElements.forEach(el => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        el.style.backgroundPositionY = yPos + 'px';
    });
});

/* ============================================
   EFECTO DE TIPOGRAFÍA EN HERO (opcional)
   ============================================ */
function typeWriterEffect(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/* ============================================
   DETECCIÓN DE PREFERENCIA DE REDUCIR MOVIMIENTO
   ============================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Desactivar animaciones complejas
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

    document.querySelectorAll('.particle').forEach(el => {
        el.style.display = 'none';
    });
}