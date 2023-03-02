import { router } from '../trpc'
import m$auth from '../modules/auth.module'

const authRouter = router({
  /**
   * Register User
   */
  register: m$auth.register,
  /**
   * Login User
   */
  login: m$auth.login
})

export default authRouter
