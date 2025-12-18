import React from 'react';
import Chart from 'react-apexcharts';
import { BookOpen, Users, GraduationCap, Microscope, Calculator, Wrench } from 'lucide-react';

interface SpecializationChartProps {
  specializationData: Record<string, number>;
}

const SpecializationChart: React.FC<SpecializationChartProps> = ({ specializationData }) => {
  // Get top 6 specializations for better visualization
  const topSpecializations = Object.entries(specializationData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);

  const chartData = {
    series: topSpecializations.map(([, count]) => count),
    labels: topSpecializations.map(([specialization]) => specialization),
    chart: {
      type: 'donut' as const,
      height: 200,
      fontFamily: 'inherit',
      foreColor: '#adb0bb',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    colors: [
      '#3b82f6', // blue
      '#10b981', // emerald
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // violet
      '#06b6d4', // cyan
    ],
    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
      y: {
        formatter: (val: number) => `${val} faculty`,
      },
    },
  };

  // Get icon for specialization
  const getSpecializationIcon = (specialization: string) => {
    if (specialization.includes('AM') || specialization.includes('MATH')) {
      return <Calculator className="h-4 w-4" />;
    } else if (specialization.includes('AC') || specialization.includes('CHEM')) {
      return <Microscope className="h-4 w-4" />;
    } else if (specialization.includes('ME') || specialization.includes('MECH')) {
      return <Wrench className="h-4 w-4" />;
    } else if (specialization.includes('EE') || specialization.includes('ELEC')) {
      return <GraduationCap className="h-4 w-4" />;
    } else if (specialization.includes('CO') || specialization.includes('COMP')) {
      return <BookOpen className="h-4 w-4" />;
    } else {
      return <Users className="h-4 w-4" />;
    }
  };

  const getSpecializationColor = (index: number) => {
    const colors = ['text-blue-600', 'text-emerald-600', 'text-amber-600', 'text-red-600', 'text-violet-600', 'text-cyan-600'];
    return colors[index] || 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Specialization Distribution</h3>
        <BookOpen className="h-5 w-5 text-gray-500" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="flex items-center justify-center">
          <Chart
            options={chartData}
            series={chartData.series}
            type="donut"
            height="200px"
            width="100%"
          />
        </div>
        
        {/* Legend */}
        <div className="space-y-3">
          {topSpecializations.map(([specialization, count], index) => (
            <div key={specialization} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-gray-100 ${getSpecializationColor(index)}`}>
                  {getSpecializationIcon(specialization)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{specialization}</div>
                  <div className="text-sm text-gray-500">{count} faculty member{count !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500">
                  {Math.round((count / Object.values(specializationData).reduce((a, b) => a + b, 0)) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {Object.keys(specializationData).length > 6 && (
        <div className="text-center mt-4 text-sm text-gray-500">
          +{Object.keys(specializationData).length - 6} more specializations
        </div>
      )}
    </div>
  );
};

export default SpecializationChart;
