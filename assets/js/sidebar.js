document.addEventListener('DOMContentLoaded', function() {
  const categoryLinks = document.querySelectorAll('.category-link');

  categoryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const parentLi = this.closest('.category-item');
      const postList = parentLi.querySelector('.post-list-in-category');

      // Toggle active class on the parent li
      parentLi.classList.toggle('active');

      // Toggle max-height for smooth animation
      if (postList.style.maxHeight) {
        postList.style.maxHeight = null;
      } else {
        postList.style.maxHeight = postList.scrollHeight + 'px';
      }
    });
  });

  // Tooltip functionality for truncated post titles
  const postTitles = document.querySelectorAll('.post-list-in-category a');
  const tooltip = document.createElement('div');
  tooltip.className = 'custom-tooltip';
  document.body.appendChild(tooltip);

  postTitles.forEach(titleLink => {
    if (titleLink.scrollWidth > titleLink.clientWidth) { // Check if text is truncated
      titleLink.addEventListener('mouseover', function(e) {
        tooltip.textContent = this.dataset.fullTitle;
        tooltip.classList.add('show');
        // Position the tooltip
        tooltip.style.left = (e.pageX + 10) + 'px';
        tooltip.style.top = (e.pageY + 10) + 'px';
      });

      titleLink.addEventListener('mousemove', function(e) {
        tooltip.style.left = (e.pageX + 10) + 'px';
        tooltip.style.top = (e.pageY + 10) + 'px';
      });

      titleLink.addEventListener('mouseout', function() {
        tooltip.classList.remove('show');
      });
    }
  });

  // Sidebar toggle functionality
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const body = document.body;

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('is-open');
      // 본문 스크롤 방지
      if (sidebar.classList.contains('is-open')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });

    // Close sidebar when clicking outside (optional, but good for UX)
    document.addEventListener('click', function(event) {
      if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target) && sidebar.classList.contains('is-open')) {
        sidebar.classList.remove('is-open');
        body.style.overflow = '';
      }
      // Close sidebar when a link inside is clicked (optional, for better mobile UX)
      if (sidebar.contains(event.target) && event.target.tagName === 'A' && sidebar.classList.contains('is-open')) {
        sidebar.classList.remove('is-open');
        body.style.overflow = '';
      }
    });
  }
});
