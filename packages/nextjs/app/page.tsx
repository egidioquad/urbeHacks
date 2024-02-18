"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import LandingPage from "../utilComponents/landingPage";
import { Box, Button, Grid, Image, Meter } from "grommet";
import { Grommet } from "grommet";
import type { NextPage } from "next";
import { set } from "nprogress";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { GetFileFromIpfs } from "~~/utilComponents/IPFSdeploy";
import { Campaign, ExtendedCampaign } from "~~/utilComponents/campaignInterface";

// Define the main component
const UnifiedPage: NextPage = () => {
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
    <Grommet full>
      <Box background="#a3e635" height="auto" width="100%">
        <Box margin="large" fill width={{ max: "90%" }} align="center">
          <Grid columns={["2/3", "1/3"]} margin="small" gap="medium">
            <Box width={{ max: "xlarge" }} gap="medium" margin={{ top: "medium" }} align="start">
              <h1 className="text-3xl font-bold text-black text-left ">Empowering greatness, made easy.</h1>
              <h1 className="text-black leading-relaxed max-w-2xl text-left">
                Support your community projects! Invest now and receive 42 tokens to access exclusive campus benefits.
                Get involved and make a difference today!
              </h1>
            </Box>
            <Box>
              <Image className="max-w-full" src="42Hack/handHeart.png" />
            </Box>
          </Grid>
          <Box>
            <Box align="center">
              <h1 className="text-xl text-black">OUR CLUBS</h1>
            </Box>
            <Box width={{ max: "100%" }} pad="medium">
              <Grid columns={{ count: "fill", size: "xsmall" }} gap="medium" fill="horizontal">
                <Image
                  className="rounded-full"
                  src="42Hack/42BDE.png"
                  onClick={() => {
                    window.location.href = "/clubs/42BDE"; // Redirect to the desired URL
                  }}
                />
                <Image
                  className="rounded-full"
                  src="42Hack/42activities.png"
                  onClick={() => (window.location.href = "/clubs/42activities")}
                />
                <Image
                  className="rounded-full"
                  src="42Hack/42book.png"
                  onClick={() => (window.location.href = "/clubs/42book")}
                />
                <Image
                  className="rounded-full"
                  src="42Hack/42ciak.png"
                  onClick={() => (window.location.href = "/clubs/42ciak")}
                />
                <Image
                  className="rounded-full"
                  src="42Hack/42cybersecurity.png"
                  onClick={() => (window.location.href = "/clubs/42cybersecurity")}
                />
                <Image
                  className="rounded-full"
                  src="42Hack/42freelance.png"
                  onClick={() => (window.location.href = "/clubs/42freelance")}
                />
                <Image
                  className="rounded-full"
                  src="42Hack/42gaming.png"
                  onClick={() => (window.location.href = "/clubs/42gaming")}
                />
                <Image
                  className="rounded-full"
                  src="42Hack/42music.png"
                  onClick={() => (window.location.href = "/clubs/42music")}
                />
                <Image
                  className="rounded-full"
                  src="42Hack/42pingpong.png"
                  onClick={() => (window.location.href = "/clubs/42pingpong")}
                />
                <Image
                  className="rounded-full"
                  src="42Hack/42spaghetti.png"
                  onClick={() => (window.location.href = "/clubs/42spaghetti")}
                />
                <Image
                  className="rounded-full"
                  src="42Hack/42startup.png"
                  onClick={() => (window.location.href = "/clubs/42startup")}
                />
                <Image
                  className="rounded-full"
                  src="42Hack/42talk.png"
                  onClick={() => (window.location.href = "/clubs/42talk")}
                />
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

export default UnifiedPage; // Export the unified component

interface ProjectCardProps {
  campaign: ExtendedCampaign;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ campaign }) => {
  return (
    <Box onClick={() => (window.location.href = `/clubs/${campaign.club}`)}>
      {campaign && (
        <Box
          width={{ max: "medium" }}
          border={{ color: "#a3e635", size: "medium" }}
          round="medium"
          pad="small"
          margin={{ bottom: "medium" }}
        >
          <Box pad="small" align="center">
            <Image src={`/42Hack/${campaign.club}.png`} fit="contain" />
          </Box>
          <Box align="center" pad="small">
            <h1>{campaign.title}</h1>
          </Box>
          <Box pad={{ bottom: "medium", horizontal: "medium" }}>
            <Meter
              background="#cbd5e1"
              color="#a3e635"
              type="bar"
              value={Number(campaign.currentAmount)}
              max={Number(campaign.goalAmount)}
            />
            <Box direction="row" justify="between" pad="small" margin={{ top: "medium" }}>
              <Box>
                <h1>Raised:</h1>
                <h1>${campaign.currentAmount.toString()}</h1>
              </Box>
              <Box>
                <h1>Goal:</h1>
                <h1>${campaign.goalAmount.toString()}</h1>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
/* <h1>Main Page</h1>
        {/* Navigation links *
        <ul>
          <li>
            <Link href="/home">Home</Link>
          </li>
          {/* Dynamically render club links using map 
          {clubs.map(club => (
            <li key={club.id}>
              <Link href={`/clubs/${club.id}`}>{`Club: ${club.name}`}</Link>
            </li>
          ))}
        </ul> */
