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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Clinical Medical Specialist Agents
            </h2>
            <Badge className="bg-blue-600 text-white font-bold text-xs">
              {agents.length} Specialists
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
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
            className="pl-10 pr-4 h-11 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-600 text-sm"
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
                : "bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200"
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
                className={`h-full flex flex-col justify-between rounded-2xl border transition-all hover:shadow-md ${
                  isActive
                    ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }`}
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={agent.avatar_url}
                        alt={agent.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <CardTitle className="text-base font-bold text-slate-900 truncate">
                          {agent.name}
                        </CardTitle>
                        {isActive && (
                          <Badge className="bg-blue-600 text-white text-[10px] py-0">
                            Active
                          </Badge>
                        )}
                      </div>

                      <Badge
                        variant="outline"
                        className="text-xs font-semibold text-blue-700 bg-blue-50 border-blue-200 py-0.5"
                      >
                        {agent.specialty}
                      </Badge>
                      <div className="text-[11px] text-slate-400 font-medium mt-1">
                        {agent.category || "Clinical Specialty"}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-5 py-2 flex-1">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {agent.description}
                  </p>
                </CardContent>

                <CardFooter className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>Gemini Clinical Triage</span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onConsultAgent(agent)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 h-9 rounded-xl shadow-2xs flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Consult</span>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredAgents.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No specialists found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search keywords or filter category.
          </p>
        </div>
      )}
    </div>
  );
};
