# Migraciones de Base de Datos

Este directorio contiene las migraciones de TypeORM para la base de datos PostgreSQL.

## Migraciones Disponibles

### InitialMigration (1700000000000)

Migración inicial que crea todas las tablas del sistema:
- Base Phases
- Products y Component Versions
- Features, Feature Categories y Product Owners
- Calendars y Calendar Days
- IT Owners
- Plans y todas sus entidades relacionadas (Phases, Tasks, Milestones, References, Gantt Cell Data)

## Comandos Disponibles

### Generar Nueva Migración

```bash
npm run migration:generate -- src/migrations/MigrationName
```

### Crear Migración Vacía

```bash
npm run migration:create -- src/migrations/MigrationName
```

### Ejecutar Migraciones Pendientes

```bash
npm run migration:run
```

### Revertir Última Migración

```bash
npm run migration:revert
```

### Ver Estado de Migraciones

```bash
npm run migration:show
```

## Ejecutar Migraciones Automáticamente

Para ejecutar migraciones automáticamente al iniciar la aplicación, configura:

```env
RUN_MIGRATIONS=true
```

⚠️ **Nota**: En producción, es recomendable ejecutar migraciones manualmente antes de desplegar la aplicación.

## Estructura de Migraciones

Cada migración debe implementar `MigrationInterface` con dos métodos:

- `up()`: Aplica los cambios
- `down()`: Revierte los cambios

## Buenas Prácticas

1. **Siempre prueba las migraciones** en un entorno de desarrollo primero
2. **Haz backup** de la base de datos antes de ejecutar migraciones en producción
3. **Revisa el código SQL** generado antes de ejecutarlo
4. **Documenta cambios importantes** en los comentarios de la migración
5. **No modifiques migraciones ya ejecutadas** - crea una nueva migración en su lugar

## Troubleshooting

### Error: "relation already exists"

Si una tabla ya existe, puedes:
1. Eliminar la tabla manualmente (solo en desarrollo)
2. Modificar la migración para usar `IF NOT EXISTS` (solo en desarrollo)
3. Crear una nueva migración que maneje el caso

### Error: "enum type already exists"

Similar al anterior, los tipos ENUM pueden necesitar ser manejados con `IF NOT EXISTS` o eliminados primero.

### Migraciones en Producción

En producción:
1. Ejecuta migraciones manualmente antes del despliegue
2. Verifica que todas las migraciones se ejecutaron correctamente
3. Mantén un registro de las migraciones ejecutadas
4. Ten un plan de rollback preparado

