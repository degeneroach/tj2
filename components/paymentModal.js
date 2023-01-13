import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import axios from "axios";

import toast from "react-hot-toast";
import { useModalContext } from "../context/ModalContext";

import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkoutForm";
import { BsShieldLockFill } from "react-icons/bs";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function PaymentModal(props) {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const { shouldShowPaymentModal, setShouldShowPaymentModal } =
    useModalContext();

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promocode, setPromocode] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [amountOfCredits, setAmountOfCredits] = useState(60);
  const [price, setPrice] = useState(8.33);

  const getPaymentIntent = async () => {
    // IFF user is passing a promocode, first check what promocodes a user has used
    if (promocode !== "") {
      try {
        if (user.used_promocodes) {
          const promocodes = user.used_promocodes;
          if (promocodes.includes(promocode)) {
            toast.error("You have already used this promocode");
            throw new Error("User has already used this promocode");
          }
        } else {
          // user has never used a promocode
          // instatiate their object
          const { data: updatePromocodeData, error: updatePromocodeError } =
            await supabaseClient
              .from("tattoo-jenny-users")
              .update({ used_promocodes: [promocode] })
              .eq("id", user.id);
          if (updatePromocodeError) {
            throw new Error("Error updating promocode");
          }
        }
      } catch (error) {
        toast.error("Error checking promocode");
        console.log({ error });
        return;
      }
    }
    // fetch from api/create-payment-intent with axios
    const { data } = await axios.post("/api/create-payment-intent", {
      items: [
        {
          id: "price_1MIKOsGOyG1nf55ISvmUDNeu",
          quantity: amountOfCredits,
          promocode,
        },
      ],
    });
    if (data) {
      setClientSecret(data.clientSecret);
      // log the payment id in supabase
      const { data: supabaseResponse, error } = await supabaseClient
        .from("tattoo-jenny-payments")
        .insert([
          {
            payment_intent_id: data.paymentIntent.id,
            user_id: user.id,
            been_credited: false,
          },
        ]);
    }
  };

  const handleSliderChange = (event) => {
    setClientSecret("");
    setAmountOfCredits(event);
  };

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      {shouldShowPaymentModal && (
        <>
          <Box
            sx={{
              backgroundColor: `rgba(0,0,0,0.8)`,
              position: `fixed`,
              left: `0`,
              top: `0`,
              width: `100vw`,
              height: `100vh`,
            }}
            onClick={() => setShouldShowPaymentModal(false)}
          ></Box>
          <Box
            sx={{
              backgroundColor: `white`,
              position: `fixed`,
              left: `50%`,
              top: `50%`,
              transform: `translateX(-50%) translateY(-50%)`,
              color: `black`,
              padding: `2rem`,
              width: [`80vw`, `fit-content`],
            }}
          >
            <Heading>Purchase Credits</Heading>
            <Box sx={{ minHeight: `30px` }}></Box>
            <Text>
              You are purchasing <b>{amountOfCredits}</b> credits <br />
              for <b>${price} USD.</b>
            </Text>
            <Box sx={{ minHeight: `30px` }}></Box>
            <Input
              placeholder={"Promocode (optional)"}
              value={promocode}
              onChange={(event) => setPromocode(event.target.value)}
            />
            {!clientSecret && (
              <Button
                onClick={() => getPaymentIntent()}
                sx={{ outline: `2px solid orange`, margin: `2rem auto` }}
              >
                Next
              </Button>
            )}
            {clientSecret && (
              <Box sx={{ padding: `2rem 0` }}>
                <Box
                  sx={{
                    display: `flex`,
                    alignItems: `center`,
                    gap: `1rem`,
                    margin: `0 auto 1rem auto`,
                  }}
                >
                  <BsShieldLockFill
                    size={20}
                    style={{ transform: `translateY(-10%)` }}
                  />
                  <Heading sx={{ fontSize: `1.66rem` }}>
                    Checkout Secured by Stripe
                  </Heading>
                </Box>
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              </Box>
            )}
          </Box>
        </>
      )}
    </>
  );
}
