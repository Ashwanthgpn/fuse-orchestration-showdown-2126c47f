
export interface Container {
  id: string;
  cpuRequest: number; // CPU cores
  memoryRequest: number; // MB
  priority: number; // 1-10, higher is more important
}

export interface Node {
  id: string;
  availableCpu: number; // CPU cores
  availableMemory: number; // MB
  energyProfile: {
    idleConsumption: number; // Watts
    maxConsumption: number; // Watts
    cpuEnergyFactor: number; // Watts per CPU core
  };
}

export interface SimulationResult {
  schedulingTime: number; // ms
  cpuUtilization: number; // percentage
  memoryUtilization: number; // percentage
  energy: number; // Watts
  makespan: number; // ms
  nodeCount: number;
}

export interface ScenarioConfig {
  name: string;
  containerCount: number;
  nodeCount: number;
  cpuDistribution: string;
  memoryDistribution: string;
  prioritizationType?: string;
  heterogeneousNodes?: boolean;
  nodeFailureRate?: number;
  containerEvictionRate?: number;
}

export interface AlgorithmMetrics {
  resourceUtilization: {
    cpu: number;
    memory: number;
  };
  schedulingTime: number;
  makespan: number;
  energyConsumption: number;
  scalability: number;
  fairnessIndex: number;
}

export interface StatisticalAnalysis {
  mean: number;
  median: number;
  standardDeviation: number;
  confidenceInterval: [number, number];
  sampleSize: number;
  improvementPercent?: number;
}
