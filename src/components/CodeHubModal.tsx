import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen, AlertTriangle, ShieldAlert, Filter } from 'lucide-react';
import { CODE_DATABASE, JURISDICTIONS, JurisdictionId, CodeCategory } from '../data/buildingCodes';

interface CodeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitMode: 'imp' | 'met';
  jurisdiction: JurisdictionId;
  onJurisdictionChange: (j: JurisdictionId) => void;
}

const CATEGORY_OPTIONS: { id: CodeCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'framing', label: 'Framing' },
  { id: 'stairs', label: 'Stairs & Guards' },
  { id: 'decks', label: 'Decks & Porches' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'concrete', label: 'Concrete & Flatwork' },
  { id: 'exterior', label: 'Exterior & Gutters' },
  { id: 'interior_finishes', label: 'Interior Finishes & Trim' },
  { id: 'masonry', label: 'Masonry' },
  { id: 'envelope', label: 'Building Envelope & Barriers' },
  { id: 'windows_doors', label: 'Windows & Doors' },
  { id: 'garages', label: 'Garages & Carports' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'hvac', label: 'HVAC & Ventilation' },
  { id: 'energy', label: 'Energy Efficiency' },
  { id: 'fire_safety', label: 'Fire Safety & Egress' },
  { id: 'site_work', label: 'Site Work & Grading' },
  { id: 'accessibility', label: 'Accessibility & Barrier-Free' },
  { id: 'pools', label: 'Pools & Spas' },
  { id: 'marine', label: 'Marine Construction' },
  { id: 'framing_tolerances', label: 'Framing Tolerances' },
  { id: 'finishes', label: 'General Finishes' }
];

export const CodeHubModal: React.FC<CodeHubModalProps> = ({
  isOpen,
  onClose,
  unitMode,
  jurisdiction,
  onJurisdictionChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CodeCategory | 'all'>('all');

  // Bulletproof Filter Hook
  const filteredRules = useMemo(() => {
    // 1. Safe jurisdiction lookup protecting against case/string mismatches
    const dbKey = Object.keys(CODE_DATABASE).find(
      (key) => key.toLowerCase() === (jurisdiction || '').toLowerCase()
    ) as JurisdictionId || jurisdiction;

    const rules = CODE_DATABASE[dbKey] || [];
    const cleanQuery = searchQuery.trim().toLowerCase();

    return rules.filter((rule) => {
      if (!rule) return false;
      
      // 2. Exact category match
      const matchesCategory = activeCategory === 'all' || rule.category === activeCategory;
      
      // 3. Safe string matching protecting against undefined fields
      const matchesSearch = cleanQuery === '' ||
        (rule.title || '').toLowerCase().includes(cleanQuery) ||
        (rule.codeRef || '').toLowerCase().includes(cleanQuery) ||
        (rule.summary || '').toLowerCase().includes(cleanQuery) ||
        (rule.category || '').toLowerCase().replace('_', ' ').includes(cleanQuery);

      return matchesCategory && matchesSearch;
    });
  }, [jurisdiction, activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity">
      <div className="bg-white dark:bg-[#111] w-full max-w-2xl max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col border border-gray-200 dark:border-[#222] shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 border-b border-gray-200 dark:border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="font-black text-lg text-gray-900 dark:text-white">Jobsite Code Quick-Lookup</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-[#222]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Liability Disclaimer Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300 font-medium">
            <strong className="font-bold">Prescriptive Reference Only:</strong> Showing standard popular requirements. Municipal bylaws, zoning overrides, and engineered drawings take precedence. Always verify with your local building inspector.
          </p>
        </div>

        {/* Search, Jurisdiction & Category Controls */}
        <div className="p-4 space-y-3 bg-gray-50 dark:bg-[#161616] border-b border-gray-200 dark:border-[#222]">
          
          {/* Row 1: Search & Jurisdiction */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search risers, footings, insulation..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white focus:outline-none focus:border-accent"
              />
            </div>
            <select
              value={jurisdiction}
              onChange={(e) => {
                onJurisdictionChange(e.target.value as JurisdictionId);
              }}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white focus:outline-none focus:border-accent"
            >
              {Object.entries(JURISDICTIONS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          {/* Row 2: Master Category Dropdown + Quick Chips */}
          <div className="flex items-center gap-2">
            
            {/* Master Category Dropdown */}
            <div className="relative shrink-0">
              <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as CodeCategory | 'all')}
                className="pl-8 pr-7 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white focus:outline-none focus:border-accent appearance-none cursor-pointer max-w-[150px] sm:max-w-none truncate"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Quick-Access Horizontal Scroll */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-1">
              {(['all', 'framing', 'stairs', 'concrete', 'energy'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-colors shrink-0 ${
                    activeCategory === cat
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200/60 dark:bg-[#222] text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-[#333]'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Rules Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredRules.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm font-medium">
              No code entries matched your search query in this category or jurisdiction.
            </div>
          ) : (
            filteredRules.map((rule, idx) => (
              /* Notice key={`${rule.id}-${idx}`} - prevents duplicate ID crashes! */
              <div
                key={`${rule.id}-${idx}`}
                className="p-4 rounded-xl bg-gray-50 dark:bg-[#161616] border border-gray-200/80 dark:border-[#262626] flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-accent">
                      {(rule.category || '').replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-0.5">
                      {rule.title}
                    </h3>
                  </div>
                  <span className="px-2 py-1 rounded bg-gray-200 dark:bg-[#222] text-[11px] font-mono font-bold text-gray-700 dark:text-gray-300 shrink-0">
                    {rule.codeRef}
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {rule.summary}
                </p>

                {/* Active Unit Highlight Box */}
                <div className="mt-1 p-2.5 rounded-lg bg-white dark:bg-[#0a0a0a] border border-gray-200/60 dark:border-[#222] flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Required Limit:</span>
                  <span className="text-sm font-mono font-black text-gray-900 dark:text-white">
                    {unitMode === 'imp' ? rule.imperialVal : rule.metricVal}
                  </span>
                </div>

                {/* Practical Jobsite Tip */}
                {rule.jobsiteNote && (
                  <div className="flex items-start gap-1.5 mt-1 text-[11px] text-gray-500 dark:text-gray-400 italic">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                    <span>{rule.jobsiteNote}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};