# Lab 07 - Cliente React con Tiempo Real (Socket.IO) para Blueprints

# Hecho por Isaac David Palomo Peralta y Sebastian Duque Ceballos

Este repositorio contiene la solución del **Laboratorio 7 de ARSW**: un cliente React moderno que integra colaboración en tiempo real usando **Socket.IO** para dibujar blueprints simultáneamente desde múltiples usuarios.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Objetivos Alcanzados](#objetivos-alcanzados)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Cómo Correr el Proyecto](#cómo-correr-el-proyecto)
6. [Funcionalidades Principales](#funcionalidades-principales)
7. [Parte 1: CRUD REST](#parte-1-crud-rest)
8. [Parte 2: Integración Socket.IO](#parte-2-integración-socketio)
9. [Tests y Validación](#tests-y-validación)
10. [Guion de Demo](#guion-de-demo-30-60-segundos)

---

## 🎯 Descripción General

**Lab P7 Blueprints Real-Time** es una Single Page Application (SPA) que permite a múltiples usuarios:

- Consultar blueprints existentes por autor
- Crear nuevos blueprints dibujando en un canvas
- Editar y actualizar blueprints existentes
- **Colaborar en tiempo real**: ver dibujos de otros usuarios mientras dibujan
- Autenticarse con JWT (mock)
- Gestionar permisos basados en autenticación

La clave de este laboratorio es la **integración Socket.IO** que permite sincronización en vivo entre pestañas/usuarios sin recargar la página.

---

## ✅ Objetivos Alcanzados

### Parte 1: CRUD y Autenticación
- ✅ GET /blueprints (listar todos)
- ✅ GET /blueprints?author={author} (filtrar por autor)
- ✅ GET /blueprints/:author/:name (detalle específico)
- ✅ POST /blueprints (crear nuevo)
- ✅ PUT /blueprints/:author/:name (actualizar)
- ✅ DELETE /blueprints/:author/:name (eliminar)
- ✅ POST /auth/login (autenticación JWT mock)

### Parte 2: Tiempo Real con Socket.IO
- ✅ Conexión WebSocket automática en modo Socket.IO
- ✅ Unirse a "salas" por blueprint
- ✅ Emitir eventos de dibujo
- ✅ Escuchar actualizaciones en vivo
- ✅ Deduplicación de puntos
- ✅ Indicador visual de estado de conexión

### Parte 3: Tests y Documentación
- ✅ 9+ tests unitarios (Vitest + Testing Library)
- ✅ Tests específicos de Socket.IO
- ✅ Tests de deduplicación
- ✅ README completo

---

## 🛠 Stack Tecnológico

### Frontend
- **React 18.2.0** - UI framework
- **Vite 7.3.1** - Build tool y dev server
- **Redux Toolkit 2.2.0** - Gestión de estado global
- **React Router 6.22.3** - Client-side routing
- **Axios 1.7.2** - HTTP client con interceptores
- **socket.io-client 4.8.3** - Cliente WebSocket

### Testing & Quality
- **Vitest 3.2.4** - Test runner compatible con Vite
- **@testing-library/react** - Rendering de componentes
- **ESLint** - Linting de código

### Backend (Requerido)
- **Node.js + Express** - API REST
- **Socket.IO** - WebSocket server
- **CORS enabled** - Acepta requests desde http://localhost:5173

---

## 💻 Instalación y Configuración

### Prerequisitos

- Node.js 16+
- npm o yarn
- Backend Socket.IO running en `http://localhost:3001`

### Paso 1: Clonar e instalar dependencias

```bash
git clone <repo-url>
cd Lab07-ARSW
npm install
```

### Paso 2: Configurar variables de entorno (opcional)

Crea `.env.local` en la raíz (estos son los defaults):

```env
VITE_API_BASE=http://localhost:3001
VITE_BLUEPRINTS_PATH=/api/blueprints
VITE_AUTH_PATH=/auth/login
VITE_IO_BASE=http://localhost:3001
```

### Paso 3: Backend Socket.IO (CRÍTICO)

Debes tener un servidor Node.js corriendo en puerto 3001 con:
- ✅ CORS habilitado
- ✅ Endpoints REST CRUD
- ✅ Socket.IO con eventos: `join-room`, `draw-event`, `blueprint-update`

---

## 🚀 Cómo Correr el Proyecto

### Desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

### Testing

```bash
npm test
```

Ejecuta 15+ tests:
- blueprintsSlice tests (4)
- Canvas tests (1)
- Form tests (1)
- BlueprintsPage tests (1)
- **socketRealtime tests (6)** ⭐
- **pointDeduplication tests (6)** ⭐

### Linting

```bash
npm run lint
```

### Build Producción

```bash
npm run build
```

Genera archivos optimizados en `dist/` (~97 KB gzipped).

### Todo junto

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

---

## 🎨 Funcionalidades Principales

### 1. Autenticación JWT Mock

Login rápido sin credenciales reales:

```javascript
// Usuarios: alice, Isaac, Sebastian
Token se inyecta automáticamente en todos los requests
```

### 2. Búsqueda por Autor

Busca blueprints de un autor específico en la página principal.

### 3. Cálculo de Puntos Totales

Se suman todos los puntos de todos los blueprints del autor.

### 4. Top 5 Blueprints

Selector que muestra los 5 blueprints con más puntos.

### 5. Canvas Interactivo

Click en canvas = punto local + emite `draw-event` por Socket.IO.

### 6. Tiempo Real Multi-Usuario

Dos usuarios en el mismo blueprint ven actualizaciones en vivo.

### 7. Indicador de Conexión

En el header:
- 🟢 **Conectado** - WebSocket activo (en edición)
- 🔴 **Desconectado** - Fuera de edición

---

## 📋 Parte 1: CRUD REST

### Endpoints

```
GET    /api/blueprints
GET    /api/blueprints?author=alice
GET    /api/blueprints/alice/blueprint1
POST   /api/blueprints
PUT    /api/blueprints/alice/blueprint1
DELETE /api/blueprints/alice/blueprint1
POST   /auth/login
```

---

## 🔌 Parte 2: Integración Socket.IO

### Flujo

1. Usuario A abre `/blueprints/alice/drawing`
2. BlueprintDetailPage conecta socket automáticamente
3. A hace click en canvas → emite `draw-event`
4. Backend recibe → persiste → emite `blueprint-update` a sala
5. Usuario B recibe actualización en vivo
6. Deduplicación evita puntos duplicados

### Estructura de Mensajes

**join-room:**
```javascript
socket.emit('join-room', 'blueprints.alice.drawing')
```

**draw-event:**
```javascript
socket.emit('draw-event', {
  room: 'blueprints.alice.drawing',
  author: 'alice',
  name: 'drawing',
  point: { x: 150, y: 250 }
})
```

**blueprint-update:**
```javascript
socket.on('blueprint-update', (payload) => {
  // payload.author, payload.name, payload.points
})
```

### Deduplicación de Puntos

Lógica en `BlueprintDetailPage.jsx`:

```javascript
// Si es actualización completa (>1 punto), reemplazar
if (incomingPoints.length > 1) return incomingPoints

// Si es 1 punto, verificar si es duplicado
const last = prevPoints[prevPoints.length - 1]
if (last && last.x === incomingPoint.x && last.y === incomingPoint.y) {
  return prevPoints  // Duplicado
}
return [...prevPoints, incomingPoint]  // Nuevo
```

---

## ✅ Tests y Validación

### socketRealtime.test.js (Nuevo)

Valida:
- `getSocketStatus()` retorna estado correcto
- `joinBlueprintRoom()` emite evento con formato correcto
- `emitDrawEvent()` emite payload correcto
- `onBlueprintUpdate()` registra listener
- Limpieza de recursos

### pointDeduplication.test.js (Nuevo)

Valida:
- No agrega duplicados
- Agrega nuevos puntos
- Maneja actualizaciones bulk
- Detecta duplicados con decimales

### Coverage

```
Test Files  6 passed
Tests      15+ passed
Time       ~4s
```

---

## 🎬 Guion de Demo (30-60 segundos)

### Escenario: 2 Usuarios Colaborando

**Paso 1: Preparar 2 Pestañas**
```
Tab A: http://localhost:5173
Tab B: http://localhost:5173
```

**Paso 2: Seleccionar RT Mode**
```
Tab A: Selector → "RT: Socket.IO"     ✓ Conectado 🟢
Tab B: Selector → "RT: Socket.IO"     ✓ Conectado 🟢
```

**Paso 3: Navegar al Mismo Blueprint**
```
Tab A: Blueprints → alice → Blueprint1 → Update
Tab B: Blueprints → alice → Blueprint1 → Update
```

**Paso 4: Dibujar en Vivo**
```
Tab A: Click en Canvas (5 veces)
       → Puntos aparecen localmente
       → Backend: ✓ draw-event recibido
       → Backend: ✓ blueprint-update broadcasted

Tab B: Observar Canvas
       → Mismos puntos aparecen en tiempo real ✓
```

**Paso 5: Cambiar a None**
```
Tab A: Selector → "RT: None" (Desconectado 🔴)
Tab A: Click en Canvas
Tab B: NO ve cambios (demostración que RT está desactivado)
```

---

## 📝 Notas Importantes

### Backend CRÍTICO

Este frontend **NO funciona sin backend**. Asegúrate:

1. Backend en `http://localhost:3001`
2. CORS para `http://localhost:5173`
3. Socket.IO en mismo puerto
4. Endpoints REST implementados
5. Eventos Socket.IO: `join-room`, `draw-event`, `blueprint-update`



### Credenciales de acceso:

```
alice: 12345
Isaac: cntrIsaac
Sebastian: SebasDuqueC
```

---

## 📚 Estructura de Archivos

```
src/
├── pages/
│   ├── BlueprintDetailPage.jsx     (Socket.IO logic)
│   ├── BlueprintsPage.jsx
│   ├── CreateBlueprintPage.jsx
│   ├── LoginPage.jsx
│   └── NotFound.jsx
├── services/
│   ├── socketRealtime.js           (Socket.IO wrapper) ⭐
│   ├── apiclient.js                (REST CRUD)
│   ├── authStorage.js
│   └── realtimeModeStorage.js
├── features/blueprints/
│   └── blueprintsSlice.js          (Redux)
└── components/
    ├── BlueprintCanvas.jsx
    ├── BlueprintForm.jsx
    └── PrivateRoute.jsx

tests/
├── socketRealtime.test.js          ⭐
├── pointDeduplication.test.js      ⭐
├── blueprintsSlice.test.js
├── BlueprintCanvas.test.jsx
├── BlueprintForm.test.jsx
└── BlueprintsPage.test.jsx
```

---

## 🔄 Git Commits

```
✓ Lab07: CRUD REST + Auth
✓ Lab07: Socket.IO integration + dedup
✓ Lab07: State connection indicator
✓ Lab07: Tests socketRealtime + deduplication
✓ Lab07: README Documentation
```

---

## 🚄 Próximas Mejoras

- [ ] STOMP alternativo
- [ ] Reconexión automática
- [ ] Error notifications
- [ ] Collaborative cursors
- [ ] TypeScript migration
- [ ] Docker deployment

---

**¡Happy coding! 🚀**

