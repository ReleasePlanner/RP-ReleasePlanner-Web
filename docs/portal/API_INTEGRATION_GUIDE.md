# Guía de Integración de API con Frontend

Esta guía explica cómo actualizar los componentes del frontend para usar los nuevos servicios de API con React Query en lugar de Redux para operaciones CRUD.

## 📦 Estructura Creada

### Servicios de API (`apps/portal/src/api/`)

```
api/
├── config.ts              # Configuración de URL base y endpoints
├── httpClient.ts          # Cliente HTTP con manejo de errores
├── queryClient.ts         # Configuración de React Query
├── services/              # Servicios por módulo
│   ├── basePhases.service.ts
│   ├── products.service.ts
│   ├── features.service.ts
│   ├── calendars.service.ts
│   ├── itOwners.service.ts
│   └── plans.service.ts
└── hooks/                 # Hooks de React Query
    ├── useBasePhases.ts
    ├── useProducts.ts
    ├── useFeatures.ts
    ├── useCalendars.ts
    ├── useITOwners.ts
    └── usePlans.ts
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en `apps/portal/` o configura la variable:

```env
VITE_API_URL=http://localhost:3000/api
```

O actualiza `vite.config.ts` para usar variables de entorno.

## 📝 Cómo Actualizar Componentes

### Antes (usando Redux)

```typescript
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { addBasePhase, updateBasePhase, removeBasePhase } from "../features/releasePlans/basePhasesSlice";

function MyComponent() {
  const dispatch = useAppDispatch();
  const phases = useAppSelector((state) => state.basePhases.phases);

  const handleSave = () => {
    dispatch(addBasePhase({ id: '1', name: 'Test', color: '#000' }));
  };
}
```

### Después (usando React Query)

```typescript
import {
  useBasePhases,
  useCreateBasePhase,
  useUpdateBasePhase,
  useDeleteBasePhase,
} from "../api/hooks";

function MyComponent() {
  const { data: phases = [], isLoading, error } = useBasePhases();
  const createMutation = useCreateBasePhase();
  const updateMutation = useUpdateBasePhase();
  const deleteMutation = useDeleteBasePhase();

  const handleSave = async () => {
    try {
      await createMutation.mutateAsync({
        name: 'Test',
        color: '#000',
      });
    } catch (error) {
      // Manejar error
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error: {error.message}</Alert>;

  return (
    // Tu componente
  );
}
```

## 🎯 Hooks Disponibles

### Base Phases

```typescript
import {
  useBasePhases,        // Obtener todas las fases
  useBasePhase,         // Obtener una fase por ID
  useCreateBasePhase,   // Crear nueva fase
  useUpdateBasePhase,   // Actualizar fase
  useDeleteBasePhase,   // Eliminar fase
} from "../api/hooks";
```

### Products

```typescript
import {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../api/hooks";
```

### Features

```typescript
import {
  useFeatures,         // Puede recibir productId opcional
  useFeature,
  useCreateFeature,
  useUpdateFeature,
  useDeleteFeature,
} from "../api/hooks";

// Obtener features de un producto específico
const { data: features } = useFeatures(productId);
```

### Calendars

```typescript
import {
  useCalendars,
  useCalendar,
  useCreateCalendar,
  useUpdateCalendar,
  useDeleteCalendar,
  useAddCalendarDay,
  useUpdateCalendarDay,
  useDeleteCalendarDay,
} from "../api/hooks";
```

### IT Owners

```typescript
import {
  useITOwners,
  useITOwner,
  useCreateITOwner,
  useUpdateITOwner,
  useDeleteITOwner,
} from "../api/hooks";
```

### Plans

```typescript
import {
  usePlans,
  usePlan,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
} from "../api/hooks";
```

## 💡 Ejemplos de Uso

### Ejemplo 1: Listar y Crear

```typescript
import { useBasePhases, useCreateBasePhase } from "../api/hooks";

function PhasesList() {
  const { data: phases = [], isLoading } = useBasePhases();
  const createMutation = useCreateBasePhase();

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        name: "Nueva Fase",
        color: "#1976D2",
      });
      // React Query invalidará automáticamente la lista
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) return <div>Cargando...</div>;

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

### Ejemplo 2: Actualizar con Optimistic Updates

```typescript
import { useUpdateBasePhase } from "../api/hooks";
import { queryClient } from "../api";

function EditPhase({ phaseId }: { phaseId: string }) {
  const updateMutation = useUpdateBasePhase();

  const handleUpdate = async (data: UpdateBasePhaseDto) => {
    // Optimistic update
    queryClient.setQueryData(['basePhases', 'detail', phaseId], (old: BasePhase) => ({
      ...old,
      ...data,
    }));

    try {
      await updateMutation.mutateAsync({ id: phaseId, data });
    } catch (error) {
      // Revertir en caso de error
      queryClient.invalidateQueries({ queryKey: ['basePhases', 'detail', phaseId] });
    }
  };

  return (
    // Formulario
  );
}
```

### Ejemplo 3: Manejo de Errores

```typescript
import { useBasePhases } from "../api/hooks";
import { Alert, CircularProgress } from "@mui/material";

function PhasesList() {
  const { data: phases, isLoading, error } = useBasePhases();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar las fases: {error instanceof Error ? error.message : 'Error desconocido'}
      </Alert>
    );
  }

  return (
    <div>
      {phases?.map(phase => (
        <div key={phase.id}>{phase.name}</div>
      ))}
    </div>
  );
}
```

## 🔄 Migración Gradual

Puedes migrar gradualmente:

1. **Mantener Redux** para estado local (UI state, filtros, etc.)
2. **Usar React Query** solo para operaciones de API
3. **Sincronizar** Redux con React Query cuando sea necesario

### Ejemplo de Migración Gradual

```typescript
import { useBasePhases } from "../api/hooks";
import { useAppSelector } from "../store/hooks";

function MyComponent() {
  // API data desde React Query
  const { data: apiPhases = [] } = useBasePhases();
  
  // UI state desde Redux
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  
  // Combinar ambos
  const filteredPhases = useMemo(() => {
    return apiPhases.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [apiPhases, searchQuery]);
}
```

## 📋 Checklist de Migración

Para cada componente que necesite actualizar:

- [ ] Reemplazar `useAppSelector` para datos de API con hooks de React Query
- [ ] Reemplazar `dispatch` de acciones de API con mutations
- [ ] Agregar manejo de `isLoading` y `error`
- [ ] Actualizar tipos para usar los tipos de los servicios
- [ ] Agregar feedback visual (loading, errores, éxito)
- [ ] Probar operaciones CRUD

## 🎨 Componente de Ejemplo

Ver `apps/portal/src/pages/phasesMaintenancePage.api.tsx` para un ejemplo completo de componente actualizado.

## ⚠️ Notas Importantes

1. **React Query maneja el cache automáticamente** - No necesitas invalidar manualmente en la mayoría de casos
2. **Las mutations invalidan queries automáticamente** - Los datos se refrescan después de crear/actualizar/eliminar
3. **Los errores se propagan** - Usa try/catch o el estado `error` de las mutations
4. **Loading states** - Usa `isLoading` de queries y `isPending` de mutations

## 🚀 Próximos Pasos

1. Actualizar `phasesMaintenancePage.tsx` para usar los nuevos hooks
2. Actualizar `productMaintenancePage.tsx`
3. Actualizar `featureMaintenancePage.tsx`
4. Actualizar `calendarMaintenancePage.tsx`
5. Actualizar componentes de Release Plans

## 📚 Referencias

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)

