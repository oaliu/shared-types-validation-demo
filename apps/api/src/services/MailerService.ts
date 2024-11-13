import nodemailer from "nodemailer";
import nodemailerExpressHandlebars from "nodemailer-express-handlebars";
import path from "path";

import env from "@/config/envConfig.js";
import logger from "@/config/logger.js";

interface HandlebarsMailOptions extends nodemailer.SendMailOptions {
  template: string;
  context: object;
}

export interface MailerServiceOptions {
  to: string;
  subject: string;
  template: string;
  context: object;
}

class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });

    this.transporter.use(
      "compile",
      nodemailerExpressHandlebars({
        viewEngine: {
          extname: ".hbs",
          partialsDir: path.resolve("src/views/emails/partials"),
          defaultLayout: "src/views/emails/base",
        },
        viewPath: path.resolve("src/views/emails"),
        extName: ".hbs",
      }),
    );
  }

  public async sendMail(options: MailerServiceOptions): Promise<void> {
    const { to, subject, template, context } = options;

    const mailOptions: HandlebarsMailOptions = {
      from: env.EMAIL_FROM,
      to,
      subject,
      template,
      context,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      logger.error(error);
    }
  }
}

export default new MailerService();
