import { TRPCError } from '@trpc/server'

interface DataType {
    status: boolean
    code?: string
    data?: unknown
    error?: string
}

class _response {
  sendResponse = async (data: DataType) => {
    if (!data.status) {
      const code: any = data.code ? data.code : 'BAD_REQUEST'
      throw new TRPCError({
        code,
        message: data.error
      })
    }

    return data
  }
}

export default new _response()
