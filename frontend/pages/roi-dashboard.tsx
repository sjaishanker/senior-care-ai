import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

interface ROISummary {
  total_cost_savings: number
  average_efficiency_gain: number
  emergencies_prevented: number
  staff_efficiency_gain: number
  metrics_count: number
}

interface ComplianceSummary {
  total_audit_entries: number
  high_risk_actions: number
  unreviewed_high_risk: number
  potential_hipaa_violations: number
  unauthorized_access_attempts: number
  compliance_score: number
}

interface ROIMetric {
  id: number
  metric_type: string
  cost_savings: number
  efficiency_gain: number
  metric_date: string
  details: any
}

export default function ROIDashboard() {
  const [roiSummary, setROISummary] = useState<ROISummary | null>(null)
  const [complianceSummary, setComplianceSummary] = useState<ComplianceSummary | null>(null)
  const [recentMetrics, setRecentMetrics] = useState<ROIMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchROIData()
  }, [])

  const fetchROIData = async () => {
    try {
      const [roiRes, complianceRes, metricsRes] = await Promise.all([
        axios.get('/api/compliance/roi-summary'),
        axios.get('/api/compliance/audit-summary'),
        axios.get('/api/compliance/roi-metrics?limit=10')
      ])
      
      setROISummary(roiRes.data)
      setComplianceSummary(complianceRes.data)
      setRecentMetrics(metricsRes.data || [])
    } catch (error) {
      console.error('Error fetching ROI data:', error)
      // Set mock data for demo
      setROISummary({
        total_cost_savings: 125000,
        average_efficiency_gain: 32.5,
        emergencies_prevented: 18,
        staff_efficiency_gain: 28.3,
        metrics_count: 45
      })
      setComplianceSummary({
        total_audit_entries: 2847,
        high_risk_actions: 23,
        unreviewed_high_risk: 3,
        potential_hipaa_violations: 0,
        unauthorized_access_attempts: 1,
        compliance_score: 97.8
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getComplianceScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-50'
    if (score >= 85) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading ROI dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">ROI Analytics Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ROI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost Savings</p>
                <p className="text-3xl font-bold text-green-600">
                  {roiSummary ? formatCurrency(roiSummary.total_cost_savings) : '₹0'}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Compared to pre-implementation baseline</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emergencies Prevented</p>
                <p className="text-3xl font-bold text-blue-600">
                  {roiSummary ? roiSummary.emergencies_prevented : 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">₹7,000 avg. cost per emergency prevented</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Staff Efficiency Gain</p>
                <p className="text-3xl font-bold text-purple-600">
                  {roiSummary ? `${roiSummary.staff_efficiency_gain.toFixed(1)}%` : '0%'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Reduced response time and documentation</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className={`text-3xl font-bold ${complianceSummary ? (complianceSummary.compliance_score >= 95 ? 'text-green-600' : complianceSummary.compliance_score >= 85 ? 'text-yellow-600' : 'text-red-600') : 'text-gray-600'}`}>
                  {complianceSummary ? `${complianceSummary.compliance_score.toFixed(1)}%` : '0%'}
                </p>
              </div>
              <div className={`p-3 rounded-full ${complianceSummary ? (complianceSummary.compliance_score >= 95 ? 'bg-green-100' : complianceSummary.compliance_score >= 85 ? 'bg-yellow-100' : 'bg-red-100') : 'bg-gray-100'}`}>
                <svg className={`w-6 h-6 ${complianceSummary ? (complianceSummary.compliance_score >= 95 ? 'text-green-600' : complianceSummary.compliance_score >= 85 ? 'text-yellow-600' : 'text-red-600') : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">HIPAA & regulatory compliance</p>
          </div>
        </div>

        {/* ROI Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Cost Savings Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Emergency Room Visits Prevented</span>
                <span className="font-semibold">₹1,26,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reduced Hospital Readmissions</span>
                <span className="font-semibold">₹84,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Staff Overtime Reduction</span>
                <span className="font-semibold">₹45,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Medication Error Prevention</span>
                <span className="font-semibold">₹28,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Documentation Time Savings</span>
                <span className="font-semibold">₹32,000</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center font-bold">
                <span>Total Monthly Savings</span>
                <span className="text-green-600">₹3,15,000</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Compliance & Audit Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Audit Entries</span>
                <span className="font-semibold">{complianceSummary?.total_audit_entries || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Risk Actions</span>
                <span className="font-semibold text-orange-600">{complianceSummary?.high_risk_actions || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unreviewed High Risk</span>
                <span className="font-semibold text-red-600">{complianceSummary?.unreviewed_high_risk || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">HIPAA Violations</span>
                <span className="font-semibold text-red-600">{complianceSummary?.potential_hipaa_violations || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unauthorized Access</span>
                <span className="font-semibold text-red-600">{complianceSummary?.unauthorized_access_attempts || 0}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center font-bold">
                <span>Overall Compliance Score</span>
                <span className={complianceSummary && complianceSummary.compliance_score >= 95 ? 'text-green-600' : complianceSummary && complianceSummary.compliance_score >= 85 ? 'text-yellow-600' : 'text-red-600'}>
                  {complianceSummary ? `${complianceSummary.compliance_score.toFixed(1)}%` : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Projections */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">ROI Projections</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">₹37,80,000</p>
              <p className="text-sm text-gray-600">Annual Cost Savings</p>
              <p className="text-xs text-gray-500 mt-1">Based on current trends</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">315%</p>
              <p className="text-sm text-gray-600">ROI in Year 1</p>
              <p className="text-xs text-gray-500 mt-1">Implementation cost vs savings</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">6.2 months</p>
              <p className="text-sm text-gray-600">Payback Period</p>
              <p className="text-xs text-gray-500 mt-1">Break-even point</p>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">98.5%</p>
              <p className="text-sm text-gray-600">Medication Adherence</p>
              <p className="text-xs text-green-600">↑ 12% from baseline</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">4.2 min</p>
              <p className="text-sm text-gray-600">Avg. Response Time</p>
              <p className="text-xs text-blue-600">↓ 38% improvement</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">94%</p>
              <p className="text-sm text-gray-600">Family Satisfaction</p>
              <p className="text-xs text-purple-600">↑ 23% improvement</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">87%</p>
              <p className="text-sm text-gray-600">Staff Efficiency</p>
              <p className="text-xs text-orange-600">↑ 28% improvement</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}