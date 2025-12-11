import { Interview } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Eye, Newspaper, Sparkles } from "lucide-react";

interface InterviewPinProps {
  interview: Interview;
  onMockPage?: boolean;
}

export const InterviewPin = ({
  interview,
  onMockPage = false,
}: InterviewPinProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group relative p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-emerald-300 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/50 transform hover:-translate-y-1 space-y-6">
      {/* Header with position and sparkle icon */}
      <div className="flex items-start justify-between">
        <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-emerald-700 transition-colors duration-200 leading-tight">
          {interview?.position}
        </CardTitle>
        <div className="bg-gradient-to-r from-emerald-100 to-blue-100 p-2 rounded-xl group-hover:from-emerald-200 group-hover:to-blue-200 transition-all duration-300">
          <Sparkles className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* Description with better styling */}
      <CardDescription className="text-gray-600 leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-200">
        {interview?.description}
      </CardDescription>

      {/* Enhanced tech stack badges */}
      <div className="w-full flex items-center gap-2 flex-wrap">
        {interview?.techStack.split(",").slice(0, 6).map((word, index) => (
          <Badge
            key={index}
            variant="outline"
            className="text-xs font-medium px-3 py-1 border-emerald-200 text-emerald-700 bg-emerald-50 hover:border-emerald-300 hover:bg-emerald-100 transition-all duration-200 group-hover:scale-105"
          >
            {word.trim()}
          </Badge>
        ))}
        {interview?.techStack.split(",").length > 6 && (
          <Badge variant="outline" className="text-xs font-medium px-3 py-1 border-gray-200 text-gray-500 bg-gray-50">
            +{interview?.techStack.split(",").length - 6} more
          </Badge>
        )}
      </div>

      {/* Enhanced footer */}
      <CardFooter
        className={cn(
          "w-full flex items-center p-0 pt-4 border-t border-gray-100",
          onMockPage ? "justify-end" : "justify-between"
        )}
      >
        {!onMockPage && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <p className="text-xs text-gray-500 font-medium">
              Created {new Date(interview?.createdAt.toDate()).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" }
              )}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <TooltipButton
            content="Start Interview"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => navigate(`/generate/interview/${interview?.id}`)}
            buttonClassName="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-110"
            buttonVariant="ghost"
          />

          <TooltipButton
            content="View/Edit"
            icon={<Newspaper className="w-4 h-4" />}
            onClick={() => navigate(`/generate/${interview?.id}`)}
            buttonClassName="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
            buttonVariant="ghost"
          />
        </div>
      </CardFooter>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </Card>
  );
};
