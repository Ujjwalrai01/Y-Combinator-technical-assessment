# VectorShift Pipeline Builder

A production-quality visual workflow editor built for the VectorShift / Y Combinator technical assessment. Drag nodes onto a canvas, connect them with edges, and analyse your pipeline against a FastAPI backend that checks node count, edge count, and DAG validity using Kahn's Algorithm.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [How the Node Abstraction Works](#how-the-node-abstraction-works)
- [How to Add a New Node](#how-to-add-a-new-node)
- [Backend — Graph Algorithm](#backend--graph-algorithm)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [All Available Nodes](#all-available-nodes)
- [Pipeline Analysis Modal](#pipeline-analysis-modal)
- [Dark Mode](#dark-mode)
- [Import & Export](#import--export)
- [Trade-offs](#trade-offs)
- [Future Improvements](#future-improvements)

---

## Live Demo

Run locally — see [Installation](#installation) below.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, JSX                           |
| Styling   | Tailwind CSS v3 (utility-first, no CSS Modules) |
| State     | Zustand v4                              |
| Canvas    | React Flow v11                          |
| Animation | Framer Motion                           |
| Icons     | Lucide React                            |
| Backend   | Python 3.10+, FastAPI, Pydantic v2      |
| API       | REST — `POST /pipelines/parse`          |

---

## Features

| Feature | Details |
|---|---|
| 10 node types | Input, Output, LLM, Text, API Request, Webhook, Delay, Loop, Math, Filter |
| BaseNode abstraction | All nodes except Text are rendered from a config object — zero JSX duplication |
| Dynamic Text Node | `{{variable}}` tokens become live input handles in real time |
| Auto-resize textarea | Text node grows vertically as you type |
| Dark / Light mode | Persisted to `localStorage`, respects OS preference on first load |
| Undo / Redo | Full history stack (50 steps) via Zustand |
| Export pipeline | Downloads `pipeline.json` |
| Import pipeline | Loads a previously exported JSON |
| Pipeline analysis | FastAPI backend returns node count, edge count, DAG validity |
| Beautiful modal | Framer Motion animated result modal — no `alert()` |
| Toast notifications | Non-blocking feedback for import, clear, errors |
| Keyboard shortcuts | `Ctrl+Z` undo, `Ctrl+Shift+Z` redo, `Delete` removes selected node |
| Snap-to-grid | Nodes snap to a 20px grid |
| Empty canvas state | Illustrated prompt shown when no nodes exist |
| Colour-coded minimap | Each node type has a distinct colour in the minimap |

---

## Project Structure

```
Y-Combinator-technical-assessment/
├── backend/
│   └── main.py                  # FastAPI server — DAG detection endpoint
└── frontend/
    ├── public/
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── App.jsx              # Root layout and provider composition
        ├── index.js             # React DOM entry point
        ├── index.css            # Tailwind directives + React Flow overrides
        │
        ├── store/
        │   └── index.js         # Zustand store — nodes, edges, undo/redo
        │
        ├── constants/
        │   └── index.js         # GRID_SIZE, VARIABLE_REGEX, node colours, API URL
        │
        ├── hooks/
        │   ├── useNodeState.js      # Local field state ↔ Zustand sync
        │   ├── useVariableParser.js # {{var}} regex extraction, memoized
        │   ├── useAutoResize.js     # Textarea height auto-grow
        │   ├── usePipeline.js       # Submit, loading, error, modal state
        │   └── useTheme.js          # Dark/light toggle via <html> class
        │
        └── components/
            ├── nodes/
            │   ├── BaseNode.jsx         # Universal node renderer
            │   ├── TextNode.jsx         # Special node with dynamic handles
            │   ├── index.js             # nodeTypes map for React Flow
            │   └── configs/
            │       ├── index.js         # Registry + TOOLBAR_NODES list
            │       ├── input.js
            │       ├── output.js
            │       ├── llm.js
            │       ├── api.js
            │       ├── webhook.js
            │       ├── delay.js
            │       ├── loop.js
            │       ├── math.js
            │       └── filter.js
            └── ui/
                ├── Canvas.jsx           # React Flow wrapper, drop + keyboard
                ├── Toolbar.jsx          # Node palette, actions, theme toggle
                ├── SubmitButton.jsx     # Floating CTA with spinner
                ├── PipelineModal.jsx    # Animated result modal
                ├── EmptyCanvas.jsx      # Empty state illustration
                └── Toast.jsx            # Toast context + provider
```

---

## Architecture & Design Decisions

### 1. BaseNode abstraction — configuration over duplication

The original code had 4 separate node files, each with ~60 lines of near-identical JSX. The rewrite introduces a single `BaseNode.jsx` that receives a **config object** and renders everything automatically.

```
Config shape:
{
  type:     string        — React Flow node type key
  title:    string        — header label
  color:    string        — hex colour for accent bar + handle tints
  category: string        — toolbar grouping
  inputs:   Handle[]      — [{ id, label }]
  outputs:  Handle[]      — [{ id, label }]
  fields:   Field[]       — [{ key, label, type, defaultValue, options? }]
}
```

**Why?** Adding a new node now requires writing ~10 lines in a config file. No new component, no new JSX, no new CSS. The renderer handles handle positioning, header tinting, field rendering, and store sync automatically.

### 2. `useNodeState` — clean state ↔ store sync

Every node's form fields are managed by `useNodeState(nodeId, initialFields)`. It:
- Keeps local `useState` for immediate re-render on input
- Calls `updateNodeField` in the Zustand store on every change so the graph state is always serialisable

Without this hook, each node file would duplicate `useState` + `useCallback` + `updateNodeField` wiring.

### 3. `useVariableParser` — memoized regex extraction

The Text node uses `useVariableParser(text)` which:
- Runs a global regex to find all `{{identifier}}` tokens
- Only accepts valid JS identifiers (no `{{123}}`, no `{{user-name}}`)
- Returns a deduplicated array, memoized with `useMemo` — only re-runs when the text string changes

This means handles only update when variables actually change, not on every keystroke.

### 4. Zustand v4 store with undo/redo

The store holds `nodes`, `edges`, `past[]`, and `future[]`. Every mutating action (addNode, onConnect, clearCanvas) calls `pushHistory()` first, which deep-clones the current state onto the `past` stack. Undo/redo simply swaps states between the stacks.

### 5. Tailwind CSS — no CSS Modules, no inline styles

All styling uses Tailwind utility classes directly in JSX. The only `style={{}}` props are where **dynamic runtime values** are required (e.g. a node's hex accent colour that can't be known at build time). This keeps the bundle small and the styling co-located with the markup.

---

## How the Node Abstraction Works

```
User drags "API Request" onto canvas
          │
          ▼
  Canvas.jsx onDrop fires
          │
          ▼
  nodeTypes["apiRequest"] → createNode(apiConfig) → <BaseNode config={apiConfig} />
          │
          ▼
  BaseNode reads config.fields → renders each <NodeField>
  BaseNode reads config.inputs  → renders each <Handle type="target">
  BaseNode reads config.outputs → renders each <Handle type="source">
  BaseNode reads config.color   → tints header gradient + handle border
```

All 9 config-driven nodes share **exactly the same renderer**. The `nodeTypes` map is built once at module load by the factory in `components/nodes/index.js`.

---

## How to Add a New Node

**Step 1** — create `src/components/nodes/configs/email.js`:

```js
import { FIELD_TYPES } from '../../../constants';

export const emailConfig = {
  type:     'email',
  title:    'Email',
  category: 'IO',
  color:    '#0ea5e9',

  inputs:  [{ id: 'trigger', label: 'Trigger' }],
  outputs: [{ id: 'sent',    label: 'Sent' }],

  fields: [
    { key: 'to',      label: 'To',      type: FIELD_TYPES.TEXT,     placeholder: 'user@example.com', defaultValue: '' },
    { key: 'subject', label: 'Subject', type: FIELD_TYPES.TEXT,     placeholder: 'Hello!',           defaultValue: '' },
    { key: 'body',    label: 'Body',    type: FIELD_TYPES.TEXTAREA, placeholder: 'Email body…',      defaultValue: '' },
  ],
};
```

**Step 2** — register it in `src/components/nodes/configs/index.js`:

```js
import { emailConfig } from './email';

export const NODE_CONFIGS = {
  // ... existing configs
  email: emailConfig,
};

export const TOOLBAR_NODES = [
  // ... existing entries
  { type: 'email', label: 'Email', category: 'IO' },
];
```

That's it. The node auto-appears in the toolbar, renders correctly on the canvas, and its data is included in pipeline submissions. **No new component, no new JSX, no new CSS.**

---

## Backend — Graph Algorithm

**Endpoint:** `POST /pipelines/parse`

**Request body:**
```json
{
  "nodes": [{ "id": "customInput-1", ... }, ...],
  "edges": [{ "source": "customInput-1", "target": "llm-1", ... }, ...]
}
```

**Response:**
```json
{
  "num_nodes": 3,
  "num_edges": 2,
  "is_dag": true
}
```

### DAG Detection — Kahn's Algorithm

Kahn's Algorithm performs a BFS-based topological sort:

```
1. Build adjacency list and in-degree map from edges
2. Push all nodes with in-degree 0 into a queue
3. While the queue is not empty:
     pop a node → increment processed count
     for each neighbour → decrement its in-degree
     if in-degree reaches 0 → push to queue
4. If processed == total nodes → no cycle → is DAG = true
   Otherwise                  → cycle exists → is DAG = false
```

**Time complexity:** O(V + E)  
**Space complexity:** O(V + E)

Self-loops and edges referencing unknown nodes are silently skipped. An empty graph is considered a valid DAG.

---

## Installation

### Prerequisites

- Node.js 18+
- Python 3.10+
- pip

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
pip install fastapi uvicorn python-multipart
```

---

## Running the App

### 1. Start the backend

```bash
cd backend
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.  
You can verify it works by visiting `http://localhost:8000/` — it returns `{"status": "ok"}`.

### 2. Start the frontend

In a separate terminal:

```bash
cd frontend
npm start
```

The app opens at `http://localhost:3000`.

> Both must be running at the same time for **Run Pipeline** to work.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Z` | Undo last action |
| `Ctrl + Shift + Z` | Redo |
| `Delete` | Delete selected node or edge |
| `Scroll wheel` | Zoom in / out on canvas |
| `Click + drag` (canvas) | Pan the canvas |
| `Click + drag` (node) | Move a node |

---

## All Available Nodes

| Node | Category | Inputs | Outputs | Fields |
|---|---|---|---|---|
| **Input** | IO | — | Value | Name, Type (Text/File/Number/JSON) |
| **Output** | IO | Value | — | Name, Type (Text/Image/File/JSON) |
| **LLM** | AI | System, Prompt | Response | Model, Temperature |
| **Text** | Data | Dynamic (one per `{{var}}`) | Output | Content (auto-resizing textarea) |
| **API Request** | Data | Body | Response, Status | Method, URL, Headers |
| **Webhook** | IO | — | Payload, Headers | Path, Method, Max Retries |
| **Delay** | Utility | Trigger | Done | Duration, Unit |
| **Loop** | Logic | Items | Item, Done | Mode, Iterations |
| **Math** | Transform | A, B | Result | Operation |
| **Filter** | Logic | Input | True, False | Field, Operator, Value |

### Text Node — Variable System

Type `{{variable_name}}` anywhere in the content field. A new input handle appears on the left side of the node for every unique valid variable.

**Valid variables:**
```
{{name}}          ✅  creates handle "name"
{{user_input}}    ✅  creates handle "user_input"
{{apiResponse}}   ✅  creates handle "apiResponse"
```

**Invalid (no handle created):**
```
{{123}}           ❌  starts with a number
{{user-name}}     ❌  contains a hyphen
{{hello world}}   ❌  contains a space
```

---

## Pipeline Analysis Modal

Click **Run Pipeline** to submit the current graph to the backend. A modal appears showing:

| Field | Description |
|---|---|
| **Nodes** | Total number of nodes on the canvas |
| **Edges** | Total number of connections |
| **Graph type** | `DAG` (valid) or `Cyclic` (invalid) |
| **Status badge** | Green ✅ if DAG, Red ❌ if cyclic or error |

**Error states handled:**
- Empty canvas — prompts you to add a node first
- Backend unreachable — shows a friendly message with the expected URL
- Unexpected response shape — caught and displayed cleanly

---

## Dark Mode

The app reads your OS preference on first load. Click the **Light mode / Dark mode** button at the bottom of the sidebar to toggle. The preference is saved in `localStorage` and persists across sessions.

---

## Import & Export

### Export

Click **Export** in the sidebar. A file named `pipeline.json` is downloaded containing the full node and edge graph.

### Import

Click **Import** and select a previously exported `pipeline.json`. The canvas is replaced with the imported pipeline. The action is undoable (`Ctrl+Z`).

**Example pipeline.json shape:**
```json
{
  "nodes": [
    { "id": "customInput-1", "type": "customInput", "position": { "x": 100, "y": 200 }, "data": { ... } }
  ],
  "edges": [
    { "id": "xy-edge...", "source": "customInput-1", "target": "llm-1", "sourceHandle": "...", "targetHandle": "..." }
  ]
}
```

---

## Trade-offs

| Decision | Chosen | Alternative | Why |
|---|---|---|---|
| Node abstraction | Config objects + BaseNode | Separate component per node | Config approach means 0 duplication, 1 renderer to maintain |
| State management | Zustand | Redux / Context API | Zustand is minimal, no boilerplate, selector-based subscriptions prevent over-rendering |
| Styling | Tailwind CSS | CSS Modules / Styled Components | Co-located utilities, no class name collisions, tree-shakeable |
| Animation | Framer Motion (modal only) | CSS transitions everywhere | Framer adds ~30 kB; only used where spring physics add real value |
| Backend framework | FastAPI | Express / Flask | FastAPI has automatic OpenAPI docs, Pydantic validation, async support |
| DAG algorithm | Kahn's (BFS) | DFS cycle detection | Kahn's naturally produces a topological order as a side-effect, simpler to reason about |
| Dark mode | Tailwind `class` strategy | CSS custom properties | Tailwind's class strategy integrates directly with utility classes |

---

## Future Improvements

- **Node search** — fuzzy search the palette to find nodes by name
- **Context menu** — right-click a node for delete/duplicate/inspect
- **Connection validation** — restrict which handle types can connect to each other (e.g. text → text only)
- **Sub-pipelines** — collapse a group of nodes into a single reusable node
- **Live execution** — stream backend execution results back through WebSocket
- **Node comments** — sticky notes on the canvas
- **Auto-layout** — arrange nodes with Dagre/ELK layout engine
- **Minimap drag** — pan the canvas by dragging in the minimap
- **Multi-select** — Shift+click or lasso to select and move multiple nodes
- **Backend persistence** — save pipelines to a database instead of JSON files
- **TypeScript migration** — add static types to configs, hooks, and store for safer refactoring
