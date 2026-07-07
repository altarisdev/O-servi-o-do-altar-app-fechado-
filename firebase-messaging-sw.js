importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configurações do seu projeto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCwPeLrAtNEO41MZ3yxSuYib2LC0z2dv9U",
    authDomain: "tarcisius-d03d7.firebaseapp.com",
    projectId: "tarcisius-d03d7",
    storageBucket: "tarcisius-d03d7.firebasestorage.app",
    messagingSenderId: "186797936591",
    appId: "1:186797936591:web:72c81c54fb7c1905c1ccba"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Captura e exibe a notificação recebida em segundo plano
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Mensagem recebida em segundo plano: ', payload);

    const notificationTitle = payload.notification?.title || 'Altaris - Nova Escala';
    const notificationOptions = {
        body: payload.notification?.body || 'Você possui uma nova atualização na sua escala.',
        data: {
            // CORREÇÃO: Usando self em vez de window para evitar erros em segundo plano
            url: self.location.origin 
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Listener para abrir o site correto quando o usuário clicar na notificação push do celular
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data?.url || self.location.origin;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
