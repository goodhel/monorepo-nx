import Head from 'next/head'
import { Fragment, ReactNode } from 'react'

type ContainerBlockProps = {
    children: ReactNode
    title: string
}

const ContainerBlock = ({ children, title }: ContainerBlockProps) => {
  return (
        <Fragment>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                {children}
            </main>
        </Fragment>
  )
}

export default ContainerBlock
