import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { GitBranch } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ConditionNodeData {
  label: string;
  condition?: string;
  nodeType: string;
}

function ConditionNode({ data, selected }: NodeProps<ConditionNodeData>) {
  return (
    <Card
      className={`min-w-[200px] ${
        selected ? "ring-2 ring-purple-500" : ""
      } shadow-md`}
    >
      <CardContent className="p-3">
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-purple-500"
        />
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-white" />
          </div>
          <div className="font-medium text-sm text-gray-900">{data.label}</div>
        </div>
        {data.condition && (
          <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded border border-gray-200">
            {data.condition}
          </div>
        )}
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          className="w-3 h-3 !bg-green-500"
          style={{ left: "30%" }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="w-3 h-3 !bg-red-500"
          style={{ left: "70%" }}
        />
      </CardContent>
    </Card>
  );
}

export default memo(ConditionNode);
