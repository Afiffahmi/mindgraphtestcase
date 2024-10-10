const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const stripe = Stripe(
  "sk_test_51Q7vJgAXiCTdCsj7Ifaxczubr2RovQkl1M8np290UwB1R6482kZLcMdcwoe7TuPVtTRQiYvy8mj361T4RcR2tEfn00umwv8S75"
);

app.use(cors());
app.use(bodyParser.json());

// Test route that logs "Hello World"
app.post("/hello-world", (req, res) => {
  console.log("Hello World");
  res.send({ message: "Hello World Logged" });
});

app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-06-20" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log(paymentIntent);
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.od,
      publishableKey:
        "sk_test_51Q7vJgAXiCTdCsj7Ifaxczubr2RovQkl1M8np290UwB1R6482kZLcMdcwoe7TuPVtTRQiYvy8mj361T4RcR2tEfn00umwv8S75",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
