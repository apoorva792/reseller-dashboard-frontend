
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

const WalletCard = () => {
  return (
    <Card className="card-neumorph hover-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Wallet Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-3xl font-bold">$2,458.50</div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Available for orders & subscriptions
            </div>
            <Button size="sm" className="bg-gold hover:bg-gold-600 text-navy">
              <ArrowUp className="mr-1 h-3 w-3" /> Recharge
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
