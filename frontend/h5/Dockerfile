FROM nginx
RUN rm -rf /usr/share/nginx/html/*
# Jenkins에서 생성된 build/ 디렉토리를 Docker 빌드 컨텍스트 내에 위치시켰다면...
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
