import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Calendar, Clock, User, Briefcase, LogOut, Mail, Phone, MapPin, TrendingUp, CheckCircle, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import axios from "axios";

const Home = () => {
    const { user, logout } = useAuth();
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();
    const [taskList, setTaskList] = useState([]);
    const [report, setReportList] = useState([]);
    const [leaves, setLeavesList] = useState([]);

    const fetchTaskList = async () => {
        try {
            const response = await axios.get("/tasks/getAll", { withCredentials: true });
            setTaskList(response.data);
        } catch (error: AxiosError) {
            toast.error(error.message);
        }
    }

    const fetchUserIdAndReports = async () => {
        try {
            const { data: fetchedUserId } = await axios.get('/users/general/validate', { withCredentials: true });
            setUserId(fetchedUserId);

            const res = await axios.get(`/reports/report/user/${fetchedUserId}`, { withCredentials: true });
            const reportsData = res.data || [];

            setReportList(res.data);
        } catch (error: any) {
            toast.error(error?.message || 'Failed to fetch reports');
            setReportList([]);
        }
    };

    useEffect(() => {
        fetchTaskList();
        fetchUserIdAndReports();
    }, [])

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

    const completedTasks = taskList?.filter((t) => t.taskStatus === "COMPLETED").length || 0;
    const pendingTasks = taskList?.length - completedTasks || 0;
    const completionRate = taskList?.length > 0 ? Math.round((completedTasks / taskList.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Clean Header Section */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="h-full w-full rounded-2xl object-cover" />
                                    ) : (
                                        <User className="h-8 w-8 text-white" />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    Good morning, <span className="text-blue-600">{user?.name || 'User'}</span>
                                </h1>
                                <p className="text-gray-600 font-medium mt-1">Ready to tackle today's challenges?</p>
                            </div>
                        </div>
                        <Button
                            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg shadow-md transition-all duration-200 font-semibold"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                    {/* Sleek User Profile Card */}
                    <div className="xl:col-span-1">
                        <Card className="shadow-lg border-0 bg-white overflow-hidden">
                            <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 pb-6">
                                <div className="flex flex-col items-center">
                                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="Avatar" className="h-full w-full rounded-2xl object-cover" />
                                        ) : (
                                            <User className="h-10 w-10 text-white" />
                                        )}
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 mt-4">{user?.name || 'User Name'}</h2>
                                    <p className="text-blue-600 font-semibold text-sm">{user?.department || 'Department'}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 p-6">
                                <div className="flex items-center gap-3 text-gray-700 p-3 rounded-lg bg-gray-50">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium truncate">{user?.email || 'user@example.com'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700 p-3 rounded-lg bg-gray-50">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium">{user?.phone || '+1 (555) 000-0000'}</span>
                                </div>
                                <div className="flex items-start gap-3 text-gray-700 p-3 rounded-lg bg-gray-50">
                                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm font-medium">{user?.address || '123 Main St, City, Country'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Dashboard */}
                    <div className="xl:col-span-4">
                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-blue-50">
                                        <Briefcase className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                                        <p className="text-2xl font-bold text-gray-900">{taskList?.length || 0}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-green-50">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Completed</p>
                                        <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-yellow-50">
                                        <Calendar className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Leave Balance</p>
                                        <p className="text-2xl font-bold text-gray-900">12</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-purple-50">
                                        <BarChart3 className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Reports</p>
                                        <p className="text-2xl font-bold text-gray-900">{report?.length || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Action Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Tasks Card */}
                            <Card
                                className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border border-gray-200 hover:border-blue-300 overflow-hidden"
                                onClick={() => navigateTo('/task')}
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg group-hover:scale-105 transition-transform duration-200">
                                            <Briefcase className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-gray-900">{taskList?.length || 0}</div>
                                            <div className="text-sm text-gray-500">Active Tasks</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">Task Management</CardTitle>
                                    <CardDescription className="text-gray-600 mb-4">
                                        Organize and track your daily assignments
                                    </CardDescription>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-green-600 font-semibold">{completedTasks} completed</span>
                                        <span className="text-blue-600 font-semibold">{completionRate}% done</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Leave Card */}
                            <Card
                                className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border border-gray-200 hover:border-yellow-300 overflow-hidden"
                                onClick={() => navigateTo('/leave')}
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg group-hover:scale-105 transition-transform duration-200">
                                            <Calendar className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-gray-900">12</div>
                                            <div className="text-sm text-gray-500">Days Left</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">Leave Management</CardTitle>
                                    <CardDescription className="text-gray-600 mb-4">
                                        Plan your time off and manage requests
                                    </CardDescription>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-orange-600 font-semibold">2 pending</span>
                                        <span className="text-gray-500">Updated today</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Reports Card */}
                            <Card
                                className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border border-gray-200 hover:border-purple-300 overflow-hidden"
                                onClick={() => navigateTo('/report')}
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg group-hover:scale-105 transition-transform duration-200">
                                            <TrendingUp className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-gray-900">{report?.length || 0}</div>
                                            <div className="text-sm text-gray-500">Reports</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">Analytics & Reports</CardTitle>
                                    <CardDescription className="text-gray-600 mb-4">
                                        Insights and performance analytics
                                    </CardDescription>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-green-600 font-semibold">All current</span>
                                        <span className="text-gray-500">Last updated</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Performance Summary */}
                        <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl border-0">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-white">Weekly Summary</CardTitle>
                                        <CardDescription className="text-gray-300 font-medium">Your performance this week</CardDescription>
                                    </div>
                                    <div className="p-3 rounded-xl bg-blue-600 shadow-lg">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                                        <div className="text-3xl font-bold text-blue-400 mb-2">{completionRate}%</div>
                                        <div className="text-white font-semibold">Completion Rate</div>
                                        <div className="text-gray-300 text-sm mt-1">Tasks finished on time</div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                                        <div className="text-3xl font-bold text-yellow-400 mb-2">{pendingTasks}</div>
                                        <div className="text-white font-semibold">Pending Tasks</div>
                                        <div className="text-gray-300 text-sm mt-1">Due this week</div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                                        <div className="text-3xl font-bold text-green-400 mb-2">2</div>
                                        <div className="text-white font-semibold">Days Off Used</div>
                                        <div className="text-gray-300 text-sm mt-1">This month</div>
                                    </div>
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