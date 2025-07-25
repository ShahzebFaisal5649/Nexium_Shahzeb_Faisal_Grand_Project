// Core Analytics Types
export interface AnalyticsData {
  user_id: string
  date_range: {
    start: string
    end: string
  }
  metrics: AnalyticsMetrics
  charts: AnalyticsCharts
  insights: AnalyticsInsights
  generated_at: string
}

// Metrics Types
export interface AnalyticsMetrics {
  overview: OverviewMetrics
  applications: ApplicationMetrics
  resumes: ResumeMetrics
  performance: PerformanceMetrics
  trends: TrendMetrics
}

export interface OverviewMetrics {
  total_applications: number
  total_resumes: number
  total_interviews: number
  total_offers: number
  success_rate: number
  average_match_score: number
  active_applications: number
  response_rate: number
}

export interface ApplicationMetrics {
  applications_by_status: Record<string, number>
  applications_by_month: Array<{
    month: string
    count: number
  }>
  applications_by_company: Array<{
    company: string
    count: number
    success_rate: number
  }>
  applications_by_job_title: Array<{
    title: string
    count: number
    average_match_score: number
  }>
  response_times: {
    average: number
    median: number
    fastest: number
    slowest: number
  }
}

export interface ResumeMetrics {
  total_resumes: number
  master_resumes: number
  tailored_resumes: number
  average_tailoring_improvement: number
  most_used_resume: {
    id: string
    title: string
    usage_count: number
  }
  resume_performance: Array<{
    resume_id: string
    title: string
    applications: number
    interviews: number
    offers: number
    success_rate: number
  }>
}

export interface PerformanceMetrics {
  conversion_rates: {
    application_to_response: number
    response_to_interview: number
    interview_to_offer: number
    overall_success: number
  }
  time_metrics: {
    average_application_time: number
    average_response_time: number
    average_interview_scheduling: number
    average_decision_time: number
  }
  match_score_analysis: {
    average_score: number
    score_distribution: Record<string, number>
    score_vs_success_correlation: number
  }
}

export interface TrendMetrics {
  monthly_trends: Array<{
    month: string
    applications: number
    responses: number
    interviews: number
    offers: number
    success_rate: number
  }>
  quarterly_comparison: Array<{
    quarter: string
    metrics: OverviewMetrics
    change_from_previous: Record<string, number>
  }>
  skill_trends: Array<{
    skill: string
    demand_score: number
    match_frequency: number
    trend: 'increasing' | 'decreasing' | 'stable'
  }>
}

// Chart Data Types
export interface AnalyticsCharts {
  application_timeline: TimelineChart
  status_distribution: PieChart
  match_score_distribution: HistogramChart
  success_rate_by_company: BarChart
  monthly_performance: LineChart
  skill_demand: RadarChart
}

export interface ChartDataPoint {
  x: string | number
  y: number
  label?: string
  color?: string
}

export interface TimelineChart {
  type: 'timeline'
  data: Array<{
    date: string
    applications: number
    responses: number
    interviews: number
    offers: number
  }>
  config: {
    xAxis: string
    yAxis: string[]
    colors: string[]
  }
}

export interface PieChart {
  type: 'pie'
  data: Array<{
    label: string
    value: number
    color: string
  }>
  config: {
    total: number
    centerLabel?: string
  }
}

export interface HistogramChart {
  type: 'histogram'
  data: Array<{
    range: string
    count: number
    percentage: number
  }>
  config: {
    bins: number
    xLabel: string
    yLabel: string
  }
}

export interface BarChart {
  type: 'bar'
  data: Array<{
    category: string
    value: number
    color?: string
  }>
  config: {
    orientation: 'horizontal' | 'vertical'
    xLabel: string
    yLabel: string
  }
}

export interface LineChart {
  type: 'line'
  data: Array<{
    date: string
    series: Record<string, number>
  }>
  config: {
    xLabel: string
    yLabel: string
    series: Array<{
      key: string
      label: string
      color: string
    }>
  }
}

export interface RadarChart {
  type: 'radar'
  data: Array<{
    skill: string
    current_score: number
    market_demand: number
    improvement_potential: number
  }>
  config: {
    maxValue: number
    levels: number
  }
}

// Insights Types
export interface AnalyticsInsights {
  key_findings: KeyFinding[]
  recommendations: Recommendation[]
  alerts: Alert[]
  predictions: Prediction[]
}

export interface KeyFinding {
  id: string
  type: 'positive' | 'negative' | 'neutral'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  metric_value: number
  comparison?: {
    previous_value: number
    change_percentage: number
  }
}

export interface Recommendation {
  id: string
  category: 'resume' | 'application' | 'skills' | 'strategy'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  expected_impact: string
  action_items: string[]
  resources?: Array<{
    title: string
    url: string
    type: 'article' | 'video' | 'course' | 'tool'
  }>
}

export interface Alert {
  id: string
  type: 'warning' | 'info' | 'success'
  title: string
  message: string
  action_required: boolean
  action_url?: string
  created_at: string
}

export interface Prediction {
  id: string
  type: 'success_rate' | 'response_time' | 'market_trend'
  title: string
  description: string
  confidence: number
  time_horizon: '1_month' | '3_months' | '6_months' | '1_year'
  predicted_value: number
  factors: string[]
}

// Comparison Types
export interface ComparisonAnalytics {
  user_metrics: AnalyticsMetrics
  benchmark_metrics: AnalyticsMetrics
  comparison_insights: Array<{
    metric: string
    user_value: number
    benchmark_value: number
    performance: 'above' | 'below' | 'average'
    percentile: number
  }>
}

// Export Types
export interface AnalyticsExport {
  format: 'pdf' | 'xlsx' | 'csv' | 'json'
  data: AnalyticsData
  charts: boolean
  insights: boolean
  raw_data: boolean
  date_range: {
    start: string
    end: string
  }
}

// Filter Types
export interface AnalyticsFilters {
  date_range: {
    start: string
    end: string
  }
  companies?: string[]
  job_titles?: string[]
  statuses?: string[]
  resume_ids?: string[]
  match_score_range?: {
    min: number
    max: number
  }
}

// Dashboard Types
export interface AnalyticsDashboard {
  summary_cards: Array<{
    title: string
    value: number | string
    change?: number
    trend: 'up' | 'down' | 'stable'
    color: string
  }>
  quick_charts: {
    applications_timeline: TimelineChart
    status_pie: PieChart
    performance_bar: BarChart
  }
  recent_insights: KeyFinding[]
  top_recommendations: Recommendation[]
}

// Real-time Analytics Types
export interface RealTimeMetrics {
  active_applications: number
  pending_responses: number
  upcoming_interviews: number
  recent_activity: Array<{
    type: string
    description: string
    timestamp: string
  }>
  live_stats: {
    applications_today: number
    responses_today: number
    interviews_this_week: number
  }
}

// Goal Tracking Types
export interface Goal {
  id: string
  user_id: string
  type: 'applications' | 'interviews' | 'offers' | 'response_rate' | 'match_score'
  title: string
  description: string
  target_value: number
  current_value: number
  deadline: string
  status: 'active' | 'completed' | 'paused' | 'failed'
  created_at: string
  updated_at: string
}

export interface GoalProgress {
  goal_id: string
  progress_percentage: number
  days_remaining: number
  on_track: boolean
  projected_completion: string
  milestones: Array<{
    date: string
    value: number
    note?: string
  }>
}

// API Response Types
export interface AnalyticsResponse {
  success: boolean
  data?: AnalyticsData
  error?: string
  message?: string
}

export interface MetricsResponse {
  success: boolean
  data?: AnalyticsMetrics
  error?: string
  message?: string
}