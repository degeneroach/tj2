import { Box, Heading, Text, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";

export default function EmailEntry(props) {
    let isOpen = props?.isOpen;
    let setIsOpen = props?.setIsOpen;
  const [email, setEmail] = useState("");
  const handleEmailSave = async () => {
    toast("Saving email");
    try {
      const response = await axios.post("/api/saveEmail", {
        email: email,
      });
      toast.success("Email saved! Thanks!");
      console.log(response?.data);
      setIsOpen(false);
    } catch (error) {
      toast.error(
        "Email not saved. Please try again. If this error persists, give up!"
      );
      console.log({ error });
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <Box
            sx={{
              position: `absolute`,
              left: `1rem`,
              bottom: `1rem`,
              backgroundColor: `white`,
              color: `#2e2925`,
              padding: `1rem`,
              borderRadius: `1rem`,
            }}
          >
            <Box sx={{ display: `flex`, flexDirection: `row-reverse` }}>
              <AiOutlineClose onClick={() => setIsOpen(false)} />
            </Box>
            <Heading as="h2">Get Tattoo Jenny Updates</Heading>
            <Text sx={{ maxWidth: `50ch` }}>
              Subscribing to updates encourages us to actually provide updates.
              Tattoo Jenny is built by a small team of two, and our goal is to
              make life easier for all tattoo enjoyers. Join us on this journey!
            </Text>
            <Box sx={{ display: `flex`, margin: `1rem 0` }}>
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email Address"
              />
              <Button
                sx={{ backgroundColor: `#2e2925`, color: `white` }}
                _hover={{ backgroundColor: `#2e2925` }}
                onClick={handleEmailSave}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
