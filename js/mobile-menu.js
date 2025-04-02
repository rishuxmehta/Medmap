// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.querySelector('.close-mobile-menu');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuItems = document.querySelectorAll('.mobile-nav-list a');
    
    // State
    let isMenuOpen = false;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Log initial status
    console.log('Mobile menu initialization:');
    console.log('- Menu toggle found:', !!menuToggle);
    console.log('- Mobile menu found:', !!mobileMenu);
    console.log('- Close button found:', !!closeMenuBtn);
    console.log('- Overlay found:', !!menuOverlay);
    console.log('- Menu items found:', menuItems ? menuItems.length : 0);
    
    // Functions
    function openMenu() {
        if (isMenuOpen) return;
        
        isMenuOpen = true;
        document.body.classList.add('menu-open');
        
        // Show menu with transform - directly set style
        mobileMenu.style.transform = 'translateX(280px)';
        
        // Add visible classes
        menuOverlay.classList.add('fade-in');
        menuToggle.classList.add('active');
        
        // Set ARIA attributes
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuOverlay.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        
        console.log('Menu opened');
    }
    
    function closeMenu() {
        if (!isMenuOpen) return;
        
        isMenuOpen = false;
        document.body.classList.remove('menu-open');
        
        // Hide menu with transform - directly set style
        mobileMenu.style.transform = 'translateX(0)';
        
        // Remove visible classes
        menuOverlay.classList.remove('fade-in');
        menuToggle.classList.remove('active');
        
        // Set ARIA attributes
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuOverlay.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        console.log('Menu closed');
    }
    
    // Event Listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Menu toggle clicked, current state:', isMenuOpen);
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }
    
    // Touch events for swipe detection
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 100;
        const swipeDistance = touchEndX - touchStartX;
        
        // Left to right swipe (open menu) when menu is closed
        if (swipeDistance > swipeThreshold && !isMenuOpen) {
            openMenu();
        }
        
        // Right to left swipe (close menu) when menu is open
        if (swipeDistance < -swipeThreshold && isMenuOpen) {
            closeMenu();
        }
    }
    
    // Close menu on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });

    // Close menu when clicking on a menu item
    if (menuItems && menuItems.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                closeMenu();
            });
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Force proper initial state
    if (mobileMenu) {
        mobileMenu.style.transform = 'translateX(0)';
        mobileMenu.setAttribute('aria-hidden', 'true');
    }
}); 