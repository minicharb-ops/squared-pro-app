import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen, AlertTriangle, ShieldAlert, Filter, Hammer, LayoutGrid, TrendingUp, Blocks, Zap, ChevronDown, Layers, Droplets, Circle, CheckCircle2, Paintbrush, Wind, Flame, Thermometer, Shield, DoorOpen, Home, Map, Accessibility, Waves, Anchor } from 'lucide-react';
import { CODE_DATABASE, JURISDICTIONS, JurisdictionId, CodeCategory } from '../data/buildingCodes';

interface CodeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitMode: 'imp' | 'met';
  jurisdiction: JurisdictionId;
  onJurisdictionChange: (j: JurisdictionId) => void;
  initialCategory?: CodeCategory | 'all';
}


const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'all': return LayoutGrid;
    case 'framing': return Hammer;
    case 'stairs': return TrendingUp;
    case 'decks': return Layers;
    case 'foundations': return Blocks;
    case 'concrete': return Blocks;
    case 'exterior': return Home;
    case 'interior_finishes': return Paintbrush;
    case 'masonry': return Blocks;
    case 'envelope': return Shield;
    case 'windows_doors': return DoorOpen;
    case 'garages': return Home;
    case 'electrical': return Zap;
    case 'plumbing': return Droplets;
    case 'hvac': return Wind;
    case 'energy': return Thermometer;
    case 'fire_safety': return Flame;
    case 'site_work': return Map;
    case 'pools': return Waves;
    case 'marine': return Anchor;
    case 'accessibility': return Accessibility;
    default: return LayoutGrid;
  }
};

const CATEGORY_OPTIONS: { id: CodeCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'framing', label: 'Framing' },
  { id: 'stairs', label: 'Stairs & Guards' },
  { id: 'decks', label: 'Decks & Porches' },
  { id: 'windows_doors', label: 'Windows & Doors' },
  { id: 'interior_finishes', label: 'Interior Finishes & Trim' },
  { id: 'exterior', label: 'Exterior & Gutters' },
  { id: 'envelope', label: 'Building Envelope & Barriers' },
  { id: 'concrete', label: 'Concrete & Flatwork' },
  { id: 'masonry', label: 'Masonry' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'hvac', label: 'HVAC & Ventilation' },
  { id: 'site_work', label: 'Site Work & Grading' },
  { id: 'pools', label: 'Pools & Spas' },
  { id: 'marine', label: 'Marine Construction' },
  { id: 'garages', label: 'Garages & Carports' },
  { id: 'energy', label: 'Energy Efficiency' },
  { id: 'fire_safety', label: 'Fire Safety & Egress' },
  { id: 'accessibility', label: 'Accessibility & Barrier-Free' }
];

const CATEGORY_GROUPS = [
  {
    title: 'Structure & Framing',
    colorClass: 'text-cyan-400',
    categories: ['framing', 'stairs', 'decks', 'windows_doors']
  },
  {
    title: 'Exterior & Trim',
    colorClass: 'text-amber-500',
    categories: ['interior_finishes', 'exterior', 'envelope']
  },
  {
    title: 'Concrete',
    colorClass: 'text-slate-400',
    categories: ['concrete', 'masonry', 'foundations']
  },
  {
    title: 'Mechanical, Electrical & Plumbing',
    colorClass: 'text-indigo-400',
    categories: ['electrical', 'plumbing', 'hvac']
  },
  {
    title: 'Site & Specialty',
    colorClass: 'text-emerald-400',
    categories: ['site_work', 'pools', 'marine', 'garages']
  },
  {
    title: 'Safety & Energy',
    colorClass: 'text-rose-500',
    categories: ['energy', 'fire_safety', 'accessibility']
  }
];

export const CodeHubModal: React.FC<CodeHubModalProps> = ({
  isOpen,
  onClose,
  unitMode,
  jurisdiction,
  onJurisdictionChange,
  initialCategory = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CodeCategory | 'all'>(initialCategory);

  React.useEffect(() => {
    if (isOpen) {
      setActiveCategory(initialCategory);
      setSearchQuery('');
    }
  }, [isOpen, initialCategory]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

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
                className="w-full pl-9 pr-10 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="relative shrink-0">
              <select
                value={jurisdiction}
                onChange={(e) => {
                  onJurisdictionChange(e.target.value as JurisdictionId);
                }}
                className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2 text-xs font-bold rounded-xl border text-gray-800 dark:text-white bg-white dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 border-gray-300 dark:border-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all cursor-pointer"
              >
                {Object.entries(JURISDICTIONS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 pointer-events-none" />
            </div>
          </div>

          {/* Row 2: Master Category Dropdown */}
          <div className="relative w-full">
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full flex items-center justify-between gap-2 pl-4 pr-3 py-3 text-sm font-bold rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 truncate">
                <BookOpen className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="truncate">{CATEGORY_OPTIONS.find(c => c.id === activeCategory)?.label || 'All Categories'}</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsCategoryDropdownOpen(false)} />
                <div className="absolute top-full mt-2 left-0 right-0 max-h-80 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 flex flex-col custom-scrollbar">
                  
                  {/* All Categories Option */}
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      activeCategory === 'all' ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LayoutGrid className={`w-5 h-5 ${activeCategory === 'all' ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400'}`} />
                      <span className="text-sm font-bold">All Categories</span>
                    </div>
                    {activeCategory === 'all' ? (
                      <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 fill-cyan-100 dark:fill-cyan-900/30" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    )}
                  </button>

                  {/* Grouped Categories */}
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.title}>
                      <div className="px-4 py-2 mt-1 bg-gray-50/50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{group.title}</h4>
                      </div>
                      {group.categories.map((catId) => {
                        const option = CATEGORY_OPTIONS.find(c => c.id === catId);
                        if (!option) return null;
                        const Icon = getCategoryIcon(catId);
                        const isActive = activeCategory === catId;
                        
                        return (
                          <button
                            key={catId}
                            onClick={() => {
                              setActiveCategory(catId as CodeCategory);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors last:border-b-0 ${
                              isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : group.colorClass}`} />
                              <span className="text-sm font-bold">{option.label}</span>
                            </div>
                            {isActive ? (
                              <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 fill-cyan-100 dark:fill-cyan-900/30" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </>
            )}
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