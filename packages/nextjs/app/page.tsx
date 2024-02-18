// Import necessary components and icons
import Link from "next/link";
import { Box, Text } from "grommet";
import { Grommet } from "grommet";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

// Define the main component
const UnifiedPage: NextPage = () => {
  // List of clubs
  const clubs = [
    { id: "42pingpong", name: "42 Ping Pong Club" },
    { id: "42book", name: "42 Book Club" },
    // Add more clubs as needed
  ];

  return (
    <Grommet full>
      <Box margin="large">
        <h1>Main Page</h1>
        {/* Navigation links */}
        <ul>
          <li>
            <Link href="/home">Home</Link>
          </li>
          {/* Dynamically render club links using map */}
          {clubs.map(club => (
            <li key={club.id}>
              <Link href={`/clubs/${club.id}`}>{`Club: ${club.name}`}</Link>
            </li>
          ))}
        </ul>
      </Box>
    </Grommet>
  );
};

export default UnifiedPage; // Export the unified component
