import { Interview } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { defaultInterviews } from "@/lib/default-interviews";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { DemoVoiceInterview } from "@/components/demo-voice-interview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MonitorSpeaker } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Function to generate AI questions for default interviews
const generateAIQuestions = async (interview: Interview, setApiLimitExceeded?: (value: boolean) => void) => {
  console.log("🔄 Starting AI question generation for voice interview:", interview.position);
  
  try {
    // Check if API key exists
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("🔑 API Key available:", !!apiKey);
    
    if (!apiKey) {
      console.error("❌ Gemini API key not found");
      return getFallbackQuestions(interview);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const randomSeed = Math.floor(Math.random() * 10000);
    console.log("🎲 Random seed:", randomSeed);
    
    // Difficulty-specific prompts
    const difficultyPrompts = {
      Easy: "Generate basic, entry-level questions suitable for beginners or junior developers. Focus on fundamental concepts, basic syntax, and simple problem-solving scenarios.",
      Moderate: "Generate intermediate-level questions for experienced professionals. Include questions about best practices, design patterns, optimization, and real-world problem-solving.",
      Difficult: "Generate advanced, challenging questions for senior-level positions. Include complex system design, architecture decisions, performance optimization, and expert-level concepts."
    };

    // DSA-specific enhancements
    const isDSAInterview = interview.position.toLowerCase().includes('dsa');
    console.log("🧮 Is DSA Interview:", isDSAInterview);
    
    const dsaGuidelines = isDSAInterview ? `
    DSA Interview Guidelines:
    - Include coding problems and algorithm questions
    - Cover data structures appropriate for ${interview.difficulty} level
    - Include time/space complexity analysis
    - Include problem-solving and optimization questions
    - Focus on algorithmic thinking and implementation
    ` : '';

    const prompt = `
        As an experienced technical interviewer, generate a UNIQUE and RANDOM set of 5 ${interview.difficulty} level technical interview questions for the position: ${interview.position}.

        Tech Stack Focus: ${interview.techStack}
        Experience Level: ${interview.experience} years
        Difficulty: ${interview.difficulty}

        ${difficultyPrompts[interview.difficulty as keyof typeof difficultyPrompts]}
        ${dsaGuidelines}

        RANDOMIZATION REQUIREMENT: Generate completely different questions each time. Use this random seed for variety: ${randomSeed}

        Instructions:
        1. Generate RANDOM and DIVERSE questions - avoid repetitive patterns
        2. Ensure questions are SPECIFICALLY ${interview.difficulty} level
        3. Questions must be relevant to the position and tech stack
        4. Include practical, real-world scenarios
        5. Provide comprehensive answers with explanations

        Format as a JSON array with objects containing "question" and "answer" fields.
        Return only the JSON array without any additional text or formatting.
    `;

    console.log("📝 Sending prompt to AI...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("🤖 AI Response received, length:", text.length);
    
    // Clean and parse the response
    const cleanedText = text.replace(/```json|```/g, '').trim();
    
    const aiQuestions = JSON.parse(cleanedText);
    console.log("✅ Parsed AI questions:", aiQuestions.length, "questions");
    
    // Validate the response
    if (!Array.isArray(aiQuestions) || aiQuestions.length === 0) {
      console.error("❌ Invalid AI response format");
      return getFallbackQuestions(interview);
    }

    // Ensure each question has required fields
    const validQuestions = aiQuestions.filter(q => q.question && q.answer);
    if (validQuestions.length === 0) {
      console.error("❌ No valid questions in AI response");
      return getFallbackQuestions(interview);
    }
    
    console.log("🎉 Successfully generated", validQuestions.length, "AI questions");
    return validQuestions;
  } catch (error: any) {
    console.error("💥 Error generating AI questions:", error);
    
    // Check if it's an API limit error
    if (error?.message?.includes('429') || error?.message?.includes('quota') || error?.message?.includes('Too Many Requests')) {
      console.log("🚫 API limit exceeded, using fallback questions");
      if (setApiLimitExceeded) {
        setApiLimitExceeded(true);
      }
    }
    
    console.log("🔄 Falling back to static questions");
    return getFallbackQuestions(interview);
  }
};

// Fallback questions for when AI generation fails
const getFallbackQuestions = (interview: Interview) => {
  const isDSAInterview = interview.position.toLowerCase().includes('dsa');
  const difficulty = interview.difficulty;

  if (isDSAInterview) {
    if (difficulty === 'Easy') {
      return [
        {
          question: 'What is Big O notation and why is it important?',
          answer: 'Big O notation describes the worst-case time or space complexity of an algorithm as input size grows. It helps compare algorithm efficiency.'
        },
        {
          question: 'Explain the difference between an array and a linked list.',
          answer: 'Arrays store elements in contiguous memory with O(1) random access but O(n) insertion/deletion. Linked lists have O(n) access but O(1) insertion/deletion at known positions.'
        },
        {
          question: 'What is a stack and where would you use it?',
          answer: 'A stack is LIFO (Last In First Out) data structure with push, pop, and peek operations. Uses: function call management, undo operations, expression evaluation.'
        },
        {
          question: 'How do you reverse a string? Write the algorithm.',
          answer: 'Two-pointer approach: Use left and right pointers, swap characters while left < right, move pointers inward. Time: O(n), Space: O(1).'
        },
        {
          question: 'Find the maximum element in an array. What\'s the time complexity?',
          answer: 'Iterate through array once, keep track of maximum seen so far. Time complexity: O(n), Space complexity: O(1).'
        }
      ];
    }
  }
  
  // Default fallback questions for any interview type
  return [
    {
      question: 'Tell me about yourself and your technical background.',
      answer: 'This is an open-ended question to assess communication skills and experience overview.'
    },
    {
      question: 'What interests you about this position?',
      answer: 'This question evaluates motivation and understanding of the role requirements.'
    },
    {
      question: 'Describe a challenging technical problem you solved recently.',
      answer: 'This assesses problem-solving skills and technical depth in real scenarios.'
    },
    {
      question: 'How do you stay updated with technology trends?',
      answer: 'This evaluates continuous learning mindset and industry engagement.'
    },
    {
      question: 'What questions do you have for me about the role or company?',
      answer: 'This tests preparation and genuine interest in the opportunity.'
    }
  ];
};

export const VoiceInterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [questions, setQuestions] = useState<Array<{ question: string; answer: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [apiLimitExceeded, setApiLimitExceeded] = useState(false);
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
            
            // Check if questions need to be generated
            if (!defaultInterview.questions || defaultInterview.questions.length === 0) {
              console.log("🔄 Generating questions for default interview");
              setIsGeneratingQuestions(true);
              const generatedQuestions = await generateAIQuestions(defaultInterview, setApiLimitExceeded);
              setQuestions(generatedQuestions);
              setIsGeneratingQuestions(false);
            } else {
              setQuestions(defaultInterview.questions);
            }
            
            setIsLoading(false);
            return; // Exit early since we found the interview
          } else {
            // Try to fetch from Firestore for custom interviews
            const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
            if (interviewDoc.exists()) {
              const customInterview = {
                id: interviewDoc.id,
                ...interviewDoc.data(),
              } as Interview;
              setInterview(customInterview);
              
              // Set questions if they exist
              if (customInterview.questions && customInterview.questions.length > 0) {
                setQuestions(customInterview.questions);
              } else {
                console.log("🔄 Generating questions for custom interview");
                setIsGeneratingQuestions(true);
                const generatedQuestions = await generateAIQuestions(customInterview, setApiLimitExceeded);
                setQuestions(generatedQuestions);
                setIsGeneratingQuestions(false);
              }
              
              setIsLoading(false);
              return; // Exit early since we found the interview
            }
          }
        } catch (error) {
          console.log(error);
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

  const handleInterviewComplete = (feedback: string) => {
    console.log('Interview completed with feedback:', feedback);
    // Store the voice interview completion data
    setTimeout(() => {
      navigate(`/generate/feedback/${interviewId}`);
    }, 2000); // Give user time to see completion message
  };

  if (isLoading || isGeneratingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[70vh] gap-4">
        <LoaderPage className="w-full h-full" />
        {isGeneratingQuestions && (
          <p className="text-sm text-gray-600 animate-pulse">
            🤖 Generating AI questions for your interview...
          </p>
        )}
      </div>
    );
  }

  if (!interviewId || !interview) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <CustomBreadCrumb
        breadCrumbPage="Voice AI Interview"
        breadCrumpItems={[
          { label: "Mock Interviews", link: "/generate" },
          {
            label: interview?.position || "",
            link: `/generate/interview/${interview?.id}`,
          },
        ]}
      />

      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Voice Interview Mode</h2>
        
        <Alert className="bg-blue-100 border border-blue-200 p-4 rounded-lg flex items-start gap-3 mb-6">
          <MonitorSpeaker className="h-5 w-5 text-blue-600" />
          <div>
            <AlertTitle className="text-blue-800 font-semibold">
              AI Voice Interview Mode
            </AlertTitle>
            <AlertDescription className="text-sm text-blue-700 mt-1 leading-relaxed">
              Experience a realistic interview with an AI that speaks to you naturally.
              The AI will ask questions, listen to your responses, and provide follow-up
              questions based on your answers. Speak clearly and take your time.
              <br />
              <br />
              <strong>Requirements:</strong>{" "}
              <span className="font-medium">Microphone access required.</span>{" "}
              Make sure you're in a quiet environment for best results.
            </AlertDescription>
          </div>
        </Alert>

        {apiLimitExceeded && (
          <Alert className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-start gap-3 mb-6">
            <div className="h-5 w-5 text-orange-600 text-lg">⚠️</div>
            <div>
              <AlertTitle className="text-orange-800 font-semibold">
                Using Curated Questions
              </AlertTitle>
              <AlertDescription className="text-sm text-orange-700 mt-1 leading-relaxed">
                We've reached our daily AI question generation limit. Don't worry! You're getting 
                carefully curated {interview?.difficulty?.toLowerCase()} level questions specifically 
                designed for {interview?.position} interviews. The interview experience remains 
                fully functional and high-quality.
              </AlertDescription>
            </div>
          </Alert>
        )}

        {questions && questions.length > 0 ? (
          <DemoVoiceInterview 
            interview={interview}
            questions={questions}
            onInterviewComplete={handleInterviewComplete}
          />
        ) : (
          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600">No questions available for this interview.</p>
            <p className="text-sm text-gray-500 mt-2">Please try again or contact support.</p>
          </div>
        )}
      </div>
    </div>
  );
};
