import { Box } from "grommet";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Active Campaigns",
  description: "All active Campaigns",
});

const Projects: NextPage = () => {
  return (
    <Box margin="large">
      <h1>Projects</h1>
    </Box>
  );
};

export default Projects;
