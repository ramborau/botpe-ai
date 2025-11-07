"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  GitBranch,
  Bot,
  Globe,
  Zap,
  Save,
  Play,
  ArrowLeft,
} from "lucide-react";
import {
  MessageNode,
  ConditionNode,
  AINode,
  APINode,
  ActionNode,
} from "@/components/bot-nodes";
import PropertyPanel from "@/components/bot-builder/PropertyPanel";

interface BotData {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  nodes: any[];
  edges: any[];
}

const nodeTypes = [
  {
    type: "message",
    label: "Message",
    icon: MessageSquare,
    color: "bg-blue-500",
    description: "Send a text message",
  },
  {
    type: "condition",
    label: "Condition",
    icon: GitBranch,
    color: "bg-purple-500",
    description: "Branch based on conditions",
  },
  {
    type: "ai",
    label: "AI Response",
    icon: Bot,
    color: "bg-green-500",
    description: "Generate AI-powered response",
  },
  {
    type: "api",
    label: "API Call",
    icon: Globe,
    color: "bg-orange-500",
    description: "Make external API request",
  },
  {
    type: "action",
    label: "Action",
    icon: Zap,
    color: "bg-red-500",
    description: "Perform an action",
  },
];

// Custom node types configuration for ReactFlow
const customNodeTypes = {
  message: MessageNode,
  condition: ConditionNode,
  ai: AINode,
  api: APINode,
  action: ActionNode,
};

export default function BotEditorPage() {
  const params = useParams();
  const router = useRouter();
  const botId = params.id as string;

  const [bot, setBot] = useState<BotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    fetchBot();
  }, [botId]);

  const fetchBot = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bots/${botId}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const botData = data.data;
        setBot(botData);

        // Load nodes and edges from bot data
        if (botData.nodes && botData.nodes.length > 0) {
          setNodes(botData.nodes);
        } else {
          // Initialize with a start node
          setNodes([
            {
              id: "start",
              type: "input",
              data: { label: "Start" },
              position: { x: 250, y: 50 },
              style: {
                background: "#00c307",
                color: "white",
                border: "2px solid #00a006",
                borderRadius: "8px",
                padding: "10px",
                fontSize: "14px",
                fontWeight: "600",
              },
            },
          ]);
        }

        if (botData.edges && botData.edges.length > 0) {
          setEdges(botData.edges);
        }
      }
    } catch (error) {
      console.error("Failed to fetch bot:", error);
    } finally {
      setLoading(false);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 25,
      };

      const nodeConfig = nodeTypes.find((n) => n.type === type);
      if (!nodeConfig) return;

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: type,
        position,
        data: {
          label: `${nodeConfig.label}`,
          nodeType: type,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bots/${botId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            nodes,
            edges,
          }),
        }
      );

      if (response.ok) {
        console.log("Bot saved successfully");
      }
    } catch (error) {
      console.error("Failed to save bot:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = () => {
    console.log("Testing bot...");
    // TODO: Implement bot testing
  };

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handleUpdateNode = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data };
          }
          return node;
        })
      );
      // Update selected node to reflect changes
      setSelectedNode((prevNode) => {
        if (prevNode && prevNode.id === nodeId) {
          return { ...prevNode, data };
        }
        return prevNode;
      });
    },
    [setNodes]
  );

  const handleClosePropertyPanel = useCallback(() => {
    setSelectedNode(null);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading bot...</div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Bot not found</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Node Palette Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/bots")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bots
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">{bot.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{bot.description}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Drag & Drop Nodes
          </h3>
          {nodeTypes.map((nodeType) => (
            <Card
              key={nodeType.type}
              draggable
              onDragStart={(e) => onDragStart(e, nodeType.type)}
              className="cursor-move hover:shadow-md transition-shadow"
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 ${nodeType.color} rounded-md flex items-center justify-center`}
                  >
                    <nodeType.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {nodeType.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {nodeType.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div className="flex-1 relative flex">
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={customNodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.id === "start") return "#00c307";
              if (node.data?.nodeType === "message") return "#3b82f6";
              if (node.data?.nodeType === "condition") return "#a855f7";
              if (node.data?.nodeType === "ai") return "#00c307";
              if (node.data?.nodeType === "api") return "#f97316";
              if (node.data?.nodeType === "action") return "#ef4444";
              return "#6b7280";
            }}
            style={{
              backgroundColor: "#f9fafb",
            }}
          />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Panel position="top-right" className="flex gap-2">
            <Button onClick={handleTest} variant="outline" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#00c307] hover:bg-[#00a006] text-white"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </Panel>
        </ReactFlow>
        </div>

        {/* Property Panel */}
        {selectedNode && (
          <PropertyPanel
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            onClose={handleClosePropertyPanel}
          />
        )}
      </div>
    </div>
  );
}
