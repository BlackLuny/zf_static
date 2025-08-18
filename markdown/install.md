## ZFC 一键安装使用说明

### 一键安装
```bash
bash <(curl -s https://get.zeroforwarder.com/install.sh)
```

开始前请准备：
- VPS一台，建议至少2G内存，磁盘空间至少40G
- 已解析到服务器公网 IP 的两个域名：
  - 前端：如 `forward.example.com`
  - 控制器：如 `zf-controler.example.com`
- License：`ZFC_INSTANCE_ID`、`ZFC_API_KEY`
- 如启用 Caddy（推荐自动签发 HTTPS），请确保 80/443 未被占用；使用 Cloudflare 时不要开启“小黄云”。
准备一个目录，专门用来安装，比如/root/zfc
```bash
mkdir -p /root/zfc
```

### 安装流程（交互式）
1) 选择【1. 全新安装】
2) 依次输入：
   - 前端域名（WEB_DOMAIN）
   - 控制器域名（CONTROLER_DOMAIN）
   - `ZFC_INSTANCE_ID` 与 `ZFC_API_KEY`
3) 选择数据库：
   - 内置（推荐，零配置）或外部（如已自备）
4) 是否启用 Caddy 自动 HTTPS（推荐）
5) 镜像仓库/标签：直接回车使用默认即可

脚本会自动完成配置、启动服务并创建管理员，最后会显示管理员 Token（同时写入 `.admin_token`）。

### 安装完成后
- 前端访问：`https://<WEB_DOMAIN>`
- 管理员 Token：安装完成页会显示一次，同时保存在 `.admin_token` 文件
- 配置文件：`.env`、`docker-compose.yml`（无需手动修改）

### 常用操作
- 更新系统（保留数据）：运行脚本选择【2. 更新镜像】
- 卸载系统：运行脚本选择【3. 卸载系统】
  - 仅停止服务 / 清理内置数据 / 完全卸载（按需选择）
- 找回管理员 Token：运行脚本选择【4. 查看管理员密码】

### 未启用 Caddy 的反向代理
- 请将域名代理到本机服务：
  - `WEB_DOMAIN` → `http://localhost:8080`
  - `CONTROLER_DOMAIN` → `http://localhost:3100`
- 建议启用 SSL（与系统配置一致）。

### 遇到问题可以先检查
- 域名是否已生效（DNS 解析）
- 是否选择了 Caddy 且 80/443 未被占用
- Docker 是否已安装并运行
- 稍等 1–2 分钟后再次访问


### 一键更新
(重要)**进入之前安装的目录**，比如 /root/zfc，然后执行一键脚本
```bash
bash <(curl -s https://get.zeroforwarder.com/install.sh)
```
选择2，进行升级即可。