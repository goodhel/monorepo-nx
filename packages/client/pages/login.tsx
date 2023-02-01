import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { trpc } from '../utils/tprc'
import Router from 'next/router'
import { toast } from 'react-toastify'
import { TRPCClientError } from '@trpc/client'
import useAuthStore from '../store/authStore'
import ContainerBlock from '../components/ContainerBlock'

const Login = () => {
//   const utils = trpc.useContext()
  const { token, addToken } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = trpc.auth.login.useMutation({
    async onSuccess () {
      // Router.push('/dashboard')
      toast.success('Login success', {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const log = await login.mutateAsync({
        email,
        password
      })

      addToken(log.data?.token)

      setEmail('')
      setPassword('')
    } catch (error: unknown) {
      // console.log(typeof error)
      // console.error({ error }, 'Failed to add post')
      if (error instanceof TRPCClientError) {
        toast.error(error.message, {
          position: toast.POSITION.TOP_RIGHT
        })
      } else {
        toast.error('Something went wrong', {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    }
  }

  useEffect(() => {
    if (token) {
      Router.push('/dashboard')
    }
  }, [token])

  return (
    <ContainerBlock title='Login'>
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
          <div className="flex justify-center items-center">
              <div className="w-full m-5 p-5 rounded-lg">
                  <h2 className="text-center text-4xl text-indigo-900 font-semibold lg:text-left xl:text-5xl xl:font-bold">
                      Login
                  </h2>
                  <div className="mt-12">
                      <form onSubmit={handleSubmit}>
                          <div>
                              <div className="text-sm font-bold text-gray-700 tracking-wide">Email Address</div>
                              <input onChange={(e) => setEmail(e.target.value)} name='email' type="email" placeholder="nevermind@example.com"
                              className="w-full rounded-md text-lg py-2 border-b border-gray-200 focus:outline-none focus:border-indigo-500" required/>
                          </div>
                          <div className="mt-12">
                              <div className="flex justify-between items-center">
                                  <div className="text-sm font-bold text-gray-700 tracking-wide">
                                      Password
                                  </div>
                                  <Link href="" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                                      Forgot Password
                                  </Link>
                              </div>
                              <input onChange={(e) => setPassword(e.target.value)} name='password' type="password" placeholder='Input your password here'
                              className='w-full rounded-md text-lg py-2 border-b border-gray-200 focus:outline-none focus:border-indigo-500' required/>
                          </div>
                          <div className='mt-10 flex justify-center'>
                              <button className='bg-indigo-500 text-gray-100 p-4 w-1/2 rounded-full tracking-wide
                              font-semibold shadow-lg focus:outline-none hover:bg-indigo-600'>
                                  Log In
                              </button>
                          </div>
                      </form>
                  </div>
                  <div className='mt-10 flex justify-center'>
                      <div className='text-sm font-semibold text-gray-700'>
                          {'Don\'t have an account ? '}
                          <Link href="" className='text-indigo-600 hover:text-indigo-800'>
                              Sign Up
                          </Link>
                      </div>
                  </div>
                  <div className='mt-12 flex justify-center'>
                      <div className='text-sm font-semibold text-gray-500'>
                          <p>This is email: {email}</p>
                          <p>This is password: {password}</p>
                      </div>
                  </div>
              </div>
          </div>
          <div>
              Picture
          </div>
      </div>
    </ContainerBlock>
  )
}

export default Login
