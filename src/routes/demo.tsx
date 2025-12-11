import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  ArrowRight,
  ChevronLeft,
  Mic,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

export const DemoPage = () => {
  // Single demo video object
  const demoVideo = {
    id: 1,
    title: "Interview Preparation Platform - Demo",
    description: "See how our interview preparation platform helps you practice and improve your interview skills with comprehensive tools and detailed feedback.",
    duration: "5:45",
    views: "8.7k",
    rating: "4.8",
    category: "Platform Demo",
    thumbnail: "/assets/img/hero.jpg",
    videoUrl: "/assets/videos/demo-video.mp4", // Your local video file
    features: [
      "Interview question practice",
      "Recording and playback",
      "Performance tracking",
      "Feedback system",
      "Progress monitoring",
      "Skill improvement tools"
    ],
    highlights: [
      "Complete platform walkthrough",
      "Interview practice demonstration",
      "Progress tracking overview",
      "Best practices and tips"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Platform Demo Videos
            </h1>
            <p className="text-gray-600 mt-2">
              See our AI-powered interview platform in action
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Single Video Player */}
          <Card className="overflow-hidden shadow-xl mb-8">
            <div className="relative w-full h-0 pb-[56.25%] bg-black">
              {demoVideo.videoUrl ? (
                // Your local video file
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  controls
                  poster={demoVideo.thumbnail}
                >
                  <source src={demoVideo.videoUrl} type="video/mp4" />
                  <source src={demoVideo.videoUrl.replace('.mp4', '.webm')} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                // Fallback when no video is found
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-20 h-20 mx-auto mb-6 opacity-70" />
                    <h3 className="text-2xl font-semibold mb-4">{demoVideo.title}</h3>
                    <p className="text-blue-200 mb-6">Please add your demo video!</p>
                    <p className="text-sm text-blue-300 max-w-md">
                      Place your video file at: /public/assets/videos/demo-video.mp4
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {demoVideo.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {demoVideo.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {demoVideo.views} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {demoVideo.rating}
                    </div>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {demoVideo.category}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-6">
                {demoVideo.description}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Key Features Demonstrated:</h3>
                  <div className="space-y-2">
                    {demoVideo.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">What You'll See:</h4>
                  <ul className="space-y-2">
                    {demoVideo.highlights.map((highlight, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Experience the power of AI-driven interview preparation. Start practicing today and land your dream job!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/generate">
                  <Button 
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4"
                  >
                    Start Interview Practice
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10 px-8 py-4"
                  >
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Platform Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">50k+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">1M+</div>
                <div className="text-sm text-gray-600">AI Interviews</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
