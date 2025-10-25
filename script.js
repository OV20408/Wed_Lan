// Wedding date - December 10, 2025
const weddingDate = new Date('2025-12-10T00:00:00').getTime();

// Countdown functionality
function updateCountdown() {
    const weddingDate = new Date('2025-12-10T00:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});


// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-animate]');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('animate');
        }
    });
}

// Form validation and functionality
function initializeForm() {
    const form = document.getElementById('confirmationForm');
    
    if (!form) return;
    
    // Handle "MÁS" option for adults
    const adultosSelect = document.getElementById('adultos');
    const adultosExtra = document.getElementById('adultosExtra');
    
    if (adultosSelect) {
        adultosSelect.addEventListener('change', function() {
            if (this.value === 'mas') {
                adultosExtra.classList.remove('hidden');
                adultosExtra.querySelector('input').required = true;
            } else {
                adultosExtra.classList.add('hidden');
                adultosExtra.querySelector('input').required = false;
                adultosExtra.querySelector('input').value = '';
            }
        });
    }
    
    // Handle "MÁS" option for children
    const ninosSelect = document.getElementById('ninos');
    const ninosExtra = document.getElementById('ninosExtra');
    
    if (ninosSelect) {
        ninosSelect.addEventListener('change', function() {
            if (this.value === 'mas') {
                ninosExtra.classList.remove('hidden');
            } else {
                ninosExtra.classList.add('hidden');
                ninosExtra.querySelector('input').value = '';
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Here you would typically send the data to your backend
            // For now, we'll show a success message
            showSuccessMessage();
        }
    });
}

// Form validation
function validateForm() {
    const form = document.getElementById('confirmationForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous error styles
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.parentElement.classList.add('error');
            isValid = false;
        }
    });
    
    // Validate phone number format
    const telefono = document.getElementById('telefono');
    if (telefono && telefono.value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(telefono.value.replace(/\s/g, ''))) {
            telefono.parentElement.classList.add('error');
            isValid = false;
        }
    }
    
    if (!isValid) {
        showErrorMessage('Por favor completa todos los campos requeridos correctamente.');
    }
    
    return isValid;
}

// Show success message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div class="message-content">
            <h3>¡Confirmación Enviada!</h3>
            <p>Gracias por confirmar tu asistencia. ¡Te esperamos!</p>
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
        // Optionally redirect to main page
        // window.location.href = 'index.html';
    }, 3000);
}

// Show error message
function showErrorMessage(text) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'error-message';
    message.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
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
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Initialize scroll animations
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Initialize form
    initializeForm();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Add fade-in animation to hero section
    setTimeout(() => {
        document.querySelector('.hero .container').classList.add('fade-in-up');
    }, 100);
});

// Add error styles dynamically
const errorStyles = `
    .error input,
    .error select,
    .error textarea {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }
    
    .success-message,
    .error-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        text-align: center;
        max-width: 400px;
        width: 90%;
    }
    
    .success-message {
        border: 2px solid var(--verde-oscuro);
    }
    
    .success-message h3 {
        color: var(--verde-oscuro);
        margin-bottom: 1rem;
        font-family: 'Playfair Display', serif;
    }
    
    .error-message {
        border: 2px solid #e74c3c;
        color: #e74c3c;
    }
    
    .message-content p {
        margin: 0;
        font-size: 1.1rem;
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);

