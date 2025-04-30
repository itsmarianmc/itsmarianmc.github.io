// Berechtigungsanfrage für Benachrichtigungen
function requestNotificationPermission() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Berechtigung für Benachrichtigungen erteilt!");
            } else {
                console.log("Benachrichtigungen abgelehnt.");
            }
        });
    }
}

// Funktion zum Anzeigen einer Benachrichtigung
function showNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body: body,
            icon: "favicon.png", // Dein Icon
        });
    } else {
        console.log("Benachrichtigungen wurden abgelehnt.");
    }
}

// Berechtigungsanfrage einmal ausführen
requestNotificationPermission();

// Alle 60 Minuten (3600000 ms) eine zufällige Benachrichtigung senden
setInterval(() => {
    const randomMessages = [
        "Trink Wasser für deine Gesundheit!",
        "Hast du schon heute genug getrunken?",
        "Denke daran, regelmäßig Wasser zu trinken!",
        "Gut Hydration ist der Schlüssel zu Wohlbefinden!"
    ];
    const message = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    showNotification("HydroTracker", message);
}, 3600000); // Alle 1 Stunde
