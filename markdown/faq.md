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

### Q: 显示一直离线

**A:** 检查面板机器的3100和443是否可以被此服务器访问，是否有防火墙，确保**控制器域名**没有开启CF小黄云。可以尝试访问控制器域名，如果有内容则正常。
检查时间是否同步, 如果不同步，可能需要重启一下机器，或者自行进行时间同步。
```bash
timedatectl status
```

## 配置相关

### Q: 配置文件在哪里？

**A:** 服务器(worker)默认配置文件位置：
默认 /root/zf/config.json
转发端点:
/opt/fwd_xxxxxx/config.json

## 性能相关
TODO

## 网络相关

### Q: 转发链不通
**A:** 可以尝试修改'转发链测试方法'，等待30s。



### 关于UDP
不同场景下UDP的处理逻辑不同:
1、直连场景(非隧道): 原生UDP
2、隧道场景:
   2.1 聚合场景: Uot
   2.2 一级隧道: 默认原生UDP，可自定义配置修改为UOT。
   2.2 转发链场景: 如果链长度超过1，则UOT，否则退化为一级隧道，原生UDP。


## 故障排除
TODO


## 升级和维护

### Q: 如何备份和恢复配置？
**A:**迁移之前，需要确保新机器的操作系统版本, docker docker-compose版本，以及面板域名不要变化。
```bash
bash <(curl -sL https://get.zeroforwarder.com/install.sh)
```
选择5，打包数据
之后停止当前机器的服务，注意: **暂时不要卸载老面板或者重装老面板的系统，确保新面板能够成功启动之后，再卸载老面板**
```bash
docker-compose down
```
把打包的数据拷贝到新机器，进入目录执行脚本，选择6进行恢复。**不需要全新安装**。
如果迁移失败，在老面板机器内，面板目录，使用以下命令恢复老面板：
```bash
docker-compose up
```


## 获取帮助

如果以上方案无法解决您的问题，请：

1. **查看详细日志**：
   ```bash
   sudo journalctl -u zf --since "1 hour ago"
   ```

在寻求帮助时，请提供：
- 系统信息（`uname -a`）
- Zero Forwarder 版本（`zf version`）
- 错误日志和配置文件
- 详细的问题描述和复现步骤