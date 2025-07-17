import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Rocket, 
  GitBranch, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Code,
  Server,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { triggerBuild } from '@/lib/triggerBuild';
import { toast } from "react-toastify"
const TriggerBuild = () => {
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('');
  const [environment, setEnvironment] = useState('');
  const [buildType, setBuildType] = useState('');
  const [customScript, setCustomScript] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableCache, setEnableCache] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const[repoUrl,setRepoUrl] = useState('');
  const[vercelToken,setVercelToken] = useState('');
  const[renderToken,setRenderToken] = useState('');
  const[showVercel,setShowVercel] = useState(false);



  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     // Mock API call
  //     await new Promise(resolve => setTimeout(resolve, 2000));
      
  //     toast({
  //       title: "Build triggered successfully!",
  //       description: `Build started for ${repository} on ${branch} branch`,
  //     });

  //     // Reset form
  //     setRepository('');
  //     setBranch('');
  //     setEnvironment('');
  //     setBuildType('');
  //     setCustomScript('');
  //   } catch (error) {
  //     toast({
  //       title: "Failed to trigger build",
  //       description: "Please try again later.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast({
        title: "Invalid Input",
        description: "Please fill all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await triggerBuild({
        repoUrl,
        vercel_token: vercelToken,
        render_hook: renderToken,
      });

      toast({
        title: "✅ Build Triggered!",
        description: `Build started successfully. ID: ${response.buildId}`,
      });

      // Optionally reset form fields
      setRepoUrl("");
      setVercelToken("");
      setRenderToken("");
      setRepository("");
      setBranch("");
      setEnvironment("");
      setBuildType("");
      setCustomScript("");

    } catch (error: any) {
      toast({
        title: "❌ Failed to Trigger Build",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isFormValid = repository && branch && environment && buildType && isValidUrl(repoUrl) && isValidUrl(renderToken) && vercelToken;

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Trigger New Build
          </h1>
          <p className="text-muted-foreground">
            Deploy your code with a custom build configuration
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="h-5 w-5 mr-2 text-primary" />
                  Build Configuration
                </CardTitle>
                <CardDescription>
                  Configure your build settings and trigger deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="repository">Repository</Label>
                      <Select value={repository} onValueChange={setRepository}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select repository" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frontend-app">frontend-app</SelectItem>
                          <SelectItem value="api-service">api-service</SelectItem>
                          <SelectItem value="shared-components">shared-components</SelectItem>
                          <SelectItem value="backend-service">backend-service</SelectItem>
                          <SelectItem value="mobile-app">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch</Label>
                      <Select value={branch} onValueChange={setBranch}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">main</SelectItem>
                          <SelectItem value="develop">develop</SelectItem>
                          <SelectItem value="staging">staging</SelectItem>
                          <SelectItem value="feature/new-ui">feature/new-ui</SelectItem>
                          <SelectItem value="feature/api-updates">feature/api-updates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="environment">Environment</Label>
                      <Select value={environment} onValueChange={setEnvironment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select environment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buildType">Build Type</Label>
                      <Select value={buildType} onValueChange={setBuildType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select build type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Build</SelectItem>
                          <SelectItem value="incremental">Incremental Build</SelectItem>
                          <SelectItem value="deploy-only">Deploy Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* <div className="space-y-2">
                    <Label htmlFor="customScript">Custom Build Script (Optional)</Label>
                    <Textarea
                      id="customScript"
                      placeholder="Enter custom build commands..."
                      value={customScript}
                      onChange={(e) => setCustomScript(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div> */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="repoUrl">Repository URL</Label>
                      <Input 
                        id="repoUrl" 
                        type='url'
                        placeholder="https://github.com/username/repo" 
                        value={repoUrl} 
                        onChange={(e) => setRepoUrl(e.target.value)} 
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vercelToken">Vercel Token</Label>
                      <div className="relative">
                        <Input
                          id="vercelToken"
                          type={showVercel ? "text" : "password"}
                          placeholder="Enter your Vercel token"
                          value={vercelToken}
                          onChange={(e) => setVercelToken(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowVercel(!showVercel)}
                          className="absolute inset-y-0 right-0 px-3 text-sm text-muted-foreground"
                        >
                          {showVercel ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="renderToken">Render Token / Webhook</Label>
                      <Input
                        id="renderToken"
                        type='url'
                        placeholder="https://api.render.com/deploy/webhook..."
                        value={renderToken}
                        onChange={(e) => setRenderToken(e.target.value)}
                        required
                      />
                    </div>
                  </div>


                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="notifications">Enable Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications about build status
                        </p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={enableNotifications}
                        onCheckedChange={setEnableNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="cache">Enable Build Cache</Label>
                        <p className="text-sm text-muted-foreground">
                          Use cached dependencies to speed up builds
                        </p>
                      </div>
                      <Switch
                        id="cache"
                        checked={enableCache}
                        onCheckedChange={setEnableCache}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    // disabled={!isFormValid || isLoading}
                    size="lg"
                  >
                    {isLoading ? 'Triggering Build...' : 'Trigger Build'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Build Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-muted-foreground" />
                  Build Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Repository:</span>
                  <Badge variant="outline">{repository || 'Not selected'}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Branch:</span>
                  <Badge variant="outline">{branch || 'Not selected'}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Environment:</span>
                  <Badge variant="outline">{environment || 'Not selected'}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Build Type:</span>
                  <Badge variant="outline">{buildType || 'Not selected'}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Build Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2 text-accent" />
                  Build Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mt-0.5 mr-2 text-success flex-shrink-0" />
                    Use incremental builds for faster deployment
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mt-0.5 mr-2 text-success flex-shrink-0" />
                    Enable caching to reduce build times
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mt-0.5 mr-2 text-success flex-shrink-0" />
                    Test in staging before production
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-4 w-4 mt-0.5 mr-2 text-warning flex-shrink-0" />
                    Monitor build logs for errors
                  </li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default TriggerBuild;