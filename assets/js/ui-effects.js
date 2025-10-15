document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('.scene');
  const terminal = document.querySelector('.mac-terminal');
  const input = document.getElementById('terminal-input');

  // --- Parallax Effect ---
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (scene && !isTouchDevice) {
    const root = document.documentElement;
    root.addEventListener('mousemove', e => {
      const rect = scene.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      scene.style.transform = `perspective(1200px) rotateY(${x * 2}deg) rotateX(${-y * 2}deg)`;
    });
    root.addEventListener('mouseleave', () => {
      scene.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
    });
  }

  // --- Active Glow on Input Focus ---
  if (terminal && input) {
    input.addEventListener('focus', () => {
      terminal.classList.add('active');
    });
    input.addEventListener('blur', () => {
      terminal.classList.remove('active');
    });
  }
});
