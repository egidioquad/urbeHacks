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
      address: "0xf00A9373Cd54Fd060CD31B81c21611558aE352ec",
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
