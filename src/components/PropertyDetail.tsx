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
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Image
              src={property.image}
              alt={property.title}
              width={600}
              height={400}
              className="h-[400px] w-full rounded-lg object-cover"
            />
          </div>
          <div>
            <h1 className="mb-4 text-4xl font-bold text-blue-900">{property.title}</h1>
            <div className="mb-4 flex items-center text-gray-600">
              <MapPin className="mr-2 h-5 w-5" />
              {property.location}
            </div>
            <Badge className="mb-4">{property.type}</Badge>
            <p className="mb-6 text-gray-600">{property.description}</p>

            <PropertyStats property={property} />

            <Card className="mb-6 mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Token Sale Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(property.tokensSold / property.tokens) * 100} className="mb-2" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{property.tokensSold.toLocaleString()} sold</span>
                  <span>{(property.tokens - property.tokensSold).toLocaleString()} remaining</span>
                </div>
              </CardContent>
            </Card>

            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <Calendar className="mr-1 inline h-4 w-4" />
                Last valuation: {property.lastValuation}
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg">Invest Now</Button>
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
