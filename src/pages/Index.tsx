
import { useState } from "react";
import SimulationDashboard from "@/components/SimulationDashboard";
import AlgorithmComparison from "@/components/AlgorithmComparison";
import ScenarioSelector from "@/components/ScenarioSelector";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [selectedTab, setSelectedTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Container Scheduling Algorithm Simulator</h1>
          <p className="mt-2 text-gray-600">
            Compare Bin Packing, DRF, and FUSE algorithms across different scenarios
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <ScenarioSelector disabled={isSimulationRunning} />
          
          <Button
            onClick={() => setIsSimulationRunning(!isSimulationRunning)}
            className={`${
              isSimulationRunning ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
            } text-white px-6 py-2`}
          >
            {isSimulationRunning ? "Stop Simulation" : "Run Simulation"}
          </Button>
        </div>

        <Tabs defaultValue="dashboard" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="comparison">Algorithm Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <SimulationDashboard isRunning={isSimulationRunning} />
          </TabsContent>
          
          <TabsContent value="comparison">
            <AlgorithmComparison />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Container Scheduling Algorithm Simulator &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
