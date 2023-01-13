import {
  HStack,
  Heading,
  Box,
  Link,
  Text,
  Grid,
  Image,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FaTiktok, FaInstagram, FaTwitter, FaDiscord } from "react-icons/fa";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

import { IoMenu } from "react-icons/io5";

import { useModalContext } from "../context/ModalContext";
import { useRouter } from "next/router";

export default function Nav() {
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [remainingCredits, setRemainingCredits] = useState();
  const { setShouldShowSignInModal, setShouldShowPaymentModal } =
    useModalContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    if (user) {
      setShouldShowSignInModal(false);
    }
  }, [setShouldShowSignInModal, user]);

  useEffect(() => {
    const fetchCredits = async () => {
      const { data, error } = await supabaseClient
        .from("tattoo-jenny-users")
        .select("remaining_requests")
        .eq("user_id", user.id);
      if (data) {
        console.log({ data });
        setRemainingCredits(data[0].remaining_requests);
      }
      if (error) {
        console.log({ error });
      }
    };
    if (user) {
      fetchCredits();
    }
    if (!user) {
      setRemainingCredits(10);
    }
  }, [supabaseClient, user]);

  const startPaymentFlow = () => {
    if (user) {
      setShouldShowPaymentModal(true);
      onClose();
    }
  };

  const startSignInFlow = () => {
    if (!user) {
      setShouldShowSignInModal(true);
      onClose();
    }
  };

  return (
    <>
      <Box as="nav">
        <HStack
          spacing="24px"
          padding={["1rem", "1 rem 4rem"]}
          justifyContent="space-between"
        >
          <HStack gap="24px">
            <Link href="/">
              <Image
                src="/tattoojennybust.png"
                alt="Tattoo Jenny"
                maxWidth="200px"
              />
            </Link>
            <Grid
              sx={{
                gridTemplateColumns: `1fr 1fr 1fr 1fr`,
                gap: `24px`,
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
          </HStack>
          <HStack gap="48px" justifySelf="center" display={[`none`, `flex`]}>
            <Link href="/about">About</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/my-tattoos">My Tattoos</Link>
          </HStack>
          <HStack
            gap="48px"
            padding="0 2rem"
            alignContent={"center"}
            display={[`none`, `flex`]}
          >
            <Text
              sx={{ color: `#2E2925`, fontWeight: `800` }}
              onClick={() => startPaymentFlow()}
            >
              {user
                ? `Amount Of Credits: ${remainingCredits}`
                : `Amount Of Credits: 10`}
            </Text>
            {user && (
              <Button
                sx={{
                  backgroundColor: `white`,
                  color: `green`,
                  borderRadius: `2px`,
                  textTransform: `uppercase`,
                  outline: `2px solid green`,
                }}
                _hover={{
                  backgroundColor: `#2E2925`,
                  color: `white`,
                }}
                onClick={() => startPaymentFlow()}
              >
                Get Credits
              </Button>
            )}
            {user && (
              <Button
                sx={{
                  backgroundColor: `#2E2925`,
                  padding: `0 50px`,
                  color: `white`,
                  borderRadius: `2px`,
                  textTransform: `uppercase`,
                }}
                _hover={{
                  backgroundColor: `#2E2925`,
                  color: `white`,
                }}
                onClick={() => {
                  router.push("/profile");
                }}
              >
                Profile
              </Button>
            )}
            {!user && (
              <Button
                onClick={() => startSignInFlow()}
                sx={{
                  backgroundColor: `#2E2925`,
                  padding: `0 50px`,
                  color: `white`,
                  borderRadius: `2px`,
                  textTransform: `uppercase`,
                }}
                _hover={{
                  backgroundColor: `#2E2925`,
                  color: `white`,
                }}
              >
                Sign In
              </Button>
            )}
          </HStack>
          <Box display={[`box`, `none`]}>
            <Button onClick={onOpen}>Menu</Button>
          </Box>
          <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            sx={{ height: `100vh` }}
          >
            <DrawerOverlay sx={{ height: `100vh` }} />
            <DrawerContent sx={{ height: `100vh` }}>
              <DrawerCloseButton />
              <DrawerHeader>
                <IoMenu />
              </DrawerHeader>

              <DrawerBody>
                <VStack justifyContent="space-between" height="100%">
                  <VStack spacing="24px">
                    <Text sx={{ color: `#2E2925`, fontWeight: `800` }}>
                      {user
                        ? `Amount Of Credits: ${remainingCredits}`
                        : `Amount Of Credits: 10`}
                    </Text>
                    {user && (
                      <Button
                        sx={{
                          backgroundColor: `white`,
                          color: `green`,
                          borderRadius: `2px`,
                          textTransform: `uppercase`,
                          outline: `2px solid green`,
                        }}
                        _hover={{
                          backgroundColor: `#2E2925`,
                          color: `white`,
                        }}
                        onClick={() => startPaymentFlow()}
                      >
                        Purchase Credits
                      </Button>
                    )}
                    {user && (
                      <Button
                        sx={{
                          backgroundColor: `#2E2925`,
                          color: `white`,
                          borderRadius: `2px`,
                          textTransform: `uppercase`,
                        }}
                        _hover={{
                          backgroundColor: `#2E2925`,
                          color: `white`,
                        }}
                        onClick={() => {
                          router.push("/profile");
                        }}
                      >
                        Profile
                      </Button>
                    )}
                    {!user && (
                      <Button
                        onClick={() => startSignInFlow()}
                        sx={{
                          backgroundColor: `#2E2925`,
                          color: `white`,
                          borderRadius: `2px`,
                          textTransform: `uppercase`,
                        }}
                        _hover={{
                          backgroundColor: `#2E2925`,
                          color: `white`,
                        }}
                      >
                        Sign In
                      </Button>
                    )}
                  </VStack>
                  <VStack spacing="24px">
                    <Link href="/about">About</Link>
                    <Link href="/gallery">Gallery</Link>
                    <Link href="/my-tattoos">My Tattoos</Link>
                  </VStack>
                  <Grid
                    sx={{
                      gridTemplateColumns: `1fr 1fr 1fr 1fr`,
                      gap: `24px`,
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
              </DrawerBody>

              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </HStack>
      </Box>
    </>
  );
}
