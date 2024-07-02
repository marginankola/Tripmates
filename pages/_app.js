import Layout from '../components/Layout'
import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import Loader from '../components/Loader'
import Router from 'next/router'
import { useState } from 'react'
import NProgress from 'nprogress'
import '../styles/nprogress.css'

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false)

  Router.events.on('routeChangeStart', () => {
    setLoading(true)
    NProgress.start()
  })
  Router.events.on('routeChangeComplete', () => {
    setLoading(false)
    NProgress.done()
  })

  return (
    <SessionProvider session={pageProps.session}>
      <Layout>{loading ? <Loader /> : <Component {...pageProps} />}</Layout>
    </SessionProvider>
  )
}

export default MyApp
