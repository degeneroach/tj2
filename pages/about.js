import Head from "next/head";
import { Box, Image, Text, Heading, Button } from "@chakra-ui/react";
import Nav from "../components/nav";
import TattooJenny from "../components/tattoojenny";

import { useState } from "react";
import Footer from "../components/footer";

export default function About() {
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
          <Heading as="h1">About Us</Heading>
          <Text>
            Do you find your clients bringing boring & mundayne tattoo ideas to
            you? Are you constantly losing motivation giving inspiration to
            clients that don&apos;t know what they want tattooed?
          </Text>
          <br />
          <Text>
            TattooJenny Labs has created AI Driven Tattoo generating software.
            Now clients waiting in your lobby can have fun creating their next
            super creative & fun tattoo idea!
          </Text>
          <br />
          <Text>
            Obviously, these ideas are meant to be refined. Feel free to take
            the ideas that TattooJenny gives to you and run with it!
          </Text>
          <Image src="../../tattoo-jenny.png" />
          <br />

          <Box
            style={{
              padding: `15px`,
              borderRadius: `5px`,
              background: `white`,
              maxWidth: `100%`,
            }}
          >
            <Text style={{ color: `black` }}>
              Tattoo Jenny takes a lot of juice to run{" "}
              <em>(Actually around $100 USD a day at its current rate)</em>.
              Feel free to donate to Tattoo Jenny to keep her free:
            </Text>
            <br />
            <Text
              style={{
                color: `red`,
                textWeight: `900`,
                textTransform: `uppercase`,
              }}
            >
              0x093356Bb41C38B87b7477bFf7762eD05BaC26d47
            </Text>
            <br />
            <Text>
              <b>Limitations:</b> Tattoo Jenny is still under development.
              <br />
              She can only generate tattoos in the styles listed above. She
              struggles with words and scripts because she doesn&apos;t actually
              speak English. She also struggles with tattoos that are too
              detailed. If you&apos;re hoping to print an image off and use it
              as a stencil for a specific tattoo, you&apos;re in the wrong spot.
              Tattoo Jenny generates *ideas* for art, not actual art. Use Tattoo
              Jenny&apos;s drawings as a jumping off point with your local
              professional.
            </Text>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
