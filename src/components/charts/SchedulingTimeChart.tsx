
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SchedulingTimeChartProps {
  data: any[];
}

const SchedulingTimeChart = ({ data }: SchedulingTimeChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "Time (ms)", angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="binPacking" name="Bin Packing" stroke="#8884d8" />
        <Line type="monotone" dataKey="drf" name="DRF" stroke="#82ca9d" />
        <Line type="monotone" dataKey="fuse" name="FUSE" stroke="#ffc658" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SchedulingTimeChart;
