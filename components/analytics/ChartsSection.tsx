import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from "recharts"

// Mock data for different chart types
const timelineData = [
  { month: "Jan", applications: 4, responses: 1, interviews: 0 },
  { month: "Feb", applications: 6, responses: 2, interviews: 1 },
  { month: "Mar", applications: 8, responses: 3, interviews: 2 },
  { month: "Apr", applications: 5, responses: 2, interviews: 1 },
  { month: "May", applications: 7, responses: 3, interviews: 2 },
  { month: "Jun", applications: 8, responses: 3, interviews: 2 },
]

const statusData = [
  { name: "Applied", value: 12, color: "#8884d8" },
  { name: "Screening", value: 4, color: "#82ca9d" },
  { name: "Interview", value: 3, color: "#ffc658" },
  { name: "Offer", value: 2, color: "#ff7300" },
  { name: "Rejected", value: 3, color: "#ff0000" },
]

const resumePerformanceData = [
  { name: "Software Engineer Resume", applications: 8, responses: 3, score: 82 },
  { name: "Frontend Developer Resume", applications: 6, responses: 2, score: 78 },
  { name: "Full Stack Resume", applications: 4, responses: 2, score: 85 },
  { name: "Senior Developer Resume", applications: 3, responses: 1, score: 80 },
]

const matchScoreData = [
  { range: "90-100%", count: 2 },
  { range: "80-89%", count: 5 },
  { range: "70-79%", count: 8 },
  { range: "60-69%", count: 6 },
  { range: "50-59%", count: 3 },
]

interface ChartsSectionProps {
  type: "timeline" | "status" | "resume-performance" | "match-scores"
}

export function ChartsSection({ type }: ChartsSectionProps) {
  switch (type) {
    case "timeline":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="applications" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Applications"
            />
            <Line 
              type="monotone" 
              dataKey="responses" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="Responses"
            />
            <Line 
              type="monotone" 
              dataKey="interviews" 
              stroke="#ffc658" 
              strokeWidth={2}
              name="Interviews"
            />
          </LineChart>
        </ResponsiveContainer>
      )

    case "status":
      return (
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case "resume-performance":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={resumePerformanceData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="applications" fill="#8884d8" name="Applications" />
            <Bar dataKey="responses" fill="#82ca9d" name="Responses" />
          </BarChart>
        </ResponsiveContainer>
      )

    case "match-scores":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={matchScoreData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" name="Applications" />
          </BarChart>
        </ResponsiveContainer>
      )

    default:
      return <div>Chart type not supported</div>
  }
}
