import { FileTextIcon } from 'lucide-react';

const NoData = () => {
  return (
    <div className="no-data-container">
      <FileTextIcon width={24} height={24} />
      <span style={{ color: 'var(--color-text-secondary)' }}>No Data</span>
    </div>
  );
};

export default NoData;
