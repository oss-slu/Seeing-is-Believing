import emailjs from '@emailjs/browser';

const emailjsConfig = {
  publicKey: 'S8pa-Nt77zDWp6vNu',
  blockHeadless: true,
  limitRate: {
    id: 'app',
    throttle: 10000,
  },
};

emailjs.init(emailjsConfig);

export default emailjs;
