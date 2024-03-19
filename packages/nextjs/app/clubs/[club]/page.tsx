"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Box, Grid, Image, ResponsiveContext } from "grommet";
import type { NextPage } from "next";
import CampaignBox from "~~/components/CampaignBox";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { Campaign, ExtendedCampaign } from "~~/types/campaignInterface";
import { GetFileFromIpfs } from "~~/utils/IPFS_Tools";
import clubDescriptions from "~~/utils/clubDescriptions";

const ClubPage: NextPage = () => {
  const pathParts = usePathname().split("/");
  const club = pathParts[pathParts.length - 1];

  const { data: filteredCampaigns } = useScaffoldContractRead({
    contractName: "Fundraising",
    functionName: "getAllCampaignsByClub",
    args: [club],
  });

  const [campaignsByClub, setCampaignsByClub] = useState<ExtendedCampaign[]>([]);

  useEffect(() => {
    const handleIPFS = async (filteredCampaigns: Campaign[]) => {
      const allCampaigns: ExtendedCampaign[] = [];
      for (const campaign of filteredCampaigns) {
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
      setCampaignsByClub(allCampaigns);
    };

    if (filteredCampaigns) {
      const campaignsArray: Campaign[] = filteredCampaigns as Campaign[];
      handleIPFS(campaignsArray);
    }
  }, [filteredCampaigns]);

  const size = React.useContext(ResponsiveContext);

  return (
    <Box>
      <Box width="full" height="auto" background="#a3e635" direction="row" align="start">
        <Box pad="medium">
          <Box>
            <Image src={`/42Hack/${club}.png`} fit="contain" width="30%" style={{ borderRadius: 30 }} />
          </Box>
        </Box>
        <Box width={{ max: "50%" }} gap="medium" pad="medium">
          <h1 className="text-xl text-black ">About {club}</h1>
          {clubDescriptions[club] && (
            <Box gap="small">
              <h1 className="text-black leading-4">{clubDescriptions[club]}</h1>
            </Box>
          )}
        </Box>
      </Box>
      <Grid columns={size === "large" ? ["1/2", "1/2"] : "large"}>
        {campaignsByClub && campaignsByClub.length > 0 ? (
          campaignsByClub.map((campaign: ExtendedCampaign, index: number) => (
            <CampaignBox key={index} index={index} campaign={campaign} />
          ))
        ) : (
          <Box pad="large" margin="large">
            <h1>No campaigns yet.</h1>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default ClubPage;
