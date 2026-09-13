import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import MemberPortal from './pages/MemberPortal'
import AboutBJJ from './pages/AboutBJJ'
import Learn from './pages/Learn'
import Coach from './pages/Coach'
import Contact from './pages/Contact'

export type Lang = 'en' | 'sw'
export type Page = 'home' | 'login' | 'member' | 'about' | 'learn' | 'coach' | 'contact'

const VALID_PAGES: Page[] = ['home', 'login', 'member', 'about', 'learn', 'coach', 'contact']

export default function App() {
  const [page, setPageRaw] = useState<Page>('home')
  const [lang, setLang] = useState<Lang>('en')

  const setPage = (p: string) => {
    if (VALID_PAGES.includes(p as Page)) setPageRaw(p as Page)
  }

  const props = { lang, setPage }

  return (
    <>
      <Header lang={lang} setLang={setLang} setPage={setPage} page={page} />
      {page === 'home'    && <Home    {...props} />}
      {page === 'login'   && <SignIn  {...props} />}
      {page === 'member'  && <MemberPortal {...props} />}
      {page === 'about'   && <AboutBJJ {...props} />}
      {page === 'learn'   && <Learn   {...props} />}
      {page === 'coach'   && <Coach   {...props} />}
      {page === 'contact' && <Contact {...props} />}
      <Footer lang={lang} setPage={setPage} />
    </>
  )
}
