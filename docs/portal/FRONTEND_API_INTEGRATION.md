# Integración de API en Frontend - Completada

## ✅ Estado: COMPLETADO

Se ha creado la infraestructura completa para que el frontend consuma los endpoints de la API de NestJS.

## 📦 Archivos Creados

### Configuración Base

1. **`apps/portal/src/api/config.ts`** - Configuración de URL base y endpoints
2. **`apps/portal/src/api/httpClient.ts`** - Cliente HTTP con manejo de errores
3. **`apps/portal/src/api/index.ts`** - Exportaciones principales

### Servicios de API (6 servicios)

1. **`apps/portal/src/api/services/basePhases.service.ts`** - CRUD de Base Phases
2. **`apps/portal/src/api/services/products.service.ts`** - CRUD de Products
3. **`apps/portal/src/api/services/features.service.ts`** - CRUD de Features
4. **`apps/portal/src/api/services/calendars.service.ts`** - CRUD de Calendars
5. **`apps/portal/src/api/services/itOwners.service.ts`** - CRUD de IT Owners
6. **`apps/portal/src/api/services/plans.service.ts`** - CRUD de Release Plans

### Hooks de React Query (6 hooks)

1. **`apps/portal/src/api/hooks/useBasePhases.ts`** - Hooks para Base Phases
2. **`apps/portal/src/api/hooks/useProducts.ts`** - Hooks para Products
3. **`apps/portal/src/api/hooks/useFeatures.ts`** - Hooks para Features
4. **`apps/portal/src/api/hooks/useCalendars.ts`** - Hooks para Calendars
5. **`apps/portal/src/api/hooks/useITOwners.ts`** - Hooks para IT Owners
6. **`apps/portal/src/api/hooks/usePlans.ts`** - Hooks para Release Plans

### Documentación

1. **`apps/portal/API_INTEGRATION_GUIDE.md`** - Guía completa de integración
2. **`apps/portal/src/pages/phasesMaintenancePage.api.tsx`** - Ejemplo de componente actualizado

## 🎯 Características Implementadas

### Cliente HTTP

- ✅ Manejo de errores estructurado
- ✅ Soporte para todos los métodos HTTP (GET, POST, PUT, PATCH, DELETE)
- ✅ Headers automáticos (Content-Type: application/json)
- ✅ Parsing automático de respuestas JSON
- ✅ Manejo de códigos de estado HTTP

### Servicios

- ✅ Tipos TypeScript completos para todos los DTOs
- ✅ Interfaces que coinciden exactamente con los DTOs de NestJS
- ✅ Métodos CRUD completos para todos los módulos
- ✅ Soporte para queries opcionales (productId en features)

### Hooks de React Query

- ✅ Queries para obtener datos (con loading y error states)
- ✅ Mutations para crear, actualizar y eliminar
- ✅ Invalidación automática de cache después de mutations
- ✅ Query keys organizados jerárquicamente
- ✅ Optimistic updates support

## 📋 Endpoints Mapeados

### Base Phases
- `GET /api/base-phases` - Listar todas
- `GET /api/base-phases/:id` - Obtener por ID
- `POST /api/base-phases` - Crear
- `PUT /api/base-phases/:id` - Actualizar
- `DELETE /api/base-phases/:id` - Eliminar

### Products
- `GET /api/products` - Listar todas
- `GET /api/products/:id` - Obtener por ID
- `POST /api/products` - Crear
- `PUT /api/products/:id` - Actualizar
- `DELETE /api/products/:id` - Eliminar

### Features
- `GET /api/features` - Listar todas
- `GET /api/features?productId=xxx` - Filtrar por producto
- `GET /api/features/:id` - Obtener por ID
- `POST /api/features` - Crear
- `PUT /api/features/:id` - Actualizar
- `DELETE /api/features/:id` - Eliminar

### Calendars
- `GET /api/calendars` - Listar todos
- `GET /api/calendars/:id` - Obtener por ID
- `POST /api/calendars` - Crear
- `PUT /api/calendars/:id` - Actualizar
- `DELETE /api/calendars/:id` - Eliminar

### IT Owners
- `GET /api/it-owners` - Listar todos
- `GET /api/it-owners/:id` - Obtener por ID
- `POST /api/it-owners` - Crear
- `PUT /api/it-owners/:id` - Actualizar
- `DELETE /api/it-owners/:id` - Eliminar

### Release Plans
- `GET /api/plans` - Listar todos
- `GET /api/plans/:id` - Obtener por ID
- `POST /api/plans` - Crear
- `PUT /api/plans/:id` - Actualizar
- `DELETE /api/plans/:id` - Eliminar

## 🚀 Cómo Usar

### 1. Configurar URL de API

Crea un archivo `.env` en `apps/portal/`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Usar Hooks en Componentes

```typescript
import { useBasePhases, useCreateBasePhase } from "../api/hooks";

function MyComponent() {
  const { data: phases = [], isLoading, error } = useBasePhases();
  const createMutation = useCreateBasePhase();

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        name: "Nueva Fase",
        color: "#1976D2",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {phases.map(phase => (
        <div key={phase.id}>{phase.name}</div>
      ))}
      <button onClick={handleCreate}>Crear</button>
    </div>
  );
}
```

### 3. Ver Ejemplo Completo

Revisa `apps/portal/src/pages/phasesMaintenancePage.api.tsx` para ver un ejemplo completo de cómo actualizar un componente.

## 📝 Próximos Pasos

1. **Actualizar componentes existentes**:
   - `phasesMaintenancePage.tsx` → Usar `useBasePhases` hooks
   - `productMaintenancePage.tsx` → Usar `useProducts` hooks
   - `featureMaintenancePage.tsx` → Usar `useFeatures` hooks
   - `calendarMaintenancePage.tsx` → Usar `useCalendars` hooks
   - Componentes de Release Plans → Usar `usePlans` hooks

2. **Probar la integración**:
   - Asegúrate de que la API esté corriendo
   - Verifica que los endpoints respondan correctamente
   - Prueba operaciones CRUD desde el frontend

3. **Manejo de errores**:
   - Agregar notificaciones de éxito/error
   - Manejar casos edge (red offline, timeout, etc.)

## ⚠️ Notas Importantes

1. **Tipos**: Los tipos en los servicios coinciden exactamente con los DTOs de NestJS
2. **Features**: Requiere objetos anidados para `category` y `createdBy`, no IDs
3. **Calendars**: Los días se manejan a través del objeto Calendar completo
4. **Plans**: Las fases se incluyen en el DTO del plan

## 🔗 Referencias

- `API_INTEGRATION_GUIDE.md` - Guía detallada de uso
- `phasesMaintenancePage.api.tsx` - Ejemplo de componente actualizado

