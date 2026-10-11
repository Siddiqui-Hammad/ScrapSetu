import React from 'react';
import { CheckCircle2, Clock, Truck, Scale, AlertTriangle, XCircle } from 'lucide-react';

interface PickupStatusTimelineProps {
  status: string;
  statusHistory?: Array<{
    id: string;
    fromStatus: string;
    toStatus: string;
    changeReason?: string;
    timestamp: string;
  }>;
}

export const PickupStatusTimeline: React.FC<PickupStatusTimelineProps> = ({
  status,
  statusHistory = [],
}) => {
  const steps = [
    { key: 'OPEN', label: '1. Request Created', icon: Clock, desc: 'Looking for local collector' },
    { key: 'ACCEPTED', label: '2. Collector Assigned', icon: Truck, desc: 'En route / Scheduled' },
    { key: 'IN_PROGRESS', label: '3. Arrived & Weighing', icon: Scale, desc: 'Physical inspection & scale' },
    { key: 'COMPLETED', label: '4. Settled & Paid', icon: CheckCircle2, desc: 'Digital receipt generated' },
  ];

  const getStepState = (stepKey: string) => {
    if (status === 'CANCELLED') return 'cancelled';
    if (status === 'DISPUTED') return 'disputed';

    const order = ['OPEN', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];
    const currentIndex = order.indexOf(status);
    const stepIndex = order.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 my-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Controlled Lifecycle State Machine
        </h4>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
            status === 'COMPLETED'
              ? 'bg-emerald-100 text-emerald-800'
              : status === 'IN_PROGRESS'
              ? 'bg-amber-100 text-amber-800 animate-pulse'
              : status === 'ACCEPTED'
              ? 'bg-blue-100 text-blue-800'
              : status === 'CANCELLED'
              ? 'bg-red-100 text-red-800'
              : status === 'DISPUTED'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-stone-200 text-stone-800'
          }`}
        >
          {status}
        </span>
      </div>

      {status === 'CANCELLED' ? (
        <div className="p-3 bg-red-50 text-red-800 rounded-xl flex items-center gap-2 text-xs">
          <XCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>This pickup request was cancelled. No further actions can be performed.</span>
        </div>
      ) : status === 'DISPUTED' ? (
        <div className="p-3 bg-purple-50 text-purple-800 rounded-xl flex items-center gap-2 text-xs">
          <AlertTriangle className="w-5 h-5 text-purple-600 shrink-0" />
          <span>A dispute has been raised and is actively under review by an administrator.</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((step) => {
            const state = getStepState(step.key);
            const Icon = step.icon;

            return (
              <div
                key={step.key}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  state === 'completed'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : state === 'current'
                    ? 'bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-200 text-emerald-950 font-semibold'
                    : 'bg-stone-100/60 border-stone-200 text-stone-400'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon
                    className={`w-4 h-4 ${
                      state === 'completed' || state === 'current'
                        ? 'text-emerald-600'
                        : 'text-stone-400'
                    }`}
                  />
                  <span className="font-bold">{step.label}</span>
                </div>
                <div className="text-[11px] text-stone-500">{step.desc}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* History Log Trail */}
      {statusHistory.length > 0 && (
        <div className="mt-4 pt-3 border-t border-stone-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
            Audit Trail
          </span>
          <div className="space-y-1">
            {statusHistory.map((h, i) => (
              <div key={i} className="text-[11px] text-stone-600 flex items-center justify-between">
                <span>
                  <b>{h.toStatus}</b>: {h.changeReason || 'Transition logged'}
                </span>
                <span className="text-stone-400 text-[10px]">
                  {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
