import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata = {
  title: 'Med-in-Minutes | 10-Minute Medicine Delivery',
  description: 'India\'s fastest hyperlocal pharmacy delivery network. Genuine medicines from licensed neighbourhood chemists delivered to your doorstep in 10 minutes.',
  icons: {
    icon: '/favicon.svg'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body suppressHydrationWarning>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

