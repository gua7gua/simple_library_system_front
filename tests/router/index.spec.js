import { vi, describe, it, expect, beforeEach } from 'vitest'

function createGuard() {
  return (to, from, next) => {
    document.title = to.meta.title ? `${to.meta.title} - 图书管理系统` : '图书管理系统'
    const token = localStorage.getItem('token')
    if (to.path === '/login' || to.path === '/register' || to.path === '/404') {
      next()
    } else if (to.name === 'NotFound') {
      next()
    } else {
      if (token) {
        if (to.meta.requireAdmin) {
          const isAdmin = localStorage.getItem('isadmin') === '1'
          if (isAdmin) {
            next()
          } else {
            next('/dashboard')
          }
        } else {
          next()
        }
      } else {
        next('/login')
      }
    }
  }
}

describe('Router Guard', () => {
  let guardFn

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem.mockReturnValue(null)
    guardFn = createGuard()
  })

  it('should allow access to /login without token', () => {
    const next = vi.fn()
    guardFn({ path: '/login', meta: { title: '登录' } }, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('should allow access to /register without token', () => {
    const next = vi.fn()
    guardFn({ path: '/register', meta: { title: '注册' } }, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('should redirect to /login when accessing protected route without token', () => {
    const next = vi.fn()
    guardFn({ path: '/dashboard', meta: { title: '首页' } }, {}, next)
    expect(next).toHaveBeenCalledWith('/login')
  })

  it('should allow access to protected route with token', () => {
    localStorage.getItem.mockImplementation(key => {
      if (key === 'token') return 'mock-token'
      if (key === 'isadmin') return '0'
      return null
    })
    const next = vi.fn()
    guardFn({ path: '/dashboard', meta: { title: '首页' } }, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('should allow admin route access when user is admin', () => {
    localStorage.getItem.mockImplementation(key => {
      if (key === 'token') return 'mock-token'
      if (key === 'isadmin') return '1'
      return null
    })
    const next = vi.fn()
    guardFn({ path: '/admin/book-manage', meta: { title: '图书管理', requireAdmin: true } }, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('should redirect to /dashboard when non-admin accesses admin route', () => {
    localStorage.getItem.mockImplementation(key => {
      if (key === 'token') return 'mock-token'
      if (key === 'isadmin') return '0'
      return null
    })
    const next = vi.fn()
    guardFn({ path: '/admin/book-manage', meta: { title: '图书管理', requireAdmin: true } }, {}, next)
    expect(next).toHaveBeenCalledWith('/dashboard')
  })

  it('should allow access to NotFound route without token', () => {
    const next = vi.fn()
    guardFn({ name: 'NotFound', path: '/not-exist', meta: { title: '404' } }, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('should set page title from meta.title', () => {
    const next = vi.fn()
    guardFn({ path: '/login', meta: { title: '登录' } }, {}, next)
    expect(document.title).toBe('登录 - 图书管理系统')
  })

  it('should set default page title when meta.title is absent', () => {
    const next = vi.fn()
    guardFn({ path: '/login', meta: {} }, {}, next)
    expect(document.title).toBe('图书管理系统')
  })
})
