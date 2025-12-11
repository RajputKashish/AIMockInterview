import { Interview } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { defaultInterviews } from "@/lib/default-interviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Play, 
  FileText, 
  Clock, 
  User, 
  Briefcase,
  ChevronRight 
} from "lucide-react";

export const EnhancedMockInterviewPage = () => {
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
          if (interviewId.startsWith('default-')) {
            const defaultInterview = defaultInterviews.find(interview => interview.id === interviewId);
            if (defaultInterview) {
              setInterview(defaultInterview);
            } else {
              console.log("Default interview not found");
              navigate("/generate", { replace: true });
            }
          } else {
            // Regular user interview - fetch from Firestore
            const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
            if (interviewDoc.exists()) {
              setInterview({
                id: interviewDoc.id,
                ...interviewDoc.data(),
              } as Interview);
            } else {
              console.log("Interview not found");
              navigate("/generate", { replace: true });
            }
          }
        } catch (error) {
          console.log(error);
          navigate("/generate", { replace: true });
        } finally {
          setIsLoading(false);
        }
      } else {
        navigate("/generate", { replace: true });
      }
    };

    fetchInterview();
  }, [interviewId, navigate]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[50vh] space-y-4">
        <p className="text-gray-500">Interview not found</p>
        <Button 
          onClick={() => navigate("/generate", { replace: true })}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <CustomBreadCrumb
        breadCrumbPage={interview?.position || "Interview"}
        breadCrumpItems={[
          { label: "Mock Interviews", link: "/generate" },
        ]}
      />

      {/* Interview Overview */}
      <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-2xl p-8 border border-emerald-100">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            {interview?.position}
          </h1>
          
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span className="text-gray-600">Experience: {interview?.experience} years</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">Tech Stack: {interview?.techStack}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-gray-600">{interview?.questions?.length || 5} Questions</span>
            </div>
            {interview?.difficulty && (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  interview.difficulty === 'Easy' ? 'bg-green-500' :
                  interview.difficulty === 'Moderate' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <span className={`font-medium ${
                  interview.difficulty === 'Easy' ? 'text-green-700' :
                  interview.difficulty === 'Moderate' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                  {interview.difficulty} Level
                </span>
              </div>
            )}
          </div>
          
          <p className="text-gray-700 bg-white/50 p-4 rounded-lg">
            {interview?.description}
          </p>
        </div>
      </div>

      {/* Two-Part System */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Interview Process</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Part 1: Generate Interview */}
          <Card className={`transition-all duration-300 border-2 border-gray-200 group ${
            !interview?.isDefault 
              ? 'cursor-pointer hover:border-emerald-300 hover:shadow-xl' 
              : 'opacity-75 bg-gray-50'
          }`} 
                onClick={() => !interview?.isDefault && navigate(`/generate/interview/${interviewId}/edit`)}>
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                !interview?.isDefault 
                  ? 'bg-emerald-100 group-hover:bg-emerald-200' 
                  : 'bg-gray-200'
              }`}>
                <Settings className={`w-8 h-8 ${!interview?.isDefault ? 'text-emerald-600' : 'text-gray-500'}`} />
              </div>
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  !interview?.isDefault 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  STEP 1
                </span>
                {interview?.isDefault ? 'Default Interview' : 'Generate Interview'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                {interview?.isDefault 
                  ? 'This is a pre-built interview with carefully crafted questions based on the difficulty level and role.'
                  : 'Customize your interview questions, update job details, and prepare the interview structure.'
                }
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                {interview?.isDefault ? (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Pre-built questions</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Difficulty-matched content</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Industry-standard questions</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>Modify interview questions</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>Update job requirements</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>Regenerate AI questions</span>
                    </div>
                  </>
                )}
              </div>
              <Button 
                className={`w-full transition-transform ${
                  !interview?.isDefault 
                    ? 'bg-emerald-600 hover:bg-emerald-700 group-hover:scale-105' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={interview?.isDefault}
              >
                {interview?.isDefault ? 'Default Interview Ready' : 'Customize Interview'}
                {!interview?.isDefault && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </CardContent>
          </Card>

          {/* Part 2: Take Interview */}
          <Card className="cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl group" 
                onClick={() => navigate(`/generate/interview/${interviewId}/modes`)}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Play className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">STEP 2</span>
                Choose Interview Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Select between Traditional or AI Voice Interview modes. Both provide {interview?.questions?.length || 5} carefully crafted questions based on the {interview?.difficulty || 'selected'} difficulty level.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Traditional: Video recording & playback</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>AI Voice: Interactive conversation</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Detailed feedback & analysis</span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:scale-105 transition-transform">
                Choose Interview Mode
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Process Flow Indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-medium text-sm">1</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Generate</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">2</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Interview</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Feedback</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Complete both steps to get comprehensive interview preparation and feedback
          </p>
        </div>
      </div>
    </div>
  );
};
