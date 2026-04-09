import { vi, describe, it, expect, beforeEach } from 'vitest'
import * as borrowApi from '@/api/borrow'
import request from '@/utils/request'

vi.mock('@/utils/request', () => ({
  default: vi.fn()
}))

describe('Borrow API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getBorrowCount should call correct url and method', async () => {
    request.mockResolvedValue(50)
    const result = await borrowApi.getBorrowCount()
    expect(request).toHaveBeenCalledWith({ url: '/borrow/getCount', method: 'get' })
    expect(result).toBe(50)
  })

  it('queryBorrowsByPage should call correct url with params', async () => {
    const params = { page: 1, limit: 10, userid: 1 }
    const mockData = { code: 0, data: { records: [], total: 0 } }
    request.mockResolvedValue(mockData)
    const result = await borrowApi.queryBorrowsByPage(params)
    expect(request).toHaveBeenCalledWith({ url: '/borrow/queryBorrowsByPage', method: 'get', params })
    expect(result).toEqual(mockData)
  })

  it('borrowBook should call correct url with params', async () => {
    const params = { userid: 1, bookid: 2 }
    const mockRes = { status: 200, message: '借书成功' }
    request.mockResolvedValue(mockRes)
    const result = await borrowApi.borrowBook(params)
    expect(request).toHaveBeenCalledWith({ url: '/borrow/borrowBook', method: 'post', params })
    expect(result).toEqual(mockRes)
  })

  it('readerBorrowBook should call correct url with params', async () => {
    const params = { userid: 1, bookid: 2 }
    const mockRes = { status: 200, message: '借书成功' }
    request.mockResolvedValue(mockRes)
    const result = await borrowApi.readerBorrowBook(params)
    expect(request).toHaveBeenCalledWith({ url: '/borrow/reader/borrowBook', method: 'post', params })
    expect(result).toEqual(mockRes)
  })

  it('returnBook should call correct url with params', async () => {
    const params = { borrowid: 1, bookid: 2 }
    const mockRes = { status: 200, message: '还书成功' }
    request.mockResolvedValue(mockRes)
    const result = await borrowApi.returnBook(params)
    expect(request).toHaveBeenCalledWith({ url: '/borrow/returnBook', method: 'post', params })
    expect(result).toEqual(mockRes)
  })

  it('readerReturnBook should call correct url with params', async () => {
    const params = { borrowid: 1, bookid: 2 }
    const mockRes = { status: 200, message: '还书成功' }
    request.mockResolvedValue(mockRes)
    const result = await borrowApi.readerReturnBook(params)
    expect(request).toHaveBeenCalledWith({ url: '/borrow/reader/returnBook', method: 'post', params })
    expect(result).toEqual(mockRes)
  })

  it('addBorrow should call correct url with data', async () => {
    const data = { userid: 1, bookid: 2 }
    const mockRes = { status: 200, message: '添加成功' }
    request.mockResolvedValue(mockRes)
    const result = await borrowApi.addBorrow(data)
    expect(request).toHaveBeenCalledWith({ url: '/borrow/addBorrow', method: 'post', data })
    expect(result).toEqual(mockRes)
  })

  it('deleteBorrow should call correct url with data', async () => {
    const data = { borrowid: 1 }
    const mockRes = { status: 200, message: '删除成功' }
    request.mockResolvedValue(mockRes)
    const result = await borrowApi.deleteBorrow(data)
    expect(request).toHaveBeenCalledWith({ url: '/borrow/deleteBorrow', method: 'delete', data })
    expect(result).toEqual(mockRes)
  })

  it('deleteBorrows should call correct url with array data', async () => {
    const data = [1, 2]
    const mockRes = { status: 200, message: '批量删除成功' }
    request.mockResolvedValue(mockRes)
    const result = await borrowApi.deleteBorrows(data)
    expect(request).toHaveBeenCalledWith({ url: '/borrow/deleteBorrows', method: 'delete', data })
    expect(result).toEqual(mockRes)
  })

  it('updateBorrow should call correct url with data', async () => {
    const data = { borrowid: 1, borrowstatus: 1 }
    const mockRes = { status: 200, message: '更新成功' }
    request.mockResolvedValue(mockRes)
    const result = await borrowApi.updateBorrow(data)
    expect(request).toHaveBeenCalledWith({ url: '/borrow/updateBorrow', method: 'put', data })
    expect(result).toEqual(mockRes)
  })
})
