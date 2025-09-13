'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

export interface DashboardCellProps {
  // ReactNode is the type for the icon we use as prop
  icon: ReactNode;
  number: string | number;
  label: string;
}

export function DashboardCell({ icon, number, label }: DashboardCellProps) {
  return (
    <Card className="flex flex-col items-center justify-center">
      <CardHeader className="flex flex-col gap-4 p-3 items-center">
        {icon}
        <span className="text-2xl font-bold">{number}</span>
      </CardHeader>

      <CardContent className="text-sm text-center text-muted-foreground -mt-8">
        {label}
      </CardContent>
    </Card>
  );
}
