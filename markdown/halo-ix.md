# Halo IX 服务器配置教程

## 第一步：配置转发端点

首先在管理界面添加香港端作为转发端点。

<img src="https://img.coderluny.com:444/uploads/2fc6e8d4-a926-4ff8-9d49-1d8ddd15f8a8.png" width="600" alt="添加转发端点">

## 第二步：添加服务器

接下来添加 IX 服务器到系统中。

<img src="https://img.coderluny.com:444/uploads/c27bb9d8-8a40-4a3b-8997-3412f7c62254.png" width="600" alt="添加服务器">

## 第三步：手动安装服务

**重要说明**：由于 IX 端默认无外网访问权限，需要采用手动安装方式。推荐的方法是先在香港端安装服务，然后将安装文件复制到 IX 端。

### 3.1 在香港端安装

首先在**香港端**服务器上执行安装脚本。

### 3.2 复制安装文件

安装完成后，将香港端的服务文件复制到 IX 端的相同位置：

```bash
# 需要复制的文件路径
/etc/systemd/system/zf.service
/root/zf/*
```

### 3.3 清理香港端

复制完成后，在服务端管理界面获取卸载命令并在香港端执行卸载。

### 3.4 启动 IX 端服务

在 IX 端执行以下命令启动服务：

```bash
systemctl daemon-reload
systemctl enable zf.service
systemctl start zf
```

## 第四步：验证服务状态

服务启动后，IX 服务器将显示为在线状态。

<img src="https://img.coderluny.com:444/uploads/60e6ca97-64f4-42ba-ad98-a7a1a2dfcb7d.png" width="600" alt="服务器在线状态">

## 第五步：配置端口转发

服务器上线后，即可添加转发端口规则开始使用。

