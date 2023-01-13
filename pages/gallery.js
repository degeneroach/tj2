import Head from "next/head";
import {
  Box,
  Image,
  Link,
  Text,
  Heading,
  Button,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
} from "@chakra-ui/react";
import Nav from "../components/nav";
import TattooJenny from "../components/tattoojenny";
import axios from "axios";
import { useState, useEffect } from "react";
import Footer from "../components/footer";
import { toast } from "react-hot-toast";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import TattooGalleryItem from "../components/TattooGalleryItem";

export default function About() {
  const [recentTattoos, setRecentTattoos] = useState([]);
  const [topTattoos, setTopTattoos] = useState([]);
  const [searchedTattoos, setSearchedTattoos] = useState([]);
  const [featuredTattoos, setFeaturedTattoos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const supabase = useSupabaseClient();

  const user = useUser();

  const [canCherryPick, setCanCherryPick] = useState(false);
  const [canRate, setCanRate] = useState(false);

  const checkForAdmin = (id) => {
    switch (id) {
      case "145dfbf6-12d6-4dc7-82cd-3206eaa8ce14":
        return true;
      case "67dc5276-1345-4817-8944-37341c7d43d4":
        return true;
      case "ed5f5e5e-d415-41cb-98ce-7ca8d972f94c":
        return true;
      case "dee62a2f-82f0-41e8-bc89-4ed892ec45bf":
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (user) {
      setCanRate(true);
      if (checkForAdmin(user.id)) {
        setCanCherryPick(true);
      }
    }
  }, [user]);

  const fetchTattoosByPage = async (page, tab) => {
    // clear previous
    let apiEndpoint = "";
    let fetchObject = {};
    switch (tab) {
      case "recent":
        setRecentTattoos([]);
        apiEndpoint = "/api/getTattoos";
        fetchObject = { page };
        break;
      case "top":
        setTopTattoos([]);
        apiEndpoint = "/api/getTopTattoos";
        fetchObject = { page };
        break;
      case "featured":
        setFeaturedTattoos([]);
        apiEndpoint = "/api/getFeaturedTattoos";
        fetchObject = { page };
        break;
      case "search":
        setSearchedTattoos([]);
        apiEndpoint = "/api/searchTattoos";
        fetchObject = { page, term: searchTerm || "green rose" };
        setSearchTerm("green rose");
        break;
      default:
        toast.error("Request malformed - no tab provided");
        break;
    }
    if (apiEndpoint === "") {
      return;
    }
    try {
      const response = await axios.post(`${apiEndpoint}`, fetchObject);
      console.log({ response });
      switch (tab) {
        case "recent":
          setRecentTattoos(response.data);
          break;
        case "top":
          setTopTattoos(response.data);
          break;
        case "featured":
          setFeaturedTattoos(response.data);
          break;
        case "search":
          setSearchedTattoos(response.data);
          break;
        default:
          toast.error("Request malformed - no tab provided");
          break;
      }
    } catch (error) {
      toast.error("Fetching Tattoos Failed - external server error");
      toast.error("If the issue persists, contact us in Discord.");
      console.log({ error });
    }
  };

  const loadPage1 = async () => {
    try {
      const response = await axios.post(`/api/getTattoos`, {
        page: 1,
      });
      setRecentTattoos(response.data);
    } catch (error) {
      console.log({ error });
    }
  };

  const executeSearch = async () => {
    setSearchedTattoos([]);
    try {
      const response = await axios.post(`/api/searchTattoos`, {
        term: searchTerm,
        page: 1,
      });
      setSearchedTattoos(response.data);
    } catch (error) {
      console.log({ error });
      toast.error("Search Failed");
    }
  };

  const getFeaturedTattoos = async () => {
    setFeaturedTattoos([]);
    try {
      const response = await axios.post(`/api/getFeaturedTattoos`, {
        page: 1,
      });
      setFeaturedTattoos(response.data);
    } catch (error) {
      console.log({ error });
      toast.error("Fetch Failed, reload to try again.");
      toast.error("If issue persists, join our Discord for support.");
    }
  };

  const getTopTattoos = async () => {
    setTopTattoos([]);
    try {
      const response = await axios.post(`/api/getTopTattoos`, {
        page: 1,
      });
      setTopTattoos(response.data);
    } catch (error) {
      console.log({ error });
      toast.error("Fetch Failed, reload to try again.");
      toast.error("If issue persists, join our Discord for support.");
    }
  };

  const addAPage = (tab) => {
    setPage((v) => v + 1);
    fetchTattoosByPage(page + 1, tab);
  };

  let hasLoaded = false;
  useEffect(() => {
    if (!hasLoaded) {
      // fetch all the tattoos from the database using axios using a page number of 1
      loadPage1();
      getFeaturedTattoos();
      getTopTattoos();
      hasLoaded = true;
    }
  }, []);

  const handleTabChange = (index) => {
    switch (index) {
      case 0:
        fetchTattoosByPage(1, "recent");
        break;
      case 1:
        fetchTattoosByPage(1, "top");
        break;
      case 2:
        fetchTattoosByPage(1, "search");
        break;
      case 3:
        fetchTattoosByPage(1, "featured");
        break;
      default:
        break;
    }
  };

  const voteTattoo = async (type, tattoo, tab) => {
    if (!user) {
      toast.error("You must be logged in to vote on a tattoo");
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
        toast.error("Vote Failed");
        console.log({ supabaseError });
        return;
      }
      toast.success("Vote Successful");
      // find the tattoo in state and update it
      switch (tab) {
        case "recent":
          setRecentTattoos((v) => {
            return v.map((t) => {
              if (t.id === tattoo.id) {
                return { ...t, ...updateObject };
              }
              return t;
            });
          });
          break;
        case "top":
          setTopTattoos((v) => {
            return v.map((t) => {
              if (t.id === tattoo.id) {
                return { ...t, ...updateObject };
              }
              return t;
            });
          });
          break;
        case "featured":
          setFeaturedTattoos((v) => {
            return v.map((t) => {
              if (t.id === tattoo.id) {
                return { ...t, ...updateObject };
              }
              return t;
            });
          });
          break;
        case "search":
          setSearchedTattoos((v) => {
            return v.map((t) => {
              if (t.id === tattoo.id) {
                return { ...t, ...updateObject };
              }
              return t;
            });
          });
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error("Vote Failed");
      console.log({ error });
      return;
    }
  };

  const cherryPickTattoo = async (type, tattoo, tab) => {
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
        switch (tab) {
          case "recent":
            setRecentTattoos((v) => {
              return v.map((t) => {
                if (t.id === tattoo.id) {
                  return { ...t, ...updateObject };
                }
                return t;
              });
            });
            break;
          case "top":
            setTopTattoos((v) => {
              return v.map((t) => {
                if (t.id === tattoo.id) {
                  return { ...t, ...updateObject };
                }
                return t;
              });
            });
            break;
          case "featured":
            setFeaturedTattoos((v) => {
              return v.map((t) => {
                if (t.id === tattoo.id) {
                  return { ...t, ...updateObject };
                }
                return t;
              });
            });
            break;
          case "search":
            setSearchedTattoos((v) => {
              return v.map((t) => {
                if (t.id === tattoo.id) {
                  return { ...t, ...updateObject };
                }
                return t;
              });
            });
            break;
          default:
            break;
        }
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
        <title>Gallery | AI Tattoo Generator | Tattoo Jenny</title>
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
            margin: `0 auto`,
          }}
        >
          <Heading as="h1">Gallery</Heading>
          <Tabs isLazy onChange={(index) => handleTabChange(index)}>
            <TabList>
              <Tab>Recent</Tab>
              <Tab>Top</Tab>
              <Tab>Search</Tab>
              <Tab>Featured</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Text>Recently Generated Tattoos</Text>
                {recentTattoos?.length > 0 && (
                  <>
                    <TattooGalleryItem
                      items={recentTattoos}
                      canRate={canRate}
                      canCherryPick={canCherryPick}
                      voteTattoo={voteTattoo}
                      cherryPickTattoo={cherryPickTattoo}
                      tab="recent"
                    />
                  </>
                )}
                <Button
                  onClick={() => addAPage("recent")}
                  sx={{ color: `black` }}
                  _hover={{ color: `black` }}
                >
                  Load More
                </Button>
              </TabPanel>
              <TabPanel>
                <Text>Top Rated Tattoo Generations</Text>
                {topTattoos?.length > 0 && (
                  <>
                    <TattooGalleryItem
                      items={topTattoos}
                      canRate={canRate}
                      canCherryPick={canCherryPick}
                      voteTattoo={voteTattoo}
                      cherryPickTattoo={cherryPickTattoo}
                      tab="top"
                    />
                  </>
                )}
                <Button onClick={() => addAPage("top")}>Load More</Button>
              </TabPanel>
              <TabPanel>
                <Text>Search for a tattoo</Text>
                <Box
                  sx={{
                    display: [`grid`, `flex`],
                    alignItems: `center`,
                    margin: `1rem auto`,
                    gap: `1rem`,
                  }}
                >
                  <Input
                    placeholder="Search Tattoos"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                  />
                  <Button
                    onClick={() => executeSearch()}
                    sx={{ outline: `2px solid orange` }}
                  >
                    Search
                  </Button>
                </Box>
                {searchedTattoos?.length > 0 && (
                  <>
                    <TattooGalleryItem
                      items={searchedTattoos}
                      canRate={canRate}
                      canCherryPick={canCherryPick}
                      voteTattoo={voteTattoo}
                      cherryPickTattoo={cherryPickTattoo}
                      tab="search"
                    />
                  </>
                )}
                <Button
                  onClick={() => addAPage("search")}
                  sx={{ color: `black` }}
                  _hover={{ color: `black` }}
                >
                  Load More
                </Button>
              </TabPanel>
              <TabPanel>
                <Text>Featured Tattoos</Text>
                {featuredTattoos?.length > 0 && (
                  <>
                    <TattooGalleryItem
                      items={featuredTattoos}
                      canRate={canRate}
                      canCherryPick={canCherryPick}
                      voteTattoo={voteTattoo}
                      cherryPickTattoo={cherryPickTattoo}
                      tab="featured"
                    />
                  </>
                )}
                <Button
                  onClick={() => addAPage("featured")}
                  sx={{ color: `black` }}
                  _hover={{ color: `black` }}
                >
                  Load More
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
