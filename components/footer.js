import {
  Grid,
  GridItem,
  Box,
  Heading,
  Image,
  VStack,
  Link,
  Text,
} from "@chakra-ui/react";

import { FaTiktok, FaInstagram, FaTwitter, FaDiscord } from "react-icons/fa";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useModalContext } from "../context/ModalContext";

export default function Footer() {
  const { setShouldShowSignInModal, setShouldShowSignUpModal } =
    useModalContext();

  return (
    <>
      <Box
        sx={{
          width: `100vw`,
          padding: `2rem`,
          backgroundColor: `#2E2925`,
          color: `white`,
        }}
      >
        <Grid
          templateColumns={[`1fr`, "1fr 1fr 1fr 4fr"]}
          gap={6}
          sx={{ width: `90vw`, margin: `0 auto` }}
        >
          <GridItem>
            <VStack sx={{ alignItems: `left` }}>
              <Heading as="h3" size="lg">
                How Tattoo Jenny Works
              </Heading>
              {/* <Link>Notice of service</Link>
              <Link>How We Process Data</Link> */}
              <Link href="/about">About Tattoo Jenny</Link>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack sx={{ alignItems: `left` }}>
              <Heading as="h3" size="lg">
                Account
              </Heading>
              <Link onClick={() => setShouldShowSignUpModal(true)}>
                Sign Up
              </Link>
              <Link onClick={() => setShouldShowSignInModal(true)}>Login</Link>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack sx={{ alignItems: `left` }}>
              <Heading as="h3" size="lg">
                Tattoo Jenny
              </Heading>
              <Link href="/best-tattoo-shop-near-me">Best Tattoo Shops</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="mailto:hello@tattoojenny.com">
                hello@tattoojenny.com
              </Link>
              <br />
              <Grid
                sx={{
                  gridTemplateColumns: `1fr 1fr 1fr 1fr`,
                  gap: `8px`,
                  display: [`none`, `grid`],
                }}
              >
                <Link href="https://www.tiktok.com/@tattoojennylabs">
                  <FaTiktok size={24} />
                </Link>
                <Link href="https://www.instagram.com/tattoojennylabs/">
                  <FaInstagram size={24} />
                </Link>
                <Link href="https://www.twitter.com/tattoojennyai">
                  <FaTwitter size={24} />
                </Link>
                <Link href="https://discord.gg/TyHbgYv5">
                  <FaDiscord size={24} />
                </Link>
              </Grid>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack>
              <Link href="/">
                <Image
                  src="/TattooJennyWordmark.svg"
                  alt="Tattoo Jenny"
                  maxWidth="200px"
                />
              </Link>
              <Text>© 2022 Tattoo Jenny</Text>
              <Link
                href="https://www.producthunt.com/posts/tattoo-jenny?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-tattoo&#0045;jenny"
                target="_blank"
                rel="dofollow"
              >
                <Image
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=372433&theme=dark"
                  alt="Tattoo&#0032;Jenny - AI&#0032;Tattoo&#0032;Idea&#0032;Generator | Product Hunt"
                  sx={{ width: `250px`, height: `54px` }}
                />
              </Link>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
