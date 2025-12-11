import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Interview } from "@/types";

import { CustomBreadCrumb } from "./custom-bread-crumb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Headings } from "./headings";
import { Button } from "./ui/button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui";
import { sendMessageWithRetry } from "@/scripts";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
  difficulty: z.enum(["Easy", "Moderate", "Difficult"], {
    required_error: "Please select a difficulty level",
  }),
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData
    ? initialData.position
    : "Create a new mock interview";

  const breadCrumpPage = initialData ? initialData?.position : "Create";
  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };

  const cleanAiResponse = (responseText: string) => {
    // Step 1: Trim any surrounding whitespace
    let cleanText = responseText.trim();

    // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
    cleanText = cleanText.replace(/(json|```|`)/g, "");

    // Step 3: Extract a JSON array by capturing text between square brackets
    const jsonArrayMatch = cleanText.match(/\[.*\]/s);
    if (jsonArrayMatch) {
      cleanText = jsonArrayMatch[0];
    } else {
      throw new Error("No JSON array found in response");
    }

    // Step 4: Parse the clean JSON text into an array of objects
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateAiResponse = async (data: FormData) => {
    // Define difficulty-specific instructions
    const difficultyInstructions = {
      Easy: "Generate basic, entry-level questions suitable for beginners or junior developers. Focus on fundamental concepts, basic syntax, and simple problem-solving scenarios. Questions should be straightforward and test foundational knowledge.",
      Moderate: "Generate intermediate-level questions for experienced professionals. Include questions about best practices, design patterns, optimization, and real-world problem-solving. Questions should require practical experience and deeper understanding.",
      Difficult: "Generate advanced, challenging questions for senior-level positions. Include complex system design, architecture decisions, performance optimization, scalability concerns, and advanced technical concepts. Questions should test expert-level knowledge and strategic thinking."
    };

    // Define difficulty-specific question types and complexity
    const difficultyExamples = {
      Easy: {
        types: "basic syntax, simple concepts, fundamental operations, basic debugging, entry-level best practices",
        complexity: "straightforward, one-concept-per-question, practical examples",
        keywords: "What is, How do you, Explain the basic, Define, Give an example of"
      },
      Moderate: {
        types: "design patterns, performance optimization, debugging complex issues, API integration, state management, testing strategies",
        complexity: "multi-concept questions, scenario-based problems, real-world applications",
        keywords: "How would you implement, What are the pros and cons, Compare and contrast, How would you optimize, Describe a scenario where"
      },
      Difficult: {
        types: "system architecture, scalability solutions, advanced algorithms, security considerations, performance bottlenecks, microservices design",
        complexity: "multi-layered problems, architectural decisions, trade-off analysis, complex scenarios",
        keywords: "Design a system that, How would you scale, What are the architectural considerations, Analyze the performance implications, How would you handle"
      }
    };

    // Check if this is a DSA/Algorithm focused interview
    const isDSAFocused = data?.position.toLowerCase().includes('dsa') || 
                       data?.position.toLowerCase().includes('algorithm') ||
                       data?.techStack.toLowerCase().includes('algorithm') ||
                       data?.techStack.toLowerCase().includes('data structure') ||
                       data?.description.toLowerCase().includes('algorithm') ||
                       data?.description.toLowerCase().includes('data structure');

    const difficultyLevel = data?.difficulty || "Moderate";
    const difficultyInstruction = difficultyInstructions[difficultyLevel];
    const difficultySpec = difficultyExamples[difficultyLevel];
    
    // Add randomization seed based on current timestamp
    const randomSeed = Date.now();

    // Enhanced prompt for DSA interviews
    const dsaSpecificGuidelines = isDSAFocused ? `
    
    DSA-SPECIFIC REQUIREMENTS:
    - Include coding problems and algorithm questions
    - Ask about time and space complexity analysis
    - Cover data structures appropriate for ${difficultyLevel} level
    - Include problem-solving and optimization questions
    - For ${difficultyLevel} level: ${
      difficultyLevel === 'Easy' ? 'Basic arrays, strings, simple sorting, basic recursion' :
      difficultyLevel === 'Moderate' ? 'Trees, graphs, dynamic programming, hash tables, advanced sorting' :
      'Advanced trees, graph algorithms, complex DP, system design with algorithms'
    }
    ` : '';

    const prompt = `
        As an experienced prompt engineer, generate a UNIQUE and RANDOM set of 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "question" and "answer", formatted as follows:

        [
          { "question": "<Question text>", "answer": "<Answer text>" },
          ...
        ]

        RANDOMIZATION REQUIREMENT: Generate completely different questions each time. Use this random seed for variety: ${randomSeed}

        Job Information:
        - Job Position: ${data?.position}
        - Job Description: ${data?.description}
        - Years of Experience Required: ${data?.experience}
        - Tech Stacks: ${data?.techStack}
        - Difficulty Level: ${difficultyLevel}

        DIFFICULTY REQUIREMENTS (${difficultyLevel}):
        ${difficultyInstruction}

        QUESTION SPECIFICATIONS FOR ${difficultyLevel} LEVEL:
        - Question Types: ${difficultySpec.types}
        - Complexity Level: ${difficultySpec.complexity}
        - Question Starters: ${difficultySpec.keywords}
        ${dsaSpecificGuidelines}

        IMPORTANT INSTRUCTIONS:
        1. Generate RANDOM and DIVERSE questions - avoid repetitive patterns
        2. Ensure questions are SPECIFICALLY ${difficultyLevel} level - not easier or harder
        3. Questions must be directly related to ${data?.techStack} and ${data?.position}
        4. Each question should test different aspects/skills
        5. Provide comprehensive, accurate answers that match the difficulty level
        6. Vary question formats (theoretical, practical, scenario-based, problem-solving)
        ${isDSAFocused ? '7. Include algorithm implementation details and complexity analysis in answers' : ''}

        Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations. Return only the JSON array with questions and answers.
        `;

    try {
      const aiResult = await sendMessageWithRetry(prompt);
      
      if (!aiResult) {
        throw new Error("No response from AI service");
      }
      
      const cleanedResponse = cleanAiResponse(aiResult.response.text());
      return cleanedResponse;
    } catch (error) {
      console.error("AI generation failed:", error);
      
      // Return fallback questions based on difficulty and role
      const fallbackQuestions = getFallbackQuestions(data);
      
      toast("Using Curated Questions", {
        description: "AI service is temporarily busy. Using high-quality curated questions for your interview.",
      });
      
      return fallbackQuestions;
    }
  };

  // Fallback questions when AI is unavailable
  const getFallbackQuestions = (data: FormData) => {
    const role = data.position.toLowerCase();
    const isDataStructure = role.includes('dsa') || role.includes('algorithm') || data.techStack.toLowerCase().includes('algorithm');
    const isFrontend = role.includes('frontend') || role.includes('react') || role.includes('ui');
    const isBackend = role.includes('backend') || role.includes('api') || role.includes('server');

    if (isDataStructure) {
      return [
        {
          question: "Explain the difference between an array and a linked list. When would you use each?",
          answer: "Arrays provide O(1) random access but O(n) insertion/deletion. Linked lists provide O(1) insertion/deletion but O(n) access. Use arrays for frequent random access, linked lists for frequent insertions/deletions."
        },
        {
          question: "What is the time complexity of binary search and why?",
          answer: "Binary search has O(log n) time complexity because it eliminates half of the remaining elements in each step, creating a logarithmic search pattern."
        },
        {
          question: "Describe how a hash table works and its average time complexities.",
          answer: "Hash tables use a hash function to map keys to array indices. Average time complexity is O(1) for search, insert, and delete operations, with O(n) worst case due to collisions."
        },
        {
          question: "What are the main differences between BFS and DFS graph traversal?",
          answer: "BFS uses a queue and explores level by level, finding shortest paths. DFS uses a stack/recursion and goes deep first, useful for pathfinding and cycle detection."
        },
        {
          question: "Explain the concept of dynamic programming and give an example.",
          answer: "Dynamic programming solves problems by breaking them into overlapping subproblems and storing results to avoid recomputation. Classic example: Fibonacci sequence using memoization."
        }
      ];
    }

    if (isFrontend) {
      return [
        {
          question: `What interests you about the ${data.position} position?`,
          answer: "This question evaluates motivation and understanding of frontend development requirements."
        },
        {
          question: "Explain the difference between state and props in React.",
          answer: "State is internal component data that can change, triggering re-renders. Props are external data passed from parent components and are immutable within the component."
        },
        {
          question: "How do you optimize the performance of a React application?",
          answer: "Use React.memo, useMemo, useCallback, code splitting, lazy loading, minimize re-renders, optimize images, and use proper state management."
        },
        {
          question: "What is the virtual DOM and how does it work?",
          answer: "Virtual DOM is a JavaScript representation of the actual DOM. React compares virtual DOM trees to efficiently update only changed elements, improving performance."
        },
        {
          question: "How do you handle responsive design in modern web applications?",
          answer: "Use CSS Grid/Flexbox, media queries, relative units (rem, em, %), mobile-first approach, and CSS frameworks like Tailwind CSS for responsive layouts."
        }
      ];
    }

    if (isBackend) {
      return [
        {
          question: `What draws you to the ${data.position} role?`,
          answer: "This question assesses motivation and understanding of backend development responsibilities."
        },
        {
          question: "Explain the difference between SQL and NoSQL databases.",
          answer: "SQL databases are relational with ACID properties and structured schemas. NoSQL databases offer flexibility, horizontal scaling, and various data models (document, key-value, graph)."
        },
        {
          question: "How do you handle authentication and authorization in web applications?",
          answer: "Use JWT tokens, OAuth, session management, role-based access control (RBAC), and secure password hashing with libraries like bcrypt."
        },
        {
          question: "What are RESTful APIs and what makes a good API design?",
          answer: "REST uses HTTP methods, stateless communication, and resource-based URLs. Good APIs have consistent naming, proper status codes, versioning, documentation, and error handling."
        },
        {
          question: "How do you ensure the security of a web application?",
          answer: "Implement HTTPS, input validation, SQL injection prevention, XSS protection, CSRF tokens, secure headers, and regular security audits."
        }
      ];
    }

    // Default questions for any role
    return [
      {
        question: `Tell me about yourself and your background in ${data.position}.`,
        answer: "This open-ended question assesses communication skills and relevant experience in the specific role."
      },
      {
        question: `What interests you about the ${data.position} role?`,
        answer: "This question evaluates motivation and understanding of the role requirements."
      },
      {
        question: "Describe a challenging technical problem you solved recently.",
        answer: "This assesses problem-solving skills and technical depth in real scenarios."
      },
      {
        question: `How do you stay updated with ${data.techStack} and technology trends?`,
        answer: "This evaluates continuous learning mindset and industry engagement."
      },
      {
        question: "What questions do you have for me about the role or company?",
        answer: "This tests preparation and genuine interest in the opportunity."
      }
    ];
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      if (initialData) {
        // update
        if (isValid) {
          const aiResult = await generateAiResponse(data);

          await updateDoc(doc(db, "interviews", initialData?.id), {
            questions: aiResult,
            ...data,
            difficulty: data.difficulty, // Ensure difficulty is explicitly saved
            updatedAt: serverTimestamp(),
          }).catch((error) => console.log(error));
          toast(toastMessage.title, { description: toastMessage.description });
        }
      } else {
        // create a new mock interview
        if (isValid) {
          const aiResult = await generateAiResponse(data);

          await addDoc(collection(db, "interviews"), {
            ...data,
            userId,
            questions: aiResult,
            difficulty: data.difficulty, // Ensure difficulty is explicitly saved
            isDefault: false, // Mark as user-created interview
            createdAt: serverTimestamp(),
          });

          toast(toastMessage.title, { description: toastMessage.description });
        }
      }

      navigate("/generate", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error("Error..", {
        description: `Something went wrong. Please try again later`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
        difficulty: initialData.difficulty,
      });
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrumb
        breadCrumbPage={breadCrumpPage}
        breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />

        {initialData && (
          <Button size={"icon"} variant={"ghost"}>
            <Trash2 className="min-w-4 min-h-4 text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <div className="my-6"></div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-6 shadow-md "
        >
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- Full Stack Developer"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Description</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- describle your job role"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- 5 Years"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Tech Stacks</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- React, Typescript..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Difficulty Level</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy" className="text-green-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Easy - Perfect for beginners
                        </div>
                      </SelectItem>
                      <SelectItem value="Moderate" className="text-yellow-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          Moderate - For experienced professionals
                        </div>
                      </SelectItem>
                      <SelectItem value="Difficult" className="text-red-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Difficult - Advanced level challenges
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-end gap-6">
            <Button
              type="reset"
              size={"sm"}
              variant={"outline"}
              disabled={isSubmitting || loading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              size={"sm"}
              disabled={isSubmitting || !isValid || loading}
            >
              {loading ? (
                <Loader className="text-gray-50 animate-spin" />
              ) : (
                actions
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
