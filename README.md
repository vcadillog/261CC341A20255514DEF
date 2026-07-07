# examen-final-swi
## Instrucciones para ejecutar el proyecto
1. Restaurar la base de datos:

En la raíz del proyecto:

```bash
createdb -U postgres -h localhost eleccion_db
psql -U postgres -h localhost -d eleccion_db -f elecciondb.sql
```

2. Backend:
- En la carpeta eleccionbackend:

```bash
./mvnw spring-boot:run
```

3. Frontend:
- En la carpeta frontend:

```bash
npm install
ng serve
```

