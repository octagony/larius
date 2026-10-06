import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/lib/state/providers/ThemeProvider';
import Header from '@/components/layout/Header';
import ReduxProvider from '@/lib/state/providers/ReduxProvider';
import Spinner from '@/components/Spinner';
import { Toaster } from '@/components/ui/toast';
import { Footer } from '@/components/layout/Footer';
import { redirect } from 'next/navigation';
import { TooltipProvider } from '@/components/ui/tooltip';

const robotoHeading = Roboto({
  subsets: ['latin'],
  variable: '--font-heading',
});

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Larius',
  description: 'Scan files, urls for malware',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'dark',
        'antialiased',
        'font-sans',
        inter.variable,
        robotoHeading.variable
      )}
      suppressHydrationWarning
    >
      <body className="mx-auto min-h-full flex flex-col bg-gradient-bg ">
        <ReduxProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Header />
              {children}
              <Spinner />
              <Toaster />
              <Footer />
            </TooltipProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
