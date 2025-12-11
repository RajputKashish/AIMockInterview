import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DemoVideoModal } from "@/components/demo-video-modal";
import { 
  Target, 
  Lightbulb, 
  Heart, 
  Award, 
  TrendingUp,
  Sparkles,
  Brain,
  Mic,
  Video,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            About MockInterview AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering job seekers worldwide with AI-driven interview preparation that builds confidence, 
            improves skills, and accelerates career success.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-700">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 leading-relaxed">
                To democratize interview preparation by providing accessible, AI-powered tools that help 
                candidates practice, improve, and succeed in their dream job interviews.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl text-purple-700">Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 leading-relaxed">
                To become the world's leading platform for interview preparation, where every job seeker 
                has access to personalized, intelligent coaching that adapts to their unique needs.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <Card className="mb-16 border-2 border-emerald-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-emerald-700 mb-4">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="max-w-4xl mx-auto">
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                MockInterview AI was born from a simple observation: job interviews are one of the most 
                stressful and career-defining moments in our lives, yet most people have limited opportunities 
                to practice in realistic conditions.
              </p>
              <p>
                Our founders, experienced software engineers and career coaches, witnessed countless talented 
                individuals struggle not because they lacked skills, but because they lacked confidence and 
                interview experience. Traditional preparation methods were either too expensive, not personalized, 
                or simply unavailable.
              </p>
              <p>
                We envisioned a world where anyone, anywhere, could access high-quality interview practice 
                powered by artificial intelligence. A platform that could adapt to individual learning styles, 
                provide instant feedback, and simulate real interview scenarios across different industries 
                and difficulty levels.
              </p>
              <p>
                Today, MockInterview AI serves thousands of job seekers globally, helping them transform 
                interview anxiety into confidence and uncertainty into career success.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Quality interview preparation should be available to everyone, regardless of background or budget.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We continuously push the boundaries of AI technology to create smarter, more effective learning experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-gray-200 hover:border-emerald-300 transition-all duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We strive for the highest quality in everything we do, from our AI algorithms to user experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Platform Features Highlight */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose MockInterview AI?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Questions</h3>
              <p className="text-sm text-gray-600">Dynamic question generation tailored to your role and experience level</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Mic className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Voice Interviews</h3>
              <p className="text-sm text-gray-600">Practice with AI voice conversations that simulate real interviews</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Video Recording</h3>
              <p className="text-sm text-gray-600">Record and review your responses to improve body language and delivery</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Progress Tracking</h3>
              <p className="text-sm text-gray-600">Monitor your improvement over time with detailed analytics and feedback</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <Card className="mb-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="py-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">250k+</div>
                <div className="text-blue-100">Practice Sessions</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50k+</div>
                <div className="text-blue-100">Happy Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Ace Your Next Interview?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who've transformed their interview skills with MockInterview AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/generate">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg">
                <Sparkles className="mr-2" />
                Start Practicing Now
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <DemoVideoModal 
              triggerButtonText="See Platform Demo"
              triggerButtonVariant="outline"
              triggerButtonSize="lg"
              triggerButtonClassName="border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg"
            />
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
