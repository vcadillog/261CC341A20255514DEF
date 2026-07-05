#!/bin/bash

# Carga .env 
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found!"
    exit 1
fi

# Crea el usuario
echo "Creando usuario $SPRING_DATASOURCE_USERNAME si no existe..."
psql -U postgres -tc "SELECT 1 FROM pg_roles WHERE rolname = '$SPRING_DATASOURCE_USERNAME'" | grep -q 1 || \
    psql -U postgres -c "CREATE USER $SPRING_DATASOURCE_USERNAME WITH PASSWORD '$SPRING_DATASOURCE_PASSWORD';"

# Crea la base de datos
echo "Creando database $DB_NAME si no existe..."
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
    psql -U postgres -c "CREATE DATABASE $DB_NAME OWNER $SPRING_DATASOURCE_USERNAME;"

# Otorga privilegios
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $SPRING_DATASOURCE_USERNAME;"

# Otorga permisos
psql -U postgres -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $SPRING_DATASOURCE_USERNAME;"

# Ejecuta el script SQL 
echo "Ejecutando script SQL: $SQL_FILE como $SPRING_DATASOURCE_USERNAME"
psql -U $SPRING_DATASOURCE_USERNAME -d $DB_NAME -f $SQL_FILE

echo "Instalacion de db completa"
