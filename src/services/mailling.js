import nodemailer  from 'nodemailer';
import config from '../config/config.js'

export const transport = nodemailer.createTransport({
    service: config.mailing.SERVICE,
    port: 5087,
    auth: {
      user: config.mailing.USER,
      pass: config.mailing.PASSWORD,
    },
  });
