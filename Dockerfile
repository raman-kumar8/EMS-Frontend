# Stage 1: Build React App
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

