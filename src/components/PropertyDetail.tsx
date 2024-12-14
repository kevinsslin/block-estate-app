'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { erc20Abi, parseEther } from 'viem';
import {
  useAccount,
  useReadContract,
  useSimulateContract,
  useWriteContract,
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
import { incrementTokenSupply } from '@/lib/supabase/queries';
import BlockEstateABI from '@/contracts/abis/BlockEstate.json';

interface PropertyDetailProps {
  property: PropertyWithTokens;
}

// const DEFAULT_TBUSD_ADDRESS = '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814';
const DEFAULT_TBUSD_ADDRESS = '0xf082c25fCF37da41486f5ba37cCb60Dae590b061';

export function PropertyDetail({ property }: PropertyDetailProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [metadata, setMetadata] = useState<{ description: string } | null>(null);
  const { address } = useAccount();

  // Fetch metadata when component mounts
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(property.metadata_uri);
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      }
    };
    
    if (property.metadata_uri) {
      fetchMetadata();
    }
  }, [property.metadata_uri]);

  // Use default tBUSD address if quote_asset_address is not available
  const quoteAssetAddress = property.quote_asset_address || DEFAULT_TBUSD_ADDRESS;

  // Get the first token for this property
  const token = property.tokens[0];
  console.log('Property token:', token);

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

  // Get BUSD allowance
  const { data: busdAllowance } = useReadContract({
    address: quoteAssetAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address as `0x${string}`, property.contract_address as `0x${string}`],
    enabled: Boolean(address) && Boolean(property.contract_address),
    watch: true,
  });

  // Format contract address with proper null checks
  const formattedContractAddress = property?.contract_address
    ? property.contract_address.startsWith('0x')
      ? `0x${property.contract_address.slice(2).replace(/^0+/, '')}`
      : `0x${property.contract_address.replace(/^0+/, '')}`
    : undefined;

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
    if (!address || !formattedContractAddress || !token) {
      toast.error('Please connect your wallet first');
      return;
    }

    const toastId = toast.loading('Processing investment...');
    console.time('Investment process');

    try {
      const requiredAmount = BigInt(actualBUSDAmount * 10**18); // Convert to wei
      
      console.log('=== BUSD Checks ===');
      console.log('BUSD Balance:', busdBalance?.toString());
      const myBalance = busdBalance ? busdBalance : 0;
      console.log('Current allowance:', busdAllowance?.toString());
      console.log('Required amount:', requiredAmount.toString());
      console.log('Has sufficient balance:', busdBalance !== undefined && busdBalance >= requiredAmount);
      console.log('Has sufficient allowance:', busdAllowance !== undefined && busdAllowance >= requiredAmount);
      
      // Check BUSD balance first
      if (busdBalance === undefined || myBalance < requiredAmount) {
        throw new Error(`Insufficient BUSD balance. You need ${(actualBUSDAmount).toLocaleString()} BUSD`);
      }
      
      // Then check if we have enough allowance
      if (busdAllowance === undefined || myBalance < requiredAmount) {
        console.log('Need to approve BUSD first');
        toast.loading('Approving BUSD...', { id: toastId });
        
        // Approve BUSD spending
        const hash = await writeContract({
          address: quoteAssetAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [formattedContractAddress, requiredAmount],
        });

        console.log('Approval transaction submitted:', hash);
        toast.loading('Waiting for approval confirmation...', { id: toastId });
        
        // Wait for approval transaction to be mined
        // The frontend will automatically update the allowance through the useReadContract hook
      }

      // Check allowance again after approval
      if (myBalance === undefined || myBalance < requiredAmount) {
        throw new Error('Insufficient allowance. Please try again.');
      }

      console.time('Mint transaction');
      toast.loading('Preparing mint transaction...', { id: toastId });

      // Prepare mint transaction parameters
      const mintParams = {
        address: formattedContractAddress as `0x${string}`,
        abi: BlockEstateABI.abi,
        functionName: 'mint',
        args: [
          address as `0x${string}`, // to: address of the buyer
          BigInt(token.token_id), // id: token ID to mint
          BigInt(tokenAmount), // amount: number of tokens to mint
        ],
        value: BigInt(0), // no ETH sent since we're using BUSD
      };

      console.log('=== Mint Parameters ===', mintParams);
      
      const mintHash = await writeContract(mintParams);
      
      console.log(`
=== Mint Transaction Submitted ===
Hash: ${mintHash}
      `);

      // Transaction submitted successfully
      toast.success('Transaction submitted!', {
        id: toastId,
        description: `Hash: ${mintHash}`,
      });

      // Close dialog and reset form
      setIsDialogOpen(false);
      setInvestmentAmount('');

      // Update the current supply in the database
      try {
        console.log('Attempting to update supply for token:', token);
        await incrementTokenSupply(token.token_id);
      } catch (updateError) {
        console.error('Failed to update supply:', updateError);
      }

    } catch (error) {
      console.error('Investment error:', error);
      setIsDialogOpen(false);
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
              <p className="whitespace-pre-line">{metadata?.description || 'Loading property description...'}</p>
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
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto"
                    disabled={new Date() < new Date(property.start_timestamp)}
                  >
                    {new Date() < new Date(property.start_timestamp) ? 'Coming Soon' : 'Invest Now'}
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
