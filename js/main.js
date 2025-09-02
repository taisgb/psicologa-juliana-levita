document.addEventListener("DOMContentLoaded", () => {
    // 1. INICIALIZAÇÃO DE ANIMAÇÕES (AOS)
    if (typeof AOS !== "undefined") {
        AOS.init({
            once: true,
            duration: 800,
            offset: 100,
            easing: "ease-out-cubic",
            disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        });
    }

    // 2. MODO ESCURO (DARK MODE)
    const themeToggle = document.getElementById("theme-toggle");
    const htmlElement = document.documentElement;

    const applyTheme = (theme) => {
        htmlElement.classList.remove("light-theme", "dark-theme");
        htmlElement.classList.add(`${theme}-theme`);
    };

    themeToggle.addEventListener("click", () => {
        const currentTheme = htmlElement.classList.contains("dark-theme") ? "dark" : "light";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    });

    // 3. MENU MOBILE
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");
    const header = document.querySelector(".header");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", !isExpanded);
            mainNav.classList.toggle("nav-open");
            header.classList.toggle("nav-open");
            document.body.classList.toggle("no-scroll");
        });

        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                if (mainNav.classList.contains("nav-open")) {
                    menuToggle.setAttribute("aria-expanded", "false");
                    mainNav.classList.remove("nav-open");
                    header.classList.remove("nav-open");
                    document.body.classList.remove("no-scroll");
                }
            });
        });
    }

    // 4. EFEITO DO HEADER AO ROLAR A PÁGINA
    let ticking = false;
    const updateHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        ticking = false;
    };

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // 5. VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        const nameInput = document.getElementById("name");
        const nameError = document.getElementById("name-error");
        const submitButton = document.getElementById("submit-button");

        const validateForm = () => {
            let isValid = true;
            if (nameInput.value.trim().length < 2) {
                nameError.textContent = "Por favor, digite um nome válido.";
                nameInput.setAttribute("aria-invalid", "true");
                isValid = false;
            } else {
                nameError.textContent = "";
                nameInput.setAttribute("aria-invalid", "false");
            }
            return isValid;
        };

        nameInput.addEventListener("input", validateForm);

        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!validateForm()) {
                nameInput.focus();
                return;
            }

            const phoneNumber = "557191918331";
            const name = nameInput.value.trim();
            const message = document.getElementById("message").value.trim();
            
            submitButton.classList.add('loading');
            submitButton.disabled = true;

            setTimeout(() => {
                let finalMessage = `Olá, Juliana! Meu nome é ${name}.`;
                finalMessage += message ? ` ${message}` : " Gostaria de agendar uma consulta.";
                
                const encodedMessage = encodeURIComponent(finalMessage);
                const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
                
                window.open(whatsappURL, "_blank", "noopener,noreferrer");

                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                contactForm.reset();
            }, 1000);
        });
    }

    // 6. DETECÇÃO DE NAVEGAÇÃO POR TECLADO PARA ACESSIBILIDADE
    document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            document.body.classList.add("keyboard-navigation");
        }
    });
    document.addEventListener("mousedown", () => {
        document.body.classList.remove("keyboard-navigation");
    });
});