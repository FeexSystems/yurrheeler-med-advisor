import React from 'react';
import { useClinicalStore } from '@/clinical/store';
import { agents } from '@/lib/agents';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'motion/react';

export const AgentDashboardSidebar: React.FC = () => {
  const activeAgents = useClinicalStore(state => state.activeAgents);
  const activateAgent = useClinicalStore(state => state.activateAgent);
  const deactivateAgent = useClinicalStore(state => state.deactivateAgent);

  return (
    <div className="space-y-3">
      <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
        Specialist Agents ({activeAgents.length}/{agents.length} Active)
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
        {agents.map((agent) => {
          const isActive = activeAgents.includes(agent.id);

          return (
            <motion.div 
              key={agent.id} 
              layout
              initial={false}
              className={`flex flex-col gap-2 p-3 rounded-xl border transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 shadow-sm' 
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={agent.avatar_url} alt={agent.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <AnimatePresence>
                        {isActive && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" 
                          />
                        )}
                      </AnimatePresence>
                      <span className={`font-bold text-sm transition-colors duration-300 ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>
                        {agent.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {agent.specialty}
                    </span>
                  </div>
                </div>
                <Switch 
                  checked={isActive} 
                  onCheckedChange={(checked) => {
                    if (checked) activateAgent(agent.id);
                    else deactivateAgent(agent.id);
                  }} 
                />
              </div>
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-blue-100 dark:border-blue-900/30 pt-2 mt-1">
                      {agent.description}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
