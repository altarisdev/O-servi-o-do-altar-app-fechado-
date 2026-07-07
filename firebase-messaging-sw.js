// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configurações idênticas às do seu site
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

    const notificationTitle = payload.notification.title || 'Altaris - Nova Escala';
    const notificationOptions = {
        body: payload.notification.body || 'Você possui uma nova atualização na sua escala.',
        icon: '/img/church-icon.png', // Substitua pelo ícone do seu painel se houver
        badge: '/img/badge-icon.png', // Ícone pequeno para barra de status do celular
        data: {
            url: window.location.origin // Leva o usuário para o site ao clicar
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
