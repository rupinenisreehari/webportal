**Step-by-Step Deployment Guide for DevOps Portal on Ubuntu 24.04**

### 1. **Update System & Install Dependencies**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx nodejs npm mongodb
```

### 2. **Clone the Repository & Install Backend**
```bash
cd /var/www
sudo git clone https://github.com/your-repo/devops-portal.git
cd devops-portal/backend
npm install
```

### 3. **Set Up Environment Variables**
Create a `.env` file inside the `backend` directory:
```bash
nano .env
```
Add the following content:
```
MONGO_URI=mongodb://localhost:27017/devops
JWT_SECRET=your-secret-key
PORT=5000
```
Save and exit.

### 4. **Start Backend Server**
```bash
node server.js &
```

### 5. **Install & Build Frontend**
```bash
cd ../frontend
npm install
npm run build
```

### 6. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/devops-portal
```
Add the following:
```
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/devops-portal/frontend/build;
        index index.html;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Save and exit.

### 7. **Enable & Restart Nginx**
```bash
sudo ln -s /etc/nginx/sites-available/devops-portal /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### 8. **Access the Portal**
Open `http://yourdomain.com` in a browser to view your DevOps portal!

### 9. **Setup Process Manager (Optional)**
To keep the backend running in the background, install PM2:
```bash
npm install -g pm2
pm2 start server.js --name devops-portal
pm2 save
pm2 startup
```

