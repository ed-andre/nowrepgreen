"use client";

import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";

import {
  ReactFlow,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  Handle,
} from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface ClientDataPipelineDiagramProps {
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
    <div className="px-4 py-3 shadow-md rounded-md border-2 border-amber-200 bg-amber-50 text-amber-700 w-[200px] relative">
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!bg-amber-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!bg-amber-500"
      />
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
      <Handle type="target" position={Position.Left} id="left" className="!bg-emerald-500" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-emerald-500" />
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

export default function ClientDataPipelineDiagram({
  className = "",
}: ClientDataPipelineDiagramProps) {
  // Define initial nodes
  const initialNodes = useMemo<Node[]>(
    () => [
      {
        id: "nowrep-blue-postgres",
        type: "source",
        data: {
          label: "NowRepBlue PostgreSQL",
          description: "Source database with agency data",
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
        position: { x: 0, y: 150 },
        sourcePosition: Position.Right,
      },
      {
        id: "airflow-dags",
        type: "process",
        data: {
          label: "Airflow DAGs",
          description: "Data orchestration and scheduling",
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
              <path d="M12 2v20M2 12h20"></path>
              <path d="M12 2a10 10 0 0 1 10 10"></path>
            </svg>
          ),
        },
        position: { x: 250, y: 150 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "raw-data-load",
        type: "process",
        data: {
          label: "Raw Data Load",
          description: "Initial data ingestion to BigQuery",
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
        position: { x: 500, y: 150 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "dbt-transforms",
        type: "process",
        data: {
          label: "dbt Transforms",
          description: "Data transformation and modeling",
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
        position: { x: 750, y: 150 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "bigquery-warehouse",
        type: "process",
        data: {
          label: "BigQuery Warehouse",
          description: "Transformed data for analytics",
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
        position: { x: 1000, y: 150 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "evidence-dev",
        type: "target",
        data: {
          label: "Evidence.dev",
          description: "Embedded analytics reports",
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
        position: { x: 1250, y: 50 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "metabase",
        type: "target",
        data: {
          label: "Metabase",
          description: "Advanced analytics dashboard",
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
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          ),
        },
        position: { x: 1250, y: 250 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
    ],
    [Position.Right, Position.Left],
  );

  // Define initial edges
  const initialEdges = useMemo<Edge[]>(
    () => [
      {
        id: "postgres-to-airflow",
        source: "nowrep-blue-postgres",
        target: "airflow-dags",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "airflow-to-raw-load",
        source: "airflow-dags",
        target: "raw-data-load",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "raw-load-to-dbt",
        source: "raw-data-load",
        target: "dbt-transforms",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "dbt-to-bigquery",
        source: "dbt-transforms",
        target: "bigquery-warehouse",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "bigquery-to-evidence",
        source: "bigquery-warehouse",
        target: "evidence-dev",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#94a3b8" },
      },
      {
        id: "bigquery-to-metabase",
        source: "bigquery-warehouse",
        target: "metabase",
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        type: "smoothstep",
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
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}