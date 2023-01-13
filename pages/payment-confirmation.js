import Head from "next/head";
import { Box, Image, Text, Heading, Button, Spinner } from "@chakra-ui/react";
import Nav from "../components/nav";
import TattooJenny from "../components/tattoojenny";

import Footer from "../components/footer";

import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function PaymentConfirmation() {
  const router = useRouter();
  const [paymentIntent, setPaymentIntent] = useState(
    router?.query?.payment_intent
  );
  const [clientSecret, setClientSecret] = useState(null);
  const [options, setOptions] = useState(null);
  const [paymentIntentObject, setPaymentIntentObject] = useState(null);
  const user = useUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    console.log(router?.query);
    if (router?.query?.payment_intent_client_secret) {
      setClientSecret(router.query.payment_intent_client_secret);
    }
    if (router?.query?.payment_intent) {
      setPaymentIntent(router.query.payment_intent);
    }
  }, [router]);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      // use axios to fetch from /api/confirm-payment
      const response = await axios.post("/api/confirm-payment", {
        paymentId: paymentIntent,
      });
      console.log("response: ", response);
      setPaymentIntentObject(response.data.paymentIntent);
    };
    if (paymentIntent) {
      fetchPaymentIntent();
    }
  }, [paymentIntent]);

  async function checkPaymentId(paymentId, credits) {
    try {
      console.log("checking payment id: ", paymentId);
      let { data: paymentStatus, error } = await supabase
        .from("tattoo-jenny-payments")
        .select("*")
        .eq("payment_intent_id", paymentId);
      console.log("payment status: ", paymentStatus);
      if (paymentStatus.length > 0) {
        // payment exists, check if it has been credited
        if (paymentStatus[0].been_credited) {
          // payment has been credited, redirect to homepage
          router.push("/");
        } else {
          // payment has not been credited, add credits to user
          addCredits(credits);
        }
      } else {
        // payment does not exist, create payment
        let { data: newPayment, error: newPaymentError } = await supabase
          .from("tattoo-jenny-payments")
          .insert({
            payment_intent_id: paymentId,
            been_credited: false,
            user_id: user.id,
          });
        if (newPaymentError) {
          throw newPaymentError;
        }
        addCredits(credits);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function addCredits(credits) {
    console.log("Actually adding credits now: ", credits);
    try {
      let { data: tattooJennyUsers, error } = await supabase
        .from("tattoo-jenny-users")
        .select("*")
        .eq("user_id", user.id);
      if (tattooJennyUsers.length == 0) {
        // user does not exist, create user
        let { data: newUser, error: newUserError } = await supabase
          .from("tattoo-jenny-users")
          .insert({
            user_id: user.id,
            remaining_requests: 10 + credits,
            generated_this_month: 0,
            amount_generated: 0,
          });
      }
      console.log("tattooJennyUsers: ", tattooJennyUsers);
      if (tattooJennyUsers.length > 0) {
        let { data: updatedUser, error: creditError } = await supabase
          .from("tattoo-jenny-users")
          .update({
            remaining_requests:
              tattooJennyUsers[0].remaining_requests + 60,
          })
          .eq("user_id", user.id);
        console.log(
          "credits updated to ",
          tattooJennyUsers[0].remaining_requests + 60
        );
        let { data: updatedPayment, error: paymentError } = await supabase
          .from("tattoo-jenny-payments")
          .update({
            been_credited: true,
          })
          .eq("payment_intent_id", paymentIntentObject.id);
        console.log("payment marked as paid");
        router.push("/");
        if (creditError || paymentError) {
          throw new Error(creditError || paymentError);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Payment Confirmation | AI Tattoo Generator | Tattoo Jenny</title>
        <meta
          name="description"
          content="Tattoo Jenny is an AI powered tattoo generator that creates custom tattoo designs based on your ideas. Enter your tattoo idea and let Tattoo Jenny do the rest!"
        />
      </Head>
      <Box
        sx={{
          color: `#2E2925`,
          minHeight: `100vh`,
          minWidth: `100vw`,
          position: `relative`,
        }}
      >
        <Nav />
        <Box
          sx={{
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
            padding: `1rem`,
            maxWidth: "40rem",
            margin: `0 auto`,
          }}
        >
          {paymentIntentObject && (
            <Heading as="h1">
              Confirming Payment for {paymentIntentObject?.amount_received / 25}{" "}
              credits
            </Heading>
          )}
          {!paymentIntentObject && (
            <Heading as="h1">Confirming Payment...</Heading>
          )}
          <PaymentConfirmer
            paymentIntentObject={paymentIntentObject}
            finishFunction={checkPaymentId}
          />
          <TattooJenny />
        </Box>
      </Box>
      <Footer />
    </>
  );
}

const PaymentConfirmer = (props) => {
  const paymentIntentObject = props?.paymentIntentObject;
  const finishFunction = () => {
    console.log("finish function called");
    props?.finishFunction(
      paymentIntentObject.id,
      paymentIntentObject?.amount_received / 25
    );
  };
  return (
    <Box sx={{ padding: `2rem` }}>
      {!paymentIntentObject && <Spinner />}
      {paymentIntentObject && (
        <Button
          sx={{ outline: `2px solid orange` }}
          onClick={() => finishFunction()}
        >
          Finish Checkout
        </Button>
      )}
    </Box>
  );
};
