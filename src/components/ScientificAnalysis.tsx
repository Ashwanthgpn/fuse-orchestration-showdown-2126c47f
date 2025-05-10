
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ScientificAnalysisProps {
  simulationResults: any;
}

const ScientificAnalysis = ({ simulationResults }: ScientificAnalysisProps) => {
  const [metricType, setMetricType] = useState("makespan");

  const getMetricData = () => {
    switch (metricType) {
      case "makespan":
        return simulationResults.makespan;
      case "scheduling":
        return simulationResults.schedulingTime;
      case "energy":
        return simulationResults.energyConsumption;
      case "cpu":
        return simulationResults.resourceUtilization.cpu;
      case "memory":
        return simulationResults.resourceUtilization.memory;
      default:
        return simulationResults.makespan;
    }
  };

  const calculateStatistics = () => {
    const data = getMetricData();
    
    // Calculate means for each algorithm
    const binPackingValues = data.map((item: any) => item.binPacking);
    const drfValues = data.map((item: any) => item.drf);
    const fuseValues = data.map((item: any) => item.fuse);
    
    const binPackingMean = binPackingValues.reduce((sum: number, val: number) => sum + val, 0) / binPackingValues.length;
    const drfMean = drfValues.reduce((sum: number, val: number) => sum + val, 0) / drfValues.length;
    const fuseMean = fuseValues.reduce((sum: number, val: number) => sum + val, 0) / fuseValues.length;
    
    // Calculate standard deviations
    const binPackingStdDev = calculateStdDev(binPackingValues, binPackingMean);
    const drfStdDev = calculateStdDev(drfValues, drfMean);
    const fuseStdDev = calculateStdDev(fuseValues, fuseMean);
    
    // Calculate improvements
    let binPackingImprovement, drfImprovement;
    
    if (metricType === "cpu" || metricType === "memory") {
      // For resource utilization, higher is better
      binPackingImprovement = ((fuseMean - binPackingMean) / binPackingMean * 100).toFixed(2);
      drfImprovement = ((fuseMean - drfMean) / drfMean * 100).toFixed(2);
    } else {
      // For other metrics, lower is better
      binPackingImprovement = ((binPackingMean - fuseMean) / binPackingMean * 100).toFixed(2);
      drfImprovement = ((drfMean - fuseMean) / drfMean * 100).toFixed(2);
    }

    return {
      binPacking: {
        mean: binPackingMean.toFixed(2),
        stdDev: binPackingStdDev.toFixed(2),
        improvement: binPackingImprovement
      },
      drf: {
        mean: drfMean.toFixed(2),
        stdDev: drfStdDev.toFixed(2),
        improvement: drfImprovement
      },
      fuse: {
        mean: fuseMean.toFixed(2),
        stdDev: fuseStdDev.toFixed(2)
      }
    };
  };

  const calculateStdDev = (values: number[], mean: number) => {
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  };

  const getMetricName = () => {
    switch (metricType) {
      case "makespan": return "Makespan (s)";
      case "scheduling": return "Scheduling Time (ms)";
      case "energy": return "Energy Consumption (kWh)";
      case "cpu": return "CPU Utilization (%)";
      case "memory": return "Memory Utilization (%)";
      default: return "Value";
    }
  };
  
  const getImprovementDescription = () => {
    const stats = calculateStatistics();
    if (metricType === "cpu" || metricType === "memory") {
      return (
        <p className="mt-2 text-sm text-gray-600">
          FUSE achieved {stats.binPacking.improvement}% higher utilization than Bin Packing and {stats.drf.improvement}% higher than DRF, 
          indicating more efficient resource usage while maintaining performance.
        </p>
      );
    } else {
      return (
        <p className="mt-2 text-sm text-gray-600">
          FUSE shows {stats.binPacking.improvement}% improvement over Bin Packing and {stats.drf.improvement}% improvement over DRF, 
          demonstrating superior efficiency in the scheduling process.
        </p>
      );
    }
  };

  if (!simulationResults) {
    return null;
  }

  const stats = calculateStatistics();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistical Analysis</CardTitle>
        <CardDescription>Scientific comparison of algorithm performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={metricType} onValueChange={setMetricType} className="w-full mb-6">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="makespan">Makespan</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="cpu">CPU</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Algorithm</TableHead>
              <TableHead>Mean {getMetricName()}</TableHead>
              <TableHead>Std. Deviation</TableHead>
              <TableHead>Improvement vs FUSE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Bin Packing</TableCell>
              <TableCell>{stats.binPacking.mean}</TableCell>
              <TableCell>±{stats.binPacking.stdDev}</TableCell>
              <TableCell className="text-red-500">-{stats.binPacking.improvement}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">DRF</TableCell>
              <TableCell>{stats.drf.mean}</TableCell>
              <TableCell>±{stats.drf.stdDev}</TableCell>
              <TableCell className="text-red-500">-{stats.drf.improvement}%</TableCell>
            </TableRow>
            <TableRow className="bg-amber-50">
              <TableCell className="font-medium">FUSE</TableCell>
              <TableCell className="font-bold">{stats.fuse.mean}</TableCell>
              <TableCell>±{stats.fuse.stdDev}</TableCell>
              <TableCell className="text-green-500">Baseline</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-md border">
          <h4 className="text-sm font-semibold mb-2">Key Finding:</h4>
          {getImprovementDescription()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScientificAnalysis;
