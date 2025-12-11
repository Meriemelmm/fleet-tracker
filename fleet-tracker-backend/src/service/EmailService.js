import createTransporter from '../config/emailConfig.js';

class EmailService {
  async sendChauffeurWelcomeEmail(chauffeurData) {
    try {
      console.log('🚀 Tentative envoi email à:', chauffeurData.email);
      
      const transporter = createTransporter();
      
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: chauffeurData.email,
        subject: 'Bienvenue - Vos identifiants Fleet Tracker',
        html: `
          <h2>Bienvenue ${chauffeurData.name}</h2>
          <p>Votre compte a été créé :</p>
          <p><strong>Email :</strong> ${chauffeurData.email}</p>
          <p><strong>Mot de passe :</strong> ${chauffeurData.tempPassword}</p>
          <p><a href="${process.env.FRONTEND_URL}/login">Se connecter</a></p>
        `
      };

      console.log('📧 Configuration email:', {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        to: chauffeurData.email
      });

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Email envoyé avec succès:', result.messageId);
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur email complète:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();
