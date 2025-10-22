# 各种转发场景下真实延迟测试

## 测试环境配置

**客户端位置**：香港杜甫服务器（同时作为入口服务器与其他转发端点建立隧道）

**转发端点**：西雅图、洛杉矶

**目标服务器**：美东

**测试工具**：NPT（Network Performance Test）[github](https://github.com/BlackLuny/NPT)

**测试原理**：通过客户端模拟真实用户的日常网页流量和QUIC流量，统计从发送请求到接收响应的完整时间，以测量真实用户体验延迟。

**测试负载**：模拟300个并发用户，每个测试场景持续3分钟。

## 测试场景说明

本次测试设计了以下6种网络转发场景，以全面评估不同转发策略的性能表现：

1. **直连测试**：作为基准对照组，客户端直接连接目标服务器，不经过任何转发
2. **本地直接转发**：本机→洛杉矶→目标服务器，分别使用Zero和Realm转发工具测试
3. **一级隧道转发**：本机通过隧道协议→洛杉矶→目标服务器，主要测试隧道连接复用对延迟的影响
4. **链式转发**：本机→西雅图→洛杉矶→目标服务器，测试多跳转发性能
5. **多级端口转发**：通过三个独立的端口转发实现多跳路径（本机→西雅图，西雅图→洛杉矶，洛杉矶→目标服务器）
6. **智能链式转发**：自动选择最优路径的智能转发系统，包含求和模式和管道模式

每个测试场景运行3分钟，记录详细的延迟指标以便进行性能对比分析。

## 场景一：直连基准测试

首先进行网络连通性测试，直接Ping目标服务器：

<img src="https://img.coderluny.com:444/uploads/b28e336e-d731-4f7e-9ecb-012f97f59b52.png" width="600" alt="直接Ping目标服务器">

**测试1分钟结果：**

<img src="https://img.coderluny.com:444/uploads/7cdfadba-5e0a-4aad-a3aa-f4964bc1738a.png" width="600" alt="直连测试1分钟">

**测试2分钟结果：**

<img src="https://img.coderluny.com:444/uploads/2cda5077-fab2-4163-a608-c1730add95d9.png" width="600" alt="直连测试2分钟">

**测试3分钟结果：**

<img src="https://img.coderluny.com:444/uploads/6683aee4-edb0-42cc-a753-69f2c0c1d3a3.png" width="600" alt="直连测试3分钟">

**直连测试最终结果：**

```json
"latency": {
  "tcp": {
    "avg_ms": 299.0032956778729,
    "p50_ms": 300.88970871761654,
    "p95_ms": 301.25689893306475,
    "p99_ms": 301.25889511341177,
    "max_ms": 301.2635004454581,
    "min_ms": 0.0
  }
},
"errors": {
  "total_errors": 0,
  "error_rate": 0.0
}
```

**分析结果：** 直连场景下平均延迟稳定在299ms左右，P50延迟为301ms，整体表现非常稳定，无任何连接错误。这为后续转发场景提供了性能基准。

## 场景二：本地直接转发测试

该场景测试本地转发工具的性能影响。虽然物理路径仍为本机直接到目标服务器，但数据流经过本地转发工具进行一次端口转发处理。测试时客户端连接127.0.0.1地址。

### Zero转发工具测试

**Zero测试1分钟结果：**

<img src="https://img.coderluny.com:444/uploads/ae0e71df-23c5-4eca-af2a-e145fd9fb0bc.png" width="600" alt="Zero转发测试1分钟">

**Zero测试2分钟结果：**

<img src="https://img.coderluny.com:444/uploads/ae0e71df-23c5-4eca-af2a-e145fd9fb0bc.png" width="600" alt="Zero转发测试2分钟">

**Zero测试3分钟结果：**

<img src="https://img.coderluny.com:444/uploads/61b92394-bc15-4a69-a45e-77029e7eaa40.png" width="600" alt="Zero转发测试3分钟">

**Zero转发最终结果：**

```json
"latency": {
  "tcp": {
    "avg_ms": 337.77794032319804,
    "p50_ms": 338.8547272031965,
    "p95_ms": 342.5402556273805,
    "p99_ms": 347.84181535875445,
    "max_ms": 386.4296424452134
  }
},
"errors": {
  "total_errors": 0,
  "error_rate": 0.0
}
```


### Realm转发工具测试

**Realm测试1分钟结果：**

<img src="https://img.coderluny.com:444/uploads/7a94edd3-9c3f-4e9e-8db3-1943965e74bd.png" width="600" alt="Realm转发测试1分钟">

**Realm测试2分钟结果：**

<img src="https://img.coderluny.com:444/uploads/e7a24b9f-fd53-432f-a62e-90872a06cdad.png" width="600" alt="Realm转发测试2分钟">

**Realm测试3分钟结果：**

<img src="https://img.coderluny.com:444/uploads/3e48d4c8-b4e3-4f27-b388-eecf9d65b224.png" width="600" alt="Realm转发测试3分钟">

**Realm转发最终结果：**

```json
"latency": {
  "tcp": {
    "avg_ms": 337.9212951309924,
    "p50_ms": 338.9117266819487,
    "p95_ms": 342.4377437760181,
    "p99_ms": 348.96039067054534,
    "max_ms": 385.6771561771562
  }
},
"errors": {
  "total_errors": 0,
  "error_rate": 0.0
}
```

**对比分析：** Zero和Realm两种转发工具表现几乎相同，平均延迟约338ms，相比直连增加了39ms（约13%）。这表明本地转发处理会产生一定的性能开销。



## 场景三：一级隧道转发测试

该场景测试通过隧道协议进行远程转发的性能表现。首先测量各路段的网络延迟：

**本机→洛杉矶网络延迟：152ms**

<img src="https://img.coderluny.com:444/uploads/fbeca7cd-8ac0-42c5-85e9-6be564627a9a.png" width="600" alt="本机到洛杉矶延迟">

**洛杉矶→目标服务器网络延迟：69ms**

<img src="https://img.coderluny.com:444/uploads/6b329310-90b4-4134-9be6-7fd518aa74d1.png" width="600" alt="洛杉矶到目标服务器延迟">

**理论最优延迟：152 + 69 = 221ms**

**隧道转发测试1分钟结果：**

<img src="https://img.coderluny.com:444/uploads/7f5d0cb8-080c-4667-a1e3-59dd25e5506f.png" width="600" alt="隧道转发测试1分钟">

**隧道转发测试2分钟结果：**

<img src="https://img.coderluny.com:444/uploads/0cab776c-8565-4763-8bcf-9266e8a5caba.png" width="600" alt="隧道转发测试2分钟">

**隧道转发测试3分钟结果：**

<img src="https://img.coderluny.com:444/uploads/0cab776c-8565-4763-8bcf-9266e8a5caba.png" width="600" alt="隧道转发测试3分钟">

**隧道转发最终结果：**

```json
"latency": {
  "tcp": {
    "avg_ms": 293.7205119381666,
    "p50_ms": 286.551605416548,
    "p95_ms": 325.8460434516369,
    "p99_ms": 424.62591092960236,
    "max_ms": 561.0373720136522
  }
},
"errors": {
  "total_errors": 0,
  "error_rate": 0.0
}
```

**性能分析：** 隧道转发平均延迟293ms，意外地优于直连的299ms，这是因为zero转发会复用现有TCP降低整体延迟。但P95和P99延迟显著升高，表明隧道转发在高负载情况下稳定性略差。

## 场景四：链式转发测试

该场景测试多跳转发的性能表现，数据流路径为：本机→西雅图→洛杉矶→目标服务器。

**转发链配置：**

<img src="https://img.coderluny.com:444/uploads/45528555-875b-49d7-9fea-502d2bc4322b.png" width="600" alt="链式转发配置">

**西雅图→洛杉矶网络延迟：32ms**

<img src="https://img.coderluny.com:444/uploads/86ddc5a6-cb91-4f5e-92ed-4016ed33e196.png" width="600" alt="西雅图到洛杉矶延迟">

**理论最优延迟：152 + 32 + 69 = 253ms**

**链式转发测试1分钟结果：**

<img src="https://img.coderluny.com:444/uploads/3b31ffe3-5547-4964-ba7c-cc9740d3e54a.png" width="600" alt="链式转发测试1分钟">

**链式转发测试2分钟结果：**

<img src="https://img.coderluny.com:444/uploads/3b31ffe3-5547-4964-ba7c-cc9740d3e54a.png" width="600" alt="链式转发测试2分钟">

**链式转发测试3分钟结果：**

<img src="https://img.coderluny.com:444/uploads/039f1e0d-a175-49f7-b9fa-efe32f0e46f3.png" width="600" alt="链式转发测试3分钟">

**链式转发最终结果：**

```json
"latency": {
  "tcp": {
    "avg_ms": 284.7188879376581,
    "p50_ms": 279.8629735350165,
    "p95_ms": 310.63421450706863,
    "p99_ms": 385.42213419538814,
    "max_ms": 485.31115107913666
  }
},
"errors": {
  "total_errors": 0,
  "error_rate": 0.0
}
```

**性能分析：** 链式转发平均延迟285ms，相比理论值253ms仅增加了32ms，表现优秀。这表明多跳转发在网络路径优化方面的优势可以部分抵消额外的跳数开销。



## 场景五：多级端口转发测试

该场景通过三个独立的端口转发实现多跳路径，与链式转发相比，这种方式的特点是每个转发节点都是独立的端口转发实例。

**多级端口转发测试1分钟结果：**

<img src="https://img.coderluny.com:444/uploads/f9b34b17-3505-498b-b5e6-c71879daaa0e.png" width="600" alt="多级端口转发测试1分钟">

**多级端口转发测试2分钟结果：**

<img src="https://img.coderluny.com:444/uploads/f9b34b17-3505-498b-b5e6-c71879daaa0e.png" width="600" alt="多级端口转发测试2分钟">

**多级端口转发测试3分钟结果：**

<img src="https://img.coderluny.com:444/uploads/d0c939b9-2365-4ae9-8c59-973b4742c3d7.png" width="600" alt="多级端口转发测试3分钟">

**多级端口转发最终结果：**

```json
"latency": {
  "tcp": {
    "avg_ms": 299.1185704416319,
    "p50_ms": 297.44883287331777,
    "p95_ms": 314.6713112646818,
    "p99_ms": 344.72228183378263,
    "max_ms": 367.5871886120996
  }
},
"errors": {
  "total_errors": 0,
  "error_rate": 0.0
}
```

**性能分析：** 多级端口转发平均延迟299ms，意外地接近直连性能。与链式转发相比，多级端口转发在稳定性方面表现更优。

## 场景六：智能链式转发测试

智能链式转发系统可以自动选择最优路径，包含两种工作模式：求和模式和管道模式。

**智能转发系统配置：**

<img src="https://img.coderluny.com:444/uploads/7384c449-29d4-415f-89f3-df5a478ca589.png" width="600" alt="智能转发系统配置">

### 求和模式测试

**求和模式测试1分钟结果：**

<img src="https://img.coderluny.com:444/uploads/76d5235d-fe8f-47df-825e-5010670d4c37.png" width="600" alt="求和模式测试1分钟">

**求和模式测试2分钟结果：**

<img src="https://img.coderluny.com:444/uploads/d56b0479-eb61-4bac-849f-8d22d314e8bd.png" width="600" alt="求和模式测试2分钟">

**求和模式测试3分钟结果：**

<img src="https://img.coderluny.com:444/uploads/9a019377-de6a-4054-aa2b-dbb60655d7b9.png" width="600" alt="求和模式测试3分钟">

**求和模式最终结果：**

```json
"latency": {
  "tcp": {
    "avg_ms": 280.5979769044902,
    "p50_ms": 278.20114415027115,
    "p95_ms": 299.6863108919424,
    "p99_ms": 338.11777959982095,
    "max_ms": 354.11046783625704
  }
},
"errors": {
  "total_errors": 0,
  "error_rate": 0.0
}
```

### 管道模式测试

**智能选择的转发路径：**

<img src="https://img.coderluny.com:444/uploads/0a5bfa4e-7427-4b7a-bab5-27ed59d86687.png" width="600" alt="智能选择转发路径">

**管道模式测试1分钟结果：**

<img src="https://img.coderluny.com:444/uploads/374990ba-400b-411a-9edd-7fece5fe7170.png" width="600" alt="管道模式测试1分钟">

**管道模式测试2分钟结果：**

<img src="https://img.coderluny.com:444/uploads/97d3d3b3-b3d4-44a1-936e-55319c36fba1.png" width="600" alt="管道模式测试2分钟">

**管道模式测试3分钟结果：**

<img src="https://img.coderluny.com:444/uploads/f72f231a-eab2-40ac-8de7-97a72cd69775.png" width="600" alt="管道模式测试3分钟">

**管道模式最终结果：**

```json
"latency": {
  "tcp": {
    "avg_ms": 282.55935684658203,
    "p50_ms": 278.8547726112854,
    "p95_ms": 306.2903564438878,
    "p99_ms": 365.2397274304915,
    "max_ms": 398.5147232037692
  }
},
"errors": {
  "total_errors": 0,
  "error_rate": 0.0
}
```

**智能转发性能分析：**

<img src="https://img.coderluny.com:444/uploads/7c0e9849-a827-44d6-993e-6d946674f731.png" width="600" alt="智能选择转发路径">

智能链式转发的两种模式表现相近，平均延迟均在280ms左右，表明系统能够稳定地选择最优路径。相比手动配置的链式转发，智能转发在性能上有轻微优加。

## 综合性能分析与结论

### 测试结果汇总

以下表格对比了所有测试场景的关键性能指标：

| 转发场景 | 平均延迟 (ms) | P50延迟 (ms) | P95延迟 (ms) | P99延迟 (ms) | 最大延迟 (ms) | 理论延迟 (ms) |
|------------|--------------|--------------|--------------|--------------|--------------|--------------|
| 直连基准 | 299.00 | 300.89 | 301.26 | 301.26 | 301.26 | - | - |
| Zero转发 | 337.78 | 338.85 | 342.54 | 347.84 | 386.43 | 299.00 |
| Realm转发 | 337.92 | 338.91 | 342.44 | 348.96 | 385.68 | 299.00 |
| 一级隧道转发 | 293.72 | 286.55 | 325.85 | 424.63 | 561.04 | 221.00 |
| 链式转发 | 284.72 | 279.86 | 310.63 | 385.42 | 485.31 | 253.00 |
| 多级端口转发 | 299.12 | 297.45 | 314.67 | 344.72 | 367.59 | 253.00 |
| 智能转发(求和) | 280.60 | 278.20 | 299.69 | 338.12 | 354.11 | 253.00 |
| 智能转发(管道) | 282.56 | 278.85 | 306.29 | 365.24 | 398.51 | 253.00 |

### 结论总结

本次测试显示，在合理的转发策略下，多跳转发不仅不会显著增加延迟，甚至可能通过路径优化带来性能提升。智能转发系统在性能、稳定性和管理复杂度之间取得了最佳平衡，是生产环境中的理想选择。



