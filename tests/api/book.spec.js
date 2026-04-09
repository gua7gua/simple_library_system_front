import { vi, describe, it, expect, beforeEach } from 'vitest'
import * as bookApi from '@/api/book'
import request from '@/utils/request'

vi.mock('@/utils/request', () => ({
  default: vi.fn()
}))

describe('Book API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getBookCount should call correct url and method', async () => {
    request.mockResolvedValue(100)
    const result = await bookApi.getBookCount()
    expect(request).toHaveBeenCalledWith({ url: '/bookInfo/getCount', method: 'get' })
    expect(result).toBe(100)
  })

  it('queryAllBooks should call correct url and method', async () => {
    const mockData = [{ bookid: 1, bookname: '测试图书' }]
    request.mockResolvedValue(mockData)
    const result = await bookApi.queryAllBooks()
    expect(request).toHaveBeenCalledWith({ url: '/bookInfo/queryBookInfos', method: 'get' })
    expect(result).toEqual(mockData)
  })

  it('queryBooksByPage should call correct url with params', async () => {
    const params = { page: 1, limit: 10, bookname: 'Java' }
    const mockData = { code: 0, data: { records: [], total: 0 } }
    request.mockResolvedValue(mockData)
    const result = await bookApi.queryBooksByPage(params)
    expect(request).toHaveBeenCalledWith({ url: '/bookInfo/queryBookInfosByPage', method: 'get', params })
    expect(result).toEqual(mockData)
  })

  it('addBook should call correct url with data', async () => {
    const data = { bookname: '新书', bookauthor: '作者', booktypeid: 1 }
    const mockRes = { status: 200, message: '添加成功' }
    request.mockResolvedValue(mockRes)
    const result = await bookApi.addBook(data)
    expect(request).toHaveBeenCalledWith({ url: '/bookInfo/addBookInfo', method: 'post', data })
    expect(result).toEqual(mockRes)
  })

  it('deleteBook should call correct url with data', async () => {
    const data = { bookid: 1 }
    const mockRes = { status: 200, message: '删除成功' }
    request.mockResolvedValue(mockRes)
    const result = await bookApi.deleteBook(data)
    expect(request).toHaveBeenCalledWith({ url: '/bookInfo/deleteBookInfo', method: 'delete', data })
    expect(result).toEqual(mockRes)
  })

  it('deleteBooks should call correct url with array data', async () => {
    const data = [1, 2, 3]
    const mockRes = { status: 200, message: '批量删除成功' }
    request.mockResolvedValue(mockRes)
    const result = await bookApi.deleteBooks(data)
    expect(request).toHaveBeenCalledWith({ url: '/bookInfo/deleteBookInfos', method: 'delete', data })
    expect(result).toEqual(mockRes)
  })

  it('updateBook should call correct url with data', async () => {
    const data = { bookid: 1, bookname: '更新书名' }
    const mockRes = { status: 200, message: '更新成功' }
    request.mockResolvedValue(mockRes)
    const result = await bookApi.updateBook(data)
    expect(request).toHaveBeenCalledWith({ url: '/bookInfo/updateBookInfo', method: 'put', data })
    expect(result).toEqual(mockRes)
  })
})
