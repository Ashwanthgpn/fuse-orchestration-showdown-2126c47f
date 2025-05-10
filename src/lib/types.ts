
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
