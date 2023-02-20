import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import ContainerBlock from '../components/ContainerBlock'

const Dashboard = () => {
  const router = useRouter()
  const { token, removeToken } = useAuthStore()
  // const today = new Date()
  // const dateDefault = today.toLocaleDateString('en-CA')

  const [date, setDate] = useState('')
  const [amount, setAmount] = useState(0)
  const [type, setType] = useState('expense')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log('submit')

    try {
      const data = {
        date,
        amount,
        type: type.toLocaleUpperCase(),
        description: description === '' ? undefined : description
      }

      console.log(data)

      // Reset state
      setDate('')
      setAmount(0)
      setType('expense')
      setDescription('')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log('dashboard effect')
    if (!token) {
      router.push('/login')
    }
  }, [router, token])

  const logout = () => {
    removeToken()
  }

  return (
    <ContainerBlock title='Dashboard'>
      <div className='h-screen'>
        <div className='flex justify-between p-4 '>
          <h2 className='font-semibold text-4xl text-amber-500'>Bikin Catatan</h2>
          <button onClick={logout} className='bg-orange-400 rounded-md p-2 shadow-md text-white'>
            Logout
          </button>
        </div>
        <div className='flex mx-3 my-5 gap-3 flex-col md:flex-row'>
          <div className='p-5 md:w-1/2 rounded-md shadow-md'>
            <h3 className='text-xl text-orange-400'>Form</h3>
            <div className='mt-8'>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="" className=''>Date</label>
                  <input name='date' type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md text-lg py-2 border-b border-gray-200 focus:outline-none focus:border-indigo-500" required/>
                </div>
                <div className='mt-5'>
                  <label htmlFor="" className=''>Amount</label>
                  <input type="number" name='amount' value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-md text-lg py-2 border-b border-gray-200 focus:outline-none focus:border-indigo-500" required/>
                </div>
                <div className='mt-5'>
                  <label htmlFor="" className=''>Type</label>
                  <select name="type" value={type} onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-md text-lg py-2 border-b border-gray-200 focus:outline-none focus:border-indigo-500">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className='mt-5'>
                  <label htmlFor="" className=''>Description</label>
                  <textarea name='description' value={description} rows={2} onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md text-lg py-2 border-b border-gray-200 focus:outline-none focus:border-indigo-500"/>
                </div>

                <div className='mt-8'>
                  <button type='submit' className='p-2 bg-blue-500 rounded-md shadow-sm text-white hover:bg-blue-700'>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className='p-5 md:w-1/2 rounded-md shadow-md'>
            <h3 className='text-xl text-orange-400'>
              List
            </h3>
            <div className='mt-8'>
              Table
            </div>
          </div>
        </div>
      </div>
    </ContainerBlock>
  )
}

export default Dashboard
