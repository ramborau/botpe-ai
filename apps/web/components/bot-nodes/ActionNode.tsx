import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ActionNodeData {
  label: string;
  action?: string;
  nodeType: string;
}

function ActionNode({ data, selected }: NodeProps<ActionNodeData>) {
  return (
    <Card
      className={`min-w-[200px] ${
        selected ? "ring-2 ring-red-500" : ""
      } shadow-md`}
    >
      <CardContent className="p-3">
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-red-500"
        />
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="font-medium text-sm text-gray-900">{data.label}</div>
        </div>
        {data.action && (
          <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded border border-gray-200">
            {data.action}
          </div>
        )}
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-red-500"
        />
      </CardContent>
    </Card>
  );
}

export default memo(ActionNode);
