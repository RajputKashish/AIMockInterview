import { Sparkles } from "lucide-react";
import Marquee from "react-fast-marquee";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { MarqueImg } from "@/components/marquee-img";
import { DemoVideoModal } from "@/components/demo-video-modal";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex-col w-full pb-24">
      <Container>
        <div className="my-12">
          <h1 className="text-4xl text-center md:text-left md:text-7xl leading-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold">
              AI Superpower
            </span>
            <br />
            <span className="text-gray-700 font-bold text-3xl md:text-5xl">
              A smarter way to
            </span>
            <br />
            <span className="text-gray-600 font-semibold text-2xl md:text-4xl">
              ace your interviews
            </span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-2xl">
            🚀 Boost your interview skills and increase your success rate with
            AI-driven insights. Discover a smarter way to prepare, practice, and
            stand out from the competition.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/generate">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg">
                <Sparkles className="mr-2" />
                Start Your First Interview
              </Button>
            </Link>
            <DemoVideoModal 
              triggerButtonText="Watch Demo"
              triggerButtonVariant="outline"
              triggerButtonSize="lg"
              triggerButtonClassName="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg"
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-evenly md:px-12 md:py-16 md:items-center md:justify-end gap-12">
          <div className="text-center">
            <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              250k+
            </p>
            <span className="block text-lg text-gray-600 font-medium mt-1">
              Offers Received
            </span>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              1.2M+
            </p>
            <span className="block text-lg text-gray-600 font-medium mt-1">
              Interviews Aced
            </span>
          </div>
        </div>

        {/* image section */}
        <div className="w-full mt-4 rounded-xl bg-gray-100 h-[420px] drop-shadow-md overflow-hidden relative">
          <img
            src="/assets/img/hero.jpg"
            alt=""
            className="w-full h-full object-cover"
          />

          <div className="absolute top-4 left-4 px-4 py-2 rounded-md bg-white/40 backdrop-blur-md">
            Inteviews Copilot&copy;
          </div>

          <div className="hidden md:block absolute w-80 bottom-4 right-4 px-4 py-2 rounded-md bg-white/60 backdrop-blur-md transform transition-all duration-300 hover:bg-white/80 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 cursor-pointer group">
            <h2 className="text-neutral-800 font-semibold group-hover:text-blue-600 transition-colors duration-300">Developer</h2>
            <p className="text-sm text-neutral-600 group-hover:text-neutral-700 transition-colors duration-300">
              Practice coding interviews with AI-powered questions tailored to your experience level. Get real-time feedback and improve your technical skills.
            </p>

            <Button className="mt-3 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Generate <Sparkles className="ml-1 group-hover:rotate-12 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </Container>

      {/* marquee section */}
      <div className=" w-full my-12">
        <Marquee pauseOnHover>
          <MarqueImg img="/assets/img/logo/firebase.png" />
          <MarqueImg img="/assets/img/logo/meet.png" />
          <MarqueImg img="/assets/img/logo/zoom.png" />
          <MarqueImg img="/assets/img/logo/firebase.png" />
          <MarqueImg img="/assets/img/logo/microsoft.png" />
          <MarqueImg img="/assets/img/logo/meet.png" />
          <MarqueImg img="/assets/img/logo/tailwindcss.png" />
          <MarqueImg img="/assets/img/logo/microsoft.png" />
        </Marquee>
      </div>

      <Container className="py-8 space-y-8">
        <h2 className="tracking-wide text-xl text-gray-800 font-semibold">
          Unleash your potential with personalized AI insights and targeted
          interview practice.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="col-span-1 md:col-span-3">
            <img
              src="/assets/img/office.jpg"
              alt=""
              className="w-full max-h-96 rounded-md object-cover"
            />
          </div>

          <div className="col-span-1 md:col-span-2 gap-8 max-h-96 min-h-96 w-full flex flex-col items-center justify-center text-center">
            <p className="text-center text-muted-foreground">
              Transform the way you prepare, gain confidence, and boost your
              chances of landing your dream job. Let AI be your edge in
              today&apos;s competitive job market.
            </p>

            <Link to={"/generate"} className="w-full">
              <Button className="w-3/4">
                Generate <Sparkles className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
