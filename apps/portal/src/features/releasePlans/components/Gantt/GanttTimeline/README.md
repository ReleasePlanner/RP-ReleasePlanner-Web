# GanttTimeline Component Architecture

## 📁 **Estructura Refactorizada**

```
GanttTimeline/
├── GanttTimeline.tsx        # Componente principal orquestador
├── TimelineOverlays.tsx     # Componentes de overlays (Today marker, botón, leyenda)
├── TimelineRows.tsx         # Componentes de filas (Meses, Semanas, Días)
├── constants.ts             # Constantes centralizadas
├── index.ts                 # Barrel exports
└── README.md                # Esta documentación
```

## 🎯 **Principios Aplicados**

### **1. Single Responsibility Principle (SRP)**

- **GanttTimeline**: Orquesta y coordina sub-componentes
- **TimelineOverlays**: Maneja elementos superpuestos (marcadores, botones)
- **TimelineRows**: Renderiza las filas de tiempo (meses, semanas, días)
- **constants**: Centraliza configuración y colores

### **2. Composition over Inheritance**

```tsx
// ✅ Antes: Componente monolítico (163 líneas)
// ✅ Después: Composición de componentes especializados
<div>
  <TodayMarker {...todayProps} />
  <TodayButton onJumpToToday={onJumpToToday} />
  <TimelineLegend />
  <MonthsRow monthSegments={monthSegments} pxPerDay={pxPerDay} />
  <WeeksRow weekSegments={weekSegments} pxPerDay={pxPerDay} />
  <DaysRow days={days} pxPerDay={pxPerDay} />
</div>
```

### **3. Constants Centralization**

```tsx
// ❌ Antes: Valores hardcodeados dispersos
const monthsRow = 28;
const weeksRow = 24;

// ✅ Después: Constantes organizadas y tipadas
export const TIMELINE_DIMENSIONS = {
  MONTHS_ROW_HEIGHT: 28,
  WEEKS_ROW_HEIGHT: 24,
  DAYS_ROW_HEIGHT: 24,
  get TOTAL_HEIGHT() {
    return (
      this.MONTHS_ROW_HEIGHT + this.WEEKS_ROW_HEIGHT + this.DAYS_ROW_HEIGHT
    );
  },
} as const;
```

## 🧩 **Componentes**

### **GanttTimeline** (Main Orchestrator)

**Responsabilidades:**

- Calcular datos derivados (days, monthSegments, weekSegments)
- Validar props y proporcionar valores seguros
- Orquestar la composición de sub-componentes

**Props:**

```tsx
type GanttTimelineProps = {
  start: Date;
  totalDays: number;
  pxPerDay: number;
  todayIndex?: number;
  onJumpToToday?: () => void;
};
```

### **TimelineOverlays**

**Componentes:**

- `TodayMarker`: Línea vertical que marca el día actual
- `TodayButton`: Botón para saltar al día de hoy
- `TimelineLegend`: Leyenda explicativa de elementos visuales

### **TimelineRows**

**Componentes:**

- `MonthsRow`: Fila superior con etiquetas de meses
- `WeeksRow`: Fila media con numeración de semanas
- `DaysRow`: Fila inferior con días individuales
- `TimelineRow`: Componente base reutilizable para filas

## 🎨 **Beneficios de la Refactorización**

### **✅ Mantenibilidad**

- Componentes más pequeños y enfocados
- Lógica separada por responsabilidad
- Fácil localización de bugs

### **✅ Reutilización**

- `TimelineRow` puede reutilizarse para nuevas filas
- Overlays independientes para otros contextos
- Constantes compartibles entre componentes

### **✅ Testabilidad**

- Cada componente se puede testear aisladamente
- Props más específicas y predecibles
- Mocks más sencillos

### **✅ Legibilidad**

- JSX más limpio y declarativo
- Separación clara de conceptos
- Documentación por componente

### **✅ Escalabilidad**

- Agregar nuevos tipos de fila es sencillo
- Modificar overlays sin afectar timeline
- Constantes centralizadas facilitan cambios globales

## 📋 **Próximos Pasos Sugeridos**

1. **🎨 Theme Integration**: Migrar colores hardcodeados al sistema de temas MUI
2. **♿ Accessibility**: Añadir ARIA labels y keyboard navigation
3. **📱 Responsive**: Adaptar dimensiones para móviles
4. **⚡ Performance**: Implementar virtualización para grandes rangos de fechas
5. **🧪 Testing**: Crear tests unitarios para cada sub-componente

## 📖 **Ejemplo de Uso**

```tsx
import GanttTimeline from "./GanttTimeline/GanttTimeline";

function MyGantt() {
  return (
    <GanttTimeline
      start={new Date("2025-01-01")}
      totalDays={365}
      pxPerDay={24}
      todayIndex={45}
      onJumpToToday={() => console.log("Jump to today!")}
    />
  );
}
```
