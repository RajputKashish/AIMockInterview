import { Interview } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { defaultInterviews } from "@/lib/default-interviews";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle, ArrowRight } from "lucide-react";
import { QuestionSection } from "@/components/question-section";
import { useAuth } from "@clerk/clerk-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Utility function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to create unique interview ID for default interviews
const getUniqueInterviewId = (interviewId: string, userId: string): string => {
  if (interviewId.startsWith('default-')) {
    // Create a session-specific key for localStorage
    const sessionKey = `interview_session_${interviewId}_${userId}`;
    
    // Try to get existing session ID from localStorage
    let sessionId = localStorage.getItem(sessionKey);
    
    // If no session exists, create a new one and mark as fresh
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(sessionKey, sessionId);
      console.log("🔧 Created new interview session:", sessionId);
      
      // Mark this as a fresh session
      const freshSessionKey = `fresh_session_${interviewId}_${userId}`;
      localStorage.setItem(freshSessionKey, 'true');
      console.log("🔧 Marked session as fresh");
    } else {
      console.log("🔧 Using existing interview session:", sessionId);
    }
    
    const uniqueId = `${interviewId}-${userId}-${sessionId}`;
    console.log("🔧 Generated unique interview ID:", uniqueId);
    return uniqueId;
  }
  console.log("🔧 Using original interview ID:", interviewId);
  return interviewId;
};

// Helper function to check if this is a fresh session
const isFreshSession = (interviewId: string, userId: string): boolean => {
  if (interviewId.startsWith('default-')) {
    const freshSessionKey = `fresh_session_${interviewId}_${userId}`;
    const isFresh = localStorage.getItem(freshSessionKey) === 'true';
    console.log("🔧 isFreshSession check:", {
      key: freshSessionKey,
      value: localStorage.getItem(freshSessionKey),
      isFresh: isFresh
    });
    return isFresh;
  }
  return false;
};

// Helper function to force a fresh session (used by Start Fresh button)
const forceFreshSession = (interviewId: string, userId: string): void => {
  if (interviewId.startsWith('default-')) {
    const sessionKey = `interview_session_${interviewId}_${userId}`;
    const freshSessionKey = `fresh_session_${interviewId}_${userId}`;
    
    // Remove existing session
    localStorage.removeItem(sessionKey);
    localStorage.removeItem(freshSessionKey);
    
    // Create new session and mark as fresh
    const newSessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(sessionKey, newSessionId);
    localStorage.setItem(freshSessionKey, 'true');
    
    console.log("🔧 Forced fresh session:", newSessionId);
  }
};

// Function to generate AI questions for default interviews
const generateAIQuestions = async (interview: Interview) => {
  console.log("🔄 Starting AI question generation for:", interview.position);
  
  try {
    // Check if API key exists
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("🔑 API Key available:", !!apiKey);
    console.log("🔑 API Key prefix:", apiKey ? apiKey.substring(0, 10) + "..." : "None");
    
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
    console.log("🤖 AI Response preview:", text.substring(0, 200) + "...");
    
    // Clean and parse the response
    const cleanedText = text.replace(/```json|```/g, '').trim();
    console.log("🧹 Cleaned text preview:", cleanedText.substring(0, 200) + "...");
    
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
  } catch (error) {
    console.error("💥 Error generating AI questions:", error);
    console.log("🔄 Falling back to static questions");
    // Return fallback questions
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
          answer: 'Big O notation describes the worst-case time or space complexity of an algorithm as input size grows. It helps compare algorithm efficiency. Common complexities: O(1) constant, O(n) linear, O(n²) quadratic, O(log n) logarithmic.'
        },
        {
          question: 'Explain the difference between an array and a linked list.',
          answer: 'Arrays store elements in contiguous memory with O(1) random access but O(n) insertion/deletion. Linked lists have O(n) access but O(1) insertion/deletion at known positions.'
        },
        {
          question: 'What is a stack and where would you use it?',
          answer: 'A stack is LIFO (Last In First Out) data structure with push, pop, and peek operations. Uses: function call management, undo operations, expression evaluation, backtracking algorithms.'
        },
        {
          question: 'How do you reverse a string? Write the algorithm.',
          answer: 'Two-pointer approach: Use left and right pointers, swap characters while left < right, move pointers inward. Time: O(n), Space: O(1).'
        },
        {
          question: 'Find the maximum element in an array. What\'s the time complexity?',
          answer: 'Iterate through array once, keep track of maximum seen so far. Compare each element with current max, update if larger. Time complexity: O(n), Space complexity: O(1).'
        }
      ];
    } else if (difficulty === 'Moderate') {
      return [
        {
          question: 'Implement a binary search algorithm and explain its time complexity.',
          answer: 'Binary search works on sorted arrays. Compare target with middle element. If equal, found. If target smaller, search left half. If larger, search right half. Time: O(log n), Space: O(1) iterative.'
        },
        {
          question: 'What is a hash table and how do you handle collisions?',
          answer: 'Hash table maps keys to values using hash function. Collision handling: 1) Chaining - store multiple values in linked lists, 2) Open addressing - probe for next available slot.'
        },
        {
          question: 'Explain depth-first search (DFS) vs breadth-first search (BFS).',
          answer: 'DFS explores as far as possible along each branch before backtracking. Uses stack/recursion. BFS explores all neighbors at current depth before moving deeper. Uses queue.'
        },
        {
          question: 'What is dynamic programming? Give an example.',
          answer: 'DP solves complex problems by breaking into overlapping subproblems, storing results to avoid recomputation. Example: Fibonacci with memoization becomes O(n) instead of O(2^n).'
        },
        {
          question: 'How would you detect a cycle in a linked list?',
          answer: 'Floyd\'s Cycle Detection (Tortoise and Hare): Use two pointers, slow moves one step, fast moves two steps. If there\'s a cycle, fast will eventually meet slow.'
        }
      ];
    } else {
      return [
        {
          question: 'Explain different tree balancing techniques and when to use each.',
          answer: 'AVL trees: Height-balanced, O(log n) operations. Red-Black trees: Less strict balancing, used in C++ STL. B-trees: Multi-way trees for databases. Choose based on operation frequency.'
        },
        {
          question: 'Design a LRU (Least Recently Used) cache with O(1) operations.',
          answer: 'Combine hash map and doubly linked list. Hash map stores key->node mapping for O(1) access. Doubly linked list maintains order (head=most recent, tail=least recent).'
        },
        {
          question: 'Implement Dijkstra\'s algorithm and explain its time complexity.',
          answer: 'Dijkstra finds shortest paths from source to all vertices in weighted graph. Uses priority queue, relaxes edges. Time: O((V+E)log V) with binary heap.'
        },
        {
          question: 'How would you find the median in a stream of integers?',
          answer: 'Use two heaps: max-heap for smaller half, min-heap for larger half. Keep heaps balanced. Median is top of larger heap or average of both tops.'
        },
        {
          question: 'Explain the difference between P, NP, and NP-Complete problems.',
          answer: 'P: Problems solvable in polynomial time. NP: Problems verifiable in polynomial time. NP-Complete: Hardest problems in NP, any NP problem can be reduced to them.'
        }
      ];
    }
  } else {
    // Generic fallback questions based on tech stack
    return [
      {
        question: `What are the key concepts in ${interview.techStack}?`,
        answer: `Key concepts include understanding the fundamentals, best practices, and practical applications of ${interview.techStack} in real-world scenarios.`
      },
      {
        question: `How would you approach a ${(interview.difficulty || 'intermediate').toLowerCase()} level problem in ${interview.position}?`,
        answer: `I would start by understanding requirements, break down the problem into smaller parts, choose appropriate technologies from ${interview.techStack}, and implement with proper testing.`
      },
      {
        question: `What challenges have you faced working with ${interview.techStack}?`,
        answer: `Common challenges include performance optimization, debugging complex issues, maintaining code quality, and staying updated with best practices and new features.`
      },
      {
        question: `Describe your experience with the ${interview.position} role.`,
        answer: `This role requires strong technical skills in ${interview.techStack}, problem-solving abilities, collaboration with team members, and continuous learning to stay current with technology trends.`
      },
      {
        question: `How do you ensure code quality in ${interview.techStack} projects?`,
        answer: `I focus on writing clean, readable code, implementing proper testing strategies, following coding standards, conducting code reviews, and using appropriate tools for static analysis.`
      }
    ];
  }
};

export const TraditionalInterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number>(0);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const { userId } = useAuth();
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
              console.log("Found default interview:", defaultInterview.position);
              setIsGeneratingQuestions(true);
              
              // Generate AI questions for default interviews
              console.log("Generating AI questions...");
              const aiQuestions = await generateAIQuestions(defaultInterview);
              console.log("Generated questions:", aiQuestions.length);
              
              const enhancedInterview = {
                ...defaultInterview,
                questions: aiQuestions
              };
              setInterview(enhancedInterview);
              setIsGeneratingQuestions(false);
            } else {
              console.log("Default interview not found");
              navigate("/generate", { replace: true });
            }
          } else {
            // Regular user interview - fetch from Firestore
            const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
            if (interviewDoc.exists()) {
              const interviewData = {
                id: interviewDoc.id,
                ...interviewDoc.data(),
              } as Interview;
              
              // Shuffle the questions for randomization
              const shuffledInterview = {
                ...interviewData,
                questions: shuffleArray(interviewData.questions)
              };
              setInterview(shuffledInterview);
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

  // Check for answered questions with more frequent updates
  useEffect(() => {
    // Always reset answered questions when component mounts
    console.log("🔄 Component mounted/interview changed");
    setAnsweredQuestions(0);
    
    // On every page load, consider whether this should be a fresh session
    if (interviewId && userId && interviewId.startsWith('default-')) {
      const lastActivityKey = `last_activity_${interviewId}_${userId}`;
      const freshSessionKey = `fresh_session_${interviewId}_${userId}`;
      const lastActivity = localStorage.getItem(lastActivityKey);
      const now = Date.now();
      const fiveMinutesAgo = now - (5 * 60 * 1000); // 5 minutes
      
      console.log("🔍 Activity-based fresh session check:", {
        lastActivityKey,
        freshSessionKey,
        lastActivity,
        now,
        fiveMinutesAgo,
        lastActivityNumber: lastActivity ? parseInt(lastActivity) : null,
        isStale: !lastActivity || parseInt(lastActivity) < fiveMinutesAgo,
        currentFreshValue: localStorage.getItem(freshSessionKey)
      });
      
      // If no recent activity (or first time), mark as fresh session
      if (!lastActivity || parseInt(lastActivity) < fiveMinutesAgo) {
        console.log("🔧 No recent activity - FORCIBLY marking as fresh session");
        localStorage.setItem(freshSessionKey, 'true');
        console.log("🔧 Fresh session flag set to:", localStorage.getItem(freshSessionKey));
      } else {
        console.log("🔧 Recent activity found - not marking as fresh");
      }
      
      // Update last activity
      localStorage.setItem(lastActivityKey, now.toString());
      console.log("🔧 Updated last activity to:", now);
    }
    
    const checkAnsweredQuestions = async () => {
      if (interviewId && userId && interview?.questions) {
        try {
          console.log("🔍 Starting answered questions check");
          
          // ALWAYS check if this is a fresh session first - this takes precedence
          const freshSession = isFreshSession(interviewId, userId);
          console.log("🔍 Is fresh session:", freshSession);
          
          if (freshSession) {
            console.log("🔍 FRESH SESSION - Forcing answered questions to 0 and exiting");
            setAnsweredQuestions(0);
            return; // Exit early for fresh sessions
          }

          // Only proceed with Firebase check if it's NOT a fresh session
          const uniqueInterviewId = getUniqueInterviewId(interviewId, userId);
          console.log("🔍 Non-fresh session - checking Firebase with unique ID:", uniqueInterviewId);

          const userAnswerQuery = query(
            collection(db, "userAnswers"),
            where("userId", "==", userId),
            where("mockIdRef", "==", uniqueInterviewId)
          );

          const querySnap = await getDocs(userAnswerQuery);
          const currentSessionAnswers = querySnap.size;
          console.log("🔍 Firebase returned answers count:", currentSessionAnswers);
          
          setAnsweredQuestions(currentSessionAnswers);
        } catch (error) {
          console.log("❌ Error checking answered questions:", error);
        }
      }
    };

    if (interview) {
      // Run the check immediately
      checkAnsweredQuestions();
      
      // Set up interval but make sure fresh session logic always wins
      const interval = setInterval(() => {
        // Check if session is still fresh before running Firebase query
        if (!isFreshSession(interviewId!, userId!)) {
          checkAnsweredQuestions();
        } else {
          console.log("🔍 Interval check: Still fresh session, keeping answered questions at 0");
          setAnsweredQuestions(0);
        }
      }, 2000); // Check every 2 seconds instead of every second
      
      return () => clearInterval(interval);
    }
  }, [interviewId, userId, interview]);

  const handleViewFeedback = () => {
    navigate(`/generate/feedback/${interviewId}`);
  };

  if (isLoading || isGeneratingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[70vh]">
        <LoaderPage className="w-full h-full" />
        {isGeneratingQuestions && (
          <p className="mt-4 text-lg text-gray-600 font-medium">
            Generating personalized AI questions for your interview...
          </p>
        )}
      </div>
    );
  }

  if (!interviewId || !interview) {
    navigate("/generate", { replace: true });
    return null;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <CustomBreadCrumb
        breadCrumbPage="Traditional Interview"
        breadCrumpItems={[
          { label: "Mock Interviews", link: "/generate" },
          {
            label: interview?.position || "",
            link: `/generate/interview/${interview?.id}`,
          },
        ]}
      />

      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Traditional Interview Mode</h2>
          {interview?.difficulty && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Difficulty:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                interview.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                interview.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {interview.difficulty}
              </span>
            </div>
          )}
        </div>
        
        {/* Progress Indicator */}
        {interview?.questions && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Interview Progress</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {answeredQuestions} of {interview.questions.length} questions answered
                </span>
                {answeredQuestions > 0 && (
                  <Button
                    onClick={() => {
                      console.log("🔄 START FRESH button clicked");
                      
                      // Use the force fresh session function
                      forceFreshSession(interviewId!, userId!);
                      
                      // Force reset answered questions immediately
                      setAnsweredQuestions(0);
                      
                      console.log("🔄 Reloading page for fresh start");
                      window.location.reload();
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Start Fresh
                  </Button>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${interview.questions.length > 0 ? (answeredQuestions / interview.questions.length) * 100 : 0}%` 
                }}
              ></div>
            </div>
            {answeredQuestions === interview.questions.length && answeredQuestions > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Interview Completed!</span>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  You've answered all questions. Click below to view your detailed feedback and ratings.
                </p>
                <Button 
                  onClick={handleViewFeedback}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Feedback & Results
                </Button>
              </div>
            )}
          </div>
        )}
        
        <Alert className="bg-sky-100 border border-sky-200 p-4 rounded-lg flex items-start gap-3 mb-6">
          <Lightbulb className="h-5 w-5 text-sky-600" />
          <div>
            <AlertTitle className="text-sky-800 font-semibold">
              Traditional Interview Mode
            </AlertTitle>
            <AlertDescription className="text-sm text-sky-700 mt-1 leading-relaxed">
              Press "Record Answer" to begin answering each question. Use "Skip Question" to skip any question and automatically move to the next one. Once you
              finish the interview, you&apos;ll receive feedback comparing your
              responses with the ideal answers.
              <br />
              <br />
              <strong>Note:</strong>{" "}
              <span className="font-medium">Your video is never stored.</span>{" "}
              You can disable the webcam anytime if preferred.
            </AlertDescription>
          </div>
        </Alert>

        {interview?.questions && interview?.questions.length > 0 && (
          <div className="mt-4 w-full flex flex-col items-start gap-4">
            <QuestionSection questions={interview?.questions} />
          </div>
        )}
      </div>
    </div>
  );
};
