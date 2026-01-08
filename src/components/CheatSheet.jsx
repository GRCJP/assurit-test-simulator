import React, { useMemo, useState } from 'react';
import { useTestMode } from '../contexts/TestModeContext';
import { ChevronDown, ChevronUp, Copy, Search, X } from 'lucide-react';

const SECTIONS = [
  {
    id: 'mental-model',
    title: 'Highest-yield mental model',
    items: [
      'CMMC questions are evidence-driven: the right answer is usually the one that best supports an assessor’s determination with objective evidence.',
      'Think in three buckets: People (who does what), Process (how it’s done), and Proof (what evidence shows it).',
      'Three assessment methods: Examine (review artifacts), Interview (talk to personnel), Test (observe/execute/validate behavior).',
      'Evidence is evaluated for adequacy (does it match the objective) and sufficiency (is there enough coverage across scope).',
      'If you’re stuck, ask: “What would the assessor need to see/hear/observe to rate this MET?”',
      'Your banks repeatedly reward “CAP language” answers over generic cybersecurity answers.',
    ],
  },
  {
    id: 'how-to-answer',
    title: 'How to answer CCP-style questions (fast technique)',
    items: [
      'Underline the qualifier: NOT / EXCEPT / LEAST, or BEST / MOST. Your banks use these heavily.',
      'Translate the stem into a simple task: “Pick the invalid thing,” “Pick the best evidence,” “Pick who is responsible,” or “Pick what is in scope.”',
      'Eliminate answers that are “true but irrelevant.” The right option usually ties directly to CAP, scoping guidance, or a named authoritative document.',
      'If two answers both sound correct, pick the one that is more evidence-driven and more aligned with defined roles/authority.',
      'When the stem says MUST, assume strict process/role boundaries (e.g., assessors observe; OSC performs normal work).',
      'When the stem says BEST/MOST, choose the answer that applies consistently across environments (not a one-off scenario).',
    ],
  },
  {
    id: 'cap',
    title: 'CMMC Assessment Process (CAP)',
    items: [
      'Purpose of assessment procedures: obtain objective evidence to support determinations.',
      'Three methods used together: Examine, Interview, Test (E/I/T). “One method only” is often insufficient.',
      'Who performs tests: OSC personnel who normally do the work; assessor observes/evaluates (bank206: Q81 theme).',
      'Evidence evaluation terms: adequacy + sufficiency (bank206: Q77 theme; bank170 has “sufficiency” emphasis).',
      'Readiness Review: if adequacy/sufficiency is not met, C3PAO can postpone/reschedule (bank170: Q5 theme).',
      'Assessment Team meetings: limited to key personnel directly involved (bank170: Q3 theme).',
      'Daily sync / progress discussions can occur, but do not confuse “discussing findings” with “helping implement controls.”',
      'Common trap: mixing method vs object. Example: a real-time dashboard is not always a valid “Examine” object depending on the objective (bank170: Q1 style).',
      'Another common trap: “Assessors should do the work” is usually wrong. The OSC demonstrates; the assessor validates.',
    ],
  },
  {
    id: 'eit',
    title: 'Assessment methods: Examine vs Interview vs Test (what belongs where)',
    items: [
      'Examine = review artifacts (policies, procedures, SSP sections, inventory lists, network diagrams, records, screenshots as evidence, tickets as records, logs as records).',
      'Interview = validate understanding and responsibility (who owns the control, how it’s performed, what the workflow is, what “normal operations” looks like).',
      'Test = validate behavior (observe a demo, execute a check, validate configuration/technical enforcement, confirm the control works in the operational environment).',
      'If the question asks for “evidence object” pick a thing you can preserve/inspect after-the-fact (artifact/record), not a moment-in-time story.',
      'If the question asks “how do you ensure accurate answers from staff,” Interview technique answers often win over purely technical tools.',
      'If the question asks “MUST perform test,” default to OSC operator performing normal duties while assessor observes (bank206: Q81).',
    ],
  },
  {
    id: 'ecosystem-roles',
    title: 'Ecosystem & roles',
    items: [
      'DoD specifies required CMMC Level in RFI/RFP.',
      'Organizations Seeking Certification (OSC) owns implementation and demonstrates controls; assessors validate and rate.',
      'Nonprovisional Level 2 Lead Assessor must have the appropriate Certified Assessor qualification at/above the assessed level (bank170: Q2 style).',
      'C3PAO is responsible for executing the assessment process and internal quality review before submission (banks emphasize the QA workflow).',
      'Reporting/QA flow appears often: assessment → internal C3PAO quality review → submission for final quality review/rating approval.',
      'When you see a role question, choose the answer that preserves independence (assessors do not “consult” during the assessment).',
    ],
  },
  {
    id: 'roles-deep',
    title: 'Roles & authority: common “who does what” traps',
    items: [
      'Lead Assessor responsibilities commonly tested: planning, team coordination, ensuring sufficient evidence, submitting required packages to internal quality review.',
      'Assessment team member responsibilities: collect evidence, perform interviews/tests within assigned domains, document results for determinations.',
      'OSC responsibilities: provide access, produce artifacts, demonstrate controls, ensure the right SMEs participate.',
      'Avoid answers that imply assessors write policies, configure systems, or remediate controls during an assessment.',
      'If a question asks who selects the Lead Assessor: default to the C3PAO-side selection/assignment process (see bank206: Q21 theme).',
      'When the question mentions remediation review/delta: think “validate remediation + submit delta/remediation package for internal review” (bank206: Q7).',
    ],
  },
  {
    id: 'levels',
    title: 'Model overview / levels (fast recall)',
    items: [
      'Level 1 mental model: FCI safeguarding (aligned with FAR 52.204-21 basic safeguarding).',
      'Level 2 mental model: CUI protection aligned to NIST SP 800-171 (110 requirements).',
      'Common bank factoid: Level 3 = 134 requirements (per the included bank questions).',
      'CUI categories/indices are found in the Official CUI Registry (NARA).',
      'If the stem says “Level 1 self-assessment,” think “basic safeguarding + scoping + evidence,” not “full 800-171 depth.”',
      'If the stem says “Level 2,” think “800-171 aligned + objective evidence + assessment objectives.”',
    ],
  },
  {
    id: 'doc-map',
    title: 'Document map: what to use when a question asks “BEST source”',
    items: [
      'If asked “Where are CUI categories listed?” → Official CUI Registry (NARA).',
      'If asked “Which NIST doc is about protecting CUI in nonfederal orgs?” → NIST SP 800-171 (bank206: Q9 theme).',
      'If asked “Which NIST doc defines the assessment procedures?” → NIST SP 800-171A (bank206: Q53 theme).',
      'If asked “Which clause requires NIST 800-171 controls for CUI?” your banks typically point to DFARS 252.204-7012 (bank170: Q91 theme; bank206 also asks directly about 7012).',
      'If asked “Where are CMMC practices listed in the model overview?” your bank170 uses Appendix framing (e.g., Appendix A type questions).',
      'If asked “Which document is best for practice/process descriptions?” expect an “official model/assessment guide” style answer (bank206: Q20 theme).',
    ],
  },
  {
    id: 'governance',
    title: 'Governance / DFARS / FAR',
    items: [
      'DFARS 252.204-7012: safeguarding Covered Defense Information + cyber incident reporting; commonly referenced as the clause tying contractors to NIST SP 800-171 for protecting CUI.',
      'FAR 52.204-21: basic safeguarding requirements for FCI (Level 1 context).',
      'When asked “which clause requires 800-171 for CUI,” bank questions typically point to DFARS 252.204-7012.',
      'Avoid distractors that mix “assessment reporting requirements” with DFARS clauses unless the question explicitly asks about incident reporting/contract clauses.',
      'If a question is “what is 252.204-7012 required for,” banks often expect a broad “applies across DoD contracts/solicitations” framing rather than niche subsets.',
    ],
  },
  {
    id: 'evidence',
    title: 'Evidence: what “good” looks like (and what assessors reject)',
    items: [
      'Good evidence is objective, reviewable, and tied to the assessment objective (not just a claim).',
      'Adequacy: evidence directly proves the requirement (right control, right system, right scope, right time).',
      'Sufficiency: enough evidence to cover the in-scope boundary (not “one laptop proves enterprise”).',
      'A screenshot can be evidence if it captures configuration/state relevant to the objective and is attributable to the in-scope system.',
      'A policy alone rarely proves implementation. Pair policies with records/logs/tickets and/or test observations.',
      'Interviews are important but usually not sufficient alone for technical controls; pair with examine/test artifacts.',
      'Beware “activity in progress” evidence: dynamic dashboards may need test/observation framing rather than “examine an artifact” framing.',
      'If evidence already meets adequacy + sufficiency, the bank often treats “seek more evidence anyway” as wrong (see malicious code protection scenario style in bank206: Q5).',
    ],
  },
  {
    id: 'scoping',
    title: 'Scoping & asset categorization',
    items: [
      'Scope is driven by where FCI/CUI is processed, stored, or transmitted, and what protects/supports that environment.',
      'Out-of-scope assets: truly segregated business systems that do not touch FCI/CUI and do not impact in-scope security.',
      'External Service Providers (ESPs): in scope if they process/store/transmit FCI/CUI for the OSC, but do not automatically receive their own certification unless separately assessed/enterprise approach.',
      'Restricted IS: legacy/special systems that cannot meet controls; can be treated as restricted/out of scope only if isolated/mitigated/documented.',
      'Not Applicable (N/A) practices: valid when the OSC does not use the relevant tech (e.g., VoIP) within the boundary; encryption does not automatically make controls “not assessed.”',
      'Common trap: “any related tech is in scope” (e.g., analog phones for a VoIP control). If the requirement is specific to the tech, non-use drives N/A (bank206: Q2 style).',
      'Common trap: “N/A means error.” Banks treat N/A as valid when justified by non-use within the boundary.',
    ],
  },
  {
    id: 'scoping-decision-tree',
    title: 'Scoping decision tree (mental checklist)',
    items: [
      'Step 1: Identify where FCI and/or CUI exists (contracts, flows, repositories, endpoints).',
      'Step 2: Identify assets that store/process/transmit FCI/CUI (these are in-scope).',
      'Step 3: Identify assets that protect or provide security for the in-scope environment (often also in-scope).',
      'Step 4: Validate segregation: out-of-scope must be demonstrably separated and not impact security of in-scope assets.',
      'Step 5: Identify ESP involvement: if an ESP touches the data or runs key security services, they affect scope.',
      'Step 6: Identify restricted/specialized assets: document, isolate, and apply compensating controls as required by guidance.',
      'Step 7: For each practice, decide: applicable, not applicable (non-use), or applicable but not met (gap).',
    ],
  },
  {
    id: 'pe',
    title: 'Physical Protection (PE)',
    items: [
      'Visitor control: verify/escort/monitor visitors; unescorted visitors are a classic NOT MET indicator.',
      'Physical access limitations revolve around secured areas, authorized access only, monitoring, and escort requirements.',
      'If the scenario is “walk-in access to sensitive areas,” default to “escort and monitor visitors” rather than HR/personnel screening controls.',
    ],
  },
  {
    id: 'si',
    title: 'System & Information Integrity (SI)',
    items: [
      'Malicious code protection: “appropriate locations,” centrally managed, updated signatures, and objective evidence (logs/reports) usually supports MET.',
      'Flaw remediation: patch/vulnerability management + defined timeframes + consistent enforcement.',
      'Compensating controls trap: if compensating controls are periodically disabled (even for maintenance), it often drives NOT IMPLEMENTED/NOT EFFECTIVE in bank scenarios unless coverage is maintained.',
      'If evidence shows: installed + centrally managed + updated + records, bank questions often consider it sufficient to rate MET (bank206: Q5 style).',
    ],
  },
  {
    id: 'tricks',
    title: 'Trick questions playbook (most common traps in your banks)',
    items: [
      'Negation traps: stems with NOT / EXCEPT / LEAST. Your banks use these heavily (bank206: Q2/Q3; bank170: Q1).',
      'Superlatives: BEST / MOST. Multiple answers can be true; pick the one most aligned to CAP wording (bank206: Q4/Q20/Q22).',
      'N/A vs NOT MET: N/A is valid when the technology/process is not used in scope; NOT MET is for applicable controls implemented inadequately.',
      'Method vs object mismatch: “Examine a real-time dashboard” vs “Test/observe behavior” depending on the objective (bank170: Q1 style).',
      'Role confusion: answers that assign responsibilities to the wrong party (OSC vs C3PAO vs Lead Assessor) are frequent distractors.',
      'Evidence volume trap: lots of screenshots/emails doesn’t help if they don’t prove the objective (sufficient quantity ≠ adequate evidence).',
      'Encryption trap: “it uses FIPS encryption so it doesn’t need assessed” is usually wrong—encryption doesn’t automatically eliminate applicability.',
      '“Ask the Lead Assessor to correct it” trap: many questions present a valid scenario (e.g., N/A) where “this must be an error” is incorrect.',
      '“Seek more evidence” trap: when adequacy/sufficiency is already satisfied, “get more evidence anyway” is typically wrong in bank logic.',
    ],
  },
  {
    id: 'what-to-drill',
    title: 'If you only drill a few things (highest ROI)',
    items: [
      'Assessment basics: E/I/T; adequacy vs sufficiency; who performs tests; what counts as objective evidence.',
      'Scoping: N/A logic; out-of-scope segregation; ESP in scope vs certified; restricted IS handling.',
      'Roles & authority: Lead Assessor vs team member vs OSC; reporting/quality review flow; remediation review expectations.',
      'Document mapping: CUI Registry; NIST 800-171 vs 800-171A; DFARS 252.204-7012 vs FAR 52.204-21.',
      'Recognize “NOT/EXCEPT/LEAST” and “BEST/MOST” stems quickly and slow down before answering.',
    ],
  },
  {
    id: 'speed-round',
    title: 'Speed round: If you see X, think Y',
    items: [
      'Examine → artifacts (policies, diagrams, records, configuration evidence).',
      'Interview → roles, responsibilities, process understanding.',
      'Test → execution/behavior validation.',
      'Adequacy → right kind of evidence.',
      'Sufficiency → enough coverage across scope.',
      'FCI → Level 1 mental model.',
      'CUI + 800-171 → Level 2 mental model.',
      'CUI Registry → authoritative categories/indices.',
      'NOT/EXCEPT/LEAST → slow down and invert the selection logic.',
      'BEST/MOST → choose the most CAP-aligned, consistently-true answer.',
    ],
  },
];

const textForClipboard = (sections) => {
  const lines = [];
  sections.forEach((section) => {
    lines.push(section.title);
    section.items.forEach((item) => lines.push(`- ${item}`));
    lines.push('');
  });
  return lines.join('\n').trim();
};

const CheatSheet = ({ questions = [] }) => {
  const { darkMode, textSize } = useTestMode();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(
    () => new Set([...SECTIONS.map((s) => s.id), 'memory-areas'])
  );
  const [copyStatus, setCopyStatus] = useState(null);

  const derivedSections = useMemo(() => {
    if (!Array.isArray(questions) || questions.length === 0) return [];

    const normalize = (value) => (value || '').toString().toLowerCase();
    const topN = (entries, n) => entries.sort((a, b) => b[1] - a[1]).slice(0, n);

    const domainCounts = new Map();
    const practiceCounts = new Map();
    const methodCounts = new Map([
      ['examine', 0],
      ['interview', 0],
      ['test', 0],
      ['observe', 0],
      ['observation', 0],
    ]);

    const assetPhrases = [
      'CUI Asset',
      'Security Protection Asset',
      'Specialized Asset',
      'Risk Managed Asset',
      'Out-of-Scope Asset',
      'assessment boundary',
      'scope boundary',
      'enclave',
    ];
    const assetCounts = new Map(assetPhrases.map((p) => [p, 0]));

    let notExceptLeast = 0;
    let bestMost = 0;

    const practiceIdRe = /\b([A-Z]{2}\.L\d-\d\.\d+\.\d+(?:\.\d+)?)\b/g;

    for (const q of questions) {
      const domain = (q?.domain || '').toString().trim();
      if (domain) {
        domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
      }

      const blob = [
        q?.question,
        ...(Array.isArray(q?.choices) ? q.choices.map((c) => c?.text) : []),
        q?.explanation,
      ]
        .filter(Boolean)
        .join(' ');

      const lowered = normalize(blob);
      for (const key of methodCounts.keys()) {
        if (lowered.includes(key)) {
          methodCounts.set(key, (methodCounts.get(key) || 0) + 1);
        }
      }

      for (const phrase of assetPhrases) {
        if (lowered.includes(normalize(phrase))) {
          assetCounts.set(phrase, (assetCounts.get(phrase) || 0) + 1);
        }
      }

      const stem = normalize(q?.question);
      if (/(\bnot\b|\bexcept\b|\bleast\b)/i.test(stem)) notExceptLeast += 1;
      if (/(\bbest\b|\bmost\b)/i.test(stem)) bestMost += 1;

      let match;
      while ((match = practiceIdRe.exec(blob)) !== null) {
        const pid = match[1];
        practiceCounts.set(pid, (practiceCounts.get(pid) || 0) + 1);
      }
    }

    const total = questions.length;

    const domainsTop = topN([...domainCounts.entries()], 8).map(
      ([d, c]) => `${d} (${c}/${total})`
    );

    const practicesTop = topN([...practiceCounts.entries()], 12).map(
      ([pid, c]) => `${pid} (${c})`
    );

    const methodsSummary = topN([...methodCounts.entries()], 5)
      .filter(([, c]) => c > 0)
      .map(([k, c]) => `${k}: ${c}`)
      .join(', ');

    const assetsTop = topN([...assetCounts.entries()], 8)
      .filter(([, c]) => c > 0)
      .map(([k, c]) => `${k} (${c})`);

    const items = [
      `Questions in this bank: ${total}`,
      `High-frequency domains: ${domainsTop.join('; ')}`,
      practicesTop.length ? `Most-tested practice IDs: ${practicesTop.join('; ')}` : 'Most-tested practice IDs: none detected',
      methodsSummary ? `Assessment method mentions: ${methodsSummary}` : 'Assessment method mentions: none detected',
      assetsTop.length ? `Scoping/asset terms that repeat: ${assetsTop.join('; ')}` : 'Scoping/asset terms that repeat: none detected',
      `Stem traps: NOT/EXCEPT/LEAST appears in ${notExceptLeast}/${total}; BEST/MOST appears in ${bestMost}/${total}`,
    ];

    return [
      {
        id: 'memory-areas',
        title: 'Memory Areas (from current bank)',
        items,
      },
    ];
  }, [questions]);

  const combinedSections = useMemo(() => {
    if (!derivedSections.length) return SECTIONS;
    return [...derivedSections, ...SECTIONS];
  }, [derivedSections]);

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return combinedSections;

    return combinedSections.map((section) => {
      const titleMatch = section.title.toLowerCase().includes(q);
      const matchedItems = section.items.filter((item) => item.toLowerCase().includes(q));
      if (titleMatch) return section;
      if (matchedItems.length === 0) return null;
      return {
        ...section,
        items: matchedItems,
      };
    }).filter(Boolean);
  }, [query, combinedSections]);

  const toggleSection = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopy = async (text) => {
    if (!text || typeof text !== 'string') {
      console.error('Cannot copy: invalid text provided');
      return;
    }
    
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyStatus('Copied');
      window.setTimeout(() => setCopyStatus(null), 1200);
    } catch (_e) {
      setCopyStatus('Copy failed');
      window.setTimeout(() => setCopyStatus(null), 1500);
    }
  };

  const bodyTextSize =
    textSize === 'sm'
      ? 'text-sm'
      : textSize === 'lg'
      ? 'text-lg'
      : textSize === 'xl'
      ? 'text-xl'
      : 'text-base';

  const headerTextSize =
    textSize === 'sm'
      ? 'text-xl'
      : textSize === 'lg'
      ? 'text-3xl'
      : textSize === 'xl'
      ? 'text-4xl'
      : 'text-2xl';

  const cardClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className={`rounded-xl border ${cardClass} p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`${headerTextSize} font-bold`}>Cheat Sheet</h1>
            <p className={darkMode ? 'text-gray-300' : 'text-slate-600'}>
              High-yield highlights for 11th-hour review.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(textForClipboard(combinedSections))}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600'
                  : 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100'
              }`}
              type="button"
            >
              <Copy size={16} />
              Copy All
            </button>
            {copyStatus && (
              <span className={darkMode ? 'text-gray-300 text-sm' : 'text-slate-600 text-sm'}>{copyStatus}</span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-md border ${
              darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <Search size={16} className={darkMode ? 'text-gray-300' : 'text-slate-500'} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search (e.g., DFARS, sufficiency, scope)"
              className={`w-full bg-transparent outline-none ${darkMode ? 'text-gray-100' : 'text-slate-900'}`}
              type="text"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className={`p-1 rounded hover:${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                aria-label="Clear search"
              >
                <X size={16} className={darkMode ? 'text-gray-300' : 'text-slate-600'} />
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setExpanded(new Set(combinedSections.map((s) => s.id)))}
              className={`px-3 py-1 rounded-md text-sm border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600'
                  : 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100'
              }`}
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={() => setExpanded(new Set())}
              className={`px-3 py-1 rounded-md text-sm border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600'
                  : 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100'
              }`}
            >
              Collapse all
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {filteredSections.length === 0 ? (
              <div className={darkMode ? 'text-gray-300' : 'text-slate-600'}>
                No matches.
              </div>
            ) : (
              filteredSections.map((section) => {
                const isOpen = query.trim() ? true : expanded.has(section.id);

                return (
                  <div key={section.id} className={`rounded-lg border ${cardClass}`}>
                    <button
                      type="button"
                      onClick={() => {
                        if (query.trim()) return;
                        toggleSection(section.id);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3"
                    >
                      <div className="text-left">
                        <div className="font-semibold">{section.title}</div>
                        <div className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-700 text-sm'}>
                          {section.items.length} item{section.items.length === 1 ? '' : 's'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(textForClipboard([section]));
                          }}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600'
                              : 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100'
                          }`}
                          aria-label={`Copy section ${section.title}`}
                        >
                          <Copy size={16} />
                          Copy
                        </button>

                        {query.trim() ? null : isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className={`px-4 pb-4 ${bodyTextSize}`}>
                        <ul className={`list-disc pl-5 space-y-2 ${darkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                          {section.items.map((item, idx) => (
                            <li key={idx} className={darkMode ? 'text-gray-200' : 'text-slate-800'}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheatSheet;
