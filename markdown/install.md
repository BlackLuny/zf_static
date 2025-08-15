# 安装指南

本指南将帮助您快速安装和配置 Zero Forwarder。

## 系统要求

### 支持的操作系统
- **Linux**: Ubuntu 18.04+, CentOS 7+, Debian 9+
- **macOS**: 10.14+
- **Windows**: Windows 10 (WSL2) 

### 硬件要求
- **CPU**: 1 核心以上
- **内存**: 最低 512MB，推荐 1GB+
- **磁盘**: 100MB 可用空间
- **网络**: 稳定的互联网连接

## 安装方法

### 一键安装（推荐）

使用官方安装脚本，这是最简单的安装方法：

```bash
bash <(curl -sL https://get.zeroforwarder.com/install.sh)
```

### 手动安装

如果您prefer手动安装，可以按照以下步骤：

#### 1. 下载二进制文件

```bash
# Linux x86_64
wget https://releases.zeroforwarder.com/latest/zf-linux-x86_64.tar.gz

# macOS
wget https://releases.zeroforwarder.com/latest/zf-macos-universal.tar.gz

# 解压
tar -xzf zf-*.tar.gz
```

#### 2. 安装到系统

```bash
# 复制到系统路径
sudo cp zf /usr/local/bin/

# 设置执行权限
sudo chmod +x /usr/local/bin/zf
```

#### 3. 创建配置目录

```bash
sudo mkdir -p /etc/zeroforwarder
sudo mkdir -p /var/log/zeroforwarder
```

## 配置服务

### 创建系统服务

创建 systemd 服务文件：

```bash
sudo tee /etc/systemd/system/zeroforwarder.service > /dev/null <<EOF
[Unit]
Description=Zero Forwarder Service
After=network.target

[Service]
Type=simple
User=zf
Group=zf
ExecStart=/usr/local/bin/zf --config /etc/zeroforwarder/config.yaml
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

### 创建用户和权限

```bash
# 创建专用用户
sudo useradd -r -s /bin/false zf

# 设置目录权限
sudo chown -R zf:zf /etc/zeroforwarder
sudo chown -R zf:zf /var/log/zeroforwarder
```

## 启动服务

```bash
# 重新加载 systemd
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start zeroforwarder

# 设置开机自启
sudo systemctl enable zeroforwarder

# 查看服务状态
sudo systemctl status zeroforwarder
```

## 验证安装

检查服务是否正常运行：

```bash
# 查看服务状态
zf status

# 查看版本信息
zf version

# 查看日志
sudo journalctl -u zeroforwarder -f
```

## 卸载

如需卸载 Zero Forwarder：

```bash
# 停止服务
sudo systemctl stop zeroforwarder
sudo systemctl disable zeroforwarder

# 删除文件
sudo rm /usr/local/bin/zf
sudo rm /etc/systemd/system/zeroforwarder.service
sudo rm -rf /etc/zeroforwarder
sudo rm -rf /var/log/zeroforwarder

# 删除用户
sudo userdel zf
```

## 故障排除

### 常见问题

**问题**: 服务启动失败
```bash
# 解决方案：检查配置文件
zf config validate

# 查看详细错误信息
sudo journalctl -u zeroforwarder --no-pager
```

**问题**: 权限错误
```bash
# 解决方案：重新设置权限
sudo chown -R zf:zf /etc/zeroforwarder
sudo chmod 750 /etc/zeroforwarder
```

如果遇到其他问题，请查看完整的故障排除文档或联系技术支持。