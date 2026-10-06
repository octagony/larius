import { FileUploader } from '@/components/inputs/FileUploader';
import { Terms } from '@/components/layout/Terms';

export default function FileScanPage() {
  return (
    <div className="h-full w-full flex flex-col flex-1 max-w-3xl mx-auto">
      <div className="pt-20 lg:pt-28 mb-4 mt-4 text-2xl font-extrabold tracking-tight leading-none md:text-3xl lg:text-4xl dark:text-white text-center">
        <h2>Scan files for viruses and suspicious items</h2>
        <div className="px-2 py-4">
          <FileUploader />
        </div>
        <Terms />
      </div>
    </div>
  );
}
