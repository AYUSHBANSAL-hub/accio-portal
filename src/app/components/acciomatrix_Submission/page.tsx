"use client"; // Indicates client-side component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

import { useReportStore } from "@/app/state/store";

const AccioMatrixSubmissions = () => {
  const router = useRouter(); // Initialize router

  const [assessments, setAssessments] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { stateAvailableReports } = useReportStore((state) => state);
  const { userId } = useReportStore((state) => state);
  const [averageTrustScore, SetAverageTrustScore] = useState<any | null>(0);
  const [averageScore, SetAverageScore] = useState<any | null>(0);
  useEffect(() => {
    const getassessmentsdata = () => {
      console.log(stateAvailableReports.AccioMatrix_Submission);
      setAssessments(stateAvailableReports.AccioMatrix_Submission);
      setLoading(false);
      SetAverageScore(
        calculateAverage(stateAvailableReports.AccioMatrix_Submission, "score")
      );
      SetAverageTrustScore(
        calculateAverage(
          stateAvailableReports.AccioMatrix_Submission,
          "trust_score"
        )
      );
    };
    getassessmentsdata();
  }, [stateAvailableReports]);
  function calculateAverage(data: any, scoreKey: any) {
    // Extract values from the dynamic scoreKey and convert to numbers
    const values = data
      .map((test: any) => parseFloat(test[scoreKey]))
      .filter((value: any) => !isNaN(value));

    // Calculate average
    const average = values.length
      ? values.reduce((sum: any, val: any) => sum + val, 0) / values.length
      : 0;

    return average.toFixed(2); // Return with 2 decimal places
  }

  if (loading)
    return <div className="text-center text-xl text-[#307fec]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#307fec] flex flex-col justify-start items-center py-10 px-4">
      {/* Header Section */}
      <div className="w-full max-w-6xl bg-[#1c2533] rounded-xl shadow-lg p-8 mb-8 relative">
        <button
          onClick={() => router.push(`/?userId=${userId}`)} // Redirect to the reports page
          className="ml-0 px-4 py-2 bg-[#307fec] text-white font-semibold rounded hover:bg-[#1e77d0] transition"
        >
          Back to Reports
        </button>
        <div className="text-center">
          {/* Content */}
          <div className="relative z-10">
            <img
              className="px-5 py-2 rounded-xl m-auto"
              src="https://acciomatrix.com/_next/static/media/full_logo.882fb685.svg"
            />
            <h1 className="text-5xl font-extrabold mb-4 text-white">Assessment Reports</h1>
            <p className="text-xl mb-6 text-white">
              Discover insights, track progress, and explore detailed reports of
              your assessments.
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-white">
                  {assessments.length}
                </span>
                <p className="text-base font-semibold text-[#ef6821]">
                  Total Assessments
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-white">
                  {averageScore}%
                </span>
                <p className="text-base font-semibold text-[#ef6821]">
                  Average Score
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-white">
                  {averageTrustScore}%
                </span>
                <p className="text-base font-semibold text-[#ef6821]">
                  Average Trust Score
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="flex justify-center gap-4">
            <button className="px-6 py-2 text-white bg-[#307fec] hover:bg-[#1e77d0] rounded-lg shadow-md transition">
              View All Reports
            </button>
            <button className="px-6 py-2 text-[#307fec] bg-white border border-[#307fec] hover:bg-[#f0f4ff] rounded-lg shadow-md transition">
              Learn More
            </button>
          </div> */}
          </div>
        </div>
      </div>
      {/* Assessment Table */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-black mb-6">
          {assessments[0].user_name}'s Assessments:
        </h2>

        {assessments.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-[#1c2533] text-white">
              <tr>
                <th className="px-4 py-2 text-left">S No.</th>
                <th className="px-4 py-2 text-left">Test Name</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Score</th>
                <th className="px-4 py-2 text-left">Trust Score</th>
                <th className="px-4 py-2 text-left">Feedback</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment: any, index: number) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 text-black`}
                >
                  <td className="border border-[#ef6821] px-4 py-2">
                    {index + 1}.
                  </td>
                  <td className="border border-[#ef6821] px-4 py-2">
                    {assessment.test_name}
                  </td>
                  <td className="border border-[#ef6821] px-4 py-2">
                    {new Date(assessment.test_created_at).toLocaleDateString()}
                  </td>
                  {assessment.score ? (
                    <td className="border border-[#ef6821] px-4 py-2 font-bold text-center align-middle ">
                      {assessment.score}%
                    </td>
                  ) : (
                    <td className="border border-[#ef6821] px-4 py-2"></td>
                  )}
                  {assessment.trust_score ? (
                    <td className="border border-[#ef6821] px-4 py-2 text-center align-middle font-bold">
                      {parseFloat(assessment.trust_score).toFixed(2) * 100}%
                    </td>
                  ) : (
                    <td className="border border-[#ef6821] px-4 py-2"></td>
                  )}
                  {assessment.test_feedback ? (
                    <td className="border border-[#ef6821] px-4 py-2 text-sm text-gray-600">
                      {assessment.test_feedback.slice(0, 200)}...
                    </td>
                  ) : (
                    <td className="border border-[#ef6821] px-4 py-2"></td>
                  )}
                  <td className="border border-[#ef6821] px-4 py-2 text-center">
                    {assessment.report_link && (
                      <a
                        href={assessment.report_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 font-semibold text-white bg-[#307fec] hover:bg-[#1e77d0] rounded transition-colors duration-300"
                      >
                        View Report
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 text-lg">
            No assessments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AccioMatrixSubmissions;
