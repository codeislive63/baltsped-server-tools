document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const appShell = document.getElementById("appShell");
    const appSidebar = document.getElementById("appSidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const themeSwitch = document.getElementById("themeSwitch");
    const themeSwitchText = document.getElementById("themeSwitchText");

    const themeStorageKey = "baltsped.theme";
    const sidebarStorageKey = "baltsped.sidebar.collapsed";

    function applyTheme(theme) {
        body.classList.remove("theme-dark", "theme-light");
        body.classList.add(theme === "light" ? "theme-light" : "theme-dark");

        if (themeSwitchText) {
            themeSwitchText.textContent = theme === "dark"
                ? "Светлая тема"
                : "Тёмная тема";
        }

        localStorage.setItem(themeStorageKey, theme);
    }

    function applySidebarState(isCollapsed) {
        if (!appShell) {
            return;
        }

        appShell.classList.toggle("is-sidebar-collapsed", isCollapsed);

        if (appSidebar) {
            appSidebar.setAttribute("aria-expanded", (!isCollapsed).toString());
        }

        localStorage.setItem(sidebarStorageKey, String(isCollapsed));
    }

    const savedTheme = localStorage.getItem(themeStorageKey);
    applyTheme(savedTheme === "light" ? "light" : "dark");

    const savedSidebarState = localStorage.getItem(sidebarStorageKey) === "true";
    applySidebarState(savedSidebarState);

    if (themeSwitch) {
        themeSwitch.addEventListener("click", function () {
            const isDark = body.classList.contains("theme-dark");
            applyTheme(isDark ? "light" : "dark");
        });
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", function () {
            const isCollapsed = appShell?.classList.contains("is-sidebar-collapsed");
            applySidebarState(!isCollapsed);
        });
    }
});
