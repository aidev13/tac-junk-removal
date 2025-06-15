/* =================================
   DOM Ready and Initial Setup
   ================================= */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
    initializeSmoothScrolling();
    initializeMobileMenu();
    initializeContactForm();
    // initializePhotoUpload(); // Commented out photo upload functionality
    initializeScrollAnimations();
    initializeScrollToTop(); // Added this function call
    initializeThemeToggle();
});

/* =================================
   Navbar Functionality
   ================================= */
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* =================================
   Smooth Scrolling
   ================================= */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =================================
   Mobile Menu
   ================================= */
function initializeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    const mainContent = document.getElementById('main-content');

    // Toggle mobile menu
    mobileMenu.addEventListener('click', function() {
        toggleMobileMenu();
    });

    // Close mobile menu when overlay is clicked
    mobileOverlay.addEventListener('click', function() {
        closeMobileMenu();
    });

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    function toggleMobileMenu() {
        const isActive = mobileNav.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileNav.classList.add('active');
        mobileOverlay.classList.add('active');
        mainContent.classList.add('blur');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mainContent.classList.remove('blur');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Close mobile menu on window resize (if switching to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

/* =================================
   Contact Form Handling
   ================================= */
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(this);
        
        // Commented out photo-related functionality
        /*
        // Add uploaded photos to form data
        const photoInput = document.getElementById('photos');
        if (photoInput.files.length > 0) {
            for (let i = 0; i < photoInput.files.length; i++) {
                formData.append(`photo_${i}`, photoInput.files[i]);
            }
        }
        */
        
        // Convert FormData to object for logging (excluding files)
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (!key.startsWith('photo_')) {
                data[key] = value;
            }
        }
        // data.photoCount = photoInput.files.length; // Commented out
        
        // Simulate form submission
        console.log('Form submitted with data:', data);
        // console.log('Photos attached:', photoInput.files.length); // Commented out
        
        // Show success message
        alert(`Thank you for your quote request! We've received your information. Tristan will contact you within 24 hours with a detailed quote. For urgent requests, call (262) 446-6348.`);
        
        // Reset form and clear photo previews
        this.reset();
        // clearPhotoPreviews(); // Commented out
        
        // Here you would send the FormData to your server
        // Example: fetch('/submit-form', { method: 'POST', body: formData })
    });

    // Form validation with real-time feedback
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#10b981';
            }
        });

        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(239, 68, 68)' && this.value.trim()) {
                this.style.borderColor = '#10b981';
            }
        });
    });
}

/* =================================
   Photo Upload Functionality - COMMENTED OUT
   ================================= */
/*
let uploadedFiles = [];

function initializePhotoUpload() {
    const photoInput = document.getElementById('photos');
    const uploadArea = document.getElementById('upload-area');
    const photoPreview = document.getElementById('photo-preview');

    // File input change handler
    photoInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
}

function handleFiles(files) {
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    // Clear any existing error messages
    clearErrorMessages();
    
    if (uploadedFiles.length + files.length > maxFiles) {
        showError(`Maximum ${maxFiles} photos allowed. Please remove some photos first.`);
        return;
    }
    
    for (let file of files) {
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            showError(`${file.name}: Only JPG, JPEG, and PNG files are allowed.`);
            continue;
        }
        
        // Validate file size
        if (file.size > maxSize) {
            showError(`${file.name}: File size must be less than 10MB.`);
            continue;
        }
        
        // Add to uploaded files
        uploadedFiles.push(file);
        createPhotoPreview(file);
    }
    
    updateFileInput();
}

function createPhotoPreview(file) {
    const photoPreview = document.getElementById('photo-preview');
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${e.target.result}" alt="Preview" class="preview-image">
            <button type="button" class="remove-photo" onclick="removePhoto('${file.name}', this)">×</button>
            <div class="file-info">${formatFileSize(file.size)}</div>
        `;
        photoPreview.appendChild(previewItem);
    };
    reader.readAsDataURL(file);
}

function removePhoto(fileName, button) {
    // Remove from uploaded files array
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    
    // Remove preview element
    button.parentElement.remove();
    
    // Update file input
    updateFileInput();
    
    // Clear any error messages if photos are now within limits
    if (uploadedFiles.length <= 5) {
        clearErrorMessages();
    }
}

function updateFileInput() {
    // Create a new DataTransfer object to update the file input
    const dt = new DataTransfer();
    uploadedFiles.forEach(file => dt.items.add(file));
    document.getElementById('photos').files = dt.files;
}

function clearPhotoPreviews() {
    const photoPreview = document.getElementById('photo-preview');
    photoPreview.innerHTML = '';
    uploadedFiles = [];
    clearErrorMessages();
}

function showError(message) {
    const uploadArea = document.getElementById('upload-area');
    let errorDiv = document.querySelector('.upload-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'upload-error';
        uploadArea.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function clearErrorMessages() {
    const errorDiv = document.querySelector('.upload-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
*/
/* =================================
   Scroll Animations
   ================================= */
function initializeScrollAnimations() {
    // Add loading animation for service items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe service items for animation
    document.querySelectorAll('.service-item').forEach(item => {
        observer.observe(item);
    });

    // Add enhanced hover effects for service items
    document.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/* =================================
   Theme Toggle Functionality
   ================================= */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Desktop theme toggle
    themeToggle.addEventListener('click', function() {
        toggleTheme();
    });
    
    // Mobile theme toggle
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', function() {
            toggleTheme();
        });
    }
    
    function toggleTheme() {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    function setTheme(theme) {
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
        } else {
            body.removeAttribute('data-theme');
        }
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', function(e) {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

function initializeScrollToTop() {
    // Create scroll-to-top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(45deg, var(--primary-blue), var(--secondary-green));
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow);
    `;
    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
        } else {
            scrollToTopBtn.style.opacity = '0';
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effect
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });

    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

/* =================================
   Global Functions (for inline handlers)
   ================================= */
// Photo upload function commented out
// window.removePhoto = removePhoto;

/* =================================
   Utility Functions
   ================================= */
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/* =================================
   Performance Optimizations
   ================================= */
// Use passive event listeners for better performance
window.addEventListener('scroll', debounce(function() {
    // Debounced scroll events for performance
}, 10), { passive: true });

// Preload critical images (if any)
function preloadImages() {
    const imageUrls = [
        // Add any critical image URLs here
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

/* =================================
   Error Handling
   ================================= */
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You can add error reporting here
});