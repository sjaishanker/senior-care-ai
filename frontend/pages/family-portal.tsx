import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Heart, Activity, Users, Camera, Video, Bell, TrendingUp, AlertCircle, Smile, Meh, Frown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DailyUpdate {
  date: string;
  mood: string;
  mood_emoji: string;
  activities: string[];
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  vitals_summary: {
    blood_pressure: string;
    heart_rate: number;
    temperature: number;
    oxygen: number;
    status: string;
  };
  social_interactions: number;
  notable_events: string[];
  photos: string[];
  staff_notes: string;
  health_status: string;
}

interface Notification {
  id: number;
  type: string;
  priority: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  image_url?: string;
  action_required: boolean;
  action_type?: string;
}

export default function FamilyPortal() {
  const [selectedResident, setSelectedResident] = useState(1);
  const [dailyUpdate, setDailyUpdate] = useState<DailyUpdate | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    fetchDailyUpdate();
    fetchNotifications();
  }, [selectedResident]);

  const fetchDailyUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/family/resident/${selectedResident}/today`);
      const data = await response.json();
      setDailyUpdate(data);
    } catch (error) {
      console.error('Error fetching daily update:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/family/notifications/1?limit=10`);
      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <Smile className="h-8 w-8 text-green-500" />;
      case 'content':
        return <Smile className="h-8 w-8 text-blue-500" />;
      case 'anxious':
        return <Meh className="h-8 w-8 text-yellow-500" />;
      case 'sad':
        return <Frown className="h-8 w-8 text-gray-500" />;
      default:
        return <Smile className="h-8 w-8 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading || !dailyUpdate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Family Portal</h1>
        <p className="text-gray-600">Stay connected with your loved one's daily care</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Button className="flex items-center justify-center gap-2 p-6" variant="outline">
          <Video className="h-5 w-5" />
          Schedule Video Call
        </Button>
        <Button className="flex items-center justify-center gap-2 p-6" variant="outline">
          <Camera className="h-5 w-5" />
          Share Photo
        </Button>
        <Button className="flex items-center justify-center gap-2 p-6" variant="outline">
          <Heart className="h-5 w-5" />
          Send Message
        </Button>
        <Button className="flex items-center justify-center gap-2 p-6" variant="outline">
          <Calendar className="h-5 w-5" />
          View Calendar
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today's Update</TabsTrigger>
          <TabsTrigger value="health">Health Status</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          {/* Mood and Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{dailyUpdate.date}</span>
                <Badge variant={dailyUpdate.health_status === 'Stable' ? 'default' : 'secondary'}>
                  {dailyUpdate.health_status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4">
                  <div>
                    {getMoodIcon(dailyUpdate.mood)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Today's Mood</p>
                    <p className="text-xl font-semibold capitalize">{dailyUpdate.mood}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Social Interactions</p>
                    <p className="text-xl font-semibold">{dailyUpdate.social_interactions}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Activity className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Activities</p>
                    <p className="text-xl font-semibold">{dailyUpdate.activities.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meals */}
          <Card>
            <CardHeader>
              <CardTitle>Meal Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Breakfast</span>
                    <span className="text-sm text-gray-500">{dailyUpdate.meals.breakfast}</span>
                  </div>
                  <Progress value={parseInt(dailyUpdate.meals.breakfast)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Lunch</span>
                    <span className="text-sm text-gray-500">{dailyUpdate.meals.lunch}</span>
                  </div>
                  <Progress value={parseInt(dailyUpdate.meals.lunch)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Dinner</span>
                    <span className="text-sm text-gray-500">{dailyUpdate.meals.dinner}</span>
                  </div>
                  <Progress value={parseInt(dailyUpdate.meals.dinner)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notable Events */}
          {dailyUpdate.notable_events.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Notable Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dailyUpdate.notable_events.map((event, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>{event}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Staff Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{dailyUpdate.staff_notes}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Blood Pressure</p>
                  <p className="text-lg font-semibold">{dailyUpdate.vitals_summary.blood_pressure}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Heart Rate</p>
                  <p className="text-lg font-semibold">{dailyUpdate.vitals_summary.heart_rate} bpm</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Temperature</p>
                  <p className="text-lg font-semibold">{dailyUpdate.vitals_summary.temperature}°F</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Oxygen Level</p>
                  <p className="text-lg font-semibold">{dailyUpdate.vitals_summary.oxygen}%</p>
                </div>
              </div>
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Health Status</AlertTitle>
                <AlertDescription>{dailyUpdate.vitals_summary.status}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dailyUpdate.activities.map((activity, index) => (
                  <div key={index} className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium">{activity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={!notification.read ? 'border-blue-500' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(notification.priority)}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{notification.title}</h4>
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {notification.action_required && (
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}