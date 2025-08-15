# IX机器转发端点配置教程

## 第一步：添加转发端点

首先在管理界面中添加一个新的转发端点。

<img src="https://img.coderluny.com:444/uploads/3ed98f1b-f5d1-45bc-aba5-4ad04b0a5ad4.png" width="600" alt="添加转发端点界面">

点击"添加转发端点"按钮，填写相关配置信息。

<img src="https://img.coderluny.com:444/uploads/1580e37e-80f7-48ef-b102-159251008e95.png" width="600" alt="转发端点配置">

配置完成后，系统会生成安装脚本。

<img src="https://img.coderluny.com:444/uploads/97e01f72-a97b-474e-8897-c6e9e544269a.png" width="600" alt="生成的安装脚本">

复制生成的安装脚本，然后在IX机器上执行安装。

## 第二步：添加服务器

转发端点配置完成后，接下来需要添加服务器。

在添加服务器时，请确保选择刚才创建的转发端点作为IX机器的转发点。

<img src="https://img.coderluny.com:444/uploads/def50713-03bc-4f55-a63d-b067eebd2ce0.png" width="600" alt="选择转发端点">

**重要：** 请务必勾选"使用转发端点作为传输"选项，这样数据传输将通过IX机器进行转发。

<img src="https://img.coderluny.com:444/uploads/227b3a3e-2bbd-4985-a4d9-1499e5501a86.png" width="600" alt="勾选使用转发端点">

最后，复制生成的脚本到阿里云机器上执行，完成整个配置流程。

## 第三步: 添加端口转发
假设你有一个服务在落地IP: 2.2.2.2的443端口
<img src="https://img.coderluny.com:444/uploads/37dc8108-a64f-4052-b9e4-4b0239d4c056.png"  width="600" alt="选择端口管理">
<img src="https://img.coderluny.com:444/uploads/0ba74039-f556-471f-acfa-b82cf1487b0f.png"  width="600" alt="添加端口">

## 总结

通过以上步骤，您已经成功配置了IX机器作为转发端点，实现了通过阿里云服务器作为入口， 转发数据数据到IX，最终达到目标地址和端口。这种配置方式可以有效解决网络连接问题，提高数据传输的稳定性。