import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";

/**
 *
 * @param {*} items The array of tattoos to display
 * @param {*} canRate Whether or not the user can rate the tattoos
 * @param {*} canCherryPick Whether or not the user can cherry pick the tattoos
 * @param {*} voteTattoo The function to call when a user votes on a tattoo
 * @param {*} cherryPickTattoo The function to call when a user cherry picks a tattoo
 * @param {string} tab The tab the user is on
 * @returns
 */
export default function TattooGalleryItem(props) {
  const items = props?.items;
  const voteTattoo = props?.voteTattoo;
  const canRate = props?.canRate;
  const canCherryPick = props?.canCherryPick;
  const cherryPickTattoo = props?.cherryPickTattoo;
  const tab = props?.tab;

  return (
    <>
      <Box
        sx={{
          display: `grid`,
          gridTemplateColumns: [`1fr`, `1fr 1fr 1fr`],
        }}
      >
        {items.map((tattoo, index) => {
          return (
            <Box
              sx={{
                margin: `1rem`,
                outline: `2px solid orange`,
                display: `flex`,
                flexDirection: `column`,
              }}
              key={index}
            >
              <Heading as="h3" textAlign="center">
                {tattoo.prompt}
              </Heading>
              <Image src={tattoo.image} alt={`A tattoo of ${tattoo.prompt}`} />
              {tattoo?.style && (
                <HStack justifyContent={"center"}>
                  <Text>{tattoo?.style} style</Text>
                </HStack>
              )}
              {canRate && (
                <HStack justifyContent="space-between">
                  <HStack>
                    <Button
                      onClick={() => voteTattoo("downvote", tattoo)}
                      sx={{ color: `black` }}
                      _hover={{ color: `black` }}
                    >
                      <FaThumbsDown />
                    </Button>
                    <Text>{`${tattoo.upvotes - tattoo.downvotes}`}</Text>
                    <Button
                      onClick={() => voteTattoo("upvote", tattoo, tab)}
                      sx={{ color: `black` }}
                      _hover={{ color: `black` }}
                    >
                      <FaThumbsUp />
                    </Button>
                  </HStack>
                  {!canCherryPick && tattoo.isCherrypicked && (
                    <HStack>
                      <Text>Featured</Text>
                    </HStack>
                  )}
                  {canCherryPick && (
                    <HStack alignSelf="flex-end" padding="1rem">
                      {tattoo.isCherrypicked && (
                        <Button
                          onClick={() =>
                            cherryPickTattoo("remove", tattoo, tab)
                          }
                          sx={{
                            color: `white`,
                            backgroundColor: `red`,
                          }}
                          _hover={{
                            color: `white`,
                            outline: `2px solid red`,
                          }}
                        >
                          Remove
                        </Button>
                      )}
                      {!tattoo.isCherrypicked && (
                        <Button
                          onClick={() => cherryPickTattoo("add", tattoo)}
                          sx={{
                            color: `white`,
                            backgroundColor: `green`,
                          }}
                          _hover={{
                            color: `green`,
                            outline: `2px solid green`,
                          }}
                        >
                          Add
                        </Button>
                      )}
                    </HStack>
                  )}
                </HStack>
              )}
            </Box>
          );
        })}
      </Box>
    </>
  );
}
