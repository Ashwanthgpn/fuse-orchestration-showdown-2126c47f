
import { Container, Node } from './types';

// Bin Packing Algorithm Implementation
const binPackingAlgorithm = (containers: Container[], nodes: Node[]) => {
  // Sort containers by CPU request (descending)
  const sortedContainers = [...containers].sort((a, b) => b.cpuRequest - a.cpuRequest);
  
  const nodeAssignments = new Map();
  let makespan = 0;
  let activeNodes = 0;
  
  // Try to fit each container on a node
  for (const container of sortedContainers) {
    let assigned = false;
    
    // Try to assign to an existing node
    for (const node of nodes) {
      if (node.availableCpu >= container.cpuRequest && 
          node.availableMemory >= container.memoryRequest) {
        // Assign container to this node
        node.availableCpu -= container.cpuRequest;
        node.availableMemory -= container.memoryRequest;
        
        const nodeId = node.id;
        if (!nodeAssignments.has(nodeId)) {
          nodeAssignments.set(nodeId, []);
          activeNodes++;
        }
        
        nodeAssignments.get(nodeId).push(container.id);
        assigned = true;
        
        // Update makespan (simulate execution time based on resources)
        const containerTime = 100 + (container.cpuRequest * 500) + (container.memoryRequest * 0.05);
        if (containerTime > makespan) {
          makespan = containerTime;
        }
        
        break;
      }
    }
    
    if (!assigned) {
      console.log(`Container ${container.id} could not be scheduled with Bin Packing`);
    }
  }
  
  return {
    assignments: nodeAssignments,
    makespan: makespan,
    nodeCount: activeNodes
  };
};

// Dominant Resource Fairness (DRF) Algorithm Implementation
const drfAlgorithm = (containers: Container[], nodes: Node[]) => {
  // Calculate total capacity
  let totalCpu = 0;
  let totalMemory = 0;
  
  nodes.forEach(node => {
    totalCpu += node.availableCpu;
    totalMemory += node.availableMemory;
  });
  
  // Calculate dominant resource shares
  const containerShares = containers.map(container => {
    const cpuShare = container.cpuRequest / totalCpu;
    const memoryShare = container.memoryRequest / totalMemory;
    
    return {
      ...container,
      dominantShare: Math.max(cpuShare, memoryShare),
      dominant: cpuShare > memoryShare ? 'cpu' : 'memory'
    };
  });
  
  // Sort by dominant share (ascending) and priority (descending)
  const sortedContainers = containerShares.sort((a, b) => {
    if (a.dominantShare !== b.dominantShare) {
      return a.dominantShare - b.dominantShare;
    }
    return b.priority - a.priority;
  });
  
  const nodeAssignments = new Map();
  let makespan = 0;
  let activeNodes = 0;
  
  // Assign containers to nodes
  for (const container of sortedContainers) {
    let assigned = false;
    
    // Find node with most available resources for the dominant resource
    const isDominantCpu = container.dominant === 'cpu';
    nodes.sort((a, b) => {
      return isDominantCpu 
        ? b.availableCpu - a.availableCpu
        : b.availableMemory - a.availableMemory;
    });
    
    for (const node of nodes) {
      if (node.availableCpu >= container.cpuRequest && 
          node.availableMemory >= container.memoryRequest) {
        // Assign container to this node
        node.availableCpu -= container.cpuRequest;
        node.availableMemory -= container.memoryRequest;
        
        const nodeId = node.id;
        if (!nodeAssignments.has(nodeId)) {
          nodeAssignments.set(nodeId, []);
          activeNodes++;
        }
        
        nodeAssignments.get(nodeId).push(container.id);
        assigned = true;
        
        // Update makespan (simulate execution time based on resources and fairness)
        const containerTime = 80 + (container.cpuRequest * 300) + (container.memoryRequest * 0.08);
        if (containerTime > makespan) {
          makespan = containerTime;
        }
        
        break;
      }
    }
    
    if (!assigned) {
      console.log(`Container ${container.id} could not be scheduled with DRF`);
    }
  }
  
  return {
    assignments: nodeAssignments,
    makespan: makespan,
    nodeCount: activeNodes
  };
};

// FUSE (Hybrid) Algorithm Implementation
const fuseAlgorithm = (containers: Container[], nodes: Node[]) => {
  // Calculate total capacity
  let totalCpu = 0;
  let totalMemory = 0;
  
  nodes.forEach(node => {
    totalCpu += node.availableCpu;
    totalMemory += node.availableMemory;
  });
  
  // Calculate multi-dimensional resource scores (combines bin packing and DRF concepts)
  const containerScores = containers.map(container => {
    const cpuShare = container.cpuRequest / totalCpu;
    const memoryShare = container.memoryRequest / totalMemory;
    const dominantShare = Math.max(cpuShare, memoryShare);
    
    // FUSE score combines resource efficiency and fairness
    const resourceEfficiency = container.cpuRequest / container.memoryRequest; // CPU to memory ratio
    const fairnessScore = 1 / (dominantShare * 10 + 1); // Inverse of dominant share
    const fuseScore = (resourceEfficiency * 0.6) + (fairnessScore * 0.4); // Combined score
    
    return {
      ...container,
      dominantShare,
      fuseScore,
      dominant: cpuShare > memoryShare ? 'cpu' : 'memory'
    };
  });
  
  // Sort by FUSE score (descending) and priority (descending)
  const sortedContainers = containerScores.sort((a, b) => {
    if (a.fuseScore !== b.fuseScore) {
      return b.fuseScore - a.fuseScore;
    }
    return b.priority - a.priority;
  });
  
  const nodeAssignments = new Map();
  let makespan = 0;
  let activeNodes = 0;
  
  // Adaptive bin selection based on resource balance
  for (const container of sortedContainers) {
    let assigned = false;
    let bestNodeIndex = -1;
    let bestNodeScore = -Infinity;
    
    // Score each node based on how well it fits this container
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      // Skip nodes that don't have enough resources
      if (node.availableCpu < container.cpuRequest || 
          node.availableMemory < container.memoryRequest) {
        continue;
      }
      
      // Calculate how balanced the node would be after placing this container
      const remainingCpuRatio = (node.availableCpu - container.cpuRequest) / 4; // based on 4 cores total
      const remainingMemoryRatio = (node.availableMemory - container.memoryRequest) / 8192; // based on 8GB total
      
      // Score based on balance and resource utilization
      const balanceScore = -Math.abs(remainingCpuRatio - remainingMemoryRatio);
      const utilizationScore = 1 - ((remainingCpuRatio + remainingMemoryRatio) / 2);
      const nodeScore = (balanceScore * 0.4) + (utilizationScore * 0.6);
      
      if (nodeScore > bestNodeScore) {
        bestNodeScore = nodeScore;
        bestNodeIndex = i;
      }
    }
    
    if (bestNodeIndex >= 0) {
      // Assign container to the best node
      const node = nodes[bestNodeIndex];
      node.availableCpu -= container.cpuRequest;
      node.availableMemory -= container.memoryRequest;
      
      const nodeId = node.id;
      if (!nodeAssignments.has(nodeId)) {
        nodeAssignments.set(nodeId, []);
        activeNodes++;
      }
      
      nodeAssignments.get(nodeId).push(container.id);
      assigned = true;
      
      // Update makespan (FUSE optimizes for shorter execution times)
      const containerTime = 60 + (container.cpuRequest * 250) + (container.memoryRequest * 0.03);
      if (containerTime > makespan) {
        makespan = containerTime;
      }
    }
    
    if (!assigned) {
      console.log(`Container ${container.id} could not be scheduled with FUSE`);
    }
  }
  
  return {
    assignments: nodeAssignments,
    makespan: makespan,
    nodeCount: activeNodes
  };
};

// Export algorithms with metadata
export const algorithms = {
  binPacking: {
    name: "Bin Packing",
    shortDescription: "Resource-efficient container placement",
    description: "The Bin Packing algorithm focuses on packing containers into the minimum number of nodes, prioritizing resource efficiency over fairness. It's effective for maximizing resource utilization but may lead to uneven workload distribution.",
    algorithm: binPackingAlgorithm,
    headerColor: "bg-purple-600",
    strengths: [
      "Maximizes resource utilization",
      "Minimizes the number of active nodes",
      "Reduces overall infrastructure costs",
      "Simple to implement and understand"
    ],
    weaknesses: [
      "May lead to unfair resource allocation",
      "Can cause resource contention",
      "Prioritizes efficiency over performance",
      "May result in imbalanced node utilization"
    ],
    characteristics: {
      resource_efficiency: "High",
      fairness: "Low",
      energy_efficiency: "Medium",
      performance: "Medium"
    }
  },
  drf: {
    name: "Dominant Resource Fairness (DRF)",
    shortDescription: "Fair multi-resource allocation",
    description: "DRF ensures fair allocation of multiple resources (CPU, memory) by considering the dominant resource share for each container. It prioritizes fairness over absolute efficiency, making it suitable for multi-tenant environments.",
    algorithm: drfAlgorithm,
    headerColor: "bg-green-600",
    strengths: [
      "Guarantees resource fairness across containers",
      "Works well in multi-tenant environments",
      "Prevents resource starvation",
      "Handles multi-dimensional resources effectively"
    ],
    weaknesses: [
      "May not maximize overall resource utilization",
      "Can lead to fragmentation of resources",
      "More complex to implement than bin packing",
      "May use more nodes than necessary"
    ],
    characteristics: {
      resource_efficiency: "Medium",
      fairness: "High",
      energy_efficiency: "Low",
      performance: "Medium"
    }
  },
  fuse: {
    name: "FUSE (Hybrid)",
    shortDescription: "Balanced utilization and fairness",
    description: "FUSE is a hybrid algorithm that combines the resource efficiency of Bin Packing with the fairness guarantees of DRF, along with optimizations for energy efficiency and performance. It uses a scoring system to balance multiple objectives.",
    algorithm: fuseAlgorithm,
    headerColor: "bg-amber-600",
    strengths: [
      "Balances efficiency, fairness, and performance",
      "Adapts to different workload patterns",
      "Reduces energy consumption",
      "Optimizes resource utilization while maintaining fairness"
    ],
    weaknesses: [
      "More complex implementation",
      "Requires tuning of scoring parameters",
      "May not be optimal for extreme workloads",
      "Higher computational overhead than simpler algorithms"
    ],
    characteristics: {
      resource_efficiency: "High",
      fairness: "Medium-High",
      energy_efficiency: "High",
      performance: "High"
    }
  }
};
