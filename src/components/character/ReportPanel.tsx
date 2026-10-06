import React, { useState } from 'react';
import { StudioButton, StudioSection } from './ui';
import { runCharacterEngineTests, TestResult } from '../../character/testing/CharacterTests';

export const ReportPanel: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);

  const handleRun = () => {
    setResults(runCharacterEngineTests());
  };

  return (
    <div className="p-4 space-y-4">
      <StudioSection title="Engine Diagnostics">
        <StudioButton onClick={handleRun}>Run Engine Tests</StudioButton>

        {results.length > 0 && (
          <div className="mt-3 space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border text-xs ${
                  r.passed
                    ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-900/60 text-rose-300'
                }`}
              >
                <div className="font-semibold">{r.name}</div>
                {r.message && <div className="text-[10px] mt-0.5 opacity-80">{r.message}</div>}
              </div>
            ))}
          </div>
        )}
      </StudioSection>
    </div>
  );
};
