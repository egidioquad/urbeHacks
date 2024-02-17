import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/* 
const externalContracts = {
  1: {
    DAI: {
      address: "0x...",
      abi: [...],
    },
  },
} as const; */

const externalContracts = {
  1: {
    Fundraising: {
      address: "0xb3423cb8aa4ac276b975ca3ab8e929f92d977bc4",
      abi: [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_newValue",
              type: "uint256",
            },
          ],
          name: "writeValue",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "value",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
