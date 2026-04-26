import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Layout from '@/views/Layout.vue'
import Dashboard from '@/views/Dashboard.vue'
import BookList from '@/views/BookList.vue'
import BorrowRecord from '@/views/BorrowRecord.vue'
import PasswordChange from '@/views/PasswordChange.vue'
import Donation from '@/views/Donation.vue'
import BookManage from '@/views/admin/BookManage.vue'
import BorrowManage from '@/views/admin/BorrowManage.vue'
import UserManage from '@/views/admin/UserManage.vue'
import BookTypeManage from '@/views/admin/BookTypeManage.vue'
import DonationManage from '@/views/admin/DonationManage.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '首页' }
      },
      {
        path: '/books',
        name: 'BookList',
        component: BookList,
        meta: { title: '图书查询' }
      },
      {
        path: '/borrow-record',
        name: 'BorrowRecord',
        component: BorrowRecord,
        meta: { title: '借阅记录' }
      },
      {
        path: '/password',
        name: 'PasswordChange',
        component: PasswordChange,
        meta: { title: '修改密码' }
      },
      {
        path: '/donation',
        name: 'Donation',
        component: Donation,
        meta: { title: '图书捐赠' }
      },
      {
        path: '/admin/book-manage',
        name: 'BookManage',
        component: BookManage,
        meta: { title: '图书管理', requireAdmin: true }
      },
      {
        path: '/admin/borrow-manage',
        name: 'BorrowManage',
        component: BorrowManage,
        meta: { title: '借阅管理', requireAdmin: true }
      },
      {
        path: '/admin/users',
        name: 'UserManage',
        component: UserManage,
        meta: { title: '用户管理', requireAdmin: true }
      },
      {
        path: '/admin/book-types',
        name: 'BookTypeManage',
        component: BookTypeManage,
        meta: { title: '类型管理', requireAdmin: true }
      },
      {
        path: '/admin/donation-manage',
        name: 'DonationManage',
        component: DonationManage,
        meta: { title: '捐赠管理', requireAdmin: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 图书管理系统` : '图书管理系统'

  // 获取 token
  const token = localStorage.getItem('token')

  // 允许登录页和注册页和404页
  if (to.path === '/login' || to.path === '/register' || to.path === '/404') {
    next()
  } else if (to.name === 'NotFound') {
    // 404页无token也能访问
    next()
  } else {
    // 访问其他页面需要验证 token
    if (token) {
      // 检查是否需要管理员权限
      if (to.meta.requireAdmin) {
        const isAdmin = localStorage.getItem('isadmin') === '1'
        if (isAdmin) {
          next()
        } else {
          // 非管理员，跳转到首页
          next('/dashboard')
        }
      } else {
        next()
      }
    } else {
      // 未登录，跳转到登录页
      next('/login')
    }
  }
})

export default router
