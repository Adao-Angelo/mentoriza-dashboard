/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Report } from '@/services/reports/Interfaces';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface Props {
  report: Report;
  onPointClick: (pointKey: string) => void;
  highlightedPoint?: string;
}

export default function SidebarABNTDetailed({
  report,
  onPointClick,
  highlightedPoint,
}: Props) {
  const abnt = report.keyResults?.abnt;
  if (!abnt?.abnt_points) {
    return <div className='p-4'>Dados ABNT não disponíveis</div>;
  }

  const points = abnt.abnt_points;

  const dataForRadar = [
    {
      name: 'Estrutura',
      value: points.structure?.sub_score || 0,
      fullMark: 100,
    },
    {
      name: 'Citações',
      value: points.citations?.sub_score || 0,
      fullMark: 100,
    },
    {
      name: 'Formatação',
      value: points.formatting?.sub_score || 0,
      fullMark: 100,
    },
    {
      name: 'Tabelas/Figuras',
      value: points.tables_figures?.sub_score || 0,
      fullMark: 100,
    },
  ];

  const totalScore = abnt.conformity_percentage || 0;

  return (
    <div className='w-96 bg-sidebar border-r h-dvh overflow-y-auto p-6 space-y-6'>
      {/* Score Geral */}
      <div className='text-center'>
        <div className='inline-flex items-center justify-center w-24 h-24 rounded-full border-8 border-primary/20'>
          <div className='text-2xl font-bold text-primary'>{totalScore}</div>
        </div>
        <p className='text-sm text-muted-foreground mt-2'>Conformidade ABNT</p>
      </div>

      {/* Gráfico Radar */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Desempenho por Critério</CardTitle>
        </CardHeader>
        <CardContent className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <RadarChart data={dataForRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey='name' />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name='Score'
                dataKey='value'
                stroke='#3b82f6'
                fill='#3b82f6'
                fillOpacity={0.3}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className='space-y-4'>
        {Object.entries(points).map(([key, point]: [string, any]) => {
          const score = point.sub_score || 0;
          const violationsCount = point.violations?.length || 0;

          return (
            <Card
              key={key}
              className={`cursor-pointer transition-all hover:shadow-md ${
                highlightedPoint === key ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onPointClick(key)}
            >
              <CardHeader className='pb-3'>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-base capitalize'>
                    {key === 'structure' && 'Estrutura'}
                    {key === 'citations' && 'Citações e Referências'}
                    {key === 'formatting' && 'Formatação e Numeração'}
                    {key === 'tables_figures' && 'Tabelas e Figuras'}
                  </CardTitle>
                  <Badge
                    variant={
                      score >= 80
                        ? 'default'
                        : score >= 60
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {score}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='pt-0'>
                <Progress value={score} className='h-2 mb-3' />

                <div className='flex justify-between text-sm text-muted-foreground'>
                  <span>{violationsCount} problema(s)</span>
                  <span className='text-xs'>Clique para destacar</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
