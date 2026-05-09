# 图书管理系统 - 前端

基于 Vue 3 + Vite + Element Plus 的图书管理系统前端项目，提供图书查询、借阅管理、用户管理等功能。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 7
- **UI 组件库**: Element Plus 2.9
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **测试框架**: Vitest + @vue/test-utils
- **开发工具**: Vue DevTools

## 功能模块

### 用户功能
- 用户注册/登录
- 图书查询（支持按书名、作者、分类等条件搜索）
- 图书借阅
- 借阅记录查看
- 图书捐赠
- 修改密码

### 管理员功能
- 图书管理（增删改查）
- 图书分类管理
- 借阅管理（审批、归还）
- 用户管理
- 捐赠管理

## 环境要求

- Node.js: `^20.19.0` 或 `>=22.12.0`
- npm 或其他包管理器

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动。

### 3. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 4. 预览生产构建

```bash
npm run preview
```

### 5. 运行测试

```bash
npm run test
```

## 后端配置

项目通过 Vite 代理转发 API 请求到后端服务，避免跨域问题。

**开发环境配置** (vite.config.js):
- 前端请求路径: `http://localhost:5173/api/xxx`
- 代理目标: `http://localhost:8092/BookManager/xxx`

**后端要求**:
- 后端服务需在 `http://localhost:8092/BookManager` 启动
- 如需修改后端地址，请编辑 `vite.config.js` 中的 `server.proxy` 配置

## 项目结构

```
simple_library_system_front/
├── src/
│   ├── api/              # API 接口封装
│   │   ├── book.js       # 图书相关接口
│   │   ├── bookType.js   # 图书分类接口
│   │   ├── borrow.js     # 借阅相关接口
│   │   ├── donation.js   # 捐赠相关接口
│   │   └── user.js       # 用户相关接口
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── router/           # 路由配置
│   ├── utils/            # 工具函数
│   │   └── request.js    # Axios 封装
│   ├── views/            # 页面组件
│   │   ├── admin/        # 管理员页面
│   │   ├── Login.vue     # 登录页
│   │   ├── Register.vue  # 注册页
│   │   ├── Dashboard.vue # 首页
│   │   ├── BookList.vue  # 图书查询
│   │   ├── BorrowRecord.vue # 借阅记录
│   │   ├── Donation.vue  # 图书捐赠
│   │   └── ...
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── tests/                # 测试文件
├── doc/                  # 项目文档
├── public/               # 公共静态资源
├── vite.config.js        # Vite 配置
├── vitest.config.js      # Vitest 配置
└── package.json          # 项目依赖
```

## 路由说明

### 公开路由
- `/login` - 登录页
- `/register` - 注册页

### 需要登录的路由
- `/dashboard` - 首页
- `/books` - 图书查询
- `/borrow-record` - 借阅记录
- `/donation` - 图书捐赠
- `/password` - 修改密码

### 管理员路由（需要管理员权限）
- `/admin/book-manage` - 图书管理
- `/admin/book-types` - 类型管理
- `/admin/borrow-manage` - 借阅管理
- `/admin/users` - 用户管理
- `/admin/donation-manage` - 捐赠管理

## 权限控制

项目使用路由守卫实现权限控制：
- 未登录用户只能访问登录页和注册页
- 已登录用户可访问所有用户功能
- 管理员用户可访问管理员功能（通过 `localStorage.isadmin` 判断）

## 开发说明

### API 请求封装

所有 API 请求通过 `src/utils/request.js` 统一封装，自动处理：
- 请求拦截（添加 token）
- 响应拦截（统一错误处理）
- 超时设置

### 状态管理

项目使用 `localStorage` 存储用户信息：
- `token`: 用户登录凭证
- `isadmin`: 是否为管理员（1 为管理员，0 为普通用户）

### 样式规范

- 使用 Element Plus 组件库默认主题
- 自定义样式放在 `src/assets/` 目录

## 测试

项目包含单元测试，覆盖：
- API 接口层测试
- 路由配置测试
- 工具函数测试

运行测试：
```bash
npm run test
```

## 相关文档

详细文档请查看 `doc/` 目录：
- [环境配置说明](doc/env.md)
- [快速启动指南](doc/快速启动指南.md)
- [后端 API 文档](doc/后端接口文档实现.md)
- [提交规范](doc/commit-convention.md)

## 推荐 IDE 配置

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 推荐浏览器插件

- Chromium 系浏览器: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## 许可证

本项目为课程实践项目。

## 贡献者

感谢所有为本项目做出贡献的开发者。
