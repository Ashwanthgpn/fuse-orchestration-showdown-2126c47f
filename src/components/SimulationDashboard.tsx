
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResourceUtilizationChart from "@/components/charts/ResourceUtilizationChart";
import SchedulingTimeChart from "@/components/charts/SchedulingTimeChart";
import MakespanChart from "@/components/charts/MakespanChart";
import EnergyConsumptionChart from "@/components/charts/EnergyConsumptionChart";
import ScientificAnalysis from "@/components/ScientificAnalysis";
import { runSimulation } from "@/lib/simulator";
import { toast } from "@/components/ui/use-toast";

interface SimulationDashboardProps {
  isRunning: boolean;
}

const SimulationDashboard = ({ isRunning }: SimulationDashboardProps) => {
  const [progress, setProgress] = useState(0);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [simulationStep, setSimulationStep] = useState("initializing");
  const [viewMode, setViewMode] = useState<"charts" | "analysis">("charts");

  // Run the simulation immediately when dashboard mounts to show some results
  useEffect(() => {
    if (!simulationResults) {
      try {
        const initialResults = runSimulation();
        setSimulationResults(initialResults);
        console.log("Initial simulation results loaded:", initialResults);
      } catch (error) {
        console.error("Error loading initial results:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 2; // Make it faster
        setProgress(currentProgress);

        // Simulate different steps of the simulation process
        if (currentProgress === 20) {
          setSimulationStep("running_bin_packing");
        } else if (currentProgress === 40) {
          setSimulationStep("running_drf");
        } else if (currentProgress === 60) {
          setSimulationStep("running_fuse");
        } else if (currentProgress === 80) {
          setSimulationStep("analyzing_results");
        }

        if (currentProgress >= 100) {
          clearInterval(interval);
          try {
            const results = runSimulation();
            console.log("New simulation results:", results);
            setSimulationResults(results);
            setSimulationStep("complete");
            toast({
              title: "Simulation Complete",
              description: "Results are ready for analysis",
            });
          } catch (error) {
            console.error("Simulation error:", error);
            toast({
              title: "Simulation Error",
              description: "An error occurred during simulation",
              variant: "destructive",
            });
          }
        }
      }, 50); // Make it faster
      
      return () => {
        clearInterval(interval);
        setProgress(0);
        setSimulationStep("initializing");
      };
    }
  }, [isRunning]);

  const getSimulationStepText = () => {
    switch (simulationStep) {
      case "initializing":
        return "Initializing simulation...";
      case "running_bin_packing":
        return "Running Bin Packing algorithm...";
      case "running_drf":
        return "Running DRF algorithm...";
      case "running_fuse":
        return "Running FUSE algorithm...";
      case "analyzing_results":
        return "Analyzing results...";
      case "complete":
        return "Simulation complete!";
      default:
        return "Preparing simulation...";
    }
  };

  // If we have results but we're not running, show them
  const shouldShowResults = simulationResults !== null;

  return (
    <div>
      {isRunning && progress < 100 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Simulation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <p className="mt-2 text-center text-gray-600">{getSimulationStepText()}</p>
          </CardContent>
        </Card>
      )}

      {(!isRunning && !shouldShowResults) && (
        <div className="text-center py-20">
          <h3 className="text-2xl font-medium text-gray-600">Click "Run Simulation" to start</h3>
          <p className="mt-4 text-gray-500">Choose a scenario and run the simulation to see the results</p>
        </div>
      )}

      {shouldShowResults && (
        <>
          <div className="mb-6">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "charts" | "analysis")} className="w-[400px]">
              <TabsList>
                <TabsTrigger value="charts">Visualization Charts</TabsTrigger>
                <TabsTrigger value="analysis">Scientific Analysis</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {viewMode === "charts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Utilization</CardTitle>
                  <CardDescription>CPU and Memory usage across algorithms</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResourceUtilizationChart data={simulationResults.resourceUtilization} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scheduling Time</CardTitle>
                  <CardDescription>Time taken to schedule containers</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <SchedulingTimeChart data={simulationResults.schedulingTime} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Makespan</CardTitle>
                  <CardDescription>Total task completion time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <MakespanChart data={simulationResults.makespan} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Energy Consumption</CardTitle>
                  <CardDescription>Estimated energy usage</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <EnergyConsumptionChart data={simulationResults.energyConsumption} />
                </CardContent>
              </Card>
            </div>
          )}
          
          {viewMode === "analysis" && (
            <div className="space-y-8">
              <ScientificAnalysis simulationResults={simulationResults} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Raw Data Summary</CardTitle>
                  <CardDescription>Key performance indicators for each algorithm</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="text-left py-2 px-4">Metric</th>
                          <th className="text-left py-2 px-4">Bin Packing</th>
                          <th className="text-left py-2 px-4">DRF</th>
                          <th className="text-left py-2 px-4">FUSE</th>
                          <th className="text-left py-2 px-4">FUSE Improvement</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-4">CPU Utilization</td>
                          <td className="py-2 px-4">{simulationResults.rawData.binPacking.cpuUtilization.toFixed(2)}%</td>
                          <td className="py-2 px-4">{simulationResults.rawData.drf.cpuUtilization.toFixed(2)}%</td>
                          <td className="py-2 px-4">{simulationResults.rawData.fuse.cpuUtilization.toFixed(2)}%</td>
                          <td className="py-2 px-4 text-green-600">
                            +{((simulationResults.rawData.fuse.cpuUtilization - 
                                Math.max(simulationResults.rawData.binPacking.cpuUtilization, simulationResults.rawData.drf.cpuUtilization)) / 
                              Math.max(simulationResults.rawData.binPacking.cpuUtilization, simulationResults.rawData.drf.cpuUtilization) * 100).toFixed(2)}%
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">Memory Utilization</td>
                          <td className="py-2 px-4">{simulationResults.rawData.binPacking.memoryUtilization.toFixed(2)}%</td>
                          <td className="py-2 px-4">{simulationResults.rawData.drf.memoryUtilization.toFixed(2)}%</td>
                          <td className="py-2 px-4">{simulationResults.rawData.fuse.memoryUtilization.toFixed(2)}%</td>
                          <td className="py-2 px-4 text-green-600">
                            +{((simulationResults.rawData.fuse.memoryUtilization - 
                                Math.max(simulationResults.rawData.binPacking.memoryUtilization, simulationResults.rawData.drf.memoryUtilization)) / 
                              Math.max(simulationResults.rawData.binPacking.memoryUtilization, simulationResults.rawData.drf.memoryUtilization) * 100).toFixed(2)}%
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">Scheduling Time</td>
                          <td className="py-2 px-4">{simulationResults.rawData.binPacking.schedulingTime.toFixed(2)} ms</td>
                          <td className="py-2 px-4">{simulationResults.rawData.drf.schedulingTime.toFixed(2)} ms</td>
                          <td className="py-2 px-4">{simulationResults.rawData.fuse.schedulingTime.toFixed(2)} ms</td>
                          <td className="py-2 px-4 text-green-600">
                            {((1 - simulationResults.rawData.fuse.schedulingTime / 
                              Math.min(simulationResults.rawData.binPacking.schedulingTime, simulationResults.rawData.drf.schedulingTime)) * 100).toFixed(2)}% faster
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">Energy Consumption</td>
                          <td className="py-2 px-4">{simulationResults.rawData.binPacking.energy.toFixed(2)} W</td>
                          <td className="py-2 px-4">{simulationResults.rawData.drf.energy.toFixed(2)} W</td>
                          <td className="py-2 px-4">{simulationResults.rawData.fuse.energy.toFixed(2)} W</td>
                          <td className="py-2 px-4 text-green-600">
                            {((1 - simulationResults.rawData.fuse.energy / 
                              Math.min(simulationResults.rawData.binPacking.energy, simulationResults.rawData.drf.energy)) * 100).toFixed(2)}% less
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">Makespan</td>
                          <td className="py-2 px-4">{simulationResults.rawData.binPacking.makespan.toFixed(2)} ms</td>
                          <td className="py-2 px-4">{simulationResults.rawData.drf.makespan.toFixed(2)} ms</td>
                          <td className="py-2 px-4">{simulationResults.rawData.fuse.makespan.toFixed(2)} ms</td>
                          <td className="py-2 px-4 text-green-600">
                            {((1 - simulationResults.rawData.fuse.makespan / 
                              Math.min(simulationResults.rawData.binPacking.makespan, simulationResults.rawData.drf.makespan)) * 100).toFixed(2)}% faster
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">Node Utilization</td>
                          <td className="py-2 px-4">{simulationResults.rawData.binPacking.nodeCount} nodes</td>
                          <td className="py-2 px-4">{simulationResults.rawData.drf.nodeCount} nodes</td>
                          <td className="py-2 px-4">{simulationResults.rawData.fuse.nodeCount} nodes</td>
                          <td className="py-2 px-4 text-green-600">
                            {Math.min(simulationResults.rawData.binPacking.nodeCount, simulationResults.rawData.drf.nodeCount) - simulationResults.rawData.fuse.nodeCount > 0 ?
                              `${Math.min(simulationResults.rawData.binPacking.nodeCount, simulationResults.rawData.drf.nodeCount) - simulationResults.rawData.fuse.nodeCount} fewer nodes` :
                              "Equivalent"
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SimulationDashboard;
