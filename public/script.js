// ========================================
// HVAC Website - Interactive Components
// ========================================

// === NAVIGATION ===
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navLinks.classList.remove('active');
        });
    });

    // Navbar scroll effect
    // Navbar scroll effect with performance optimization
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });
});

// === SMOOTH SCROLLING ===
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

// === SCROLL ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function () {
    const animatedElements = document.querySelectorAll('.card, .feature-item, .testimonial-card, .section-header');
    animatedElements.forEach(el => observer.observe(el));
});

// === FAQ ACCORDION ===
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Initialize FAQ if on FAQ page
if (document.querySelector('.faq-item')) {
    initFAQ();
}

// === CONTACT FORM WITH BACKEND INTEGRATION ===
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form values
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                service: document.getElementById('service').value,
                message: document.getElementById('message').value.trim()
            };

            // Basic client-side validation
            if (!formData.name || !formData.email || !formData.phone || !formData.message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitText.style.display = 'none';
            submitLoading.style.display = 'inline';
            formMessage.style.display = 'none';

            try {
                // Send to backend API (relative path)
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Success!
                    showMessage(data.message || 'Thank you for your message! We will contact you shortly.', 'success');
                    contactForm.reset();
                } else {
                    // Server returned an error
                    if (data.errors && data.errors.length > 0) {
                        const errorMessages = data.errors.map(err => err.message).join(', ');
                        showMessage(errorMessages, 'error');
                    } else {
                        showMessage(data.message || 'Something went wrong. Please try again.', 'error');
                    }
                }
            } catch (error) {
                // Network or other error
                console.error('Form submission error:', error);
                showMessage('Unable to send message. Please try again or call us directly at 770-376-7161.', 'error');
            } finally {
                // Reset button state
                if (submitBtn) submitBtn.disabled = false;
                if (submitText) submitText.style.display = 'inline';
                if (submitLoading) submitLoading.style.display = 'none';
            }
        });
    }

    // Helper function to show messages
    function showMessage(message, type) {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.style.display = 'block';

        if (type === 'success') {
            formMessage.style.background = '#d1fae5';
            formMessage.style.color = '#065f46';
            formMessage.style.border = '1px solid #10b981';
        } else {
            formMessage.style.background = '#fee2e2';
            formMessage.style.color = '#991b1b';
            formMessage.style.border = '1px solid #ef4444';
        }

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide success messages after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 10000);
        }
    }
}

// Initialize contact form if on contact page
initContactForm();

// === TESTIMONIAL CAROUSEL (Simple) ===
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;

    if (testimonials.length > 3) {
        // Hide all except first 3
        testimonials.forEach((testimonial, index) => {
            if (index >= 3) {
                testimonial.style.display = 'none';
            }
        });

        // Auto-rotate every 5 seconds
        setInterval(() => {
            testimonials[currentIndex].style.display = 'none';
            currentIndex = (currentIndex + 1) % testimonials.length;
            testimonials[currentIndex].style.display = 'block';
        }, 5000);
    }
}

// Initialize testimonial carousel if testimonials exist
if (document.querySelector('.testimonial-card')) {
    initTestimonialCarousel();
}

// === EMERGENCY PHONE CLICK TO CALL ===
document.addEventListener('DOMContentLoaded', function () {
    const emergencyPhones = document.querySelectorAll('.emergency-phone');
    emergencyPhones.forEach(phone => {
        phone.style.cursor = 'pointer';
        phone.addEventListener('click', function () {
            // In a real implementation, this would trigger a phone call
            const phoneNumber = this.textContent.replace(/\D/g, '');
            window.location.href = `tel:${phoneNumber}`;
        });
    });
});

// === UTILITY FUNCTIONS ===
// Format phone numbers
function formatPhoneNumber(input) {
    const cleaned = input.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return input;
}

// Add phone formatting to phone inputs
document.addEventListener('DOMContentLoaded', function () {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function () {
            this.value = formatPhoneNumber(this.value);
        });
    });
});
