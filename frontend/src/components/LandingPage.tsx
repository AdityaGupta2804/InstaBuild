import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Zap, 
  GitBranch, 
  Settings, 
  Users, 
  Code, 
  Rocket,
  Github,
  Mail,
  ArrowRight,
  Check
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleProtectedAction = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold text-foreground">InstaBuild</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How it Works
              </button>
              <a 
                href="https://github.com/AdityaGupta2804/Mini_Jenkins" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contribute
              </a>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button>Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              CI/CD for all your projects
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Monorepos & Multi-Repo setups made simple. Deploy with confidence and speed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="hero-solid"
                onClick={() => handleProtectedAction('/trigger-build')}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Trigger Build
              </Button>
              <Button 
                size="lg" 
                variant="hero" 
                onClick={() => handleProtectedAction('/builds')}
              >
                View All Builds
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How InstaBuild Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, fast, and reliable CI/CD pipeline for your development workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Connect Repository</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Link your GitHub repository and configure your build settings with our intuitive interface.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Configure Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Set up your build configuration for monorepos or multi-repo projects with custom workflows.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Deploy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Trigger builds automatically on commits or manually, then monitor deployment status in real-time.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose InstaBuild?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for modern development teams who value speed, reliability, and simplicity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: GitBranch,
                title: "Monorepo Support",
                description: "First-class support for monorepos with intelligent change detection and selective builds."
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized build pipeline that gets your code from commit to deployment in record time."
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Built-in collaboration tools to keep your team synchronized and productive."
              },
              {
                icon: Settings,
                title: "Flexible Configuration",
                description: "Customize your build process with our powerful configuration options."
              },
              {
                icon: Check,
                title: "Reliable Deployments",
                description: "Zero-downtime deployments with automatic rollbacks and health checks."
              },
              {
                icon: Code,
                title: "Developer First",
                description: "Designed by developers, for developers. Intuitive interface and powerful features."
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Developers Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of developers who trust InstaBuild for their CI/CD needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "InstaBuild transformed our deployment process. We went from hours to minutes for our monorepo deployments.",
                author: "Raj Verma",
                role: "Senior Developer at Amazon"
              },
              {
                quote: "The simplicity and power of InstaBuild is unmatched. Perfect for our multi-repo microservices architecture.",
                author: "Manoj Kumawat",
                role: "DevOps Engineer at Tekion"
              },
              {
                quote: "Finally, a CI/CD platform that understands monorepos. The selective build feature is a game changer.",
                author: "Amit Gupta",
                role: "Technical Lead at Wayfair"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="shadow-md">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Deploy Faster?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of developers who trust InstaBuild for their CI/CD needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="hero-solid">
                Get Started Free
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="hero" 
              onClick={() => handleProtectedAction('/dashboard')}
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 text-primary mr-2" />
                <span className="text-xl font-bold text-foreground">InstaBuild</span>
              </div>
              <p className="text-muted-foreground mb-6">
                Lightning-fast CI/CD for monorepos and multi-repo projects. 
                Built by developers, for developers.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/AdityaGupta2804/Mini_Jenkins" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('how-it-works')} className="text-muted-foreground hover:text-foreground transition-colors">How it Works</button></li>
                <li><Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
                <li><Link to="/signup" className="text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Contact</h3>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <strong>Developer:</strong> Aditya Gupta
                </p>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href="mailto:codewithadi28@gmail.com"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    codewithadi28@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground">
              © 2025 InstaBuild. Built with ❤️ by Aditya Gupta.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;