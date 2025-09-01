import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'

interface Resident {
  id: number
  name: string
  age: number
  room_number: string
  medical_history: string
  emergency_contact: string
  emergency_contact_name: string
  admission_date: string
}

interface Vitals {
  id: number
  timestamp: string
  heart_rate: number
  blood_pressure_systolic: number
  blood_pressure_diastolic: number
  temperature: number
  spo2: number
  respiratory_rate: number
}

interface Alert {
  id: number
  type: string
  severity: string
  message: string
  timestamp: string
  resolved: boolean
}

interface HealthInsights {
  avgHeartRate: number
  avgBloodPressure: string
  avgTemperature: number
  avgSpO2: number
  vitalsStatus: 'normal' | 'warning' | 'critical'
  recentTrends: string[]
  riskFactors: string[]
}

export default function ResidentDetail() {
  const router = useRouter()
  const { id } = router.query
  const [resident, setResident] = useState<Resident | null>(null)
  const [vitals, setVitals] = useState<Vitals[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [insights, setInsights] = useState<HealthInsights | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchResidentData()
    }
  }, [id])

  const fetchResidentData = async () => {
    try {
      const [residentRes, vitalsRes, alertsRes] = await Promise.all([
        axios.get(`/api/residents/${id}`),
        axios.get(`/api/vitals/resident/${id}?hours=168`), // 7 days
        axios.get(`/api/alerts/resident/${id}`)
      ])
      
      setResident(residentRes.data)
      setVitals(vitalsRes.data)
      setAlerts(alertsRes.data)
      
      // Generate insights
      const healthInsights = generateHealthInsights(vitalsRes.data, alertsRes.data)
      setInsights(healthInsights)
    } catch (error) {
      console.error('Error fetching resident data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateHealthInsights = (vitalsData: Vitals[], alertsData: Alert[]): HealthInsights => {
    if (vitalsData.length === 0) {
      return {
        avgHeartRate: 0,
        avgBloodPressure: '0/0',
        avgTemperature: 0,
        avgSpO2: 0,
        vitalsStatus: 'normal',
        recentTrends: ['No data available'],
        riskFactors: []
      }
    }

    const recent = vitalsData.slice(0, 10) // Last 10 readings
    const avgHR = Math.round(recent.reduce((sum, v) => sum + v.heart_rate, 0) / recent.length)
    const avgSys = Math.round(recent.reduce((sum, v) => sum + v.blood_pressure_systolic, 0) / recent.length)
    const avgDia = Math.round(recent.reduce((sum, v) => sum + v.blood_pressure_diastolic, 0) / recent.length)
    const avgTemp = Math.round(recent.reduce((sum, v) => sum + v.temperature, 0) * 10 / recent.length) / 10
    const avgSpO2 = Math.round(recent.reduce((sum, v) => sum + v.spo2, 0) / recent.length)

    // Determine status
    let status: 'normal' | 'warning' | 'critical' = 'normal'
    const criticalAlerts = alertsData.filter(a => a.severity === 'critical' && !a.resolved).length
    const highAlerts = alertsData.filter(a => a.severity === 'high' && !a.resolved).length
    
    if (criticalAlerts > 0) status = 'critical'
    else if (highAlerts > 0 || avgHR > 100 || avgSys > 140 || avgTemp > 37.5 || avgSpO2 < 95) status = 'warning'

    // Generate trends
    const trends = []
    if (avgHR > 90) trends.push('Elevated heart rate pattern')
    if (avgSys > 140) trends.push('High blood pressure trend')
    if (avgTemp > 37.2) trends.push('Mild fever episodes')
    if (avgSpO2 < 96) trends.push('Oxygen saturation concerns')
    if (trends.length === 0) trends.push('Stable vital signs')

    // Generate risk factors
    const riskFactors = []
    if (resident?.medical_history.includes('Diabetes')) riskFactors.push('Diabetes management required')
    if (resident?.medical_history.includes('Heart Disease')) riskFactors.push('Cardiac monitoring needed')
    if (resident?.medical_history.includes('Hypertension')) riskFactors.push('Blood pressure monitoring')
    if (resident?.age && resident.age > 80) riskFactors.push('Advanced age considerations')

    return {
      avgHeartRate: avgHR,
      avgBloodPressure: `${avgSys}/${avgDia}`,
      avgTemperature: avgTemp,
      avgSpO2: avgSpO2,
      vitalsStatus: status,
      recentTrends: trends,
      riskFactors
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-orange-600 bg-orange-50'
      default: return 'text-green-600 bg-green-50'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading resident details...</div>
      </div>
    )
  }

  if (!resident) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Resident not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{resident.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(insights?.vitalsStatus || 'normal')}`}>
                {insights?.vitalsStatus || 'Normal'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Room Number</p>
              <p className="font-semibold">{resident.room_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="font-semibold">{resident.age} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Emergency Contact</p>
              <p className="font-semibold">{resident.emergency_contact_name}</p>
              <p className="text-sm text-gray-600">{resident.emergency_contact}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Medical History</p>
              <p className="font-semibold">{resident.medical_history}</p>
            </div>
          </div>
        </div>

        {/* Health Insights */}
        {insights && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Health Insights (Last 7 Days)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded">
                <p className="text-2xl font-bold text-blue-600">{insights.avgHeartRate}</p>
                <p className="text-sm text-gray-600">Avg Heart Rate (bpm)</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <p className="text-2xl font-bold text-purple-600">{insights.avgBloodPressure}</p>
                <p className="text-sm text-gray-600">Avg Blood Pressure</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <p className="text-2xl font-bold text-green-600">{insights.avgTemperature}°C</p>
                <p className="text-sm text-gray-600">Avg Temperature</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded">
                <p className="text-2xl font-bold text-indigo-600">{insights.avgSpO2}%</p>
                <p className="text-sm text-gray-600">Avg SpO2</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Recent Trends</h3>
                <ul className="space-y-1">
                  {insights.recentTrends.map((trend, idx) => (
                    <li key={idx} className="text-sm text-gray-600">• {trend}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Risk Factors</h3>
                <ul className="space-y-1">
                  {insights.riskFactors.map((factor, idx) => (
                    <li key={idx} className="text-sm text-orange-600">⚠ {factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Alerts ({alerts.length})</h2>
          <div className="space-y-3">
            {alerts.slice(0, 10).map((alert) => (
              <div key={alert.id} className={`p-3 rounded border ${getSeverityColor(alert.severity)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium capitalize">{alert.type.replace('_', ' ')}</p>
                    <p className="text-sm mt-1">{alert.message}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium uppercase">{alert.severity}</span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleDateString()} {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Vitals */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Vitals</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Heart Rate</th>
                  <th className="px-4 py-2 text-left">Blood Pressure</th>
                  <th className="px-4 py-2 text-left">Temperature</th>
                  <th className="px-4 py-2 text-left">SpO2</th>
                  <th className="px-4 py-2 text-left">Respiratory Rate</th>
                </tr>
              </thead>
              <tbody>
                {vitals.slice(0, 20).map((vital) => (
                  <tr key={vital.id} className="border-t">
                    <td className="px-4 py-2">{new Date(vital.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2">{vital.heart_rate} bpm</td>
                    <td className="px-4 py-2">{vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}</td>
                    <td className="px-4 py-2">{vital.temperature}°C</td>
                    <td className="px-4 py-2">{vital.spo2}%</td>
                    <td className="px-4 py-2">{vital.respiratory_rate} /min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}