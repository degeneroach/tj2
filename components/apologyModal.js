import { Box, Heading, Text, Input, Button, Link } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

import toast from "react-hot-toast";

export default function ApologyModal(props) {
  const [email, setEmail] = useState("");
  const isOpen = props?.isOpen;
  const setIsOpen = props?.setIsOpen;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post("/api/saveEmail", {
        email: email,
      });
      console.log(response?.data);
      toast.success(
        "Thank you! We will notify you when Tattoo Jenny is back online."
      );
      setTimeout(() => {
        window.location.href = "/gallery";
      }, 2000);
    } catch (error) {
      console.log({ error });
      toast.error("Sorry, something went wrong. Please try again.");
    }
  };

  return (
    <>
      {isOpen && (
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
            onClick={() => setIsOpen(false)}
          >
            <Box
              sx={{
                backgroundColor: `white`,
                position: `absolute`,
                left: `50%`,
                top: `50%`,
                transform: `translateX(-50%) translateY(-50%)`,
                color: `black`,
                padding: `2rem`,
              }}
            >
              <Heading>Sorry!</Heading>
              <Text>
                If you get the &quote;Tattoo Jenny is Tired&quote; error a lot, that might mean Tattoo Jenny is offline.
                <br /> Thank you for your interest though!
                <br /> Take a look through our gallery in the mean time, and
                join our <Link href="https://discord.gg/ja6Nj62d">Discord</Link> for updates.
              </Text>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
