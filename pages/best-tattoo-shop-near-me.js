import Head from "next/head";
import {
  Box,
  Image,
  Text,
  Heading,
  Link,
  Button,
  Grid,
  GridItem,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import Nav from "../components/nav";
import TattooJenny from "../components/tattoojenny";

import { useState } from "react";
import Footer from "../components/footer";

export default function PartnerNetwork() {
  return (
    <>
      <Head>
        <title>
          Best Tattoo Shop Near Me | Best Tattoo Shops | Tattoo Jenny
        </title>
        <meta
          name="description"
          content="Tattoo Jenny's Partner Network. Find the best tattoo near me in Houston or Long Beach. We've curated the best tattoo artists!"
        />
      </Head>
      <Box
        sx={{
          color: `#2E2925`,
          minHeight: `100vh`,
          minWidth: `100vw`,
          padding: `0 2.5%`,
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
          <Heading as="h1">Best Tattoo Shop Near Me</Heading>
          <br />
          <Text>
            Looking for the <em>best tattoo shop near me</em>? No problem Tattoo
            Jenny has curated an extensive list of all our favorite tattoo
            shops! We&apos;ve gone ahead and sorted by the top 10 best tattoo
            shops in each location!
          </Text>
          <br />
          <Text>
            We&apos;ve created <Link href="/">Tattoo Jenny</Link> for you to
            quickly come up with an awesome tattoo idea. The ideas you come up
            with our
            <strong>Random Tattoo Generator</strong> idea is just the
            foundation. You&apos;ll need to your generated tattoo ideas to one
            of the professionals listed below to be refined. These are some of
            the best tattoo shops near me.
          </Text>
          <br />
          <Link href="/">
            <Button
              sx={{
                borderRadius: `2px`,
                background: `#FD9700`,
                color: `white`,
              }}
              _hover={{ bg: "#b96e00" }}
              href="/"
            >
              Generate Your Tattoo Idea
            </Button>
          </Link>
        </Box>
        <br />
        <Heading as="h2">Best Tattoo Shops in Texas</Heading>
        <Grid templateColumns={[`1fr`, "1fr 1fr 1fr 1fr 1fr"]} gap={6}>
          <GridItem>
            <Heading as="h4" size="md">
              Best Tattoo Shops in Houston
            </Heading>
            <UnorderedList>
              <ListItem>
                <Link
                  href="https://www.assassin.ink/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Assassin Tattoo Houston TX
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.instagram.com/timelessinkstudio/"
                  target="_blank"
                  rel="noreferrer"
                >
                  TIMELESS INK STUDIO
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.flyingsquidtattoo.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Flying Squid TX
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.houstonheightstattoo.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Houston Heights Tattoo
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.3rdgenerationink.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  3rd Generation Tattoo
                </Link>
              </ListItem>
            </UnorderedList>
          </GridItem>
          <GridItem>
            <Heading as="h4" size="md">
              Best Tattoo Shops in San Antonio
            </Heading>
            <UnorderedList>
              <ListItem>
                <Link
                  href="https://firmecopias.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Firm Copias
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.platinumtattoos.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Platinum Tattoos
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://dandylandtattoo.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Dandyland Tattoo
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.boardwalktattoos.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Boardwalk Tattoos
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.fortunebrostattoo.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Fortune Bros Tattoo
                </Link>
              </ListItem>
            </UnorderedList>
          </GridItem>
          <GridItem>
            <Heading as="h4" size="md">
              Best Tattoo Shops in Haltom City
            </Heading>
            <UnorderedList>
              <ListItem>
                <Link
                  href="https://www.darkageftw.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Dark Age FTW
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.instagram.com/crackerjacktattoos/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Cracker Jack Tattoos
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="http://tnttattoocompany.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  TNT Tattoo Company
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="http://inkpittattoo.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ink Pitt Tattoo
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://epictattoos.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Epic Tattoos
                </Link>
              </ListItem>
            </UnorderedList>
          </GridItem>
          <GridItem>
            <Heading as="h4" size="md">
              Best Tattoo Shops in Austin
            </Heading>
            <UnorderedList>
              <ListItem>
                <Link
                  href="https://www.truebluetattoo.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  True Blue Tattoo
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.instagram.com/crackerjacktattoos/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Cracker Jack Tattoos
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.momstattoos.info/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Mom&apos;s Tattoo
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.triplecrowntattoo.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Triple Crown Tattoo Parlour
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.greatwavetattoo.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Great Wave Tattoo
                </Link>
              </ListItem>
            </UnorderedList>
          </GridItem>
          <GridItem>
            <Heading as="h4" size="md">
              Best Tattoo Shops in Hurst
            </Heading>
            <UnorderedList>
              <ListItem>
                <Link
                  href="https://www.diamondtattooparlor.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Diamond Tattoo Parlor
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.virtuosotattoo.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Virtuoso Tattoo
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.northtexastattoo.net/"
                  target="_blank"
                  rel="noreferrer"
                >
                  North Texas Tattoo Company
                </Link>
              </ListItem>
            </UnorderedList>
          </GridItem>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}
