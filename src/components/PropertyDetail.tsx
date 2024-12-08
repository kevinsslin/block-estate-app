'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';

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
import type { Property } from '@/types/property';

interface PropertyDetailProps {
  property: Property;
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');

  const handleInvest = () => {
    console.log(`Investing ${investmentAmount} in ${property.title}`);
    setIsDialogOpen(false);
    setInvestmentAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6 sm:py-12">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <div>
            <Image
              src={property.image}
              alt={property.title}
              width={600}
              height={400}
              className="h-[250px] w-full rounded-lg object-cover sm:h-[400px]"
            />
          </div>
          <div>
            <h1 className="mb-3 text-2xl font-bold text-blue-900 sm:mb-4 sm:text-4xl">
              {property.title}
            </h1>
            <div className="mb-3 flex items-center text-sm text-gray-600 sm:mb-4 sm:text-base">
              <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {property.location}
            </div>
            <Badge className="mb-3 sm:mb-4">{property.type}</Badge>
            <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
              {property.description}
            </p>

            <PropertyStats property={property} />

            <Card className="mb-4 mt-4 sm:mb-6 sm:mt-6">
              <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs font-medium sm:text-sm">
                  Token Sale Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <Progress value={(property.tokensSold / property.tokens) * 100} className="mb-2" />
                <div className="flex justify-between text-xs text-gray-600 sm:text-sm">
                  <span>{property.tokensSold.toLocaleString()} sold</span>
                  <span>{(property.tokens - property.tokensSold).toLocaleString()} remaining</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-gray-600 sm:text-sm">
                <Calendar className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />
                Last valuation: {property.lastValuation}
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full sm:w-auto">
                    Invest Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Invest in {property.title}</DialogTitle>
                    <DialogDescription>
                      Enter the amount you&apos;d like to invest in this property. The minimum
                      investment is ${property.tokenPrice}.
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
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="col-span-3"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      This will purchase approximately{' '}
                      {investmentAmount
                        ? Math.floor(Number(investmentAmount) / property.tokenPrice)
                        : 0}{' '}
                      tokens.
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
