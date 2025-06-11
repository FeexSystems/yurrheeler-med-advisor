
import { useState } from "react";
import { ConsultationInterface } from "@/components/ConsultationInterface";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { SpecialtyGrid } from "@/components/SpecialtyGrid";

const Index = () => {
  const [consultationStarted, setConsultationStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {!consultationStarted ? (
          <div className="space-y-8">
            <WelcomeHeader onStartConsultation={() => setConsultationStarted(true)} />
            <SpecialtyGrid />
          </div>
        ) : (
          <ConsultationInterface onBack={() => setConsultationStarted(false)} />
        )}
      </div>
    </div>
  );
};

export default Index;
