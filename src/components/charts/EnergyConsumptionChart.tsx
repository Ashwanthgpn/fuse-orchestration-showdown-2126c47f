
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface EnergyConsumptionChartProps {
  data: any[];
}

const EnergyConsumptionChart = ({ data }: EnergyConsumptionChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "Energy (kWh)", angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="binPacking" name="Bin Packing" stackId="1" fill="#8884d8" fillOpacity={0.6} stroke="#8884d8" />
        <Area type="monotone" dataKey="drf" name="DRF" stackId="2" fill="#82ca9d" fillOpacity={0.6} stroke="#82ca9d" />
        <Area type="monotone" dataKey="fuse" name="FUSE" stackId="3" fill="#ffc658" fillOpacity={0.6} stroke="#ffc658" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EnergyConsumptionChart;
