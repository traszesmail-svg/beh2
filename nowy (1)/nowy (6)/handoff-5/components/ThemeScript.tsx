// handoff-5/components/ThemeScript.tsx
// Inline script wstawiany do <head> PRZED hydration
// Zapobiega "flash of unstyled content" — ustawia .dark zanim React się zhydratuje

export function ThemeScript() {
  const code = `
(function() {
  try {
    var stored = localStorage.getItem('regulski-theme');
    var theme = stored || 'system';
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = theme === 'dark' || (theme === 'system' && systemDark);
    if (isDark) document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  } catch(e) {}
})();
  `.trim();

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
