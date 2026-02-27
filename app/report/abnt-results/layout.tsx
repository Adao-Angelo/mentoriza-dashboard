import ABNTResultHeader from '@/components/report/abnt-results/header';
import { ReactNode } from 'react';

interface LayoutABNTResultProps {
  children: ReactNode;
}

export default function LayoutABNTResult({ children }: LayoutABNTResultProps) {
  return (
    <>
      <ABNTResultHeader />
      {children}
    </>
  );
}
