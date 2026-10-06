export function Terms() {
  return (
    <div className="text-base font-light px-2 py-4">
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
  );
}
