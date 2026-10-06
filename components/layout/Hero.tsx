import { FileUploader } from '@/components/FileUploader';

export default function Hero() {
  return (
    <div className="pt-16 mb-4 mt-4 text-2xl font-extrabold tracking-tight leading-none md:text-3xl lg:text-4xl dark:text-white text-center">
      <span>Scan files for viruses and suspicious items</span>
      <div className="px-2 py-4">
        <FileUploader />
      </div>
    </div>
  );
}
