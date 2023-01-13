const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items, promocode) => {
  let price = 25;
  if (promocode === "NEW YEAR") {
    price = 25 * 0.6;
  }
  let quantity = items[0].quantity;
  return quantity * price;
};

export default async function handler(req, res) {
  const { items, promocode } = req.body;
  const calculatedAmount = calculateOrderAmount(items, promocode);
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculatedAmount(60, promocode),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    paymentIntent,
    clientSecret: paymentIntent.client_secret,
  });
}
