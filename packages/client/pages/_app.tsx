import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { trpc } from '../utils/tprc'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default trpc.withTRPC(MyApp)
