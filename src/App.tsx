import { useState, useEffect } from 'react';

// Types
interface GovernanceStatus {
  label: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
}

interface ExecutionSurface {
  name: string;
  description: string;
  authorized: boolean;
}

// Data
const executionSurfaces: ExecutionSurface[] = [
  { name: 'tool.execute', description: 'Tool execution boundary', authorized: true },
  { name: 'workflow.resume', description: 'Workflow resume boundary', authorized: true },
  { name: 'workflow.continue', description: 'Workflow continuation boundary', authorized: true },
  { name: 'checkpoint.restore', description: 'Checkpoint restore boundary', authorized: true },
  { name: 'job.execute', description: 'Job execution boundary', authorized: true },
  { name: 'agent.spawn', description: 'Agent spawn boundary', authorized: true },
  { name: 'external_api.invoke', description: 'External API invocation boundary', authorized: true },
];

const securityProperties = [
  { name: 'Live role evaluation', icon: '👤', active: true },
  { name: 'Live approval evaluation', icon: '✅', active: true },
  { name: 'Live roster evaluation', icon: '📋', active: true },
  { name: 'Revocation-aware authorization', icon: '🚫', active: true },
  { name: 'Fail-closed behavior', icon: '🔒', active: true },
  { name: 'TTL freshness enforcement', icon: '⏱️', active: true },
];

const replayResistance = [
  { name: 'decision_id', description: 'Unique decision identifier' },
  { name: 'evaluated_at', description: 'Evaluation timestamp' },
  { name: 'ttl', description: 'Time-to-live constraint' },
  { name: 'live re-verification at execution time', description: 'Real-time re-check before execution' },
];

const governanceBackends = [
  'policy', 'roster', 'registry', 'approval', 'revocation', 'authorization'
];

const deploymentPolicies = Array.from({ length: 10 }, (_, i) => `PD-${String(i + 1).padStart(3, '0')}`);

const overallStatuses: GovernanceStatus[] = [
  { label: 'Execution Boundary Governance', status: 'PASS' },
  { label: 'Deployment Governance', status: 'PASS' },
  { label: 'Constitutional Deployment Gate', status: 'PASS' },
  { label: 'Production Eligibility', status: 'PASS' },
];

// Components
function StatusBadge({ status }: { status: 'PASS' | 'FAIL' | 'PENDING' }) {
  const colors = {
    PASS: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    FAIL: 'bg-red-500/20 text-red-400 border-red-500/30',
    PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors[status]}`}>
      {status}
    </span>
  );
}

function PulseIndicator({ color = 'emerald' }: { color?: string }) {
  const pingColor = color === 'emerald' ? 'bg-emerald-400' : 'bg-blue-400';
  const dotColor = color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500';
  return (
    <span className="relative flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pingColor} opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${dotColor}`}></span>
    </span>
  );
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}</span>;
}

function SectionCard({ title, children, icon, accent = 'emerald' }: { title: string; children: React.ReactNode; icon: string; accent?: string }) {
  const borderClass = accent === 'blue' ? 'border-blue-500/20' 
    : accent === 'purple' ? 'border-purple-500/20' 
    : accent === 'amber' ? 'border-amber-500/20' 
    : accent === 'cyan' ? 'border-cyan-500/20' 
    : 'border-emerald-500/20';

  return (
    <div className={`bg-slate-900/80 backdrop-blur-sm border ${borderClass} rounded-xl p-6 shadow-lg shadow-black/20`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'execution' | 'security' | 'deployment'>('overview');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono">
      {/* Background grid effect */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-emerald-500/20">
                  S
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">SAIL Governance Program</h1>
                <p className="text-xs text-slate-400">Constitutional Runtime Enforcement Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <PulseIndicator color="emerald" />
                <span className="text-sm font-semibold text-emerald-400">OPERATIONAL</span>
              </div>
              <div className="text-xs text-slate-500 text-right">
                <div>{currentTime.toLocaleDateString()}</div>
                <div>{currentTime.toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'execution', label: 'Execution Boundaries' },
              { id: 'security', label: 'Security Properties' },
              { id: 'deployment', label: 'Deployment Governance' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <OverviewPanel />}
        {activeTab === 'execution' && <ExecutionPanel />}
        {activeTab === 'security' && <SecurityPanel />}
        {activeTab === 'deployment' && <DeploymentPanel />}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-800 bg-slate-950/90 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            SAIL_GOVERNANCE_STATUS.md — Verified State
          </div>
          <div className="text-xs text-slate-500">
            Policy → Runtime Enforcement → Auditability → Constitutional Governance
          </div>
        </div>
      </footer>
    </div>
  );
}

function OverviewPanel() {
  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Tests Passing"
          value={<><AnimatedCounter target={424} /><span className="text-slate-500">/{424}</span></>}
          icon="🧪"
          color="emerald"
        />
        <StatCard label="Skipped" value="0" icon="⏭️" color="slate" />
        <StatCard label="XFailed" value="0" icon="❌" color="slate" />
        <StatCard label="Gate Status" value="PASS" icon="🚦" color="emerald" />
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Constitutional Deployment Gate" icon="🏛️" accent="emerald">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-emerald-400 text-xl">✓</span>
            </div>
            <div>
              <div className="text-emerald-400 font-bold text-lg">PASS</div>
              <div className="text-xs text-slate-400">CONSTITUTIONAL_DEPLOYMENT_GATE</div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <code className="text-xs text-slate-300">
              All governance checks verified. System authorized for production deployment.
            </code>
          </div>
        </SectionCard>

        <SectionCard title="Production Eligibility" icon="🚀" accent="blue">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-blue-400 text-xl">✓</span>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-lg">APPROVED</div>
              <div className="text-xs text-slate-400">PRODUCTION_ELIGIBILITY</div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <code className="text-xs text-slate-300">
              All preconditions met. Governance signoff complete.
            </code>
          </div>
        </SectionCard>
      </div>

      {/* Overall Status Table */}
      <SectionCard title="Current Governance Status" icon="📊" accent="purple">
        <div className="space-y-3">
          {overallStatuses.map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <span className="text-sm text-slate-300">{item.label}</span>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Progress Note */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📝</span>
          <div>
            <h3 className="text-white font-semibold mb-1">Checkpoint Reached</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              The system has progressed from <span className="text-emerald-400 font-medium">policy definition</span> to{' '}
              <span className="text-emerald-400 font-medium">runtime enforcement</span>,{' '}
              <span className="text-emerald-400 font-medium">auditability</span>,{' '}
              <span className="text-emerald-400 font-medium">replay resistance</span>, and{' '}
              <span className="text-emerald-400 font-medium">deployment-time constitutional governance</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExecutionPanel() {
  return (
    <div className="space-y-6">
      <SectionCard title="Execution-Boundary Enforcement" icon="🛡️" accent="emerald">
        <p className="text-sm text-slate-400 mb-4">
          All governed execution surfaces require fresh authorization immediately before execution.
        </p>
        <div className="space-y-2">
          {executionSurfaces.map((surface) => (
            <div
              key={surface.name}
              className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg border border-slate-700/30 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${surface.authorized ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                <code className="text-sm text-emerald-300 font-semibold">{surface.name}</code>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{surface.description}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  surface.authorized
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {surface.authorized ? 'AUTH REQUIRED' : 'DENIED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Authorization Flow" icon="🔄" accent="blue">
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {['Request', 'Role Eval', 'Approval Eval', 'Roster Check', 'Revocation Check', 'TTL Verify', 'Execute'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="px-3 py-2 bg-slate-800 border border-slate-600/50 rounded-lg text-xs text-slate-200 font-medium">
                  {step}
                </div>
                {i < 6 && <span className="text-emerald-500">→</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <code className="text-xs text-slate-400 block">
            <span className="text-emerald-400">// Each execution boundary enforces fresh authorization</span>
            <br />
            <span className="text-blue-400">const</span> auth = <span className="text-purple-400">await</span> governance.authorize(<span className="text-slate-400">{'{'}</span>
            <br />
            &nbsp;&nbsp;surface: <span className="text-amber-300">"tool.execute"</span>,
            <br />
            &nbsp;&nbsp;role: liveRoleEval(),
            <br />
            &nbsp;&nbsp;approval: liveApprovalEval(),
            <br />
            &nbsp;&nbsp;roster: liveRosterEval(),
            <br />
            &nbsp;&nbsp;revocation: checkRevocations(),
            <br />
            &nbsp;&nbsp;ttl: enforceTTL(),
            <br />
            <span className="text-slate-400">{'}'}</span>);
          </code>
        </div>
      </SectionCard>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div className="space-y-6">
      <SectionCard title="Runtime Security Properties" icon="🔐" accent="emerald">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {securityProperties.map((prop) => (
            <div
              key={prop.name}
              className="flex items-center gap-3 p-4 bg-slate-800/40 rounded-lg border border-slate-700/30"
            >
              <span className="text-xl">{prop.icon}</span>
              <div className="flex-1">
                <span className="text-sm text-slate-200">{prop.name}</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Replay Resistance" icon="🛑" accent="amber">
        <p className="text-sm text-slate-400 mb-4">
          Multi-layered replay prevention ensures decisions cannot be reused beyond their authorized scope.
        </p>
        <div className="space-y-3">
          {replayResistance.map((item, i) => (
            <div key={item.name} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">
                {i + 1}
              </div>
              <div className="flex-1">
                <code className="text-sm text-amber-300">{item.name}</code>
                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
              </div>
              <span className="text-emerald-400 text-xs font-medium">ACTIVE</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Governance Backends — Fail-Closed" icon="⚡" accent="purple">
        <p className="text-sm text-slate-400 mb-4">
          Failures in any governance backend result in <code className="text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">DENY</code> — never creating authority.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {governanceBackends.map((backend) => (
            <div
              key={backend}
              className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/30 text-center"
            >
              <div className="text-sm font-medium text-slate-200 capitalize">{backend}</div>
              <div className="text-xs text-slate-500 mt-1">Failure → DENY</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
          <code className="text-xs text-red-300 block">
            <span className="text-red-400">// Fail-closed invariant:</span>
            <br />
            <span className="text-purple-400">if</span> (governanceBackend.failure) {'{'}
            <br />
            &nbsp;&nbsp;<span className="text-red-400">return</span> <span className="text-amber-300">DENY</span>; <span className="text-slate-500">// Never create authority</span>
            <br />
            {'}'}
          </code>
        </div>
      </SectionCard>
    </div>
  );
}

function DeploymentPanel() {
  return (
    <div className="space-y-6">
      <SectionCard title="Deployment Policies" icon="📜" accent="blue">
        <p className="text-sm text-slate-400 mb-4">
          All deployment policies PD-001 through PD-010 are implemented and verified.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {deploymentPolicies.map((policy) => (
            <div
              key={policy}
              className="p-3 bg-slate-800/40 rounded-lg border border-emerald-500/20 text-center hover:border-emerald-500/40 transition-colors"
            >
              <div className="text-sm font-bold text-emerald-400">{policy}</div>
              <div className="text-xs text-slate-500 mt-1">✓ Implemented</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Deployment Governance Checks" icon="🏛️" accent="emerald">
        <div className="space-y-3">
          {[
            { label: 'Constitutional deployment checks', status: 'PASS' },
            { label: 'Required governance signoff workflow', status: 'INTEGRATED' },
            { label: 'Immutable deployment record generation', status: 'IMPLEMENTED' },
          ].map((check) => (
            <div key={check.label} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <span className="text-sm text-slate-300">{check.label}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {check.status}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Governance Record" icon="📄" accent="purple">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30 font-mono">
          <div className="text-xs text-slate-400 space-y-1">
            <div><span className="text-purple-400">file:</span> SAIL_GOVERNANCE_STATUS.md</div>
            <div><span className="text-purple-400">state:</span> <span className="text-emerald-400">verified</span></div>
            <div><span className="text-purple-400">inventory:</span> execution-surface-complete</div>
            <div><span className="text-purple-400">gate:</span> <span className="text-emerald-400">CONSTITUTIONAL_DEPLOYMENT_GATE = PASS</span></div>
            <div className="pt-2 border-t border-slate-700/50 mt-2">
              <span className="text-purple-400">progression:</span>
            </div>
            <div className="pl-4">
              <span className="text-slate-500">policy definition</span>
              <span className="text-emerald-500"> → </span>
              <span className="text-slate-500">runtime enforcement</span>
              <span className="text-emerald-500"> → </span>
              <span className="text-slate-500">auditability</span>
              <span className="text-emerald-500"> → </span>
              <span className="text-slate-500">replay resistance</span>
              <span className="text-emerald-500"> → </span>
              <span className="text-emerald-400">constitutional governance</span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Final Status Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {overallStatuses.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-xs text-slate-400 mb-1">{item.label}</div>
              <div className={`text-lg font-bold ${
                item.status === 'PASS' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {item.status === 'PASS' && item.label === 'Production Eligibility' ? 'APPROVED' : item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: React.ReactNode; icon: string; color: string }) {
  const borderClass = color === 'emerald' ? 'border-emerald-500/20' 
    : color === 'blue' ? 'border-blue-500/20' 
    : color === 'amber' ? 'border-amber-500/20' 
    : 'border-slate-700/30';
  
  const textClass = color === 'emerald' ? 'text-emerald-400' 
    : color === 'blue' ? 'text-blue-400' 
    : color === 'amber' ? 'text-amber-400' 
    : 'text-slate-400';

  return (
    <div className={`bg-slate-900/80 backdrop-blur-sm border ${borderClass} rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${textClass}`}>
        {value}
      </div>
    </div>
  );
}
