# 解锁服务配置与分流管理使用指南

## 1. 文档说明与适用范围

本文用于指导管理后台用户配置以下两项功能：

- `路由配置 > 解锁服务配置`
- `路由配置 > 分流管理`

覆盖内容包括：

1. 如何新增/编辑解锁服务
2. 如何接入解锁测试脚本（脚本来源、参数、判定规则、缓存与超时）
3. 分流规则的生效原理
4. 分流管理四个核心表单的配置方法与字段说明
5. 常见错误与排查建议

说明：

- 本文以桌面端管理后台为主（移动端同字段，布局不同）。
- 本文不涉及历史兼容配置迁移，按当前功能设计说明。

---

## 2. 入口路径与页面总览

在后台左侧菜单进入：

- `路由配置 > 解锁服务配置`
- `路由配置 > 分流管理`

<img src="https://img.coderluny.com:444/uploads/309f94b9-c019-40da-9cb2-c04dd91fa40b.png" width="600" alt="入口路径与页面总览">

### 2.1 解锁服务配置页功能

- 按名称搜索解锁服务
- 新建/编辑/删除解锁服务
- 打开“解锁服务即时测试”弹窗，选择端点和服务进行测试

<img src="https://img.coderluny.com:444/uploads/b8343462-7c84-4a30-9177-84dd5e70dedb.png" width="600" alt="解锁服务配置页功能">

### 2.2 分流管理页功能

分为 4 个 Tab（建议按顺序理解）：

1. 规则集（Rule Sets）
2. 分流规则（Rules）
3. 匹配规则（Match Rules）
4. 出口选择器（Selectors）

<img src="https://img.coderluny.com:444/uploads/76877c38-3515-470d-80f4-de8531f557f3.png" width="600" alt="分流管理页功能">

---

## 3. 解锁服务配置

## 3.1 新建与编辑入口

进入 `解锁服务配置` 页面后：

- 点击 `创建` 新建服务
- 点击行内编辑按钮修改服务

<img src="https://img.coderluny.com:444/uploads/bb2d3f04-4b9c-43a4-8e11-57e7ca85c511.png" width="600" alt="新建与编辑入口">

## 3.2 字段说明（UnlockServiceForm）

以下字段对应实际提交字段：

- `name`：服务唯一标识（建议英文小写+下划线，如 `netflix`）
- `display_name`：页面显示名称（如“Netflix 解锁测试”）
- `script_type`：脚本类型，可选 `PYTHON` / `BASH`
- `script_url`：脚本 URL（可选）
- `script_content`：脚本内容（可选）
- `script_params`：脚本参数列表（UI 中按行填写，每行一个参数）
- `timeout`：单次脚本执行超时（毫秒）
- `cache_expiration`：解锁测试结果缓存时长（毫秒）
- `is_enabled`：是否启用
- `category`：分类（如 `Streaming`、`Gaming`）
- `sort_order`：排序权重（升序）

校验要点：

- `name`、`display_name` 必填
- `script_url` 与 `script_content` 至少提供一个
- `script_type` 必填

## 3.3 即时测试（手动）

在 `解锁服务配置` 页点击“解锁服务即时测试”：

1. 选择一个或多个转发端点
2. 选择一个或多个解锁服务
3. 点击开始测试，查看实时结果流

结果中可看到：

- 端点名称
- 服务名称
- 解锁状态（已解锁/未解锁）
- 测试消息与错误信息

<img src="https://img.coderluny.com:444/uploads/d0f3a467-b347-4605-ae52-7bf000c6d97e.png" width="600" alt="解锁服务即时测试">

---

## 4. 解锁测试脚本接入规范

本节是“如何添加解锁测试脚本”的核心规则。

## 4.1 脚本来源

支持两种方式，至少一种：

- 直接写入 `script_content`
- 填写 `script_url` 在线下载

下载限制：

- URL 脚本最大体积为 `1MB`

## 4.2 脚本参数

- `script_params` 会按顺序追加到脚本命令后
- UI 中每行一个参数，提交后是字符串数组

示例（Bash）：

```bash
bash /tmp/unlock_xxx.sh arg1 arg2 arg3
```

## 4.3 解锁判定规则（重要）

系统执行脚本后，按以下顺序判定是否“已解锁”：

1. 读取 `stdout` 最后一行
2. 若最后一行包含 `No` 或 `0` -> 判定未解锁
3. 若最后一行包含 `Yes` -> 判定已解锁
4. 否则回退到进程退出码：`exit code = 0` 视为已解锁，非 0 视为未解锁
5. 超时时返回：`Execution timed out`

建议：

- 脚本最后一行明确输出 `Yes` / `No`，避免歧义
- 失败时输出可读错误，便于在 UI “测试消息”排查

## 4.4 超时与缓存

- `timeout`：单次执行超时（毫秒）
- `cache_expiration`：前向端本地解锁结果缓存时间（毫秒）
- 后台还会通过周期任务将结果写入 Redis，并由系统设置控制全局缓存 TTL/测试间隔

---

## 5. 分流规则生效原理

## 5.1 整体执行链

端口绑定规则集后，分流执行逻辑为：

1. 按规则集中的 `priority` 升序遍历 `TrafficRuleSet.rules`
2. 命中第一条匹配规则后停止继续匹配
3. 使用该规则绑定的出口选择器进行端点选择
4. 若无规则命中，执行规则集 `default_action`

## 5.2 default_action 说明

- `AUTO`：走自动策略
- `REJECT`：拒绝连接
- `USE_SELECTOR`：使用指定 `default_selector_id`

注意：

- 当 `default_action = USE_SELECTOR` 且未提供 `default_selector_id` 时，后端会报错。

## 5.3 selector_chain fallback 机制

一个出口选择器内可以配置多个策略（`selector_chain`），按顺序尝试：

- `ByTag`
- `ByUnlock`
- `ByEndpointGroup`
- `ByFixedEndpoints`
- `Auto`
- `Reject`

生效方式：

- 某策略成功选出可用端点即返回
- 若当前策略无匹配，继续尝试下一策略
- 全部失败则视为 `NoMatch`（若链中包含 `Auto`/`Reject` 会按该策略收敛）

---

## 6. 分流管理四个表单配置（逐字段）

建议理解顺序：`匹配规则 -> 出口选择器 -> 分流规则 -> 规则集`

## 6.1 匹配规则（MatchRuleFormDialog）

用途：定义“什么流量算命中”。

### 字段

- `name`：唯一名称
- `display_name`：显示名称
- `description`：描述
- `match_type`：匹配类型
- `match_content`：匹配内容 JSON
- `rule_file_url`：外部规则文件 URL（仅 `RULE_FILE`）
- `rule_file_type`：规则文件格式（`CLASH` / `SURGE` / `QUANTUMULT_X` / `CUSTOM`）
- `is_public`：是否公开
- `is_enabled`：启用状态（编辑态）

### match_type 可选项

- `DOMAIN_EXACT`
- `DOMAIN_SUFFIX`
- `DOMAIN_KEYWORD`
- `DOMAIN_REGEX`
- `IP_CIDR`
- `GEOIP`
- `COMPOSITE`
- `RULE_FILE`
- `SOURCE_IP_CIDR`
- `SOURCE_PORT`
- `SOURCE_PORT_RANGE`
- `SOURCE_GEOIP`
- `PROTOCOL`
- `DESTINATION_PORT`
- `DESTINATION_PORT_RANGE`

### 示例（非 RULE_FILE）

`DOMAIN_SUFFIX`：

```json
{
  "Suffixes": [".netflix.com", ".nflxvideo.net"]
}
```

`SOURCE_PORT`：

```json
{
  "SourcePorts": [1080, 8080]
}
```

`COMPOSITE`：

```json
{
  "Composite": {
    "operator": "And",
    "rules": [
      {
        "match_type": "DomainSuffix",
        "match_data": {
          "Suffixes": [".example.com"]
        }
      },
      {
        "match_type": "DestinationPort",
        "match_data": {
          "Ports": [443]
        }
      }
    ]
  }
}
```

`RULE_FILE` 说明：

- 可配置规则文件 URL，并通过“刷新外部规则”同步
- 后端会按 `rule_file_type` 解析并归一化为内部 `match_content`

<img src="https://img.coderluny.com:444/uploads/f0d87727-b134-42a2-a0f0-d9ccc2d16c73.png" width="600" alt="匹配规则配置">

## 6.2 出口选择器（OutboundSelectorFormDialog）

用途：定义命中后“选哪些出口端点”。

### 字段

- `name`：唯一名称
- `display_name`：显示名称
- `description`：描述
- `is_public`：是否公开
- `is_enabled`：启用状态（编辑态）
- `selector_chain`：策略链（由表单自动生成 JSON）

### 策略类型与配置字段

- `ByTag`
  - `tags`: 标签列表
  - `match_mode`: `Any` / `All`
- `ByUnlock`
  - `unlock_service_id`: 解锁服务 ID
- `ByEndpointGroup`
  - `group_id`: 端点组 ID
- `ByFixedEndpoints`
  - `endpoint_ids`: 固定端点 ID 列表
- `Auto`
  - 无额外字段
- `Reject`
  - 无额外字段

### selector_chain JSON 示例

```json
{
  "selector_chain": [
    {
      "selector_type": "ByUnlock",
      "select_mode": 0,
      "config": {
        "type": "ByUnlock",
        "unlock_service_id": 1
      }
    },
    {
      "selector_type": "ByTag",
      "select_mode": 0,
      "config": {
        "type": "ByTag",
        "tags": ["fallback"],
        "match_mode": "Any"
      }
    },
    {
      "selector_type": "Auto",
      "select_mode": 0,
      "config": {
        "type": "Auto"
      }
    }
  ]
}
```

<img src="https://img.coderluny.com:444/uploads/69fb6a6b-e014-48cd-b71e-492873066b5e.png" width="600" alt="出口选择器配置">

## 6.3 分流规则（TrafficRuleFormDialog）

用途：把“匹配规则”与“出口选择器”绑定起来。

### 字段

- `name`：唯一名称
- `display_name`：显示名称
- `description`：描述
- `match_rule_id`：关联匹配规则 ID
- `outbound_selector_id`：关联出口选择器 ID
- `is_public`：是否公开
- `is_enabled`：启用状态（编辑态）

说明：

- 创建/编辑时通常只可选择“已启用”的匹配规则与出口选择器。

<img src="https://img.coderluny.com:444/uploads/f9e9870d-8f77-4f87-b0fb-8fbd245cff9e.png" width="600" alt="分流规则配置">

## 6.4 规则集（TrafficRuleSetFormDialog）

用途：最终生效入口，按优先级组织多条分流规则，并定义未命中默认行为。

### 字段

- `name`：唯一名称
- `display_name`：显示名称
- `description`：描述
- `default_action`：`AUTO` / `REJECT` / `USE_SELECTOR`
- `default_selector_id`：默认出口选择器（仅 `USE_SELECTOR` 时需要）
- `is_public`：是否公开
- `is_enabled`：启用状态（编辑态）
- `rules[]`：规则项列表
  - `rule_id`：分流规则 ID
  - `priority`：优先级（数字越小越先匹配）

说明：

- 规则集内不允许重复 `rule_id`
- 规则集内不允许重复 `priority`
- 表单支持上下移动，系统会重新整理优先级顺序

<img src="https://img.coderluny.com:444/uploads/1804c05e-0c1a-4ae3-934c-9e9b6d0d9d57.png" width="600" alt="规则集配置">

---

## 7. 推荐配置流程（从零到可用）

推荐按以下顺序：

1. 创建解锁服务（至少 1 个）
2. 在“解锁即时测试”中验证脚本结果
3. 创建匹配规则（先做 1 条简单规则）
4. 创建出口选择器（建议先做 `ByUnlock -> Auto` 双策略）
5. 创建分流规则（绑定 3 + 4）
6. 创建规则集并设置 `default_action`
7. 将规则集绑定到目标端口（在端口配置中选择该规则集）

最小可用示例：

- 匹配：`DOMAIN_SUFFIX` 命中 `.netflix.com`
- 选择器：先 `ByUnlock(Netflix服务)`，失败后 `Auto`
- 规则集默认：`AUTO`

---

## 8. 常见错误与排查

## 8.1 解锁服务相关

- 报错：`Either script_url or script_content must be provided`
  - 原因：脚本 URL 与脚本内容都为空
  - 处理：至少填写一项

- 报错：`Invalid script type. Must be PYTHON or BASH`
  - 原因：脚本类型值不合法
  - 处理：只用 `PYTHON` 或 `BASH`

- 测试一直超时
  - 检查脚本是否阻塞、外部依赖是否可访问、`timeout` 是否过小

## 8.2 分流相关

- 报错：`Invalid match_content`
  - 原因：匹配规则 JSON 结构与 `match_type` 不匹配
  - 处理：按对应类型模板填写

- 报错：`Invalid selector_chain`
  - 原因：选择器链 JSON 结构非法
  - 处理：优先使用表单编辑，不手写不规范 JSON

- 报错：`default_selector_id is required when default_action is USE_SELECTOR`
  - 原因：规则集默认动作选了 `USE_SELECTOR` 但没选默认选择器
  - 处理：补充 `default_selector_id`

- 删除失败（资源仍在使用）
  - 现象：被引用对象不可删（usage_count > 0）
  - 处理：先解除上游引用关系再删除

---

## 9. 附录

## 9.1 常用 JSON 模板

`GEOIP`：

```json
{
  "GeoIp": {
    "countries": ["CN"],
    "exclude": false
  }
}
```

`DESTINATION_PORT_RANGE`：

```json
{
  "PortRanges": [
    { "start": 8000, "end": 9000 }
  ]
}
```

`SOURCE_GEOIP`：

```json
{
  "SourceGeoIp": {
    "countries": ["CN", "US"],
    "exclude": false
  }
}
```

## 9.2 术语

- 解锁服务：用于测试“某端点是否可访问特定服务”的脚本配置项
- 匹配规则：定义“哪些流量会命中”
- 出口选择器：定义“命中后如何选端点”
- 分流规则：把匹配规则与出口选择器关联
- 规则集：多条分流规则的有序集合 + 未命中默认动作
