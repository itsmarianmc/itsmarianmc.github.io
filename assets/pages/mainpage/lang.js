const lang = navigator.language || navigator.userLanguage;
const overlay = document.getElementById('languageOverlay');
const buttons = overlay.querySelectorAll('.lang-overlay-button');
const disableBtn = overlay.querySelector("#disableLangSwitch");
const switchBtn = overlay.querySelector("#langSwitch");

if (overlay) {
    if (lang.startsWith('de')) {
        if (localStorage.getItem("disableLangSwitch") === "true") {
            overlay.remove();
        } else {
            overlay.style.display = "flex"; 
            
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    overlay.style.animation = 'fadeOut 0.3s forwards';
                    setTimeout(() => overlay.remove(), 300);
                });
            });
            
            switchBtn.addEventListener("click", function() {
                window.open("/de", "_parent");
            });

            disableBtn.addEventListener("click", function() {
                localStorage.setItem("disableLangSwitch", "true");
            });
        }
    } else {
        overlay.remove();
    }
}