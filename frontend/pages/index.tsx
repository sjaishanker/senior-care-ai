import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'

interface Resident {
  id: number
  name: string
  age: number
  room_number: string
  medical_history: string
  status: 'normal' | 'warning' | 'critical'
}

interface AlertSummary {
  critical: number
  high: number
  medium: number
  low: number
}

interface Facility {
  id: number
  name: string
  address: string
  capacity: number
  contact_number: string
  resident_count: number
}

export default function Dashboard() {
  const [residents, setResidents] = useState<Resident[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null)
  const [alertSummary, setAlertSummary] = useState<AlertSummary>({ critical: 0, high: 0, medium: 0, low: 0 })
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('dashboard')
  const router = useRouter()

  useEffect(() => {
    fetchFacilities()
  }, [])

  useEffect(() => {
    if (selectedFacility !== null) {
      fetchData()
    }
  }, [selectedFacility])

  const fetchFacilities = async () => {
    try {
      const response = await axios.get('/api/facilities')
      setFacilities(response.data)
      if (response.data.length > 0) {
        setSelectedFacility(response.data[0].id) // Default to first facility
      }
    } catch (error) {
      console.error('Error fetching facilities:', error)
    }
  }

  const fetchData = async () => {
    if (selectedFacility === null) return
    
    try {
      const [residentsRes, alertsRes] = await Promise.all([
        axios.get(`/api/residents?facility_id=${selectedFacility}`),
        axios.get(`/api/alerts/active-count?facility_id=${selectedFacility}`)
      ])
      
      const residentsData = residentsRes.data.map((r: any) => ({
        ...r,
        status: 'normal'
      }))
      setResidents(residentsData)
      setAlertSummary(alertsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResidentClick = (residentId: number) => {
    router.push(`/resident/${residentId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500'
      case 'warning': return 'bg-yellow-500'
      default: return 'bg-green-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Senior Care Dashboard</h1>
            <div className="flex items-center space-x-6">
              {/* Navigation Links */}
              <div className="flex items-center space-x-4">
                <Link href="/roi-dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
                  ROI Analytics
                </Link>
                <Link href="/family-portal" className="text-blue-600 hover:text-blue-800 font-medium">
                  Family Portal
                </Link>
                <Link href="/preventive-care" className="text-blue-600 hover:text-blue-800 font-medium">
                  Preventive Care
                </Link>
              </div>
              
              <div className="flex items-center space-x-2">
                <label htmlFor="facility-select" className="text-sm font-medium text-gray-700">
                  Select Facility:
                </label>
                <select
                  id="facility-select"
                  value={selectedFacility || ''}
                  onChange={(e) => setSelectedFacility(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name} ({facility.resident_count} residents)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedFacility && facilities.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">
                  {facilities.find(f => f.id === selectedFacility)?.name}
                </h3>
                <p className="text-sm text-blue-700">
                  {facilities.find(f => f.id === selectedFacility)?.address} • 
                  Capacity: {facilities.find(f => f.id === selectedFacility)?.capacity} residents
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">{residents.length}</p>
                <p className="text-sm text-blue-700">Current Residents</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Alert Summary</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded">
              <p className="text-red-600 text-2xl font-bold">{alertSummary.critical}</p>
              <p className="text-sm text-gray-600">Critical</p>
            </div>
            <div className="bg-orange-50 p-4 rounded">
              <p className="text-orange-600 text-2xl font-bold">{alertSummary.high}</p>
              <p className="text-sm text-gray-600">High</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-yellow-600 text-2xl font-bold">{alertSummary.medium}</p>
              <p className="text-sm text-gray-600">Medium</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-blue-600 text-2xl font-bold">{alertSummary.low}</p>
              <p className="text-sm text-gray-600">Low</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Residents Overview</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">Loading residents...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {residents.map((resident) => (
                  <div 
                    key={resident.id} 
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-300"
                    onClick={() => handleResidentClick(resident.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{resident.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(resident.status)}`}></div>
                    </div>
                    <p className="text-sm text-gray-600">Room {resident.room_number}</p>
                    <p className="text-sm text-gray-600">Age: {resident.age}</p>
                    <p className="text-xs text-gray-500 mt-1">{resident.medical_history}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}