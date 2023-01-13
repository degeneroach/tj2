import "../styles/globals.css";
import styles from "../styles/global.scss";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { GoAlert } from "react-icons/go";
import { Link } from "@chakra-ui/react";
import { ModalProviderFC } from "../context/ModalContext";
import SignInModal from "../components/signin";
import SignUpModal from "../components/signup";
import PaymentModal from "../components/paymentModal";

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const [shouldShowAlert, setShouldShowAlert] = useState(true);
  return (
    <ChakraProvider>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ModalProviderFC>
          {/* {shouldShowAlert && (
            <Box
              sx={{
                backgroundColor: `white`,
                color: `black`,
                padding: `1rem`,
                display: `flex`,
                alignItems: `center`,
                gap: `1rem`,
              }}
            >
              <GoAlert />
              <Text>
                Our email system is experiencing heavy load - join our{" "}
                <Link href="https://discord.gg/ja6Nj62d">discord</Link> for
                alerts when the issue is resolved.
              </Text>
            </Box>
          )} */}
          <Component {...pageProps} />
          <Toaster />
          <PaymentModal />
          <SignInModal />
          <SignUpModal />
        </ModalProviderFC>
      </SessionContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
