
import { useState } from "react";
import SimulationDashboard from "@/components/SimulationDashboard";
import AlgorithmComparison from "@/components/AlgorithmComparison";
import AlgorithmComparisonDetail from "@/components/AlgorithmComparisonDetail";
import ScenarioSelector from "@/components/ScenarioSelector";
import AdvancedScenarioConfig from "@/components/AdvancedScenarioConfig";
import ExportResearch from "@/components/ExportResearch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { runSimulation } from "@/lib/simulator";
import { ScenarioConfig } from "@/lib/types";

const Index = () => {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [useAdvancedConfig, setUseAdvancedConfig] = useState(false);
  
  const runSimulationHandler = () => {
    if (isSimulationRunning) {
      setIsSimulationRunning(false);
      return;
    }
    
    setIsSimulationRunning(true);
    setTimeout(() => {
      const results = runSimulation();
      setSimulationResults(results);
      setIsSimulationRunning(false);
    }, 10000); // Simulate a 10 second run
  };
  
  const handleConfigUpdate = (config: ScenarioConfig) => {
    // In a real implementation, this would update the simulation parameters
    console.log("Updated scenario config:", config);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Container Scheduling Algorithm Simulator</h1>
          <p className="mt-2 opacity-90">
            A novel approach to comparing Bin Packing, DRF, and FUSE scheduling algorithms
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2">
            {useAdvancedConfig ? (
              <AdvancedScenarioConfig 
                onConfigUpdate={handleConfigUpdate} 
                disabled={isSimulationRunning} 
              />
            ) : (
              <ScenarioSelector disabled={isSimulationRunning} />
            )}
          </div>
          
          <div className="flex flex-col space-y-4">
            <Button
              onClick={runSimulationHandler}
              className={`${
                isSimulationRunning ? "bg-red-500 hover:bg-red-600" : "bg-amber-600 hover:bg-amber-700"
              } text-white px-6 py-6 text-lg h-auto`}
              disabled={isSimulationRunning}
            >
              {isSimulationRunning ? "Simulation in Progress..." : "Run Simulation"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setUseAdvancedConfig(!useAdvancedConfig)}
              disabled={isSimulationRunning}
            >
              {useAdvancedConfig ? "Use Simple Configuration" : "Use Advanced Configuration"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="comparison">Algorithm Comparison</TabsTrigger>
            <TabsTrigger value="details">Algorithm Details</TabsTrigger>
            {simulationResults && <TabsTrigger value="export">Export Research</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="dashboard">
            <SimulationDashboard isRunning={isSimulationRunning} />
          </TabsContent>
          
          <TabsContent value="comparison">
            <AlgorithmComparison />
          </TabsContent>
          
          <TabsContent value="details">
            <AlgorithmComparisonDetail />
          </TabsContent>
          
          <TabsContent value="export">
            <ExportResearch simulationResults={simulationResults} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">Container Scheduling Algorithm Simulator &copy; 2025</p>
          <p className="text-sm text-gray-500">A novel research project for journal publication</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
