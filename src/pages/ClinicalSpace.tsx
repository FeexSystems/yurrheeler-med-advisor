import React, { Suspense, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Agent, agents, getAgentById } from '@/lib/agents';
import { Loader2, Activity, UserCheck } from 'lucide-react';
import { useClinicalStore } from '@/clinical/store';
import { ClinicalTimeline } from '@/components/clinical/ClinicalTimeline';
import { AgentDashboardSidebar } from '@/components/clinical/AgentDashboardSidebar';

const ClinicalEnvironment = React.lazy(() => import('@/spatial/scenes/ClinicalEnvironment'));

const ClinicalSpace: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('clinical-space');
  const [activeAgent, setActiveAgent] = React.useState<Agent>(agents[0]);
  
  const selectedRegion = useClinicalStore((state) => state.selectedRegion);
  const activeAgents = useClinicalStore((state) => state.activeAgents);
  const evidence = useClinicalStore((state) => state.evidence);

  // Handle navigation fallback if they click other tabs
  const handleSelectTab = (tab: string) => {
    if (tab !== 'clinical-space') {
      window.location.href = `/?tab=${tab}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors h-screen overflow-hidden">
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        activeAgent={activeAgent}
        onOpenAgentDrawer={() => handleSelectTab("agents")}
      />

      <div className="flex-1 flex flex-col w-full overflow-hidden relative">
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* Left Sidebar - Chat / Interactions */}
        <div className="w-full md:w-[400px] border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">Clinical Context</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-6">
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-4">
              <p>Select anatomical regions to explore relevant evidence and consult specialists.</p>
              
              <AgentDashboardSidebar />

              {selectedRegion && (
                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Targeted Region</div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <span className="capitalize font-semibold text-slate-800 dark:text-slate-200 text-sm">{selectedRegion}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center - 3D Environment */}
        <div className="flex-1 relative bg-slate-100 dark:bg-slate-950">
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          }>
            <ClinicalEnvironment />
          </Suspense>

          {/* Overlays */}
          <div className="absolute top-4 left-4 pointer-events-none">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white mix-blend-difference tracking-tight drop-shadow-sm">
              Clinical Spatial Intelligence
            </h1>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-300 mix-blend-difference mt-1">
              v2.0 // SPATIAL_ENVIRONMENT_ACTIVE
            </p>
          </div>
        </div>

        {/* Right Sidebar - Evidence / Agents */}
        <div className="w-full md:w-[350px] border-l border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] hidden lg:flex">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">Evidence & Signals</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {evidence.length === 0 ? (
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                <span className="text-slate-400 dark:text-slate-500 block mb-1">Awaiting clinical input</span>
                <span className="text-slate-600 dark:text-slate-300">No active evidence nodes to display.</span>
              </div>
            ) : (
              evidence.map(ev => (
                <div key={ev.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-sm space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ev.title}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-500">
                      {ev.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Source: {ev.source}
                  </div>
                  {ev.metadata && ev.metadata.temperature && (
                    <div className="text-[10px] bg-slate-50 dark:bg-slate-900 p-2 rounded-lg font-mono text-slate-500">
                      T:{ev.metadata.temperature}°C | HR:{ev.metadata.heartRate} | BP:{ev.metadata.systolic}/{ev.metadata.diastolic}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        </div>

        {/* Bottom Timeline */}
        <div className="h-48 md:h-56 flex-shrink-0 z-20">
          <ClinicalTimeline />
        </div>
      </div>
    </div>
  );
};

export default ClinicalSpace;
