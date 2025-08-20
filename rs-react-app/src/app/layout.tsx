'use client'

// import type { Metadata } from 'next'
import { Provider } from 'react-redux'
import { store } from '../state/store'
import { ThemeProvider } from '../context/ThemeContext'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import Layout from '../components/Layout/Layout'
import '../index.css'

// export const metadata: Metadata = {
//   title: 'Task #6',
//   description: 'SSR app',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/crane.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Provider store={store}>
          <ThemeProvider>
            <ErrorBoundary>
              <Layout>
                {children}
              </Layout>
            </ErrorBoundary>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}