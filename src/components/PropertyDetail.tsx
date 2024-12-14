'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { erc20Abi, parseEther } from 'viem';
import {
  useAccount,
  useReadContract,
  useSimulateContract,
  useWriteContract,
  waitForTransactionReceipt,
} from 'wagmi';

import { PropertyStats } from '@/components/PropertyStats';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import type { PropertyWithTokens } from '@/lib/supabase/types';
import BlockEstateABI from '@/contracts/abis/BlockEstate.json';

interface PropertyDetailProps {
  property: PropertyWithTokens;
}

const DEFAULT_TBUSD_ADDRESS = '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814';

export function PropertyDetail({ property }: PropertyDetailProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const { address } = useAccount();

  // Use default tBUSD address if quote_asset_address is not available
  const quoteAssetAddress = property.quote_asset_address || DEFAULT_TBUSD_ADDRESS;

  // Get the first token for this property
  const token = property.tokens[0];

  // Calculate values based on token
  const price = token ? Number(token.price) || 0 : 0;
  const maxSupply = token ? token.max_supply || 0 : 0;
  const currentSupply = token ? token.current_supply || 0 : 0;
  const totalPrice = price * maxSupply;
  const tokenAmount = investmentAmount ? Math.floor(Number(investmentAmount) / price) : 0;
  const actualBUSDAmount = tokenAmount * price;

  // Get BUSD balance
  const { data: busdBalance } = useReadContract({
    address: quoteAssetAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    enabled: Boolean(address),
    watch: true,
  });

  // Format contract address with proper null checks
  const formattedContractAddress = property?.contract_address
    ? property.contract_address.startsWith('0x')
      ? `0x${property.contract_address.slice(2).replace(/^0+/, '')}`
      : `0x${property.contract_address.replace(/^0+/, '')}`
    : undefined;

  // Prepare BUSD approval
  const { data: approveData } = useSimulateContract(
    address && tokenAmount > 0 && actualBUSDAmount > 0 && formattedContractAddress
      ? {
          address: quoteAssetAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [
            formattedContractAddress as `0x${string}`,
            parseEther(actualBUSDAmount.toString() || '0'),
          ],
        }
      : undefined
  );

  // Prepare mint transaction
  const { data: mintData } = useSimulateContract(
    address && tokenAmount > 0 && formattedContractAddress && actualBUSDAmount > 0
      ? {
          address: formattedContractAddress as `0x${string}`,
          abi: BlockEstateABI.abi,
          functionName: 'mint',
          args: [address, token?.token_id || 0, tokenAmount],
        }
      : undefined
  );

  // Write contract hooks
  const { writeContractAsync: writeContract } = useWriteContract();

  const handleInvest = async () => {
    console.time('Investment process');

    try {
      if (!formattedContractAddress) {
        toast.error('Invalid contract address', {
          description: 'The property contract address is not properly configured',
        });
        return;
      }

      if (!address) {
        toast.error('Wallet not connected', {
          description: 'Please connect your wallet to invest in this property',
        });
        return;
      }

      const toastId = toast.loading('Preparing transaction...', {
        description: `Approving ${actualBUSDAmount.toLocaleString()} BUSD`,
      });

      console.log('=== Investment Details ===');
      console.log('Contract Address:', formattedContractAddress);
      console.log('BUSD Address:', quoteAssetAddress);
      console.log('User Address:', address);
      console.log('Amount:', actualBUSDAmount.toString(), 'BUSD');
      console.log('Token Amount:', tokenAmount);

      console.time('Balance check');
      const investmentAmountBN = parseEther(actualBUSDAmount.toString() || '0');
      const userBalance = busdBalance || BigInt(0);
      if (userBalance < investmentAmountBN) {
        toast.error('Insufficient BUSD balance', {
          description: `You need ${actualBUSDAmount.toLocaleString()} BUSD to make this investment`,
        });
        return;
      }
      console.timeEnd('Balance check');

      if (!tokenAmount || tokenAmount <= 0) {
        toast.error('Invalid investment amount', {
          description: `Minimum investment amount is ${price.toLocaleString()} BUSD`,
        });
        return;
      }

      if (tokenAmount + currentSupply > maxSupply) {
        toast.error('Exceeds available supply', {
          description: `Only ${maxSupply - currentSupply} tokens available for purchase`,
        });
        return;
      }

      console.time('Approval preparation');
      if (!approveData?.request) {
        console.error('Approval simulation failed:', {
          hasApproveData: !!approveData,
          contractAddress: formattedContractAddress,
          amount: actualBUSDAmount,
        });
        throw new Error('Failed to prepare approval transaction');
      }
      console.timeEnd('Approval preparation');

      console.log(`
=== Approval Transaction ===
Address: ${approveData.request.address}
Function: ${approveData.request.functionName}
Spender: ${approveData.request.args[0]}
Amount: ${approveData.request.args[1].toString()} wei
Chain ID: ${approveData.request.chainId}
      `);

      console.time('Approval transaction');
      try {
        console.log(`
=== Sending Approval Transaction ===
BUSD Address: ${approveData.request.address}
Spender: ${approveData.request.args[0]}
Amount: ${approveData.request.args[1].toString()} wei
        `);

        const hash = await writeContract({
          ...approveData.request,
          gas: BigInt(100000), // Explicitly set gas limit
        });

        console.log(`
=== Transaction Submitted ===
Hash: ${hash}
Waiting for confirmation...
        `);

        // Wait for transaction confirmation with timeout
        const { isSuccess: isApproved } = await waitForTransactionReceipt({
          hash,
          timeout: 30_000, // 30 second timeout
        });

        if (!isApproved) {
          throw new Error('Approval transaction failed or timed out');
        }

        console.log('=== Approval Confirmed ===');
      } catch (error) {
        console.error('Approval transaction error:', error);
        toast.error('Approval transaction failed', {
          description: error instanceof Error ? error.message : 'Please try again later',
          id: toastId,
          duration: 5000,
        });
        throw error;
      }
      console.timeEnd('Approval transaction');

      toast.loading('Approval successful', {
        description: 'Preparing to purchase tokens...',
        id: toastId,
      });

      console.time('Mint preparation');
      if (!mintData?.request) {
        console.error('Mint simulation failed:', {
          hasMintData: !!mintData,
          contractAddress: formattedContractAddress,
          tokenId: token?.token_id,
          amount: tokenAmount,
        });
        throw new Error('Failed to prepare mint transaction');
      }
      console.timeEnd('Mint preparation');

      console.log(`
=== Mint Transaction ===
Address: ${mintData.request.address}
Function: ${mintData.request.functionName}
Token ID: ${mintData.request.args[1]}
Amount: ${mintData.request.args[2]}
Chain ID: ${mintData.request.chainId}
      `);

      console.time('Mint transaction');
      try {
        const hash = await writeContract(mintData.request);
        console.log(`
=== Transaction Submitted ===
Hash: ${hash}
Waiting for confirmation...
        `);
      } catch (error) {
        console.error('Mint transaction error:', error);
        toast.error('Mint transaction failed', {
          description: error instanceof Error ? error.message : 'Please try again later',
          id: toastId,
          duration: 5000,
        });
        throw error;
      }
      console.timeEnd('Mint transaction');

      console.timeEnd('Investment process');
      toast.success('Investment successful!', {
        description: `Successfully purchased ${tokenAmount} tokens for ${actualBUSDAmount.toLocaleString()} BUSD`,
        id: toastId,
        duration: 6000,
      });

      setIsDialogOpen(false);
      setInvestmentAmount('');
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Transaction failed', {
        description: error instanceof Error ? error.message : 'Please try again later',
        id: toastId,
        duration: 5000,
      });
      throw error;
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number(value);

    // Basic validation
    if (value === '') {
      setInvestmentAmount('');
      return;
    }

    if (isNaN(numValue)) {
      toast.error('Invalid input', {
        description: 'Please enter a valid number',
      });
      return;
    }

    if (numValue < 0) {
      toast.error('Invalid amount', {
        description: 'Investment amount cannot be negative',
      });
      return;
    }

    if (numValue < price) {
      toast.error('Amount too low', {
        description: `Minimum investment amount is ${price.toLocaleString()} BUSD`,
      });
      return;
    }

    const potentialTokens = Math.floor(numValue / price);
    if (potentialTokens + currentSupply > maxSupply) {
      toast.error('Amount too high', {
        description: `Maximum available tokens: ${maxSupply - currentSupply}`,
      });
      return;
    }

    setInvestmentAmount(value);
  };

  // Try to parse metadata if it's a JSON string
  let description = property.metadata_uri;
  try {
    const metadata = JSON.parse(property.metadata_uri);
    description = metadata.description || property.metadata_uri;
  } catch {
    // If parsing fails, use the metadata_uri as is
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6 sm:py-12">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <div>
            <Image
              src={property.image_url}
              alt={property.address}
              width={600}
              height={400}
              className="h-[250px] w-full rounded-lg object-cover sm:h-[400px]"
            />
          </div>
          <div>
            <h1 className="mb-3 text-2xl font-bold text-blue-900 sm:mb-4 sm:text-4xl">
              {property.address}
            </h1>
            <div className="mb-3 flex items-center text-sm text-gray-600 sm:mb-4 sm:text-base">
              <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {property.address}
            </div>
            <Badge className="mb-3 sm:mb-4">{token.token_type}</Badge>
            <div className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
              <h2 className="mb-2 font-semibold">Total Value: ${totalPrice.toLocaleString()}</h2>
              <p>{description}</p>
            </div>

            <PropertyStats token={token} />

            <Card className="mb-4 mt-4 sm:mb-6 sm:mt-6">
              <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs font-medium sm:text-sm">
                  Token Sale Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <Progress value={(currentSupply / maxSupply) * 100} className="mb-2" />
                <div className="flex justify-between text-xs text-gray-600 sm:text-sm">
                  <span>{currentSupply.toLocaleString()} sold</span>
                  <span>{(maxSupply - currentSupply).toLocaleString()} remaining</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-gray-600 sm:text-sm">
                <Calendar className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />
                Start time: {new Date(property.start_timestamp).toLocaleString()}
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full sm:w-auto">
                    Invest Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Invest in {property.address}</DialogTitle>
                    <DialogDescription>
                      Enter the amount you&apos;d like to invest in this property. The minimum
                      investment is ${price.toLocaleString()}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="investment" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="investment"
                        type="number"
                        value={investmentAmount}
                        onChange={handleAmountChange}
                        placeholder={`Minimum ${price.toLocaleString()} BUSD`}
                        className="col-span-3"
                        min={price}
                        step={price}
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      This will purchase approximately{' '}
                      {investmentAmount ? Math.floor(Number(investmentAmount) / price) : 0} tokens.
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleInvest}>Confirm Investment</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
