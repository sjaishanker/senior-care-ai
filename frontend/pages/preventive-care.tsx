import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Users, TrendingDown, Droplets, Heart, Brain, Activity, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

interface RiskAssessment {
  resident_id: number;
  resident_name: string;
  overall_risk_score: number;
  overall_risk_level: string;
  quality_of_life_score: number;
  risk_factors: Array<{
    category: string;
    score: number;
    level: string;
    contributing_factors: string[];
  }>;
  priority_interventions: string[];
}

interface FacilityRiskSummary {
  facility_id: number;
  facility_name: string;
  total_residents: number;
  high_risk_count: number;
  moderate_risk_count: number;
  low_risk_count: number;
  average_risk_score: number;
  average_qol_score: number;
  top_risks: string[];
  recommended_actions: string[];
}

export default function PreventiveCare() {
  const [selectedFacility, setSelectedFacility] = useState(3);
  const [facilityRiskSummary, setFacilityRiskSummary] = useState<FacilityRiskSummary | null>(null);
  const [highRiskResidents, setHighRiskResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedResident, setSelectedResident] = useState<number | null>(null);
  const [residentRiskAssessment, setResidentRiskAssessment] = useState<RiskAssessment | null>(null);

  useEffect(() => {
    fetchFacilityRiskSummary();
    fetchHighRiskResidents();
  }, [selectedFacility]);

  useEffect(() => {
    if (selectedResident) {
      fetchResidentRiskAssessment(selectedResident);
    }
  }, [selectedResident]);

  const fetchFacilityRiskSummary = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/preventive-care/facility/${selectedFacility}/risk-summary`);
      const data = await response.json();
      setFacilityRiskSummary(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching facility risk summary:', error);
      setLoading(false);
    }
  };

  const fetchHighRiskResidents = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/preventive-care/high-risk-residents?facility_id=${selectedFacility}&limit=10`);
      const data = await response.json();
      setHighRiskResidents(data);
    } catch (error) {
      console.error('Error fetching high-risk residents:', error);
    }
  };

  const fetchResidentRiskAssessment = async (residentId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/preventive-care/resident/${residentId}/risk-assessment`);
      const data = await response.json();
      setResidentRiskAssessment(data);
    } catch (error) {
      console.error('Error fetching resident risk assessment:', error);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'fall_risk':
        return <TrendingDown className="h-5 w-5" />;
      case 'dehydration':
        return <Droplets className="h-5 w-5" />;
      case 'cardiovascular':
        return <Heart className="h-5 w-5" />;
      case 'isolation':
        return <Users className="h-5 w-5" />;
      case 'cognitive':
        return <Brain className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  if (loading || !facilityRiskSummary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const riskDistributionData = [
    { name: 'Low Risk', value: facilityRiskSummary.low_risk_count, color: '#10B981' },
    { name: 'Moderate Risk', value: facilityRiskSummary.moderate_risk_count, color: '#F59E0B' },
    { name: 'High Risk', value: facilityRiskSummary.high_risk_count, color: '#EF4444' }
  ];

  const riskTrendData = [
    { month: 'Jan', riskScore: 45, qolScore: 72 },
    { month: 'Feb', riskScore: 43, qolScore: 74 },
    { month: 'Mar', riskScore: 42, qolScore: 75 },
    { month: 'Apr', riskScore: 40, qolScore: 77 },
    { month: 'May', riskScore: 38, qolScore: 79 },
    { month: 'Jun', riskScore: 36, qolScore: 81 }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Preventive Care Analytics</h1>
        <p className="text-gray-600">AI-powered risk assessment and intervention recommendations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Residents</p>
                <p className="text-2xl font-bold">{facilityRiskSummary.total_residents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">High Risk</p>
                <p className="text-2xl font-bold text-red-600">{facilityRiskSummary.high_risk_count}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Risk Score</p>
                <p className="text-2xl font-bold">{facilityRiskSummary.average_risk_score.toFixed(1)}</p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Quality of Life</p>
                <p className="text-2xl font-bold text-green-600">{facilityRiskSummary.average_qol_score.toFixed(0)}%</p>
              </div>
              <Heart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="high-risk">High Risk Residents</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Risk Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Top Risk Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {facilityRiskSummary.top_risks.map((risk, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          {getRiskIcon(risk)}
                        </div>
                        <span className="font-medium capitalize">{risk.replace(/_/g, ' ')}</span>
                      </div>
                      <Badge variant="outline" className="text-orange-600">
                        {Math.floor(Math.random() * 20 + 10)} residents
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Interventions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facilityRiskSummary.recommended_actions.map((action, index) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{action}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="high-risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>High Risk Residents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highRiskResidents.map((resident) => (
                  <div
                    key={resident.resident_id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedResident(resident.resident_id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg font-semibold">{resident.resident_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{resident.resident_name}</p>
                        <p className="text-sm text-gray-500">Room {resident.room_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getRiskColor(resident.risk_level)}>
                          {resident.risk_level}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">Score: {resident.risk_score.toFixed(1)}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Individual Risk Assessment */}
          {residentRiskAssessment && (
            <Card>
              <CardHeader>
                <CardTitle>{residentRiskAssessment.resident_name} - Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Risk Factors</h4>
                    <div className="space-y-3">
                      {residentRiskAssessment.risk_factors.map((factor, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium capitalize">
                              {factor.category.replace(/_/g, ' ')}
                            </span>
                            <Badge className={getRiskColor(factor.level)} variant="outline">
                              {factor.level}
                            </Badge>
                          </div>
                          <Progress value={factor.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Priority Interventions</h4>
                    <ul className="space-y-2">
                      {residentRiskAssessment.priority_interventions.map((intervention, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span className="text-sm">{intervention}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="interventions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intervention Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Implement hourly rounding protocol</h4>
                      <p className="text-sm text-gray-600 mt-1">30% reduction in falls expected</p>
                    </div>
                    <Badge className="bg-red-100 text-red-600">High Priority</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Affects: 12 residents</span>
                    <span>•</span>
                    <span>Resources: Staff training (4 hours)</span>
                  </div>
                  <Button className="mt-3" size="sm">
                    Implement Intervention
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Hydration station setup</h4>
                      <p className="text-sm text-gray-600 mt-1">25% increase in fluid intake</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-600">Medium Priority</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Affects: 18 residents</span>
                    <span>•</span>
                    <span>Resources: $200 setup cost</span>
                  </div>
                  <Button className="mt-3" size="sm" variant="outline">
                    Schedule Implementation
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Buddy system for isolated residents</h4>
                      <p className="text-sm text-gray-600 mt-1">40% increase in social interaction</p>
                    </div>
                    <Badge className="bg-red-100 text-red-600">High Priority</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Affects: 8 residents</span>
                    <span>•</span>
                    <span>Resources: Volunteer coordinator</span>
                  </div>
                  <Button className="mt-3" size="sm">
                    Implement Intervention
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Score & Quality of Life Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="riskScore" 
                    stroke="#EF4444" 
                    name="Risk Score"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="qolScore" 
                    stroke="#10B981" 
                    name="Quality of Life"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">12</p>
                  <p className="text-sm text-gray-600">Falls Prevented</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">5</p>
                  <p className="text-sm text-gray-600">Hospital Transfers Avoided</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">78%</p>
                  <p className="text-sm text-gray-600">Intervention Success Rate</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">$45K</p>
                  <p className="text-sm text-gray-600">Cost Savings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}