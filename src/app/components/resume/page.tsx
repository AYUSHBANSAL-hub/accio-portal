"use client"; // Indicates client-side component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

import { useReportStore } from "@/app/state/store";

const ResumeAuditReport = () => {
  // const searchParams = useSearchParams();
  // const userId = searchParams?.get('userId');  // Get userId from URL query parameters
  const router = useRouter(); // Initialize router
  
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);
  const { stateAvailableReports } = useReportStore((state) => state);
  const { userId} = useReportStore((state) => state);
  useEffect(() => {
    const getresumeauditdata = () => {
      console.log(stateAvailableReports.Resume_Audit[0]);
      setData(stateAvailableReports.Resume_Audit[0]);
      setLoading(false);
    };
    getresumeauditdata();
  }, [stateAvailableReports]);

  // useEffect(() => {
  //   if (!userId) return;

  //   const fetchReport = async () => {
  //     try {
  //       const response = await axios.get(`/api/gsheet?userId=${userId}`);
  //       setData(response.data);
  //       setLoading(false);
  //     } catch (err) {
  //       setError('Error fetching report data');
  //       setLoading(false);
  //     }
  //   };

  //   fetchReport();
  // }, [userId]);

  if (loading)
    return <div className="text-center text-xl text-[#307fec]">Loading...</div>;
  // if (error) return <div className="text-center text-xl text-red-500">{error}</div>;

  // Extract Boolean Questions
  const booleanQuestions = Object.entries(data).filter(
    ([key, value]) => value === "TRUE" || value === "FALSE"
  );

  return (
    <div className="min-h-screen bg-[#1f88e4] flex justify-center items-center py-10 px-4">
      <div className="max-w-4xl w-full bg-[#022555] rounded-xl p-8 shadow-2xl text-white">
      <button
          onClick={() => router.push(`/?userId=${userId}`)} // Redirect to the reports page
          className="px-4 py-2 mb-6 bg-[#307fec] text-white font-semibold rounded hover:bg-[#1e77d0] transition"
        >
          Back to Reports
        </button>
        <h1 className="text-4xl font-semibold text-[#fffff] text-center mb-8 mt-5">
          Resume Audit Report for{" "}
          <span className="font-bold text-[#fff]">{data.user_name}</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Score Bar Chart */}
          <div className="bg-[#1c2533] flex items-center justify-between p-6 rounded-lg shadow-lg hover:bg-[#307fec] hover:cursor-pointer transition-all">
            <h2 className="text-2xl font-semibold text-white">
              Resume Score
            </h2>
            {/* <Bar data={barChartData} options={{ responsive: true }} /> */}

            <span className={`font-bold border p-1 px-3 rounded text-white`}>
              {data["Resume Score"]}/10
            </span>
          </div>

          {/* Resume Ready Pie Chart */}
          <div className="bg-[#1c2533] flex items-center justify-between p-6 rounded-lg shadow-lg hover:bg-[#307fec] hover:cursor-pointer transition-all">
            <h2
              className={`text-base font-semibold ${
                data["Resume Ready?"] === "Yes"
                  ? "text-green-400 border-green-400"
                  : "text-red-400 border-red-400"
              }`}
            >
             Is your resume fit for shortlisting?
            </h2>
            {/* <Pie data={pieChartData} options={{ responsive: true }} /> */}
            <span
              className={`font-bold border p-1 rounded  ${
                data["Resume Ready?"] === "Yes"
                  ? "text-green-400 border-green-400"
                  : "text-red-400 border-red-400"
              }`}
            >
              {data["Resume Ready?"]}
            </span>
          </div>
        </div>
        {/* Boolean Questions Section */}
        <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg mb-6">
          {/* <h2 className="text-xl font-semibold text-[#e5e7eb] mb-4">Resume Criteria</h2> */}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {booleanQuestions.map(([key, value]) => (
              <li
                key={key}
                className="hover:bg-[#ececec] hover:scale-105	 hover:cursor-pointer transition-all text-[#e5e7eb] flex items-center justify-between border px-3 border-[#1ea1f1] rounded py-2"
              >
                <span
                  className={`text-xs text-base/5 font-semibold px-2 ${
                    value === "TRUE" ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {key.replace(/_/g, " ")}
                </span>
                <span
                  className={`font-bold border p-1 rounded  ${
                    value === "TRUE"
                      ? "text-green-400 border-green-400"
                      : "text-red-400 border-red-400"
                  }`}
                >
                  {value === "TRUE" ? "Yes" : "No"}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* Resume Audit Feedback */}
        <div className="bg-[#1c2533] p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-[#e5e7eb] mb-4">
            Feedback
          </h2>
          <p className="text-[#e5e7eb] text-sm">{data?.Feedback}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeAuditReport;
