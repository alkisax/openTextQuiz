- front .env
  VITE_BACKEND_URL=https://portfolio-projects.space/open-text
- back .env
  OPENAI_API_KEY=sk-proj-0***
  MONGO_URI = mongodb+srv://alkis***
  PORT=3009

- nginx

```nginx
# OpenText app → /open-text
location /open-text/ {
  rewrite ^/open-text(/.*)$ $1 break;
  proxy_pass http://localhost:3009;
  proxy_set_header Host $host;
}
```

```bash
cd /var/www
mkdir -p open-text
cd open-text
git clone git@github.com:alkisax/openTextQuiz.git .
cd /var/www/open-text/frontend
nano .env
npm install
npm run build
cd /var/www/open-text/backend
nano .env
npm install typescript --save-dev
npm install
npm run build
pm2 start build/src/server.js --name open-text --update-env
pm2 save
curl http://localhost:3009/api/ping

cat /etc/nginx/sites-available/portfolio-projects.space
nano /etc/nginx/sites-available/portfolio-projects.space
nginx -t
systemctl reload nginx

# Αν έχεις ήδη SSL για portfolio-projects.space, το προσπερνάς. Αλλιώς
certbot --nginx -d portfolio-projects.space -d www.portfolio-projects.space
systemctl reload nginx
```

github page → https://alkisax.github.io/openTextQuiz/
με npm run gh-predeploy και npm run gh-deploy

Yγ. μην ξεχάσω την σελίδα https://portfolio-projects.space/open-text/open-text-page και https://portfolio-projects.space/open-text/open-text-page

## oneline deploy
ssh root@49.12.76.128
```bash
cd /var/www/open-text \
&& git pull origin main \
&& cd frontend \
&& npm install \
&& npm run build \
&& cd ../backend \
&& npm install \
&& npm run build \
&& pm2 restart open-text --update-env \
&& nginx -t \
&& systemctl reload nginx \
&& sleep 3 \
&& curl https://portfolio-projects.space/open-text/api/ping; echo
```
`pm2 logs open-text --lines 100`
`pm2 flush open-text`