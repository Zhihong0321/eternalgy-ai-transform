# Build Stage
FROM node:20-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:20-slim

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev

EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000

CMD ["npm", "start"]
