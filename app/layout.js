import { Poppins } from 'next/font/google'
import "./globals.css";

import { ReduxProvider } from "./providers";

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: "Web Portal for Plant Repsitory",
  description: "BITS Plani",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
