import React, { useState } from 'react'
import ContainerBlock from '../components/ContainerBlock'
import { trpc } from '../utils/tprc'
import { toast } from 'react-toastify'
import { TRPCClientError } from '@trpc/client'
import { useRouter } from 'next/router'

const Register = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const regis = trpc.auth.register.useMutation({
    async onSuccess () {
      router.push('/login')
      toast.success('Berhasil register', {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const register = await regis.mutateAsync({
        email,
        name,
        password
      })

      if (register.data) {
        setEmail('')
        setName('')
        setPassword('')
      } else {
        throw new Error('Something went wrong, data is undefined')
      }
    } catch (error: unknown) {
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
  return (
    <ContainerBlock title='Register'>
        <div className='flex justify-center items-center h-screen'>
            <div className='p-4 rounded-md shadow-md w-1/3'>
                <h2 className='text-4xl text-center font-bold text-indigo-800'>
                    Register
                </h2>
                <div className="mt-12">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className="text-sm font-bold text-gray-700 tracking-wide">Email Address</div>
                            <input onChange={(e) => setEmail(e.target.value)} name='email' type="email" placeholder="nevermind@example.com"
                            className="w-full rounded-md text-lg py-2 border-b border-gray-200 focus:outline-none focus:border-indigo-500" required/>
                        </div>
                        <div className='mt-12'>
                            <div className="text-sm font-bold text-gray-700 tracking-wide">Name</div>
                            <input onChange={(e) => setName(e.target.value)} name='name' type="text" placeholder="Nevermind"
                            className="w-full rounded-md text-lg py-2 border-b border-gray-200 focus:outline-none focus:border-indigo-500" required/>
                        </div>
                        <div className="mt-12">
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold text-gray-700 tracking-wide">
                                    Password
                                </div>
                            </div>
                            <input onChange={(e) => setPassword(e.target.value)} name='password' type="password" placeholder='Input your password here'
                            className='w-full rounded-md text-lg py-2 border-b border-gray-200 focus:outline-none focus:border-indigo-500' required/>
                        </div>
                        <div className='mt-10 flex justify-center'>
                            <button className='bg-indigo-500 text-gray-100 p-4 w-1/2 rounded-full tracking-wide
                            font-semibold shadow-lg focus:outline-none hover:bg-indigo-600'>
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </ContainerBlock>
  )
}

export default Register
