"use client";

import { useEffect, useState } from "react";
import { Box, Button, DateInput } from "grommet";
import type { NextPage } from "next";
import { InputBase } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { UploadJsonToIPFS } from "~~/utils/IPFS_Tools";
import clubDescriptions from "~~/utils/clubDescriptions";
import { ethToWei } from "~~/utils/convertEth";

const Create: NextPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [club, setClub] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [timelock, setTimelock] = useState<bigint>(0n);
  const [ipfsHash, setIpfsHash] = useState("");
  const [error, setError] = useState(false);
  const [count, setCount] = useState(0);

  const [goalAmountInt, setGoalAmountInt] = useState<bigint>(0n);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "Fundraising",
    functionName: "createCampaign",
    args: [ipfsHash, club, goalAmountInt, timelock],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      window.location.reload();
    },
  });

  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
    event.target.style.height = "auto"; // Reset the height to auto
    event.target.style.height = `${event.target.scrollHeight}px`; // Set the height to the scrollHeight
  };

  const handleGoalAmount = async () => {
    setGoalAmountInt(ethToWei(BigInt(goalAmount)));
    console.log("Goal amount", goalAmount);
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
  };

  return (
    <Box className="bg-lime-400" fill pad="large" align="center">
      <Box
        margin="large"
        background="white"
        pad={{ horizontal: "medium", vertical: "small" }}
        width={{ min: "1000px" }}
        round="medium"
      >
        <Box align="center" justify="center" pad={{ vertical: "medium" }} gap="small">
          <h1 className="text-xl">KICK-OFF YOUR CAMPAIGN</h1>
        </Box>
        <Box gap="medium" margin={{ horizontal: "medium", vertical: "small" }} align="start">
          <Box align="start" width={{ min: "1000px" }}>
            <h1>Project Title</h1>
            <input
              name="title"
              value={title}
              onChange={event => setTitle(event.target.value)}
              style={{
                width: "1000px",
                padding: "8px",
                border: "none",
                outline: "none",
                borderBottom: "2px solid #000",
                resize: "none",
                overflow: "hidden",
                backgroundColor: "white",
              }}
            />          
          </Box>
          <Box align="start" width={{ min: "1000px" }}>
            <h1>Project Description</h1>
            <textarea
              name="description"
              value={description}
              onChange={handleDescription}
              style={{
                width: "1000px",
                padding: "8px",
                border: "none",
                outline: "none",
                borderBottom: "2px solid #000",
                wordWrap: "break-word",
                resize: "none",
                overflow: "hidden",
                backgroundColor: "white",
              }}
              rows={Math.max(1, description.split("\n").length)}
            />
          </Box>
          <Box align="start">
            <h1>Goal Amount in $</h1>
            <InputBase name="goalAmount" value={goalAmount} onChange={setGoalAmount} />
            {error && <p className="text-red-600">Please enter a valid number</p>}
          </Box>
          <Box align="start">
            <h1>Club Name</h1>
            <select
              value={club}
              onChange={e => setClub(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "white",
                border: "1px solid black",
              }}
            >
              <option value="" disabled>
                Select a Club
              </option>
              {Object.keys(clubDescriptions).map(clubKey => (
                <option
                  key={clubKey}
                  value={clubKey}
                  style={{
                    width: "100%",
                  }}
                >
                  {clubKey}
                </option>
              ))}
            </select>
          </Box>
          <Box align="start">
            <h1>Timelock</h1>
            <DateInput
              format="mm/dd/yyyy"
              id="dateinput"
              name="dateinput"
              onChange={({ value }) => {
                const selectedDate = new Date(value);
                const secondsFromEpoch = Math.floor(selectedDate.getTime() / 1000);
                setTimelock(BigInt(secondsFromEpoch));
              }}
            />
          </Box>
        </Box>
        <Box pad="medium">
          <Button
            color="#a3e635"
            size="medium"
            pad={{ horizontal: "xsmall", vertical: "small" }}
            label="Create Campaign"
            onClick={handleGoalAmount}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Create;
