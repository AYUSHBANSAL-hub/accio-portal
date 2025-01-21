"use client"; // Indicates client-side component

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useReportStore } from "../state/store";

const Reports = () => {
  const searchParams = useSearchParams();
  const userIdFromParams = searchParams?.get("userId"); // Get userId from URL query parameters

  const [availableReports, setAvailableReports] = useState<any>(null);
  const { stateAvailableReports, setStateAvailableReports, setUserId, userId: storedUserId } =
    useReportStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Predefined report data
  const reports = [
    {
      reportname: "Resume Audit",
      path: "resume",
      tab: "Resume_Audit",
      logo: "https://banner2.cleanpng.com/20181129/bpv/kisspng-computer-icons-clip-art-sql-server-reporting-servi-bo-co-cskh-1713916901306.webp",
      description: "Detailed analysis of resume.",
    },
    {
      reportname: "Main Report",
      path: "main_report",
      tab: "main",
      logo: "https://banner2.cleanpng.com/20181129/bpv/kisspng-computer-icons-clip-art-sql-server-reporting-servi-bo-co-cskh-1713916901306.webp",
      description: "Comprehensive overview of the main data.",
    },
    {
      reportname: "AccioMatrix Submissions",
      path: "acciomatrix_submissions",
      tab: "AccioMatrix_Submission",
      logo: "https://banner2.cleanpng.com/20181129/bpv/kisspng-computer-icons-clip-art-sql-server-reporting-servi-bo-co-cskh-1713916901306.webp",
      description: "Performance insights and evaluations.",
    },
  ];

  /**
   * Sync state with localStorage on component load
   */
  useEffect(() => {
    const storedReports = localStorage.getItem("stateAvailableReports");
    const storedUserId = localStorage.getItem("userId");

    if (!stateAvailableReports && storedReports) {
      setStateAvailableReports(JSON.parse(storedReports));
    }

    if (!storedUserId && userIdFromParams) {
      setUserId(userIdFromParams);
      localStorage.setItem("userId", userIdFromParams);
    }
  }, [setStateAvailableReports, stateAvailableReports, setUserId, userIdFromParams]);

  /**
   * Handle userId changes or API fetching
   */
  useEffect(() => {
    if (userIdFromParams && userIdFromParams !== storedUserId) {
      // Update the userId in state and localStorage
      setUserId(userIdFromParams);
      localStorage.setItem("userId", userIdFromParams);

      // Clear previous state
      setStateAvailableReports(null);
      setAvailableReports(null);

      // Fetch new data
      fetchReports(userIdFromParams);
    } else if (!stateAvailableReports && userIdFromParams) {
      // Fetch data if stateAvailableReports is null
      fetchReports(userIdFromParams);
    } else if (stateAvailableReports) {
      // Use available state data to populate reports
      populateReportsFromState(stateAvailableReports);
      setLoading(false);
    }
  }, [userIdFromParams, stateAvailableReports, storedUserId, setUserId]);

  /**
   * Fetch reports for the given userId
   */
  const fetchReports = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/gsheet?userId=${userId}`);
      setStateAvailableReports(response.data);
      localStorage.setItem("stateAvailableReports", JSON.stringify(response.data));
      populateReportsFromState(response.data);
    } catch (err) {
      setError("Error fetching available reports.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Populate available reports based on API response
   */
  const populateReportsFromState = (data: any) => {
    const availableReportTabs = Object.keys(data);
    const finalReports = reports.filter((report) =>
      availableReportTabs.includes(report.tab)
    );
    setAvailableReports(finalReports);
  };

  return (
    <div className="bg-[#307fec] flex flex-col justify-start items-center pt-10 pb-4 px-4">
      <div className="w-full bg-white rounded-xl shadow-2xl text-center p-8">
        {/* Header Section */}
        <div className="relative">
          <div className=" mx-auto flex flex-col md:flex-row items-center overflow-hidden">
            {/* Left Section: Header Content */}
            <div className="relative z-10 p-8 flex-1">
              <img
                src="https://acciojob.com/src/Navbar/logo.svg"
                alt="AccioJob Logo"
                className="w-auto h-20 mb-6 mx-auto"
              />
              <h1 className="text-4xl font-bold text-black">
                Welcome to AccioJob Reports!
              </h1>
              <p className="text-lg text-gray-600 mt-4">
                Unlock personalized insights to boost your career.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Analyze your data and get detailed reports tailored to your
                needs.
              </p>
            </div>

            {/* Right Section: Image */}
            <div className="flex-1">
              <img
                src="hero.png"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="w-full bg-white p-8">
          <h2 className="text-3xl font-semibold text-black text-center mb-6">
            Available Reports
          </h2>
          {error ? (
            <div className="text-center text-xl text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(3)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 animate-pulse rounded-xl p-6"
                    >
                      <div className="h-10 bg-gray-300 rounded mb-4"></div>
                      <div className="h-16 bg-gray-300 rounded mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  ))
              ) : availableReports && availableReports.length > 0 ? (
                availableReports.map((report: any, index: any) => (
                  <div
                    key={index}
                    className="bg-[#1c2533] p-6 rounded-xl shadow-2xl hover:scale-105 transform transition-transform duration-300 ease-in-out"
                  >
                    <div className="flex justify-between items-center mb-5">
                      <div className="text-2xl font-semibold text-white hover:text-gray-300 transition-colors duration-300">
                        {report.reportname}
                      </div>
                      <img
                        src={report.logo}
                        alt={`${report.reportname} Logo`}
                        className="w-12 h-12 rounded-full border-2 border-[#307fec] p-2"
                      />
                    </div>
                    <p className="text-gray-300 text-sm mb-4">
                      {report.description}
                    </p>
                    <Link href={`/components/${report.path}`}>
                      <button className="w-full px-4 py-2 rounded text-white bg-[#307fec] hover:bg-[#1e77d0] transition-colors duration-300">
                        View Report
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center text-lg text-gray-400">
                  No reports available for this user.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* How It Works Section */}
      <div className="w-full mt-10 bg-white rounded-xl p-8">
        <h2 className="text-3xl font-semibold text-black text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center py-5 px-4">
          {/* Step 1: Analyze */}
          <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105 hover:shadow-lg">
            <img
              src="analyse.png"
              alt="Analyze Icon"
              className="w-16 h-16 m-auto"
            />
            <h3 className="text-xl font-semibold mt-4 text-gray-800">
              Analyze
            </h3>
            <p className="text-gray-500 mt-2">
              Our AI processes the data for detailed insights.
            </p>
          </div>

          {/* Step 2: Report */}
          <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105 hover:shadow-lg">
            <img
              src="report.png"
              alt="Report Icon"
              className="w-16 h-16 m-auto"
            />
            <h3 className="text-xl font-semibold mt-4 text-gray-800">Report</h3>
            <p className="text-gray-500 mt-2">
              Receive comprehensive, easy-to-understand reports.
            </p>
          </div>

          {/* Step 3: Improve */}
          <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105 hover:shadow-lg">
            <img
              src="improve.png"
              alt="Improve Icon"
              className="w-16 h-16 m-auto"
            />
            <h3 className="text-xl font-semibold mt-4 text-gray-800">
              Improve
            </h3>
            <p className="text-gray-500 mt-2">
              Implement suggestions to enhance your performance.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      {/* <footer className="w-full bg-white px-6 py-2 text-center">
        <p className="text-gray-500 text-sm">
          © 2025 AccioJob. All rights reserved.
        </p>
      </footer> */}
    </div>
  );
};

export default Reports;
