const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // ¡Usa la App Password!
  },
});

const sendWelcomeEmail = async (toEmail, username) => {
  try {
    const info = await transporter.sendMail({
      from: `"GastanGO Finanzas" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: '¡Bienvenido a GastanGO!',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h1 style="color: #2563EB;">¡Hola, ${username}!</h1>
          <p>Gracias por registrarte en <strong>GastanGO</strong> usando tu cuenta de Google.</p>
          <p>Tu cuenta ha sido verificada automaticamente y ya puedes empezar a gestionar tus gastos.</p>
          <br>
          <p style="font-size: 12px; color: #777;">Si no fuiste tú, ignora este mensaje.</p>
        </div>
      `,
    });
    console.log('Correo enviado ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error enviando correo:', error);
    return false;
  }
};

module.exports = { sendWelcomeEmail };