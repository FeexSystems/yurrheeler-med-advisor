import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Activity,
  Sparkles,
  RefreshCw,
  Play,
  Square,
  AlertCircle,
  Radio,
  Wind,
  ShieldCheck,
  Stethoscope,
  Send,
  Sliders,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface VoiceAcousticTriageProps {
  onConsultSpecialist?: (specialty: string, initialNotes?: string) => void;
}

export const VoiceAcousticTriage: React.FC<VoiceAcousticTriageProps> = ({
  onConsultSpecialist
}) => {
  // Voice Recording / Speech Recognition States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Acoustic Cough & Breath Parameters
  const [coughSoundType, setCoughSoundType] = useState<string>("dry");
  const [durationDays, setDurationDays] = useState<number>(4);
  const [isNocturnal, setIsNocturnal] = useState<boolean>(true);
  const [hasFever, setHasFever] = useState<boolean>(false);
  const [shortnessOfBreath, setShortnessOfBreath] = useState<boolean>(false);
  const [userNotes, setUserNotes] = useState<string>("");

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Canvas Waveform Animation Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  // Speech Recognition Ref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + " ";
        }
        setSpeechTranscript(currentText.trim());
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Waveform Visualizer Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let step = 0;
    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isListening ? "#10b981" : isSpeaking ? "#6366f1" : "#64748b";
      ctx.beginPath();

      const bars = 40;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        const amplitude = isListening || isSpeaking
          ? Math.sin(step * 0.1 + i * 0.3) * 24 * Math.random() + 8
          : Math.sin(step * 0.05 + i * 0.2) * 4 + 2;

        const x = i * barWidth + barWidth / 2;
        ctx.moveTo(x, centerY - amplitude);
        ctx.lineTo(x, centerY + amplitude);
      }
      ctx.stroke();

      step++;
      animationFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening, isSpeaking]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser. You can type your symptoms below.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info("Microphone stopped");
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success("Listening... Speak your symptoms clearly");
      } catch {
        toast.error("Microphone permission denied or already active");
      }
    }
  };

  const handleSpeakText = (text: string) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown symbols for natural TTS
    const cleanText = text.replace(/[#*`_>-]/g, "").slice(0, 400);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleRunAcousticTriage = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/acoustic-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coughSoundType,
          durationDays,
          isNocturnal,
          fever: hasFever,
          shortnessOfBreath,
          notes: speechTranscript || userNotes || "Acoustic assessment requested."
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Acoustic analysis failed");
      }

      setAnalysisResult(data.analysis);
      toast.success("Acoustic respiratory assessment complete!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error assessing acoustics";
      toast.error(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border border-teal-500/30 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-teal-500 text-slate-950 font-bold px-2.5 py-0.5 text-xs uppercase tracking-wider">
                Feature 3 • Voice & Acoustics
              </Badge>
              <span className="text-xs text-teal-300 font-mono flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" /> Hands-Free Live Speech & Respiratory Acoustics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Voice Consultation & Acoustic Cough Triage
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Hands-free clinical voice dialogue with acoustic evaluation of cough mechanics (dry, productive, wheezing, stridor, barking) and respiratory distress markers.
            </p>
          </div>

          <Button
            onClick={toggleListening}
            className={`h-11 px-5 rounded-2xl font-bold text-xs shadow-lg flex items-center gap-2 transition-all ${
              isListening
                ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Stop Listening</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Start Hands-Free Voice</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Grid: Waveform & Controls (Left 5) vs Triage Report (Right 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice Audio Visualizer & Cough Parameters */}
        <div className="lg:col-span-5 space-y-4">
          {/* Audio Visualizer Card */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-500" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Live Audio Spectrum & Speech Capture
                  </CardTitle>
                </div>
                <Badge
                  className={`text-[10px] font-mono ${
                    isListening
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {isListening ? "RECORDING" : "STANDBY"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {/* Canvas Waveform */}
              <div className="bg-slate-950 rounded-xl p-3 flex items-center justify-center border border-slate-800">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={80}
                  className="w-full h-[80px]"
                />
              </div>

              {/* Speech Transcript Output */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Live Voice Transcript / Patient Input
                </label>
                <Textarea
                  value={speechTranscript}
                  onChange={(e) => setSpeechTranscript(e.target.value)}
                  placeholder="Your spoken words appear here in real-time, or type manually..."
                  rows={2}
                  className="text-xs rounded-xl resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cough & Acoustic Mechanics Configuration */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-indigo-500" />
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Acoustic Sound Classification
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Cough Quality Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Cough Acoustic Quality
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "dry", label: "Dry / Hacking", desc: "Non-productive, tickling" },
                    { id: "wet", label: "Wet / Productive", desc: "Phlegm, deep bubbling" },
                    { id: "wheezing", label: "Musical Wheezing", desc: "High-pitched expiratory" },
                    { id: "stridor", label: "Barking / Stridor", desc: "Harsh inspiratory seal-like" },
                  ].map((cq) => (
                    <button
                      key={cq.id}
                      onClick={() => setCoughSoundType(cq.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        coughSoundType === cq.id
                          ? "bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 font-bold shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <div className="text-xs font-bold">{cq.label}</div>
                      <div className="text-[10px] text-slate-500">{cq.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Symptom Duration</span>
                  <span className="text-teal-600 dark:text-teal-400">{durationDays} days</span>
                </div>
                <Slider
                  value={[durationDays]}
                  onValueChange={(val) => setDurationDays(val[0])}
                  min={1}
                  max={30}
                  step={1}
                  className="py-1"
                />
              </div>

              {/* Associated Clinical Flags */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Nocturnal Worsening (wakes at night)
                  </div>
                  <Switch checked={isNocturnal} onCheckedChange={setIsNocturnal} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Associated Fever (&gt;38°C)
                  </div>
                  <Switch checked={hasFever} onCheckedChange={setHasFever} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Shortness of Breath at Rest
                  </div>
                  <Switch checked={shortnessOfBreath} onCheckedChange={setShortnessOfBreath} />
                </div>
              </div>

              <Button
                onClick={handleRunAcousticTriage}
                disabled={isAnalyzing}
                className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs h-10 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Acoustic Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Execute Acoustic Triage</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Acoustic Respiratory Report Document */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm min-h-[500px] flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-500" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Acoustic Respiratory Triage Report
                  </CardTitle>
                </div>
                {analysisResult && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSpeakText(analysisResult)}
                    className="h-7 text-xs flex items-center gap-1.5"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                        <span>Mute Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-teal-500" />
                        <span>Play Voice Synthesis</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5 flex-1 flex flex-col">
              {isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border-2 border-teal-500 animate-pulse flex items-center justify-center text-teal-600">
                      <Wind className="w-7 h-7 animate-spin" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Evaluating Acoustic Waveforms & Pulmonary Mechanics
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Differentiating bronchospasm vs post-nasal drip vs pneumonia infiltrates from acoustic parameters...
                    </p>
                  </div>
                </div>
              ) : analysisResult ? (
                <div className="space-y-5 flex-1 flex flex-col justify-between">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed overflow-y-auto max-h-[480px] pr-2">
                    <ReactMarkdown>{analysisResult}</ReactMarkdown>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-teal-500" />
                      <span>Ready for pulmonary specialist consultation.</span>
                    </div>

                    {onConsultSpecialist && (
                      <Button
                        size="sm"
                        onClick={() => onConsultSpecialist("Pulmonology", `Acoustic analysis: ${coughSoundType} cough for ${durationDays} days.`)}
                        className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs h-8 px-4 rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Consult Dr. Thorne (Pulmonology)</span>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-slate-400">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <Mic className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Ready for Voice or Acoustic Assessment
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Click &quot;Start Hands-Free Voice&quot; to speak your symptoms or adjust cough parameters and click &quot;Execute Acoustic Triage&quot;.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
