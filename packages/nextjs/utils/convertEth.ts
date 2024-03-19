// Function to convert Ether to Wei as BigInt
export const ethToWei = (eth: string | bigint): bigint => {
  const ethValue = typeof eth === 'string' ? BigInt(eth) : eth;
  return ethValue * BigInt(1e18) as bigint;
};

// Function to convert Wei to Ether as BigInt
export const weiToEth = (wei: string | bigint): bigint => {
  const weiValue = typeof wei === 'string' ? BigInt(wei) : wei;
  return weiValue / BigInt(1e18) as bigint;
};
