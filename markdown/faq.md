# 常见问题

## 安装相关

### Q: 安装脚本执行失败怎么办？

**A:** 请检查以下几点：

1. **网络连接**：确保能够访问 GitHub 和安装源
   ```bash
   curl -I https://get.zeroforwarder.com/install.sh
   ```

2. **权限问题**：确保有足够的权限安装软件
   ```bash
   sudo bash <(curl -sL https://get.zeroforwarder.com/install.sh)
   ```

3. **系统兼容性**：检查您的系统是否受支持
   ```bash
   uname -a
   lsb_release -a  # Linux
   ```

### Q: 如何在离线环境中安装？

**A:** 可以手动下载安装包：

```bash
# 1. 在有网络的机器上下载
wget https://releases.zeroforwarder.com/latest/zf-linux-x86_64.tar.gz

# 2. 传输到离线机器
scp zf-linux-x86_64.tar.gz user@offline-machine:/tmp/

# 3. 在离线机器上安装
tar -xzf /tmp/zf-linux-x86_64.tar.gz
sudo cp zf /usr/local/bin/
```

## 配置相关

### Q: 配置文件在哪里？

**A:** 默认配置文件位置：
- **Linux**: `/etc/zeroforwarder/config.yaml`
- **macOS**: `/usr/local/etc/zeroforwarder/config.yaml`
- **Windows**: `%APPDATA%\ZeroForwarder\config.yaml`

### Q: 如何修改默认端口？

**A:** 编辑配置文件中的 `listen_addr`：

```yaml
server:
  listen_addr: "0.0.0.0:9999"  # 改为您需要的端口
```

### Q: 支持 IPv6 吗？

**A:** 是的，支持 IPv6：

```yaml
server:
  listen_addr: "[::]:8080"  # IPv6 地址
  
# 或者同时监听 IPv4 和 IPv6
forwards:
  - name: "dual-stack"
    listen: "8080"
    bind_ipv6: true
```

## 性能相关

### Q: 如何优化性能？

**A:** 几个关键的优化建议：

1. **调整连接池大小**：
   ```yaml
   network:
     connection_pool:
       max_connections: 5000  # 根据服务器性能调整
   ```

2. **启用压缩**：
   ```yaml
   network:
     transport:
       compression: true
   ```

3. **系统内核参数优化**：
   ```bash
   # /etc/sysctl.conf
   net.core.somaxconn = 65535
   net.core.netdev_max_backlog = 5000
   net.ipv4.tcp_max_syn_backlog = 65535
   ```

### Q: 内存占用过高怎么办？

**A:** 检查以下配置：

1. **限制缓冲区大小**：
   ```yaml
   network:
     transport:
       buffer_size: 32768  # 减小缓冲区
   ```

2. **设置连接超时**：
   ```yaml
   network:
     connection_pool:
       idle_timeout: "60s"  # 减少空闲连接时间
   ```

3. **监控内存使用**：
   ```bash
   zf stats memory
   ```

## 网络相关

### Q: 连接被频繁断开？

**A:** 可能的原因和解决方案：

1. **网络不稳定**：
   ```yaml
   network:
     transport:
       keepalive: "30s"
       retry_count: 3
   ```

2. **防火墙或 NAT**：
   ```bash
   # 检查防火墙规则
   sudo iptables -L
   
   # 检查 NAT 超时
   echo 7200 > /proc/sys/net/netfilter/nf_conntrack_tcp_timeout_established
   ```

### Q: 如何测试连接质量？

**A:** 使用内置的诊断工具：

```bash
# 测试到目标服务器的连接
zf test connection --target server.example.com:8080

# 检查网络延迟
zf test latency --servers server1.com,server2.com

# 带宽测试
zf test bandwidth --duration 30s
```

## 安全相关

### Q: 如何设置访问控制？

**A:** 在配置文件中设置白名单/黑名单：

```yaml
security:
  # 只允许内网访问
  allow_list:
    - "192.168.0.0/16"
    - "10.0.0.0/8"
    - "172.16.0.0/12"
  
  # 拒绝特定 IP
  deny_list:
    - "192.168.1.100"
```

### Q: 如何启用 HTTPS？

**A:** 配置 TLS 证书：

```yaml
tls:
  enabled: true
  cert_file: "/path/to/server.crt"
  key_file: "/path/to/server.key"
  
  # 或使用自动证书
  auto_cert:
    enabled: true
    domains: ["yourdomain.com"]
    email: "your-email@example.com"
```

### Q: 如何防止 DDoS 攻击？

**A:** 启用速率限制和连接限制：

```yaml
security:
  rate_limit:
    enabled: true
    requests_per_second: 100
    burst_size: 200
  
  connection_limit:
    max_connections_per_ip: 50
    max_new_connections_per_minute: 20
```

## 故障排除

### Q: 服务启动失败？

**A:** 按以下步骤排查：

1. **检查配置文件**：
   ```bash
   zf config validate
   ```

2. **查看错误日志**：
   ```bash
   sudo journalctl -u zeroforwarder -f
   ```

3. **检查端口占用**：
   ```bash
   sudo netstat -tlnp | grep :8080
   ```

4. **验证权限**：
   ```bash
   ls -la /etc/zeroforwarder/
   ```

### Q: 转发不工作？

**A:** 逐步检查：

1. **测试本地连接**：
   ```bash
   telnet localhost 8080
   ```

2. **检查目标服务器**：
   ```bash
   telnet target-server 80
   ```

3. **查看转发状态**：
   ```bash
   zf status forwards
   ```

4. **检查防火墙**：
   ```bash
   sudo ufw status  # Ubuntu
   sudo firewall-cmd --list-all  # CentOS
   ```

### Q: 性能监控显示异常？

**A:** 分析性能指标：

```bash
# 查看实时统计
zf stats realtime

# 导出性能报告
zf stats export --format json --period 1h

# 检查资源使用
zf stats system
```

## 升级和维护

### Q: 如何升级到新版本？

**A:** 安全升级步骤：

```bash
# 1. 备份配置
sudo cp -r /etc/zeroforwarder /etc/zeroforwarder.backup

# 2. 下载新版本
wget https://releases.zeroforwarder.com/latest/zf-linux-x86_64.tar.gz

# 3. 停止服务
sudo systemctl stop zeroforwarder

# 4. 替换二进制文件
sudo cp zf /usr/local/bin/

# 5. 重启服务
sudo systemctl start zeroforwarder
```

### Q: 如何备份和恢复配置？

**A:** 备份重要文件：

```bash
# 备份
sudo tar -czf zf-backup-$(date +%Y%m%d).tar.gz \
  /etc/zeroforwarder \
  /var/log/zeroforwarder \
  /usr/local/bin/zf

# 恢复
sudo tar -xzf zf-backup-20231201.tar.gz -C /
sudo systemctl restart zeroforwarder
```

## 获取帮助

如果以上方案无法解决您的问题，请：

1. **查看详细日志**：
   ```bash
   sudo journalctl -u zeroforwarder --since "1 hour ago"
   ```

2. **收集系统信息**：
   ```bash
   zf debug info > debug-info.txt
   ```

3. **联系技术支持**：
   - 官方文档：https://docs.zeroforwarder.com
   - GitHub Issues：https://github.com/zeroforwarder/zf/issues
   - 社区论坛：https://community.zeroforwarder.com

在寻求帮助时，请提供：
- 系统信息（`uname -a`）
- Zero Forwarder 版本（`zf version`）
- 错误日志和配置文件
- 详细的问题描述和复现步骤