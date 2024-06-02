// Function to convert Ether to Wei as BigInt
export const ethToWei = (eth: bigint): bigint => {
  return BigInt(eth) * BigInt(1e18) as bigint;
};

// Function to convert Wei to Ether as BigInt
export const weiToEth = (wei: bigint): bigint => {
  return wei / BigInt(1e18) as bigint;
};
