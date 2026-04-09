import { vi, describe, it, expect, beforeEach } from 'vitest'
import * as bookTypeApi from '@/api/bookType'
import request from '@/utils/request'

vi.mock('@/utils/request', () => ({
  default: vi.fn()
}))

describe('BookType API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getBookTypeCount should call correct url and method', async () => {
    request.mockResolvedValue(5)
    const result = await bookTypeApi.getBookTypeCount()
    expect(request).toHaveBeenCalledWith({ url: '/bookType/getCount', method: 'get' })
    expect(result).toBe(5)
  })

  it('queryAllBookTypes should call correct url and method', async () => {
    const mockData = [{ booktypeid: 1, booktypename: '文学' }]
    request.mockResolvedValue(mockData)
    const result = await bookTypeApi.queryAllBookTypes()
    expect(request).toHaveBeenCalledWith({ url: '/bookType/queryBookTypes', method: 'get' })
    expect(result).toEqual(mockData)
  })

  it('readerQueryAllBookTypes should call correct url and method', async () => {
    const mockData = [{ booktypeid: 1, booktypename: '文学' }]
    request.mockResolvedValue(mockData)
    const result = await bookTypeApi.readerQueryAllBookTypes()
    expect(request).toHaveBeenCalledWith({ url: '/bookType/reader/queryBookTypes', method: 'get' })
    expect(result).toEqual(mockData)
  })

  it('queryBookTypesByPage should call correct url with params', async () => {
    const params = { page: 1, limit: 10, booktypename: '文学' }
    const mockData = { code: 0, data: { records: [], total: 0 } }
    request.mockResolvedValue(mockData)
    const result = await bookTypeApi.queryBookTypesByPage(params)
    expect(request).toHaveBeenCalledWith({ url: '/bookType/queryBookTypesByPage', method: 'get', params })
    expect(result).toEqual(mockData)
  })

  it('addBookType should call correct url with data', async () => {
    const data = { booktypename: '新增类型' }
    const mockRes = { status: 200, message: '添加成功' }
    request.mockResolvedValue(mockRes)
    const result = await bookTypeApi.addBookType(data)
    expect(request).toHaveBeenCalledWith({ url: '/bookType/addBookType', method: 'post', data })
    expect(result).toEqual(mockRes)
  })

  it('deleteBookType should call correct url with data', async () => {
    const data = { booktypeid: 1 }
    const mockRes = { status: 200, message: '删除成功' }
    request.mockResolvedValue(mockRes)
    const result = await bookTypeApi.deleteBookType(data)
    expect(request).toHaveBeenCalledWith({ url: '/bookType/deleteBookType', method: 'delete', data })
    expect(result).toEqual(mockRes)
  })

  it('deleteBookTypes should call correct url with array data', async () => {
    const data = [1, 2]
    const mockRes = { status: 200, message: '批量删除成功' }
    request.mockResolvedValue(mockRes)
    const result = await bookTypeApi.deleteBookTypes(data)
    expect(request).toHaveBeenCalledWith({ url: '/bookType/deleteBookTypes', method: 'delete', data })
    expect(result).toEqual(mockRes)
  })

  it('updateBookType should call correct url with data', async () => {
    const data = { booktypeid: 1, booktypename: '更新类型' }
    const mockRes = { status: 200, message: '更新成功' }
    request.mockResolvedValue(mockRes)
    const result = await bookTypeApi.updateBookType(data)
    expect(request).toHaveBeenCalledWith({ url: '/bookType/updateBookType', method: 'put', data })
    expect(result).toEqual(mockRes)
  })
})
