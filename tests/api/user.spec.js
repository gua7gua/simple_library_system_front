import { vi, describe, it, expect, beforeEach } from 'vitest'
import * as userApi from '@/api/user'
import request from '@/utils/request'

vi.mock('@/utils/request', () => ({
  default: vi.fn()
}))

describe('User API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login should call correct url with data', async () => {
    const data = { username: 'test', userpassword: '123456', isadmin: 0 }
    const mockRes = { status: 200, data: { token: 'abc' } }
    request.mockResolvedValue(mockRes)
    const result = await userApi.login(data)
    expect(request).toHaveBeenCalledWith({ url: '/user/login', method: 'post', data })
    expect(result).toEqual(mockRes)
  })

  it('getUserInfo should call correct url with token param', async () => {
    const mockRes = { data: { userid: 1, username: 'test' } }
    request.mockResolvedValue(mockRes)
    const result = await userApi.getUserInfo('abc')
    expect(request).toHaveBeenCalledWith({ url: '/user/info', method: 'get', params: { token: 'abc' } })
    expect(result).toEqual(mockRes)
  })

  it('logout should call correct url with token param', async () => {
    const mockRes = { status: 200, message: '登出成功' }
    request.mockResolvedValue(mockRes)
    const result = await userApi.logout('abc')
    expect(request).toHaveBeenCalledWith({ url: '/user/logout', method: 'get', params: { token: 'abc' } })
    expect(result).toEqual(mockRes)
  })

  it('register should call correct url with data', async () => {
    const data = { username: 'newuser', password: '123456' }
    const mockRes = { status: 200, message: '注册成功' }
    request.mockResolvedValue(mockRes)
    const result = await userApi.register(data)
    expect(request).toHaveBeenCalledWith({ url: '/user/register', method: 'post', data })
    expect(result).toEqual(mockRes)
  })

  it('alterPassword should call correct url with data', async () => {
    const data = { oldPassword: 'old', newPassword: 'new' }
    const mockRes = { status: 200, message: '修改成功' }
    request.mockResolvedValue(mockRes)
    const result = await userApi.alterPassword(data)
    expect(request).toHaveBeenCalledWith({ url: '/user/alterPassword', method: 'post', data })
    expect(result).toEqual(mockRes)
  })

  it('readerAlterPassword should call correct url with data', async () => {
    const data = { oldPassword: 'old', newPassword: 'new' }
    const mockRes = { status: 200, message: '修改成功' }
    request.mockResolvedValue(mockRes)
    const result = await userApi.readerAlterPassword(data)
    expect(request).toHaveBeenCalledWith({ url: '/user/reader/alterPassword', method: 'post', data })
    expect(result).toEqual(mockRes)
  })

  it('getUserCount should call correct url and method', async () => {
    request.mockResolvedValue(100)
    const result = await userApi.getUserCount()
    expect(request).toHaveBeenCalledWith({ url: '/user/getCount', method: 'get' })
    expect(result).toBe(100)
  })

  it('queryUsersByPage should call correct url with params', async () => {
    const params = { page: 1, size: 10 }
    const mockData = { code: 0, data: { records: [], total: 0 } }
    request.mockResolvedValue(mockData)
    const result = await userApi.queryUsersByPage(params)
    expect(request).toHaveBeenCalledWith({ url: '/user/queryUsersByPage', method: 'get', params })
    expect(result).toEqual(mockData)
  })

  it('addUser should call correct url with data', async () => {
    const data = { username: 'newuser', password: '123456', isadmin: 0 }
    const mockRes = { status: 200, message: '添加成功' }
    request.mockResolvedValue(mockRes)
    const result = await userApi.addUser(data)
    expect(request).toHaveBeenCalledWith({ url: '/user/addUser', method: 'post', data })
    expect(result).toEqual(mockRes)
  })

  it('deleteUser should call correct url with data', async () => {
    const data = { userid: 1 }
    const mockRes = { status: 200, message: '删除成功' }
    request.mockResolvedValue(mockRes)
    const result = await userApi.deleteUser(data)
    expect(request).toHaveBeenCalledWith({ url: '/user/deleteUser', method: 'delete', data })
    expect(result).toEqual(mockRes)
  })

  it('deleteUsers should call correct url with array data', async () => {
    const data = [1, 2]
    const mockRes = { status: 200, message: '批量删除成功' }
    request.mockResolvedValue(mockRes)
    const result = await userApi.deleteUsers(data)
    expect(request).toHaveBeenCalledWith({ url: '/user/deleteUsers', method: 'delete', data })
    expect(result).toEqual(mockRes)
  })

  it('updateUser should call correct url with data', async () => {
    const data = { userid: 1, username: 'updated' }
    const mockRes = { status: 200, message: '更新成功' }
    request.mockResolvedValue(mockRes)
    const result = await userApi.updateUser(data)
    expect(request).toHaveBeenCalledWith({ url: '/user/updateUser', method: 'put', data })
    expect(result).toEqual(mockRes)
  })
})
