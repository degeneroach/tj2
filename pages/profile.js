import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Nav from "../components/nav";
import Footer from "../components/footer";
import Head from "next/head";
import { toast } from "react-hot-toast";

export default function Profile(props) {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [userStats, setUserStats] = useState(null);

  // run fetchUserStats on page load
  useEffect(() => {
    const fetchUserStats = async () => {
      const { data, error } = await supabase
        .from("tattoo-jenny-users")
        .select("*")
        .eq("user_id", user.id);
      if (error) {
        toast.error("Error fetching user stats");
        console.log({ error });
      }
      setUserStats(data[0]);
    };
    if (user && supabase) {
      fetchUserStats();
    }
  }, [user, supabase]);

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
          <Heading as="h1">Profile</Heading>
          {user && (
            <VStack alignItems="flex-start">
              <HStack>
                <Text>Account Email:</Text>
                <Text>{user?.email}</Text>
              </HStack>
              {userStats && (
                <>
                  <HStack>
                    <Text>Lifetime Tattoos Generated:</Text>
                    <Text>{userStats.amount_generated}</Text>
                  </HStack>
                  <HStack>
                    <Text>Remaining Credits:</Text>
                    <Text>{userStats.remaining_requests}</Text>
                  </HStack>
                  <HStack>
                    <Text>Account Tier:</Text>
                    <Text>{userStats.subscription_tier}</Text>
                  </HStack>
                  {userStats.subscription_tier === "free" && (
                    <Button
                      onClick={() => router.push("/upgrade")}
                      colorScheme="blue"
                      variant="outline"
                    >
                      Upgrade
                    </Button>
                  )}
                  {userStats.subscription_tier === "light" && (
                    <HStack>
                      <Button
                        onClick={() => router.push("/upgrade")}
                        colorScheme="blue"
                        variant="outline"
                      >
                        Upgrade
                      </Button>
                      <Button
                        onClick={() => router.push("/upgrade")}
                        colorScheme="red"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </HStack>
                  )}
                  {userStats.subscription_tier === "premium" && (
                    <HStack>
                      <Button
                        onClick={() => router.push("/upgrade")}
                        colorScheme="blue"
                        variant="outline"
                      >
                        Upgrade
                      </Button>
                      <Button
                        onClick={() => router.push("/upgrade")}
                        colorScheme="red"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </HStack>
                  )}
                  {userStats.subscription_tier === "professional" && (
                    <HStack>
                      <Button
                        onClick={() => router.push("/upgrade")}
                        colorScheme="red"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </HStack>
                  )}
                </>
              )}
        <Button
        sx={{backgroundColor: `black`, color: `white`}}
        onClick={() => supabase.auth.signOut()}
        >
            Sign Out
        </Button>
            </VStack>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
}
