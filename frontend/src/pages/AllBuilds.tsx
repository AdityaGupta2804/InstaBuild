import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  GitBranch, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  PlayCircle,
  Calendar,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { useToast } from '@/hooks/use-toast';

interface Build {
  id: string;
  buildId:string;
  repository: string;
  branch: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  duration: string;
  timestamp: string;
  environment: string;
  commitHash: string;
  commitMessage: string;
  buildNumber: number;
}
const handleDownloadLogs = (buildId: string) => {
  const url = `${import.meta.env.VITE_API_URL}/api/logs/${buildId}/download`;
  window.open(url, '_blank'); // triggers browser download
};

const AllBuilds = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [filteredBuilds, setFilteredBuilds] = useState<Build[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [repositoryFilter, setRepositoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
  const fetchBuilds = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/builds`);
      const data = await response.json();

      // Sort by createdAt descending
      const sortedBuilds = data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Optionally map API response to your `Build` shape
      const mappedBuilds: Build[] = sortedBuilds.map((build, index) => ({
        id: build._id,
        buildId:build.buildId,
        repository: 'User Project', // Replace this with actual field if available
        branch: 'main',             // Replace with actual data
        status: build.status.toLowerCase(),
        duration: '—',              // You can calculate/format this if backend supports it
        timestamp: new Date(build.createdAt).toLocaleString(),
        environment: 'development', // Replace with actual field if you have one
        commitHash: build.buildId.slice(0, 7),
        commitMessage: '—',         // Replace with real commit message if available
        buildNumber: index + 1      // Or use a real field if available
      }));

      setBuilds(mappedBuilds);
      setFilteredBuilds(mappedBuilds);
    } catch (error) {
      toast({
        title: "Failed to load builds",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

    fetchBuilds();
  }, [toast]);
  useEffect(() => {
    let filtered = builds;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(build => 
        build.repository.toLowerCase().includes(searchTerm.toLowerCase()) ||
        build.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        build.commitMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(build => build.status === statusFilter);
    }

    // Filter by repository
    if (repositoryFilter !== 'all') {
      filtered = filtered.filter(build => build.repository === repositoryFilter);
    }

    setFilteredBuilds(filtered);
  }, [builds, searchTerm, statusFilter, repositoryFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-primary animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-success text-success-foreground">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'running':
        return <Badge className="bg-primary text-primary-foreground">Running</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getEnvironmentBadge = (environment: string) => {
    switch (environment) {
      case 'production':
        return <Badge className="bg-destructive text-destructive-foreground">Production</Badge>;
      case 'staging':
        return <Badge className="bg-warning text-warning-foreground">Staging</Badge>;
      case 'development':
        return <Badge variant="outline">Development</Badge>;
      default:
        return <Badge variant="outline">{environment}</Badge>;
    }
  };

  const repositories = [...new Set(builds.map(build => build.repository))];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Builds refreshed",
        description: "Latest build information has been loaded.",
      });
    }, 1000);
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                All Builds
              </h1>
              <p className="text-muted-foreground">
                Monitor and manage your build history
              </p>
            </div>
            <Button onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search builds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={repositoryFilter} onValueChange={setRepositoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Repository" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Repositories</SelectItem>
                {repositories.map((repo) => (
                  <SelectItem key={repo} value={repo}>{repo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Build Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Builds</p>
                  <p className="text-2xl font-bold blur-sm select-none">127</p>
                  <p className="text-xs text-muted-foreground mt-1">Coming Soon</p>
                </div>
                <PlayCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-success blur-sm select-none">
                    93%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Coming Soon</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Running</p>
                  <p className="text-2xl font-bold text-primary blur-sm select-none">
                    2
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Coming Soon</p>
                </div>
                <RefreshCw className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-destructive blur-sm select-none">
                    8
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Coming Soon</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Builds Table */}
        <Card>
          <CardHeader>
            <CardTitle>Build History</CardTitle>
            <CardDescription>
              {filteredBuilds.length} build{filteredBuilds.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBuilds.map((build) => (
                  <div key={build.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(build.status)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{build.repository}</span>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-sm bg-muted px-2 py-1 rounded">
                              {build.branch}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            #{build.buildNumber} • {build.commitHash} • {build.commitMessage}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getEnvironmentBadge(build.environment)}
                        {getStatusBadge(build.status)}
                        <div className="text-sm text-muted-foreground">
                          {build.duration}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {build.timestamp}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadLogs(build.buildId)}>
                              <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredBuilds.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No builds found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
};

export default AllBuilds;