import { getContract, type PublicClient, type WalletClient } from 'viem';

import { BlockEstateABI, BlockEstateFactoryABI } from '../abis';
import { CONTRACT_ADDRESSES } from '../config';

export function getBlockEstateFactoryContract(
  publicClient: PublicClient,
  walletClient: WalletClient
) {
  return getContract({
    address: CONTRACT_ADDRESSES.BLOCK_ESTATE_FACTORY as `0x${string}`,
    abi: BlockEstateFactoryABI.abi,
    publicClient,
    walletClient,
  });
}

export function getBlockEstateContract(
  address: string,
  publicClient: PublicClient,
  walletClient: WalletClient
) {
  return getContract({
    address: address as `0x${string}`,
    abi: BlockEstateABI.abi,
    publicClient,
    walletClient,
  });
}

export async function tokenizeProperty(
  contract: ReturnType<typeof getBlockEstateFactoryContract>,
  metadataUri: string,
  quoteAsset: string,
  tokenIds: number[],
  prices: string[],
  supplies: number[],
  startTimestamp: number
): Promise<string> {
  const tx = await contract.write.createProperty([
    metadataUri,
    quoteAsset,
    tokenIds,
    prices,
    supplies,
    BigInt(startTimestamp),
  ]);
  const receipt = await tx.wait();
  return receipt.logs[0].address;
}
