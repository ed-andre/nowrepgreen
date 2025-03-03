"use client";

import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";

import { ReactFlow , Controls , Background , Panel , useNodesState , useEdgesState , Position , MarkerType , Handle } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface ClientReactFlowDiagramProps {
  className?: string;
}

interface NodeData {
  label: string;
  description?: string;
  icon?: ReactNode;
}

// Custom node components
const nodeTypes = {
  source: ({ data }: any) => (
    <div className="px-4 py-3 shadow-md rounded-md border-2 border-blue-200 bg-blue-50 text-blue-700 w-[200px]">
      <Handle type="source" position={Position.Right} id="right" />
      <div className="flex items-center gap-2 mb-1">
        {data.icon && <div className="flex-shrink-0">{data.icon}</div>}
        <div className="font-semibold">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs opacity-80">{data.description}</div>
      )}
    </div>
  ),
  process: ({ data }: any) => (
    <div className="px-4 py-3 shadow-md rounded-md border-2 border-amber-200 bg-amber-50 text-amber-700 w-[200px]">
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <div className="flex items-center gap-2 mb-1">
        {data.icon && <div className="flex-shrink-0">{data.icon}</div>}
        <div className="font-semibold">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs opacity-80">{data.description}</div>
      )}
    </div>
  ),
  target: ({ data }: any) => (
    <div className="px-4 py-3 shadow-md rounded-md border-2 border-emerald-200 bg-emerald-50 text-emerald-700 w-[200px]">
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <div className="flex items-center gap-2 mb-1">
        {data.icon && <div className="flex-shrink-0">{data.icon}</div>}
        <div className="font-semibold">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs opacity-80">{data.description}</div>
      )}
    </div>
  ),
  validation: ({ data }: any) => (
    <div className="px-4 py-3 shadow-md rounded-md border-2 border-purple-200 bg-purple-50 text-purple-700 w-[200px]">
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <div className="flex items-center gap-2 mb-1">
        {data.icon && <div className="flex-shrink-0">{data.icon}</div>}
        <div className="font-semibold">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs opacity-80">{data.description}</div>
      )}
    </div>
  ),
};

export default function ClientReactFlowDiagram({
  className = "",
}: ClientReactFlowDiagramProps) {
  // Define initial nodes
  const initialNodes = useMemo<Node[]>(
    () => [
      {
        id: "nowrep-blue-api",
        type: "source",
        data: {
          label: "NowRepBlue API",
          description: "Source of truth for all agency data",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ),
        },
        position: { x: 0, y: 150 },
        sourcePosition: Position.Right,
      },
      {
        id: "validation-check",
        type: "validation",
        data: {
          label: "Boards Data Validation",
          description: "Validates if boards data exists",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ),
        },
        position: { x: 250, y: 150 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "empty-data-handler",
        type: "process",
        data: {
          label: "Empty Data Handler",
          description: "Creates empty tables when no data exists",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
            </svg>
          ),
        },
        position: { x: 250, y: 250 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "orchestration-api",
        type: "process",
        data: {
          label: "Orchestration API",
          description: "Coordinates the sync process",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          ),
        },
        position: { x: 500, y: 100 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "trigger-dev-tasks",
        type: "process",
        data: {
          label: "Trigger.dev Tasks",
          description: "Event-driven automation",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          ),
        },
        position: { x: 750, y: 100 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "sync-task",
        type: "process",
        data: {
          label: "Sync API Task",
          description: "Fetches data from source API",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          ),
        },
        position: { x: 750, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "json-stage-tables",
        type: "process",
        data: {
          label: "JSON Stage Tables",
          description: "Raw data storage",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
          ),
        },
        position: { x: 1000, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "transform-task",
        type: "process",
        data: {
          label: "Transform API Task",
          description: "Transforms JSON to relational data",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v12"></path>
              <path d="m8 11 4 4 4-4"></path>
              <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"></path>
            </svg>
          ),
        },
        position: { x: 750, y: 200 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "versioned-tables",
        type: "target",
        data: {
          label: "Versioned Tables",
          description: "Normalized relational data",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18"></path>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
            </svg>
          ),
        },
        position: { x: 1000, y: 200 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "current-views",
        type: "target",
        data: {
          label: "Current Views",
          description: "Dynamic view switching for zero-downtime",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          ),
        },
        position: { x: 1250, y: 150 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "nowrep-green-app",
        type: "target",
        data: {
          label: "NowRepGreen App",
          description: "Public-facing portfolio site",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
            </svg>
          ),
        },
        position: { x: 1500, y: 150 },
        targetPosition: Position.Left,
      },
    ],
    [Position.Right, Position.Left],
  );

  // Define initial edges
  const initialEdges = useMemo<Edge[]>(
    () => [
      {
        id: "nowrep-blue-api-to-validation-check",
        source: "nowrep-blue-api",
        target: "validation-check",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "validation-check-to-orchestration-api",
        source: "validation-check",
        target: "orchestration-api",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        label: "Data exists",
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: "#f1f5f9", fillOpacity: 0.7 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "validation-check-to-empty-data-handler",
        source: "validation-check",
        target: "empty-data-handler",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        label: "No data",
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: "#f1f5f9", fillOpacity: 0.7 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "empty-data-handler-to-versioned-tables",
        source: "empty-data-handler",
        target: "versioned-tables",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "orchestration-api-to-trigger-dev-tasks",
        source: "orchestration-api",
        target: "trigger-dev-tasks",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "trigger-dev-tasks-to-sync-task",
        source: "trigger-dev-tasks",
        target: "sync-task",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "sync-task-to-json-stage-tables",
        source: "sync-task",
        target: "json-stage-tables",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "trigger-dev-tasks-to-transform-task",
        source: "trigger-dev-tasks",
        target: "transform-task",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "json-stage-tables-to-transform-task",
        source: "json-stage-tables",
        target: "transform-task",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "transform-task-to-versioned-tables",
        source: "transform-task",
        target: "versioned-tables",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "versioned-tables-to-current-views",
        source: "versioned-tables",
        target: "current-views",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "current-views-to-nowrep-green-app",
        source: "current-views",
        target: "nowrep-green-app",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
    ],
    [MarkerType.ArrowClosed],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className={`${className}`}>
      <div
        style={{ height: 600 }}
        className="border border-gray-200 rounded-lg overflow-hidden"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          defaultEdgeOptions={{ type: "smoothstep" }}
        >
          <Controls />
          <Background color="#f8fafc" gap={16} />
          <Panel
            position="top-left"
            className="bg-white p-2 rounded shadow-sm border border-gray-100"
          >
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-sm"></div>
                <span className="text-gray-600">Source</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-sm"></div>
                <span className="text-gray-600">Process</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-sm"></div>
                <span className="text-gray-600">Target</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded-sm"></div>
                <span className="text-gray-600">Validation</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
