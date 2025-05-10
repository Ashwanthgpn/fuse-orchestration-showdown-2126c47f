
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { scenarios } from "@/lib/scenarios";

interface ScenarioSelectorProps {
  disabled?: boolean;
}

const ScenarioSelector = ({ disabled }: ScenarioSelectorProps) => {
  const [selectedScenario, setSelectedScenario] = useState("scenario1");
  const scenario = scenarios[selectedScenario];

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-4">
        <Select
          disabled={disabled}
          value={selectedScenario}
          onValueChange={setSelectedScenario}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a scenario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scenario1">Scenario 1: High Resource Demand</SelectItem>
            <SelectItem value="scenario2">Scenario 2: Low Resource Demand</SelectItem>
            <SelectItem value="scenario3">Scenario 3: Mixed Workload</SelectItem>
            <SelectItem value="scenario4">Scenario 4: High Scheduling Load</SelectItem>
            <SelectItem value="scenario5">Scenario 5: Stress Test</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{scenario.name}</CardTitle>
          <CardDescription>{scenario.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Containers</p>
              <p className="text-2xl font-bold">{scenario.containerCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nodes</p>
              <p className="text-2xl font-bold">{scenario.nodeCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">CPU Distribution</p>
              <p className="text-lg">{scenario.cpuDistribution}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Memory Distribution</p>
              <p className="text-lg">{scenario.memoryDistribution}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioSelector;
