# 服务端安全依赖迁移

本次修复覆盖服务端依赖和 PDF 导出的具体输入/文件处理风险，不代表整个 CMS 已完成安全审计，也不代表依赖公告中的每个问题都能在本站被远程利用。

## 变更

- Mongoose 4 → 8.24.8，迁移废弃的 `count/update/remove` 和回调 API；启用过滤器清理并验证登录字段类型。
- Koa 1 → 2.16.4，继续使用 Koa 2 的 generator 兼容层，避免重写所有路由。Koa 3 不支持此兼容路径。
- 删除 `html-pdf` 和 PhantomJS，改用维护中的 Puppeteer/Chromium。PDF 不再信任请求的 Origin，也不使用订单号构造文件路径。
- PDF 仅嵌入本地 `/api/media/pic/` 里的 PNG/JPEG/GIF/WebP，拒绝目录穿越、符号链接和非图片文件；外部、内网、`file:`、SVG 图片都不加载。Chromium 禁用脚本，拦截其他请求，并保留浏览器沙箱。
- 输出使用随机文件名并完整写入后发布，响应仍为 `{ state, err, name }`。单次最多 100 行、单字段 4096 字符，总文字 256 KiB，总图片 10 MiB、单图 2 MiB；每个 Node 进程只同时生成一个 PDF，忙时返回 503。
- 更新 log4js、Qiniu、cross-env，适配日志配置及备份示例；提交服务端 lockfile。开发启动改用 Node 自带 watch。
- Cookie 加密示例改为随机 IV 的 AES-256-GCM；没有生产密钥时拒绝启动。损坏 Cookie 不再触发解密异常，登录同时要求有效验证码 Cookie。
- 管理端旧开发服务器只监听 `127.0.0.1`。这减少网络暴露，不修复旧前端依赖本身，也不能替代 DNS rebinding 等其他防护。

## 部署前必做

1. 使用 Node **>=22.12.0**，MongoDB **>=4.2**。数据库大版本升级应先备份并按 MongoDB 官方流程逐级迁移，不能直接把旧数据库文件交给新服务。`MONGODB_URI` 可覆盖默认的 `mongodb://127.0.0.1:27017/bowling`。
2. 在 `server/` 执行 `npm ci`。默认会下载与 Puppeteer 匹配的 Chromium。部署环境必须有浏览器系统依赖、中文字体，以及可用的 Chromium 沙箱。不要用 `--no-sandbox` 绕过启动问题。可用 `PUPPETEER_EXECUTABLE_PATH` 指向经过维护的兼容浏览器；缓存应在安装与运行用户之间正确配置。
3. 将更新后的 `server/lib/cry.demo.js` 复制为部署环境的 `server/lib/cry.js`，或等价迁移现有的私有实现。设置随机 32 字节的 Base64 `CMS_COOKIE_KEY`，从部署密钥管理器注入，所有 API 实例使用同一个值。示例生成命令：`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`。不要提交或记录生成的值。旧 Cookie 不兼容，所有管理员需要重新登录。
4. 如使用私有 `schedule.js`，同步适配 Qiniu 7 的示例，注入 `QINIU_ACCESS_KEY`、`QINIU_SECRET_KEY` 和可选 `QINIU_BUCKET`。本次没有对真实云存储执行上传。
5. 在预发布环境验证登录/权限、管理端 CRUD、商品分组删除、上传、页面渲染和 PDF。远程/CDN 图片现在不进入 PDF；需要这些图片时，另行设计可信图片导入流程，而不要直接恢复任意 URL 请求。大于 100 行的订单应分批导出。
6. 执行 `npm test`、`npm audit --audit-level=high` 和 `npm run test:pdf`。只有后一个命令实际启动 Chromium。确认 PDF 中文字体、分页和本地图显示后再合并/部署。

## 验证与未覆盖范围

本次云环境中，16 个服务端回归测试通过，涵盖 Mongoose 实际模型/转换/钩子（替换数据库传输层）、旧 generator 中间件、验证码/加密、PDF 输入、模板转义、请求拦截策略以及完整文件发布。没有接入真实 MongoDB。实际 Chromium smoke 已尝试，但主机以 `Operation not permitted` 拒绝浏览器所需的 socket/ptrace，未成功渲染；未禁用浏览器沙箱。新增 CI 在 Node 22/24 检查安装、回归测试与 audit，CI 不等于真实业务端到端验证。

同一审计环境下，服务端新 lockfile 的 `npm audit` 为 0 项；从原 manifest 新解析的基线为 36 项。原仓库没有 lockfile，这不是对现网安装版本的精确比较。审计结果会随公告更新而改变，0 项也不代表无漏洞。

前端 Vue 2/Webpack 1 工具链未进行破坏性升级。单独解析原前端 manifest 的审计仍报告 140 项（51 critical、39 high），其中生产依赖审计有 6 个受影响包（3 high）。这些是依赖图告警，不是已证明的实际利用。Babel 6、编辑器及 webpack/loader 组合需要独立迁移和完整构建/界面回归；不要直接执行 `npm audit fix --force`，不要把开发服务器用于生产或反向代理到公网。

另外，旧 MD5 密码存储、权限/session 设计、公开读取接口、富文本内容处理以及弃用的路由/上传中间件仍需单独审计。本 PR 不宣称已解决这些问题。
