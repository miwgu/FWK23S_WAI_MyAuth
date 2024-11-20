# FWK23S_WAI_MyAuth
## Security settings
CSRF token, JWT(Cookie), password salting, reCAPTHA, Health check, Helmet
### Use HTTP-Only Cookies
1. Enhanced Security:
- Prevents XSS attacks since JavaScript cannot read the cookie.
-> When combined with the Secure flag, the cookie is only sent over HTTPS.
2. Automatic Management:
- The browser handles sending the cookie automatically.
3. SameSite Protection:
- Using SameSite=Strict (or SameSite=Lax) can mitigate Cross-Site Request Forgery (CSRF) attacks by restricting when cookies are sent.
## .env file
You need to add .env file under src
## How to start (React.js)
npm install
npm run dev (If you do not use Docker setting, You need to adjust db.js)

### Docker Container Setup for `fwk-auth`
This guide helps you build and run a Docker container. Follow the steps below to get started.
1. Install Docker desktop
2. Before running the container, create a custom Docker network for frontend(Business, Admin) backend(Business, Admin) and auth.
```bash
docker network create --subnet=172.20.0.0/24 fwk-net
docker network ls
docker inspect fwk-net
```
3. Downloads a Docker image from Docker Hub
```bash
docker pull mysql:8.0
```
4. Loggin to your Database: input password (check sql file to create DB)
```bash
winpty docker exec -it my-mysql-container mysql -u myuser -p
```
5. Builds the images (if necessary) and starts the services defined in the docker-compose.yml file
```bash
docker-compose up -d --build
```
6. Stops and removes all containers, networks, and volumes defined in the docker-compose.yml file
```bash
docker-compose down
```
7. Displays the logs of the fwk-auth container.
```bash
docker logs fwk-auth
```
