// Funktion zur Registrierung des Service Workers und Subscription für Push-Benachrichtigungen
async function subscribeUser() {
    const register = await navigator.serviceWorker.register("/projects/hydrotrack/service-worker.js");

    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    // Sende die Subscription an dein Backend (Vercel)
    await fetch("https://push-backend-vercel.vercel.app/api/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "Content-Type": "application/json"
        }
    });

    console.log("Subscription saved:", subscription);
}

// Hilfsfunktion, um den VAPID-Schlüssel zu konvertieren
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return new Uint8Array([...rawData].map(c => c.charCodeAt(0)));
}

// Funktion zum Senden einer Push-Benachrichtigung über das Backend
async function sendPushNotification(message) {
    await fetch("https://push-backend-vercel.vercel.app/api/send", {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: { "Content-Type": "application/json" }
    });
    console.log("Push sent:", message);
}

// Laden von Nachrichten aus der 'notifications.json' Datei
let messages = [];
async function loadMessages() {
    try {
        const response = await fetch('notifications.json');
        messages = await response.json();
    } catch (error) {
        console.error("Fehler beim Laden der Nachrichten:", error);
    }
}

// Zufällige Nachricht aus der geladenen Liste auswählen
function getRandomMessage() {
    if (messages.length === 0) return "Zeit, Wasser zu trinken! 💧";
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

// Funktion zum Senden der Benachrichtigung
async function sendNotification() {
    const message = getRandomMessage();
    
    // Senden der Nachricht an das Backend, um Push-Benachrichtigung zu verschicken
    await sendPushNotification(message);
}

// Benachrichtigungen alle 2 Stunden senden
setInterval(sendNotification, 2 * 60 * 60 * 1000);

// Test: Nach 5 Sekunden eine Nachricht senden
loadMessages().then(() => {
    setTimeout(sendNotification, 5000);
});

// Button zum Abonnieren der Push-Benachrichtigungen
document.getElementById("subscribeButton").addEventListener("click", function() {
    subscribeUser();
});
