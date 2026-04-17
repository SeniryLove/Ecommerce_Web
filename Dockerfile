FROM node:20-alpine

WORKDIR /app

# 複製 package.json 並安裝依賴
COPY package*.json ./
RUN npm install

# 暴露開發 server port
EXPOSE 5173

# 進入容器後自動啟動開發 server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]