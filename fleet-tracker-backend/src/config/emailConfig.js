import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    tls: {
      rejectUnauthorized: false
    }
  });
};

export default createTransporter;