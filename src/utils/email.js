import emailjs from '@emailjs/browser';

//Email JS Configuration with keys

const emailjsConfig = {
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  blockHeadless: true,
  limitRate: {
    id: 'app',
    throttle: 10000,
  },
};

emailjs.init(emailjsConfig);

export default emailjs;
