import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useAuthStore from '../store/authStore'

const Dashboard = () => {
  const router = useRouter()
  const { token, removeToken } = useAuthStore()

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
    <div>
        <h2>Dashboard</h2>
        <button onClick={logout} className='mt-12 bg-red-400 rounded-md p-2 shadow-md text-white'>
          Logout
        </button>
    </div>
  )
}

export default Dashboard
