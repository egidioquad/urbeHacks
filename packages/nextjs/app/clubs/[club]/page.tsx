"use client";

import React from "react";
import { usePathname } from "next/navigation";
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

const ClubPage: NextPage = () => {
  const pathParts = usePathname().split("/");
  const id = pathParts[pathParts.length - 1];
  const { data: filteredCampaigns } = useScaffoldContractRead({
    contractName: "Fundraising",
    functionName: "getAllCampaignsByClub",
    args: [id],
  });

  return (
    <Box margin="large">
      <h1 className="text-2xl">{id}</h1>
      <h1 className="text-xl">Projects</h1>
      {filteredCampaigns && filteredCampaigns.length > 0 ? (
        filteredCampaigns.map((campaign: Campaign, index: number) => (
          <Box key={index} border={{ color: "brand", size: "small" }} pad="medium" margin={{ bottom: "medium" }}>
            <h1 className="text-lg">Creator: {campaign.creator}</h1>
            <h1 className="text-lg">IPFS: {campaign.ipfs}</h1>
            <h1 className="text-lg">Club: {campaign.club}</h1>
            <h1 className="text-lg">Goal Amount: {campaign.goalAmount.toString()}</h1>{" "}
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

export default ClubPage;
