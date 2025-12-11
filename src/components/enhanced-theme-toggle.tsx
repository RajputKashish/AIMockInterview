import { Moon, Sun, Monitor, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/provider/theme-provider"

export function EnhancedThemeToggle() {
  const { theme, setTheme } = useTheme()

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4 text-amber-500" />
      case "dark":
        return <Moon className="h-4 w-4 text-blue-500" />
      default:
        return <Monitor className="h-4 w-4 text-gray-500" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light"
      case "dark":
        return "Dark"
      default:
        return "System"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-auto px-3 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              {getThemeIcon()}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              {getThemeLabel()}
            </span>
            <Palette className="h-3 w-3 text-gray-400 dark:text-gray-500 ml-1" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="mt-2 w-56 p-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-xl"
      >
        <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-gray-200/50 dark:bg-gray-700/50" />
        
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={`flex items-center gap-3 px-3 py-3 m-1 rounded-lg cursor-pointer transition-all duration-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 ${
            theme === "light" 
              ? "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 shadow-sm border border-amber-200/50 dark:border-amber-700/50" 
              : "hover:shadow-sm"
          }`}
        >
          <div className="relative">
            <Sun className="h-5 w-5 text-amber-500" />
            {theme === "light" && (
              <div className="absolute -inset-1 rounded-full bg-amber-400/20 animate-pulse"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-gray-100">Light</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Bright and clean</div>
          </div>
          {theme === "light" && (
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm"></div>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-3 px-3 py-3 m-1 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
            theme === "dark" 
              ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-sm border border-blue-200/50 dark:border-blue-700/50" 
              : "hover:shadow-sm"
          }`}
        >
          <div className="relative">
            <Moon className="h-5 w-5 text-blue-500" />
            {theme === "dark" && (
              <div className="absolute -inset-1 rounded-full bg-blue-400/20 animate-pulse"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-gray-100">Dark</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Easy on the eyes</div>
          </div>
          {theme === "dark" && (
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-sm"></div>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={`flex items-center gap-3 px-3 py-3 m-1 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
            theme === "system" 
              ? "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 shadow-sm border border-gray-200/50 dark:border-gray-600/50" 
              : "hover:shadow-sm"
          }`}
        >
          <div className="relative">
            <Monitor className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            {theme === "system" && (
              <div className="absolute -inset-1 rounded-full bg-gray-400/20 animate-pulse"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-gray-100">System</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Matches device</div>
          </div>
          {theme === "system" && (
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-gray-400 to-slate-500 shadow-sm"></div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
