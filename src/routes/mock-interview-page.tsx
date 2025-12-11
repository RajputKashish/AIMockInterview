/* eslint-disable @typescript-eslint/no-unused-vars */
import { Interview } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { defaultInterviews } from "@/lib/default-interviews";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { QuestionSection } from "@/components/question-section";

export const MockInterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchInterview = async () => {
      if (interviewId) {
        try {
          console.log("Fetching interview with ID:", interviewId);
          
          // Check if it's a default interview first
          if (interviewId.startsWith('default-')) {
            console.log("Looking for default interview...");
            const defaultInterview = defaultInterviews.find(interview => interview.id === interviewId);
            if (defaultInterview) {
              console.log("Default interview found:", defaultInterview.position);
              setInterview(defaultInterview);
            } else {
              console.log("Default interview not found");
              navigate("/generate", { replace: true });
            }
          } else {
            console.log("Fetching regular interview from Firestore...");
            // Regular user interview - fetch from Firestore
            const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
            if (interviewDoc.exists()) {
              console.log("Regular interview found");
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
          console.log("Error fetching interview:", error);
          navigate("/generate", { replace: true });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchInterview();
  }, [interviewId, navigate]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  if (!interviewId) {
    navigate("/generate", { replace: true });
    return null;
  }

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[50vh] space-y-4">
        <p className="text-gray-500">Interview not found</p>
        <button 
          onClick={() => navigate("/generate", { replace: true })}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <CustomBreadCrumb
        breadCrumbPage="Start"
        breadCrumpItems={[
          { label: "Mock Interviews", link: "/generate" },
          {
            label: interview?.position || "",
            link: `/generate/interview/${interview?.id}`,
          },
        ]}
      />

      <div className="w-full">
        <Alert className="bg-sky-100 border border-sky-200 p-4 rounded-lg flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-sky-600" />
          <div>
            <AlertTitle className="text-sky-800 font-semibold">
              Important Note
            </AlertTitle>
            <AlertDescription className="text-sm text-sky-700 mt-1 leading-relaxed">
              Press "Record Answer" to begin answering the question. Once you
              finish the interview, you&apos;ll receive feedback comparing your
              responses with the ideal answers.
              <br />
              <br />
              <strong>Note:</strong>{" "}
              <span className="font-medium">Your video is never recorded.</span>{" "}
              You can disable the webcam anytime if preferred.
            </AlertDescription>
          </div>
        </Alert>
      </div>

      {interview?.questions && interview?.questions.length > 0 ? (
        <div className="mt-4 w-full flex flex-col items-start gap-4">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-xl font-semibold">Interview Questions</h2>
            {interview.difficulty && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Difficulty:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  interview.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  interview.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {interview.difficulty}
                </span>
              </div>
            )}
          </div>
          <QuestionSection questions={interview?.questions} />
        </div>
      ) : (
        <div className="mt-4 w-full text-center text-gray-500">
          <p>No questions available for this interview.</p>
        </div>
      )}
    </div>
  );
};
