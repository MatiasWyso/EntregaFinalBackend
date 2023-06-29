import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  persistence: process.env.PERSISTENCE,
  cookieSecret: process.env.COOKIE_SECRET,
  enviorment: process.env.ENVIORMENT,
  mailing:{
    SERVICE: process.env.MAILING_SERVICE,
    USER: process.env.MAILING_USER,
    PASSWORD: process.env.MAILING_PASSWORD
}
};
