import React from "react";
import { Box, Grid, Image } from "grommet";

const LandingPage = () => {
  return (
    <Box margin="large" fill>
      <Grid columns={["2/4", "1/3"]} margin="medium" gap="medium">
        <Box width={{ max: "xlarge" }} gap="medium" margin={{ top: "medium" }}>
          <h1 className="text-3xl font-bold text-black ">Empowering greatness, made easy.</h1>
          <h1 className="text-black leading-relaxed max-w-2xl">
            Support your community projects! Invest now and receive 42 tokens to access exclusive campus benefits. Get
            involved and make a difference today!
          </h1>
        </Box>
        <Box>
          <Image src="42Hack/handHeart.png" />
        </Box>
      </Grid>
    </Box>
  );
};

export default LandingPage;
