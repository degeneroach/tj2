import Head from "next/head";
import { Box, Image, Text, Heading, Button } from "@chakra-ui/react";
import Nav from "../components/nav";
import TattooJenny from "../components/tattoojenny";

import { useState } from "react";
import Footer from "../components/footer";
import toast from "react-hot-toast";
export default function About() {
  const apologize = () => {
    toast.error("Sorry! We're still building that feature.");
  };
  return (
    <>
      <Head>
        <title>Upgrade | AI Tattoo Generator | Tattoo Jenny</title>
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
            margin: `0 auto`,
          }}
        >
          <Heading>Upgrade Account</Heading>
          <Text sx={{ maxWidth: `30rem` }}>
            Tattoo Jenny runs on cloud GPUs for fast loading times and
            decentralized access. It also allows us to rapidly iterate on the
            core Tattoo Jenny AI. This means we have to pay for Tattoo Jenny to
            run, so to use Tattoo Jenny you must subscribe to purchase monthly
            credits.
          </Text>
          <Box
            sx={{
              display: `flex`,
              flexDirection: [`column`, `row`],
              alignItems: `center`,
              justifyContent: `center`,
              gap: `1rem`,
              padding: `2rem 0`,
            }}
          >
            {/* Light Tier */}
            <Box
              sx={{
                padding: `2rem`,
                border: `2px solid rgba(0,0,0,0.7)`,
                borderRadius: `2px`,
                display: `flex`,
                flexDirection: `column`,
                justifyContent: `space-between`,
                minHeight: `15rem`,
              }}
            >
              <Heading>Light Tier</Heading>
              <Text>60 credits per month</Text>
              <Text>1 credit per 6 tattoos</Text>
              <Text>$8.33 USD</Text>
              <Button
                sx={{ outline: `2px solid blue` }}
                onClick={() => apologize()}
              >
                Get
              </Button>
            </Box>
            {/* Premium Tier */}
            <Box
              sx={{
                padding: `2rem`,
                border: `2px solid orange`,
                borderRadius: `2px`,
                display: `flex`,
                flexDirection: `column`,
                justifyContent: `space-between`,
                minHeight: `20rem`,
              }}
            >
              <Heading>Premium Tier</Heading>
              <Text>200 credits per month</Text>
              <Text>1 credit per 6 tattoos</Text>
              <Text>$24.99 USD</Text>
              <Button
                sx={{
                  outline: `2px solid black`,
                  backgroundColor: `orange`,
                  color: `white`,
                }}
                _hover={{ color: `orange`, backgroundColor: `white` }}
                onClick={() => apologize()}
              >
                Get
              </Button>
            </Box>
            {/* Pro Tier */}
            <Box
              sx={{
                padding: `2rem`,
                border: `2px solid rgba(0,0,0,0.7)`,
                borderRadius: `2px`,
                display: `flex`,
                flexDirection: `column`,
                justifyContent: `space-between`,
                minHeight: `15rem`,
              }}
            >
              <Heading>Professional Tier</Heading>
              <Text>2,500 credits per month</Text>
              <Text>1 credit per 6 tattoos</Text>
              <Text>$249.99 USD</Text>
              <Button
                sx={{ outline: `2px solid blue` }}
                onClick={() => apologize()}
              >
                Get
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
