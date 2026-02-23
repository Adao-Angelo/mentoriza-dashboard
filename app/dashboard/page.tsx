'use client';

import DashboardCard from '@/components/dashboard/card';
import StatsCard from '@/components/dashboard/card-Stats';
import { FileSpreadsheet, GraduationCap, Users } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:md:grid-cols-4 gap-4'>

      <DashboardCard icon={Users}>
        <StatsCard
          title='Número de grupos'
          value={29}
          extras={[
            {
              label: '1ª fase',
              value: 29,
              color: 'text-green-600',
            },
            {
              label: '2ª fase',
              value: 30,
              color: 'text-[#FF2056]',
            },
          ]}
        />
      </DashboardCard>

      <DashboardCard icon={Users}>
        <StatsCard title='Número de estudantes' value={5} />
      </DashboardCard>

      <DashboardCard icon={GraduationCap}>
        <StatsCard title='Número de mentores' value={9} />
      </DashboardCard>

      <DashboardCard icon={FileSpreadsheet}>
        <StatsCard
          title='Relatórios'
          value='00'
          extras={[
            {
              label: 'Aprovados',
              value: 10,
              color: 'text-green-600',
            },
            {
              label: 'Reprovados',
              value: 2,
              color: 'text-[#FF2056]',
            },
          ]}
        />
      </DashboardCard>
    </div>
  );
}
