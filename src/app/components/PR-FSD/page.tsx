"use client"
import React, { useState } from "react";

const Report = () => {
  const reportData = {
    "Basic Details": {
      "User ID": "A12345",
      Name: "Ayush Bansal",
      Email: "ayush.bansal@example.com",
      "Phone Number": "+91 9876543210",
      "PR Status": "Placement Ready",
    },
    "Skill Progress": {
      "Assignment Section": {
        "Coding Question": {
          "Practice Module": {
            Assigned: 50,
            Attempted: 45,
            Solved: 40,
          },
          "All Time": {
            Assigned: 150,
            Attempted: 140,
            Solved: 130,
          },
          "Last 30 Days": {
            Solved: 15,
          },
        },
        MCQ: {
          "Practice Module": {
            Assigned: 30,
            Attempted: 28,
            Solved: 25,
          },
          "All Time": {
            Assigned: 100,
            Attempted: 90,
            Solved: 85,
          },
          "Last 30 Days": {
            Solved: 10,
          },
        },
        "Web Dev": {
          "Practice Module": {
            Assigned: 20,
            Attempted: 18,
            Solved: 16,
          },
          "All Time": {
            Assigned: 60,
            Attempted: 55,
            Solved: 50,
          },
          "Last 30 Days": {
            Solved: 8,
          },
        },
      },
      "Practice Module Revamp": {
        "Live Class Attendance": "85%",
        "Recorded Sessions Watched": 12,
        "Total Questions Solved in Course": 265,
        "Questions Solved in Last 15 Days": 25,
      },
      AccioMatrix: {
        "Attempted Tests": 5,
        "Average Score": 78,
      },
    },
    "Resume Status": {
      "Resume Ready": "Yes",
      "Detailed Feedback": "Available",
      "Project Work": "No improvement required",
    },
    "Mock Assessments": {
      "For Non-PR Students": {
        "Pending Mocks": null,
      },
      "For PR Students": {
        "Mock Scores": {
          "Placement Mock": {
            Date: "2024-12-20",
            Score: 85,
            Status: "Valid",
          },
          "HR Mock": {
            Date: "2024-12-25",
            Score: 78,
            Status: "Completed",
          },
        },
      },
    },
    "Personalized Insights & Next Steps": {
      Strengths: [
        "High problem-solving activity",
        "Consistent attendance in live classes",
      ],
      "Areas to Improve": [
        "Increase mock test participation",
        "Focus on improving advanced coding topics",
      ],
      "Action Plan": {
        "Resume Feedback": "Address minor formatting issues",
        "Mock Assessments": "Schedule and complete pending mocks by 2025-02-10",
        "Skill Improvement": [
          "Solve at least 5 questions per day for the next 15 days",
          "Watch advanced JavaScript topics to strengthen weak areas",
        ],
      },
    },
  };
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="p-8 bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-purple-800 mb-10">
          Student Report
        </h1>
        
        {/* Basic Details */}
        <section className="mb-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div
              className="bg-blue-500 text-white text-lg font-bold px-4 py-3 cursor-pointer flex justify-between items-center"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span>Basic Details</span>
              <span className="text-white text-xl">
                {isExpanded ? "−" : "+"}
              </span>
            </div>
            {isExpanded && (
              <table className="w-full text-sm text-left text-gray-700">
                <tbody>
                  {Object.entries(reportData["Basic Details"]).map(
                    ([key, value]) => (
                      <tr key={key} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium text-gray-600">
                          {key}
                        </td>
                        <td className="py-2 px-4 text-gray-900">{value}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Skill Progress */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Skill Progress
          </h2>
          {Object.entries(reportData["Skill Progress"]).map(
            ([sectionKey, sectionValue]) => (
              <div key={sectionKey} className="mb-8">
                <h3 className="text-lg font-semibold text-purple-700 mb-4">
                  {sectionKey}
                </h3>
                {typeof sectionValue === "object" &&
                !Array.isArray(sectionValue) ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left border border-gray-200 bg-white rounded-lg shadow-lg">
                      <thead className="bg-blue-900 text-white">
                        <tr>
                          <th className="px-6 py-3 border-b-2 border-gray-300 text-sm font-bold uppercase">
                            Category
                          </th>
                          <th className="px-6 py-3 border-b-2 border-gray-300 text-sm font-bold uppercase">
                            Assigned
                          </th>
                          <th className="px-6 py-3 border-b-2 border-gray-300 text-sm font-bold uppercase">
                            Attempted
                          </th>
                          <th className="px-6 py-3 border-b-2 border-gray-300 text-sm font-bold uppercase">
                            Solved
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(sectionValue).map(([key, value]) => (
                          <React.Fragment key={key}>
                            {typeof value === "object" ? (
                              <>
                                <tr className="bg-gray-100">
                                  <td
                                    colSpan={4}
                                    className="px-6 py-3 font-semibold bg-blue-500 text-white"
                                  >
                                    {key}
                                  </td>
                                </tr>
                                {Object.entries(value).map(
                                  ([subKey, subValue]) => (
                                    <tr key={subKey} className="border-b">
                                      <td className="px-6 py-3 text-sm text-gray-700">
                                        {subKey}
                                      </td>
                                      {typeof subValue === "object" ? (
                                        Object.entries(subValue).map(
                                          ([innerKey, innerValue]) => (
                                            <td
                                              key={innerKey}
                                              className="px-6 py-3 text-sm text-gray-700"
                                            >
                                              {innerValue}
                                            </td>
                                          )
                                        )
                                      ) : (
                                        <>
                                          <td className="px-6 py-3 text-sm text-gray-700">
                                            {subValue.Assigned || "-"}
                                          </td>
                                          <td className="px-6 py-3 text-sm text-gray-700">
                                            {subValue.Attempted || "-"}
                                          </td>
                                          <td className="px-6 py-3 text-sm text-gray-700">
                                            {subValue.Solved || "-"}
                                          </td>
                                        </>
                                      )}
                                    </tr>
                                  )
                                )}
                              </>
                            ) : (
                              <tr key={key} className="border-b">
                                <td className="px-6 py-3 text-sm text-gray-700">
                                  {key}
                                </td>
                                <td
                                  className="px-6 py-3 text-sm text-gray-700"
                                  colSpan={3}
                                >
                                  {value}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">{sectionValue}</p>
                )}
              </div>
            )
          )}
        </section>

        {/* Personalized Insights & Next Steps */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-purple-800 mb-6">
            Personalized Insights & Next Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(
              reportData["Personalized Insights & Next Steps"]
            ).map(([key, value]) => (
              <div
                key={key}
                className="bg-gradient-to-r from-purple-100 via-blue-50 to-indigo-100 shadow-lg rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <span className="mr-2">
                    {/* Add an icon here */}
                    {key === "Strengths" && (
                      <span role="img" aria-label="strength">
                        💪
                      </span>
                    )}
                    {key === "Areas to Improve" && (
                      <span role="img" aria-label="improve">
                        📈
                      </span>
                    )}
                    {key === "Action Plan" && (
                      <span role="img" aria-label="plan">
                        📝
                      </span>
                    )}
                  </span>
                  {key}
                </h3>
                <div className="text-gray-700">
                  {Array.isArray(value) ? (
                    <ul className="list-disc ml-6 space-y-2">
                      {value.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-800 bg-white p-2 rounded-lg shadow-sm"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : typeof value === "object" ? (
                    <div className="space-y-2">
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <div
                          key={subKey}
                          className="flex items-start bg-white p-3 rounded-lg shadow-sm"
                        >
                          <span className="font-semibold text-purple-600 mr-2">
                            {subKey}:
                          </span>
                          <span className="text-gray-800">{subValue}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-800">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Report;
