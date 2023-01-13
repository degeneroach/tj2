import { Box, Image } from "@chakra-ui/react";

export default function TattooJenny() {
  return (
    <Box sx={{ position: `absolute`, bottom: `0`, right: `0` }}>
      <Image src="/tattoo-jenny.png" alt="Tattoo Jenny" width={["80vw", "30vw"]} />
    </Box>
  );
}
