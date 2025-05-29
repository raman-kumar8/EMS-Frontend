import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Calendar, Clock, User, Briefcase, LogOut, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
      {/* Header */}
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between mb-10 px-4">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-blue-200 flex items-center justify-center shadow-lg border-4 border-white">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-blue-600" />
            )}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-1">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-blue-500 text-lg">Manage your tasks, leaves, and reports</p>
          </div>
        </div>
        <Button
          className="mt-6 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" /> Logout
        </Button>
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        {/* User Details Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-xl border-blue-100">
            <CardHeader>
              <div className="flex flex-col items-center gap-3">
                <div className="h-28 w-28 rounded-full bg-blue-100 flex items-center justify-center shadow border-4 border-blue-200">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-14 w-14 text-blue-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-blue-900 mt-2">{user?.name || 'User Name'}</h2>
                <p className="text-blue-500">{user?.department || 'Department'}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 mt-2">
              <div className="flex items-center gap-3 text-blue-700">
                <Mail className="h-5 w-5" />
                <span>{user?.email || 'user@example.com'}</span>
              </div>
              <div className="flex items-center gap-3 text-blue-700">
                <Phone className="h-5 w-5" />
                <span>{user?.phone || '+1 (555) 000-0000'}</span>
              </div>
              <div className="flex items-start gap-3 text-blue-700">
                <MapPin className="h-5 w-5 mt-0.5" />
                <span>{user?.address || '123 Main St, City, Country'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tasks Card */}
            <Card
              className="hover:shadow-2xl transition-shadow cursor-pointer border-blue-100"
              onClick={() => navigateTo('/task')}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-blue-700">Tasks</CardTitle>
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardDescription>Manage your tasks and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">12 Active</div>
                <p className="text-sm text-blue-400">3 due this week</p>
              </CardContent>
            </Card>

            {/* Leave Card */}
            <Card
              className="hover:shadow-2xl transition-shadow cursor-pointer border-green-100"
              onClick={() => navigateTo('/leave')}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-green-700">Leaves</CardTitle>
                  <div className="p-2 rounded-lg bg-green-100">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <CardDescription>Manage your leave requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">12 Days Left</div>
                <p className="text-sm text-green-400">2 pending requests</p>
              </CardContent>
            </Card>

            {/* Reports Card */}
            <Card
              className="hover:shadow-2xl transition-shadow cursor-pointer border-purple-100"
              onClick={() => navigateTo('/report')}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-purple-700">Reports</CardTitle>
                  <div className="p-2 rounded-lg bg-purple-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-600"
                    >
                      <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
                      <path d="m12 12 4 4 6-6" />
                      <path d="m16 5 3 3" />
                    </svg>
                  </div>
                </div>
                <CardDescription>View and generate reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">5 Reports</div>
                <p className="text-sm text-purple-400">Last updated today</p>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="border-amber-100">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-amber-700">Quick Stats</CardTitle>
                  <div className="p-2 rounded-lg bg-amber-100">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">Tasks Completed</span>
                  <span className="font-medium">24/36</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">Leaves This Month</span>
                  <span className="font-medium">2/3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">Upcoming Deadlines</span>
                  <span className="font-medium">3</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;