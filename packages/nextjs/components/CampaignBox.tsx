"use client";

import React, { useState } from "react";
import { Box, Button, Grid, Image, Meter, ResponsiveContext } from "grommet";
import { InputBase, IntegerInput } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ExtendedCampaign } from "~~/types/campaignInterface";
import { ethToWei, weiToEth } from "~~/utils/convertEth";

interface CampaignBoxProps {
  campaign: ExtendedCampaign;
}

const fundRaisingAddress = deployedContracts[421614].Fundraising.address;

const CampaignBox: React.FC<CampaignBoxProps> = ({ campaign }) => {
  const [amount, setAmount] = useState<string>("");

  const { writeAsync: approve } = useScaffoldContractWrite({
    contractName: "StableCoin",
    functionName: "approve",
    args: [fundRaisingAddress, ethToWei(BigInt(amount))],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: contributeFr } = useScaffoldContractWrite({
    contractName: "Fundraising",
    functionName: "contribute",
    args: [BigInt(campaign.id), ethToWei(BigInt(amount))],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      window.location.reload();
    },
  });

  return (
    <Box className="text-xl text-black" pad="large" margin={{ horizontal: "medium" }} height="100%" width="80%">
      <Grid columns={["auto", "medium"]} gap="medium" width="full" height="full">
        <Box
          align="start"
          justify="start"
          gap="medium"
          margin={{ horizontal: "small", right: "large", vertical: "medium", top: "small" }}
          height="full" // Set height to 'full'
          width="80%"
        >
          <Box>
            <h1 className="text-2xl text-white">{campaign.title}</h1>
          </Box>
          <Box flex="grow">
            <h1 className="text-xl text-white">{campaign.description}</h1>
          </Box>
        </Box>
        <Box align="top" justify="center" width="100%" height="100%">
          <Box
            background="white"
            border={{ color: "#a3e635", size: "medium" }}
            round="medium"
            pad="small"
            margin={{ vertical: "small", right: "large" }}
            height="full"
            width="full"
          >
            <Box pad={{ bottom: "medium", horizontal: "medium" }}>
              <Box direction="row" justify="between" pad="small" margin={{ top: "medium" }}>
                <Box align="center">
                  <h1>Raised:</h1>
                  <h1>${weiToEth(campaign.currentAmount).toString()}</h1>
                </Box>
                <Box align="center">
                  <h1>Goal:</h1>
                  <h1>${weiToEth(campaign.goalAmount).toString()}</h1>
                </Box>
              </Box>
              <Meter
                background="#cbd5e1"
                color="#a3e635"
                type="bar"
                value={Number(campaign.currentAmount)}
                max={Number(campaign.goalAmount)}
              />
            </Box>
            {!campaign.finalized && (
              <>
                <Box pad="xsmall" align="center">
                  <h1 className="text-small ">Contribution amount in $</h1>
                  <InputBase name="Enter amount" value={amount} onChange={e => setAmount(e.toString())} />
                  <h1></h1>
                  <h1 className="text-xsmall leading-6 mt-2">
                    You will get 20% of your contribution back in T42 tokens
                  </h1>
                </Box>

                <Button
                  primary
                  color="#a3e635"
                  label="DONATE"
                  onClick={async () => {
                    await approve();
                    await contributeFr();
                  }}
                />
              </>
            )}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default CampaignBox;
