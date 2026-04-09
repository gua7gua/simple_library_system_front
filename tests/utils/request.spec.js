import { vi, describe, it, expect, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  }
}))

describe('request utils', () => {
  let request

  beforeEach(async () => {
    vi.resetModules()
    localStorage.getItem.mockReturnValue(null)
    const mod = await import('@/utils/request')
    request = mod.default
  })

  describe('request interceptor', () => {
    it('should not add token param when localStorage has no token', async () => {
      localStorage.getItem.mockReturnValue(null)
      const config = { params: {} }
      const interceptor = axios.create().interceptors.request
      const result = await request.interceptors.request.handlers[0].fulfilled(config)
      expect(result.params).not.toHaveProperty('token')
    })

    it('should add token param when localStorage has token', async () => {
      localStorage.getItem.mockReturnValue('test-token')
      const config = { params: { page: 1 } }
      const result = await request.interceptors.request.handlers[0].fulfilled(config)
      expect(result.params.token).toBe('test-token')
      expect(result.params.page).toBe(1)
    })
  })

  describe('response interceptor', () => {
    it('should return data when status is 200', async () => {
      const response = { data: { status: 200, message: '成功', data: { id: 1 } } }
      const result = await request.interceptors.response.handlers[0].fulfilled(response)
      expect(result.status).toBe(200)
      expect(result.data.id).toBe(1)
    })

    it('should reject and show error when status is 420', async () => {
      const { ElMessage } = await import('element-plus')
      const response = { data: { status: 420, message: '操作失败' } }
      await expect(request.interceptors.response.handlers[0].fulfilled(response)).rejects.toThrow('操作失败')
      expect(ElMessage.error).toHaveBeenCalledWith('操作失败')
    })

    it('should return data when code is 0', async () => {
      const response = { data: { code: 0, data: { records: [], total: 0 } } }
      const result = await request.interceptors.response.handlers[0].fulfilled(response)
      expect(result.code).toBe(0)
      expect(result.data.records).toEqual([])
    })

    it('should reject and show error when code is not 0', async () => {
      const { ElMessage } = await import('element-plus')
      const response = { data: { code: 1, message: '查询失败' } }
      await expect(request.interceptors.response.handlers[0].fulfilled(response)).rejects.toThrow('查询失败')
      expect(ElMessage.error).toHaveBeenCalledWith('查询失败')
    })

    it('should return raw data when neither status nor code is present', async () => {
      const response = { data: 42 }
      const result = await request.interceptors.response.handlers[0].fulfilled(response)
      expect(result).toBe(42)
    })

    it('should reject and show error on network error', async () => {
      const { ElMessage } = await import('element-plus')
      const error = new Error('Network Error')
      await expect(request.interceptors.response.handlers[0].rejected(error)).rejects.toThrow('Network Error')
      expect(ElMessage.error).toHaveBeenCalledWith('Network Error')
    })
  })
})
