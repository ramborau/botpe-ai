import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface APINodeData {
  label: string;
  url?: string;
  method?: string;
  nodeType: string;
}

function APINode({ data, selected }: NodeProps<APINodeData>) {
  return (
    <Card
      className={`min-w-[200px] ${
        selected ? "ring-2 ring-orange-500" : ""
      } shadow-md`}
    >
      <CardContent className="p-3">
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-orange-500"
        />
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div className="font-medium text-sm text-gray-900">{data.label}</div>
        </div>
        {data.url && (
          <div className="text-xs text-gray-600 mt-2 space-y-1">
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              <span className="font-medium">{data.method || "GET"}</span>{" "}
              {data.url}
            </div>
          </div>
        )}
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-orange-500"
        />
      </CardContent>
    </Card>
  );
}

export default memo(APINode);
