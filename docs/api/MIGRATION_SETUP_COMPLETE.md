# ✅ Migraciones Iniciales Creadas

## 🎉 Estado: COMPLETADO

Se ha creado la migración inicial completa para todas las tablas del sistema.

## 📦 Archivos Creados

1. **`apps/api/ormconfig.ts`** - Configuración de TypeORM CLI
2. **`apps/api/src/migrations/1700000000000-InitialMigration.ts`** - Migración inicial
3. **`apps/api/src/migrations/README.md`** - Documentación de migraciones
4. **`apps/api/MIGRATIONS_GUIDE.md`** - Guía completa de uso

## 📊 Contenido de la Migración Inicial

### Tablas Creadas (18 tablas)

1. ✅ `base_phases` - Con índices únicos en name y color
2. ✅ `products` - Con índice único en name
3. ✅ `component_versions` - Con relación a products
4. ✅ `feature_categories` - Con índice único en name
5. ✅ `product_owners` - Con índice único en name
6. ✅ `features` - Con relaciones a categories y owners
7. ✅ `calendars` - Con índice único en name
8. ✅ `calendar_days` - Con relación a calendars e índice compuesto
9. ✅ `it_owners` - Con índice único en name
10. ✅ `plans` - Con índices en name, productId, itOwner
11. ✅ `plan_phases` - Con relación a plans
12. ✅ `plan_tasks` - Con relación a plans
13. ✅ `plan_milestones` - Con relación a plans
14. ✅ `plan_references` - Con relación a plans
15. ✅ `gantt_cell_data` - Con relación a plans e índice compuesto
16. ✅ `gantt_cell_comments` - Con relación a gantt_cell_data
17. ✅ `gantt_cell_files` - Con relación a gantt_cell_data
18. ✅ `gantt_cell_links` - Con relación a gantt_cell_data

### Características Implementadas

- ✅ **UUIDs**: Todas las tablas usan UUID como ID primario
- ✅ **Timestamps**: `createdAt` y `updatedAt` automáticos
- ✅ **Triggers**: Función y triggers para actualizar `updatedAt` automáticamente
- ✅ **Índices**: Índices únicos y compuestos para optimización
- ✅ **Foreign Keys**: Relaciones con cascade delete donde corresponde
- ✅ **JSONB**: Columnas JSONB para arrays (`featureIds`, `components`, `calendarIds`)
- ✅ **ENUMs**: Tipos ENUM para status y tipos

## 🚀 Cómo Ejecutar la Migración

### Opción 1: Usando npm scripts (Recomendado)

```bash
cd apps/api
npm run migration:run
```

### Opción 2: Ejecutar automáticamente al iniciar

Configura la variable de entorno:

```env
RUN_MIGRATIONS=true
```

Luego inicia la aplicación normalmente.

### Opción 3: Usando TypeORM CLI directamente

```bash
cd apps/api
typeorm migration:run -d ormconfig.ts
```

## 📝 Scripts Disponibles

Se han agregado los siguientes scripts a `package.json`:

- `npm run migration:generate` - Generar nueva migración basada en cambios
- `npm run migration:create` - Crear migración vacía
- `npm run migration:run` - Ejecutar migraciones pendientes
- `npm run migration:revert` - Revertir última migración
- `npm run migration:show` - Ver estado de migraciones

## ⚙️ Configuración

### Variables de Entorno Requeridas

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=releaseplanner
DATABASE_PASSWORD=releaseplanner123
DATABASE_NAME=releaseplanner
```

### Requisito Previo: Extensión UUID

Antes de ejecutar la migración, asegúrate de que la extensión UUID esté habilitada en PostgreSQL:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

O ejecuta este comando antes de la migración:

```bash
psql -U releaseplanner -d releaseplanner -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

## ✅ Verificación

Después de ejecutar la migración, verifica que las tablas se crearon:

```sql
-- En psql
\dt

-- O contar tablas
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
```

Deberías ver 18 tablas.

## 🔄 Próximos Pasos

1. **Ejecutar la migración**:
   ```bash
   cd apps/api
   npm run migration:run
   ```

2. **Verificar el estado**:
   ```bash
   npm run migration:show
   ```

3. **Probar la aplicación**:
   ```bash
   npm run dev:api
   ```

4. **Verificar health check**:
   ```bash
   curl http://localhost:3000/api/health
   ```

## 📚 Documentación

- `MIGRATIONS_GUIDE.md` - Guía completa de uso de migraciones
- `src/migrations/README.md` - Documentación técnica de migraciones
- `MIGRATION_COMPLETE.md` - Resumen de la migración completa

## ⚠️ Notas Importantes

1. **En desarrollo**: Puedes usar `synchronize: true` pero es mejor usar migraciones
2. **En producción**: SIEMPRE usa migraciones, nunca `synchronize: true`
3. **Backup**: Haz backup antes de ejecutar migraciones en producción
4. **Testing**: Prueba las migraciones en desarrollo primero

## 🎉 ¡Migración Lista!

La migración inicial está completa y lista para ejecutarse. Todas las tablas del sistema están incluidas con sus relaciones, índices y características necesarias.

