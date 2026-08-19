
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, CheckCircle, Clock, Stethoscope, 
  TrendingUp, FileText, Phone, RefreshCw 
} from "lucide-react";

interface PatientVitals {
  temperature_c: number;
  heart_rate_bpm: number;
  bp_systolic?: number;
  bp_diastolic?: number;
  oxygen_saturation?: number;
}

interface TriageResultsProps {
  patientData: {
    age: number;
    gender: string;
    symptoms: string[];
    vitals: PatientVitals;
  };
  triageResult: {
    urgency_level: string;
    recommended_specialty: string;
    confidence_score: number;
    immediate_actions: string[];
    follow_up_recommendations: string[];
  };
  onNewConsultation: () => void;
}

export const TriageResults = ({ patientData, triageResult, onNewConsultation }: TriageResultsProps) => {
  const getUrgencyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'urgent': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'moderate': return <TrendingUp className="w-5 h-5 text-yellow-600" />;
      default: return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const isCritical = triageResult.urgency_level.toLowerCase() === 'critical';

  return (
    <div className="space-y-6">
      {isCritical && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 font-medium">
            <strong>MEDICAL EMERGENCY DETECTED</strong>
            <br />
            Based on the symptoms, this requires immediate medical attention. 
            Please call emergency services (911) immediately or go to the nearest emergency room.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Assessment Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Patient:</span>
              <span className="font-medium">{patientData.age} year old {patientData.gender}</span>
            </div>
            
            <div>
              <span className="text-gray-600">Symptoms:</span>
              <div className="mt-1 space-y-1">
                {patientData.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-1">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Temperature:</span>
              <span className="font-medium">{patientData.vitals.temperature_c}°C</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Heart Rate:</span>
              <span className="font-medium">{patientData.vitals.heart_rate_bpm} bpm</span>
            </div>

            {patientData.vitals.bp_systolic && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Blood Pressure:</span>
                <span className="font-medium">
                  {patientData.vitals.bp_systolic}/{patientData.vitals.bp_diastolic} mmHg
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <span>AI Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Urgency Level:</span>
                <div className="flex items-center space-x-2">
                  {getUrgencyIcon(triageResult.urgency_level)}
                  <Badge className={getUrgencyColor(triageResult.urgency_level)}>
                    {triageResult.urgency_level.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Recommended Specialty:</span>
              <span className="font-medium">{triageResult.recommended_specialty}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">AI Confidence:</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${triageResult.confidence_score * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {Math.round(triageResult.confidence_score * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-700">Immediate Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {triageResult.immediate_actions.map((action, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-700">Follow-up Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {triageResult.follow_up_recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        {isCritical && (
          <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Call Emergency Services</span>
          </Button>
        )}
        
        <Button 
          onClick={onNewConsultation}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>New Consultation</span>
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>This AI assessment is for informational purposes only and does not replace professional medical advice.</p>
        <p>Always consult with a qualified healthcare provider for accurate diagnosis and treatment.</p>
      </div>
    </div>
  );
};
