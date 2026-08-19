import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Search, Stethoscope, Sparkles, 
  MessageSquare, UserCheck
} from "lucide-react";
import { Agent, agents } from "@/lib/agents";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface AgentsDirectoryProps {
  onConsultAgent: (agent: Agent) => void;
  activeAgentId?: string;
}

export const AgentsDirectory: React.FC<AgentsDirectoryProps> = ({
  onConsultAgent,
  activeAgentId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add("All");
    agents.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, []);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || agent.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Clinical Medical Specialist Agents
            </h2>
            <Badge className="bg-blue-600 text-white font-bold text-xs">
              {agents.length} Specialists
            </Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Consult with our specialized AI physicians trained in domain-specific medical guidelines and diagnostic frameworks.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search specialist, symptom, organ..."
            className="pl-10 pr-4 h-11 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-600 text-sm"
            aria-label="Search medical specialist agents"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent, index) => {
          const isActive = agent.id === activeAgentId;
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <Card
                className={`h-full flex flex-col justify-between rounded-2xl border transition-all duration-200 hover:shadow-lg ${
                  isActive
                    ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20 shadow-md"
                    : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700"
                }`}
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={agent.avatar_url}
                        alt={agent.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      {isActive && (
                        <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white p-1 rounded-full shadow-xs">
                          <UserCheck className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {agent.name}
                        </CardTitle>
                      </div>
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                        {agent.specialty}
                      </div>
                      <Badge variant="outline" className="mt-1 text-[10px] py-0 px-2 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        {agent.category || "General"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-1 flex-1">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {agent.description}
                  </p>
                </CardContent>

                <CardFooter className="p-5 pt-0">
                  <Button
                    onClick={() => onConsultAgent(agent)}
                    className={`w-full text-xs font-semibold h-10 rounded-xl flex items-center justify-center gap-2 transition-all ${
                      isActive
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                        : "bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isActive ? "Active Consultation" : `Consult ${agent.name}`}</span>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredAgents.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-2">
          <Stethoscope className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
          <div className="text-base font-bold text-slate-800 dark:text-slate-200">No specialists found</div>
          <p className="text-xs">
            Try searching for a different symptom, medical specialty, or body system.
          </p>
        </div>
      )}
    </div>
  );
};
