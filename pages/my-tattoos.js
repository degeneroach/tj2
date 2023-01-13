import Head from "next/head";
import { Box, Image, Text, Heading, Button } from "@chakra-ui/react";
import Nav from "../components/nav";
import TattooJenny from "../components/tattoojenny";

import { useState, useEffect } from "react";
import Footer from "../components/footer";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import TattooGalleryItem from "../components/TattooGalleryItem";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export default function About() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();

  const [tattoos, setTattoos] = useState();
  const [canRate, setCanRate] = useState(true);
  const [canCherryPick, setCanCherryPick] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const fetchAndSetTattoos = async () => {
      if (user) {
        const { data: supabaseResponse, error: supabaseError } = await supabase
          .from("tattoo-jenny-images")
          .select("*")
          .order("created_at", { ascending: false })
          .eq("creator", user.id);
        if (supabaseError) {
          toast.error("Something went wrong. Please try again.");
        }
        if (supabaseResponse) {
          console.log({ supabaseResponse });
          setTattoos(supabaseResponse);
        }
      }
    };
    if (!user) {
      setIsUser(false);
    } else {
      fetchAndSetTattoos();
    }
  }, [user, router, supabase]);

  useEffect(() => {
    if (tattoos?.length > 0) {
      setIsUser(true);
    }
  }, [tattoos]);

  const voteTattoo = async (type, tattoo) => {
    if (!user) {
      toast.error("You must be logged in to upvote a tattoo");
      return;
    }
    let updateObject = {};
    switch (type) {
      case "upvote":
        updateObject = {
          upvotes: tattoo.upvotes + 1,
          ranking: tattoo.ranking + 1,
        };
        break;
      case "downvote":
        updateObject = {
          downvotes: tattoo.downvotes + 1,
          ranking: tattoo.ranking - 1,
        };
        break;
      default:
        toast.error("Vote Failed");
        return;
    }
    try {
      const { data: supabaseResponse, error: supabaseError } = await supabase
        .from("tattoo-jenny-images")
        .update(updateObject)
        .eq("id", tattoo.id);
      if (supabaseError) {
        toast.error("Upvote Failed");
        console.log({ supabaseError });
        return;
      }
      toast.success("Upvote Successful");
    } catch (error) {
      toast.error("Upvote Failed");
      console.log({ error });
      return;
    }
  };

  const cherryPickTattoo = async (type, tattoo) => {
    if (!user) {
      toast.error("You must be logged in to cherry pick a tattoo");
      return;
    }
    let updateObject = {};
    switch (type) {
      case "add":
        updateObject = {
          isCherrypicked: true,
          ranking: tattoo.ranking + 100,
        };
        break;
      case "remove":
        updateObject = {
          isCherrypicked: false,
          ranking: tattoo.ranking - 100,
        };
        break;
      default:
        toast.error("Cherry Pick Failed");
        return;
    }
    try {
      const { data: supabaseResponse, error: supabaseError } = await supabase
        .from("tattoo-jenny-images")
        .update(updateObject)
        .eq("id", tattoo.id);
      if (supabaseError) {
        toast.error("Cherry Pick Failed");
        console.log({ supabaseError });
        return;
      } else {
        toast.success("Cherry Pick Successful");
        return;
      }
    } catch (error) {
      toast.error("Cherry Pick Failed");
      console.log({ error });
      return;
    }
  };

  return (
    <>
      <Head>
        <title>My Tattoos | AI Tattoo Generator | Tattoo Jenny</title>
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
          <Heading as="h1">My Tattoos</Heading>
          <Text>
            Here&apos;s a list of all the tattoos you&apos;ve generated with
            TattooJenny.
          </Text>
          {isUser && (
            <>
              {tattoos?.length > 0 && (
                <TattooGalleryItem
                  items={tattoos}
                  canRate={canRate}
                  canCherryPick={canCherryPick}
                  voteTattoo={voteTattoo}
                  cherryPickTattoo={cherryPickTattoo}
                />
              )}
            </>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
}
