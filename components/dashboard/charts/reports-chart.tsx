'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ReportsTrendRange,
  useDashboardReportsTrend,
} from '@/hooks/dashboard/use-dashboard-reports-trend';

export const description =
  'Relatórios enviados: evolução de uploads (dia/semana/mês/3m/6m)';

const chartConfig = {
  reports: {
    label: 'Relatórios enviados',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const rangeLabels: Record<ReportsTrendRange, string> = {
  day: 'Últimos 30 dias',
  week: 'Últimas 12 semanas',
  month: 'Últimos 12 meses',
  '3m': 'Últimos 3 meses',
  '6m': 'Últimos 6 meses',
};

export function ReportsChart() {
  const [range, setRange] = React.useState<ReportsTrendRange>('day');
  const { data, isLoading, isError } = useDashboardReportsTrend(range);

  const graphData = React.useMemo(() => {
    if (!data) return [];
    return data.points.map((point) => ({
      date: point.period,
      reports: point.value,
    }));
  }, [data]);

  return (
    <Card className='pt-0'>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='grid flex-1 gap-1'>
          <CardTitle>Relatórios</CardTitle>
          <CardDescription>
            {rangeLabels[range]} (média {data?.average ?? 0} uploads)
          </CardDescription>
        </div>

        <Select
          value={range}
          onValueChange={(value) => setRange(value as ReportsTrendRange)}
        >
          <SelectTrigger
            className='hidden w-[170px] rounded-lg sm:ml-auto sm:flex'
            aria-label='Selecione um intervalo'
          >
            <SelectValue placeholder='Intervalo' />
          </SelectTrigger>
          <SelectContent className='rounded-xl'>
            <SelectItem value='day'>Últimos 30 dias</SelectItem>
            <SelectItem value='week'>Últimas 12 semanas</SelectItem>
            <SelectItem value='month'>Últimos 12 meses</SelectItem>
            <SelectItem value='3m'>Últimos 3 meses</SelectItem>
            <SelectItem value='6m'>Últimos 6 meses</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        {isLoading ? (
          <div className='text-center py-28'>Carregando...</div>
        ) : isError ? (
          <div className='text-center py-28 text-destructive'>
            Erro ao carregar os dados
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[250px] w-full'
          >
            <AreaChart data={graphData}>
              <defs>
                <linearGradient id='fillReports' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                type='monotone'
                dataKey='reports'
                stroke='var(--chart-1)'
                fill='url(#fillReports)'
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />
              <ChartLegend>
                <ChartLegendContent />
              </ChartLegend>
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
