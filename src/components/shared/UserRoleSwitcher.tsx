
"use client";

import { useUser } from '@/contexts/UserContext';
import type { UserRole } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export default function UserRoleSwitcher() {
  const { role } = useUser();

  const handleRoleChange = (newRole: string) => {
    // Role switching functionality removed for now
    console.log('Role change requested:', newRole);
  };

  return (
    <div className="flex items-center space-x-2 p-1 bg-secondary/50 rounded-md">
      <Label htmlFor="role-switcher" className="text-xs text-secondary-foreground">View as:</Label>
      <Select value={role || undefined} onValueChange={handleRoleChange}>
        <SelectTrigger id="role-switcher" className="h-8 w-[120px] text-xs bg-card focus:ring-primary">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="guest">Guest</SelectItem>
          <SelectItem value="worker">Worker</SelectItem>
          <SelectItem value="hirer">Contractor</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
