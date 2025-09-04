import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { 
  FaUserFriends, 
  FaBell, 
  FaHeartbeat, 
  FaChartLine, 
  FaHome,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaUserMd,
  FaCalendarCheck,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaSearch,
  FaCog,
  FaSignOutAlt,
  FaPills,
  FaWalking,
  FaBed
} from 'react-icons/fa'

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

// Mock data for charts
const mockVitalsData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  heartRate: [72, 75, 73, 78, 76, 74, 72],
  bloodPressure: [120, 118, 122, 125, 121, 119, 120]
}

const mockActivityData = {
  walking: 65,
  resting: 20,
  activities: 15
}

export default function Dashboard() {
  const [residents, setResidents] = useState<Resident[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null)
  const [alertSummary, setAlertSummary] = useState<AlertSummary>({ critical: 0, high: 0, medium: 0, low: 0 })
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
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
        setSelectedFacility(response.data[0].id)
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
        status: Math.random() > 0.7 ? 'warning' : Math.random() > 0.9 ? 'critical' : 'normal'
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

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'critical': return 'border-red-300 hover:border-red-400'
      case 'warning': return 'border-yellow-300 hover:border-yellow-400'
      default: return 'border-green-300 hover:border-green-400'
    }
  }

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.room_number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome />, active: true },
    { id: 'residents', label: 'Residents', icon: <FaUserFriends />, active: false },
    { id: 'alerts', label: 'Alerts', icon: <FaBell />, badge: alertSummary.critical + alertSummary.high, active: false },
    { id: 'vitals', label: 'Vitals Monitoring', icon: <FaHeartbeat />, active: false },
    { id: 'medications', label: 'Medications', icon: <FaPills />, active: false },
    { id: 'activities', label: 'Activities', icon: <FaWalking />, active: false },
    { id: 'preventive', label: 'Preventive Care', icon: <FaCalendarCheck />, active: false, link: '/preventive-care' },
    { id: 'family', label: 'Family Portal', icon: <FaUserMd />, active: false, link: '/family-portal' },
    { id: 'roi', label: 'ROI Analytics', icon: <FaChartLine />, active: false, link: '/roi-dashboard' },
    { id: 'reports', label: 'Reports', icon: <FaClipboardList />, active: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white shadow-xl border-r border-gray-200`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className={`${sidebarOpen ? 'block' : 'hidden'} transition-all`}>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ElderCare AI
                </h1>
                <p className="text-xs text-gray-500 mt-1">Senior Care Dashboard</p>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {sidebarOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                item.link ? (
                  <Link key={item.id} href={item.link}>
                    <li className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                      ${item.active ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-l-4 border-blue-600' : 
                      'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}>
                      <div className="flex items-center">
                        <span className={`text-xl ${!sidebarOpen && 'mx-auto'}`}>{item.icon}</span>
                        {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                      </div>
                      {sidebarOpen && item.badge && item.badge > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </li>
                  </Link>
                ) : (
                  <li key={item.id} 
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                      ${item.active ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-l-4 border-blue-600' : 
                      'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}>
                    <div className="flex items-center">
                      <span className={`text-xl ${!sidebarOpen && 'mx-auto'}`}>{item.icon}</span>
                      {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                    </div>
                    {sidebarOpen && item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </li>
                )
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
              {sidebarOpen && (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    AD
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-700">Admin User</p>
                    <p className="text-xs text-gray-500">admin@eldercare.ai</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <FaCog className="text-lg" />
                </button>
                <button className="text-gray-400 hover:text-red-600 transition-colors">
                  <FaSignOutAlt className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="relative w-96">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search residents, rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedFacility || ''}
                  onChange={(e) => setSelectedFacility(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name}
                    </option>
                  ))}
                </select>
                
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <FaBell className="text-xl" />
                  {(alertSummary.critical + alertSummary.high) > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Facility Overview Card */}
          {selectedFacility && facilities.length > 0 && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {facilities.find(f => f.id === selectedFacility)?.name}
                  </h2>
                  <p className="text-blue-100 mb-4">
                    {facilities.find(f => f.id === selectedFacility)?.address}
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <FaBed className="mr-2" />
                      <span className="text-sm">Capacity: {facilities.find(f => f.id === selectedFacility)?.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUserFriends className="mr-2" />
                      <span className="text-sm">Current: {residents.length}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm">Occupancy: {Math.round((residents.length / (facilities.find(f => f.id === selectedFacility)?.capacity || 1)) * 100)}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-bold">{residents.filter(r => r.status === 'normal').length}</p>
                  <p className="text-blue-100">Stable Residents</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Critical Alerts</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{alertSummary.critical}</p>
                  <p className="text-xs text-red-600 mt-2">↑ 12% from yesterday</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <FaExclamationTriangle className="text-2xl text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">High Priority</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{alertSummary.high}</p>
                  <p className="text-xs text-yellow-600 mt-2">→ Same as yesterday</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FaInfoCircle className="text-2xl text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Medium Alerts</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{alertSummary.medium}</p>
                  <p className="text-xs text-blue-600 mt-2">↓ 5% from yesterday</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaBell className="text-2xl text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">All Clear</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{residents.filter(r => r.status === 'normal').length}</p>
                  <p className="text-xs text-green-600 mt-2">↑ 8% improvement</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaCheckCircle className="text-2xl text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Vitals Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Vitals Trend</h3>
              <div className="h-64 flex items-end justify-between">
                {mockVitalsData.labels.map((day, index) => (
                  <div key={day} className="flex-1 mx-1">
                    <div className="relative">
                      <div 
                        className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-400"
                        style={{ height: `${mockVitalsData.heartRate[index] * 2}px` }}
                      ></div>
                      <p className="text-xs text-gray-500 text-center mt-2">{day}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Walking/Active</span>
                    <span className="font-semibold">{mockActivityData.walking}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all" 
                      style={{ width: `${mockActivityData.walking}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Resting</span>
                    <span className="font-semibold">{mockActivityData.resting}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all" 
                      style={{ width: `${mockActivityData.resting}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Activities/Social</span>
                    <span className="font-semibold">{mockActivityData.activities}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all" 
                      style={{ width: `${mockActivityData.activities}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Residents Grid */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Residents Overview</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Showing {filteredResidents.length} of {residents.length} residents
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All →
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredResidents.map((resident) => (
                    <div 
                      key={resident.id} 
                      className={`bg-gradient-to-br from-white to-gray-50 border-2 rounded-xl p-4 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 ${getStatusBorder(resident.status)}`}
                      onClick={() => handleResidentClick(resident.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{resident.name}</h3>
                          <p className="text-sm text-gray-500">Room {resident.room_number}</p>
                        </div>
                        <div className="relative">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(resident.status)}`}></div>
                          {resident.status === 'critical' && (
                            <div className={`absolute inset-0 w-3 h-3 rounded-full ${getStatusColor(resident.status)} animate-ping`}></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-xs">
                          <span className="text-gray-500 w-12">Age:</span>
                          <span className="font-medium text-gray-700">{resident.age} years</span>
                        </div>
                        <div className="flex items-start text-xs">
                          <span className="text-gray-500 w-12">Note:</span>
                          <span className="text-gray-600 line-clamp-2">{resident.medical_history}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button className="text-gray-400 hover:text-blue-600 transition-colors">
                            <FaHeartbeat />
                          </button>
                          <button className="text-gray-400 hover:text-green-600 transition-colors">
                            <FaPills />
                          </button>
                          <button className="text-gray-400 hover:text-purple-600 transition-colors">
                            <FaChartLine />
                          </button>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}