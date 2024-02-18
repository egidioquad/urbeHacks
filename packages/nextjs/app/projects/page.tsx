"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Image, Meter } from "grommet";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { GetFileFromIpfs } from "~~/utilComponents/IPFSdeploy";

export interface Campaign {
  creator: string;
  ipfs: string;
  club: string;
  goalAmount: bigint; // Fix the type to bigint
  currentAmount: bigint;
  finalized: boolean;
  endCampaign: bigint;
}
export interface ExtendedCampaign extends Campaign {
  description: string;
  title: string;
}

const Projects: NextPage = () => {
  const { data: campaigns } = useScaffoldContractRead({
    contractName: "Fundraising",
    functionName: "getCampaigns",
  });

  const [loading, setLoading] = useState(true);
  const [campaignsAll, setCampaignsAll] = useState<ExtendedCampaign[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const allCampaigns: ExtendedCampaign[] = [];
      if (campaigns) {
        for (const campaign of campaigns) {
          if (campaign.ipfs) {
            const ipfsData = await GetFileFromIpfs(campaign.ipfs);
            const extendedCampaign: ExtendedCampaign = {
              ...campaign,
              description: ipfsData.description,
              title: ipfsData.title,
            };
            allCampaigns.push(extendedCampaign);
          }
        }
        console.log("allcampaigns with thitle", allCampaigns);
        setCampaignsAll(allCampaigns);
        setLoading(false);
      }
    };

    fetchData();
  }, [campaigns]);
  return (
    <Box margin="large">
      <Box margin="medium">
        <h1 className="text-3xl">Discover Projects</h1>
      </Box>
      <Grid columns={{ size: "medium" }} gap="small">
        {campaigns && campaigns.length > 0 ? (
          campaigns.map((campaign: Campaign, index: number) => (
            <Box>
              <ProjectCard campaign={campaignsAll[index]} />
            </Box>
          ))
        ) : (
          <h1>No campaigns yet.</h1>
        )}
      </Grid>
    </Box>
  );
};

export default Projects;

interface ProjectCardProps {
  campaign: ExtendedCampaign;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ campaign }) => {
  return (
    <Box>
      {campaign && (
        <Box
          width={{ max: "medium" }}
          border={{ color: "#a3e635", size: "medium" }}
          round="medium"
          pad="small"
          margin={{ bottom: "medium" }}
        >
          <Box pad="small" align="center">
            <Image src="/42Hack/42BDE.png" fit="contain" />
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
