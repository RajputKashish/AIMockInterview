import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Play, Pause, Volume2 } from "lucide-react";
import { Interview } from '@/types';
import { useAuth } from "@clerk/clerk-react";
import { 
  addDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc as firestoreDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { sendMessageWithRetry } from "@/scripts";

interface DemoVoiceInterviewProps {
  interview: Interview;
  questions: Array<{ question: string; answer: string }>;
  onInterviewComplete: (feedback: string) => void;
}

export const DemoVoiceInterview = ({ 
  interview, 
  questions, 
  onInterviewComplete 
}: DemoVoiceInterviewProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState<'idle' | 'active' | 'completed'>('idle');
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [conversation, setConversation] = useState<Array<{
    type: 'question' | 'answer';
    content: string;
    timestamp: Date;
  }>>([]);
  const [speechTimeout, setSpeechTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isWaitingForSpeech, setIsWaitingForSpeech] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const currentQuestionIndexRef = useRef<number>(0);
  const { userId } = useAuth();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = false;
      speechRecognitionRef.current.interimResults = false;
      speechRecognitionRef.current.lang = 'en-US';
      speechRecognitionRef.current.maxAlternatives = 1;

      speechRecognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognized:', transcript);
        
        // Clear timeout and reset states
        cleanupSpeechRecognition();
        
        handleUserResponse(transcript);
      };

      speechRecognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        // Clean up immediately
        cleanupSpeechRecognition();
        
        // Only show error message for specific cases, don't auto-retry
        if (event.error === 'not-allowed') {
          alert('Microphone access is required for the voice interview. Please allow microphone access and try again.');
        } else {
          console.log('Speech recognition failed, user can try again manually');
        }
      };

      speechRecognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
        setIsWaitingForSpeech(false);
      };
    }

    return () => {
      cleanupAll();
    };
  }, []);

  const cleanupSpeechRecognition = () => {
    setIsRecording(false);
    setIsWaitingForSpeech(false);
    
    if (speechTimeout) {
      clearTimeout(speechTimeout);
      setSpeechTimeout(null);
    }
  };

  const cleanupAll = () => {
    if (speechSynthesisRef.current) {
      speechSynthesis.cancel();
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    if (speechTimeout) {
      clearTimeout(speechTimeout);
    }
  };

  const speakText = (text: string) => {
    return new Promise<void>((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        
        speechSynthesisRef.current = utterance;
        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const startInterview = async () => {
    setInterviewStatus('active');
    
    // Add welcome message
    const welcomeMessage = `Hello! Welcome to your mock interview for the ${interview.position} position. I'm your AI interviewer today. We'll go through ${questions.length} questions together. Let's begin with the first question.`;
    
    setConversation([{
      type: 'question',
      content: welcomeMessage,
      timestamp: new Date()
    }]);

    await speakText(welcomeMessage);
    
    // Ask first question
    setTimeout(() => {
      askQuestion(0);
    }, 1000);
  };

  // Function to save voice interview answer to Firebase
  const saveVoiceAnswer = async (questionIndex: number, userAnswer: string) => {
    if (!userId || !interview?.id) return;

    try {
      const question = questions[questionIndex];
      
      // Generate AI feedback for the voice answer
      const prompt = `
        You are an expert technical interviewer. Please evaluate the following interview response:

        **Interview Question:** "${question.question}"
        
        **Expected/Ideal Answer:** "${question.answer}"
        
        **Candidate's Answer:** "${userAnswer}"

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

      const aiResult = await sendMessageWithRetry(prompt);
      
      if (!aiResult) {
        throw new Error("No response from AI service");
      }
      
      const cleanText = aiResult.response.text().replace(/```json\n?|```/g, "").trim();
      const parsedResult = JSON.parse(cleanText);

      // Check if answer already exists for this question
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", question.question),
        where("mockIdRef", "==", interview.id)
      );

      const querySnap = await getDocs(userAnswerQuery);

      if (!querySnap.empty) {
        // Update existing answer
        const existingDoc = querySnap.docs[0];
        await updateDoc(firestoreDoc(db, "userAnswers", existingDoc.id), {
          user_ans: userAnswer,
          feedback: parsedResult.feedback,
          rating: parsedResult.ratings,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Save new answer
        await addDoc(collection(db, "userAnswers"), {
          mockIdRef: interview.id,
          question: question.question,
          correct_ans: question.answer,
          user_ans: userAnswer,
          feedback: parsedResult.feedback,
          rating: parsedResult.ratings,
          userId,
          createdAt: serverTimestamp(),
        });
      }

      console.log(`Voice answer saved for question ${questionIndex + 1}`);
    } catch (error) {
      console.error("Error saving voice answer:", error);
      
      // Fallback: Save without AI rating when AI is unavailable
      try {
        const fallbackFeedback = "Thank you for your response. Due to high system load, detailed feedback will be available later.";
        const fallbackRating = 7; // Neutral rating when AI is unavailable
        const currentQuestion = questions[questionIndex];
        
        // Check if answer already exists for this question
        const userAnswerQuery = query(
          collection(db, "userAnswers"),
          where("userId", "==", userId),
          where("question", "==", currentQuestion.question),
          where("mockIdRef", "==", interview.id)
        );

        const querySnap = await getDocs(userAnswerQuery);

        if (!querySnap.empty) {
          // Update existing answer
          const existingDoc = querySnap.docs[0];
          await updateDoc(firestoreDoc(db, "userAnswers", existingDoc.id), {
            user_ans: userAnswer,
            feedback: fallbackFeedback,
            rating: fallbackRating,
            updatedAt: serverTimestamp(),
          });
        } else {
          // Save new answer
          await addDoc(collection(db, "userAnswers"), {
            mockIdRef: interview.id,
            question: currentQuestion.question,
            correct_ans: currentQuestion.answer,
            user_ans: userAnswer,
            feedback: fallbackFeedback,
            rating: fallbackRating,
            userId,
            createdAt: serverTimestamp(),
          });
        }

        console.log(`Voice answer saved with fallback feedback for question ${questionIndex + 1}`);
      } catch (fallbackError) {
        console.error("Failed to save even with fallback:", fallbackError);
      }
    }
  };

  const askQuestion = async (questionIndex: number) => {
    if (questionIndex >= questions.length) {
      completeInterview();
      return;
    }

    const question = questions[questionIndex].question;
    setCurrentQuestionIndex(questionIndex);
    currentQuestionIndexRef.current = questionIndex; // Keep ref in sync
    
    const questionText = `Question ${questionIndex + 1}: ${question}`;
    
    setConversation(prev => [...prev, {
      type: 'question',
      content: questionText,
      timestamp: new Date()
    }]);

    await speakText(questionText);
    
    // Start listening for response
    setTimeout(() => {
      startListening();
    }, 500);
  };

  const startListening = () => {
    if (speechRecognitionRef.current && !isRecording && !isWaitingForSpeech) {
      console.log('Starting speech recognition...');
      
      try {
        setIsRecording(true);
        setIsWaitingForSpeech(true);
        speechRecognitionRef.current.start();
        
        // Set a simple timeout - no automatic advancement
        const timeout = setTimeout(() => {
          console.log('Speech recognition timeout');
          if (speechRecognitionRef.current && isRecording) {
            speechRecognitionRef.current.stop();
          }
          cleanupSpeechRecognition();
        }, 10000); // Reduced to 10 seconds
        
        setSpeechTimeout(timeout);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        cleanupSpeechRecognition();
      }
    } else {
      console.log('Speech recognition already active or conditions not met');
    }
  };

  const handleUserResponse = async (transcript: string) => {
    // Prevent multiple responses
    if (isProcessing) {
      console.log('Already processing, ignoring response');
      return;
    }
    
    setIsProcessing(true);
    
    // Clean up first to prevent timeout from interfering
    cleanupSpeechRecognition();
    
    // Use ref to get the current question index value
    const currentIndex = currentQuestionIndexRef.current;
    const nextQuestionIndex = currentIndex + 1;
    
    console.log(`Current question index: ${currentIndex}, Next: ${nextQuestionIndex}, Total questions: ${questions.length}`);
    
    setUserResponses(prev => [...prev, transcript]);
    
    setConversation(prev => [...prev, {
      type: 'answer',
      content: transcript,
      timestamp: new Date()
    }]);

    // Save the voice answer to Firebase (in background)
    saveVoiceAnswer(currentIndex, transcript).catch(error => {
      console.error("Failed to save voice answer:", error);
    });

    // Provide feedback
    const feedback = nextQuestionIndex < questions.length 
      ? "Thank you for your response. Let me ask you the next question." 
      : "Thank you for your final response. Let me provide you with the interview summary.";
    
    setConversation(prev => [...prev, {
      type: 'question',
      content: feedback,
      timestamp: new Date()
    }]);

    await speakText(feedback);
    
    // Move to next question or complete interview
    setTimeout(() => {
      if (nextQuestionIndex < questions.length) {
        console.log(`Moving to question ${nextQuestionIndex + 1}`);
        askQuestion(nextQuestionIndex);
        setIsProcessing(false);
      } else {
        console.log('Completing interview');
        completeInterview();
        setIsProcessing(false);
      }
    }, 1000);
  };

  const completeInterview = async () => {
    const completionMessage = "Thank you for completing the interview. You've answered all questions. Good luck with your job search!";
    
    setConversation(prev => [...prev, {
      type: 'question',
      content: completionMessage,
      timestamp: new Date()
    }]);

    await speakText(completionMessage);
    
    setInterviewStatus('completed');
    
    const feedback = `Interview Completed!
    
Position: ${interview.position}
Questions Answered: ${userResponses.length}/${questions.length}
Duration: ${Math.round((Date.now() - (conversation[0]?.timestamp?.getTime() || Date.now())) / 60000)} minutes

Your responses have been recorded for analysis. Thank you for completing the voice interview!`;
    
    onInterviewComplete(feedback);
  };

  const stopInterview = () => {
    cleanupAll();
    setInterviewStatus('idle');
    setIsRecording(false);
    setIsSpeaking(false);
    setIsWaitingForSpeech(false);
    setIsProcessing(false);
    setCurrentQuestionIndex(0);
    currentQuestionIndexRef.current = 0; // Reset ref too
    setUserResponses([]);
    setConversation([]);
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      cleanupSpeechRecognition();
    } else {
      startListening();
    }
  };

  const skipCurrentQuestion = async () => {
    // Prevent multiple clicks
    if (isProcessing) {
      console.log('Already processing, ignoring skip request');
      return;
    }
    
    setIsProcessing(true);
    
    // Stop any current recording and cleanup
    cleanupSpeechRecognition();
    
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    
    // Use ref to get current index
    const currentIndex = currentQuestionIndexRef.current;
    const nextQuestionIndex = currentIndex + 1;
    
    console.log(`Skipping question ${currentIndex + 1}, moving to question ${nextQuestionIndex + 1}`);
    
    // Add skipped response to conversation
    setConversation(prev => [...prev, {
      type: 'answer',
      content: '(Question skipped)',
      timestamp: new Date()
    }]);
    
    if (nextQuestionIndex < questions.length) {
      const skipMessage = "Moving to the next question.";
      
      setConversation(prev => [...prev, {
        type: 'question',
        content: skipMessage,
        timestamp: new Date()
      }]);

      await speakText(skipMessage);
      
      setTimeout(() => {
        askQuestion(nextQuestionIndex);
        setIsProcessing(false);
      }, 1000);
    } else {
      completeInterview();
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Interview Header */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
              <Volume2 className="w-8 h-8 text-emerald-600" />
              Voice AI Interview - {interview.position}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 px-4 py-2 text-sm font-medium">
                {questions.length} Questions
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium">
                Browser Speech API
              </Badge>
              <Badge variant="outline" className={`px-4 py-2 text-sm font-medium ${
                interviewStatus === 'active' ? 'bg-green-50 text-green-700' : 
                interviewStatus === 'completed' ? 'bg-gray-50 text-gray-700' :
                'bg-yellow-50 text-yellow-700'
              }`}>
                {interviewStatus === 'idle' ? 'Ready to Start' :
                 interviewStatus === 'active' ? 'Live Interview' :
                 'Completed'}
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
              This AI interviewer uses your browser's built-in speech recognition and synthesis APIs. 
              Get ready for an interactive voice interview experience!
            </p>
            
            {/* Control Buttons */}
            <div className="flex justify-center gap-4">
              {interviewStatus === 'idle' ? (
                <Button 
                  onClick={startInterview}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Start Interview
                </Button>
              ) : interviewStatus === 'active' ? (
              <>
                <Button 
                  onClick={stopInterview}
                  variant="destructive"
                  size="lg"
                  className="px-6 py-3 rounded-xl"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Stop Interview
                </Button>
                
                <Button 
                  onClick={toggleRecording}
                  variant={isRecording ? "destructive" : "secondary"}
                  size="lg"
                  className="px-6 py-3 rounded-xl"
                >
                  {isRecording ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
                
                <Button 
                  onClick={skipCurrentQuestion}
                  disabled={isProcessing || isSpeaking}
                  variant="outline"
                  size="lg"
                  className="text-amber-600 border-amber-300 hover:bg-amber-50 disabled:opacity-50 px-6 py-3 rounded-xl"
                >
                  {isProcessing ? 'Processing...' : 'Skip Question'}
                </Button>
              </>
            ) : (
              <Badge className="bg-green-100 text-green-800 px-6 py-3 text-lg font-semibold rounded-xl">
                Interview Completed!
              </Badge>
            )}
            </div>
          </CardContent>
        </Card>

        {/* Voice Status Indicator */}
        {interviewStatus === 'active' && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-6">
                <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-lg font-medium ${
                  isSpeaking ? 'bg-blue-100 text-blue-700' :
                  isRecording ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {isSpeaking ? (
                    <>
                      <Volume2 className="w-5 h-5" />
                      <span>AI Speaking...</span>
                    </>
                  ) : isRecording ? (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>Listening...</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-5 h-5" />
                      <span>Click "Start Recording" to answer</span>
                    </>
                  )}
                </div>
                
                <div className="text-lg text-gray-700 font-semibold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>
              
              {!isSpeaking && !isRecording && (
                <div className="text-center mt-6">
                  <p className="text-gray-500">
                    Click "Start Recording" to answer the question, or "Skip Question" to move on
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Conversation Log */}
        {conversation.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Interview Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conversation.map((item, index) => (
                  <div key={index} className={`p-4 rounded-xl ${
                    item.type === 'question' 
                      ? 'bg-blue-50 border-l-4 border-blue-400' 
                      : 'bg-green-50 border-l-4 border-green-400'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">
                        {item.type === 'question' ? '🤖 AI Interviewer' : '👤 You'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{item.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
