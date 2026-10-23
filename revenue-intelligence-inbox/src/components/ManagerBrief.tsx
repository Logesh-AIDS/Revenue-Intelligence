import { MANAGER_BRIEF } from '../lib/brief';

export default function ManagerBrief() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800">Manager Brief</h1>
        <p className="text-sm text-slate-500 mt-1">
          21 August 2026 · Asia/Kolkata · Pre-generated · Does not react to dashboard filters
        </p>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-5">
        <p className="text-sm text-slate-600 leading-relaxed">{MANAGER_BRIEF.intro}</p>
      </div>

      {MANAGER_BRIEF.sections.map((section, si) => (
        <div key={si} className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200">
            {section.heading}
          </h2>
          <div className="space-y-3">
            {section.items.map((item, ii) => (
              <div
                key={ii}
                className="bg-white rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start gap-2 mb-1">
                  {item.recordRef && (
                    <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.recordRef}
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-slate-800 flex-1">{item.title}</h3>
                  {item.priority && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.priority === 'high'
                          ? 'bg-red-100 text-red-600'
                          : item.priority === 'medium'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.priority}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                {item.evidence && (
                  <div className="mt-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded border-l-2 border-brand-300">
                    <span className="font-medium text-slate-600">Evidence: </span>
                    {item.evidence}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
