import { Loader2, Sparkles, Clock, Code2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ProjectGeneratingLoader() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <Card className="max-w-md w-full border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardContent className="pt-6 space-y-6">
          {/* Animated Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping opacity-20">
                <Sparkles className="h-16 w-16 text-primary" />
              </div>
              <Sparkles className="h-16 w-16 text-primary animate-pulse" />
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Generating Your Project
            </h3>
            <p className="text-sm text-muted-foreground">
              Our AI is crafting your website with care
            </p>
          </div>

          {/* Time Estimate */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">Estimated Time:</span>
              <span className="text-muted-foreground">5-10 minutes</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Code2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Analyzing requirements and planning architecture</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Code2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Writing components and styling</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Code2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Testing and optimizing</span>
              </div>
            </div>
          </div>

          {/* Progress Animation */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Processing...</span>
              <span>Please wait</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-[pulse_2s_ease-in-out_infinite] w-3/4" />
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

