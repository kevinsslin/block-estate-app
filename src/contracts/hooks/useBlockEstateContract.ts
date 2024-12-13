import { useEffect, useState } from 'react';
import { type GetContractReturnType } from 'viem';

import { BlockEstateFactoryABI } from '../abis';
import { useWeb3 } from '../context/Web3Context';
import { getBlockEstateFactoryContract } from '../utils/contractHelpers';

export function useBlockEstateContract() {
  const [contract, setContract] = useState<GetContractReturnType<
    typeof BlockEstateFactoryABI.abi
  > | null>(null);
  const { publicClient, walletClient, isConnected, isWrongNetwork } = useWeb3();

  useEffect(() => {
    if (!publicClient || !walletClient || !isConnected || isWrongNetwork) {
      setContract(null);
      return;
    }

    const contract = getBlockEstateFactoryContract(publicClient, walletClient);
    setContract(contract);
  }, [publicClient, walletClient, isConnected, isWrongNetwork]);

  return {
    contract,
    isConnected,
    isWrongNetwork,
  };
}
