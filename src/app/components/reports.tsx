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
  const {
    stateAvailableReports,
    setStateAvailableReports,
    setUserId,
    userId: storedUserId,
  } = useReportStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dark Mode setup
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check localStorage for dark mode preference
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    // Store dark mode preference
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Predefined report data
  const reports = [
    {
      reportName: "Resume Audit",
      path: "resume",
      tab: "Resume_Audit",
      logo: "https://banner2.cleanpng.com/20181129/bpv/kisspng-computer-icons-clip-art-sql-server-reporting-servi-bo-co-cskh-1713916901306.webp",
      description:
        "A detailed evaluation of your resume, highlighting strengths and areas for improvement to enhance your chances in resume shortlisting.",
      primaryColor: "#307fec", // Main theme color
      secondaryColor: "#1c2533", // Background or supporting color
      textColor: "#ffffff", // Text color for readability
      updateFrequency: "15th of every month", // Defines when this report is refreshed
    },
    {
      reportName: "User Information",
      path: "progress",
      tab: "main",
      logo: "userlogo.png",
      description:
        "A comprehensive analysis of your learning progress, covering completed tasks, performance metrics, and areas for improvement.",
      primaryColor: "#28a745",
      secondaryColor: "#1e3a3a",
      textColor: "#ffffff",
      updateFrequency: "Every Monday", // Weekly updates
    },
    {
      reportName: "AccioMatrix Submissions",
      path: "acciomatrix_Submission",
      tab: "AccioMatrix_Submission",
      logo: "AccioMatrix.png",
      description:
        "Detailed insights into your submissions on AccioMatrix, providing feedback and scores to help improve problem-solving skills.",
      primaryColor: "#f39c12",
      secondaryColor: "#2b2f35",
      textColor: "#ffffff",
      updateFrequency: "Every Friday", // Bi-weekly or weekly updates
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
  }, [
    setStateAvailableReports,
    stateAvailableReports,
    setUserId,
    userIdFromParams,
  ]);

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
      localStorage.setItem(
        "stateAvailableReports",
        JSON.stringify(response.data)
      );
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
    <div
      className={`${
        darkMode ? "bg-gray-200 text-white" : "bg-[#307fec] text-black"
      } flex flex-col justify-start items-center pt-6 pb-4 px-4`}
    >
      <div
        className={`${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }w-full rounded-xl shadow-2xl text-center p-8`}
      >
        {/* Header Section */}
        <div className="relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute right-0 p-2 text-sm font-semibold rounded-md transition-all"
            style={{
              backgroundColor: darkMode ? "#ffffff" : "#333",
              color: darkMode ? "#333" : "#ffffff",
            }}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <div className="mx-auto flex flex-col items-center overflow-hidden pt-8 md:pt-0 md:flex-row">
            {/* Left Section: Header Content */}
            <div className="relative z-10 p-3 flex-1">
              <img
                src="https://acciojob.com/src/Navbar/logo.svg"
                alt="AccioJob Logo"
                className="w-auto h-20 mb-6 mx-auto bg-white rounded-3xl px-3 py-1"
              />
              <h1
                className={`text-4xl font-bold ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Welcome to AccioJob Reports!
              </h1>
              <p
                className={`text-lg ${
                  darkMode ? "text-gray-200" : "text-gray-900"
                } mt-4 font-semibold`}
              >
                Unlock personalized insights to boost your career.
              </p>
              <p
                className={`text-base ${
                  darkMode ? "text-gray-400" : "text-gray-800"
                } mt-2`}
              >
                Analyze your data and get detailed reports tailored to your
                needs.
              </p>
            </div>

            {/* Right Section: Image */}
            <div className="flex-1">
              <img src="hero.png" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className={`w-full p-4 pt-0`}>
          <h2
            className={`text-3xl ${
              darkMode ? "text-gray-200" : "text-black"
            } font-semibold text-center mb-6`}
          >
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
                    className="p-6 rounded-xl shadow-2xl hover:scale-105 transform transition-transform duration-300 ease-in-out"
                    style={{ backgroundColor: report.secondaryColor }} // Dynamically applying background color
                  >
                    <div className="flex justify-between items-center mb-5">
                      <div
                        className="text-2xl font-semibold hover:text-gray-300 transition-colors duration-300"
                        style={{ color: report.textColor }} // Applying dynamic text color
                      >
                        {report.reportName}
                      </div>
                      <img
                        src={report.logo}
                        alt={`${report.reportName} Logo`}
                        className="w-12 h-12 rounded-full border-2 p-2"
                        style={{ borderColor: report.primaryColor }} // Dynamically applying border color
                      />
                    </div>

                    <p className="text-gray-300 text-sm mb-4">
                      {report.description}
                    </p>

                    <div className="text-xs text-gray-400 mb-4">
                      <span className="font-semibold text-gray-300">
                        Updated:
                      </span>{" "}
                      {report.updateFrequency}
                    </div>

                    <Link href={`/components/${report.path}`}>
                      <button
                        className="w-full px-4 py-2 rounded font-semibold text-white transition-colors duration-300"
                        style={{
                          backgroundColor: report.primaryColor,
                          hover: { backgroundColor: "#1e77d0" },
                        }} // Applying dynamic button color
                      >
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
      <div className={`w-full mt-6 rounded-xl p-8 ${
                  darkMode ? "bg-gray-900" : "bg-white"
                }`}>
        <h2 className={`text-3xl font-semibold  text-center ${
                  darkMode ? "text-gray-200" : "text-[#2b2f35]"
                }`}>
          How It Works?
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

      {/* Need Assistance section */}
      <div className={`w-full  mb-10 py-6 px-10 rounded-lg shadow-md mt-6 flex items-center justify-between ${
                  darkMode ? "bg-gray-900" : "bg-[#f8f9fa]"
                } md:no-wrap flex-wrap`}>
        <div>
          <h2 className={`text-2xl font-semibold  ${
                  darkMode ? "text-gray-200" : "text-[#2b2f35]"
                }`}>
            Need Help or Assistance?
          </h2>
          <p className={` text-base mt-2 ${
                  darkMode ? "text-gray-200" : "text-gray-600"
                }`}>
            If you need any kind of help, reach out to us on the{" "}
            <span className="font-semibold">AccioJob Support Section</span> to
            get quick resolutions and expert guidance.
          </p>
        </div>
        <a
          href="https://course.acciojob.com/support"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#307fec] text-white px-10 font-bold py-4 rounded-lg text-base hover:bg-[#1e77d0] transition-colors duration-300"
        >
          Go to Support
        </a>
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
