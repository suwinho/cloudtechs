docker buildx create --name multiarch --use
docker buildx inspect 

docker buildx build --platform linux/amd64,linux/arm64 -t suwinho123/backend:v3 -t suwinho123/backend:latest --push ./backend
docker buildx build --platform linux/amd64,linux/arm64 -t suwinho123/frontend:v3 -t suwinho123/frontend:latest --push ./frontend

docker buildx imagetools inspect suwinho123/backend:v3
docker buildx imagetools inspect suwinho123/frontend:v3