// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const closeMobileMenu = document.querySelector('.close-mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    // Better touch handling with cleaner approach
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }

    function handleSwipe() {
        // Calculate swipe distance
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Detect horizontal swipe (only if it's more horizontal than vertical)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Right to left swipe - open menu
            if (deltaX < -50 && !mobileMenu.classList.contains('active')) {
                openMenu();
            }
            
            // Left to right swipe - close menu
            if (deltaX > 50 && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        }
    }

    // Open mobile menu
    function openMenu() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.classList.add('menu-open'); // New class for body
        document.body.style.overflow = 'hidden';
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileMenu.focus();
        
        // Add active state to toggle button
        mobileMenuToggle.classList.add('active');
    }

    // Close mobile menu
    function closeMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open'); // Remove class from body
        document.body.style.overflow = '';
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenuToggle.focus();
        
        // Remove active state from toggle button
        mobileMenuToggle.classList.remove('active');
    }

    // Event listeners for opening menu - use one handler with preventDefault only when needed
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        openMenu();
    });

    // Event listeners for closing menu
    closeMobileMenu.addEventListener('click', function(e) {
        e.preventDefault();
        closeMenu();
    });
    
    mobileMenuOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        closeMenu();
    });

    // Close menu when clicking a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Small delay to allow the click to register before closing
            setTimeout(closeMenu, 50);
        });
    });

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Improved window resize handler with debouncing
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        }, 150); // Shorter timeout for better responsiveness
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Handle focus trap (improved)
    mobileMenu.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const focusableElements = mobileMenu.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length) {
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });

    // Better scroll prevention
    function preventScroll(e) {
        if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target)) {
            e.preventDefault();
        }
    }

    // Add the improved touch handler
    document.addEventListener('touchmove', preventScroll, { passive: false });
}); 