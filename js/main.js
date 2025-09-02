/**
 * Modern JavaScript for Landing Page
 * Features: ES6+, Intersection Observer, Performance optimizations
 */

class LandingPageApp {
    constructor() {
        this.isLoading = true;
        this.observers = new Map();
        this.debounceTimers = new Map();
        
        this.init();
    }

    async init() {
        try {
            await this.waitForDOMReady();
            await this.initializeComponents();
            this.hideLoadingIndicator();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Erro ao carregar a página. Tente recarregar.');
        }
    }

    waitForDOMReady() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    async initializeComponents() {
        // Initialize all components in parallel
        await Promise.all([
            this.initializeAnimations(),
            this.initializeTheme(),
            this.initializeMobileMenu(),
            this.initializeScrollEffects(),
            this.initializeFormValidation(),
            this.initializeAccessibility(),
            this.initializeLazyLoading(),
            this.initializePerformanceOptimizations()
        ]);
    }

    hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
            setTimeout(() => {
                loadingIndicator.remove();
            }, 300);
        }
        this.isLoading = false;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-error);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Animation System with Intersection Observer
    async initializeAnimations() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                once: true,
                duration: 800,
                offset: 100,
                easing: 'ease-out-cubic',
                disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            });
        }

        // Custom Intersection Observer for performance
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    this.triggerCustomAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that need custom animations
        document.querySelectorAll('.service-card, .testimonial, .faq-item').forEach(el => {
            observer.observe(el);
        });

        this.observers.set('main', observer);
    }

    triggerCustomAnimation(element) {
        // Add custom animation classes based on element type
        if (element.classList.contains('service-card')) {
            element.style.animation = 'slideInUp 0.6s ease forwards';
        } else if (element.classList.contains('testimonial')) {
            element.style.animation = 'fadeInScale 0.8s ease forwards';
        }
    }

    // Enhanced Theme System
    async initializeTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;

        if (!themeToggle) return;

        // Get current theme (already applied by immediate script)
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

        // Ensure theme is properly applied (sync with immediate script)
        this.applyTheme(currentTheme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(currentTheme);
            }
        });

        // Theme toggle handler
        themeToggle.addEventListener('click', () => {
            currentTheme = html.classList.contains('dark-theme') ? 'light' : 'dark';
            this.applyTheme(currentTheme);
            localStorage.setItem('theme', currentTheme);
            
            // Announce theme change for screen readers
            this.announceToScreenReader(`Tema alterado para ${currentTheme === 'dark' ? 'escuro' : 'claro'}`);
        });
    }

    applyTheme(theme) {
        const html = document.documentElement;
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        // Aplicar tema apenas no elemento html (CORREÇÃO)
        html.classList.remove('light-theme', 'dark-theme');
        html.classList.add(`${theme}-theme`);
        
        // Update meta theme color
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#111827' : '#2c5282';
        }
    }

    // Enhanced Mobile Menu
    async initializeMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        const header = document.querySelector('.header');
        const body = document.body;

        if (!menuToggle || !mainNav) return;

        let isMenuOpen = false;

        const toggleMenu = () => {
            isMenuOpen = !isMenuOpen;
            
            menuToggle.setAttribute('aria-expanded', isMenuOpen);
            mainNav.classList.toggle('nav-open', isMenuOpen);
            header.classList.toggle('nav-open', isMenuOpen);
            body.classList.toggle('no-scroll', isMenuOpen);

            // Focus management
            if (isMenuOpen) {
                const firstLink = mainNav.querySelector('a');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        };

        menuToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking on links
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    toggleMenu();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                toggleMenu();
                menuToggle.focus();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !header.contains(e.target)) {
                toggleMenu();
            }
        });
    }

    // Advanced Scroll Effects
    async initializeScrollEffects() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class
            header.classList.toggle('scrolled', currentScrollY > 50);
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Enhanced Form Validation
    async initializeFormValidation() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        const nameInput = document.getElementById('name');
        const messageInput = document.getElementById('message');
        const submitButton = document.getElementById('submit-button');
        const nameError = document.getElementById('name-error');

        if (!nameInput || !submitButton) return;

        // Real-time validation
        const validateName = () => {
            const value = nameInput.value.trim();
            const isValid = value.length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(value);
            
            if (!isValid && value.length > 0) {
                nameError.textContent = 'Por favor, digite um nome válido (apenas letras).';
                nameInput.setAttribute('aria-invalid', 'true');
                return false;
            } else {
                nameError.textContent = '';
                nameInput.setAttribute('aria-invalid', 'false');
                return true;
            }
        };

        // Debounced validation
        nameInput.addEventListener('input', () => {
            this.debounce('nameValidation', validateName, 300);
        });

        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateName()) {
                nameInput.focus();
                return;
            }

            await this.handleFormSubmission(nameInput, messageInput, submitButton);
        });
    }

    async handleFormSubmission(nameInput, messageInput, submitButton) {
        try {
            // Show loading state
            submitButton.classList.add('loading');
            submitButton.disabled = true;

            const phoneNumber = "557191918331";
            const name = nameInput.value.trim();
            const message = messageInput.value.trim();

            let finalMessage = `Olá, Juliana! Meu nome é ${name}.`;
            finalMessage += message ? ` ${message}` : ' Gostaria de agendar uma consulta.';
            
            const encodedMessage = encodeURIComponent(finalMessage);
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Open WhatsApp
            window.open(whatsappURL, '_blank', 'noopener,noreferrer');
            
            // Show success message
            this.showSuccessMessage('Mensagem preparada! Você será redirecionado para o WhatsApp.');
            
            // Reset form
            nameInput.value = '';
            messageInput.value = '';
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 4000);
    }

    // Accessibility Enhancements
    async initializeAccessibility() {
        // Keyboard navigation detection
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Enhanced FAQ accessibility
        document.querySelectorAll('.faq-item').forEach(item => {
            const summary = item.querySelector('summary');
            if (summary) {
                summary.addEventListener('click', () => {
                    const isOpen = item.hasAttribute('open');
                    this.announceToScreenReader(
                        isOpen ? 'Pergunta fechada' : 'Pergunta aberta'
                    );
                });
            }
        });
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Lazy Loading System
    async initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });

            this.observers.set('images', imageObserver);
        }
    }

    loadImage(img) {
        return new Promise((resolve, reject) => {
            const newImg = new Image();
            newImg.onload = () => {
                img.src = newImg.src;
                img.classList.add('loaded');
                resolve();
            };
            newImg.onerror = reject;
            newImg.src = img.dataset.src || img.src;
        });
    }

    // Performance Optimizations
    async initializePerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Monitor performance
        this.monitorPerformance();
        
        // Optimize animations based on device capabilities
        this.optimizeAnimations();
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/img/juliana.webp',
            'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.includes('.webp') ? 'image' : 'style';
            document.head.appendChild(link);
        });
    }

    monitorPerformance() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    optimizeAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isLowEndDevice = navigator.hardwareConcurrency <= 2;
        
        if (prefersReducedMotion || isLowEndDevice) {
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
        }
    }

    // Utility Methods
    debounce(key, func, wait) {
        if (this.debounceTimers.has(key)) {
            clearTimeout(this.debounceTimers.get(key));
        }
        
        const timer = setTimeout(() => {
            func();
            this.debounceTimers.delete(key);
        }, wait);
        
        this.debounceTimers.set(key, timer);
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.observers.clear();
        this.debounceTimers.clear();
    }
}

// Initialize the application
const app = new LandingPageApp();

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause non-critical operations
        console.log('Page hidden - pausing operations');
    } else {
        // Resume operations
        console.log('Page visible - resuming operations');
    }
});

// Handle errors globally
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Could send to error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Could send to error tracking service
});

// Export for testing or external access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LandingPageApp;
}

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeInScale {
        from {
            transform: scale(0.9);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .no-scroll {
        overflow: hidden;
    }
    
    .in-view {
        opacity: 1;
        transform: translateY(0);
    }
    
    .loaded {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);