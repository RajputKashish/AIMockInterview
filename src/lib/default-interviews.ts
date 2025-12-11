import { Timestamp } from "firebase/firestore";
import { Interview } from "@/types";

export const defaultInterviews: Interview[] = [
  // DSA Interviews (Priority - Most Important for Technical Interviews)
  {
    id: 'default-dsa-easy',
    position: 'DSA Interview - Easy',
    description: 'Entry-level Data Structures and Algorithms interview focusing on basic concepts, simple problems, and fundamental programming skills.',
    experience: 0,
    userId: 'default',
    techStack: 'Arrays, Strings, Basic Algorithms, Time Complexity',
    difficulty: 'Easy' as const,
    isDefault: true,
    questions: [], // Will be populated by AI generation
    createdAt: Timestamp.fromDate(new Date()),
    updateAt: Timestamp.fromDate(new Date())
  },
  {
    id: 'default-dsa-moderate',
    position: 'DSA Interview - Moderate',
    description: 'Mid-level Data Structures and Algorithms interview covering trees, graphs, dynamic programming, and optimization problems.',
    experience: 2,
    userId: 'default',
    techStack: 'Trees, Graphs, Hash Maps, Dynamic Programming, Sorting',
    difficulty: 'Moderate' as const,
    isDefault: true,
    questions: [], // Will be populated by AI generation
    createdAt: Timestamp.fromDate(new Date()),
    updateAt: Timestamp.fromDate(new Date())
  },
  {
    id: 'default-dsa-difficult',
    position: 'DSA Interview - Difficult',
    description: 'Advanced Data Structures and Algorithms interview for senior positions, covering complex algorithms, system design, and optimization challenges.',
    experience: 4,
    userId: 'default',
    techStack: 'Advanced Trees, Graph Algorithms, System Design, Optimization',
    difficulty: 'Difficult' as const,
    isDefault: true,
    questions: [], // Will be populated by AI generation
    createdAt: Timestamp.fromDate(new Date()),
    updateAt: Timestamp.fromDate(new Date())
  },

  // Other Technical Interviews
  {
    id: 'default-easy-1',
    position: 'Junior Frontend Developer',
    description: 'Entry-level position focusing on HTML, CSS, and basic JavaScript. Perfect for new graduates or career changers.',
    experience: 0,
    userId: 'default',
    techStack: 'HTML, CSS, JavaScript, React',
    difficulty: 'Easy' as const,
    isDefault: true,
    questions: [], // Will be populated by AI generation
    createdAt: Timestamp.fromDate(new Date()),
    updateAt: Timestamp.fromDate(new Date())
  },
  {
    id: 'default-easy-2',
    position: 'Junior QA Tester',
    description: 'Entry-level quality assurance position focusing on manual testing and basic automation concepts.',
    experience: 1,
    userId: 'default',
    techStack: 'Manual Testing, Selenium, API Testing',
    difficulty: 'Easy' as const,
    isDefault: true,
    questions: [], // Will be populated by AI generation
    createdAt: Timestamp.fromDate(new Date()),
    updateAt: Timestamp.fromDate(new Date())
  },

  // Moderate Level Interviews
  {
    id: 'default-moderate-1',
    position: 'Full Stack Developer',
    description: 'Mid-level position requiring knowledge of both frontend and backend technologies with 2-3 years experience.',
    experience: 3,
    userId: 'default',
    techStack: 'React, Node.js, Express, MongoDB, REST APIs',
    difficulty: 'Moderate' as const,
    isDefault: true,
    questions: [], // Will be populated by AI generation
    createdAt: Timestamp.fromDate(new Date()),
    updateAt: Timestamp.fromDate(new Date())
  },
  {
    id: 'default-moderate-2',
    position: 'DevOps Engineer',
    description: 'Mid-level DevOps role focusing on CI/CD, cloud services, and infrastructure automation.',
    experience: 3,
    userId: 'default',
    techStack: 'Docker, Kubernetes, AWS, Jenkins, Terraform',
    difficulty: 'Moderate' as const,
    isDefault: true,
    questions: [], // Will be populated by AI generation
    createdAt: Timestamp.fromDate(new Date()),
    updateAt: Timestamp.fromDate(new Date())
  },

  // Difficult Level Interviews
  {
    id: 'default-difficult-1',
    position: 'Senior Software Architect',
    description: 'Senior-level position requiring deep technical expertise, system design skills, and leadership experience.',
    experience: 7,
    userId: 'default',
    techStack: 'Microservices, System Design, AWS, Kafka, Redis',
    difficulty: 'Difficult' as const,
    isDefault: true,
    questions: [], // Will be populated by AI generation
    createdAt: Timestamp.fromDate(new Date()),
    updateAt: Timestamp.fromDate(new Date())
  },
  {
    id: 'default-difficult-2',
    position: 'Machine Learning Engineer',
    description: 'Advanced ML role requiring expertise in algorithms, model deployment, and production ML systems.',
    experience: 5,
    userId: 'default',
    techStack: 'Python, TensorFlow, PyTorch, MLOps, Kubernetes',
    difficulty: 'Difficult' as const,
    isDefault: true,
    questions: [], // Will be populated by AI generation
    createdAt: Timestamp.fromDate(new Date()),
    updateAt: Timestamp.fromDate(new Date())
  }
];

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        hover: 'hover:bg-green-200'
      };
    case 'Moderate':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        hover: 'hover:bg-yellow-200'
      };
    case 'Difficult':
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        hover: 'hover:bg-red-200'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-200',
        hover: 'hover:bg-gray-200'
      };
  }
};
