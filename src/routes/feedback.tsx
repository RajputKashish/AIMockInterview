import { db } from "@/config/firebase.config";
import { Interview, UserAnswer } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderPage } from "./loader-page";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/pin";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { CircleCheck, Star } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { defaultInterviews } from "@/lib/default-interviews";

// Helper function to create unique interview ID for default interviews
const getUniqueInterviewId = (interviewId: string, userId: string): string => {
  if (interviewId.startsWith('default-')) {
    // Create a session-specific key for localStorage
    const sessionKey = `interview_session_${interviewId}_${userId}`;
    
    // Try to get existing session ID from localStorage
    let sessionId = localStorage.getItem(sessionKey);
    
    // If no session exists, this might be an old session, try to find answers with any session ID
    if (!sessionId) {
      console.log("🔧 Feedback - No session found, using original interviewId for now");
      return interviewId; // Fallback to original for existing data
    }
    
    const uniqueId = `${interviewId}-${userId}-${sessionId}`;
    console.log("🔧 Feedback - Generated unique interview ID:", uniqueId);
    return uniqueId;
  }
  return interviewId;
};

export const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const [activeFeed, setActiveFeed] = useState("");
  const { userId } = useAuth();
  const navigate = useNavigate();

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }
  useEffect(() => {
    if (interviewId) {
      const fetchInterview = async () => {
        if (interviewId) {
          try {
            // Check if this is a default interview
            if (interviewId.startsWith('default-')) {
              console.log("🔍 Feedback - Loading default interview data");
              const defaultInterview = defaultInterviews.find(interview => interview.id === interviewId);
              if (defaultInterview) {
                setInterview(defaultInterview);
                console.log("🔍 Feedback - Default interview loaded:", defaultInterview.position);
              } else {
                console.log("❌ Feedback - Default interview not found:", interviewId);
              }
            } else {
              // Regular interview from Firestore
              console.log("🔍 Feedback - Loading regular interview from Firestore");
              const interviewDoc = await getDoc(
                doc(db, "interviews", interviewId)
              );
              if (interviewDoc.exists()) {
                setInterview({
                  id: interviewDoc.id,
                  ...interviewDoc.data(),
                } as Interview);
                console.log("🔍 Feedback - Regular interview loaded");
              } else {
                console.log("❌ Feedback - Regular interview not found:", interviewId);
              }
            }
          } catch (error) {
            console.log("❌ Feedback - Error fetching interview:", error);
          }
        }
      };

      const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
          // For default interviews, we need to search for answers that match the current session only
          let interviewData: UserAnswer[] = [];
          
          if (interviewId.startsWith('default-')) {
            console.log("🔍 Feedback - Searching for default interview answers");
            
            // Only get answers with the current session ID - no fallback to previous sessions
            const uniqueInterviewId = getUniqueInterviewId(interviewId, userId!);
            console.log("🔍 Feedback - Current session ID:", uniqueInterviewId);
            
            const currentSessionQuery = query(
              collection(db, "userAnswers"),
              where("userId", "==", userId),
              where("mockIdRef", "==", uniqueInterviewId)
            );
            
            const currentSessionSnap = await getDocs(currentSessionQuery);
            console.log("🔍 Feedback - Found answers with current session:", currentSessionSnap.docs.length);
            
            interviewData = currentSessionSnap.docs.map((doc) => ({
              id: doc.id, 
              ...doc.data()
            } as UserAnswer));
          } else {
            // For regular interviews, use the original query
            console.log("🔍 Feedback - Regular interview, using original ID");
            const querSanpRef = query(
              collection(db, "userAnswers"),
              where("userId", "==", userId),
              where("mockIdRef", "==", interviewId)
            );

            const querySnap = await getDocs(querSanpRef);
            interviewData = querySnap.docs.map((doc) => ({
              id: doc.id, 
              ...doc.data()
            } as UserAnswer));
          }

          console.log("🔍 Feedback - Final answers count:", interviewData.length);
          setFeedbacks(interviewData);
        } catch (error) {
          console.log(error);
          toast("Error", {
            description: "Something went wrong. Please try again later..",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchInterview();
      fetchFeedbacks();
    }
  }, [interviewId, navigate, userId]);

  //   calculate the ratings out of 10

  const overAllRating = useMemo(() => {
    if (feedbacks.length === 0) return "0.0";

    const totalRatings = feedbacks.reduce(
      (acc, feedback) => acc + feedback.rating,
      0
    );

    return (totalRatings / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <div className="flex items-center justify-between w-full gap-2">
        <CustomBreadCrumb
          breadCrumbPage={"Feedback"}
          breadCrumpItems={[
            { label: "Mock Interviews", link: "/generate" },
            {
              label: `${interview?.position}`,
              link: `/generate/interview/${interview?.id}`,
            },
          ]}
        />
      </div>

      <Headings
        title="Congratulations !"
        description="Your personalized feedback is now available. Dive in to see your strengths, areas for improvement, and tips to help you ace your next interview."
      />

      <p className="text-base text-muted-foreground">
        Your overall interview ratings :{" "}
        <span className="text-emerald-500 font-semibold text-xl">
          {overAllRating} / 10
        </span>
      </p>

      {interview && <InterviewPin interview={interview} onMockPage />}

      <Headings title="Interview Feedback" isSubHeading />

      {feedbacks && (
        <Accordion type="single" collapsible className="space-y-6">
          {feedbacks.map((feed) => (
            <AccordionItem
              key={feed.id}
              value={feed.id}
              className="border rounded-lg shadow-md"
            >
              <AccordionTrigger
                onClick={() => setActiveFeed(feed.id)}
                className={cn(
                  "px-5 py-3 flex items-center justify-between text-base rounded-t-lg transition-colors hover:no-underline",
                  activeFeed === feed.id
                    ? "bg-gradient-to-r from-purple-50 to-blue-50"
                    : "hover:bg-gray-50"
                )}
              >
                <span>{feed.question}</span>
              </AccordionTrigger>

              <AccordionContent className="px-5 py-6 bg-white rounded-b-lg space-y-5 shadow-inner">
                <div className="text-lg font-semibold to-gray-700">
                  <Star className="inline mr-2 text-yellow-400" />
                  Rating : {feed.rating}
                </div>

                <Card className="border-none space-y-3 p-4 bg-green-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-green-600" />
                    Expected Answer
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feed.correct_ans}
                  </CardDescription>
                </Card>

                <Card className="border-none space-y-3 p-4 bg-yellow-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-yellow-600" />
                    Your Answer
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feed.user_ans}
                  </CardDescription>
                </Card>

                <Card className="border-none space-y-3 p-4 bg-red-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-red-600" />
                    Feedback
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feed.feedback}
                  </CardDescription>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
