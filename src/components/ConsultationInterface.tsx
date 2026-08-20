
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PatientIntake } from "@/components/PatientIntake";
import { TriageResults } from "@/components/TriageResults";

interface ConsultationInterfaceProps {
  onBack: () => void;
}

interface PatientData {
  age: number;
  gender: string;
  symptoms: string[];
  vitals: {
    temperature_c: number;
    heart_rate_bpm: number;
    bp_systolic?: number;
    bp_diastolic?: number;
    oxygen_saturation?: number;
  };
}

interface TriageResult {
  urgency_level: string;
  recommended_specialty: string;
  confidence_score: number;
  immediate_actions: string[];
  follow_up_recommendations: string[];
}

export const ConsultationInterface = ({ onBack }: ConsultationInterfaceProps) => {
  const [currentStep, setCurrentStep] = useState<'intake' | 'results'>('intake');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  const handlePatientDataSubmit = async (data: PatientData) => {
    setPatientData(data);
    
    // Simulate triage analysis
    const mockTriageResult: TriageResult = {
      urgency_level: data.symptoms.some(s => s.toLowerCase().includes('chest pain') || s.toLowerCase().includes('difficulty breathing')) ? 'critical' : 'moderate',
      recommended_specialty: 'General Practice',
      confidence_score: 0.92,
      immediate_actions: [
        'Monitor vital signs closely',
        'Ensure patient comfort and safety',
        'Prepare for potential specialist consultation'
      ],
      follow_up_recommendations: [
        'Schedule follow-up in 24-48 hours',
        'Continue monitoring symptoms',
        'Contact healthcare provider if symptoms worsen'
      ]
    };

    setTriageResult(mockTriageResult);
    setCurrentStep('results');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Medical Consultation</h1>
      </div>

      <Card className="shadow-lg border-emerald-200 dark:border-slate-800">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-lg">
          <CardTitle className="text-xl">
            {currentStep === 'intake' ? 'Patient Information & Assessment' : 'Consultation Results'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {currentStep === 'intake' ? (
            <PatientIntake onSubmit={handlePatientDataSubmit} />
          ) : (
            patientData && triageResult && (
              <TriageResults 
                patientData={patientData} 
                triageResult={triageResult}
                onNewConsultation={() => {
                  setCurrentStep('intake');
                  setPatientData(null);
                  setTriageResult(null);
                }}
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};
