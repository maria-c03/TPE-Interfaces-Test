const cards = document.querySelectorAll('.img-card');

cards.forEach(card => {
  card.addEventListener('click', () => {
    // guardo las clases actuales
    let center = document.querySelector('.img-card.center');
    let left = document.querySelector('.img-card.left');
    let right = document.querySelector('.img-card.right');

    if (card.classList.contains('left')) {
      // izquierda pasa al centro
      card.classList.replace('left', 'center');
      center.classList.replace('center', 'right');
      right.classList.replace('right', 'left');
    } else if (card.classList.contains('right')) {
      // derecha pasa al centro
      card.classList.replace('right', 'center');
      center.classList.replace('center', 'left');
      left.classList.replace('left', 'right');
    }
  });
});
