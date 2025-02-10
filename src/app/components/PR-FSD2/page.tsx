"use client"; // Indicates client-side component

// bled
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  User,
  Book,
  Code,
  CheckCircle,
  AlertCircle,
  Target,
  Award,
  Bookmark,
  Star,
  TrendingUp,
  FileText,
} from "lucide-react";
// import mockData from './mockdata';
import { useReportStore } from "@/app/state/store";

const LearnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [mockData, setData] = useState<any | null>(null);
  const { stateAvailableReports } = useReportStore((state) => state);
  const { userId } = useReportStore((state) => state);
  useEffect(() => {
    const getresumeauditdata = () => {
      console.log(stateAvailableReports.Pr_Report[0]);
      setData(stateAvailableReports.Pr_Report[0]);
      // setLoading(false);
    };
    getresumeauditdata();
  }, [stateAvailableReports]);

  // Calculate progress percentages
  const calculateProgress = () => {
    const total = {
      coding: mockData?.coding_ques,
      webdev: mockData?.webdev_ques,
      mcq: mockData?.mcq_ques,
    };

    const last60Days = {
      coding: mockData?.coding_ques_60days,
      webdev: mockData?.webdev_ques_60days,
      mcq: mockData?.mcq_ques_60days,
    };
    const expectedtargets = {
      coding: 60,
      webdev: 30,
      mcq: 60,
    };

    return { total, last60Days, expectedtargets };
  };

  const progress = calculateProgress();

  // All mock scores for comprehensive view
  const allMockScores = [
    {
      name: "HR",
      score: mockData?.hr_mock_score,
      date: mockData?.hr_mock_date,
    },
    {
      name: "Node",
      score: mockData?.node_mock_score,
      date: mockData?.node_mock_date,
    },
    {
      name: "Spring 1",
      score: mockData?.spring1_mock_score,
      date: mockData?.spring1_mock_date,
    },
    {
      name: "Spring 2",
      score: mockData?.spring2_mock_score,
      date: mockData?.spring2_mock_date,
    },

    {
      name: "Java Mid",
      score: mockData?.java_mid_mock_score,
      date: mockData?.java_mid_mock_date,
    },
    {
      name: "Java Full",
      score: mockData?.java_full_mock_score,
      date: mockData?.java_full_mock_date,
    },
    {
      name: "MERN Mid",
      score: mockData?.mern_mid_mock_score,
      date: mockData?.mern_mid_mock_date,
    },
    {
      name: "MERN Full",
      score: mockData?.mern_full_mock_score,
      date: mockData?.mern_full_mock_date,
    },
    {
      name: "Frontend Readiness",
      score: mockData?.frontend_pla_mock_score,
      date: mockData?.frontend_pla_mock_date,
    },
    {
      name: "DSA Readiness",
      score: mockData?.dsa_pla_mock_score,
      date: mockData?.dsa_pla_mock_date,
    },
    {
      name: "Java Placement",
      score: mockData?.java_pla_mock_score,
      date: mockData?.java_pla_mock_date,
    },
    {
      name: "MERN Placement",
      score: mockData?.mern_pla_mock_score,
      date: mockData?.mern_pla_mock_date,
    },
  ]
    .map((mock) => ({
      ...mock,
      score: Number(mock.score) || 0, // Convert to number and default to 0 if NaN or missing
    }))
    .filter((mock) => mock.score > 0); // Remove scores that are 0

  // Calculate average scores safely
  const averageScore =
    allMockScores.length > 0
      ? allMockScores.reduce((acc, curr) => acc + curr.score, 0) /
        allMockScores.length
      : 0; // Avoid NaN if no scores are available

  console.log("Processed Mock Scores:", allMockScores);
  console.log("Average Score:", averageScore);

  // Calculate completion status
  const last60days = [
    {
      name: "Coding Questions",
      value: parseInt(progress.last60Days.coding),
    },
    {
      name: "Dev Questions",
      value: parseInt(progress.last60Days.webdev),
    },
    {
      name: "MCQs",
      value: parseInt(progress.last60Days.mcq),
    },
  ];
  const alltime = [
    {
      name: "Coding Questions",
      value: parseInt(progress.total.coding),
    },
    {
      name: "Dev Questions",
      value: parseInt(progress.total.webdev),
    },
    {
      name: "MCQs",
      value: parseInt(progress.total.mcq),
    },
  ];

  const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#f59e0b"];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-gray-50">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-bold tracking-tight">
                {mockData?.user_name}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-blue-600">
                Batch {mockData?.batch_no}
              </Badge>
              <Badge variant="outline" className="text-purple-600">
                Track: {mockData?.user_track}
              </Badge>
              <Badge variant="outline" className="text-green-600">
                Enrolled:{" "}
                {new Date(mockData?.enrolled_date).toLocaleDateString()}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-4 py-2 rounded-xl text-lg font-semibold ${
                mockData?.user_placement_status === "Placed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {mockData?.user_placement_status || "Not Placed"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium text-blue-700">
              Average Score
            </CardTitle>
            <Star className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {averageScore.toFixed(1)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium text-green-700">
              PR Status
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {mockData?.user_atpr_status == "ATPR" ? "Yes" : "No"}
            </div>
            <p className="text-sm border border-green p-1 bg bg-green-100 mt-8 rounded text-green-600">
              You became Placement Ready {mockData?.first_pr_days_before} days
              ago
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Resume Ready
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {mockData?.Resume_Ready}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Communication
            </CardTitle>
            <Book className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {mockData?.communication_tag}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mocks">Mock Tests</TabsTrigger>
          <TabsTrigger value="progress">Learning Progress</TabsTrigger>
          <TabsTrigger value="resume">Resume Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Overall Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Completion Status</CardTitle>
              <CardDescription>
                Combined progress across all learning areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex justify-center gap-8">
                {/* First PieChart */}
                <div className="w-[50%] flex flex-col items-center pb-5 border-r-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={last60days}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {last60days.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <h2 className="font-bold">60 days progress</h2>
                </div>

                {/* Second PieChart */}
                <div className="w-[50%] flex flex-col items-center pb-5">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={alltime}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {alltime.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <h2 className="font-bold">All time progress</h2>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Performance Alert */}
          {mockData?.resume_mock_date && (
            <Alert
              className={
                mockData?.hr_mock_score >= 8 ? "bg-green-50" : "bg-yellow-50"
              }
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Performance Update</AlertTitle>
              <AlertDescription>
                Latest HR Mock Score: {mockData?.hr_mock_score}/10
                {mockData?.hr_mock_score >= 8
                  ? " - Excellent performance!"
                  : " - Room for improvement"}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="mocks" className="space-y-4">
          {/* Detailed Mock Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Mock Test Timeline</CardTitle>
              <CardDescription>
                Performance across all mock tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={allMockScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={120}
                    />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {/* Detailed Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress Details</CardTitle>
              <CardDescription>Last 60 days vs Target</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Coding Questions</span>
                    <span className="text-blue-600">
                      {progress.last60Days.coding} /{" "}
                      {progress.expectedtargets.coding}
                    </span>
                  </div>
                  <Progress
                    value={
                      (progress.last60Days.coding /
                        progress.expectedtargets.coding) *
                      100
                    }
                    className="h-3 bg-blue-100"
                  />
                  <p className="text-xs text-gray-500">
                    {(
                      (progress.last60Days.coding /
                        progress.expectedtargets.coding) *
                      100
                    ).toFixed(1)}
                    % completion rate
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Web Development</span>
                    <span className="text-green-600">
                      {progress.last60Days.webdev} /{" "}
                      {progress.expectedtargets.webdev}
                    </span>
                  </div>
                  <Progress
                    value={
                      (progress.last60Days.webdev /
                        progress.expectedtargets.webdev) *
                      100
                    }
                    className="h-3 bg-green-100"
                  />
                  <p className="text-xs text-gray-500">
                    {(
                      (progress.last60Days.webdev /
                        progress.expectedtargets.webdev) *
                      100
                    ).toFixed(1)}
                    % completion rate
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">MCQ Questions</span>
                    <span className="text-purple-600">
                      {progress.last60Days.mcq} / {progress.expectedtargets.mcq}
                    </span>
                  </div>
                  <Progress
                    value={
                      (progress.last60Days.mcq / progress.expectedtargets.mcq) *
                      100
                    }
                    className="h-3 bg-purple-100"
                  />
                  <p className="text-xs text-gray-500">
                    {(
                      (progress.last60Days.mcq / progress.expectedtargets.mcq) *
                      100
                    ).toFixed(1)}
                    % completion rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resume" className="space-y-4">
          {/* Resume Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl color-primary bg-blue-100 rounded px-2 py-1 text-blue-700">Latest Resume Status & feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div className="flex pl-2 pb-5 items-center">
                  <span className="pr-3 font-bold">Final Judgement: </span>
                  <Badge
                    variant="outline"
                    className={
                      mockData?.resume_ready === "Yes"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {mockData?.resume_ready === "Yes"
                      ? "Ready"
                      : "Needs Improvement"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {mockData?.resume_mock_feedback && (
                    <div>
                      <h4 className="font-semibold mb-2">Feedback Summary</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                        {mockData?.resume_mock_feedback}
                      </p>
                    </div>
                  )}

                  {mockData?.resume_feedback && (
                    <div>
                      <h4 className="font-semibold mb-2">Detailed Feedback</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        {mockData?.resume_feedback &&
                          mockData?.resume_feedback
                            .split(",")
                            .map((feedback: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />
                                <p className="text-sm text-gray-600">
                                  {feedback.trim()}
                                </p>
                              </div>
                            ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <FileText className="h-4 w-4" />
                        <a
                          href={mockData?.user_resume_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          View Latest Resume
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 mt-2 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Specialisation</p>
                          <p className="text-xl font-bold text-gray-600">
                            {mockData?.final_pr_type}
                          </p>
                        </div>
                      </div>

             
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearnerDashboard;
