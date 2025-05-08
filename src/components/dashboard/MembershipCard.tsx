
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

const MembershipCard = () => {
  const [autoRenew, setAutoRenew] = useState(true);
  
  return (
    <Card className="card-neumorph hover-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Membership Status</CardTitle>
        <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Expires on Dec 31, 2025</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="auto-renew" 
              checked={autoRenew}
              onCheckedChange={setAutoRenew}
            />
            <Label htmlFor="auto-renew" className="text-sm">Auto-renew membership</Label>
          </div>
          <div className="text-xs text-muted-foreground">
            {autoRenew 
              ? "Your membership will automatically renew 7 days before expiration" 
              : "You'll receive a reminder 14 days before your membership expires"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
