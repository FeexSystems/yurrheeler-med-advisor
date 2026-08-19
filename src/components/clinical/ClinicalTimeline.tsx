import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useClinicalStore } from '@/clinical/store';
import { getAgentById } from '@/lib/agents';
import { 
  Activity, 
  User, 
  Brain, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText,
  HeartPulse,
  Info,
  Thermometer,
  ShieldAlert
} from 'lucide-react';
import { ClinicalEvent } from '@/clinical/types';

export const ClinicalTimeline: React.FC = () => {
  const events = useClinicalStore(state => state.clinicalEvents);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const getEventIcon = (type: ClinicalEvent['type']) => {
    switch (type) {
      case 'patient.input': return <User className="w-4 h-4 text-blue-500" />;
      case 'vital.recorded': return <HeartPulse className="w-4 h-4 text-rose-500" />;
      case 'agent.activated': return <Brain className="w-4 h-4 text-indigo-500" />;
      case 'agent.reasoning': return <Activity className="w-4 h-4 text-indigo-400" />;
      case 'anatomy.selected': return <Search className="w-4 h-4 text-teal-500" />;
      case 'evidence.retrieved': return <FileText className="w-4 h-4 text-amber-500" />;
      case 'evidence.connected': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'clinical.observation': return <Info className="w-4 h-4 text-blue-400" />;
      case 'clinical.warning': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'clinical.recommendation': return <ShieldAlert className="w-4 h-4 text-emerald-600" />;
      case 'consultation.completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getEventContent = (event: ClinicalEvent) => {
    switch (event.type) {
      case 'patient.input':
        return <span className="text-slate-800 dark:text-slate-200">Patient reported: "<span className="italic">{event.text}</span>"</span>;
      case 'vital.recorded':
        return <span className="text-slate-700 dark:text-slate-300">Vitals recorded via {event.source}</span>;
      case 'agent.activated': {
        const agent = getAgentById(event.agentId);
        return <span className="text-indigo-700 dark:text-indigo-300 font-medium">Activated {agent?.name || 'Specialist'} {event.reason && <span className="text-slate-500 font-normal">- {event.reason}</span>}</span>;
      }
      case 'agent.reasoning':
        return <span className="text-slate-600 dark:text-slate-400">{event.text || 'Analyzing clinical context...'}</span>;
      case 'anatomy.selected':
        return <span className="text-teal-700 dark:text-teal-300">Region targeted: <span className="font-semibold capitalize">{event.regionId.replace('-', ' ')}</span></span>;
      case 'evidence.retrieved':
        return <span className="text-amber-700 dark:text-amber-300">Retrieved evidence: {event.title || event.evidenceId}</span>;
      case 'clinical.observation':
        return <span className="text-slate-700 dark:text-slate-300">{event.text}</span>;
      case 'clinical.warning':
        return <span className="text-amber-700 dark:text-amber-400 font-medium">{event.text}</span>;
      case 'clinical.recommendation':
        return <span className="text-emerald-700 dark:text-emerald-400 font-medium">{event.text}</span>;
      case 'consultation.completed':
        return <span className="text-green-700 dark:text-green-400 font-bold">Consultation marked complete</span>;
      default:
        return <span className="text-slate-500">System event recorded</span>;
    }
  };

  const getEventDetails = (event: ClinicalEvent) => {
    if (event.type === 'vital.recorded' && event.details) {
      return (
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(event.details).map(([key, value]) => (
            <div key={key} className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">{key.replace(/_/g, ' ')}</div>
              <div className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">{String(value)}</div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">Clinical Timeline</h3>
        </div>
        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 font-mono">
          {events.length} EVENTS
        </span>
      </div>
      
      <div className="flex-1 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
            Awaiting clinical events...
          </div>
        ) : (
          <div className="flex gap-4 items-start min-w-max pb-2">
            <AnimatePresence>
              {events.map((event, index) => {
                const isSelected = selectedEventId === event.id;
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="relative flex flex-col"
                  >
                    {/* Connection line */}
                    {index < events.length - 1 && (
                      <div className="absolute top-4 left-[30px] w-full h-[2px] bg-slate-100 dark:bg-slate-800 -z-10" />
                    )}
                    
                    <button
                      onClick={() => setSelectedEventId(isSelected ? null : event.id)}
                      className={`
                        w-[280px] text-left rounded-xl border transition-all duration-200 p-3
                        ${isSelected 
                          ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 shadow-md ring-1 ring-blue-500/20' 
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          mt-0.5 p-1.5 rounded-lg flex-shrink-0
                          ${isSelected ? 'bg-white dark:bg-slate-900 shadow-sm' : 'bg-white dark:bg-slate-800'}
                        `}>
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-mono text-slate-400 uppercase">
                              {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 truncate max-w-[100px]" title={event.type.split('.')[1]}>
                              {event.type.split('.')[1]}
                            </span>
                          </div>
                          <div className="text-xs leading-relaxed line-clamp-3">
                            {getEventContent(event)}
                          </div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {isSelected && getEventDetails(event) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 mt-2 border-t border-blue-100 dark:border-blue-900/50">
                              {getEventDetails(event)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
