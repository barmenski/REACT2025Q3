

import App from '../../components/App'

export async function generateStaticParams() {
  return [{ lang: 'en-US', slug: [] },
  { lang: 'en-US', slug: ['about'] },
  { lang: 'ru', slug: ['/'] },
  { lang: 'ru', slug: ['о-нас'] },]
}

export default function HomePage() {
  return <App />
}