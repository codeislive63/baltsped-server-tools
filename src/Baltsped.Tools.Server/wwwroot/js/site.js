document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const appSidebar = document.getElementById("appSidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarIconOpen = document.getElementById("sidebarIconOpen");
    const sidebarIconClosed = document.getElementById("sidebarIconClosed");
    const themeSwitch = document.getElementById("themeSwitch");
    const themeSwitchText = document.getElementById("themeSwitchText");
    const themeSun = document.getElementById("themeSun");
    const themeMoon = document.getElementById("themeMoon");

    const themeStorageKey = "baltsped.theme";
    const sidebarStorageKey = "baltsped.sidebar.collapsed";

    function applyTheme(theme) {
        const isLight = theme === "light";
        root.classList.toggle("light", isLight);

        if (themeSwitchText) {
            themeSwitchText.textContent = isLight ? "Тёмная тема" : "Светлая тема";
        }

        themeSun?.classList.toggle("hidden", isLight);
        themeMoon?.classList.toggle("hidden", !isLight);
        localStorage.setItem(themeStorageKey, theme);
    }

    function applySidebarState(isCollapsed) {
        appSidebar?.classList.toggle("is-collapsed", isCollapsed);
        sidebarIconOpen?.classList.toggle("hidden", isCollapsed);
        sidebarIconClosed?.classList.toggle("hidden", !isCollapsed);
        localStorage.setItem(sidebarStorageKey, String(isCollapsed));
    }

    applyTheme(localStorage.getItem(themeStorageKey) === "light" ? "light" : "dark");
    applySidebarState(localStorage.getItem(sidebarStorageKey) === "true");

    themeSwitch?.addEventListener("click", function () {
        const isLight = root.classList.contains("light");
        applyTheme(isLight ? "dark" : "light");
    });

    sidebarToggle?.addEventListener("click", function () {
        const isCollapsed = appSidebar?.classList.contains("is-collapsed");
        applySidebarState(!isCollapsed);
    });
});
