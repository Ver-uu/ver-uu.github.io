document.addEventListener('DOMContentLoaded', () => {
  const categoryLinks = document.querySelectorAll('.category-link');
  const postLinksInCategories = document.querySelectorAll('.post-list-in-category a');
  let tooltip = null;

  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const item = link.parentElement;
      item.classList.toggle('active');
    });
  });

  postLinksInCategories.forEach(link => {
    link.addEventListener('mouseover', (e) => {
      const fullTitle = link.dataset.fullTitle;
      if (fullTitle && link.offsetWidth < link.scrollWidth) { // Check if text is actually truncated
        tooltip = document.createElement('div');
        tooltip.classList.add('custom-tooltip');
        tooltip.textContent = fullTitle;
        document.body.appendChild(tooltip);
        
        const rect = link.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`; // Position above link
        tooltip.classList.add('show');
      }
    });

    link.addEventListener('mouseout', () => {
      if (tooltip) {
        tooltip.classList.remove('show');
        tooltip.remove();
        tooltip = null;
      }
    });
  });
});
