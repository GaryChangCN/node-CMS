# node-CMS
由node.js书写企业内容管理系统

## 来源

由我和 [@JxJayden](https://github.com/JxJayden) 共同开发的企业内容管理系统。此版本移除了七牛云密钥及加密密钥，并以 `.demo.js`做结尾。

## 使用

```bash
git clone 
cd f2e/admin && npm install
cd server && npm install
cd f2e/admin && npm run dev (npm run build)
cd server && npm run dev (npm run product)
cd server && npm run render (npm run render-product)
cd server && node schedule.js

#之后需要配置 `nginx` 根据 `/api`前缀反向代理本地 `3000` 端口。默认代理 `3001` 渲染端口。
#并设置`admin.xxx.xxx` (管理页面)静态文件目录为 `vue` 打包后目录。

#首次使用需要 cd server && npm run initAdmin 来初始化超级管理员数据库。
#如需启用备份数据库 则使用  cd server && node schedule.js 默认为每晚23点备份到本地，
#每周日23点上传最后次备份到七牛云。

```

## 架构

前端分为用户端和管理员端。其中管理员端使用 `vue2.0` 配合 `elementUI` 的单页应用，由`vue-cli`搭建，用户端使用 `jQuery` 配合 `arTemplate` 多页网站，由`gulp`做相关处理。预编译器全部采用 `less` 。

后端分为渲染端和API端。全部使用 `koa1.0` 处理。采用`mongoose`连接数据库。

## 特点

因本项目为专门公司定制，所以功能相对比较特殊化，但作为基础CMS系统，文章管理、商品管理、分组管理、管理员管理、订单（询单）管理,还是存在的。

### 特殊化

网站支持中英文切换，支持保存订单（询单）到PDF（使用`phantomjs`），支持页面样式修改（包括不限于图片文字修改）,用户端为响应式设计仅适配PC和移动端。

## API 说明

[渲染api说明](doc/renderapi.md)

[后台api说明](doc/adminapi.md)

## 声明

此开源项目bug修复会落后 `private` 版本一段时间，另外不详细解释项目部署问题（因为目前能力有限不会做自动化部署）

## 已知问题

1. `koa-cookie` 和 `session` 中间件会生成一个加密和一个不加密的 `cookie` 这里我使用 `node.js` 自带的加密模块做加密。
2. `elementUI 1.0.0` 版本数据更改但表格渲染会有延迟，通过改变两次中英切换简单解决。
