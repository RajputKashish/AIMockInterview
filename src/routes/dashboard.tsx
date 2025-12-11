import { InterviewPin } from "@/components/pin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { defaultInterviews, getDifficultyColor } from "@/lib/default-interviews";
import { useAuth } from "@clerk/clerk-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Plus, Star, TrendingUp, Users, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        const interviewList: Interview[] = snapshot.docs.map((doc) => {
          const id = doc.id;
          return {
            id,
            ...doc.data(),
          };
        }) as Interview[];
        setInterviews(interviewList);
        setLoading(false);
      },
      (error) => {
        console.log("Error on fetching : ", error);
        toast.error("Error..", {
          description: "Something went wrong.. Try again later..",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Combine user interviews with default interviews
  const allInterviews = [...interviews, ...defaultInterviews];

  // Filter interviews by difficulty
  const getFilteredInterviews = (difficulty?: string) => {
    if (difficulty === "all" || !difficulty) return allInterviews;
    return allInterviews.filter(interview => interview.difficulty === difficulty);
  };

  // Get count by difficulty
  const getCounts = () => {
    const easy = allInterviews.filter(i => i.difficulty === 'Easy').length;
    const moderate = allInterviews.filter(i => i.difficulty === 'Moderate').length;
    const difficult = allInterviews.filter(i => i.difficulty === 'Difficult').length;
    const userCreated = interviews.length;
    return { easy, moderate, difficult, userCreated, total: allInterviews.length };
  };

  const counts = getCounts();

  const handleDefaultInterviewClick = (interview: Interview) => {
    // For default interviews, navigate directly to the enhanced interview page
    navigate(`/generate/interview/${interview.id}`);
  };

  return (
    <>
      <div className="relative">
        {/* Enhanced Header with Gradient Background */}
        <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border border-emerald-100">
          <div className="flex w-full items-center justify-between">
            {/* Enhanced headings */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Interview Dashboard
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Practice with AI-powered mock interviews across all difficulty levels
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-emerald-600 font-medium">AI Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{counts.total} Interviews Available</span>
                </div>
              </div>
            </div>
            <Link to={"/generate/create"}>
              <Button size={"lg"} className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Plus className="mr-2" /> Create Custom Interview
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Easy</p>
                  <p className="text-2xl font-bold text-green-700">{counts.easy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-600">Moderate</p>
                  <p className="text-2xl font-bold text-yellow-700">{counts.moderate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Star className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Difficult</p>
                  <p className="text-2xl font-bold text-red-700">{counts.difficult}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Your Interviews</p>
                  <p className="text-2xl font-bold text-blue-700">{counts.userCreated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced content section with difficulty tabs */}
        <div className="space-y-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="all">All ({counts.total})</TabsTrigger>
                <TabsTrigger value="Easy" className="text-green-600">Easy ({counts.easy})</TabsTrigger>
                <TabsTrigger value="Moderate" className="text-yellow-600">Moderate ({counts.moderate})</TabsTrigger>
                <TabsTrigger value="Difficult" className="text-red-600">Difficult ({counts.difficult})</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all">
              <InterviewGrid 
                interviews={getFilteredInterviews("all")} 
                loading={loading} 
                onDefaultClick={handleDefaultInterviewClick}
              />
            </TabsContent>
            
            <TabsContent value="Easy">
              <InterviewGrid 
                interviews={getFilteredInterviews("Easy")} 
                loading={loading} 
                onDefaultClick={handleDefaultInterviewClick}
              />
            </TabsContent>
            
            <TabsContent value="Moderate">
              <InterviewGrid 
                interviews={getFilteredInterviews("Moderate")} 
                loading={loading} 
                onDefaultClick={handleDefaultInterviewClick}
              />
            </TabsContent>
            
            <TabsContent value="Difficult">
              <InterviewGrid 
                interviews={getFilteredInterviews("Difficult")} 
                loading={loading} 
                onDefaultClick={handleDefaultInterviewClick}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

// Interview Grid Component
interface InterviewGridProps {
  interviews: Interview[];
  loading: boolean;
  onDefaultClick: (interview: Interview) => void;
}

const InterviewGrid = ({ interviews, loading, onDefaultClick }: InterviewGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {loading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 h-48 rounded-2xl"></div>
          </div>
        ))
      ) : interviews.length > 0 ? (
        interviews.map((interview) => (
          interview.isDefault ? (
            <DefaultInterviewCard 
              key={interview.id} 
              interview={interview} 
              onClick={() => onDefaultClick(interview)}
            />
          ) : (
            <InterviewPin key={interview.id} interview={interview} />
          )
        ))
      ) : (
        <div className="md:col-span-3 w-full flex flex-grow items-center justify-center h-96 flex-col">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-3xl text-center">
            <img
              src="/assets/svg/not-found.svg"
              className="w-32 h-32 object-contain mx-auto mb-6"
              alt=""
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Interviews Found
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try switching to a different difficulty level or create your own custom interview.
            </p>
            <Link to={"/generate/create"}>
              <Button size={"lg"} className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="mr-2" />
                Create Custom Interview
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Default Interview Card Component
interface DefaultInterviewCardProps {
  interview: Interview;
  onClick: () => void;
}

const DefaultInterviewCard = ({ interview, onClick }: DefaultInterviewCardProps) => {
  const difficultyColors = getDifficultyColor(interview.difficulty || '');
  
  return (
    <Card 
      className="cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 border-2 hover:border-emerald-300 group bg-gradient-to-br from-white to-gray-50 hover:from-emerald-50 hover:to-blue-50"
      onClick={onClick}
    >
      <CardHeader className="pb-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                className={`${difficultyColors.bg} ${difficultyColors.text} ${difficultyColors.border} border group-hover:shadow-md transition-all duration-300`}
              >
                {interview.difficulty}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-100 group-hover:shadow-md transition-all duration-300">
                Default
              </Badge>
            </div>
            <CardTitle className="text-lg leading-tight group-hover:text-emerald-600 transition-colors duration-300">{interview.position}</CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 relative z-10">
        <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
          {interview.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
            <span>Experience: {interview.experience} years</span>
            <span>{interview.questions?.length || 5} questions</span>
          </div>
          
          <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
            <span className="font-medium">Tech Stack:</span> {interview.techStack}
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Start Practice Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
