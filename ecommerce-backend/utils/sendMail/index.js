import nodeMailer from "nodemailer";
import {
  SMTP_MAIL,
  SMTP_PASSWORD,
  SMTP_HOST,
  SMTP_PORT
} from "../../config/appConfig";

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_MAIL,
      pass: SMTP_PASSWORD
    }
  });

  const mailOptions = {
    from: "",
    to: options.email,
    subject: options.subject,
    text: options.Message
  };
  transporter.sendMail(mailOptions);
};

export { sendEmail };
