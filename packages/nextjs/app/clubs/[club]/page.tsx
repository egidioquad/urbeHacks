"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Box, Button } from "grommet";
import type { NextPage } from "next";
import { InputBase } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface Campaign {
  creator: string;
  ipfs: string;
  club: string;
  goalAmount: bigint;
  currentAmount: bigint;
  finalized: boolean;
  endCampaign: bigint;
}

interface CampaignBoxProps {
  index: number;
  campaign: Campaign;
}

const fundRaisingAddress = deployedContracts[421614].Fundraising.address;

const CampaignBox: React.FC<CampaignBoxProps> = ({ index, campaign }) => {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");

  const { writeAsync: approve } = useScaffoldContractWrite({
    contractName: "StableCoin",
    functionName: "approve",
    args: [fundRaisingAddress, BigInt(amount)],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: contributeFr } = useScaffoldContractWrite({
    contractName: "Fundraising",
    functionName: "contribute",
    args: [BigInt(index), BigInt(amount)],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <Box border={{ color: "brand", size: "small" }} pad="medium" margin={{ bottom: "medium" }}>
      <h1 className="text-lg">Creator: {campaign.creator}</h1>
      <h1 className="text-lg">IPFS: {campaign.ipfs}</h1>
      <h1 className="text-lg">Club: {campaign.club}</h1>
      <h1 className="text-lg">Goal Amount: {campaign.goalAmount.toString()}</h1>
      <h1 className="text-lg">Current Amount: {campaign.currentAmount.toString()}</h1>
      <h1 className="text-lg">Finalized: {campaign.finalized ? "Yes" : "No"}</h1>
      <h1 className="text-lg">End Campaign: {campaign.endCampaign.toString()}</h1>

      {!campaign.finalized && (
        <>
          <InputBase name="Enter amount" value={amount} onChange={setAmount} />
          <Button
            label="Contribute ;-)"
            onClick={async () => {
              await approve();
              await contributeFr();
              setResult(`Function executed with amount: ${amount}`);
            }}
          />
        </>
      )}

      {result && <p>{result}</p>}
    </Box>
  );
};

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
          <CampaignBox key={index} index={index} campaign={campaign} />
        ))
      ) : (
        <h1>No campaigns yet.</h1>
      )}
    </Box>
  );
};

export default ClubPage;
