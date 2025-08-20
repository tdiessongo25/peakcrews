"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity } from 'lucide-react';

interface UserActivityData {
  hour: number;
  users: number;
}

interface UserActivityChartProps {
  data: UserActivityData[];
  title?: string;
  description?: string;
}

export function UserActivityChart({ data, title = "Platform Usage by Hour", description = "User activity throughout the day" }: UserActivityChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}:00</p>
          <p className="text-blue-600 font-bold">
            {payload[0].value} active users
          </p>
        </div>
      );
    }
    return null;
  };

  const formatHour = (hour: number) => {
    return `${hour}:00`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="hour" 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={formatHour}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="users" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Peak Hour</p>
            <p className="text-lg font-bold text-blue-600">
              {data.length > 0 ? `${data.reduce((max, item) => item.users > max.users ? item : max).hour}:00` : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-lg font-bold">
              {data.reduce((sum, item) => sum + item.users, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Avg per Hour</p>
            <p className="text-lg font-bold">
              {Math.round(data.reduce((sum, item) => sum + item.users, 0) / data.length)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 