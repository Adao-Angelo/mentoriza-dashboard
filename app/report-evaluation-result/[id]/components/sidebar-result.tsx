/* eslint-disable @typescript-eslint/no-explicit-any */

import { Report } from '@/services/reports/Interfaces';

interface Props {
  report: Report;
  onIndicatorClick: (key: string) => void;
}

export default function SidebarEvaluation({ report, onIndicatorClick }: Props) {
  const indicators: [string, any][] = Object.entries(report.keyResults || {});

  console.log(report.keyResults);

  return (
    <div className='bg-sidebar p-4 min-w-80 border-r h-dvh'>
      <div className='rounded-full border-2 border-gray-300 flex items-center justify-center w-full h-10 m-auto'>
        <h1 className='text-xl font-bold text-gray-800'>
          {report.score ?? 0} <span>%</span>
        </h1>
      </div>

      <ul className='mt-4 space-y-2'>
        {indicators.map(([key, value]) => (
          <li
            key={key}
            onClick={() => onIndicatorClick(key)}
            className='cursor-pointer p-2 rounded hover:bg-gray-100 transition'
          >
            <div className='flex justify-between'>
              <span>{key}</span>
              <span className='font-semibold'>{value}%</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
