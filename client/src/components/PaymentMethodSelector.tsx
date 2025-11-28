
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Smartphone, Banknote } from 'lucide-react';

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PaymentMethodSelector = ({ value, onChange }: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Payment Method</Label>
      <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="card" id="card" />
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <Label htmlFor="card" className="cursor-pointer">Credit/Debit Card</Label>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="mpesa" id="mpesa" />
          <div className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-green-600" />
            <Label htmlFor="mpesa" className="cursor-pointer">M-Pesa</Label>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="cash" id="cash" />
          <div className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-gray-600" />
            <Label htmlFor="cash" className="cursor-pointer">Cash on Arrival</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
