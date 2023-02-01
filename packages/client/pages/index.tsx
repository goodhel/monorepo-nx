// import { Inter } from '@next/font/google'
import ContainerBlock from '../components/ContainerBlock'
// import Container from '../components/Container'
import Login from './login'

// const inter = Inter({ subsets: ['latin'] })

export default function Home () {
  return (
    <ContainerBlock title='Login'>
      {/* <Container> */}
        <Login />
      {/* </Container> */}
    </ContainerBlock>
  )
}
