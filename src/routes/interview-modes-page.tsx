import { Interview } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { defaultInterviews } from "@/lib/default-interviews";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  Video, 
  ArrowLeft, 
  Clock,
  Users,
  Zap,
  Shield
} from "lucide-react";

export const InterviewModesPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchInterview = async () => {
      if (interviewId) {
        try {
          // Check if it's a default interview first
          const defaultInterview = defaultInterviews.find(interview => interview.id === interviewId);
          if (defaultInterview) {
            setInterview(defaultInterview);
            setIsLoading(false);
            return;
          } else {
            const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
            if (interviewDoc.exists()) {
              const interviewData = {
                id: interviewDoc.id,
                ...interviewDoc.data(),
              } as Interview;
              setInterview(interviewData);
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.log("Error fetching interview:", error);
        }
        
        // If we reach here, no interview was found
        setIsLoading(false);
        navigate("/generate", { replace: true });
      } else {
        setIsLoading(false);
        navigate("/generate", { replace: true });
      }
    };

    fetchInterview();
  }, [interviewId, navigate]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  if (!interviewId || !interview) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <CustomBreadCrumb
        breadCrumbPage="Interview Modes"
        breadCrumpItems={[
          { label: "Mock Interviews", link: "/generate" },
          { label: interview?.position || "", link: `/generate/interview/${interview?.id}` },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-emerald-50 rounded-2xl p-8 border border-blue-100">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/generate/interview/${interviewId}`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>
        
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Choose Your Interview Mode
        </h1>
        <p className="text-gray-600 text-lg">
          Select how you'd like to conduct your mock interview for <span className="font-semibold">{interview?.position}</span>
        </p>
      </div>

      {/* Interview Mode Selection */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Traditional Mode */}
        <Card className="cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-xl group transform hover:-translate-y-1" 
              onClick={() => navigate(`/generate/interview/${interviewId}/traditional`)}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors mb-4">
              <Video className="w-10 h-10 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl text-emerald-700">
              Traditional Interview
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Record yourself answering questions at your own pace
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Self-Paced</h4>
                  <p className="text-sm text-gray-600">Take your time to think and respond</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Video className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Video Recording</h4>
                  <p className="text-sm text-gray-600">Record and review your responses</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Privacy Focused</h4>
                  <p className="text-sm text-gray-600">Complete control over your recording</p>
                </div>
              </div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h5 className="font-medium text-emerald-800 mb-2">What you'll get:</h5>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Video recording of all your responses</li>
                <li>• Ability to re-record any answer</li>
                <li>• Written feedback on each question</li>
                <li>• Progress tracking through questions</li>
              </ul>
            </div>
            
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6 group-hover:scale-105 transition-transform">
              Start Traditional Interview
            </Button>
          </CardContent>
        </Card>

        {/* Voice AI Mode */}
        <Card className="cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl group transform hover:-translate-y-1" 
              onClick={() => navigate(`/generate/interview/${interviewId}/voice`)}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors mb-4">
              <Mic className="w-10 h-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-700">
              AI Voice Interview
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Have a natural conversation with an AI interviewer
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Interactive</h4>
                  <p className="text-sm text-gray-600">Real-time conversation with AI</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Dynamic Questions</h4>
                  <p className="text-sm text-gray-600">AI asks follow-up questions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mic className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Voice-Based</h4>
                  <p className="text-sm text-gray-600">Speak naturally, no typing required</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-800 mb-2">What you'll get:</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Real-time voice conversation</li>
                <li>• AI-generated follow-up questions</li>
                <li>• Natural interview flow</li>
                <li>• Instant feedback and scoring</li>
              </ul>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 group-hover:scale-105 transition-transform">
              Start Voice Interview
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Before You Start</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Traditional Interview Requirements:</h4>
            <ul className="space-y-1">
              <li>• Camera access for video recording</li>
              <li>• Microphone access for audio</li>
              <li>• Stable internet connection</li>
              <li>• Quiet environment recommended</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Voice Interview Requirements:</h4>
            <ul className="space-y-1">
              <li>• Microphone access required</li>
              <li>• Speaker or headphones</li>
              <li>• Modern browser (Chrome, Firefox, Safari)</li>
              <li>• Quiet environment essential</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
