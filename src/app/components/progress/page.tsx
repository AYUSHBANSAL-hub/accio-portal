"use client"; // Indicates client-side component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useReportStore } from "@/app/state/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Progress = () => {
  const router = useRouter(); // Initialize router
  const [learner, setAssessments] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { stateAvailableReports } = useReportStore((state) => state);
  const { userId } = useReportStore((state) => state);

  useEffect(() => {
    const getlearnerdata = () => {
      console.log(stateAvailableReports.main[0]);
      setAssessments(stateAvailableReports.main[0]);
      setLoading(false);
    };
    getlearnerdata();
  }, [stateAvailableReports]);

  if (loading)
    return <div className="text-center text-xl text-[#307fec]">Loading...</div>;

  const progressBarWidth = parseFloat(learner["Assignment %"]);
  // Chart Data for Assignments
  const chartData = {
    labels: ["Total Questions", "Solved Questions"],
    datasets: [
      {
        label: "Assignments",
        data: [
          learner["Total Assignment Ques"],
          learner["Total Assignment Solved"],
        ],
        backgroundColor: ["#307fec", "#1e77d0"],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to allow custom height
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Optional: Remove gridlines on x-axis
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
    },
  };
  return (
    <div className="min-h-screen bg-[#307fec] flex flex-col items-center py-10 px-4">
      {/* Header Section */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8 mb-8 relative">
      <button
          onClick={() => router.push(`/?userId=${userId}`)} // Redirect to the reports page
          className="px-4 py-2 mb-6 bg-[#307fec] text-white font-semibold rounded hover:bg-[#1e77d0] transition"
        >
          Back to Reports
        </button>

        <h1 className="text-5xl font-extrabold text-[#1c2533]">
          Progress Report
        </h1>
        <p className="text-lg font-semibold text-gray-600 mt-4">
          A detailed overview of {learner.user_name}'s journey and performance.
        </p>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8 mb-8">
        {/* Section Header */}
        <h2 className="text-3xl font-bold text-black mb-8">Overview</h2>

        {/* Highlights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-100 rounded-lg p-6 text-center shadow-md">
            <h3 className="text-xl font-semibold text-black">Track</h3>
            <p className="text-sm text-gray-600 mt-2">{learner.user_track}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 text-center shadow-md">
            <h3 className="text-xl font-semibold text-black">Batch</h3>
            <p className="text-sm text-gray-600 mt-2">
              Batch No: {learner.batch_no}
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 text-center shadow-md">
            <h3 className="text-xl font-semibold text-black">
              Placement Status
            </h3>
            <p
              className={`text-sm mt-2 ${
                learner.user_placement_status === "Not Placed"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {learner.user_placement_status}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-black mb-4">
              Personal Information
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Name:</strong> {learner.user_name}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Email:</strong> {learner.user_email}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Contact:</strong> {learner.user_contact}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Graduation Year:</strong> {learner.graduationYear}
            </p>
          </div>

          {/* Right Column */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-black mb-4">
              Enrollment Information
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Enrolled In:</strong> {learner.enrolled_in} (Track:{" "}
              {learner.user_track})
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Enrolled Date:</strong>{" "}
              {new Date(learner.enrolled_date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Agreement Valid Till:</strong>{" "}
              {new Date(
                learner["Aggrement Valid-till Date"]
              ).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Job Portal Status:</strong> {learner.job_portal_status}
            </p>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-black mb-6">Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Batch Performance Comparison */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg text-black font-semibold mb-4">
              Assignment solving Performance
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {/* You are currently performing <strong>8% above</strong> the average batch score. */}
            </p>
            <div className="relative h-64">
              {" "}
              {/* Set a specific height for the container */}
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
