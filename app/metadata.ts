import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wise',
  description: 'Find your perfect car at Wise',
  keywords: 'luxury cars, premium vehicles, car dealership, Mercedes-Benz, Rolls-Royce, Lexus, Audi, car sales, luxury auto, high-end vehicles',
  authors: [{ name: 'Wise' }],
  creator: 'Wise',
  publisher: 'Wise',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wjcarsales.com',
    title: 'Wise | Luxury Vehicles',
    description: 'Find your perfect luxury vehicle at Wise. Browse our exclusive collection of premium cars.',
    siteName: 'Wise',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wise | Luxury Vehicles',
    description: 'Find your perfect luxury vehicle at Wise. Browse our exclusive collection of premium cars.',
    creator: '@wjcarsales',
  },
}; 