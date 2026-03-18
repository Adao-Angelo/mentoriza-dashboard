'use client';

import DashboardCard from '@/components/dashboard/card';
import StatsCard from '@/components/dashboard/card-Stats';
import { ReportsChart } from '@/components/dashboard/charts/reports-chart';
import { useDashboardStats } from '@/hooks/dashboard/use-dashboard-stats';
import { FileSpreadsheet, GraduationCap, Users } from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  const safeValue = (value: number | undefined) =>
    isLoading ? '0' : isError ? '0' : (value ?? 0);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:md:grid-cols-4 gap-4'>
      <DashboardCard icon={Users}>
        <StatsCard title='Número de grupos' value={safeValue(stats?.groups)} />
      </DashboardCard>

      <DashboardCard icon={Users}>
        <StatsCard
          title='Número de estudantes'
          value={safeValue(stats?.students)}
        />
      </DashboardCard>

      <DashboardCard icon={GraduationCap}>
        <StatsCard
          title='Número de mentores'
          value={safeValue(stats?.advisors)}
        />
      </DashboardCard>

      <DashboardCard icon={FileSpreadsheet}>
        <StatsCard
          title='Relatórios'
          value={safeValue(stats?.reports)}
          extras={[
            {
              label: 'Aprovados',
              value: safeValue(stats?.reportsApproved),
              color: 'text-green-600',
            },
            {
              label: 'Reprovados',
              value: safeValue(stats?.reportsRejected),
              color: 'text-[#FF2056]',
            },
          ]}
        />
      </DashboardCard>

      <div className='md:col-span-4'>
        <ReportsChart />
      </div>
    </div>
  );
}
