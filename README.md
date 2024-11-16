# FWK23S_WAI_MyAuth
## How to start (React.js)
npm install
### Docker Container Setup for ``
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
