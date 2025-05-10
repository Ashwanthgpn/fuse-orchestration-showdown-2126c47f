
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ResourceUtilizationChart from "@/components/charts/ResourceUtilizationChart";
import SchedulingTimeChart from "@/components/charts/SchedulingTimeChart";
import MakespanChart from "@/components/charts/MakespanChart";
import EnergyConsumptionChart from "@/components/charts/EnergyConsumptionChart";
import { runSimulation } from "@/lib/simulator";

interface SimulationDashboardProps {
  isRunning: boolean;
}

const SimulationDashboard = ({ isRunning }: SimulationDashboardProps) => {
  const [progress, setProgress] = useState(0);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [simulationStep, setSimulationStep] = useState("initializing");

  useEffect(() => {
    if (isRunning) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 1;
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
          const results = runSimulation();
          setSimulationResults(results);
          setSimulationStep("complete");
        }
      }, 100);
      
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

      {(!isRunning && !simulationResults) && (
        <div className="text-center py-20">
          <h3 className="text-2xl font-medium text-gray-600">Click "Run Simulation" to start</h3>
          <p className="mt-4 text-gray-500">Choose a scenario and run the simulation to see the results</p>
        </div>
      )}

      {simulationResults && (
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
    </div>
  );
};

export default SimulationDashboard;
