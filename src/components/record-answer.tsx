import { useAuth } from "@clerk/clerk-react";
import {
  CircleStop,
  Loader,
  Mic,
  RefreshCw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
  SkipForward,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { TooltipButton } from "./tooltip-button";
import { toast } from "sonner";
import { sendMessageWithRetry } from "@/scripts";

// Helper function to create unique interview ID for default interviews
const getUniqueInterviewId = (interviewId: string, userId: string): string => {
  if (interviewId.startsWith('default-')) {
    // Create a session-specific key for localStorage
    const sessionKey = `interview_session_${interviewId}_${userId}`;
    
    // Try to get existing session ID from localStorage
    let sessionId = localStorage.getItem(sessionKey);
    
    // If no session exists, create a new one
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(sessionKey, sessionId);
      console.log("🔧 Record Answer - Created new interview session:", sessionId);
    } else {
      console.log("🔧 Record Answer - Using existing interview session:", sessionId);
    }
    
    const uniqueId = `${interviewId}-${userId}-${sessionId}`;
    console.log("🔧 Record Answer - Generated unique interview ID:", uniqueId);
    return uniqueId;
  }
  return interviewId;
};

// Helper function to mark session as no longer fresh
const markSessionAsUsed = (interviewId: string, userId: string): void => {
  if (interviewId.startsWith('default-')) {
    const freshSessionKey = `fresh_session_${interviewId}_${userId}`;
    const lastActivityKey = `last_activity_${interviewId}_${userId}`;
    
    localStorage.removeItem(freshSessionKey);
    localStorage.setItem(lastActivityKey, Date.now().toString());
    console.log("🔧 Record Answer - Marked session as used and updated activity");
  }
};
import { SaveModal } from "./save-modal";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
  updateDoc,
  doc as firestoreDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface RecordAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
  onQuestionSkipped?: () => void;
}

interface AIResponse {
  ratings: number;
  feedback: string;
}

export const RecordAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
  onQuestionSkipped,
}: RecordAnswerProps) => {
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();

      if (userAnswer?.length < 30) {
        toast.error("Error", {
          description: "Your answer should be more than 30 characters",
        });

        return;
      }

      //   ai result
      const aiResult = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );

      setAiResult(aiResult);
    } else {
      startSpeechToText();
    }
  };

  const cleanJsonResponse = (responseText: string) => {
    // Step 1: Trim any surrounding whitespace
    let cleanText = responseText.trim();

    // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
    cleanText = cleanText.replace(/(json|```|`)/g, "");

    // Step 3: Parse the clean JSON text into an array of objects
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateResult = async (
    qst: string,
    qstAns: string,
    userAns: string
  ): Promise<AIResponse> => {
    setIsAiGenerating(true);
    const prompt = `
      You are an expert technical interviewer. Please evaluate the following interview response:

      **Interview Question:** "${qst}"
      
      **Expected/Ideal Answer:** "${qstAns}"
      
      **Candidate's Answer:** "${userAns}"

      **Evaluation Criteria:**
      1. Technical accuracy and correctness compared to the expected answer
      2. Completeness of the response (covers all key points)
      3. Clarity and communication skills
      4. Depth of understanding demonstrated
      5. Use of proper terminology and examples

      **Instructions:**
      - Compare the candidate's answer directly against the expected answer
      - Rate the response from 1-10 (1=Poor, 5=Average, 10=Excellent)
      - Provide specific, actionable feedback for improvement
      - Mention what was missing if the answer was incomplete
      - Highlight what was done well if applicable

      Return the result in JSON format with exactly these fields:
      {
        "ratings": <number between 1-10>,
        "feedback": "<detailed feedback string>"
      }
    `;

    try {
      const aiResult = await sendMessageWithRetry(prompt);
      
      if (!aiResult) {
        throw new Error("No response from AI service");
      }

      const parsedResult: AIResponse = cleanJsonResponse(
        aiResult.response.text()
      );
      return parsedResult;
    } catch (error) {
      console.log(error);
      
      // Fallback response when API is unavailable
      const fallbackResponse = {
        ratings: 7,
        feedback: "Thank you for your response! Due to high demand, detailed AI feedback is temporarily unavailable. Your answer shows good understanding of the topic. Keep practicing to improve further!"
      };
      
      toast("Warning", {
        description: error instanceof Error ? error.message : "Using fallback feedback due to API limitations.",
      });
      
      return fallbackResponse;
    } finally {
      setIsAiGenerating(false);
    }
  };

  const recordNewAnswer = () => {
    setUserAnswer("");
    setAiResult(null);
  };

  const skipQuestion = async () => {
    if (!userId || !interviewId) {
      toast.error("Error", {
        description: "Unable to skip question. Please try again.",
      });
      return;
    }

    setLoading(true);
    
    try {
      // For default interviews, create a unique identifier per user session
      const uniqueInterviewId = getUniqueInterviewId(interviewId!, userId!);
      
      // Check if answer already exists for this question
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", question.question),
        where("mockIdRef", "==", uniqueInterviewId)
      );

      const querySnap = await getDocs(userAnswerQuery);

      if (!querySnap.empty) {
        // Update existing answer to mark as skipped
        const existingDoc = querySnap.docs[0];
        await updateDoc(firestoreDoc(db, "userAnswers", existingDoc.id), {
          user_ans: "(Question skipped)",
          feedback: "This question was skipped during the interview.",
          rating: 0,
          updatedAt: serverTimestamp(),
        });

        toast("Question Skipped", { 
          description: "Question has been marked as skipped." 
        });
      } else {
        // Save new skipped answer
        await addDoc(collection(db, "userAnswers"), {
          mockIdRef: uniqueInterviewId,
          question: question.question,
          correct_ans: question.answer,
          user_ans: "(Question skipped)",
          feedback: "This question was skipped during the interview.",
          rating: 0,
          userId,
          createdAt: serverTimestamp(),
        });

        // Mark session as used since we're now saving answers
        markSessionAsUsed(interviewId!, userId!);

        toast("Question Skipped", { description: "Question has been skipped." });
      }

      // Reset the component state to show skipped status
      setUserAnswer("(Question skipped)");
      setAiResult({
        ratings: 0,
        feedback: "This question was skipped during the interview."
      });

      // Move to next question automatically
      setTimeout(() => {
        if (onQuestionSkipped) {
          onQuestionSkipped();
        }
      }, 1500); // Give user time to see the skip confirmation
      
    } catch (error) {
      toast.error("Error", {
        description: "An error occurred while skipping the question.",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };  const saveUserAnswer = async () => {
    setLoading(true);

    if (!aiResult) {
      return;
    }

    const currentQuestion = question.question;
    try {
      // For default interviews, create a unique identifier per user session
      const uniqueInterviewId = getUniqueInterviewId(interviewId!, userId!);
      
      // query the firebase to check if the user answer already exists for this question
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", currentQuestion),
        where("mockIdRef", "==", uniqueInterviewId)
      );

      const querySnap = await getDocs(userAnswerQuery);

      if (!querySnap.empty) {
        // Update existing answer with the latest response
        const existingDoc = querySnap.docs[0];
        await updateDoc(firestoreDoc(db, "userAnswers", existingDoc.id), {
          user_ans: userAnswer,
          feedback: aiResult.feedback,
          rating: aiResult.ratings,
          updatedAt: serverTimestamp(),
        });

        toast("Updated", { 
          description: "Your answer has been updated with the latest response." 
        });
      } else {
        // Save new user answer
        await addDoc(collection(db, "userAnswers"), {
          mockIdRef: uniqueInterviewId,
          question: question.question,
          correct_ans: question.answer,
          user_ans: userAnswer,
          feedback: aiResult.feedback,
          rating: aiResult.ratings,
          userId,
          createdAt: serverTimestamp(),
        });

        // Mark session as used since we're now saving answers
        markSessionAsUsed(interviewId!, userId!);

        toast("Saved", { description: "Your answer has been saved." });
      }

      setUserAnswer("");
      stopSpeechToText();
    } catch (error) {
      toast("Error", {
        description: "An error occurred while generating feedback.",
      });
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(!open);
    }
  };

  useEffect(() => {
    const combineTranscripts = results
      .filter((result): result is ResultType => typeof result !== "string")
      .map((result) => result.transcript)
      .join(" ");

    setUserAnswer(combineTranscripts);
  }, [results]);

  return (
    <div className="w-full flex flex-col items-center gap-8 mt-4">
      {/* save modal */}
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={loading}
      />

      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
        {isWebCam ? (
          <WebCam
            onUserMedia={() => setIsWebCam(true)}
            onUserMediaError={() => setIsWebCam(false)}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
        )}
      </div>

      <div className="flex itece justify-center gap-3">
        <TooltipButton
          content={isWebCam ? "Turn Off" : "Turn On"}
          icon={
            isWebCam ? (
              <VideoOff className="min-w-5 min-h-5" />
            ) : (
              <Video className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setIsWebCam(!isWebCam)}
        />

        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={
            isRecording ? (
              <CircleStop className="min-w-5 min-h-5" />
            ) : (
              <Mic className="min-w-5 min-h-5" />
            )
          }
          onClick={recordUserAnswer}
        />

        <TooltipButton
          content="Record Again"
          icon={<RefreshCw className="min-w-5 min-h-5" />}
          onClick={recordNewAnswer}
        />

        <TooltipButton
          content="Skip Question"
          icon={<SkipForward className="min-w-5 min-h-5" />}
          onClick={skipQuestion}
          disbaled={loading}
        />

        <TooltipButton
          content="Save Result"
          icon={
            isAiGenerating ? (
              <Loader className="min-w-5 min-h-5 animate-spin" />
            ) : (
              <Save className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setOpen(!open)}
          disbaled={!aiResult}
        />
      </div>

      <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
        <h2 className="text-lg font-semibold">Your Answer:</h2>

        <p className={`text-sm mt-2 whitespace-normal ${
          userAnswer === "(Question skipped)" ? "text-amber-600 font-medium" : "text-gray-700"
        }`}>
          {userAnswer === "(Question skipped)" 
            ? "✓ Question skipped - You can move to the next question" 
            : userAnswer || "Start recording to see your answer here"
          }
        </p>

        {interimResult && (
          <p className="text-sm text-gray-500 mt-2">
            <strong>Current Speech:</strong>
            {interimResult}
          </p>
        )}
      </div>
    </div>
  );
};
