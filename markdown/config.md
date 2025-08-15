# 配置说明

Zero Forwarder 使用 YAML 格式的配置文件，提供灵活而强大的配置选项。

## 配置文件位置

默认配置文件路径：
- Linux/macOS: `/etc/zeroforwarder/config.yaml`
- Windows: `%APPDATA%\ZeroForwarder\config.yaml`

## 基础配置

### 基本设置

```yaml
# 服务基本信息
server:
  name: "zf-server-01"
  listen_addr: "0.0.0.0:8080"
  admin_addr: "127.0.0.1:8081"
  
# 日志配置
logging:
  level: "info"  # debug, info, warn, error
  file: "/var/log/zeroforwarder/app.log"
  max_size: 100  # MB
  max_backups: 5
  max_age: 30    # 天
```

### 网络配置

```yaml
network:
  # 连接池配置
  connection_pool:
    max_connections: 1000
    idle_timeout: "300s"
    keepalive: "60s"
  
  # 传输配置
  transport:
    protocol: "tcp"  # tcp, udp, quic
    encryption: true
    compression: true
    buffer_size: 64536  # bytes
```

## 转发规则

### 简单端口转发

```yaml
forwards:
  # HTTP 服务转发
  - name: "web-server"
    listen: "8080"
    target: "192.168.1.100:80"
    protocol: "tcp"
    
  # HTTPS 服务转发
  - name: "secure-web"
    listen: "8443"
    target: "192.168.1.100:443"
    protocol: "tcp"
    tls: true
```

### 负载均衡

```yaml
forwards:
  - name: "api-cluster"
    listen: "9000"
    load_balance:
      algorithm: "round_robin"  # round_robin, least_connections, ip_hash
      targets:
        - "192.168.1.10:8080"
        - "192.168.1.11:8080"
        - "192.168.1.12:8080"
      health_check:
        enabled: true
        interval: "30s"
        timeout: "5s"
        path: "/health"
```

### 带宽聚合

```yaml
forwards:
  - name: "aggregated-tunnel"
    listen: "10000"
    aggregation:
      enabled: true
      servers:
        - addr: "server1.example.com:8080"
          weight: 1
        - addr: "server2.example.com:8080"
          weight: 2
        - addr: "server3.example.com:8080"
          weight: 1
      strategy: "bandwidth"  # bandwidth, latency, hybrid
```

## 安全配置

### 访问控制

```yaml
security:
  # IP 白名单
  allow_list:
    - "192.168.1.0/24"
    - "10.0.0.0/8"
    - "172.16.0.0/12"
  
  # IP 黑名单
  deny_list:
    - "192.168.1.100"
    - "0.0.0.0/0"  # 默认拒绝所有
  
  # 速率限制
  rate_limit:
    enabled: true
    requests_per_second: 100
    burst_size: 200
    window: "1m"
```

### TLS/SSL 配置

```yaml
tls:
  enabled: true
  cert_file: "/etc/zeroforwarder/certs/server.crt"
  key_file: "/etc/zeroforwarder/certs/server.key"
  ca_file: "/etc/zeroforwarder/certs/ca.crt"
  
  # 自动证书申请 (Let's Encrypt)
  auto_cert:
    enabled: true
    domains:
      - "zf.example.com"
      - "api.example.com"
    email: "admin@example.com"
```

## 用户管理

### 多用户配置

```yaml
users:
  # 管理员用户
  - name: "admin"
    password: "$2b$12$hash..."  # bcrypt hash
    role: "admin"
    permissions:
      - "read"
      - "write"
      - "admin"
  
  # 普通用户
  - name: "user1"
    password: "$2b$12$hash..."
    role: "user"
    quota:
      bandwidth: "100Mbps"
      connections: 50
      data_transfer: "10GB"  # 每月
    permissions:
      - "read"
```

### 认证配置

```yaml
auth:
  method: "password"  # password, certificate, oauth2
  session_timeout: "24h"
  max_login_attempts: 3
  lockout_duration: "15m"
  
  # OAuth2 配置（可选）
  oauth2:
    provider: "google"
    client_id: "your-client-id"
    client_secret: "your-client-secret"
    redirect_url: "https://zf.example.com/auth/callback"
```

## 监控配置

### 指标收集

```yaml
monitoring:
  # Prometheus 指标
  prometheus:
    enabled: true
    listen_addr: "0.0.0.0:9090"
    path: "/metrics"
  
  # 健康检查
  health_check:
    enabled: true
    listen_addr: "0.0.0.0:8082"
    path: "/health"
  
  # 性能指标
  metrics:
    collect_interval: "10s"
    retention_period: "7d"
```

### 告警配置

```yaml
alerts:
  # 邮件告警
  email:
    enabled: true
    smtp_server: "smtp.example.com:587"
    username: "alerts@example.com"
    password: "your-password"
    to: ["admin@example.com"]
  
  # 告警规则
  rules:
    - name: "high_cpu_usage"
      condition: "cpu_usage > 80"
      duration: "5m"
      severity: "warning"
    
    - name: "connection_limit"
      condition: "active_connections > 900"
      duration: "2m"
      severity: "critical"
```

## 完整配置示例

```yaml
# /etc/zeroforwarder/config.yaml
server:
  name: "zf-production"
  listen_addr: "0.0.0.0:8080"
  admin_addr: "127.0.0.1:8081"

logging:
  level: "info"
  file: "/var/log/zeroforwarder/app.log"
  max_size: 100
  max_backups: 5

network:
  connection_pool:
    max_connections: 2000
    idle_timeout: "300s"
  transport:
    protocol: "tcp"
    encryption: true
    compression: true

forwards:
  - name: "web-cluster"
    listen: "80"
    load_balance:
      algorithm: "round_robin"
      targets:
        - "192.168.1.10:8080"
        - "192.168.1.11:8080"
      health_check:
        enabled: true
        interval: "30s"

security:
  allow_list:
    - "192.168.0.0/16"
  rate_limit:
    enabled: true
    requests_per_second: 1000

tls:
  enabled: true
  auto_cert:
    enabled: true
    domains: ["api.example.com"]
    email: "admin@example.com"

monitoring:
  prometheus:
    enabled: true
  health_check:
    enabled: true
```

## 配置验证

使用以下命令验证配置文件：

```bash
# 验证配置语法
zf config validate

# 检查配置并显示解析结果
zf config check --verbose

# 重新加载配置（无需重启）
zf config reload
```

更多高级配置选项，请参考完整的配置参考文档。