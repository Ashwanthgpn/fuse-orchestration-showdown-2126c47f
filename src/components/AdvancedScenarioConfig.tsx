
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface ScenarioConfig {
  name: string;
  containerCount: number;
  nodeCount: number;
  cpuDistribution: string;
  memoryDistribution: string;
  prioritizationType: string;
  heterogeneousNodes: boolean;
  nodeFailureRate: number;
  containerEvictionRate: number;
}

interface AdvancedScenarioConfigProps {
  onConfigUpdate: (config: ScenarioConfig) => void;
  disabled?: boolean;
}

const AdvancedScenarioConfig = ({ onConfigUpdate, disabled = false }: AdvancedScenarioConfigProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const [config, setConfig] = useState<ScenarioConfig>({
    name: "Custom Scenario",
    containerCount: 100,
    nodeCount: 10,
    cpuDistribution: "mixed",
    memoryDistribution: "mixed",
    prioritizationType: "default",
    heterogeneousNodes: false,
    nodeFailureRate: 0,
    containerEvictionRate: 0
  });
  
  const handleChange = (field: keyof ScenarioConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = () => {
    onConfigUpdate(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Scenario Configuration</CardTitle>
        <CardDescription>Customize parameters for a scientific evaluation</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" disabled={disabled}>Basic</TabsTrigger>
            <TabsTrigger value="resource" disabled={disabled}>Resources</TabsTrigger>
            <TabsTrigger value="advanced" disabled={disabled}>Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="py-4 space-y-6">
            <div>
              <Label htmlFor="scenario-name">Scenario Name</Label>
              <Input 
                id="scenario-name" 
                value={config.name} 
                onChange={e => handleChange("name", e.target.value)}
                disabled={disabled}
                className="mt-1"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <Label htmlFor="container-count">Container Count: {config.containerCount}</Label>
              </div>
              <Slider 
                id="container-count"
                min={10} 
                max={500} 
                step={10} 
                value={[config.containerCount]} 
                onValueChange={values => handleChange("containerCount", values[0])}
                disabled={disabled}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <Label htmlFor="node-count">Node Count: {config.nodeCount}</Label>
              </div>
              <Slider 
                id="node-count"
                min={1} 
                max={50} 
                step={1} 
                value={[config.nodeCount]} 
                onValueChange={values => handleChange("nodeCount", values[0])}
                disabled={disabled}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="resource" className="py-4 space-y-6">
            <div>
              <Label htmlFor="cpu-distribution" className="block mb-2">CPU Resource Distribution</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={config.cpuDistribution === "low" ? "default" : "outline"} 
                  onClick={() => handleChange("cpuDistribution", "low")}
                  disabled={disabled}
                  className="w-full"
                >
                  Low
                </Button>
                <Button 
                  variant={config.cpuDistribution === "mixed" ? "default" : "outline"} 
                  onClick={() => handleChange("cpuDistribution", "mixed")}
                  disabled={disabled}
                  className="w-full"
                >
                  Mixed
                </Button>
                <Button 
                  variant={config.cpuDistribution === "high" ? "default" : "outline"} 
                  onClick={() => handleChange("cpuDistribution", "high")}
                  disabled={disabled}
                  className="w-full"
                >
                  High
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="memory-distribution" className="block mb-2">Memory Resource Distribution</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={config.memoryDistribution === "low" ? "default" : "outline"} 
                  onClick={() => handleChange("memoryDistribution", "low")}
                  disabled={disabled}
                  className="w-full"
                >
                  Low
                </Button>
                <Button 
                  variant={config.memoryDistribution === "mixed" ? "default" : "outline"} 
                  onClick={() => handleChange("memoryDistribution", "mixed")}
                  disabled={disabled}
                  className="w-full"
                >
                  Mixed
                </Button>
                <Button 
                  variant={config.memoryDistribution === "high" ? "default" : "outline"} 
                  onClick={() => handleChange("memoryDistribution", "high")}
                  disabled={disabled}
                  className="w-full"
                >
                  High
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="prioritization" className="block mb-2">Prioritization Type</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={config.prioritizationType === "default" ? "default" : "outline"} 
                  onClick={() => handleChange("prioritizationType", "default")}
                  disabled={disabled}
                  className="w-full"
                >
                  Default
                </Button>
                <Button 
                  variant={config.prioritizationType === "random" ? "default" : "outline"} 
                  onClick={() => handleChange("prioritizationType", "random")}
                  disabled={disabled}
                  className="w-full"
                >
                  Random
                </Button>
                <Button 
                  variant={config.prioritizationType === "weighted" ? "default" : "outline"} 
                  onClick={() => handleChange("prioritizationType", "weighted")}
                  disabled={disabled}
                  className="w-full"
                >
                  Weighted
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="py-4">
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between items-center rounded-md border p-4">
                  <span>Advanced Research Parameters</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? "transform rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-6 px-4 pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="heterogeneous-nodes">Heterogeneous Nodes</Label>
                    <p className="text-sm text-gray-500">Enable nodes with varied resource capacities</p>
                  </div>
                  <Switch 
                    id="heterogeneous-nodes"
                    checked={config.heterogeneousNodes} 
                    onCheckedChange={checked => handleChange("heterogeneousNodes", checked)}
                    disabled={disabled}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <Label htmlFor="node-failure">Node Failure Rate: {config.nodeFailureRate}%</Label>
                  </div>
                  <Slider 
                    id="node-failure"
                    min={0} 
                    max={15} 
                    step={1} 
                    value={[config.nodeFailureRate]} 
                    onValueChange={values => handleChange("nodeFailureRate", values[0])}
                    disabled={disabled}
                  />
                  <p className="text-sm text-gray-500 mt-1">Simulates node failures during execution</p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <Label htmlFor="eviction-rate">Container Eviction Rate: {config.containerEvictionRate}%</Label>
                  </div>
                  <Slider 
                    id="eviction-rate"
                    min={0} 
                    max={20} 
                    step={1} 
                    value={[config.containerEvictionRate]} 
                    onValueChange={values => handleChange("containerEvictionRate", values[0])}
                    disabled={disabled}
                  />
                  <p className="text-sm text-gray-500 mt-1">Simulates container evictions during execution</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 flex justify-end">
        <Button onClick={handleSave} disabled={disabled}>Apply Configuration</Button>
      </CardFooter>
    </Card>
  );
};

export default AdvancedScenarioConfig;
