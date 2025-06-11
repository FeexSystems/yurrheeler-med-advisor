
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, Brain, Baby, Eye, Bone, 
  Microscope, Pill, Flower, Activity,
  Stethoscope, Zap, Droplets, Circle,
  Shield, Wind, Users
} from "lucide-react";

const specialties = [
  { name: "General Practice", icon: Stethoscope, color: "text-blue-600" },
  { name: "Cardiology", icon: Heart, color: "text-red-500" },
  { name: "Neurology", icon: Brain, color: "text-purple-600" },
  { name: "Oncology", icon: Shield, color: "text-orange-600" },
  { name: "Endocrinology", icon: Activity, color: "text-green-600" },
  { name: "Dermatology", icon: Flower, color: "text-pink-500" },
  { name: "Psychiatry", icon: Brain, color: "text-indigo-600" },
  { name: "Pediatrics", icon: Baby, color: "text-yellow-600" },
  { name: "OB/GYN", icon: Users, color: "text-purple-500" },
  { name: "Urology", icon: Droplets, color: "text-blue-500" },
  { name: "Pulmonology", icon: Wind, color: "text-teal-600" },
  { name: "Orthopedics", icon: Bone, color: "text-gray-600" },
  { name: "Gastroenterology", icon: Circle, color: "text-amber-600" },
  { name: "Nephrology", icon: Droplets, color: "text-cyan-600" },
  { name: "Ophthalmology", icon: Eye, color: "text-emerald-600" },
  { name: "Infectious Disease", icon: Microscope, color: "text-red-600" }
];

export const SpecialtyGrid = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Medical Specialties</h2>
        <p className="text-gray-600">Comprehensive expertise across all major medical fields</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {specialties.map((specialty, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-gray-200 hover:border-blue-300"
          >
            <CardContent className="p-4 text-center">
              <specialty.icon className={`w-8 h-8 mx-auto mb-2 ${specialty.color}`} />
              <p className="text-xs font-medium text-gray-700">{specialty.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
