import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

const DynamicMap = dynamic(
  () => import('./DisasterMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[700px] bg-dark-secondary rounded-lg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
);

export default DynamicMap; 