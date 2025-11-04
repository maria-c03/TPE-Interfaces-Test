const carousel = document.querySelector('.mobile-cards');
const cardsMovile = document.querySelectorAll('.img-card');
let index = 0;

setInterval(() => {
    index = (index + 1) % cardsMovile.length;
    const scrollX = index * carousel.clientWidth;
    carousel.scrollTo({ left: scrollX, behavior: 'smooth' });
}, 5000); // cambia cada 5s
