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

    let themeSwitchTimer;

    function beginThemeTransition() {
        root.classList.add("theme-switching");
        window.clearTimeout(themeSwitchTimer);
        themeSwitchTimer = window.setTimeout(function () {
            root.classList.remove("theme-switching");
        }, 320);
    }

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
        if (!appSidebar) {
            return;
        }

        // Width/state toggle kept in JS so it works even if Tailwind build is stale.
        appSidebar.classList.toggle("is-collapsed", isCollapsed);
        appSidebar.classList.toggle("w-64", !isCollapsed);
        appSidebar.classList.toggle("w-20", isCollapsed);

        appSidebar.querySelectorAll(".sidebar-label").forEach(function (el) {
            el.classList.toggle("hidden", isCollapsed);
        });

        appSidebar.querySelectorAll(".sidebar-logo-open").forEach(function (el) {
            el.classList.toggle("hidden", isCollapsed);
        });

        appSidebar.querySelectorAll(".sidebar-profile").forEach(function (el) {
            el.classList.toggle("justify-center", isCollapsed);
            el.classList.toggle("px-0", isCollapsed);
            el.classList.toggle("px-2", !isCollapsed);
        });

        sidebarToggle?.setAttribute("aria-expanded", String(!isCollapsed));
        sidebarIconOpen?.classList.toggle("hidden", isCollapsed);
        sidebarIconClosed?.classList.toggle("hidden", !isCollapsed);

        localStorage.setItem(sidebarStorageKey, String(isCollapsed));
    }

    applyTheme(localStorage.getItem(themeStorageKey) === "light" ? "light" : "dark");
    applySidebarState(localStorage.getItem(sidebarStorageKey) === "true");

    themeSwitch?.addEventListener("click", function () {
        const isLight = root.classList.contains("light");
        beginThemeTransition();
        applyTheme(isLight ? "dark" : "light");
    });

    sidebarToggle?.addEventListener("click", function () {
        const isCollapsed = appSidebar?.classList.contains("is-collapsed") ?? false;
        applySidebarState(!isCollapsed);
    });
});
