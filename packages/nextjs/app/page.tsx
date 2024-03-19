"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Box, Button, Grid, Image } from "grommet";
import { Grommet } from "grommet";
import type { NextPage } from "next";
import ClubImage from "~~/components/ClubImage";
import ProjectCard from "~~/components/ProjectCard";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { Campaign, ExtendedCampaign } from "~~/types/campaignInterface";
import { GetFileFromIpfs } from "~~/utils/IPFS_Tools";
import clubDescriptions from "~~/utils/clubDescriptions";

const HomePage: NextPage = () => {
  const [topCampaigns, setTopCampaigns] = useState<ExtendedCampaign[]>([]);

  const { data: campaigns } = useScaffoldContractRead({
    contractName: "Fundraising",
    functionName: "getCampaigns",
  });

  useEffect(() => {
    const handleIPFS = async (topThreeCampaigns: Campaign[]) => {
      console.log("ciao");
      const allCampaigns: ExtendedCampaign[] = [];
      for (const campaign of topThreeCampaigns) {
        if (campaign.ipfs) {
          try {
            const ipfsData = await GetFileFromIpfs(campaign.ipfs);
            const extendedCampaign: ExtendedCampaign = {
              ...campaign,
              description: ipfsData.description,
              title: ipfsData.title,
            };
            allCampaigns.push(extendedCampaign);
          } catch (error) {
            console.error(`Error fetching data for campaign with IPFS hash ${campaign.ipfs}:`, error);
          }
        }
      }
      console.log("allcampaigns with title", allCampaigns);
      setTopCampaigns(allCampaigns);
    };

    if (campaigns && campaigns.length > 0) {
      const sortedCampaigns = [...campaigns].sort((a, b) => Number(b.currentAmount) - Number(a.currentAmount));
      const topThreeCampaigns = sortedCampaigns.slice(0, 3);
      console.log("topThreeCampaigns", topThreeCampaigns);
      handleIPFS(topThreeCampaigns);
    }
  }, [campaigns]);

  // Render the main component

  return (
    <Grommet>
      <Box background="#a3e635" height="auto" width="100%">
        <Box margin="large" width={{ max: "100%" }} align="center">
          <Grid columns={["2/3", "1/3"]} margin="small" gap="medium">
            <Box width={{ max: "xlarge" }} gap="medium" margin={{ top: "medium" }} align="start">
              <h1 className="text-4xl font-bold text-black text-left ">Empowering greatness, made easy.</h1>
              <h1 className="text-xl-black leading-relaxed max-w-2xl text-left">
                Support your community projects! Invest now and receive 42 tokens to access exclusive campus benefits.
                Get involved and make a difference today!
              </h1>
            </Box>
            <Box>
              <Image className="max-w-full" src="42Hack/handHeart.png" />
            </Box>
          </Grid>
          <Box margin="medium" align="center">
            <Box>
              <h1 className="text-2xl text-black">OUR CLUBS</h1>
            </Box>
            <Box width={{ max: "65%" }} pad="medium">
              <Grid columns={{ count: 6, size: "xsmall" }} gap="medium" fill="vertical">
                {Object.keys(clubDescriptions).map(club => (
                  <ClubImage club={club} />
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box margin="medium">
        <Box align="center">
          <h1 className="text-xl text-black">TOP CAMPAIGNS</h1>
        </Box>
        <Box margin="medium" align="center">
          <Grid columns={["1/3", "1/3", "1/3"]} gap="small">
            {topCampaigns && topCampaigns.length > 0 ? (
              topCampaigns.map((campaign: ExtendedCampaign, index: number) => (
                <Box key={index}>
                  <ProjectCard campaign={campaign} />
                </Box>
              ))
            ) : (
              <h1>No campaigns yet.</h1>
            )}
          </Grid>
        </Box>
        <Box align="center">
          <Button
            label="All Campaigns"
            size="medium"
            primary
            color="#a3e635"
            onClick={() => {
              window.location.href = "/projects";
            }}
          />
        </Box>
      </Box>
      <Box width="full" pad={{ vertical: "xl" }} background="#a3e635">
        <Image src="42Hack/footer.png" fit="contain" />
      </Box>
    </Grommet>
  );
};

export default HomePage; // Export the unified component
