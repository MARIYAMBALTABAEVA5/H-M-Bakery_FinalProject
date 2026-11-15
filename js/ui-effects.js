// Shared theme, account links, and subtle button feedback for every bakery page.
(() => {
    const themeKey = 'hmBakeryTheme';
    let savedTheme = 'light';
    try {
        savedTheme = localStorage.getItem(themeKey) === 'dark' ? 'dark' : 'light';
    } catch (error) {
        console.info('Theme preference is unavailable in this browser.');
    }

    document.documentElement.dataset.theme = savedTheme;

    document.addEventListener('DOMContentLoaded', () => {
        const nav = document.querySelector('.bakery-navbar .navbar-nav');
        if (nav && !document.querySelector('#theme-toggle')) {
            const accountItem = document.createElement('li');
            accountItem.className = 'nav-item';
            accountItem.innerHTML = '<a class="nav-link" href="login.html">Account</a>';
            nav.append(accountItem);

            const themeItem = document.createElement('li');
            themeItem.className = 'nav-item';
            themeItem.innerHTML = '<button class="nav-link theme-toggle" id="theme-toggle" type="button" aria-pressed="false"></button>';
            nav.append(themeItem);
        }

        const toggle = document.querySelector('#theme-toggle');
        const syncLabel = () => {
            const dark = document.documentElement.dataset.theme === 'dark';
            if (!toggle) return;
            toggle.textContent = dark ? '☀ Light' : '☾ Dark';
            toggle.setAttribute('aria-pressed', String(dark));
            toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
        };
        syncLabel();
        document.addEventListener('hmBakeryThemeChange', syncLabel);

        toggle?.addEventListener('click', () => {
            const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = next;
            try { localStorage.setItem(themeKey, next); } catch (error) { /* Keep current-page theme active. */ }
            syncLabel();
        });

        document.addEventListener('click', event => {
            const button = event.target.closest('.btn, button:not(.navbar-toggler)');
            if (!button || button.disabled || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height) * 1.6;
            ripple.className = 'bakery-ripple';
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${event.clientX - rect.left - size / 2}px;top:${event.clientY - rect.top - size / 2}px`;
            if (getComputedStyle(button).position === 'static') button.style.position = 'relative';
            button.append(ripple);
            ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        });
    });
})();
