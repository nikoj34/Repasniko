/**
 * N3D Créations - Contact Form JavaScript
 * Intégration avec EmailJS (Service SMTP personnalisé), reCAPTCHA v2, GA4 et GTM
 * https://www.n3d-creations.fr
 * Version: 1.0
 * Auteur: N3D Créations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Récupération des éléments du formulaire
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    // Initialisation d'EmailJS avec votre clé API
    emailjs.init("EBrGB2l76QmbrfE9K");

    // Gestion de l'envoi du formulaire
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation du formulaire
            if (!validateForm()) {
                return;
            }
            
            // Vérifier que l'utilisateur a validé le reCAPTCHA
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                showMessage('error', "Veuillez valider le captcha avant d'envoyer le formulaire.");
                return;
            }
            
            // Mettre le bouton de soumission en mode chargement
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = "Envoi en cours...";
            
            // Préparer les données du formulaire pour EmailJS
            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                phone: contactForm.phone.value || 'Non renseigné',
                subject: contactForm.subject.value,
                message: contactForm.message.value,
                'g-recaptcha-response': recaptchaResponse
            };
            
            // Envoi du formulaire via EmailJS
            // Service ID : service_t7suz6b, Template ID : template_ctga8jh
            emailjs.send('service_t75uz6b', 'template_ctga8jh', formData)
                .then(function(response) {
                    console.log("SUCCESS!", response.status, response.text);
                    
                    // Réinitialisation du formulaire et du reCAPTCHA en cas de succès
                    contactForm.reset();
                    grecaptcha.reset();
                    
                    // Affichage d'un message de succès
                    showMessage('success', "Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.");
                    
                    // Suivi de la soumission du formulaire (pour GA4 et GTM)
                    trackFormSubmission('success');
                    
                    // Réactivation du bouton de soumission
                    submitButton.disabled = false;
                    submitButton.innerHTML = "Envoyer";
                })
                .catch(function(error) {
                    console.log("FAILED...", error);
                    
                    // Affichage d'un message d'erreur en cas de problème lors de l'envoi
                    showMessage('error', "Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer ou nous contacter par téléphone.");
                    
                    // Suivi de l'erreur de soumission
                    trackFormSubmission('error');
                    
                    // Réactivation du bouton de soumission
                    submitButton.disabled = false;
                    submitButton.innerHTML = "Envoyer";
                });
        });
    }
    
    // Fonction de validation du formulaire
    function validateForm() {
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const subject = contactForm.subject.value;
        const message = contactForm.message.value.trim();
        const privacy = contactForm.privacy.checked;
        
        // Suppression des messages d'erreur précédents
        const errorElements = contactForm.querySelectorAll('.error-message');
        errorElements.forEach(el => el.remove());
        
        let isValid = true;
        
        // Vérification du nom
        if (name === "") {
            showFieldError("name", "Veuillez entrer votre nom.");
            isValid = false;
        }
        
        // Vérification de l'email
        if (email === "") {
            showFieldError("email", "Veuillez entrer votre email.");
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError("email", "Veuillez entrer un email valide.");
            isValid = false;
        }
        
        // Vérification du sujet
        if (subject === "" || subject === null) {
            showFieldError("subject", "Veuillez sélectionner un sujet.");
            isValid = false;
        }
        
        // Vérification du message
        if (message === "") {
            showFieldError("message", "Veuillez entrer votre message.");
            isValid = false;
        }
        
        // Vérification de l'acceptation de la politique de confidentialité
        if (!privacy) {
            showFieldError("privacy", "Vous devez accepter la politique de confidentialité.");
            isValid = false;
        }
        
        return isValid;
    }
    
    // Fonction pour vérifier la validité de l'email avec une expression régulière
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Fonction d'affichage d'un message d'erreur sur un champ spécifique
    function showFieldError(fieldName, message) {
        const field = contactForm[fieldName];
        const errorElement = document.createElement("div");
        errorElement.className = "error-message";
        errorElement.style.color = "var(--color-error)";
        errorElement.style.fontSize = "var(--font-size-sm)";
        errorElement.style.marginTop = "5px";
        errorElement.innerHTML = message;
        
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = "var(--color-error)";
        
        // Retirer l'erreur lorsque l'utilisateur focus sur le champ
        field.addEventListener("focus", function() {
            this.style.borderColor = "";
            const error = this.parentNode.querySelector(".error-message");
            if (error) {
                error.remove();
            }
        });
    }
    
    // Fonction d'affichage d'un message global pour le formulaire
    function showMessage(type, message) {
        formMessage.className = "form-message";
        formMessage.classList.add(`form-message--${type}`);
        formMessage.innerHTML = message;
        formMessage.style.display = "block";
        formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Masquer le message après un délai en cas de succès
        if (type === "success") {
            setTimeout(() => {
                formMessage.style.display = "none";
            }, 5000);
        }
    }
    
    // Suivi de la soumission du formulaire (Google Analytics 4 et Google Tag Manager)
    function trackFormSubmission(status) {
        // Google Analytics 4
        if (typeof gtag === "function") {
            gtag("event", "form_submission", {
                event_category: "Contact",
                event_label: status === "success" ? "Success" : "Error",
                value: 1
            });
        }
        
        // Google Tag Manager
        if (typeof dataLayer === "object") {
            dataLayer.push({
                event: "formSubmission",
                formName: "contactForm",
                formStatus: status
            });
        }
    }
});
