import React from "react";
import { Box, Image, Meter } from "grommet";
import { ExtendedCampaign } from "~~/types/campaignInterface";
import { weiToEth } from "~~/utils/convertEth";

interface ProjectCardProps {
  campaign: ExtendedCampaign;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ campaign }) => {
  return (
    <Box onClick={() => (window.location.href = `/clubs/${campaign.club}`)}>
      {campaign && (
        <Box
          width={{ max: "medium" }}
          border={{ color: "#a3e635", size: "medium" }}
          round="medium"
          pad="small"
          margin={{ bottom: "medium" }}
        >
          <Box pad="small" align="center">
            <Image src={`/42Hack/${campaign.club}.png`} fit="contain" />
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
                <h1>${weiToEth(campaign.currentAmount)}</h1>
              </Box>
              <Box>
                <h1>Goal:</h1>
                <h1>${weiToEth(campaign.goalAmount)}</h1>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProjectCard;
