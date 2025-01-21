'use client';  // Indicates client-side component

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ResumeAuditReport = () => {
  const searchParams = useSearchParams();
  const userId = searchParams?.get('userId');  // Get userId from URL query parameters

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchReport = async () => {
      try {
        const response = await axios.get(`/api/gsheet?userId=${userId}`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching report data');
        setLoading(false);
      }
    };

    fetchReport();
  }, [userId]);

  if (loading) return <div className="text-center text-xl text-[#307fec]">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500">{error}</div>;

  // Chart Data Preparation
  const resumeScore = data?.Resume_Score || 0;
  const resumeReady = data?.Resume_Ready === 'TRUE' ? 1 : 0;

  const barChartData = {
    labels: ['Resume Score'],
    datasets: [
      {
        label: 'Resume Score',
        data: [resumeScore],
        backgroundColor: ['#307fec'],
        borderRadius: 8,
        borderColor: ['#1e77d0'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Resume Ready', 'Not Ready'],
    datasets: [
      {
        data: [resumeReady, 1 - resumeReady],
        backgroundColor: ['#307fec', '#2b2f35'],
        hoverBackgroundColor: ['#1e77d0', '#3a3e47'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#2b2f35] flex justify-center items-center py-10 px-4">
      <div className="max-w-4xl w-full bg-[#022555] rounded-xl p-8 shadow-2xl text-white">
        <h1 className="text-4xl font-semibold text-[#307fec] text-center mb-8 mt-5">
          Resume Audit Report for <span className="font-bold text-[#fff]">{userId}</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Score Bar Chart */}
          <div className="bg-[#1c2533] p-6 rounded-lg shadow-lg hover:bg-[#307fec] hover:cursor-pointer transition-all">
            <h2 className="text-2xl font-semibold text-[#e5e7eb] mb-4">Resume Score</h2>
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>

          {/* Resume Ready Pie Chart */}
          <div className="bg-[#1c2533] p-6 rounded-lg shadow-lg hover:bg-[#307fec] hover:cursor-pointer transition-all">
            <h2 className="text-2xl font-semibold text-[#e5e7eb] mb-4">Is Resume Ready?</h2>
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Resume Audit Feedback */}
        <div className="bg-[#1c2533] p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-[#e5e7eb] mb-4">Feedback</h2>
          <p className="text-[#e5e7eb] text-sm">{data?.Feedback}</p>
        </div>

        {/* Resume Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#1c2533] p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-[#307fec] mb-4">Technologies Highlighted</h3>
            <p className="text-[#e5e7eb]">{data?.Technologies || 'No technologies highlighted'}</p>
          </div>

          <div className="bg-[#1c2533] p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-[#307fec] mb-4">Certifications</h3>
            <p className="text-[#e5e7eb]">{data?.Certifications || 'No certifications included'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAuditReport;
