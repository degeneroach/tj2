import { Box, Heading, Text, Input, Button } from "@chakra-ui/react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import axios from "axios";

import toast from "react-hot-toast";
import { useModalContext } from "../context/ModalContext";

export default function SignUpModal(props) {
  const supabaseClient = useSupabaseClient();
  const { shouldShowSignUpModal, setShouldShowSignUpModal } = useModalContext();

  return (
    <>
      {shouldShowSignUpModal && (
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
            onClick={() => setShouldShowSignUpModal(false)}
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
              width: [`80vw`, `40vw`],
            }}
          >
            <Heading>Sign Up!</Heading>
            <Text sx={{ padding: `2rem 0`, maxWidth: `20rem` }}>
              We have to start collecting user accounts for Tattoo Jenny to
              combat API abuse - people were generating <b>so so many</b> tattoos!{" "}
              <br />
              Sign Up today to start using Tattoo Jenny!
            </Text>
            <Auth
              supabaseClient={supabaseClient}
              appearance={{ theme: ThemeSupa }}
              view="sign_up"
              providers={["google"]}
            />
          </Box>
        </>
      )}
    </>
  );
}
