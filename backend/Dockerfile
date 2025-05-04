FROM maven:3.9.9-eclipse-temurin-24-alpine AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY --from=build /app/target/backend-1.0.0.jar /app/backend-1.0.0.jar

EXPOSE 8080

CMD ["java", "-jar", "backend-1.0.0.jar"]