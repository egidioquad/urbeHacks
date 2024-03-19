import React from "react";
import { Box, Image } from "grommet";
import clubDescriptions from "~~/utils/clubDescriptions";

const ClubImage: React.FC<{ club: string }> = ({ club }) => {
  return (
    <Box onClick={() => (window.location.href = `/clubs/${club}`)}>
      <Image
        key={club}
        style={{ borderRadius: 30 }}
        src={`42Hack/${club}.png`}
        title={clubDescriptions[club]}
      />    
    </Box>
  );
};

export default ClubImage;
