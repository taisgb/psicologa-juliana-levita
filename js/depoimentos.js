// --- INICIALIZAÇÃO DO CARROSSEL DE DEPOIMENTOS ---
document.addEventListener("DOMContentLoaded", () => {
    if (window.jQuery) {
        $('.testimonials-carousel').slick({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,         
            slidesToScroll: 1,     
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: true,
            arrows: true, // Mostrar setas por padrão
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        arrows: true // Manter setas em tablets
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        arrows: false, // Esconder setas em mobile
                        touchThreshold: 5, // Sensibilidade do toque
                        swipeToSlide: true, // Permite deslizar para qualquer slide
                        draggable: true // Habilita arrastar
                    }
                }
            ]
        });
    }
});