FROM node:20-alpine

# SOLUSI: Menginstal pustaka kompatibilitas C++ untuk library Sharp
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]