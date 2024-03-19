"use client";

import React, { useState } from "react";
import { Box, Button, Grid, Image, Meter, ResponsiveContext } from "grommet";
import { InputBase, IntegerInput } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ExtendedCampaign } from "~~/types/campaignInterface";
import { ethToWei, weiToEth } from "~~/utils/convertEth";

interface CampaignBoxProps {
  index: number;
  campaign: ExtendedCampaign;
}

const fundRaisingAddress = deployedContracts[421614].Fundraising.address;

const CampaignBox: React.FC<CampaignBoxProps> = ({ index, campaign }) => {
  const [amount, setAmount] = useState("");

  const { writeAsync: approve } = useScaffoldContractWrite({
    contractName: "StableCoin",
    functionName: "approve",
    args: [fundRaisingAddress, BigInt(Math.pow(Number(amount), 18))],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: contributeFr } = useScaffoldContractWrite({
    contractName: "Fundraising",
    functionName: "contribute",
    args: [BigInt(index), ethToWei(amount)],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <Box pad="large" margin={{ horizontal: "medium" }} height="100%" width="900px">
      <Grid
        columns={['auto', 'medium']}
        gap="medium"
        width="900px"
        height="full"
      >
        <Box
          align="start"
          justify="start"
          gap="medium"
          margin={{ horizontal: "medium", right: "large", vertical: "medium", top: "small" }}
          height="full" // Set height to 'full'
        >
          <Box>
            <h1 className="text-xl text-black">About the project</h1>
          </Box>
          <Box flex="grow">
            <h1 className="text-black">{campaign.description}</h1>
          </Box>
        </Box>
        <Box align="end" justify="center" margin={{ top: "medium" }}>
          <Box
            background="white"
            width={{ max: "medium" }}
            border={{ color: "#a3e635", size: "medium" }}
            round="medium"
            pad="small"
            margin={{ vertical: "medium", right: "large" }}
            height="full"
          >
            <Box align="center" pad="small" margin={{ top: "medium" }}>
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
                  <h1>${weiToEth(campaign.currentAmount)}</h1>
                </Box>
                <Box>
                  <h1>Goal:</h1>
                  <h1>${weiToEth(campaign.goalAmount)}</h1>
                </Box>
              </Box>
            </Box>
            {!campaign.finalized && (
              <>
                <Box pad="small" align="center">
                  <h1 className="text-small ">Contribution amount in $</h1>
                  <IntegerInput name="Enter amount" value={amount} onChange={e => setAmount(e)} />
                  <h1 className="text-xsmall leading-3 mt-2 ">
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