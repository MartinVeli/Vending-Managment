# Vending Management — Spring Boot + PostgreSQL

Проектът е организиран в стил, подобен на employee-management-with-spring: `controller`, `dto`, `mapper`, `model`, `repository`, плюс `service`, `exception` и `seeder` за университетските изисквания.

## Изисквания
- Java 21
- Maven 3.9+ (или Maven Wrapper, ако е наличен)
- PostgreSQL локално на Windows — Docker не е необходим

## 1. Създаване на база данни
В pgAdmin Query Tool или SQL Shell изпълни:

```sql
CREATE DATABASE vending_db;
```

## 2. Настройване на паролата
Отвори `src/main/resources/application.properties` и замени `change_me` с паролата на PostgreSQL потребителя `postgres`, или задай променливите `DB_USERNAME` и `DB_PASSWORD`.

## 3. Стартиране
От главната папка на проекта:

```powershell
mvn spring-boot:run
```

Swagger UI: http://localhost:8080/swagger-ui.html

При първо стартиране seeder-ът добавя примерни категории, продукти и една вендинг машина, ако липсват.

## Основни endpoints
- `GET /api/machines`, `POST /api/machines`
- `GET /api/products`, `POST /api/products`
- `POST /api/inventory`
- `GET /api/inventory/machine/{machineId}`
- `GET /api/inventory/low-stock`
- `POST /api/inventory/{id}/sales`
- `POST /api/inventory/{id}/restock`

## Пакети
- `controller` — REST endpoints
- `dto` — request/response обекти
- `mapper` — преобразуване към DTO
- `model` — JPA entities
- `repository` — Spring Data repositories
- `service` — бизнес логика
- `exception` — глобална обработка на грешки
- `seeder` — начални примерни данни

Проектът използва PostgreSQL и не изисква Docker.
