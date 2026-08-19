import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ChatMessage } from '@/types/consultation';

interface SessionTrendsChartProps {
  messages: ChatMessage[];
}

export const SessionTrendsChart: React.FC<SessionTrendsChartProps> = ({ messages }) => {
  const chartData = useMemo(() => {
    // Generate synthetic confidence and risk scores based on chat progression
    let baseConfidence = 45;
    let baseRisk = 20;
    
    const modelMessages = messages.filter(m => m.role === 'model');
    
    // If no AI messages yet, show an empty state or base state
    if (modelMessages.length === 0) {
      return [
        { step: 'Start', confidence: 0, risk: 0 }
      ];
    }

    return modelMessages.map((msg, index) => {
      // Logic to adjust risk based on urgency flags or keywords
      const text = msg.text.toLowerCase();
      
      let riskDelta = 0;
      if (text.includes('critical') || text.includes('emergency') || text.includes('911')) {
        riskDelta = 50;
      } else if (text.includes('urgent')) {
        riskDelta = 30;
      } else if (text.includes('monitor')) {
        riskDelta = 10;
      } else {
        riskDelta = -5;
      }

      baseRisk = Math.min(100, Math.max(10, baseRisk + riskDelta));
      
      // Confidence generally increases as more messages (data) are exchanged
      baseConfidence = Math.min(98, baseConfidence + 10 + (Math.random() * 5));

      return {
        step: `Turn ${index + 1}`,
        confidence: Math.round(baseConfidence),
        risk: Math.round(baseRisk)
      };
    });
  }, [messages]);

  return (
    <Card className="border-slate-200/90 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 mt-4">
      <CardHeader className="pb-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
              Specialist Analytics
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
          Session confidence & risk assessment trends
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis dataKey="step" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
            <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" />
            <Area 
              type="monotone" 
              dataKey="confidence" 
              name="Confidence Score (%)" 
              stroke="#4f46e5" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorConfidence)" 
            />
            <Area 
              type="monotone" 
              dataKey="risk" 
              name="Risk Assessment (%)" 
              stroke="#e11d48" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRisk)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
