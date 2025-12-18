import React from 'react';
import { Link } from 'react-router';
import {
  CalendarPlus,
  CalendarDays,
  Shuffle,
  FileCheck2,
  Clock,
  BookPlus,
  Wand2,
  Users
} from 'lucide-react';

type Feature = {
  id: string;
  label: string;
  sublabel?: string;
  to?: string;
  variant?: 'accent' | 'default';
  icon?: React.ReactNode;
};

const features: Feature[] = [
  { id: '01', label: 'New Timetable', sublabel: 'Create a timetable', to: '/timetable/new', variant: 'accent', icon: <CalendarPlus className="h-5 w-5" /> },
  { id: '02', label: 'View Timetable', sublabel: 'Browse All timetables', to: '/timetable/view', icon: <CalendarDays className="h-5 w-5" /> },
  { id: '03', label: 'Substitution', sublabel: 'Manage Faculty substitutions', to: '/substitution', icon: <Shuffle className="h-5 w-5" /> },
  { id: '04', label: 'Leave Management', sublabel: 'Requests & approvals', to: '/leave-management', icon: <FileCheck2 className="h-5 w-5" /> },
  { id: '05', label: 'View Schedule', sublabel: 'Watch Dynamic Schedule', to: '/timetable/institute-schedule', icon: <Clock className="h-5 w-5" /> },
  { id: '06', label: 'Ingest Curriculum', sublabel: 'Smart Curriculum Centered Distribution', to: '/curriculum/ingest', icon: <BookPlus className="h-5 w-5" /> },
  { id: '07', label: 'NLP Based Modifications', sublabel: 'Smart Edits', to: '/timetable/ai-modifications', variant: 'accent', icon: <Wand2 className="h-5 w-5" /> },
  { id: '08', label: 'Faculty Management', sublabel: 'Add/Remove Instructors', to: '/user-management', icon: <Users className="h-5 w-5" /> },
];

const AccentCard: React.FC<{ id: string; title: string; subtitle?: string; to?: string; icon?: React.ReactNode }> = ({ id, title, subtitle, to, icon }) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    to ? <Link to={to}>{children}</Link> : <>{children}</>;

  return (
    <div className="relative overflow-hidden ring-1 ring-sky-300 p-5 bg-gradient-to-tr from-sky-700 to-sky-500 text-white rounded-md">
      <div
        className="absolute inset-0 rounded-md"
        style={{
          background:
            'radial-gradient(160px 160px at 30% 30%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(220px 220px at 70% 70%, rgba(0,0,0,0.25), transparent 60%)',
        }}
      />
      <div className="relative flex items-center justify-between rounded-md">
        <span className="text-[11px] text-white/80 rounded-md">{`{ ${id} }`}</span>
      </div>
      <div className="relative mt-6 rounded-md">
        <p className="text-white font-medium tracking-tight rounded-md">{title}</p>
        {subtitle ? <p className="text-white/90 text-sm rounded-md">{subtitle}</p> : null}
      </div>
      <Wrapper>
        <button className="relative mt-8 h-9 w-9 bg-white text-neutral-900 flex items-center justify-center shadow-sm transition-colors hover:text-sky-700 rounded-md">
          {icon}
        </button>
      </Wrapper>
    </div>
  );
};

const DefaultCard: React.FC<{ id: string; title: string; subtitle?: string; to?: string; icon?: React.ReactNode }> = ({ id, title, subtitle, to, icon }) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    to ? <Link to={to}>{children}</Link> : <>{children}</>;
  return (
    <Wrapper>
      <div className="group bg-white ring-1 ring-black/10 p-5 transition-colors rounded-md hover:ring-sky-300">
        <div className="flex items-center justify-between rounded-md">
          <span className="text-[11px] text-neutral-400 transition-colors group-hover:text-sky-600 rounded-md">{`{ ${id} }`}</span>
        </div>
        <div className="mt-6 rounded-md">
          <div className="h-10 w-10 bg-sky-100 text-sky-700 flex items-center justify-center rounded-md">
            {icon}
          </div>
          <p className="mt-4 text-neutral-900 font-medium tracking-tight transition-colors group-hover:text-sky-700 rounded-md">{title}</p>
          {subtitle ? (
            <p className="text-neutral-600 text-sm transition-colors group-hover:text-sky-600 rounded-md">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
};

const FeatureBento: React.FC = () => {
  return (
    <section className="mt-8 rounded-md">
      <div className="text-center rounded-md">
        <p className="text-neutral-600 text-xs transition-colors hover:text-sky-600 rounded-md">Core features</p>
        <h2 className="mt-1 text-4xl font-semibold tracking-tight text-neutral-900 transition-colors hover:text-sky-700 rounded-md">Built for Next Generation Timetabling</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 rounded-md">
        {features.map((f) =>
          f.variant === 'accent' ? (
            <AccentCard key={f.id} id={f.id} title={f.label} subtitle={f.sublabel} to={f.to} icon={f.icon} />
          ) : (
            <DefaultCard key={f.id} id={f.id} title={f.label} subtitle={f.sublabel} to={f.to} icon={f.icon} />
          ),
        )}
      </div>
    </section>
  );
};

export default FeatureBento;


