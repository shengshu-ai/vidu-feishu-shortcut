# 飞书快捷指令项目 - 集成Vidu API

这是一个飞书快捷指令项目，集成了Vidu API，支持图生视频、参考生视频、首尾帧生视频等功能。

## 项目特性

- 🚀 基于飞书快捷指令FaaS架构
- 🎥 集成Vidu API，支持多种视频生成方式
- 🔧 支持Node.js 14.21.0运行环境
- 📦 Docker容器化部署，支持本地开发调试
- 🌐 支持图生视频(img2video)、参考生视频(reference2video)、首尾帧生视频(start-end2video)

## 技术栈

- **运行时**: Node.js 14.21.0
- **开发语言**: TypeScript
- **容器化**: Docker + Docker Compose
- **框架**: @lark-opdev/block-basekit-server-api

## 快速开始

### 环境要求

- Docker
- Docker Compose

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd feishu-shortcut
```

### 2. 启动开发环境

```bash
# 构建并启动Docker容器
make up

# 或者手动执行
docker-compose up -d
```

### 3. 查看运行状态

```bash
# 查看容器状态
docker-compose ps

# 查看日志
make logs
```

### 4. 进入容器开发

```bash
# 进入容器shell
make shell

# 安装依赖（如果需要）
make install
```

## Docker命令

项目提供了便捷的Makefile命令：

```bash
make help      # 查看所有可用命令
make build     # 构建Docker镜像
make up        # 启动开发环境
make down      # 停止开发环境
make restart   # 重启开发环境
make logs      # 查看容器日志
make shell     # 进入容器shell
make clean     # 清理Docker资源
make rebuild   # 重新构建并启动
```

## 项目结构

```
feishu-shortcut/
├── src/                    # 源代码目录
├── demo/                   # 示例代码
├── Dockerfile             # Docker镜像配置
├── docker-compose.yml     # Docker Compose配置
├── package.json           # 项目依赖配置
├── tsconfig.json          # TypeScript配置
├── Makefile               # 便捷命令
└── README.md              # 项目说明
```

## 开发说明

### 本地开发

1. 项目使用Docker容器运行，确保本地已安装Docker
2. 源代码通过volume挂载，支持热重载
3. 开发模式下使用nodemon自动重启服务

### 生产环境

- 生产环境使用Node.js 14.21.0
- 支持按插件+租户维度隔离
- 单实例规格：1核1G内存
- 运行超时时间：15分钟

## API集成

项目集成了以下Vidu API接口：

- **图生视频** (img2video): 将静态图片转换为动态视频
- **参考生视频** (reference2video): 基于参考图片生成视频
- **首尾帧生视频** (start-end2video): 基于起始和结束帧生成视频

支持的模型：
- viduq1
- vidu1.5  
- vidu2.0

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！ 