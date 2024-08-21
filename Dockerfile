# Gunakan image Node.js sebagai dasar
FROM node:18-alpine3.17 AS build

# Set the timezone to Asia/Jakarta
RUN apk add --no-cache tzdata

ENV TZ=Asia/Jakarta

# Tentukan direktori kerja dalam kontainer
WORKDIR /app

# Run command in Virtual directory
RUN npm cache clean --force

# Salin package.json dan package-lock.json ke dalam direktori kerja
COPY package*.json ./

# Install dependensi dengan npm atau yarn

RUN npm install --force

# Salin semua file proyek (termasuk hasil build Next.js) ke dalam direktori kerja
COPY . .

# Build your Next.js application
RUN npm run export

# Jalankan aplikasi Next.js
CMD ["npm", "start"]

### STAGE 2:RUN ###
# Defining nginx image to be used
FROM nginx:latest AS nginx

# remove existing files from nginx directory
RUN rm -rf /usr/share/nginx/html/*

# Copy the build files from Stage 1 to the Nginx web server directory
COPY --from=build /app/out /usr/share/nginx/html
COPY --from=build /app/robots.txt /usr/share/nginx/html/robots.txt

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

#Final
