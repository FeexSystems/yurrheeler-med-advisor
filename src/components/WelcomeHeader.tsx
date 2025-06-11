
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Brain, Heart, Shield } from "lucide-react";

interface WelcomeHeaderProps {
  onStartConsultation: () => void;
}

export const WelcomeHeader = ({ onStartConsultation }: WelcomeHeaderProps) => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-blue-600 rounded-full">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Yurrheeler
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          AI Medical Health Expert Agent
        </p>
        <p className="text-lg text-gray-500 max-w-4xl mx-auto">
          Comprehensive medical consultation across 16 specialties with human-level diagnostic accuracy 
          and evidence-based treatment recommendations
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="border-blue-200 hover:border-blue-300 transition-colors">
          <CardContent className="p-6 text-center">
            <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered Diagnostics</h3>
            <p className="text-gray-600 text-sm">
              Advanced pattern recognition across all medical specialties
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 hover:border-blue-300 transition-colors">
          <CardContent className="p-6 text-center">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Multi-Specialty Expertise</h3>
            <p className="text-gray-600 text-sm">
              16 medical specialties integrated for comprehensive care
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 hover:border-blue-300 transition-colors">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Evidence-Based Care</h3>
            <p className="text-gray-600 text-sm">
              Real-time integration of latest medical research and guidelines
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Button 
          onClick={onStartConsultation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Start Medical Consultation
        </Button>
        <p className="text-sm text-gray-500">
          For emergencies, please contact emergency services immediately
        </p>
      </div>
    </div>
  );
};
