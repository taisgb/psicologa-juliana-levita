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
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                    }
                }
            ]
        });
    }
});