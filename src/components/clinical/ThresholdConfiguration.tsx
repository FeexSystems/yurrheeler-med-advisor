import React from 'react';
import { useClinicalStore } from '@/clinical/store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';

export const ThresholdConfiguration: React.FC = () => {
  const thresholdAlerts = useClinicalStore(state => state.thresholdAlerts);
  const updateThresholds = useClinicalStore(state => state.updateThresholds);
  
  const [localThresholds, setLocalThresholds] = React.useState(thresholdAlerts);

  const handleSave = () => {
    updateThresholds(localThresholds);
  };

  const handleReset = () => {
    const defaults = {
      heartRate: { min: 50, max: 110 },
      systolicBP: { min: 90, max: 140 },
      diastolicBP: { min: 60, max: 90 },
      oxygenSaturation: { min: 94, max: 100 },
      temperature: { min: 36.1, max: 37.8 },
    };
    setLocalThresholds(defaults);
    updateThresholds(defaults);
  };

  const handleChange = (metric: keyof typeof localThresholds, boundary: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    setLocalThresholds(prev => ({
      ...prev,
      [metric]: {
        ...prev[metric],
        [boundary]: numValue
      }
    }));
  };

  const renderMetricInput = (label: string, metric: keyof typeof localThresholds, step: string = "1") => (
    <div className="grid grid-cols-4 items-center gap-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <Label className="col-span-2 font-medium text-slate-700 dark:text-slate-300">{label}</Label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Min</span>
        <Input 
          type="number" 
          step={step}
          value={localThresholds[metric].min} 
          onChange={(e) => handleChange(metric, 'min', e.target.value)}
          className="h-8 text-xs font-mono"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Max</span>
        <Input 
          type="number" 
          step={step}
          value={localThresholds[metric].max} 
          onChange={(e) => handleChange(metric, 'max', e.target.value)}
          className="h-8 text-xs font-mono"
        />
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold">
          <Settings2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          <span>Configure Alerts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Critical Alert Thresholds</DialogTitle>
          <DialogDescription>
            Configure the physiological boundaries that trigger automated warnings for active specialist agents.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          {renderMetricInput("Heart Rate (bpm)", "heartRate")}
          {renderMetricInput("Systolic BP (mmHg)", "systolicBP")}
          {renderMetricInput("Diastolic BP (mmHg)", "diastolicBP")}
          {renderMetricInput("SpO2 (%)", "oxygenSaturation")}
          {renderMetricInput("Temperature (°C)", "temperature", "0.1")}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs">
            Reset Defaults
          </Button>
          <DialogTrigger asChild>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm px-6">
              Save Configuration
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
};
