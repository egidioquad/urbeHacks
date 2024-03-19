"use client";

import { useEffect, useState } from "react";
import { Box, Grid } from "grommet";
import type { NextPage } from "next";
import ProjectCard from "~~/components/ProjectCard";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { Campaign, ExtendedCampaign } from "~~/types/campaignInterface";
import { GetFileFromIpfs } from "~~/utils/IPFS_Tools";
import clubDescriptions from "~~/utils/clubDescriptions";

const Projects: NextPage = () => {
  const { data: campaigns } = useScaffoldContractRead({
    contractName: "Fundraising",
    functionName: "getCampaigns",
  });

  const [loading, setLoading] = useState(true);
  const [campaignsAll, setCampaignsAll] = useState<ExtendedCampaign[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const allCampaigns: ExtendedCampaign[] = [];
      if (campaigns) {
        for (const campaign of campaigns) {
          if (campaign.ipfs) {
            const ipfsData = await GetFileFromIpfs(campaign.ipfs);
            const extendedCampaign: ExtendedCampaign = {
              ...campaign,
              description: ipfsData.description,
              title: ipfsData.title,
            };
            allCampaigns.push(extendedCampaign);
          }
        }
        // Filter campaigns based on the club
        const filteredCampaigns = allCampaigns.filter(campaign =>
          Object.keys(clubDescriptions).includes(campaign.club),
        );

        console.log("filtered campaigns with title", filteredCampaigns);
        setCampaignsAll(filteredCampaigns);
        setLoading(false);
      }
    };

    fetchData();
  }, [campaigns]);

  return (
    <Box margin="large">
      <Box margin="medium">
        <h1 className="text-3xl">Discover Projects</h1>
      </Box>
      {loading ? (
        <Box align="center">
          <h1>Loading...</h1>
        </Box>
      ) : (
        <Grid columns={{ size: "medium" }} gap="small">
          {campaigns && campaigns.length > 0 ? (
            campaigns.map((campaign: Campaign, index: number) => (
              <Box key={index}>
                <ProjectCard campaign={campaignsAll[index]} />
              </Box>
            ))
          ) : (
            <h1>No campaigns yet.</h1>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Projects;
