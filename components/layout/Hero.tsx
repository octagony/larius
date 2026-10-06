import { FileUploader } from '@/components/FileUploader';

export default function Hero() {
  return (
    <div className="pt-32 md:pt-40 lg:pt-28 mb-4 mt-4 text-2xl font-extrabold tracking-tight leading-none md:text-3xl lg:text-4xl dark:text-white text-center">
      <span>Scan files for viruses and suspicious items</span>
      <div className="px-2 py-4">
        <FileUploader />
      </div>
      <div className="text-sm font-light px-2 py-4">
        By submitting data above, you are agreeing to our{' '}
        <a href="https://cloud.google.com/terms" className="text-blue-600 dark:text-blue-800">
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="https://cloud.google.com/terms/secops/privacy-notice"
          className="text-blue-600 dark:text-blue-800"
        >
          Privacy Notice
        </a>
        , and to the sharing of your Sample submission with the security community. Please do not
        submit any personal information. We are not responsible for the contents of your submission.
      </div>
    </div>
  );
}
