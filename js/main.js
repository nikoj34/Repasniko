/**
 * N3D Créations - Main JavaScript
 * https://www.n3d-creations.fr
 * Version: 1.0
 * Author: N3D Créations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const backToTop = document.querySelector('.back-to-top');
    const faqItems = document.querySelectorAll('.faq-item__question');
    const portfolioFilters = document.querySelectorAll('.portfolio__filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Toggle mobile navigation using CSS classes
    function toggleNav() {
        if (navToggle && navMenu) {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
    }

    // Close mobile navigation
    function closeNav() {
        if (navToggle && navMenu) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Add box shadow to header on scroll
    function scrollHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Show/hide back to top button
    function scrollBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    }
    
    // Smooth scroll for anchor links
    function smoothScroll(e) {
        const href = this.getAttribute('href');
        
        // Si c'est un lien interne avec #
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Scroll à la position cible
                window.scrollTo({
                    top: target.offsetTop - header.offsetHeight,
                    behavior: 'smooth'
                });
                
                // Mettre à jour l'URL avec le hash
                window.history.pushState(null, null, href);
                
                // Mettre à jour le lien actif
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
                
                closeNav();
            }
        }
    }
    
   // Toggle FAQ items
   function toggleFaq() {
    const question = this;
    const answer = question.nextElementSibling;
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    
    // Fermer toutes les questions
    faqItems.forEach(item => {
        item.setAttribute('aria-expanded', 'false');
    });
    
    // Si elle était fermée, l'ouvrir
    if (!isExpanded) {
        question.setAttribute('aria-expanded', 'true');
    }
}
    
    // Filter portfolio items
    function filterPortfolio() {
        const filter = this.getAttribute('data-filter');
        
        // Update active filter button
        portfolioFilters.forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Show/hide portfolio items based on filter
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                // Apply fade-in animation
                item.classList.add('fade-in');
            } else {
                item.style.display = 'none';
                item.classList.remove('fade-in');
            }
        });
    }
    
    // Portfolio item details
    function setupPortfolioItems() {
        portfolioItems.forEach(item => {
            item.addEventListener('click', function() {
                const title = this.querySelector('.portfolio-item__title').textContent;
                const description = this.querySelector('.portfolio-item__description').textContent;
                const techSpecs = this.getAttribute('data-tech-specs');
                const imgSrc = this.querySelector('img').getAttribute('src');
                
                // Show modal or details view (optional implementation)
                console.log('Portfolio item clicked:', { title, description, techSpecs, imgSrc });
            });
        });
    }
    
    // Add animation to sections when they come into view
    function animateSections() {
        const sections = document.querySelectorAll('section');
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Gestion des liens actifs de la navigation
    function updateActiveNavLink() {
        // Obtenir l'URL actuelle 
        const currentLocation = window.location.pathname;
        const currentHash = window.location.hash;
        
        // Retirer la classe active de tous les liens
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Ajouter la classe active au lien correspondant
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Si c'est un lien interne avec un hash et que le hash correspond
            if (href.startsWith('#') && href === currentHash) {
                link.classList.add('active');
                return;
            }
            
            // Si c'est la page d'accueil (index.html) et qu'il n'y a pas de hash
            if ((href === 'index.html' || href === './index.html') && !currentHash) {
                link.classList.add('active');
                return;
            }
        });
        
        // Si aucun lien n'est actif, activer le lien "Accueil" par défaut
        if (!document.querySelector('.nav__link.active')) {
            navLinks[0].classList.add('active');
        }
    }
    
    // Event Listeners
    
    // Toggle navigation - VÉRIFICATION SUPPLÉMENTAIRE
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault(); // Empêcher le comportement par défaut
            e.stopPropagation(); // Empêcher la propagation
            toggleNav();
        });
    }
    
    // Close navigation when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Header scroll effect
    window.addEventListener('scroll', scrollHeader);
    
    // Back to top button
    window.addEventListener('scroll', scrollBackToTop);
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // FAQ accordion
    faqItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();  // Empêche toute action par défaut du bouton
            toggleFaq.call(this);
        });
    });
   
    
    // Portfolio filters
    portfolioFilters.forEach(btn => {
        btn.addEventListener('click', filterPortfolio);
    });
    
    // Initialize
    scrollHeader();
    scrollBackToTop();
    setupPortfolioItems();
    animateSections();
    updateActiveNavLink(); // Mise à jour initiale des liens actifs
    
    // Mettre à jour les liens actifs lors du défilement ou des changements d'URL
    window.addEventListener('scroll', function() {
        // Mise à jour basée sur la section visible
        const scrollPos = window.scrollY + header.offsetHeight + 50;
        
        // Trouver la section visible actuelle
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                const currentId = '#' + section.getAttribute('id');
                
                // Mettre à jour l'URL et la navigation active
                history.replaceState(null, null, currentId);
                
                // Mise à jour des liens actifs
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === currentId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', function(e) {
        // Vérifier que le menu est ouvert et que le clic n'est ni sur le menu ni sur le bouton
        if (navMenu && 
            navToggle && 
            navToggle.getAttribute('aria-expanded') === 'true' && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeNav();
        }
    });
    
    // DEBUG: Ajouter un message dans la console pour confirmer que le script est bien chargé
    console.log("N3D Créations - Script principal chargé avec succès");
});