document.addEventListener('DOMContentLoaded', function() {
    const banner = document.querySelector('.cookie-banner');
    const settingsPanel = document.getElementById('settings-panel');
    const overlay = document.getElementById('overlay');
    const acceptAllBtn = document.getElementById('accept-all');
    const changeSettingsBtn = document.getElementById('change-settings');
    const closeSettingsBtn = document.getElementById('close-settings');
    const saveSettingsBtn = document.getElementById('save-settings');
    
    const analyticsToggle = document.getElementById('analytics-toggle');
    const preferencesToggle = document.getElementById('preferences-toggle');
    const thirdpartyToggle = document.getElementById('thirdparty-toggle');
    const marketingToggle = document.getElementById('marketing-toggle');
    
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        if (!toggle.disabled) {
            toggle.addEventListener('change', function() {
                saveCookieSettings();
            });
        }
    });

    changeSettingsBtn.addEventListener('click', function() {
        settingsPanel.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    closeSettingsBtn.addEventListener('click', closeSettings);
    overlay.addEventListener('click', closeSettings);

    saveSettingsBtn.addEventListener('click', function() {
        saveCookieSettings();
        setBannerAccepted();
        closeSettings();
        banner.style.display = 'none';
    });

    acceptAllBtn.addEventListener('click', function() {
        analyticsToggle.checked = true;
        preferencesToggle.checked = true;
        thirdpartyToggle.checked = true;
        marketingToggle.checked = true;
        
        saveCookieSettings();
        setBannerAccepted();
        banner.style.display = 'none';
    });

    function closeSettings() {
        settingsPanel.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function saveCookieSettings() {
        const settings = {
            analytics: analyticsToggle.checked,
            preferences: preferencesToggle.checked,
            thirdparty: thirdpartyToggle.checked,
            marketing: marketingToggle.checked
        };
        
        localStorage.setItem('cookieSettings', JSON.stringify(settings));
    }

    function loadCookieSettings() {
        const savedSettings = localStorage.getItem('cookieSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            analyticsToggle.checked = settings.analytics;
            preferencesToggle.checked = settings.preferences;
            thirdpartyToggle.checked = settings.thirdparty;
            marketingToggle.checked = settings.marketing;
        }
    }

    function setBannerAccepted() {
        localStorage.setItem('bannerAccepted', 'true');
    }

    function checkBannerAccepted() {
        return localStorage.getItem('bannerAccepted') === 'true';
    }

    function initCookieBanner() {
        loadCookieSettings();
        
        if (checkBannerAccepted()) {
            banner.style.display = 'none';
        } else {
            banner.style.display = 'block';
        }
    }

    initCookieBanner();
});

document.getElementById("settingsPannelOpener").addEventListener("click", function() {
    document.getElementById("settings-panel").style.display = "block";
    document.getElementById("overlay").style.display = "block";
});