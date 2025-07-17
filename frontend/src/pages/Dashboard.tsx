import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  GitBranch, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Activity,
  TrendingUp,
  Users,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

interface Build {
  _id: string;
  buildId: string;
  status: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for dashboard
  const stats = {
    totalBuilds: 127,
    successfulBuilds: 118,
    failedBuilds: 9,
    avgBuildTime: '2m 34s'
  };
  
  
  const [recentBuilds, setRecentBuilds] = useState<Build[]>([]);

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/builds`);
        const data = await res.json();

        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setRecentBuilds(sorted.slice(0, 3));
      } catch (error) {
        console.error('Error fetching builds:', error);
      }
    };

    fetchBuilds();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <Badge className="bg-green-500 text-white">Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 text-white">Failed</Badge>;
      default:
        return <Badge className="bg-yellow-500 text-white">Running</Badge>;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };
  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your builds today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Builds</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold blur-sm select-none">127</div>
              <p className="text-xs text-muted-foreground blur-sm select-none">
                +12% from last month
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                This feature will be available soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Builds</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success blur-sm select-none">118</div>
              <p className="text-xs text-muted-foreground blur-sm select-none">
                92.9% success rate
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                This feature will be available soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Builds</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive blur-sm select-none">9</div>
              <p className="text-xs text-muted-foreground blur-sm select-none">
                -3% from last month
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                This feature will be available soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Build Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold blur-sm select-none">2m 34s</div>
              <p className="text-xs text-muted-foreground blur-sm select-none">
                -15s from last week
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                This feature will be available soon
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="h-5 w-5 mr-2 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Get started with your next deployment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/trigger-build">
                <Button className="w-full" size="sm">
                  Trigger New Build
                </Button>
              </Link>
              <Link to="/builds">
                <Button variant="outline" className="w-full" size="sm">
                  View All Builds
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GitBranch className="h-5 w-5 mr-2 text-accent" />
                Repository Health
              </CardTitle>
              <CardDescription>
                Monitor your project's build status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 blur-sm select-none">
                <div className="flex justify-between items-center">
                  <span className="text-sm">frontend-app</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">api-service</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">shared-components</span>
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                This feature will be available soon
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-muted-foreground" />
                Getting Started
              </CardTitle>
              <CardDescription>
                Tips to optimize your CI/CD pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Set up webhook triggers</li>
                <li>• Configure build environments</li>
                <li>• Add deployment targets</li>
                <li>• Enable notifications</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recent Builds */}
        
        <Card>
        <CardHeader>
          <CardTitle>Recent Builds</CardTitle>
          <CardDescription>Latest 3 builds from your backend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBuilds.length > 0 ? (
              recentBuilds.map((build) => (
                <div
                  key={build._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(build.status)}
                    <div>
                      <div className="font-medium">Build #{build.buildId.slice(0, 8)}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {build._id.slice(0, 6)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(build.status)}
                    <span className="text-sm text-muted-foreground">
                      {formatTimeAgo(build.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent builds found.</p>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/builds">
              <Button variant="outline">View All Builds</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;