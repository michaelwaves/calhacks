import Header from '@/components/Header'
import './globals.css'
import { Raleway, Inter, League_Spartan } from 'next/font/google'
import Footer from '@/components/Footer'

import {Toaster} from 'react-hot-toast'

const raleway = Raleway({ subsets: ['latin'] })
const leagueSpartan = League_Spartan({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      {/* <header>
      <Header />
      </header> */}
      <Toaster/>
      <div className={leagueSpartan.className}>{children}</div>
      {/* <footer>
      <Footer />
      </footer> */}
      </body>
    </html>

  )
}
