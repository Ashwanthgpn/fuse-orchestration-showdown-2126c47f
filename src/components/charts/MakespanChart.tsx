
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

interface MakespanChartProps {
  data: any[];
}

const MakespanChart = ({ data }: MakespanChartProps) => {
  const getMaxValue = () => {
    let max = 0;
    data.forEach(item => {
      const values = [item.binPacking, item.drf, item.fuse];
      const itemMax = Math.max(...values);
      if (itemMax > max) max = itemMax;
    });
    return max;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "Time (s)", angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <ReferenceLine y={getMaxValue() * 0.7} stroke="red" strokeDasharray="3 3" label="Target" />
        <Bar name="Bin Packing" dataKey="binPacking" fill="#8884d8" />
        <Bar name="DRF" dataKey="drf" fill="#82ca9d" />
        <Bar name="FUSE" dataKey="fuse" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MakespanChart;
