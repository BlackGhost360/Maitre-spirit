// ========================================
// INITIALISATION GLOBALE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser AOS si disponible
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            offset: 50
        });
    }
    
    // Initialiser les tooltips Bootstrap si disponibles
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Initialiser toutes les fonctionnalités
    initCounters();
    initSmoothScroll();
    initNavbarEffects();
    initTimelineEffects();
    initCarousel();
    initFAQ();
    initButtonEffects();
    initServiceCards();
    initAccessibility();
    initBackToTop();
});

// ========================================
// COMPTEURS ANIMÉS
// ========================================

function initCounters() {
    const counters = document.querySelectorAll('.stats-number[data-count], .stat-number');
    if (!counters.length) return;

    const duration = 2000;
    
    function formatNumber(num) {
        return num.toLocaleString('fr-FR');
    }

    function animateCounter(element, target) {
        let current = 0;
        const startTime = performance.now();
        
        // Récupérer les symboles existants
        const originalText = element.textContent;
        const hasPlus = originalText.includes('+');
        const hasPercent = originalText.includes('%');
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            current = Math.floor(progress * target);
            
            let displayText = formatNumber(current);
            if (hasPlus) displayText += '+';
            if (hasPercent) displayText += '%';
            
            element.textContent = displayText;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Assurer l'affichage final correct
                let finalText = formatNumber(target);
                if (hasPlus) finalText += '+';
                if (hasPercent) finalText += '%';
                element.textContent = finalText;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // Observer pour déclencher l'animation quand visible
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    const target = parseInt(entry.target.getAttribute('data-count') || 
                                          entry.target.textContent.replace(/\D/g, ''));
                    
                    if (target && !isNaN(target)) {
                        entry.target.dataset.animated = 'true';
                        animateCounter(entry.target, target);
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });

        counters.forEach(counter => observer.observe(counter));
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#top') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// EFFETS NAVBAR
// ========================================

function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.pageYOffset;
        
        if (scrollY > 50) {
            navbar.style.boxShadow = '0 2px 25px rgba(139, 0, 0, 0.6)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(139, 0, 0, 0.3)';
            navbar.style.backdropFilter = 'none';
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

// ========================================
// EFFETS TIMELINE
// ========================================

function initTimelineEffects() {
    const timelineItems = document.querySelectorAll('.timeline-content');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.borderLeft = '5px solid var(--gold-accent)';
            this.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.borderLeft = 'none';
        });
    });
}

// ========================================
// CAROUSEL TÉMOIGNAGES
// ========================================

function initCarousel() {
    const carouselElement = document.getElementById('testimonialsCarousel');
    if (carouselElement && typeof bootstrap !== 'undefined') {
        try {
            new bootstrap.Carousel(carouselElement, {
                interval: 6000,
                wrap: true,
                pause: 'hover',
                keyboard: true
            });
        } catch (error) {
            console.warn('Erreur initialisation carousel:', error);
        }
    }
}

// ========================================
// FAQ ACCORDION
// ========================================

function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(button => {
        button.addEventListener('click', function() {
            toggleFAQ(this);
        });
        
        // Support clavier
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(this);
            }
        });
    });
}

function toggleFAQ(button) {
    const answer = button.nextElementSibling;
    const isActive = button.classList.contains('active');
    
    // Fermer tous les items FAQ
    document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
        const ans = q.nextElementSibling;
        if (ans) {
            ans.classList.remove('active');
            ans.style.maxHeight = '0';
        }
    });
    
    // Ouvrir l'item cliqué si pas déjà actif
    if (!isActive && answer) {
        button.classList.add('active');
        answer.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }
}

// ========================================
// EFFETS BOUTONS
// ========================================

function initButtonEffects() {
    // Boutons de consultation
    document.querySelectorAll('.consultation-btn, .btn-consultation').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Si c'est un lien WhatsApp, traiter spécialement
            if (href && href.includes('wa.me')) {
                e.preventDefault();
                
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Connexion...';
                this.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.pointerEvents = 'auto';
                    window.open(href, '_blank');
                }, 1500);
                
                return;
            }
            
            // Animation de chargement pour les autres boutons
            if (href && !href.startsWith('#')) {
                const originalText = this.textContent;
                this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>' + originalText;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 1000);
            }
        });
    });
}

// ========================================
// CARTES DE SERVICES
// ========================================

function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card, .specialization-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Effet au focus pour l'accessibilité
        card.addEventListener('focus', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('blur', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ========================================
// ACCESSIBILITÉ
// ========================================

function initAccessibility() {
    // Fermer le menu mobile avec Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                if (typeof bootstrap !== 'undefined') {
                    bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
                }
            }
            
            // Fermer tous les FAQ ouverts
            document.querySelectorAll('.faq-question.active').forEach(q => {
                q.classList.remove('active');
                const answer = q.nextElementSibling;
                if (answer) {
                    answer.classList.remove('active');
                    answer.style.maxHeight = '0';
                }
            });
        }
    });
    
    // Améliorer le focus visible
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// ========================================
// BOUTON RETOUR EN HAUT
// ========================================

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    let ticking = false;
    
    function updateBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.remove('d-none');
            backToTopBtn.style.opacity = '1';
        } else {
            backToTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (window.pageYOffset <= 300) {
                    backToTopBtn.classList.add('d-none');
                }
            }, 300);
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateBackToTop);
            ticking = true;
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// OPTIMISATION IMAGES LAZY LOADING
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Observer toutes les images lazy
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// GESTION DES ERREURS
// ========================================

window.addEventListener('error', function(e) {
    console.warn('Erreur JavaScript capturée:', e.error);
});

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

// Debounce function pour optimiser les performances
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fonction pour vérifier si un élément est visible
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========================================
// STYLES CSS POUR L'ACCESSIBILITÉ
// ========================================

// Ajouter les styles CSS pour l'accessibilité
const accessibilityStyles = `
<style>
.keyboard-navigation *:focus {
    outline: 2px solid var(--gold-accent) !important;
    outline-offset: 2px;
}

.loaded {
    opacity: 1;
    transition: opacity 0.3s ease;
}

.lazy {
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
</style>
`;

// Injecter les styles si pas déjà présents
if (!document.querySelector('#accessibility-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'accessibility-styles';
    styleElement.innerHTML = accessibilityStyles;
    document.head.appendChild(styleElement);
}