export interface Campaign {
  sender: string;
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
