import { TIP_CONTRACT_ADDRESS } from '@/constants/addresses';
import ABI from '@/contracts/TipContractABI.json';

export const useTipContract = () => {
  return {
    address: TIP_CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    chainId: 84532, // Base Sepolia chain ID
  };
};
