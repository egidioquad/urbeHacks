"use client";

import { useEffect, useState } from "react";
import { Event } from "@ethersproject/providers/lib/base-provider";
import { Box, Button, Calendar, DateInput, DropButton, Meter } from "grommet";
import type { NextPage } from "next";
import { set } from "nprogress";
import { InputBase, IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { UploadJsonToIPFS } from "~~/utilComponents/IPFSdeploy";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const Create: NextPage = () => {
  //const { write: createCampaign } = useContractWrite();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [club, setClub] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [timelock, setTimelock] = useState<bigint>(0n);
  const [timelockDate, setTimelockDate] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [count, setCount] = useState(0);

  const [goalAmountInt, setGoalAmountInt] = useState<bigint>(0n);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "Fundraising",
    functionName: "createCampaign",
    args: [ipfsHash, club, goalAmountInt, timelock],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      setIsLoading(false);
    },
  });

  const changeTime = (event: { value: string | string[] }) => {
    // Extract the value from the event object
    const nextValue = Array.isArray(event.value) ? event.value[0] : event.value;
    // Set the timelock state with the extracted value

    const date = new Date(nextValue);
    const millisecondsSinceEpoch = date.getTime();
    setTimelock(BigInt(millisecondsSinceEpoch));
  };

  const handleClick = async () => {
    if (/^\d+$/.test(goalAmount)) {
      const date = new Date(Number(timelock));
      const timestring = date.toISOString();
      const jsonData = {
        title,
        description,
        club,
        goalAmount,
        timestring,
      };
      setError(false);
      const cid = await UploadJsonToIPFS(jsonData);
      console.log("cid", cid);
      setIpfsHash(cid);

      const goalAmountBigInt = BigInt(goalAmount);
      setGoalAmountInt(goalAmountBigInt);
      setIsLoading(true);
      setCount(count + 1);
    } else {
      console.log("not sending transaction");
      setError(true);
    }
  };

  useEffect(() => {
    if (ipfsHash) {
      handleSubmit();
    } else console.log("ipfsHash is empty");
  }, [ipfsHash, count]);

  const handleSubmit = async () => {
    if (ipfsHash) await writeAsync();
    else {
      console.log("ipfsHash is empty");
      setTimeout(() => {
        handleSubmit();
      }, 5000);
    }
    setIsLoading(false);
  };

  return (
    <Box className="bg-lime-400" fill pad="large" align="center">
      <Box
        margin="large"
        background="white"
        pad={{ horizontal: "medium", vertical: "small" }}
        width={{ max: "500px" }}
        round="medium"
      >
        <Box align="center" justify="center" pad={{ vertical: "medium" }} gap="small">
          <h1 className="text-xl">KICK-OFF YOUR CAMPAIGN</h1>
        </Box>
        <Box gap="medium" margin={{ horizontal: "medium", vertical: "small" }} align="start">
          <Box align="start">
            <h1>Project Title</h1>
            <InputBase name="title" value={title} onChange={setTitle} />
          </Box>
          <Box align="start">
            <h1>Project Description</h1>
            <InputBase name="Project Description" value={description} onChange={setDescription} />
          </Box>
          <Box align="start">
            <h1>Goal Amount in $</h1>
            <InputBase name="goalAmount" value={goalAmount} onChange={value => setGoalAmount(value)} />
            {error && <p className="text-red-600">Please enter a valid number</p>}
          </Box>
          <Box align="start">
            <h1>Club Name</h1>
            <InputBase name="club" value={club} onChange={setClub} />
          </Box>
          <Box align="start">
            <h1>Timelock</h1>
            <DateInput
              format="mm/dd/yyyy"
              id="dateinput"
              name="dateinput"
              // value={timelock}
              onChange={event => {
                changeTime(event);
              }}
            />
          </Box>
        </Box>
        <Box pad="medium">
          <Button
            color="#a3e635"
            size="medium"
            //primary
            pad={{ horizontal: "xsmall", vertical: "small" }}
            label="Create Campaign"
            onClick={handleClick}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Create;
