import React, { useMemo, useState } from 'react';
import { Button, Card, Checkbox, Label, Select, TextInput, Tooltip, Tabs, Progress, Modal, Table, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react';

type Scenario = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

type Kpi = {
  key: string;
  label: string;
  value: number;
  unit?: string;
  goodWhenLower?: boolean;
};

const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const ScenarioSimulation: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: 'baseline', name: 'Baseline (current)', description: 'Current live timetable snapshot', createdAt: 'now' },
  ]);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('baseline');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showCompare, setShowCompare] = useState<boolean>(false);
  const [resultSeed, setResultSeed] = useState<number>(0);

  const activeScenario = useMemo(() => scenarios.find(s => s.id === activeScenarioId)!, [scenarios, activeScenarioId]);

  const baselineKpis: Kpi[] = useMemo(() => [
    // Core
    { key: 'clashes', label: 'Hard clashes', value: 3, goodWhenLower: true },
    { key: 'teacherLoad', label: 'Avg. teacher load', value: 78, unit: '%', goodWhenLower: false },
    { key: 'roomUtil', label: 'Room utilization', value: 64, unit: '%', goodWhenLower: false },
    { key: 'travel', label: 'Avg. travel time', value: 8, unit: 'min', goodWhenLower: true },
    { key: 'penalties', label: 'Soft penalties', value: 120, goodWhenLower: true },

    // Stability & change cost
    { key: 'changedSlots', label: 'Changed slots', value: 42, unit: 'slots', goodWhenLower: true },
    { key: 'timetableStability', label: 'Timetable stability', value: 86, unit: '%', goodWhenLower: false },

    // Fairness & comfort
    { key: 'overtimeHours', label: 'Teacher overtime', value: 5, unit: 'hrs', goodWhenLower: true },
    { key: 'backToBack', label: 'Back-to-back violations', value: 7, goodWhenLower: true },
    { key: 'lunchBreakViol', label: 'Lunch-break violations', value: 2, goodWhenLower: true },

    // Utilization granularity
    { key: 'labUtil', label: 'Lab utilization', value: 58, unit: '%', goodWhenLower: false },
    { key: 'auditoriumUtil', label: 'Auditorium utilization', value: 44, unit: '%', goodWhenLower: false },
    { key: 'roomChanges', label: 'Room changes', value: 9, goodWhenLower: true },

    // Academic distribution
    { key: 'subjectSpread', label: 'Subject spread balance', value: 72, unit: '%', goodWhenLower: false },
    { key: 'morningBias', label: 'Morning bias', value: 18, unit: '%', goodWhenLower: true },

    // Movement & congestion (proxy)
    { key: 'corridorCongestion', label: 'Corridor congestion score', value: 34, goodWhenLower: true },
  ], []);

  const scenarioKpis: Kpi[] = useMemo(() => {
    // mock different values for every run using resultSeed
    const variance = (k: string) => (resultSeed % 7) - 3; // -3..+3
    return baselineKpis.map(k => ({
      ...k,
      value: Math.max(0, k.value + variance(k.key)),
    }));
  }, [baselineKpis, resultSeed]);

  const duplicateScenario = () => {
    const id = `scn-${Date.now()}`;
    const next: Scenario = {
      id,
      name: `Scenario ${scenarios.length}`,
      description: 'Sandbox copy for what-if changes',
      createdAt: new Date().toLocaleString(),
    };
    setScenarios(prev => [...prev, next]);
    setActiveScenarioId(id);
  };

  const runSimulation = async () => {
    setIsRunning(true);
    await new Promise(r => setTimeout(r, 900));
    setResultSeed(randomBetween(0, 1000));
    setIsRunning(false);
    setShowCompare(true);
  };

  const KpiCard: React.FC<{ title: string; value: number | string; icon: string; tone?: 'good' | 'bad' | 'neutral' }>
    = ({ title, value, icon, tone = 'neutral' }) => (
    <Card className={`shadow-sm ${tone === 'good' ? 'border-emerald-500/40' : tone === 'bad' ? 'border-rose-500/40' : 'border-gray-200'} border`}> 
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tone === 'good' ? 'bg-emerald-50 text-emerald-600' : tone === 'bad' ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-600'}`}>
          <Icon icon={icon} height={20} />
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-white/70">{title}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </div>
    </Card>
  );

  const compareTone = (base: Kpi, sc: Kpi): 'good' | 'bad' | 'neutral' => {
    if (sc.value === base.value) return 'neutral';
    const improved = sc.value < base.value;
    return (base.goodWhenLower ? improved : !improved) ? 'good' : 'bad';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Scenario Simulation</h2>
          <p className="text-sm text-gray-500">Create a sandbox, tweak inputs, run the solver, and compare outcomes safely.</p>
        </div>
        <div className="flex gap-2">
          <Button color="gray" onClick={duplicateScenario}>
            <Icon icon="solar:copy-linear" className="me-2" /> Duplicate from current
          </Button>
          <Button color="info" onClick={runSimulation} isProcessing={isRunning}>
            <Icon icon="solar:play-linear" className="me-2" /> Run simulation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Scenarios</h3>
              <p className="text-xs text-gray-500">Select or create a test sandbox</p>
            </div>
            <Badge color="info">Mocked</Badge>
          </div>
          <div className="space-y-2 mt-3">
            {scenarios.map(sc => (
              <Button
                key={sc.id}
                color={sc.id === activeScenarioId ? 'info' : 'light'}
                className="w-full justify-start"
                onClick={() => setActiveScenarioId(sc.id)}
              >
                <Icon icon={sc.id === 'baseline' ? 'solar:shield-check-line-duotone' : 'solar:flask-linear'} className="me-2" />
                <span className="truncate text-left">
                  <span className="block font-medium">{sc.name}</span>
                  <span className="block text-xs opacity-70">{sc.description}</span>
                </span>
              </Button>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Inputs</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="classAction" value="Class changes" />
                <Select id="classAction">
                  <option>Add classes</option>
                  <option>Remove classes</option>
                  <option>Reschedule classes</option>
                  <option>Cancel classes</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="teachers" value="Teachers impacted" />
                <TextInput id="teachers" placeholder="e.g. T-102, T-205" />
              </div>
              <div>
                <Label htmlFor="rooms" value="Preferred rooms" />
                <TextInput id="rooms" placeholder="e.g. R-301, LAB-A" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2"><Checkbox id="avoidClash" defaultChecked /><Label htmlFor="avoidClash">Avoid clashes</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="minTravel" /><Label htmlFor="minTravel">Minimize travel</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="balanceLoad" defaultChecked /><Label htmlFor="balanceLoad">Balance load</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="keepRooms" /><Label htmlFor="keepRooms">Keep rooms stable</Label></div>
              </div>
            </div>
          </div>
        </Card>

        <div className="col-span-1 xl:col-span-2 space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">KPIs</h3>
              <Tooltip content="Mocked results – replace with solver output">
                <Icon icon="solar:info-circle-linear" className="text-gray-500" />
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              {baselineKpis.map((b, i) => {
                const sc = scenarioKpis.find(s => s.key === b.key)!;
                const tone = compareTone(b, sc);
                const show = `${sc.value}${sc.unit ? ' ' + sc.unit : ''}`;
                return (
                  <KpiCard key={b.key} title={b.label} value={show} icon={i % 2 ? 'solar:chart-2-bold-duotone' : 'solar:graph-new-broken'} tone={tone} />
                );
              })}
            </div>
          </Card>

          <Card>
            <Tabs aria-label="Results" variant="underline">
              <Tabs.Item active title="Timetable diff" icon={undefined}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <h4 className="text-sm font-medium mb-2">Before</h4>
                    <div className="h-40 bg-gray-50 dark:bg-white/5 rounded-md flex items-center justify-center text-gray-400">Grid timetable (mock)</div>
                  </Card>
                  <Card>
                    <h4 className="text-sm font-medium mb-2">After</h4>
                    <div className="h-40 bg-gray-50 dark:bg-white/5 rounded-md flex items-center justify-center text-gray-400">Grid timetable (mock)</div>
                  </Card>
                </div>
              </Tabs.Item>
              <Tabs.Item title="Change list">
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Type</Table.HeadCell>
                    <Table.HeadCell>Entity</Table.HeadCell>
                    <Table.HeadCell>From</Table.HeadCell>
                    <Table.HeadCell>To</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Reschedule</Table.Cell>
                      <Table.Cell>Class 2-B (Math)</Table.Cell>
                      <Table.Cell>Mon 10:00 R-201</Table.Cell>
                      <Table.Cell>Mon 12:00 R-105</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Cancel</Table.Cell>
                      <Table.Cell>Class 3-A (Chem Lab)</Table.Cell>
                      <Table.Cell>Tue 14:00 LAB-A</Table.Cell>
                      <Table.Cell>—</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Add</Table.Cell>
                      <Table.Cell>Workshop (Data Ethics)</Table.Cell>
                      <Table.Cell>—</Table.Cell>
                      <Table.Cell>Fri 16:00 Auditorium</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Tabs.Item>
              <Tabs.Item title="Quality breakdown">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1"><span>Clash avoidance</span><span>92%</span></div>
                    <Progress progress={92} color="green" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1"><span>Load balance</span><span>76%</span></div>
                    <Progress progress={76} color="blue" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1"><span>Room utilization</span><span>68%</span></div>
                    <Progress progress={68} color="purple" />
                  </div>
                </div>
              </Tabs.Item>
            </Tabs>
          </Card>
        </div>
      </div>

      <Modal show={showCompare} onClose={() => setShowCompare(false)} size="lg">
        <Modal.Header>Simulation complete</Modal.Header>
        <Modal.Body>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">These are mocked KPI changes. Connect to your solver API to populate real results.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {baselineKpis.map(b => {
                const sc = scenarioKpis.find(s => s.key === b.key)!;
                const tone = compareTone(b, sc);
                return (
                  <KpiCard key={b.key} title={b.label} value={`${b.value}${b.unit ? ' ' + b.unit : ''} → ${sc.value}${sc.unit ? ' ' + sc.unit : ''}`} icon="solar:graph-new-broken" tone={tone} />
                );
              })}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="info" onClick={() => setShowCompare(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ScenarioSimulation;


