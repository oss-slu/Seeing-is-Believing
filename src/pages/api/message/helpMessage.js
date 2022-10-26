import sendGridMail from '@sendgrid/mail';
const SENDGRID_API_KEY="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"
sendGridMail.setApiKey(SENDGRID_API_KEY);


export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
     /*  const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: req?.body?.items ?? [],
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&p=${req.body.items[0].price}`,
        cancel_url: `${req.headers.origin}/account/publish`,
      }); */
      const {to,from,subject,text,html}=req.body
      const message = {
			to,
			from,
			subject,
			text,
			html,
		};
     await sendGridMail.send(message); 
      res.status(200).json({ok:true});
    } catch (err) {
        console.log(err.message);
      res.status(500).json({ ok: false, message: err.message });
    }
  } else {
    console.log(err.message);
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}