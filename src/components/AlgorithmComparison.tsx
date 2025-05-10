
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { algorithms } from "@/lib/algorithms";

const AlgorithmComparison = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {Object.entries(algorithms).map(([key, algorithm]) => (
        <Card key={key} className="overflow-hidden">
          <CardHeader className={`${algorithm.headerColor} text-white`}>
            <CardTitle>{algorithm.name}</CardTitle>
            <CardDescription className="text-white/80">{algorithm.shortDescription}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="overview">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="strengths" className="flex-1">Strengths</TabsTrigger>
                <TabsTrigger value="weaknesses" className="flex-1">Weaknesses</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <p className="text-gray-700">{algorithm.description}</p>
              </TabsContent>
              
              <TabsContent value="strengths">
                <ul className="list-disc pl-5 space-y-1">
                  {algorithm.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-700">{strength}</li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="weaknesses">
                <ul className="list-disc pl-5 space-y-1">
                  {algorithm.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-gray-700">{weakness}</li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Key Characteristics:</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(algorithm.characteristics).map(([key, value]) => (
                  <div key={key} className="bg-gray-100 p-2 rounded">
                    <p className="text-xs text-gray-500 capitalize">{key.replace('_', ' ')}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AlgorithmComparison;
