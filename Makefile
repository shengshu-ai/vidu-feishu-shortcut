# 飞书快捷指令项目 Docker 操作命令

.PHONY: help build up down restart logs clean

# 默认目标
help:
	@echo "可用的命令:"
	@echo "  build    - 构建Docker镜像"
	@echo "  up       - 启动开发环境"
	@echo "  down     - 停止开发环境"
	@echo "  restart  - 重启开发环境"
	@echo "  logs     - 查看容器日志"
	@echo "  clean    - 清理Docker资源"
	@echo "  shell    - 进入容器shell"
	@echo "  install  - 安装项目依赖"

# 构建Docker镜像
build:
	docker-compose build

# 启动开发环境
up:
	docker-compose up -d

# 停止开发环境
down:
	docker-compose down

# 重启开发环境
restart:
	docker-compose restart

# 查看容器日志
logs:
	docker-compose logs -f

# 进入容器shell
shell:
	docker exec -it feishu-shortcut-dev /bin/sh

# 安装项目依赖
install:
	docker exec -it feishu-shortcut-dev npm install

# 清理Docker资源
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# 重新构建并启动
rebuild: clean build up 