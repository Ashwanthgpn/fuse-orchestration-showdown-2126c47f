
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { algorithms } from "@/lib/algorithms";
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

const AlgorithmComparisonDetail = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("binPacking");
  
  const getAlgorithmData = () => {
    return algorithms[selectedAlgorithm as keyof typeof algorithms];
  };
  
  const algorithmData = getAlgorithmData();
  
  // Convert characteristics to radar chart data
  const radarData = [
    { subject: 'Resource Efficiency', binPacking: 9, drf: 6, fuse: 9 },
    { subject: 'Fairness', binPacking: 3, drf: 9, fuse: 7 },
    { subject: 'Energy Efficiency', binPacking: 5, drf: 3, fuse: 8 },
    { subject: 'Performance', binPacking: 6, drf: 6, fuse: 9 },
    { subject: 'Adaptability', binPacking: 4, drf: 7, fuse: 8 }
  ];
  
  // Pie chart data for research areas
  const researchInterests = [
    { name: 'Resource Optimization', value: selectedAlgorithm === 'binPacking' ? 60 : selectedAlgorithm === 'drf' ? 35 : 40 },
    { name: 'Fairness', value: selectedAlgorithm === 'binPacking' ? 10 : selectedAlgorithm === 'drf' ? 50 : 30 },
    { name: 'Energy Management', value: selectedAlgorithm === 'binPacking' ? 20 : selectedAlgorithm === 'drf' ? 5 : 20 },
    { name: 'Performance', value: selectedAlgorithm === 'binPacking' ? 10 : selectedAlgorithm === 'drf' ? 10 : 10 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <Card className="w-full">
      <CardHeader className={algorithmData.headerColor}>
        <CardTitle className="text-white">{algorithmData.name}</CardTitle>
        <CardDescription className="text-white opacity-90">{algorithmData.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="research">Research Areas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="py-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 mb-6">{algorithmData.description}</p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Strengths</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {algorithmData.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Weaknesses</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {algorithmData.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="characteristics" className="py-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} width={730} height={250} data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} />
                  <Radar name="Bin Packing" dataKey="binPacking" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="DRF" dataKey="drf" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Radar name="FUSE" dataKey="fuse" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Key Characteristics</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(algorithmData.characteristics).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-1">
                    <span className="text-sm capitalize">{key.replace('_', ' ')}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="py-4">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Algorithm Selection</h3>
              <div className="mb-4">
                <Tabs value={selectedAlgorithm} onValueChange={setSelectedAlgorithm} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="binPacking">Bin Packing</TabsTrigger>
                    <TabsTrigger value="drf">DRF</TabsTrigger>
                    <TabsTrigger value="fuse">FUSE</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">When to use {algorithmData.name}</h4>
              <ul className="list-disc list-inside space-y-1">
                {selectedAlgorithm === "binPacking" && (
                  <>
                    <li className="text-sm">When resource efficiency is the top priority</li>
                    <li className="text-sm">For workloads with minimal resource contention</li>
                    <li className="text-sm">To minimize the number of nodes required</li>
                    <li className="text-sm">For stateless applications with similar resource profiles</li>
                  </>
                )}
                {selectedAlgorithm === "drf" && (
                  <>
                    <li className="text-sm">In multi-tenant environments where fairness is critical</li>
                    <li className="text-sm">When users have different resource requirements</li>
                    <li className="text-sm">To prevent resource starvation</li>
                    <li className="text-sm">For workloads with heterogeneous resource demands</li>
                  </>
                )}
                {selectedAlgorithm === "fuse" && (
                  <>
                    <li className="text-sm">For balanced performance across all metrics</li>
                    <li className="text-sm">When both efficiency and fairness are important</li>
                    <li className="text-sm">To optimize energy consumption</li>
                    <li className="text-sm">For complex, mixed workloads with varying priorities</li>
                    <li className="text-sm">In production environments with changing demands</li>
                  </>
                )}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="research" className="py-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2 h-60">
                <h4 className="font-medium mb-2 text-center">Research Focus Areas</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={researchInterests}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {researchInterests.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="md:w-1/2">
                <h4 className="font-medium mb-2">Recent Publications</h4>
                <ul className="list-disc list-inside space-y-3">
                  {selectedAlgorithm === "binPacking" && (
                    <>
                      <li className="text-sm">Zhang et al. (2023) "Enhanced Bin Packing for Container Orchestration in Cloud Environments"</li>
                      <li className="text-sm">Kumar and Singh (2022) "Resource-Aware Bin Packing Strategies for Kubernetes"</li>
                      <li className="text-sm">Wang, J. (2022) "Multi-dimensional Bin Packing for Microservice Orchestration"</li>
                    </>
                  )}
                  {selectedAlgorithm === "drf" && (
                    <>
                      <li className="text-sm">Li et al. (2023) "DRF Extensions for Large-scale Container Clusters"</li>
                      <li className="text-sm">Rodriguez and Patel (2022) "Fairness-oriented Resource Allocation in Edge Computing"</li>
                      <li className="text-sm">Chen, Y. (2023) "DRF with Priority Considerations for Critical Workloads"</li>
                    </>
                  )}
                  {selectedAlgorithm === "fuse" && (
                    <>
                      <li className="text-sm">Anderson et al. (2024) "FUSE: A Hybrid Approach to Container Scheduling"</li>
                      <li className="text-sm">Gupta and Sharma (2023) "Energy-aware Scheduling with the FUSE Algorithm"</li>
                      <li className="text-sm">Wilson, K. (2024) "FUSE Performance in Production Kubernetes Environments"</li>
                      <li className="text-sm">Lee et al. (2023) "Comparative Analysis of FUSE against Traditional Schedulers"</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AlgorithmComparisonDetail;
