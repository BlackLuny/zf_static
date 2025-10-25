# 入站代理配置指南

zero 转发工具独创的入站代理模式采用在入口服务器设置代理的架构，相较于传统的在落地服务器部署代理的方式，具有以下显著优势：

* **简化部署架构**：无需在每台落地机器单独部署协议，新增落地机器时无需额外配置；
* **优化网络延迟**：仅需连接至入口节点，后续连接采用0rtt协议，有效降低整体延迟并显著提升用户体验；
* **实现高可用架构**：可无缝集成多个落地节点和中转节点，构建全链路高可用系统，使用统一认证凭据简化维护流程；

本教程将通过实际案例详细介绍入站代理的配置方法，以及如何构建全链路高可用架构，确保任意节点故障不影响整体链路稳定性。

## 网络架构设计

本示例基于以下高可用网络架构：
- 2台国内大厂BGP服务器（阿里云和腾讯云）
- 2台不同厂商的IX中转机器
- 2台香港落地服务器
- 2台德国目标服务器

整体代理链路为：`客户端 → 国内BGP服务器 → IX中转 → 香港落地 → 德国目标 → 最终目的地`

## 配置步骤

### 步骤一：创建国内服务器组

<img src="https://img.coderluny.com:444/uploads/a4ce8097-3e5c-4d55-a6f9-eaa58d96dc60.png" width="600" alt="创建服务器组界面">

在管理界面中创建新的服务器组，配置相应的网络参数。

**注意**：如果授权许可不支持自动IP分配，可先单独添加服务器后再加入组内。本示例采用自动添加方式以简化操作流程。

<img src="https://img.coderluny.com:444/uploads/16ef499b-05cd-443b-ae7d-b488837a6715.png" width="600" alt="服务器组配置设置">

配置完成后复制生成的安装脚本，在各台国内BGP服务器上分别执行worker安装程序。

<img src="https://img.coderluny.com:444/uploads/6f6c624f-8682-426f-ad1a-de2bf318d226.png" width="600" alt="安装脚本生成">

在各台目标服务器上执行安装脚本后，刷新管理页面即可看到成功添加的服务器实例。

<img src="https://img.coderluny.com:444/uploads/2876bfd8-9853-4347-97e7-2cdcb290c595.png" width="600" alt="服务器添加完成状态">

**DNS解析配置**：需要手动配置DNS解析，将相同域名（示例中为bgp.example.com）解析到两台服务器的入口IP地址，实现负载均衡。

至此完成入口服务器组的创建配置。

### 步骤二：配置转发端点

**重要提示**：如果转发端点已完成安装，可跳过此步骤直接进入下一环节。

本示例需要配置的转发端点包括：
- 2个IX中转节点
- 2个香港落地节点
- 2个德国落地节点

所有节点的安装配置方法相同：

<img src="https://img.coderluny.com:444/uploads/a9b9050c-5279-40dc-b8d9-03ea34cb8e83.png" width="600" alt="转发端点配置界面">

在配置界面中填写节点名称和入口IP地址：

<img src="https://img.coderluny.com:444/uploads/eab5f2fa-dfcd-4469-b5b9-91d5bf8a264c.png" width="600" alt="节点信息配置">

复制生成的安装脚本到IX服务器上执行部署：

<img src="https://img.coderluny.com:444/uploads/3daa529b-8c29-46b8-8608-91eeee4a794d.png" width="600" alt="IX节点安装脚本">

按照相同的配置流程，完成所有节点的添加部署。

<img src="https://img.coderluny.com:444/uploads/f5bfb286-6411-4af5-b76b-fe5763f579d2.png" width="600" alt="所有节点添加完成">

### 步骤三：创建转发端点组（可选）

为便于后续管理维护，建议将转发端点按功能或地域进行分组。这样在新增或删除节点时，可直接在组内进行统一操作。

<img src="https://img.coderluny.com:444/uploads/7e8259cd-a5c9-4fb6-948f-0af74b8d5f7b.png" width="600" alt="转发端点组管理界面">

<img src="https://img.coderluny.com:444/uploads/0e8084d1-f3f8-438d-8fc5-48276724e616.png" width="600" alt="IX中转组配置">

<img src="https://img.coderluny.com:444/uploads/06dafaf4-8c5d-4054-9a75-9278558914db.png" width="600" alt="转发端点组创建完成">

采用相同方法分别创建香港落地组和德国落地组。

<img src="https://img.coderluny.com:444/uploads/aaf08ca3-fb4d-470a-9ec4-3ed053bb1068.png" width="600" alt="所有端点组创建完成">



### 步骤四：配置入站代理和代理链

完成节点部署后，开始配置入站代理服务和完整的代理链路。

<img src="https://img.coderluny.com:444/uploads/65528fe2-aca6-411b-a9c1-cdb3de96e70e.png" width="600" alt="入站代理配置界面">

**基本配置参数**：

- **服务名称**：可自定义命名
- **线路选择**：选择国内BGP服务器组
- **目标地址**：在入站代理模式下，目标地址主要用于连通性测试，建议配置为1.1.1.1:53和8.8.8.8:53

<img src="https://img.coderluny.com:444/uploads/c4d362e4-4efc-4dba-93f9-43ad74964712.png" width="600" alt="基本配置参数设置">

**转发端点配置**：

启用转发链模式，按业务需求选择相应的端点组，并根据实际转发路径合理组织转发顺序。配置测试方法为管道模式，同时启用智能选择功能以优化路由性能。

<img src="https://img.coderluny.com:444/uploads/960af72a-70f7-4420-a5ec-4012bc90dfe3.png" width="600" alt="转发端点配置">

**高级配置选项**：

在入站配置字段中填写协议配置：

```json
{
"Ss":{}
}
```

<img src="https://img.coderluny.com:444/uploads/af5ce6fa-c011-4d7e-b9da-fbf8f4ee3fca.png" width="600" alt="高级配置选项">

完成配置后点击"添加"按钮保存设置。

随后点击"编辑"按钮查看系统生成的认证密码：

<img src="https://img.coderluny.com:444/uploads/4a92308a-53ad-4692-bc00-85a61599c414.png" width="600" alt="配置保存确认">

<img src="https://img.coderluny.com:444/uploads/4020ed11-b98d-4b00-a573-698c2567e8d6.png" width="600" alt="认证密码查看">

## 配置完成及架构优势

通过以上配置步骤，您已成功构建了一个高可用的德国代理服务，该架构具有以下核心优势：

### 1. 完全高可用架构
- 多个国内入口节点提供接入冗余
- 多条IX跨境链路确保国际连接稳定性
- 多个香港落地节点分散风险
- 多个德国落地节点保障最终连接

### 2. 智能路由优化
系统自动选择延迟最优的德国落地节点，甚至在IX节点国际线路性能优异时，可智能跳过香港落地节点直达德国，实现路径优化。

### 3. 性能与维护优势
- SS协议仅延伸至国内入口即终止，后续采用自研0rtt数据传输通道
- 整体延迟显著低于传统SS部署至德国落地的方案
- 无需在德国节点部署SS服务，大幅降低运维成本