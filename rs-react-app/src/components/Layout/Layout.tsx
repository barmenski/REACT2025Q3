'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Header from '../Header/Header'
import ThemeToggle from '../ThemeToggle/ThemeToggle'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <div className="wrapper-main">
      <Header />
      <ThemeToggle />
      <div className="wrapper-nav-link">
        <Link
          href="/"
          className={pathname === '/' ? 'nav-link active' : 'nav-link'}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={pathname === '/about' ? 'nav-link active' : 'nav-link'}
        >
          About
        </Link>
      </div>
      {children}
    </div>
  )
}

export default Layout