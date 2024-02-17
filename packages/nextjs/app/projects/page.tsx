"use client";

import React from "react";
import { Box } from "grommet";
import type { NextPage } from "next";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface Campaign {
  creator: string;
  ipfs: string;
  club: string;
  goalAmount: bigint; // Fix the type to bigint
  currentAmount: bigint;
  finalized: boolean;
  endCampaign: bigint;
}

const Projects: NextPage = () => {
  const { data: campaigns } = useScaffoldContractRead({
    contractName: "Fundraising",
    functionName: "getCampaigns",
  });

  return (
    <Box margin="large">
      <h1 className="text-xl">Projects</h1>
      {campaigns && campaigns.length > 0 ? (
        campaigns.map((campaign: Campaign, index: number) => (
          <Box key={index} border={{ color: "brand", size: "small" }} pad="medium" margin={{ bottom: "medium" }}>
            <h1 className="text-lg">Creator: {campaign.creator}</h1>
            <h1 className="text-lg">IPFS: {campaign.ipfs}</h1>
            <h1 className="text-lg">Club: {campaign.club}</h1>
            <h1 className="text-lg">Goal Amount: {campaign.goalAmount.toString()}</h1>{" "}
            {/* Convert bigint to string for display */}
            <h1 className="text-lg">Current Amount: {campaign.currentAmount.toString()}</h1>
            <h1 className="text-lg">Finalized: {campaign.finalized ? "Yes" : "No"}</h1>
            <h1 className="text-lg">End Campaign: {campaign.endCampaign.toString()}</h1>
          </Box>
        ))
      ) : (
        <h1>No campaigns yet.</h1>
      )}
    </Box>
  );
};

export default Projects;
