"use client"; // Indicates client-side component

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const Reports = () => {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId"); // Get userId from URL query parameters

  const [availableReports, setAvailableReports] = useState<any>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const reports = [
    {
      reportname: "Resume Audit",
      path: "resume_report",
      tab: "Resume_Audit",
      logo: "https://banner2.cleanpng.com/20181129/bpv/kisspng-computer-icons-clip-art-sql-server-reporting-servi-bo-co-cskh-1713916901306.webp",
      description:"abc"
    },
    {
      reportname: "Main",
      path: "resume_report",
      tab: "main",
      logo: "https://banner2.cleanpng.com/20181129/bpv/kisspng-computer-icons-clip-art-sql-server-reporting-servi-bo-co-cskh-1713916901306.webp",
      description:"abc main check"
    },
    {
      reportname: "Main",
      path: "resume_report",
      tab: "mains",
      logo: "https://banner2.cleanpng.com/20181129/bpv/kisspng-computer-icons-clip-art-sql-server-reporting-servi-bo-co-cskh-1713916901306.webp",
      description:"abc main check"
    },
  ];

  useEffect(() => {
    if (!userId) return; // Wait for userId in the URL

    const fetchReports = async () => {
      try {
        const response = await axios.get(`/api/gsheet?userId=${userId}`);
        const final_reports=reports.filter(report => response.data.availableReports.includes(report.tab))
        setAvailableReports(final_reports);
        console.log(final_reports);
        setLoading(false);
      } catch (err) {
        setError("Error fetching available reports");
        setLoading(false);
      }
    };

    fetchReports();
    
  }, [userId]);

  if (loading)
    return <div className="text-center text-xl text-[#307fec]">Loading</div>;
  if (error)
    return <div className="text-center text-xl text-red-500">{error}</div>;

  return (
    <div className="h-screen bg-[#307fec] flex justify-center items-center py-10 px-4">
      <div className="w-full h-full  bg-[#ffffff] rounded-xl p-8 shadow-2xl text-white">
        <img
          src={`https://acciojob.com/src/Navbar/logo.svg`}
          alt="Logo"
          className="w-100 h-100 m-auto rounded-full"
        />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#307fec] to-[#022555] text-center mb-8 mt-5 animate-title">
          AVAILABLE REPORTS
        </h1>

        {availableReports && availableReports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableReports.map((report, index) => (
              <div
                key={index}
                className="bg-[#1c2533] p-6 rounded-xl shadow-2xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-in-out"
              >
                <div className="flex justify-between items-center mb-5">
                  <div className="text-2xl font-semibold text-[#307fec] hover:text-white transition-colors duration-300">
                    {report.reportname}
                  </div>
                  <img
                    src={`https://banner2.cleanpng.com/20181129/bpv/kisspng-computer-icons-clip-art-sql-server-reporting-servi-bo-co-cskh-1713916901306.webp`}
                    alt="Logo"
                    className="w-12 h-12 rounded-full border-2 border-[#307fec] p-2"
                  />
                </div>
                <p className="text-[#e5e7eb] text-sm mb-4">
                 {report.description}
                </p>
                <button className="px-4 py-2 rounded-full text-white bg-[#307fec] hover:bg-[#1e77d0] transition-colors duration-300">
                  <Link href={report.path}>View Report</Link>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-lg text-gray-400">
            No reports available for this user.
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;