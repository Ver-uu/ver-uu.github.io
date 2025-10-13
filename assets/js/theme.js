// assets/js/theme.js

/**
 * Switches the site's theme and saves the preference to localStorage.
 * @param {string} theme - The theme to switch to, either 'light' or 'dark'.
 */
export function switchTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') {
    console.error(`Invalid theme: ${theme}`);
    return;
  }

  // Set the data-theme attribute on the <html> element
  document.documentElement.setAttribute('data-theme', theme);

  // Save the user's preference to localStorage
  localStorage.setItem('theme', theme);
}
