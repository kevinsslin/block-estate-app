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
import { Slider } from '@/components/ui/slider';

export function PropertyFilters() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
      <Button className="w-full">Apply Filters</Button>
    </div>
  );
}
