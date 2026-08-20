import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, User, Activity, AlertCircle, Heart } from 'lucide-react';
import { toast } from 'sonner';

export const UserProfileDashboard: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Patient profile updated successfully.");
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Patient Profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage patient clinical information and medical history.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </div>

      <Tabs defaultValue="demographics" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Basic Information
              </CardTitle>
              <CardDescription>Enter essential patient demographic details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" defaultValue="1980-05-15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Biological Sex</Label>
                  <Select defaultValue="male">
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select defaultValue="o_pos">
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a_pos">A+</SelectItem>
                      <SelectItem value="a_neg">A-</SelectItem>
                      <SelectItem value="b_pos">B+</SelectItem>
                      <SelectItem value="b_neg">B-</SelectItem>
                      <SelectItem value="ab_pos">AB+</SelectItem>
                      <SelectItem value="ab_neg">AB-</SelectItem>
                      <SelectItem value="o_pos">O+</SelectItem>
                      <SelectItem value="o_neg">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-500" />
                Medical History
              </CardTitle>
              <CardDescription>Record chronic conditions, allergies, and current medications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies (Comma separated)</Label>
                <Input id="allergies" placeholder="Penicillin, Peanuts, Latex" defaultValue="Penicillin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conditions">Chronic Medical Conditions</Label>
                <Textarea id="conditions" placeholder="e.g., Type 2 Diabetes, Hypertension" className="min-h-[100px]" defaultValue="Hypertension (diagnosed 2018), managed with medication." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications & Dosages</Label>
                <Textarea id="medications" placeholder="e.g., Lisinopril 10mg daily" className="min-h-[100px]" defaultValue="Lisinopril 10mg PO daily" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surgeries">Past Surgical History</Label>
                <Textarea id="surgeries" placeholder="e.g., Appendectomy (2010)" className="min-h-[100px]" defaultValue="Appendectomy (2015)" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifestyle" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-500" />
                Lifestyle Factors
              </CardTitle>
              <CardDescription>Social history impacting health outcomes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smoking">Smoking Status</Label>
                  <Select defaultValue="former">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never Smoked</SelectItem>
                      <SelectItem value="former">Former Smoker</SelectItem>
                      <SelectItem value="current">Current Smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alcohol">Alcohol Consumption</Label>
                  <Select defaultValue="occasional">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="occasional">Occasional / Social</SelectItem>
                      <SelectItem value="moderate">Moderate (1-2 drinks/day)</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exercise">Exercise Frequency</Label>
                  <Select defaultValue="1_3_days">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="1_3_days">1-3 Days/Week</SelectItem>
                      <SelectItem value="4_plus_days">4+ Days/Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input id="occupation" placeholder="e.g., Software Engineer" defaultValue="Software Engineer" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Emergency Contacts
              </CardTitle>
              <CardDescription>Primary contacts in case of clinical emergency.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ecName">Contact Name</Label>
                  <Input id="ecName" placeholder="Jane Doe" defaultValue="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ecRelation">Relationship</Label>
                  <Input id="ecRelation" placeholder="Spouse" defaultValue="Spouse" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ecPhone">Contact Phone</Label>
                  <Input id="ecPhone" type="tel" placeholder="+1 (555) 000-0000" defaultValue="+1 (555) 987-6543" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pcp">Primary Care Physician</Label>
                  <Input id="pcp" placeholder="Dr. Smith" defaultValue="Dr. Smith, MD" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
