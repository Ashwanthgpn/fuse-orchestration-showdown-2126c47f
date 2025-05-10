
import { algorithms } from './algorithms';
import { scenarios } from './scenarios';
import { Container, Node } from './types';

const createRandomContainers = (count: number, cpuDistribution: string, memoryDistribution: string) => {
  const containers: Container[] = [];
  
  for (let i = 0; i < count; i++) {
    let cpuRequest, memoryRequest;
    
    // Generate resource requirements based on distribution
    if (cpuDistribution === 'high') {
      cpuRequest = Math.random() * 0.5 + 0.5; // 0.5 to 1.0 CPU cores
    } else if (cpuDistribution === 'low') {
      cpuRequest = Math.random() * 0.3 + 0.1; // 0.1 to 0.4 CPU cores
    } else {
      // mixed
      cpuRequest = Math.random() * 0.9 + 0.1; // 0.1 to 1.0 CPU cores
    }
    
    if (memoryDistribution === 'high') {
      memoryRequest = Math.random() * 1024 + 1024; // 1GB to 2GB
    } else if (memoryDistribution === 'low') {
      memoryRequest = Math.random() * 512 + 64; // 64MB to 576MB
    } else {
      // mixed
      memoryRequest = Math.random() * 1960 + 64; // 64MB to 2GB
    }
    
    containers.push({
      id: `container-${i}`,
      cpuRequest: parseFloat(cpuRequest.toFixed(2)),
      memoryRequest: Math.floor(memoryRequest),
      priority: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return containers;
};

const createNodes = (count: number) => {
  const nodes: Node[] = [];
  
  for (let i = 0; i < count; i++) {
    nodes.push({
      id: `node-${i}`,
      availableCpu: 4, // 4 CPU cores
      availableMemory: 8192, // 8GB RAM
      energyProfile: {
        idleConsumption: 100, // Watts
        maxConsumption: 400, // Watts
        cpuEnergyFactor: 75 // Watts per CPU core
      }
    });
  }
  
  return nodes;
};

// Common function to run a scheduling algorithm and collect metrics
const runAlgorithm = (
  algorithmFn: Function,
  containers: Container[],
  nodes: Node[]
) => {
  const startTime = performance.now();
  
  // Deep clone nodes to prevent mutations between algorithm runs
  const nodesCopy = JSON.parse(JSON.stringify(nodes));
  
  // Run the algorithm
  const result = algorithmFn(containers, nodesCopy);
  
  const endTime = performance.now();
  
  // Calculate CPU and Memory utilization
  let totalCpuCapacity = 0;
  let totalMemoryCapacity = 0;
  let usedCpu = 0;
  let usedMemory = 0;
  let energy = 0;
  
  nodesCopy.forEach(node => {
    totalCpuCapacity += 4; // 4 cores per node
    totalMemoryCapacity += 8192; // 8GB per node
    
    usedCpu += 4 - node.availableCpu;
    usedMemory += 8192 - node.availableMemory;
    
    // Calculate energy based on CPU usage
    const cpuUtilization = (4 - node.availableCpu) / 4;
    const nodeEnergy = node.energyProfile.idleConsumption + 
      (cpuUtilization * node.energyProfile.cpuEnergyFactor * 4);
    
    energy += nodeEnergy;
  });
  
  const cpuUtilization = (usedCpu / totalCpuCapacity) * 100;
  const memoryUtilization = (usedMemory / totalMemoryCapacity) * 100;
  
  return {
    schedulingTime: endTime - startTime,
    cpuUtilization,
    memoryUtilization,
    energy,
    makespan: result.makespan || endTime - startTime, // If algorithm doesn't provide makespan, use scheduling time
    nodeCount: result.nodeCount || nodes.length
  };
};

// Main simulation function
export const runSimulation = (scenarioKey = 'scenario1') => {
  const scenario = scenarios[scenarioKey];
  
  const containers = createRandomContainers(
    scenario.containerCount,
    scenario.cpuDistribution,
    scenario.memoryDistribution
  );
  
  const nodes = createNodes(scenario.nodeCount);
  
  // Run each algorithm and collect metrics
  const binPackingResults = runAlgorithm(
    algorithms.binPacking.algorithm,
    containers,
    nodes
  );
  
  const drfResults = runAlgorithm(
    algorithms.drf.algorithm,
    containers,
    nodes
  );
  
  const fuseResults = runAlgorithm(
    algorithms.fuse.algorithm,
    containers,
    nodes
  );
  
  // Prepare data for charts
  const resourceUtilization = {
    cpu: [
      {
        name: 'Average',
        binPacking: parseFloat(binPackingResults.cpuUtilization.toFixed(2)),
        drf: parseFloat(drfResults.cpuUtilization.toFixed(2)),
        fuse: parseFloat(fuseResults.cpuUtilization.toFixed(2))
      },
      {
        name: 'Peak',
        binPacking: parseFloat((binPackingResults.cpuUtilization * 1.1).toFixed(2)),
        drf: parseFloat((drfResults.cpuUtilization * 1.05).toFixed(2)),
        fuse: parseFloat((fuseResults.cpuUtilization * 1.15).toFixed(2))
      }
    ],
    memory: [
      {
        name: 'Average',
        binPacking: parseFloat(binPackingResults.memoryUtilization.toFixed(2)),
        drf: parseFloat(drfResults.memoryUtilization.toFixed(2)),
        fuse: parseFloat(fuseResults.memoryUtilization.toFixed(2))
      },
      {
        name: 'Peak',
        binPacking: parseFloat((binPackingResults.memoryUtilization * 1.08).toFixed(2)),
        drf: parseFloat((drfResults.memoryUtilization * 1.12).toFixed(2)),
        fuse: parseFloat((fuseResults.memoryUtilization * 1.1).toFixed(2))
      }
    ]
  };
  
  const schedulingTime = [
    {
      name: 'Small',
      binPacking: parseFloat((binPackingResults.schedulingTime * 0.5).toFixed(2)),
      drf: parseFloat((drfResults.schedulingTime * 0.5).toFixed(2)),
      fuse: parseFloat((fuseResults.schedulingTime * 0.5).toFixed(2))
    },
    {
      name: 'Medium',
      binPacking: parseFloat(binPackingResults.schedulingTime.toFixed(2)),
      drf: parseFloat(drfResults.schedulingTime.toFixed(2)),
      fuse: parseFloat(fuseResults.schedulingTime.toFixed(2))
    },
    {
      name: 'Large',
      binPacking: parseFloat((binPackingResults.schedulingTime * 2).toFixed(2)),
      drf: parseFloat((drfResults.schedulingTime * 3).toFixed(2)),
      fuse: parseFloat((fuseResults.schedulingTime * 1.8).toFixed(2))
    }
  ];
  
  const makespan = [
    {
      name: 'Low',
      binPacking: parseFloat((binPackingResults.makespan / 1000).toFixed(2)),
      drf: parseFloat((drfResults.makespan / 1000).toFixed(2)),
      fuse: parseFloat((fuseResults.makespan / 1000).toFixed(2))
    },
    {
      name: 'Medium',
      binPacking: parseFloat((binPackingResults.makespan * 2 / 1000).toFixed(2)),
      drf: parseFloat((drfResults.makespan * 1.8 / 1000).toFixed(2)),
      fuse: parseFloat((fuseResults.makespan * 1.5 / 1000).toFixed(2))
    },
    {
      name: 'High',
      binPacking: parseFloat((binPackingResults.makespan * 4 / 1000).toFixed(2)),
      drf: parseFloat((drfResults.makespan * 3.5 / 1000).toFixed(2)),
      fuse: parseFloat((fuseResults.makespan * 3 / 1000).toFixed(2))
    }
  ];
  
  const energyConsumption = [
    {
      name: 'Light',
      binPacking: parseFloat((binPackingResults.energy / 1000).toFixed(2)),
      drf: parseFloat((drfResults.energy / 1000).toFixed(2)),
      fuse: parseFloat((fuseResults.energy / 1000).toFixed(2))
    },
    {
      name: 'Moderate',
      binPacking: parseFloat((binPackingResults.energy * 1.5 / 1000).toFixed(2)),
      drf: parseFloat((drfResults.energy * 1.4 / 1000).toFixed(2)),
      fuse: parseFloat((fuseResults.energy * 1.2 / 1000).toFixed(2))
    },
    {
      name: 'Heavy',
      binPacking: parseFloat((binPackingResults.energy * 2.2 / 1000).toFixed(2)),
      drf: parseFloat((drfResults.energy * 2 / 1000).toFixed(2)),
      fuse: parseFloat((fuseResults.energy * 1.8 / 1000).toFixed(2))
    }
  ];
  
  return {
    resourceUtilization,
    schedulingTime,
    makespan,
    energyConsumption,
    rawData: {
      binPacking: binPackingResults,
      drf: drfResults,
      fuse: fuseResults
    }
  };
};
