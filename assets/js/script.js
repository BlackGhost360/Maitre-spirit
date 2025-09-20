// -----------------------------
// Initialisation AOS
// -----------------------------
AOS.init({
    duration: 1000,
    easing: 'ease-in-out-cubic',
    once: true,
    offset: 50
});

// -----------------------------
// Compteurs (vanilla JS)
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.stats-number[data-count]');
  if (!counters.length) return;

  const duration = 2000; // durée animation en ms
  const format = n => n.toLocaleString('fr-FR'); // formatage FR (espaces pour milliers)

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const start = 0;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * (target - start) + start);
      el.textContent = format(value);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = format(target);
    }
    requestAnimationFrame(step);
  }

  // Observer pour démarrer seulement quand visible
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (!el.dataset.started) {
            el.dataset.started = 'true';
            animateCount(el);
            observer.unobserve(el);
          }
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => obs.observe(c));
  } else {
    // Fallback si pas IntersectionObserver
    counters.forEach(c => animateCount(c));
  }
});

// -----------------------------
// Smooth scroll (liens internes)
// -----------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// -----------------------------
// Effet de scroll sur la navbar
// -----------------------------
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(139, 0, 0, 0.5)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(139, 0, 0, 0.3)';
    }
});

// -----------------------------
// Effet hover timeline
// -----------------------------
// document.querySelectorAll('.timeline-content').forEach(item => {
//     item.addEventListener('mouseenter', function() {
//         this.style.borderLeft = '5px solid var(--gold-accent)';
//     });
//     item.addEventListener('mouseleave', function() {
//         this.style.borderLeft = 'none';
//     });
// });

// -----------------------------
// Bouton Back to Top
// -----------------------------
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.remove('d-none');
        } else {
            backToTop.classList.add('d-none');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// index page


    



// Initialize AOS animations
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
        
        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        

        // Auto-start testimonials carousel
        const carousel = new bootstrap.Carousel('#testimonialsCarousel', {
            interval: 6000,
            wrap: true,
            pause: 'hover'
        });

        // FAQ Toggle Function
        function toggleFAQ(button) {
            const answer = button.nextElementSibling;
            const isActive = button.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                button.classList.add('active');
                answer.classList.add('active');
            }
        }


        


        // Accessibility: Keyboard navigation for FAQ
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFAQ(this);
                }
            });
        });

        // Accessibility: Escape key to close mobile menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
                }
            }
        });

        // Loading animation for buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.href && !this.href.includes('#')) {
                    this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>' + this.textContent;
                }
            });
        });

        // Intersection Observer for counter animation
        const observeCounters = () => {
            const counters = document.querySelectorAll('.stat-number');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = parseInt(entry.target.textContent.replace(/\D/g, ''));
                        animateCounter(entry.target, target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => observer.observe(counter));
        };

        const animateCounter = (element, target) => {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
                }
            }, 30);
        };

        // Initialize counter animation
        observeCounters();

        // Performance optimization: Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }


// service page scripte

        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });


        // Add loading animation to consultation buttons
        document.querySelectorAll('.consultation-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add loading state
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
                this.style.pointerEvents = 'none';
                
                // Simulate loading
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.pointerEvents = 'auto';
                    
                    // Open WhatsApp or show contact form
                    window.open('https://wa.me/23565081086?text=Bonjour Maître Kofi, je souhaite une consultation gratuite de 15min', '_blank');
                }, 2000);
            });
        });

        // Service card hover effects
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
