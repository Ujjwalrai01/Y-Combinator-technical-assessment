<div align="center">

# ⚡ VectorShift Pipeline Builder

### A production-quality visual workflow editor built as a technical assessment for VectorShift / Y Combinator

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-4-orange?style=flat-square)](https://zustand-demo.pmnd.rs)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br/>

> Drag. Connect. Analyse. Build AI pipelines visually — the way VectorShift does it in production.

<br/>

![Dark Mode Pipeline](https://via.placeholder.com/900x500/0d1117/6366f1?text=VectorShift+Pipeline+Builder+%E2%80%94+Dark+Mode)

</div>

---

## ✨ Features

| Category | Feature |
|---|---|
| 🎨 **UI** | Dark & light mode, fully responsive (mobile + tablet + desktop) |
| 🧩 **Nodes** | 10 node types — Input, Output, LLM, Text, API Request, Webhook, Delay, Loop, Math, Filter |
| 🔌 **Connections** | Drag handles to connect nodes; animated smoothstep edges |
| 💬 **Text Node** | `{{variable}}` tokens create live input handles in real time |
| ↩️ **History** | Undo / Redo with 50-step stack (`Ctrl+Z` / `Ctrl+Shift+Z`) |
| 💾 **Persistence** | Export pipeline as JSON, import it back instantly |
| 🧠 **Analysis** | FastAPI backend validates the graph using Kahn's Algorithm |
| 📊 **Results** | Animated modal shows node count, edge count, and DAG validity |
| 📱 **Mobile** | Bottom sheet node palette, tap-to-add, touch-friendly handles |
| 🔍 **Search** | Filter nodes in the palette by name or category |
| 🗺️ **Minimap** | Colour-coded minimap with fit-view button |
| 🍞 **Toasts** | Non-blocking notifications for every action |

---

## 🖼️ Screenshots

<table>
  <tr>
    <td align="center">
      <img src="https://via.placeholder.com/420x260/0d1117/6366f1?text=Dark+Mode" width="420" alt="Dark Mode" />
      <br/><sub><b>Dark Mode</b></sub>
    </td>
    <td align="center">
      <img src="https://via.placeholder.com/420x260/f8fafc/6366f1?text=Light+Mode" width="420" alt="Light Mode" />
      <br/><sub><b>Light Mode</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://via.placeholder.com/420x260/0d1117/10b981?text=Pipeline+Analysis+Modal" width="420" alt="Modal" />
      <br/><sub><b>Pipeline Analysis Modal</b></sub>
    </td>
    <td align="center">
      <img src="https://via.placeholder.com/420x260/0d1117/6366f1?text=Mobile+Bottom+Sheet" width="420" alt="Mobile" />
      <br/><sub><b>Mobile — Bottom Sheet</b></sub>
    </td>
  </tr>
</table>

> Replace placeholder images with real screenshots before submission.

---

## 🏗️ Architecture

### The BaseNode Abstraction

Every node except `TextNode` is **pure configuration**. The `BaseNode` component renders them all.

```
Adding a new node = 1 config file, 0 new JSX
```

```js
// All it takes to add a new node:
export const emailConfig = {
  type:     'email',
  title:    'Email',
  category: 'IO',
  color:    '#0ea5e9',
  inputs:   [{ id: 'trigger', label: 'Trigger' }],
  outputs:  [{ id: 'sent',    label: 'Sent'    }],
  fields: [
    { key: 'to',      label: 'To',      type: FIELD_TYPES.TEXT     },
    { key: 'subject', label: 'Subject', type: FIELD_TYPES.TEXT     },
    { key: 'body',    label: 'Body',    type: FIELD_TYPES.TEXTAREA },
  ],
};
```

Register it in `configs/index.js` — done. The node appears in the toolbar, renders on canvas, and is included in pipeline submissions automatically.

### Data Flow

```
User Interaction
      │
      ▼
  Zustand Store  ──────────── undo/redo history stack
      │
      ▼
  React Flow Canvas
      │
      ▼
  BaseNode (config-driven)  or  TextNode (dynamic handles)
      │
      ▼
  POST /pipelines/parse  →  FastAPI  →  Kahn's Algorithm
      │
      ▼
  PipelineModal  (num_nodes, num_edges, is_dag)
```

### Folder Structure

```
├── backend/
│   ├── main.py               # FastAPI — single endpoint, Kahn's DAG detection
│   └── requirements.txt
│
└── frontend/src/
    ├── App.jsx               # Root layout — provider composition
    ├── index.css             # Tailwind + React Flow overrides
    │
    ├── components/
    │   ├── nodes/
    │   │   ├── BaseNode.jsx  # Universal node renderer
    │   │   ├── TextNode.jsx  # Dynamic variable handle node
    │   │   ├── index.js      # nodeTypes map — auto-generated
    │   │   └── configs/      # One file per node type (pure config)
    │   │       ├── index.js  ← node registry
    │   │       ├── input.js, output.js, llm.js, text.js
    │   │       ├── api.js, webhook.js, delay.js
    │   │       ├── loop.js, math.js, filter.js
    │   └── ui/
    │       ├── Canvas.jsx    # React Flow wrapper, drag-drop, keyboard
    │       ├── Toolbar.jsx   # Responsive sidebar / mobile sheet
    │       ├── PipelineModal.jsx
    │       ├── SubmitButton.jsx
    │       ├── EmptyCanvas.jsx
    │       └── Toast.jsx     # Toast context + provider
    │
    ├── hooks/
    │   ├── useNodeState.js       # Local field state ↔ Zustand sync
    │   ├── useVariableParser.js  # {{var}} regex, memoized
    │   ├── useAutoResize.js      # Textarea auto-grow (60–320px)
    │   ├── usePipeline.js        # Submit, loading, error, timeout guard
    │   ├── useTheme.js           # Dark/light, persisted to localStorage
    │   └── useResponsive.js      # Breakpoint detection
    │
    ├── store/
    │   └── index.js          # Zustand v4 — nodes, edges, undo/redo
    │
    ├── constants/
    │   └── index.js          # GRID_SIZE, VARIABLE_REGEX, colors, API_URL
    │
    └── utils/
        └── color.js          # hexToRgba utility
```

---

## ⚙️ Tech Stack

### Frontend
| Library | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| React Flow | 11 | Node-based canvas |
| Zustand | 4 | State management |
| Tailwind CSS | 3 | Utility-first styling |
| Framer Motion | 12 | Modal + sheet animations |
| Lucide React | latest | Icons |

### Backend
| Library | Version | Purpose |
|---|---|---|
| FastAPI | 0.115 | REST API framework |
| Pydantic | 2 | Request / response validation |
| Uvicorn | 0.30 | ASGI server |

---

## 🚀 Installation & Running

### Prerequisites
- **Node.js** 18+
- **Python** 3.10+

### 1 — Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API is live at `http://localhost:8000`  
Health check: `GET http://localhost:8000/` → `{ "status": "ok" }`

### 2 — Frontend

```bash
cd frontend
npm install
npm start
```

App opens at `http://localhost:3000`

> ⚠️ Both terminals must be running simultaneously for **Run Pipeline** to work.

---

## 🎮 How to Use

### Building a Pipeline

```
1.  Drag a node from the left sidebar → drop it on the canvas
2.  Hover a node → handles appear (circles on left/right edges)
3.  Drag from an output handle → drop onto an input handle to connect
4.  Fill in node fields by clicking and typing
5.  Click "Run Pipeline" to analyse the graph
```

### Text Node — Variable System

Type `{{variable_name}}` anywhere in the content field. A new input handle appears instantly.

```
{{user_prompt}}    ✅  creates handle "user_prompt"
{{api_response}}   ✅  creates handle "api_response"
{{123}}            ❌  starts with a number — ignored
{{user-name}}      ❌  contains a hyphen — ignored
```

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Delete` | Delete selected node or edge |
| `Scroll wheel` | Zoom in / out |
| `Click + drag canvas` | Pan |

### Import / Export

- **Export** → downloads `pipeline.json` (sidebar button)
- **Import** → loads a saved pipeline (sidebar button, fully undoable)

---

## 🔬 Backend — DAG Detection

**Endpoint:** `POST /pipelines/parse`

```json
// Request
{ "nodes": [{ "id": "input-1", ... }], "edges": [{ "source": "input-1", "target": "llm-1" }] }

// Response
{ "num_nodes": 3, "num_edges": 2, "is_dag": true }
```

### Kahn's Algorithm

```
1. Build adjacency list + in-degree map from edges
2. Queue all nodes with in-degree = 0
3. While queue is not empty:
     pop node → increment processed counter
     for each neighbour → decrement in-degree
     if in-degree == 0 → push to queue
4. processed == total nodes  →  DAG  ✅
   processed <  total nodes  →  Cycle ❌
```

**Time:** O(V + E) · **Space:** O(V + E)

---

## 🧠 Design Decisions

| Decision | Why |
|---|---|
| **Config-driven nodes** | Zero JSX duplication. A new node is 10 lines of config. |
| **Zustand over Redux** | No boilerplate. Selector-based subscriptions prevent over-rendering. |
| **Tailwind over CSS Modules** | Co-located styles, no class name collisions, JIT tree-shaking. |
| **`useStore.getState()` in submit** | Avoids reactive subscriptions that caused duplicate fetch calls. |
| **`inFlight` ref guard** | Prevents double-submission from React StrictMode double-renders. |
| **Kahn's Algorithm** | Naturally produces topological order as a by-product; cleaner than DFS cycle detection. |
| **Framer Motion (modal only)** | Spring physics add real value for modals/sheets. Avoided elsewhere to keep bundle lean. |

---

## 🔮 Future Improvements

- [ ] **Pipeline execution** — actually run the pipeline and stream results via WebSocket
- [ ] **Node templates** — save and reuse sub-graphs as single nodes
- [ ] **Connection validation** — restrict handle types (text → text, number → number)
- [ ] **Collaborative editing** — real-time multi-user via CRDTs
- [ ] **Backend persistence** — save pipelines to a database
- [ ] **TypeScript migration** — add static types to configs, hooks, and store
- [ ] **Plugin system** — let users install community-built node packs
- [ ] **Auto-layout** — arrange nodes automatically with Dagre/ELK

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

Built with ❤️ for the **VectorShift / Y Combinator** technical assessment

**[GitHub](https://github.com/Ujjwalrai01/Y-Combinator-technical-assessment)**

</div>
