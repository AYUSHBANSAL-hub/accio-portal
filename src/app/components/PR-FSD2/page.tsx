"use client"; // Indicates client-side component

// bled
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, User, Book, Code, CheckCircle, AlertCircle, Target, Award, Bookmark, Star, TrendingUp, FileText } from 'lucide-react';
import mockData from './mockdata';

const LearnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate progress percentages
  const calculateProgress = () => {
    const total = {
      coding: mockData.coding_ques,
      webdev: mockData.webdev_ques,
      mcq: mockData.mcq_ques,
    };
    
    const last60Days = {
      coding: mockData.coding_ques_60days,
      webdev: mockData.webdev_ques_60days,
      mcq: mockData.mcq_ques_60days,
    };
    
    return { total, last60Days };
  };

  const progress = calculateProgress();

  // All mock scores for comprehensive view
  const allMockScores = [
    { name: 'Frontend PLA', score: mockData.frontend_pla_mock_score, date: mockData.frontend_pla_mock_date },
    { name: 'Node', score: mockData.node_mock_score, date: mockData.node_mock_date },
    { name: 'DSA PLA', score: mockData.dsa_pla_mock_score, date: mockData.dsa_pla_mock_date },
    { name: 'Spring 1', score: mockData.spring1_mock_score, date: mockData.spring1_mock_date },
    { name: 'Spring 2', score: mockData.spring2_mock_score, date: mockData.spring2_mock_date },
    { name: 'Java PLA', score: mockData.java_pla_mock_score, date: mockData.java_pla_mock_date },
    { name: 'MERN PLA', score: mockData.mern_pla_mock_score, date: mockData.mern_pla_mock_date },
    { name: 'Java Mid', score: mockData.java_mid_mock_score, date: mockData.java_mid_mock_date },
    { name: 'Java Full', score: mockData.java_full_mock_score, date: mockData.java_full_mock_date },
    { name: 'MERN Mid', score: mockData.mern_mid_mock_score, date: mockData.mern_mid_mock_date },
    { name: 'MERN Full', score: mockData.mern_full_mock_score, date: mockData.mern_full_mock_date },
    { name: 'HR', score: mockData.hr_mock_score, date: mockData.hr_mock_date }
  ].filter(score => score.score > 0);

  // Calculate average scores
  const averageScore = allMockScores.reduce((acc, curr) => acc + curr.score, 0) / allMockScores.length;

  // Calculate completion status
  const completionData = [
    { name: 'Completed', value: progress.last60Days.coding + progress.last60Days.webdev + progress.last60Days.mcq },
    { name: 'Remaining', value: progress.total.coding + progress.total.webdev + progress.total.mcq - 
      (progress.last60Days.coding + progress.last60Days.webdev + progress.last60Days.mcq) }
  ];

  const COLORS = ['#4ade80', '#f87171', '#60a5fa', '#f59e0b'];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-gray-50">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-bold tracking-tight">{mockData.user_name}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-blue-600">
                Batch {mockData.batch_no}
              </Badge>
              <Badge variant="outline" className="text-purple-600">
                Track: {mockData.user_track}
              </Badge>
              <Badge variant="outline" className="text-green-600">
                Enrolled: {new Date(mockData.enrolled_date).toLocaleDateString()}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              mockData.user_placement_status === "Placed" 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {mockData.user_placement_status || "Not Placed"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Average Score</CardTitle>
            <Star className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{averageScore.toFixed(1)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">PR Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{mockData.user_atpr_status}</div>
            <p className="text-xs text-green-600">First PR: {mockData.first_pr_days_before} days ago</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">PLA Ready Status</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{mockData.user_pla_ready}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Communication</CardTitle>
            <Book className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{mockData.communication_tag}</div>
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
              <CardDescription>Combined progress across all learning areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Performance Alert */}
          <Alert className={mockData.hr_mock_score >= 8 ? "bg-green-50" : "bg-yellow-50"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Performance Update</AlertTitle>
            <AlertDescription>
              Latest HR Mock Score: {mockData.hr_mock_score}/10
              {mockData.hr_mock_score >= 8 
                ? " - Excellent performance!"
                : " - Room for improvement"}
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="mocks" className="space-y-4">
          {/* Detailed Mock Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Mock Test Timeline</CardTitle>
              <CardDescription>Performance across all mock tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={allMockScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
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
              <CardDescription>Last 60 days vs Overall Progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Coding Questions</span>
                    <span className="text-blue-600">
                      {progress.last60Days.coding} / {progress.total.coding}
                    </span>
                  </div>
                  <Progress 
                    value={(progress.last60Days.coding / progress.total.coding) * 100}
                    className="h-3 bg-blue-100"
                  />
                  <p className="text-xs text-gray-500">
                    {((progress.last60Days.coding / progress.total.coding) * 100).toFixed(1)}% completion rate
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Web Development</span>
                    <span className="text-green-600">
                      {progress.last60Days.webdev} / {progress.total.webdev}
                    </span>
                  </div>
                  <Progress 
                    value={(progress.last60Days.webdev / progress.total.webdev) * 100}
                    className="h-3 bg-green-100"
                  />
                  <p className="text-xs text-gray-500">
                    {((progress.last60Days.webdev / progress.total.webdev) * 100).toFixed(1)}% completion rate
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">MCQ Questions</span>
                    <span className="text-purple-600">
                      {progress.last60Days.mcq} / {progress.total.mcq}
                    </span>
                  </div>
                  <Progress 
                    value={(progress.last60Days.mcq / progress.total.mcq) * 100}
                    className="h-3 bg-purple-100"
                  />
                  <p className="text-xs text-gray-500">
                    {((progress.last60Days.mcq / progress.total.mcq) * 100).toFixed(1)}% completion rate
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
              <CardTitle>Resume Status</CardTitle>
              <CardDescription>Latest feedback and improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={
                    mockData.resume_ready === "Yes" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }>
                    {mockData.resume_ready === "Yes" ? "Ready" : "In Progress"}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Last Updated: {mockData.resume_mock_date}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Latest Mock Details</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Mock Type</p>
                      <p className="font-medium">{mockData.resume_mock_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Score</p>
                      <p className="font-medium text-blue-600">{mockData.resume_mock_score}/10</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Feedback Summary</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {mockData.resume_mock_feedback}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Detailed Feedback</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      {mockData.resume_feedback.split(',').map((feedback:any, index:number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />
                          <p className="text-sm text-gray-600">{feedback.trim()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Resources</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <FileText className="h-4 w-4" />
                        <a href={mockData.user_resume_link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          View Latest Resume
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PR and Project Section */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Project Readiness Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Final PR Type</p>
                          <p className="text-sm text-gray-600">{mockData.final_pr_type}</p>
                        </div>
                        <Badge variant="outline" className={
                          mockData.user_pla_ready === "Yes" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }>
                          {mockData.user_pla_ready === "Yes" ? "PLA Ready" : "In Progress"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium mb-1">Communication Skills</p>
                          <p className="text-sm text-gray-600">{mockData.communication_tag}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium mb-1">Mock Status</p>
                          <p className="text-sm text-gray-600">{mockData.all_mocks_cleared === "Yes" ? "All Cleared" : "Pending"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearnerDashboard;