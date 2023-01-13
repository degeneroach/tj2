import Head from "next/head";
import {
  Box,
  Text,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  UnorderedList,
  ListItem,
  Button,
  Image,
  Spinner,
  VStack,
  HStack,
  RadioGroup,
  Radio,
  Grid,
  Progress,
  Select,
  Switch,
} from "@chakra-ui/react";
import Nav from "../components/nav";
import TattooJenny from "../components/tattoojenny";
import axios from "axios";

import { FaCheckSquare, FaWindowClose } from "react-icons/fa";
import ApologyModal from "../components/apologyModal";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../components/footer";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useModalContext } from "../context/ModalContext";

export default function Home() {
  const [tattooIdea, setTattooIdea] = useState("");
  const [generatedTattoos, setGeneratedTattoos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const [style, setStyle] = useState("normal");
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [speed, setSpeed] = useState("medium");
  const [magic, setMagic] = useState("medium");
  const [progress, setProgress] = useState(0);
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const isJennyLive = true;
  const { setShouldShowSignInModal, setShouldShowSignUpModal } =
    useModalContext();

  function useInterval(callback, delay) {
    const intervalRef = React.useRef(null);
    const savedCallback = React.useRef(callback);
    React.useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
    React.useEffect(() => {
      const tick = () => savedCallback.current();
      if (typeof delay === "number") {
        intervalRef.current = window.setInterval(tick, delay);
        return () => window.clearInterval(intervalRef.current);
      }
    }, [delay]);
    return intervalRef;
  }

  // useEffect(() => {
  //   const induceFomo = () => {
  //     // generate a random number between 20 and 250 in increments of 10
  //     let random = Math.floor(Math.random() * 25) * 10 + 20;
  //     // generate a random timeout between 1 and 30 seconds in ms
  //     let timeout = (Math.floor(Math.random() * 30) + 1) * 1000;
  //     // run the timeout
  //     setTimeout(() => {
  //       toast(`A user just purchased ${random} credits.`, {
  //         icon: "🔥",
  //         position: "bottom-left",
  //         style: {
  //           border: "2px solid orange",
  //           padding: "8px",
  //         },
  //       });
  //     }, timeout);
  //   };
  //   const interval = setInterval(() => {
  //     induceFomo();
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, []);

  const processUser = async () => {
    console.log(user);
    try {
      let { data: tattooJennyUsers, error } = await supabaseClient
        .from("tattoo-jenny-users")
        .select("*")
        .eq("user_id", user.id);
      if (tattooJennyUsers.length === 0) {
        // create the user, give free credits
        let { data: newUser, error } = await supabaseClient
          .from("tattoo-jenny-users")
          .insert([
            {
              amount_generated: 0,
              user_id: user.id,
              remaining_requests: 3,
              generated_this_month: 0,
            },
          ]);
        return true;
      } else {
        // check if the user has any remaining requests
        if (tattooJennyUsers[0].remaining_requests <= 0) {
          setIsLoading(false);
          toast.error("Out of Credits!");
          return false;
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later.");
    }
    return true;
  };

  const chargeUser = async () => {
    try {
      let { data: tattooJennyUsers, error } = await supabaseClient
        .from("tattoo-jenny-users")
        .select("*")
        .eq("user_id", user.id);
      let amountToCharge = 1;
      if (isAdvancedMode) {
        amountToCharge = 2;
      }
      if (tattooJennyUsers.length > 0) {
        let { data: updatedUser, error } = await supabaseClient
          .from("tattoo-jenny-users")
          .update({
            remaining_requests:
              tattooJennyUsers[0].remaining_requests - amountToCharge,
            amount_generated: tattooJennyUsers[0].amount_generated + 6,
            generated_this_month: tattooJennyUsers[0].generated_this_month + 6,
          })
          .eq("user_id", user.id);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const generateTattooIdea = async () => {
    try {
      setIsLoading(true);
      setProgress(10);
      if (!user) {
        setShouldShowSignUpModal(true);
        setIsLoading(false);
        toast.error("Please sign up to use Tattoo Jenny!");
        setProgress(0);
        return;
      }
      let isUserValid = await processUser();
      setProgress(20);
      if (!isUserValid) {
        toast.error("You have no more requests left for this month.");
        setProgress(0);
        return;
      }
      // count the words in the prompt and cancel job if too complex
      let words = tattooIdea.split(" ");
      if (words.length > 4 && !isAdvancedMode) {
        toast.error(
          "Sorry! That idea is too complex for normal mode. Try advanced mode or a simpler idea."
        );
        setProgress(0);
        setIsLoading(false);
        return;
      }
      toast.success("Tattoo Jenny is working on your tattoo idea...");
      // clear out any previous generated tattoos
      setGeneratedTattoos([]);
      if (!isAdvancedMode) {
        const response = await axios.post("/api/generate-banana", {
          prompt: tattooIdea,
          style: style,
          speed,
          magic,
        });
        if (response?.data?.length > 0) {
          setGeneratedTattoos(response.data);
          setProgress(80);
        }
        if (response?.data?.length <= 0) {
          toast.error(
            "Tattoo Jenny couldn't think of anything... this is an error! Try again, if the issue persists let us know in Discord."
          );
          setProgress(0);
          setIsLoading(false);
          return;
        }
        toast.success("Bundling output...");
        let s3Response = await axios.post("/api/saveToS3-banana", {
          prompt: tattooIdea,
          generatedTattoos: response.data,
          creator: user.id,
          style,
        });
        setProgress(90);
        console.log(response?.data);
      }
      if (isAdvancedMode) {
        const response = await axios.post("/api/generate-dalle", {
          prompt: tattooIdea,
          style: style,
        });
        if (response?.data?.length > 0) {
          setGeneratedTattoos(response.data);
          setProgress(80);
        }
        if (response?.data?.length <= 0) {
          toast.error(
            "Tattoo Jenny couldn't think of anything... this is an error! Try again, if the issue persists let us know in Discord."
          );
          setProgress(0);
          setIsLoading(false);
          return;
        }
        toast.success("Bundling output...");
        let s3Response = await axios.post("/api/saveToS3-dalle", {
          prompt: tattooIdea,
          generatedTattoos: response.data,
          creator: user.id,
          style,
        });
        setProgress(90);
        console.log(response?.data);
        toast.success(
          "Advanced roll complete! Transferring to your gallery..."
        );
        router.push("/my-tattoos");
      }
      toast.success("Tattoo Jenny is done. Check out your new tattoo ideas!");
      setLastPrompt(tattooIdea);
      setProgress(100);
      await chargeUser();
      setIsLoading(false);
      setProgress(0);
    } catch (error) {
      console.log({ error });
      let code = error?.response?.data?.status;
      if (code === 429) {
        toast.error(
          "Request failed because Tattoo Jenny is too popular. Please wait one minute."
        );
      }
      if (code === 400) {
        toast.error(
          "Request failed because Tattoo Jenny is too tired. Please wait one minute."
        );
      }
      if (code === 500) {
        toast.error(
          "Request failed because Tattoo Jenny had a dumb. Please wait one minute."
        );
      }
      setIsLoading(false);
      setProgress(0);
    }
  };

  const toastTester = () => {
    toast.success("Tattoo Jenny is working on your tattoo idea...");
    toast.success("Tattoo Jenny is done. Check out your new tattoo ideas!");
  };

  useEffect(() => {
    if (isAdvancedMode) {
      toast.success(
        "Advanced mode on. You can now enter more complex ideas... but each roll will cost 2 credits."
      );
    }
  }, [isAdvancedMode]);

  return (
    <>
      <Head>
        <title>
          Tattoo Idea Generator | AI Tattoo Generator | Tattoo Jenny
        </title>
        <meta
          name="description"
          content="Tattoo Jenny is an AI powered tattoo generator that creates custom tattoo designs based on your ideas. Enter your tattoo idea and let Tattoo Jenny do the rest!"
        />
      </Head>
      <Box
        sx={{
          backgroundColor: `white`,
          color: `#2E2925`,
          minHeight: `100vh`,
          minWidth: `100vw`,
          position: `relative`,
        }}
      >
        <Nav />
        <VStack
          className="generator-section"
          sx={{ padding: `7.5rem 0 2rem 0` }}
        >
          <Heading as="h1" sx={{ textTransform: `uppercase` }}>
            AI Tattoo Generator
          </Heading>
          <Box
            sx={{
              backgroundColor: `#FD9700`,
              padding: ["2rem", "4rem"],
              color: `white`,
              minWidth: ["95vw", "30vw"],
              borderRadius: `2px`,
              boxShadow: `0px 1px 10px -1px rgba(0, 0, 0, 0.25);`,
            }}
          >
            {isLoading && (
              <Progress value={progress} size="xs" colorScheme="pink" />
            )}
            <VStack>
              <Heading as="h2" sx={{ fontSize: `1.5rem`, fontWeight: `500` }}>
                Input Your Tattoo Idea
              </Heading>
              <HStack
                style={{ width: `100%` }}
                sx={{
                  flexDirection: [`column`, `row`],
                  alignContent: `center`,
                }}
              >
                <Input
                  placeholder="Neotraditional Rose, Heart & Anchor..."
                  value={tattooIdea}
                  onChange={(event) => setTattooIdea(event.target.value)}
                  sx={{
                    backgroundColor: `white`,
                    color: `#2E2925`,
                    borderRadius: `2px`,
                  }}
                />
                <Button
                  sx={{
                    backgroundColor: `#2E2925`,
                    padding: `0.5rem 4rem`,
                    textTransform: `uppercase`,
                    margin: `0`,
                    borderRadius: `2px`,
                    fontSize: `1.25em`,
                  }}
                  id="generate-button"
                  _hover={{ backgroundColor: `#5e544c` }}
                  onClick={() => generateTattooIdea()}
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner /> : "Generate"}
                </Button>
              </HStack>
            </VStack>
            {/* <VStack>
              <br />
              <Heading as="h2" sx={{ fontSize: `1.5rem`, fontWeight: `500` }}>
                Select Speed & Magic
              </Heading>
              <Text sx={{maxWidth: `30rem`}}>
                Tattoo Jenny makes multiple drafts to produce a tattoo. Speed
                refers to how many times she goes over a draft, so less drafts = faster result, but less clarity. Jenny also
                essentially dreams these tattoos, so Magic controls how dreamy
                the output is - less dreamy = faster result.
              </Text>
              <HStack
                
                sx={{
                  flexDirection: [`column`, `row`],
                  alignContent: `center`,
                }}
              >
                <Select
                  placeholder="Select Speed"
                  value={speed}
                  onChange={(event) => setSpeed(event.target.value)}
                  sx={{
                    backgroundColor: `white`,
                    color: `#2E2925`,
                    borderRadius: `2px`,
                    width: `15rem`
                  }}
                >
                  <option value="very slow">Very Slow</option>
                  <option value="slow">Slow</option>
                  <option value="medium">Medium</option>
                  <option value="fast">Fast</option>
                  <option value="very fast">Very Fast</option>
                </Select>
                <Select
                  placeholder="Select Magic"
                  value={magic}
                  onChange={(event) => setMagic(event.target.value)}
                  sx={{
                    backgroundColor: `white`,
                    color: `#2E2925`,
                    borderRadius: `2px`,
                    width: `15rem`
                  }}
                >
                  <option value="very low">Very Low</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="very high">Very High</option>
                </Select>
              </HStack>
            </VStack> */}
            <HStack>
              <Text>Advanced Mode:</Text>
              <Switch
                color="red"
                value={isAdvancedMode}
                onChange={() => setIsAdvancedMode((v) => !v)}
              ></Switch>
            </HStack>
            <VStack sx={{ marginTop: `2rem` }}>
              <Heading as="h2" sx={{ fontSize: `1.5rem`, fontWeight: `500` }}>
                Select Style
              </Heading>
              <RadioGroup
                onChange={setStyle}
                className="radio-group"
                value={style}
              >
                <Grid
                  sx={{
                    gridTemplateColumns: [`1fr 1fr`, `1fr 1fr 1fr 1fr`],
                    gap: `1rem`,
                  }}
                >
                  <Radio value="normal">Normal</Radio>
                  <Radio value="old school">Old School</Radio>
                  <Radio value="neotraditional">Neotraditional</Radio>
                  <Radio value="fine line">Fine Line</Radio>
                  <Radio value="tribal">Tribal</Radio>
                  <Radio value="realism">Realism</Radio>
                  <Radio value="blackwork">Blackwork</Radio>
                  <Radio value="japanese">Japanese</Radio>
                  <Radio value="geometric">Geometric</Radio>
                  <Radio value="sketch">Sketchy</Radio>
                  <Radio value="cartoon">Cartoon</Radio>
                  <Radio value="watercolor">Watercolor</Radio>
                </Grid>
              </RadioGroup>
            </VStack>
          </Box>
        </VStack>
        {!isLoading && generatedTattoos.length > 0 && (
          <VStack sx={{ padding: `3rem 3rem`, paddingBottom: `2em` }}>
            <Heading as="h2" sx={{ textTransform: `uppercase` }}>
              {lastPrompt && `Your tattoo idea: ${lastPrompt}`}
            </Heading>
            <Grid sx={{ gridTemplateColumns: [`1fr`, `1fr 1fr 1fr`] }}>
              {generatedTattoos.map((tattoo, index) => {
                return (
                  <Image
                    src={`data:image/png;base64, ${tattoo.image}`}
                    key={index}
                    alt={tattooIdea}
                    sx={{ width: `100%` }}
                  />
                );
              })}
            </Grid>
          </VStack>
        )}
        <Box
          style={{
            width: `60ch`,
            maxWidth: `80vw`,
            textAlign: `center`,
            margin: `0 auto`,
          }}
        >
          <Text className="display-none-mobile">
            Coming up with tattoo ideas that are personal and meaningful can be
            difficult. Then, after you have your idea, it can be frustrating to
            tell your tattoo artist exactly what you want. This site makes it
            easy!
          </Text>
          <br />
          <Text className="display-none-mobile">
            Simply describe your tattoo idea, hit generate, and get tattoo ideas
            you can screenshot and send to your artist.
          </Text>
          <br />
          <Box
            sx={{
              backgroundColor: [`transparent`, `#fdf4e3`],
              padding: [`0em`, `2rem`],
            }}
          >
            <Heading as="h3" size="lg">
              Tattoo Jenny Do&apos;s:
            </Heading>
            <UnorderedList sx={{ textAlign: `left` }}>
              <ListItem
                sx={{
                  listStyle: `none`,
                  display: `inline-flex`,
                  alignItems: `center`,
                }}
              >
                <FaCheckSquare
                  style={{ color: `#4baf3c`, marginRight: `5px` }}
                />
                Generate Ideas for your next tattoo!
              </ListItem>
              <ListItem
                sx={{
                  listStyle: `none`,
                  display: `inline-flex`,
                  alignItems: `center`,
                }}
              >
                <FaCheckSquare
                  style={{ color: `#4baf3c`, marginRight: `5px` }}
                />
                Focus one one or two keywords
              </ListItem>
              <ListItem
                sx={{
                  listStyle: `none`,
                  display: `inline-flex`,
                  alignItems: `center`,
                }}
              >
                <FaCheckSquare
                  style={{ color: `#4baf3c`, marginRight: `5px` }}
                />
                Use an article (ie &#8220;a&#8221; or &#8220;the&#8221;)
              </ListItem>
            </UnorderedList>

            <br />

            <Heading as="h3" size="lg">
              Tattoo Jenny Do Not&apos;s:
            </Heading>
            <UnorderedList sx={{ textAlign: `left` }}>
              <ListItem
                sx={{
                  listStyle: `none`,
                  display: `inline-flex`,
                  alignItems: `center`,
                }}
              >
                <FaWindowClose style={{ color: `red`, marginRight: `5px` }} />
                Ask Me For Word Tattoos (ie &#8220;mom&#8221;)
              </ListItem>
              <ListItem
                sx={{
                  listStyle: `none`,
                  display: `inline-flex`,
                  alignItems: `center`,
                }}
              >
                <FaWindowClose style={{ color: `red`, marginRight: `5px` }} />
                Ask Me For Sex Related Designs
              </ListItem>
              <ListItem
                sx={{
                  listStyle: `none`,
                  display: `inline-flex`,
                  alignItems: `center`,
                }}
              >
                <FaWindowClose style={{ color: `red`, marginRight: `5px` }} />
                Detailed Pop Culture Characters
              </ListItem>
            </UnorderedList>
          </Box>
        </Box>
        <Box sx={{ minHeight: [`40vh`, `0`] }}></Box>
        <TattooJenny />
      </Box>
      <Footer />
    </>
  );
}
