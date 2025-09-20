  
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el => new bootstrap.Tooltip(el));

    // Form validation and submission
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            prenom: document.getElementById('prenom').value.trim(),
            nom: document.getElementById('nom').value.trim(),
            email: document.getElementById('email').value.trim(),
            telephone: document.getElementById('telephone').value.replace(/\s/g, ''),
            sujet: document.getElementById('sujet').value,
            message: document.getElementById('message').value.trim(),
            urgence: document.querySelector('input[name="urgence"]:checked').value,
            cgv: document.getElementById('cgv').checked
        };

        // Basic required fields
        if (!formData.prenom || !formData.nom || !formData.email || !formData.telephone || !formData.cgv) {
            showAlert('Veuillez remplir tous les champs obligatoires et accepter les CGV.', 'danger');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showAlert('Veuillez saisir une adresse email valide.', 'danger');
            return;
        }

        // Phone validation (international flexible)
        const phoneRegex = /^\+?\d[\d\s.-]{5,}$/;
        if (!phoneRegex.test(formData.telephone)) {
            showAlert('Veuillez saisir un numéro de téléphone valide.', 'danger');
            return;
        }

        // Submit form
        submitForm(formData);
    });

    function submitForm(formData) {
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
        submitBtn.disabled = true;

        // Simulate submission (replace with actual AJAX/Fetch)
        setTimeout(() => {
            showAlert('Votre message a été envoyé avec succès ! Je vous recontacterai dans les plus brefs délais.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    }

    function showAlert(message, type) {
        document.querySelectorAll('.alert').forEach(alert => alert.remove());

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            if (alertDiv.parentNode) alertDiv.remove();
        }, 5000);
    }

    // Copy phone number functionality
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => showAlert('Numéro copié dans le presse-papiers !', 'info'))
            .catch(() => fallbackCopy(text));
        } else fallbackCopy(text);
    }

    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            showAlert('Numéro copié dans le presse-papiers !', 'info');
        } catch {
            showAlert('Impossible de copier automatiquement. Sélectionnez le texte manuellement.', 'warning');
        }
        document.body.removeChild(textArea);
    }

    document.querySelectorAll('.phone-number').forEach(element => {
        element.style.cursor = 'pointer';
        element.title = 'Cliquer pour copier le numéro';
        element.addEventListener('click', () => copyToClipboard(element.textContent));
    });

    // Enhanced form interactions
    document.querySelectorAll('.form-control, .form-select').forEach(field => {
        field.addEventListener('focus', () => field.parentNode.style.transform = 'translateY(-2px)');
        field.addEventListener('blur', () => field.parentNode.style.transform = 'translateY(0)');
    });

    // Phone number formatting (optional, flexible)
    document.getElementById('telephone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    });

    // Scroll-to-top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            if (!document.querySelector('.scroll-top')) {
                const scrollBtn = document.createElement('button');
                scrollBtn.className = 'scroll-top position-fixed';
                scrollBtn.style.cssText = `
                    bottom: 30px; right: 30px; z-index: 1000;
                    width: 50px; height: 50px; border-radius: 50%;
                    background: var(--burgundy-deep); color: white;
                    border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    cursor: pointer; transition: all 0.3s ease;
                `;
                scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
                scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
                document.body.appendChild(scrollBtn);
            }
        } else {
            const scrollBtn = document.querySelector('.scroll-top');
            if (scrollBtn) scrollBtn.remove();
        }
    });

    // Fade-in page load
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => document.body.style.opacity = '1', 100);
    });
