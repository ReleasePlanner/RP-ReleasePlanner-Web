# Guía de Migraciones de Base de Datos

## 📋 Resumen

Las migraciones de base de datos permiten versionar y gestionar cambios en el esquema de la base de datos de forma controlada y reproducible.

## 🚀 Migración Inicial Creada

Se ha creado la migración inicial `InitialMigration1700000000000` que incluye:

- ✅ Todas las 18 tablas del sistema
- ✅ Todos los índices únicos y compuestos
- ✅ Todas las relaciones (Foreign Keys)
- ✅ Todos los tipos ENUM
- ✅ Triggers para actualización automática de `updatedAt`
- ✅ Columnas JSONB para datos complejos

## 📝 Cómo Usar las Migraciones

### Opción 1: Ejecutar Migraciones Manualmente (Recomendado para Producción)

```bash
# Desde el directorio apps/api
cd apps/api

# Ejecutar migraciones pendientes
npm run migration:run
```

### Opción 2: Ejecutar Migraciones Automáticamente al Iniciar

Configura la variable de entorno:

```env
RUN_MIGRATIONS=true
```

Luego inicia la aplicación normalmente. Las migraciones se ejecutarán automáticamente.

⚠️ **Nota**: Esta opción solo debe usarse en desarrollo o con precaución en producción.

### Opción 3: Usar TypeORM CLI Directamente

```bash
# Instalar TypeORM CLI globalmente (si no está instalado)
npm install -g typeorm

# Ejecutar migraciones
typeorm migration:run -d apps/api/ormconfig.ts
```

## 🔧 Configuración

### Variables de Entorno Requeridas

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=releaseplanner
DATABASE_PASSWORD=releaseplanner123
DATABASE_NAME=releaseplanner
```

### Archivo de Configuración

El archivo `apps/api/ormconfig.ts` contiene la configuración para TypeORM CLI.

## 📊 Estructura de la Migración Inicial

### Tablas Creadas

1. **base_phases** - Fases base del sistema
2. **products** - Productos
3. **component_versions** - Versiones de componentes
4. **feature_categories** - Categorías de features
5. **product_owners** - Propietarios de productos
6. **features** - Features de productos
7. **calendars** - Calendarios
8. **calendar_days** - Días del calendario
9. **it_owners** - Propietarios IT
10. **plans** - Planes de release
11. **plan_phases** - Fases de planes
12. **plan_tasks** - Tareas de planes
13. **plan_milestones** - Hitos de planes
14. **plan_references** - Referencias de planes
15. **gantt_cell_data** - Datos de celdas Gantt
16. **gantt_cell_comments** - Comentarios de celdas
17. **gantt_cell_files** - Archivos de celdas
18. **gantt_cell_links** - Enlaces de celdas

### Características Implementadas

- **UUIDs**: Todas las tablas usan UUID como ID primario
- **Timestamps**: `createdAt` y `updatedAt` automáticos
- **Triggers**: Función y triggers para actualizar `updatedAt` automáticamente
- **Índices**: Índices únicos y compuestos para optimización
- **Foreign Keys**: Relaciones con cascade delete donde corresponde
- **JSONB**: Columnas JSONB para arrays y objetos complejos

## 🔄 Comandos Disponibles

### Ver Estado de Migraciones

```bash
npm run migration:show
```

Muestra qué migraciones han sido ejecutadas y cuáles están pendientes.

### Revertir Última Migración

```bash
npm run migration:revert
```

⚠️ **Cuidado**: Esto eliminará los datos de las tablas afectadas.

### Crear Nueva Migración

```bash
# Generar migración basada en cambios en entidades
npm run migration:generate -- src/migrations/MigrationName

# Crear migración vacía
npm run migration:create -- src/migrations/MigrationName
```

## 🧪 Testing

### Desarrollo

En desarrollo, puedes usar `synchronize: true` en la configuración de TypeORM para que las tablas se creen automáticamente. Sin embargo, es mejor usar migraciones para mantener consistencia.

### Producción

En producción:
1. ✅ **SIEMPRE** usa migraciones
2. ✅ Ejecuta migraciones manualmente antes del despliegue
3. ✅ Verifica que las migraciones se ejecutaron correctamente
4. ✅ Ten un plan de rollback preparado

## 📚 Próximos Pasos

1. **Ejecutar la migración inicial**:
   ```bash
   npm run migration:run
   ```

2. **Verificar que las tablas se crearon**:
   ```sql
   \dt  -- En psql
   ```

3. **Probar la aplicación**:
   ```bash
   npm run dev:api
   ```

4. **Crear migraciones futuras** cuando modifiques las entidades

## ⚠️ Advertencias Importantes

1. **No modifiques migraciones ya ejecutadas** - Crea una nueva migración en su lugar
2. **Haz backup antes de ejecutar migraciones en producción**
3. **Prueba las migraciones en desarrollo primero**
4. **Revisa el SQL generado antes de ejecutarlo**
5. **Mantén un registro de las migraciones ejecutadas**

## 🐛 Troubleshooting

### Error: "uuid_generate_v4() does not exist"

Ejecuta este comando en PostgreSQL:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Error: "relation already exists"

Si las tablas ya existen (por ejemplo, si usaste `synchronize: true`), puedes:

1. Eliminar las tablas manualmente (solo en desarrollo)
2. Modificar la migración para usar `IF NOT EXISTS`
3. Marcar la migración como ejecutada sin ejecutarla

### Error de conexión

Verifica que:
- PostgreSQL esté corriendo
- Las credenciales sean correctas
- La base de datos exista (o que tengas permisos para crearla)

## 📖 Referencias

- [TypeORM Migrations](https://typeorm.io/migrations)
- [NestJS Database](https://docs.nestjs.com/techniques/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

