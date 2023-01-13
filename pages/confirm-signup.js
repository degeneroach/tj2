import Head from "next/head";
import { Box, Image, Text, Heading, Button } from "@chakra-ui/react";
import Nav from "../components/nav";
import TattooJenny from "../components/tattoojenny";

import { useState } from "react";
import Footer from "../components/footer";
import { useRouter } from "next/router";

export default function ConfirmSignup(props) {
  const router = useRouter();
  console.log(router.query);
  if (router?.query?.confirmation_url) {
    router.push(router.query.confirmation_url);
  }
  return (
    <>
      <Head>
        <title>About | AI Tattoo Generator | Tattoo Jenny</title>
        <meta
          name="description"
          content="Tattoo Jenny is an AI powered tattoo generator that creates custom tattoo designs based on your ideas. Enter your tattoo idea and let Tattoo Jenny do the rest!"
        />
      </Head>
      <Box
        sx={{
          backgroundColor: `#2e2925`,
          color: `#f1e8df`,
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
            maxWidth: "20rem",
            margin: `0 auto`,
          }}
        >
          <Heading as="h1">Confirming Email...</Heading>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
