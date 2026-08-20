
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Thermometer, Heart, Activity } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface PatientVitals {
  temperature_c: number;
  heart_rate_bpm: number;
  bp_systolic?: number;
  bp_diastolic?: number;
  oxygen_saturation?: number;
}

export interface PatientDataPayload {
  age: number;
  gender: string;
  symptoms: string[];
  vitals: PatientVitals;
}

interface PatientIntakeProps {
  onSubmit: (data: PatientDataPayload) => void;
}

export const PatientIntake = ({ onSubmit }: PatientIntakeProps) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    symptoms: '',
    temperature: '',
    heartRate: '',
    systolic: '',
    diastolic: '',
    oxygenSat: ''
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.age || parseInt(formData.age) < 0 || parseInt(formData.age) > 130) {
      newErrors.push('Please enter a valid age (0-130)');
    }
    
    if (!formData.gender) {
      newErrors.push('Please select a gender');
    }
    
    if (!formData.symptoms.trim()) {
      newErrors.push('Please describe your symptoms');
    }
    
    if (!formData.temperature || parseFloat(formData.temperature) < 30 || parseFloat(formData.temperature) > 45) {
      newErrors.push('Please enter a valid temperature (30-45°C)');
    }
    
    if (!formData.heartRate || parseInt(formData.heartRate) < 30 || parseInt(formData.heartRate) > 220) {
      newErrors.push('Please enter a valid heart rate (30-220 bpm)');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const patientData = {
      age: parseInt(formData.age),
      gender: formData.gender,
      symptoms: formData.symptoms.split(',').map(s => s.trim()),
      vitals: {
        temperature_c: parseFloat(formData.temperature),
        heart_rate_bpm: parseInt(formData.heartRate),
        ...(formData.systolic && { bp_systolic: parseInt(formData.systolic) }),
        ...(formData.diastolic && { bp_diastolic: parseInt(formData.diastolic) }),
        ...(formData.oxygenSat && { oxygen_saturation: parseFloat(formData.oxygenSat) })
      }
    };

    onSubmit(patientData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="130"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="Enter age in years"
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea
                id="symptoms"
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                placeholder="Describe your symptoms (separate multiple symptoms with commas)"
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: chest pain, shortness of breath, dizziness
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Vital Signs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature" className="flex items-center space-x-1">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  <span>Temperature (°C)</span>
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  min="30"
                  max="45"
                  value={formData.temperature}
                  onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                  placeholder="36.5"
                />
              </div>

              <div>
                <Label htmlFor="heartRate" className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Heart Rate (bpm)</span>
                </Label>
                <Input
                  id="heartRate"
                  type="number"
                  min="30"
                  max="220"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
                  placeholder="70"
                />
              </div>
            </div>

            <Separator />
            
            <p className="text-sm text-gray-600 font-medium">Optional Measurements</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="systolic">Systolic BP</Label>
                <Input
                  id="systolic"
                  type="number"
                  min="60"
                  max="250"
                  value={formData.systolic}
                  onChange={(e) => setFormData({...formData, systolic: e.target.value})}
                  placeholder="120"
                />
              </div>

              <div>
                <Label htmlFor="diastolic">Diastolic BP</Label>
                <Input
                  id="diastolic"
                  type="number"
                  min="30"
                  max="150"
                  value={formData.diastolic}
                  onChange={(e) => setFormData({...formData, diastolic: e.target.value})}
                  placeholder="80"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="oxygenSat">Oxygen Saturation (%)</Label>
              <Input
                id="oxygenSat"
                type="number"
                min="50"
                max="100"
                value={formData.oxygenSat}
                onChange={(e) => setFormData({...formData, oxygenSat: e.target.value})}
                placeholder="98"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          type="submit" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Analyze & Get Recommendations
        </Button>
      </div>
    </form>
  );
};
