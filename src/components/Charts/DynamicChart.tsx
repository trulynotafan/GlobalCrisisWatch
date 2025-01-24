import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

// Dynamically import chart components with SSR disabled
const Line = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const Bar = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Bar),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const Doughnut = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Doughnut),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

export { Line, Bar, Doughnut }; 