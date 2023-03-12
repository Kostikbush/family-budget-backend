const nodemailer = require("nodemailer");
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendActivetionMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Активация аккаунта на " + process.env.API_URL,
      text: "",
      html: `
        <div>
          <h1>Для активации пройдите по ссыдлке</h1>
          <span>${link}</span>
          <a href=${link}></a>
        </div>
      `,
    });
  }
  async sendAlertMail(to, from) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Уведомление",
      text: "",
      html: `
        <div>
          <h1>У вас уведомление от пользователя ${from}</h1>
        </div>
      `,
    });
  }
  async sendAnserMail(to, from, anser) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Уведомление",
      text: "",
      html: `
        <div>
          <h1>Поьзователь ${from} ответил ${anser}</h1>
        </div>
      `,
    });
  }
}

module.exports = new MailService();
