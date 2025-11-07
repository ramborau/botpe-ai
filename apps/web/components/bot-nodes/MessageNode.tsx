import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MessageNodeData {
  label: string;
  message?: string;
  nodeType: string;
}

function MessageNode({ data, selected }: NodeProps<MessageNodeData>) {
  return (
    <Card
      className={`min-w-[200px] ${
        selected ? "ring-2 ring-blue-500" : ""
      } shadow-md`}
    >
      <CardContent className="p-3">
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-blue-500"
        />
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div className="font-medium text-sm text-gray-900">{data.label}</div>
        </div>
        {data.message && (
          <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded border border-gray-200">
            {data.message}
          </div>
        )}
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-blue-500"
        />
      </CardContent>
    </Card>
  );
}

export default memo(MessageNode);
