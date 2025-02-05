function detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipod|android.*mobile|windows phone/.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/.test(userAgent);
    
    if (isMobile) {
        return "mobile";
    } else if (isTablet) {
        return "tablet";
    } else {
        return "desktop";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const deviceType = detectDevice();
    
    document.getElementById("mobile").style.display = deviceType === "mobile" ? "block" : "none";
    document.getElementById("desktop").style.display = deviceType === "tablet" ? "block" : "none";
    document.getElementById("desktop").style.display = deviceType === "desktop" ? "block" : "none";
});

console.log("set-userdevice=" + detectDevice());