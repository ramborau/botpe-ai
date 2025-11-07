"use client";

import { Node } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PropertyPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  onClose: () => void;
}

export default function PropertyPanel({
  selectedNode,
  onUpdateNode,
  onClose,
}: PropertyPanelProps) {
  if (!selectedNode) return null;

  const nodeType = selectedNode.data?.nodeType || selectedNode.type;

  const handleUpdate = (field: string, value: any) => {
    onUpdateNode(selectedNode.id, {
      ...selectedNode.data,
      [field]: value,
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Node Configuration</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Common Fields */}
        <div>
          <Label htmlFor="node-label">Label</Label>
          <Input
            id="node-label"
            value={selectedNode.data?.label || ""}
            onChange={(e) => handleUpdate("label", e.target.value)}
            placeholder="Node label"
            className="mt-1"
          />
        </div>

        {/* Message Node Configuration */}
        {nodeType === "message" && (
          <>
            <div>
              <Label htmlFor="message-text">Message Text</Label>
              <Textarea
                id="message-text"
                value={selectedNode.data?.message || ""}
                onChange={(e) => handleUpdate("message", e.target.value)}
                placeholder="Enter your message..."
                rows={5}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use variables with {"{"}variable_name{"}"} syntax
              </p>
            </div>

            <div>
              <Label htmlFor="message-delay">Delay (seconds)</Label>
              <Input
                id="message-delay"
                type="number"
                value={selectedNode.data?.delay || 0}
                onChange={(e) =>
                  handleUpdate("delay", parseInt(e.target.value) || 0)
                }
                placeholder="0"
                className="mt-1"
              />
            </div>
          </>
        )}

        {/* Condition Node Configuration */}
        {nodeType === "condition" && (
          <>
            <div>
              <Label htmlFor="condition-field">Field to Check</Label>
              <Input
                id="condition-field"
                value={selectedNode.data?.field || ""}
                onChange={(e) => handleUpdate("field", e.target.value)}
                placeholder="e.g., user_message"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="condition-operator">Operator</Label>
              <Select
                value={selectedNode.data?.operator || "equals"}
                onValueChange={(value) => handleUpdate("operator", value)}
              >
                <SelectTrigger id="condition-operator" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="starts_with">Starts With</SelectItem>
                  <SelectItem value="ends_with">Ends With</SelectItem>
                  <SelectItem value="regex">Regex Match</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="condition-value">Value</Label>
              <Input
                id="condition-value"
                value={selectedNode.data?.value || ""}
                onChange={(e) => handleUpdate("value", e.target.value)}
                placeholder="Value to compare"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="condition-text">Condition Description</Label>
              <Textarea
                id="condition-text"
                value={selectedNode.data?.condition || ""}
                onChange={(e) => handleUpdate("condition", e.target.value)}
                placeholder="Describe the condition..."
                rows={3}
                className="mt-1"
              />
            </div>
          </>
        )}

        {/* AI Node Configuration */}
        {nodeType === "ai" && (
          <>
            <div>
              <Label htmlFor="ai-prompt">AI Prompt</Label>
              <Textarea
                id="ai-prompt"
                value={selectedNode.data?.prompt || ""}
                onChange={(e) => handleUpdate("prompt", e.target.value)}
                placeholder="Enter the AI prompt template..."
                rows={5}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {"{"}conversation_history{"}"}, {"{"}user_message{"}"}, etc.
              </p>
            </div>

            <div>
              <Label htmlFor="ai-temperature">Temperature</Label>
              <Input
                id="ai-temperature"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={selectedNode.data?.temperature || 0.7}
                onChange={(e) =>
                  handleUpdate("temperature", parseFloat(e.target.value) || 0.7)
                }
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                0.3 for analytical, 0.7 for creative
              </p>
            </div>

            <div>
              <Label htmlFor="ai-max-tokens">Max Tokens</Label>
              <Input
                id="ai-max-tokens"
                type="number"
                value={selectedNode.data?.maxTokens || 1000}
                onChange={(e) =>
                  handleUpdate("maxTokens", parseInt(e.target.value) || 1000)
                }
                className="mt-1"
              />
            </div>
          </>
        )}

        {/* API Node Configuration */}
        {nodeType === "api" && (
          <>
            <div>
              <Label htmlFor="api-method">HTTP Method</Label>
              <Select
                value={selectedNode.data?.method || "GET"}
                onValueChange={(value) => handleUpdate("method", value)}
              >
                <SelectTrigger id="api-method" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="api-url">API URL</Label>
              <Input
                id="api-url"
                value={selectedNode.data?.url || ""}
                onChange={(e) => handleUpdate("url", e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="api-headers">Headers (JSON)</Label>
              <Textarea
                id="api-headers"
                value={selectedNode.data?.headers || "{}"}
                onChange={(e) => handleUpdate("headers", e.target.value)}
                placeholder='{"Authorization": "Bearer token"}'
                rows={3}
                className="mt-1 font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="api-body">Request Body (JSON)</Label>
              <Textarea
                id="api-body"
                value={selectedNode.data?.body || ""}
                onChange={(e) => handleUpdate("body", e.target.value)}
                placeholder='{"key": "value"}'
                rows={3}
                className="mt-1 font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="api-response-var">Save Response To Variable</Label>
              <Input
                id="api-response-var"
                value={selectedNode.data?.responseVariable || ""}
                onChange={(e) =>
                  handleUpdate("responseVariable", e.target.value)
                }
                placeholder="api_response"
                className="mt-1"
              />
            </div>
          </>
        )}

        {/* Action Node Configuration */}
        {nodeType === "action" && (
          <>
            <div>
              <Label htmlFor="action-type">Action Type</Label>
              <Select
                value={selectedNode.data?.actionType || "set_variable"}
                onValueChange={(value) => handleUpdate("actionType", value)}
              >
                <SelectTrigger id="action-type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="set_variable">Set Variable</SelectItem>
                  <SelectItem value="add_tag">Add Tag</SelectItem>
                  <SelectItem value="remove_tag">Remove Tag</SelectItem>
                  <SelectItem value="assign_agent">Assign to Agent</SelectItem>
                  <SelectItem value="escalate">Escalate to Human</SelectItem>
                  <SelectItem value="end_conversation">
                    End Conversation
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="action-description">Action Description</Label>
              <Textarea
                id="action-description"
                value={selectedNode.data?.action || ""}
                onChange={(e) => handleUpdate("action", e.target.value)}
                placeholder="Describe what this action does..."
                rows={3}
                className="mt-1"
              />
            </div>

            {selectedNode.data?.actionType === "set_variable" && (
              <>
                <div>
                  <Label htmlFor="action-var-name">Variable Name</Label>
                  <Input
                    id="action-var-name"
                    value={selectedNode.data?.variableName || ""}
                    onChange={(e) =>
                      handleUpdate("variableName", e.target.value)
                    }
                    placeholder="variable_name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="action-var-value">Variable Value</Label>
                  <Input
                    id="action-var-value"
                    value={selectedNode.data?.variableValue || ""}
                    onChange={(e) =>
                      handleUpdate("variableValue", e.target.value)
                    }
                    placeholder="value"
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {(selectedNode.data?.actionType === "add_tag" ||
              selectedNode.data?.actionType === "remove_tag") && (
              <div>
                <Label htmlFor="action-tag">Tag Name</Label>
                <Input
                  id="action-tag"
                  value={selectedNode.data?.tagName || ""}
                  onChange={(e) => handleUpdate("tagName", e.target.value)}
                  placeholder="tag_name"
                  className="mt-1"
                />
              </div>
            )}
          </>
        )}

        {/* Node ID (Read-only) */}
        <div className="pt-4 border-t border-gray-200">
          <Label className="text-xs text-gray-500">Node ID</Label>
          <p className="text-xs font-mono text-gray-600 mt-1">
            {selectedNode.id}
          </p>
        </div>
      </div>
    </div>
  );
}
