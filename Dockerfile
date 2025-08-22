# 使用官方Node.js 14.21.0镜像作为基础镜像
FROM node:14.21.0-alpine

# 设置工作目录
WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# 复制package.json和package-lock.json（如果存在）
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制源代码
COPY . .

# 编译TypeScript代码
RUN npm run build

# 暴露端口（如果需要的话）
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=dev
ENV PORT=3000

# 启动命令
CMD ["npm", "start"] 