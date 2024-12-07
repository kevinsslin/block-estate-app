'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, DollarSign, Home, MapPin, TrendingUp } from 'lucide-react';

import { Header } from '@/components/header';
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

// This would typically come from a database or API
const properties = [
  {
    id: 1,
    title: 'Luxury Apartment in Downtown',
    location: 'New York, NY',
    price: 500000,
    tokens: 10000,
    tokenPrice: 50,
    image: '/placeholder.svg?height=400&width=600',
    type: 'Residential',
    description:
      'Experience urban living at its finest with this luxurious downtown apartment. Featuring stunning city views, high-end finishes, and access to premium amenities.',
    tokensSold: 7500,
    annualReturn: 8.5,
    lastValuation: '2023-05-15',
  },
  {
    id: 2,
    title: 'Commercial Office Space',
    location: 'San Francisco, CA',
    price: 2000000,
    tokens: 20000,
    tokenPrice: 100,
    image: '/placeholder.svg?height=400&width=600',
    type: 'Commercial',
    description:
      "Prime commercial office space in the heart of San Francisco's business district. Ideal for startups or established companies looking for a prestigious address.",
    tokensSold: 15000,
    annualReturn: 7.2,
    lastValuation: '2023-06-01',
  },
  {
    id: 3,
    title: 'Beachfront Villa',
    location: 'Miami, FL',
    price: 1500000,
    tokens: 15000,
    tokenPrice: 100,
    image: '/placeholder.svg?height=400&width=600',
    type: 'Residential',
    description:
      "Escape to this stunning beachfront villa in Miami. With direct beach access, a private pool, and luxurious interiors, it's the perfect vacation home or investment property.",
    tokensSold: 10000,
    annualReturn: 9.1,
    lastValuation: '2023-05-30',
  },
];

export default function PropertyPage({ params }: { params: { id: string } }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');

  const property = properties.find((p) => p.id === Number.parseInt(params.id, 10));

  if (!property) {
    return <div>Property not found</div>;
  }

  const handleInvest = () => {
    // Here you would typically handle the investment logic
    console.log(`Investing ${investmentAmount} in ${property.title}`);
    setIsDialogOpen(false);
    setInvestmentAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
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
            <div className="mb-6 grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    <DollarSign className="mr-1 inline h-4 w-4" />
                    Property Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${property.price.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    <Home className="mr-1 inline h-4 w-4" />
                    Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{property.tokens.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    <DollarSign className="mr-1 inline h-4 w-4" />
                    Token Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${property.tokenPrice}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    <TrendingUp className="mr-1 inline h-4 w-4" />
                    Annual Return
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{property.annualReturn}%</div>
                </CardContent>
              </Card>
            </div>
            <Card className="mb-6">
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
