FROM bellsoft/liberica-openjdk-debian:17

WORKDIR /app

# 빌드 시 생성되는 JAR 파일을 명시적으로 지정
ARG JAR_FILE=build/libs/backend-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java", "-jar", "app.jar", "--server.address=0.0.0.0"]
