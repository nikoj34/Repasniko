// Script dédié uniquement au menu mobile
(function() {
  // Attendre que la page soit complètement chargée
  window.addEventListener('load', function() {
    console.log("Script menu mobile chargé");
    
    // Récupérer les éléments
    var navToggle = document.getElementById('nav-toggle');
    var navMenu = document.getElementById('nav-menu');
    
    // Vérifier que les éléments existent
    if (!navToggle || !navMenu) {
      console.error("Elements du menu mobile non trouvés");
      return;
    }
    
    // S'assurer que le menu est initialement fermé
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    
    // Fonction pour ouvrir/fermer le menu
    function toggleMenu(event) {
      event.preventDefault();
      
      // Inverser l'état du menu
      if (navMenu.classList.contains('active')) {
        // Fermer le menu
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
      } else {
        // Ouvrir le menu
        navMenu.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.classList.add('active');
      }
      
      console.log("Menu toggled:", navMenu.classList.contains('active'));
    }
    
    // Ajouter un gestionnaire d'événements au bouton
    navToggle.addEventListener('click', toggleMenu);
    
    // Fermer le menu quand on clique sur un lien
    var navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
      });
    });
    
    console.log("Gestionnaires d'événements du menu mobile ajoutés");
  });
})();