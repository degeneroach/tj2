import { Box, Heading, Text, Input, Button } from "@chakra-ui/react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import axios from "axios";

import toast from "react-hot-toast";
import { useModalContext } from "../context/ModalContext";

export default function SignInModal(props) {
  const supabaseClient = useSupabaseClient();
  const { shouldShowSignInModal, setShouldShowSignInModal } = useModalContext();

  return (
    <>
      {shouldShowSignInModal && (
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
            onClick={() => setShouldShowSignInModal(false)}
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
              width: [`80vw`, `fit-content`],
            }}
          >
            <Heading>Welcome Back!</Heading>
            <Auth
              supabaseClient={supabaseClient}
              appearance={{ theme: ThemeSupa }}
              view="sign_in"
              providers={["google"]}
            />
          </Box>
        </>
      )}
    </>
  );
}
