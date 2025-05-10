
export const scenarios = {
  scenario1: {
    name: "High Resource Demand",
    description: "Many pods requiring high CPU and memory resources",
    containerCount: 50,
    nodeCount: 10,
    cpuDistribution: "high",
    memoryDistribution: "high",
  },
  scenario2: {
    name: "Low Resource Demand",
    description: "Many pods with minimal resource requirements",
    containerCount: 100,
    nodeCount: 5,
    cpuDistribution: "low",
    memoryDistribution: "low",
  },
  scenario3: {
    name: "Mixed Workload",
    description: "Combination of high and low resource-demanding pods",
    containerCount: 75,
    nodeCount: 8,
    cpuDistribution: "mixed",
    memoryDistribution: "mixed",
  },
  scenario4: {
    name: "High Scheduling Load",
    description: "Large number of pods and nodes to test scheduler performance",
    containerCount: 200,
    nodeCount: 20,
    cpuDistribution: "mixed",
    memoryDistribution: "mixed",
  },
  scenario5: {
    name: "Stress Test",
    description: "Maximum load on the system with varied resource requirements",
    containerCount: 300,
    nodeCount: 25,
    cpuDistribution: "high",
    memoryDistribution: "mixed",
  },
};
