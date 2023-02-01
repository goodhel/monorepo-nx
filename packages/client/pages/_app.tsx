import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { trpc } from '../utils/tprc'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { Fragment } from 'react'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Fragment>
      <Component {...pageProps} />
      <ToastContainer />
    </Fragment>
  )
}

export default trpc.withTRPC(MyApp)
