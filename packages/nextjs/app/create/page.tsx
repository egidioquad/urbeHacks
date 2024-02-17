"use client";

import { useState } from "react";
import { Box, Button, Calendar, DropButton, Form, Meter } from "grommet";
import type { NextPage } from "next";
import { set } from "nprogress";
import { InputBase } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const ABI = "YourABI";

const Create: NextPage = () => {
  //const { write: createCampaign } = useContractWrite();

  const [title, setTitle] = useState("");
  const [club, setClub] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [timelock, setTimelock] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "Fundraising",
    functionName: "createCampaign",
    args: [title, club, goalAmount],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      setIsLoading(false);
    },
  });

  return (
    <Box className="bg-lime-400" pad="large">
      <Box margin="large" background="white" pad={{ horizontal: "large", vertical: "small" }}>
        <Box align="center" justify="center" pad={{ vertical: "medium" }} gap="small">
          <h1>KICK-OFF YOUR CAMPAIGN</h1>
        </Box>
        <Box gap="medium" margin={{ horizontal: "large", vertical: "small" }}>
          <Box>
            <h1>Project Title</h1>
            <InputBase name="title" value={title} onChange={setTitle} />
          </Box>
          <Box>
            <h1>Club Name</h1>
            <InputBase name="club" value={club} onChange={setClub} />
          </Box>
          <InputBase name="goalAmount" value={goalAmount} onChange={setGoalAmount} />
          <Box>
            <InputBase name="timelock" value={timelock} onChange={setTimelock} />
            {/*           <Calendar size="small" animate date={new Date().toISOString()} onSelect={date => {}} />
             */}
          </Box>
          <Button
            primary
            label="Create Campaign"
            onClick={() => {
              writeAsync();
            }}
          />
        </Box>
        <Box>
          <Meter type="bar" value={100} max={200} size="small" color="brand" />
        </Box>
      </Box>
    </Box>
  );
};

export default Create;
