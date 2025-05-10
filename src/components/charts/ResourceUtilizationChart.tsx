
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResourceUtilizationChartProps {
  data: {
    cpu: any[];
    memory: any[];
  };
}

const ResourceUtilizationChart = ({ data }: ResourceUtilizationChartProps) => {
  const [resourceType, setResourceType] = useState("cpu");
  
  return (
    <div className="h-full flex flex-col">
      <Tabs value={resourceType} onValueChange={setResourceType} className="w-[200px] self-end mb-2">
        <TabsList>
          <TabsTrigger value="cpu">CPU</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={resourceType === "cpu" ? data.cpu : data.memory}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: `${resourceType.toUpperCase()} Utilization %`, angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar name="Bin Packing" dataKey="binPacking" fill="#8884d8" />
          <Bar name="DRF" dataKey="drf" fill="#82ca9d" />
          <Bar name="FUSE" dataKey="fuse" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResourceUtilizationChart;
