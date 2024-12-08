'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';

export function PropertyFilters() {
  const [isOpen, setIsOpen] = useState(false);

  const FiltersContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="property-type">Property Type</Label>
          <Select>
            <SelectTrigger id="property-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Enter city or state" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Price Range</Label>
        <Slider defaultValue={[0, 1000000]} max={1000000} step={10000} />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>$0</span>
          <span>$1,000,000+</span>
        </div>
      </div>
      <Button className="w-full" onClick={() => setIsOpen(false)}>
        Apply Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile Filters */}
      <div className="mb-4 sm:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden sm:block">
        <FiltersContent />
      </div>
    </>
  );
}
