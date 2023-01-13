const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { paymentId } = req.body;
  console.log("requesting payment intent for paymentId: ", paymentId);
  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    console.log("paymentIntent: ", paymentIntent.id);
    res.status(200).send({
      paymentIntent: paymentIntent,
    });

  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      error: error,
    });
  }
}
