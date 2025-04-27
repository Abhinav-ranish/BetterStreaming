'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext'; // Get user from global context
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registering chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function UsageMetricsPage() {
  const { user } = useUser(); // Get the user from global context
  const [metrics, setMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulating an API call to get usage metrics
      const fetchUsageMetrics = async () => {
        const response = await fetch(`/api/user/${user.id}/usage-metrics`);
        const data = await response.json();
        setMetrics(data);
        setLoading(false);
      };

      fetchUsageMetrics();
    }
  }, [user]);

  if (loading) return <p className="p-4">⏳ Loading your usage metrics...</p>;

  // Pie chart data
  const data = {
    labels: Object.keys(metrics),
    datasets: [
      {
        label: 'Time Spent by Genre',
        data: Object.values(metrics), // Ensure the values are numbers
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A1'], // Customize the colors
        borderColor: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A1'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold mb-4">📊 Usage Metrics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-2">Genre Distribution</h2>
          <Pie data={data} />
        </div>
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-2">Time Spent</h2>
          <ul className="list-none">
            {Object.entries(metrics).map(([genre, time]) => {
              // Type assertion to ensure `time` is a number
              const typedTime = time as number;

              return (
                <li key={genre}>
                  <span className="font-semibold">{genre}:</span> {typedTime} hours
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
