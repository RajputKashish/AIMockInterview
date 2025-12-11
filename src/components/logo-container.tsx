import { Link } from "react-router-dom";

export const LogoContainer = () => {
  return (
    <Link to={"/"} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
      <img
        src="/assets/svg/logo.svg"
        alt="MockInterview AI Logo"
        className="min-w-10 min-h-10 w-10 h-10 object-contain"
      />
      <div className="hidden sm:flex flex-col">
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          MockInterview
        </span>
        <span className="text-xs text-gray-500 font-medium -mt-1">
          AI Powered
        </span>
      </div>
    </Link>
  );
};
