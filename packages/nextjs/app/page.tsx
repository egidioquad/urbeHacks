"use client";

import Link from "next/link";
import { Box, Text } from "grommet";
import { Grommet } from "grommet";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <Grommet full>
      <Box margin="large">
        <h1>Ciao</h1>
      </Box>
    </Grommet>
  );
};

export default Home;
