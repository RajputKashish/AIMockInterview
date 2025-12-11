import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Play, X, Volume2, VolumeX } from "lucide-react";

interface DemoVideoModalProps {
  triggerButtonText?: string;
  triggerButtonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  triggerButtonSize?: "default" | "sm" | "lg" | "icon";
  triggerButtonClassName?: string;
}

export const DemoVideoModal = ({
  triggerButtonText = "Watch Demo",
  triggerButtonVariant = "outline",
  triggerButtonSize = "lg",
  triggerButtonClassName = "border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg"
}: DemoVideoModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Your single demo video - replace with your actual video filename
  const demoVideo = {
    id: 1,
    title: "MockInterview AI Platform Demo",
    description: "Complete walkthrough of our AI-powered interview platform",
    thumbnail: "/assets/img/hero.jpg",
    videoUrl: "/assets/videos/demo-video.mp4", // Replace with your actual video filename
    duration: "5:00" // Update with your video's actual duration
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={triggerButtonVariant} 
          size={triggerButtonSize} 
          className={triggerButtonClassName}
        >
          <Play className="mr-2 w-5 h-5" />
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden">
        {/* Single Video Player */}
        <div className="bg-black relative">
          <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 aspect ratio */}
            {demoVideo.videoUrl ? (
              // Your local video file
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                controls
                muted={isMuted}
                poster={demoVideo.thumbnail}
              >
                <source src={demoVideo.videoUrl} type="video/mp4" />
                <source src={demoVideo.videoUrl.replace('.mp4', '.webm')} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            ) : (
              // Fallback when no video is found
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
                  <h3 className="text-xl font-semibold mb-2">{demoVideo.title}</h3>
                  <p className="text-blue-200 mb-4">Please add your demo video!</p>
                  <p className="text-sm text-blue-300">
                    Place your video file at: /public/assets/videos/demo-video.mp4
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Video Controls Overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Video Info Section */}
        <div className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {demoVideo.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {demoVideo.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  Duration: {demoVideo.duration}
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Ready to start practicing interviews?
            </p>
            <div className="flex gap-3">
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/generate";
                }}
              >
                Start Interview Practice
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
