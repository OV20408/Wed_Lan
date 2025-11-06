// Wedding date - December 10, 2025
const weddingDate = new Date('2025-12-10T00:00:00').getTime();

// Countdown functionality
function updateCountdown() {
    // Solo actualizar si los elementos existen (en index.html)
    const daysElement = document.getElementById('days');
    if (!daysElement) return;
    
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

// Update countdown every second (solo si existe el elemento)
if (document.getElementById('days')) {
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// Generate name inputs dynamically
function generateNameInputs(tipo, cantidad, container) {
    // Guardar valores existentes antes de limpiar
    const existingInputs = container.querySelectorAll('input[type="text"]');
    const savedValues = {};
    existingInputs.forEach(input => {
        savedValues[input.name] = input.value;
    });
    
    // Clear existing inputs
    container.innerHTML = '';
    
    // Don't generate if cantidad is 0 or empty
    if (!cantidad || cantidad <= 0) {
        return;
    }
    
    const label = tipo === 'adultos' ? 'Adulto' : 'Niño';
    
    // Generate inputs for each person
    for (let i = 1; i <= cantidad; i++) {
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'input-wrapper';
        inputWrapper.style.marginTop = '1rem';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `nombre_${tipo}_${i}`;
        input.placeholder = `Nombre del ${label} ${i}`;
        input.required = true;
        
        // Restaurar valor si existía
        if (savedValues[input.name]) {
            input.value = savedValues[input.name];
        }
        
        const decoration = document.createElement('div');
        decoration.className = 'input-decoration';
        
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(decoration);
        container.appendChild(inputWrapper);
    }
}

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
    
    if (!form) {
        return;
    }
    
    // Handle "MÁS" option for adults
    const adultosSelect = document.getElementById('adultos');
    const adultosExtra = document.getElementById('adultosExtra');
    const adultosNombres = document.getElementById('adultosNombres');
    
    if (adultosSelect) {
        adultosSelect.addEventListener('change', function() {
            if (this.value === 'mas') {
                adultosExtra.classList.remove('hidden');
                adultosExtra.querySelector('input').required = true;
                // Clear name inputs when switching to "MÁS"
                adultosNombres.innerHTML = '';
            } else if (this.value === '') {
                // Si no selecciona nada, limpiar todo
                adultosExtra.classList.add('hidden');
                adultosExtra.querySelector('input').required = false;
                adultosExtra.querySelector('input').value = '';
                adultosNombres.innerHTML = '';
            } else {
                // Seleccionó un número del 1-10
                adultosExtra.classList.add('hidden');
                adultosExtra.querySelector('input').required = false;
                adultosExtra.querySelector('input').value = '';
                // Generate name inputs based on selected number
                const cantidad = parseInt(this.value);
                generateNameInputs('adultos', cantidad, adultosNombres);
            }
        });
    }
    
    // Handle extra adults number input
    if (adultosExtra) {
        const extraInput = adultosExtra.querySelector('input');
        extraInput.addEventListener('input', function() {
            const cantidad = parseInt(this.value) || 0;
            if (cantidad > 0) {
                generateNameInputs('adultos', cantidad, adultosNombres);
            } else {
                adultosNombres.innerHTML = '';
            }
        });
    }
    
    // Handle "MÁS" option for children
    const ninosSelect = document.getElementById('ninos');
    const ninosExtra = document.getElementById('ninosExtra');
    const ninosNombres = document.getElementById('ninosNombres');
    
    if (ninosSelect) {
        ninosSelect.addEventListener('change', function() {
            if (this.value === 'mas') {
                ninosExtra.classList.remove('hidden');
                // Clear name inputs when switching to "MÁS"
                ninosNombres.innerHTML = '';
            } else {
                ninosExtra.classList.add('hidden');
                ninosExtra.querySelector('input').value = '';
                // Generate name inputs based on selected number
                const cantidad = parseInt(this.value);
                if (cantidad > 0) {
                    generateNameInputs('ninos', cantidad, ninosNombres);
                } else {
                    ninosNombres.innerHTML = '';
                }
            }
        });
    }
    
    // Handle extra children number input
    if (ninosExtra) {
        const extraInput = ninosExtra.querySelector('input');
        extraInput.addEventListener('input', function() {
            const cantidad = parseInt(this.value) || 0;
            if (cantidad > 0) {
                generateNameInputs('ninos', cantidad, ninosNombres);
            } else {
                ninosNombres.innerHTML = '';
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Recopilar datos del formulario
            const formData = collectFormData();
            
            // Enviar a la API
            await submitToAPI(formData);
        }
    });
}

// Recopilar datos del formulario
function collectFormData() {
    const form = document.getElementById('confirmationForm');
    const formData = new FormData(form);
    
    // Obtener datos básicos
    const asiste = formData.get('asistencia') === 'si';
    const nombre = formData.get('nombre');
    const celular = formData.get('telefono');
    const mensaje = formData.get('mensaje');
    
    // Obtener cantidad de adultos
    let cantidadAdultos = 0;
    const adultosSelect = formData.get('adultos');
    if (adultosSelect === 'mas') {
        cantidadAdultos = parseInt(formData.get('adultos_extra')) || 0;
    } else {
        cantidadAdultos = parseInt(adultosSelect) || 0;
    }
    
    // Obtener cantidad de niños
    let cantidadNinos = 0;
    const ninosSelect = formData.get('ninos');
    if (ninosSelect === 'mas') {
        cantidadNinos = parseInt(formData.get('ninos_extra')) || 0;
    } else {
        cantidadNinos = parseInt(ninosSelect) || 0;
    }
    
    // Recopilar nombres de adultos
    const nombresAdultos = [];
    for (let i = 1; i <= cantidadAdultos; i++) {
        const nombreAdulto = formData.get(`nombre_adultos_${i}`);
        if (nombreAdulto) {
            nombresAdultos.push(nombreAdulto.trim());
        }
    }
    
    // Recopilar nombres de niños
    const nombresNinos = [];
    for (let i = 1; i <= cantidadNinos; i++) {
        const nombreNino = formData.get(`nombre_ninos_${i}`);
        if (nombreNino) {
            nombresNinos.push(nombreNino.trim());
        }
    }
    
    // Calcular cantidad total de personas
    const cantidadPersonas = cantidadAdultos + cantidadNinos;
    
    return {
        nombre: nombre.trim(),
        asiste: asiste,
        cantidad_personas: cantidadPersonas,
        nombres_acompanantes_mayor: nombresAdultos.length > 0 ? nombresAdultos : null,
        nombres_acompanantes_menor: nombresNinos.length > 0 ? nombresNinos : null,
        cantidad_ninos: cantidadNinos,
        cantidad_adultos: cantidadAdultos,
        celular: celular.trim(),
        mensaje: mensaje.trim()
    };
}

// Enviar datos a la API
async function submitToAPI(data) {
    try {
        // Mostrar loading
        showLoadingMessage();
        
        const response = await fetch(`${CONFIG.API_URL}/api/rsvp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Error al enviar confirmación');
        }
        
        const result = await response.json();
        console.log('RSVP creado con ID:', result.id);
        
        // Limpiar el formulario
        document.getElementById('confirmationForm').reset();
        
        // Limpiar los contenedores de nombres dinámicos
        document.getElementById('adultosNombres').innerHTML = '';
        document.getElementById('ninosNombres').innerHTML = '';
        
        // Mostrar mensaje de éxito
        showSuccessMessage();
        
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage(error.message || 'Error al enviar la confirmación. Por favor intenta de nuevo.');
    }
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

// Show loading message
function showLoadingMessage() {
    // Remover mensajes anteriores
    const existingMessage = document.querySelector('.loading-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'loading-message';
    message.innerHTML = `
        <div class="message-content">
            <div class="spinner"></div>
            <p>Enviando confirmación...</p>
        </div>
    `;
    
    document.body.appendChild(message);
}

// Show success message
function showSuccessMessage() {
    // Remover mensaje de loading
    const loadingMessage = document.querySelector('.loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
    
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
        // Redirigir a la página principal
        window.location.href = 'index.html';
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
    // Start countdown (solo si existe en la página)
    if (document.getElementById('days')) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Initialize scroll animations
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Initialize form
    initializeForm();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Add fade-in animation to hero section (solo si existe)
    const heroContainer = document.querySelector('.hero .container');
    if (heroContainer) {
        setTimeout(() => {
            heroContainer.classList.add('fade-in-up');
        }, 100);
    }
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
    .error-message,
    .loading-message {
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
    
    .loading-message {
        border: 2px solid var(--durazno);
    }
    
    .spinner {
        border: 3px solid var(--gris-claro);
        border-top: 3px solid var(--durazno);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
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

