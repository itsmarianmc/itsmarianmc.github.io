document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        console.log('%cWARNING!', 'color: red; font-size: 30px; font-weight: bold;');
        console.log('%cThis is a browser feature intended for developers and debuggers only and may contain sensitive links and information about you, your data, account/s, device and browser. \nScammers have been known to encourage people to copy and/or paste information or run commands on the command line to hack accounts or access sensitive data. If you do not know what you are doing, do not proceed and close the debug menu! \nThe information that is/will be visible above and below this text is only for the development and improvement of the site and helps to find and fix bugs and other problems in JavaScript faster. \nAs this is a website related to, created, designed and managed by Projekt City please visit the folowing adress for more information: https://projektcity.github.io/helpcenter/debug-menu', 'color: red; font-size: 12.5px;');
    }, 250);
})

function getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent)) {
       return "mobile";
    } else {
        return "desktop";
    }
}

function getBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") > -1) {
        return "mf_mozilla-firefox";
    } else if (userAgent.indexOf("SamsungBrowser") > -1) {
        return "si_samsung-internet";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
        return "op_opera";
    } else if (userAgent.indexOf("Trident") > -1) {
        return "ie_internet-Explorer";
    } else if (userAgent.indexOf("Edge") > -1) {
        return "me_microsoft-edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
        return "gc_google-chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
        return "as_apple-safari";
    } else {
        return "uk_unknown";
    }
}

const deviceType = getDeviceType();
const browser = getBrowser();

console.log(`get-userdevice=${deviceType}`);
console.log(`get-userbrowser=${browser}`);