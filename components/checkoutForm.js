import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsFillPatchCheckFill } from "react-icons/bs";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting");

    if (!stripe || !elements) {
      console.log("shit's fucked 1");
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `https://tattoojenny.com/payment-confirmation`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      console.log("shit's fucked 2");
      setMessage(error.message);
    } else {
      console.log("shit's fucked 3");
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <br />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <Button sx={{ outline: `2px solid green` }}>
          {isLoading ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            <Box sx={{display: `flex`, gap: `1rem`}}>
              <BsFillPatchCheckFill style={{transform: `translateY(0)`, color: `green`}} size={20}/> <Text>Pay Now</Text>
            </Box>
          )}
        </Button>
      </button>
      {/* Show any error or success messages */}
      {message && (
        <Box
          id="payment-message"
          sx={{
            padding: `1rem`,
            margin: `1rem auto`,
            backgroundColor: `rgba(0,0,0,0.2)`,
            outline: `2px solid orange`,
          }}
        >
          {message}
        </Box>
      )}
    </form>
  );
}
