
// --- IMPLEMENTACIÓN DETALLADA ---
// Este archivo simula ser un servicio de notificaciones.
// En una aplicación real, este módulo contendría la lógica para conectarse con un
// servicio externo como Firebase Cloud Messaging (FCM) o similar.
// Aquí, simplemente imprimimos un mensaje en la consola para demostrar que el servicio
// fue llamado desde el controlador de transacciones, manteniendo la lógica desacoplada.

class NotificationService {
  /**
   * Simula la programación de un recordatorio para que el usuario añada más detalles a una transacción.
   * @param {number} userId - El ID del usuario que recibirá la notificación.
   * @param {number} transactionId - El ID de la transacción a la que se refiere el recordatorio.
   */
  scheduleReminder(userId, transactionId) {
    console.log(`[NotificationService]: Scheduling a reminder for user ${userId} to add details to transaction ${transactionId}.`);

    // Lógica real de FCM iría aquí. Por ejemplo:
    // const message = {
    //   notification: {
    //     title: 'Complete your transaction!',
    //     body: 'Do you want to add notes or details to the expense you just registered?'
    //   },
    //   token: userDeviceToken // Se necesitaría obtener el token del dispositivo del usuario
    // };
    //
    // fcm.send(message)
    //   .then(response => console.log('Successfully sent message:', response))
    //   .catch(error => console.log('Error sending message:', error));

    console.log('[NotificationService]: Reminder scheduled successfully (simulation).');
  }
}

// Exportamos una única instancia del servicio (patrón Singleton)
module.exports = new NotificationService();
