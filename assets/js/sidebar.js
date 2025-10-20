document.addEventListener('DOMContentLoaded', () => {
  const categoryLinks = document.querySelectorAll('.category-link');

  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const item = link.parentElement;
      item.classList.toggle('active');
    });
  });
});
