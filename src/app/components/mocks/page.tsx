"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useReportStore } from "@/app/state/store"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Award,
  BookOpen,
  Code,
  Layout,
  MessageSquare,
  Server,
  Star,
  Calendar,
  ChevronLeft,
  ArrowRight,
  ArrowUpRight,
  Lightbulb,
  Target,
  Zap,
} from "lucide-react"

// Helper function to extract score from placement_readiness
const extractScore = (placementReadiness: string | undefined): number => {
  if (!placementReadiness) return 0

  // Handle different formats like "3/10" or "3/6"
  const match = placementReadiness.match(/(\d+)\/(\d+)/)
  if (match) {
    const [_, numerator, denominator] = match
    // Normalize to a 10-point scale if needed
    return denominator === "10"
      ? Number.parseInt(numerator, 10)
      : Math.round((Number.parseInt(numerator, 10) / Number.parseInt(denominator, 10)) * 10)
  }

  // Try to extract just a number
  const numMatch = placementReadiness.match(/(\d+)/)
  return numMatch ? Number.parseInt(numMatch[1], 10) : 0
}

// Helper function to determine if feedback is positive or negative
const determineStatus = (feedback: string | undefined): "positive" | "negative" | "neutral" => {
  if (!feedback) return "neutral"

  // Check if it's a not applicable message
  const notApplicablePatterns = [
    "not applicable",
    "n/a",
    "not provided",
    "not evaluated",
    "not available",
    "not assessed",
  ]

  for (const pattern of notApplicablePatterns) {
    if (feedback.toLowerCase().includes(pattern)) return "neutral"
  }

  // Check for negative patterns
  const negativePatterns = ["not", "unable", "needs", "improve", "lack", "poor", "weak", "failed", "struggle"]

  for (const pattern of negativePatterns) {
    if (feedback.toLowerCase().includes(pattern)) return "negative"
  }

  // Check for positive patterns
  const positivePatterns = ["good", "great", "excellent", "strong", "clear", "well", "success", "proficient", "able"]

  for (const pattern of positivePatterns) {
    if (feedback.toLowerCase().includes(pattern)) return "positive"
  }

  return "neutral"
}

// Update the formatValue function to return null for unevaluated items
const formatValue = (value: string | undefined): string | null => {
  if (!value) return null

  const notApplicablePatterns = [
    "not applicable",
    "n/a",
    "not provided",
    "not evaluated",
    "not available",
    "NA",
    "not assessed",
  ]

  for (const pattern of notApplicablePatterns) {
    if (value.toLowerCase().includes(pattern)) return null
  }

  return value
}

// Format date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A"

  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (e) {
    return dateString // Return the original string if parsing fails
  }
}

// Main assessment report component
export default function AssessmentReport() {
  const router = useRouter()
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [assessments, setAssessments] = useState<any[]>([])
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("")
  const [activeSection, setActiveSection] = useState<string>("summary")

  const { stateAvailableReports, userId } = useReportStore((state) => state)

  useEffect(() => {
    const getAssessmentData = () => {
      if (stateAvailableReports.All_mock_cons && stateAvailableReports.All_mock_cons.length > 0) {
        // Process the assessments
        const processedAssessments = stateAvailableReports.All_mock_cons.map((assessment: any) => {
          // Parse the GPT field which contains the assessment data
          let parsedGPT = assessment.GPT
          if (typeof parsedGPT === "string") {
            try {
              parsedGPT = JSON.parse(parsedGPT)
            } catch (e) {
              console.error("Error parsing GPT data:", e)
              parsedGPT = {}
            }
          }

          return {
            id: assessment.sessionId || `session-${Math.random().toString(36).substring(2, 9)}`,
            sessionType: assessment.sessionType || "Assessment",
            sessionDate: assessment.sessionDate || assessment.submission_date,
            fullName: assessment.fullName || "User",
            ...parsedGPT,
            score:assessment.score
          }
        })
        console.log(processedAssessments);
        setAssessments(processedAssessments)

        // Set the first assessment as selected by default
        if (processedAssessments.length > 0) {
          setSelectedAssessmentId(processedAssessments[0].id)
          setData(processedAssessments[0])
        }

        setLoading(false)
      }
    }

    getAssessmentData()
  }, [stateAvailableReports])

  // Handle assessment selection change
  const handleAssessmentChange = (id: string) => {
    setSelectedAssessmentId(id)
    const selectedAssessment = assessments.find((assessment) => assessment.id === id)
    if (selectedAssessment) {
      setData(selectedAssessment)
    }
  }

  // Extract score from placement_readiness
  // const score = data ? extractScore(data.final_feedback?.placement_readiness) : 0
  const score = data ? data.score: 0
  console.log(data, "all data");
  console.log(assessments, "mock score");

  // Get all improvements
  const allImprovements = data
    ? [
        data.resume_feedback?.improvements,
        data.coding_assessment?.improvements,
        data.sql_assessment?.improvements,
        data.theory_assessment?.improvements,
        data.frontend_assessment?.improvements,
        data.backend_assessment?.improvements,
        data.communication_skills?.improvements,
      ]
        .map((item) => formatValue(item))
        .filter((item, index, self) => item !== null && self.indexOf(item) === index)
    : []

  // Get key strengths
  const getStrengths = () => {
    const strengths = []

    if (
      data?.coding_assessment?.problem_solving &&
      determineStatus(data.coding_assessment.problem_solving) === "positive"
    ) {
      strengths.push({
        title: "Problem Solving",
        description: data.coding_assessment.problem_solving,
        icon: <Code className="h-5 w-5" />,
      })
    }

    if (
      data?.frontend_assessment?.component_structure &&
      determineStatus(data.frontend_assessment.component_structure) === "positive"
    ) {
      strengths.push({
        title: "Frontend Development",
        description: data.frontend_assessment.component_structure,
        icon: <Layout className="h-5 w-5" />,
      })
    }

    if (
      data?.backend_assessment?.architecture &&
      determineStatus(data.backend_assessment.architecture) === "positive"
    ) {
      strengths.push({
        title: "Backend Development",
        description: data.backend_assessment.architecture,
        icon: <Server className="h-5 w-5" />,
      })
    }

    if (data?.communication_skills?.clarity && determineStatus(data.communication_skills.clarity) === "positive") {
      strengths.push({
        title: "Communication",
        description: data.communication_skills.clarity,
        icon: <MessageSquare className="h-5 w-5" />,
      })
    }

    return strengths.slice(0, 3) // Return top 3 strengths
  }

  // Get skill scores
  const getSkillScores = () => {
    const skills = [
      {
        name: "Coding",
        score:
          determineStatus(data?.coding_assessment?.problem_solving) === "positive"
            ? 80
            : determineStatus(data?.coding_assessment?.problem_solving) === "negative"
              ? 40
              : 60,
        icon: <Code className="h-4 w-4" />,
      },
      {
        name: "Frontend",
        score:
          determineStatus(data?.frontend_assessment?.component_structure) === "positive"
            ? 80
            : determineStatus(data?.frontend_assessment?.component_structure) === "negative"
              ? 40
              : 60,
        icon: <Layout className="h-4 w-4" />,
      },
      {
        name: "Backend",
        score:
          determineStatus(data?.backend_assessment?.architecture) === "positive"
            ? 80
            : determineStatus(data?.backend_assessment?.architecture) === "negative"
              ? 40
              : 60,
        icon: <Server className="h-4 w-4" />,
      },
      {
        name: "Communication",
        score:
          determineStatus(data?.communication_skills?.clarity) === "positive"
            ? 80
            : determineStatus(data?.communication_skills?.clarity) === "negative"
              ? 40
              : 60,
        icon: <MessageSquare className="h-4 w-4" />,
      },
    ]

    return skills.filter((skill) => skill.score > 0)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center text-xl text-gray-600">Loading assessment data...</div>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Assessment Data</h2>
          <p className="text-gray-600">No assessment reports are available for this user.</p>
        </div>
      </div>
    )
  }

  const strengths = getStrengths()
  const skillScores = getSkillScores()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <button
              onClick={() => router.push(`/?userId=${userId}`)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Reports
            </button>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              Assessment Report
              {data.fullName && <span className="ml-1">for {data.fullName}</span>}
            </h1>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(data.submission_date || data.sessionDate)}</span>
              <span className="mx-2">•</span>
              <span>{data.sessionType || "Assessment"}</span>
            </div>
          </div>

          {assessments.length > 1 && (
            <div className="w-full md:w-64 mt-4 md:mt-0">
              <Select value={selectedAssessmentId} onValueChange={handleAssessmentChange}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Select an assessment" />
                </SelectTrigger>
                <SelectContent>
                  {assessments.map((assessment) => (
                    <SelectItem key={assessment.id} value={assessment.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{assessment.sessionType}</span>
                        <span className="text-xs text-gray-400">{formatDate(assessment.sessionDate)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex overflow-x-auto mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveSection("summary")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeSection === "summary" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveSection("next-steps")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeSection === "next-steps" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Next Steps
          </button>
          <button
            onClick={() => setActiveSection("skills")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeSection === "skills" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Skills Assessment
          </button>
        </div>

        {/* Summary Section */}
        {activeSection === "summary" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                  <h3 className="font-medium text-sm opacity-90">Placement Readiness</h3>
                </div>
                <CardContent className="p-6 flex items-center">
                  <div className="relative w-20 h-20 mr-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-600">{data.score}</span>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e6effd" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="10"
                        strokeDasharray={`${(2 * Math.PI * 45 * score) / 10} ${(2 * Math.PI * 45 * (10 - score)) / 10}`}
                        strokeDashoffset={2 * Math.PI * 45 * 0.25}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Score</div>
                    <div className="text-xl font-bold text-gray-800">{data.score}/10</div>
                    {/*
                    {data.final_feedback?.placement_readiness && (
                      <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
                        {data.final_feedback.placement_readiness}
                      </Badge>
                    )}
                    */}
                  </div>
                </CardContent>
              </Card>

              {/* <Card className="border-0 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
                  <h3 className="font-medium text-sm opacity-90">Recommended Role</h3>
                </div>
                <CardContent className="p-6 flex items-center">
                  <Award className="h-12 w-12 text-purple-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Best Fit</div>
                    <div className="text-xl font-bold text-gray-800">
                      {data.final_feedback?.recommended_role || "Not Specified"}
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                  <h3 className="font-medium text-sm opacity-90">Key Strengths</h3>
                </div>
                <CardContent className="p-6">
                  {strengths.length > 0 ? (
                    <ul className="space-y-2">
                      {strengths.map((strength, index) => (
                        <li key={index} className="flex items-center">
                          <div className="bg-green-100 p-1 rounded-full mr-2">{strength.icon}</div>
                          <span className="text-gray-800 font-medium">{strength.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-sm">No specific strengths identified</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Overall Performance */}
            {formatValue(data.final_feedback?.overall_performance) && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Star className="h-5 w-5 text-amber-500 mr-2" />
                    Overall Performance
                  </h3>
                  <p className="text-gray-700">{formatValue(data.final_feedback?.overall_performance)}</p>
                </CardContent>
              </Card>
            )}

            {/* Key Areas for Improvement */}
            {allImprovements.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Target className="h-5 w-5 text-red-500 mr-2" />
                    Key Areas for Improvement
                  </h3>
                  <div className="space-y-3">
                    {allImprovements.slice(0, 3).map((improvement, index) => (
                      <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg border border-red-100">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-gray-700 font-medium">{improvement}</p>
                      </div>
                    ))}
                    {allImprovements.length > 3 && (
                      <button
                        onClick={() => setActiveSection("next-steps")}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        View all improvement areas
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skill Scores */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Zap className="h-5 w-5 text-blue-500 mr-2" />
                  Skill Assessment
                </h3>
                <div className="space-y-4">
                  {skillScores.map((skill, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-1 rounded-full mr-2">{skill.icon}</div>
                          <span className="text-gray-700 font-medium">{skill.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{skill.score}%</span>
                      </div>
                      <Progress value={skill.score} className="h-2" />
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveSection("skills")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-2"
                  >
                    View detailed skills assessment
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Next Steps Section */}
        {activeSection === "next-steps" && (
          <div className="space-y-6">
            {/* Action Plan */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                  Action Plan
                </h3>
                {formatValue(data.final_feedback?.next_steps) ? (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-gray-800 font-medium">{formatValue(data.final_feedback?.next_steps)}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No specific next steps provided.</p>
                )}
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Target className="h-5 w-5 text-red-500 mr-2" />
                  Areas for Improvement
                </h3>
                {allImprovements.length > 0 ? (
                  <div className="space-y-3">
                    {allImprovements.map((improvement, index) => (
                      <div key={index} className="flex items-start p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="bg-white rounded-full p-1 mr-3 flex-shrink-0">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </div>
                        <p className="text-gray-700 font-medium">{improvement}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No specific improvements suggested.</p>
                )}
              </CardContent>
            </Card>

            {/* Improvement Areas Summary */}
            {formatValue(data.final_feedback?.improvement_areas) && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                    Improvement Areas Summary
                  </h3>
                  <p className="text-gray-700">{formatValue(data.final_feedback?.improvement_areas)}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Skills Assessment Section */}
        {activeSection === "skills" && (
          <div className="space-y-6">
            {/* Technical Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coding Assessment */}
              {Object.keys(data.coding_assessment || {}).some((key) => formatValue(data.coding_assessment?.[key])) && (
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                    <h3 className="font-medium flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Coding Skills
                    </h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {formatValue(data.coding_assessment?.problem_solving) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Problem Solving</h4>
                          <p className="text-gray-800">{formatValue(data.coding_assessment.problem_solving)}</p>
                        </div>
                      )}

                      {formatValue(data.coding_assessment?.code_quality) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Code Quality</h4>
                          <p className="text-gray-800">{formatValue(data.coding_assessment.code_quality)}</p>
                        </div>
                      )}

                      {formatValue(data.coding_assessment?.improvements) && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                          <h4 className="text-sm font-medium text-red-600 mb-1">Areas to Improve</h4>
                          <p className="text-gray-800 font-medium">
                            {formatValue(data.coding_assessment.improvements)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Frontend Assessment */}
              {Object.keys(data.frontend_assessment || {}).some((key) =>
                formatValue(data.frontend_assessment?.[key]),
              ) && (
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 text-white">
                    <h3 className="font-medium flex items-center">
                      <Layout className="h-5 w-5 mr-2" />
                      Frontend Development
                    </h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {formatValue(data.frontend_assessment?.component_structure) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Component Structure</h4>
                          <p className="text-gray-800">{formatValue(data.frontend_assessment.component_structure)}</p>
                        </div>
                      )}

                      {formatValue(data.frontend_assessment?.state_management) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">State Management</h4>
                          <p className="text-gray-800">{formatValue(data.frontend_assessment.state_management)}</p>
                        </div>
                      )}

                      {formatValue(data.frontend_assessment?.improvements) && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                          <h4 className="text-sm font-medium text-red-600 mb-1">Areas to Improve</h4>
                          <p className="text-gray-800 font-medium">
                            {formatValue(data.frontend_assessment.improvements)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Backend Assessment */}
              {Object.keys(data.backend_assessment || {}).some((key) =>
                formatValue(data.backend_assessment?.[key]),
              ) && (
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                    <h3 className="font-medium flex items-center">
                      <Server className="h-5 w-5 mr-2" />
                      Backend Development
                    </h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {formatValue(data.backend_assessment?.architecture) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Architecture</h4>
                          <p className="text-gray-800">{formatValue(data.backend_assessment.architecture)}</p>
                        </div>
                      )}

                      {formatValue(data.backend_assessment?.api_design) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">API Design</h4>
                          <p className="text-gray-800">{formatValue(data.backend_assessment.api_design)}</p>
                        </div>
                      )}

                      {formatValue(data.backend_assessment?.improvements) && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                          <h4 className="text-sm font-medium text-red-600 mb-1">Areas to Improve</h4>
                          <p className="text-gray-800 font-medium">
                            {formatValue(data.backend_assessment.improvements)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Communication Skills */}
              {Object.keys(data.communication_skills || {}).some((key) =>
                formatValue(data.communication_skills?.[key]),
              ) && (
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
                    <h3 className="font-medium flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Communication Skills
                    </h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {formatValue(data.communication_skills?.clarity) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Clarity</h4>
                          <p className="text-gray-800">{formatValue(data.communication_skills.clarity)}</p>
                        </div>
                      )}

                      {formatValue(data.communication_skills?.confidence) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Confidence</h4>
                          <p className="text-gray-800">{formatValue(data.communication_skills.confidence)}</p>
                        </div>
                      )}

                      {formatValue(data.communication_skills?.improvements) && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                          <h4 className="text-sm font-medium text-red-600 mb-1">Areas to Improve</h4>
                          <p className="text-gray-800 font-medium">
                            {formatValue(data.communication_skills.improvements)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-md">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold mb-2">Ready to improve your skills?</h3>
                  <p className="opacity-90">Focus on your improvement areas and follow the action plan.</p>
                </div>
                <button
                  onClick={() => setActiveSection("next-steps")}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium flex items-center hover:bg-blue-50 transition-colors"
                >
                  View Action Plan
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}