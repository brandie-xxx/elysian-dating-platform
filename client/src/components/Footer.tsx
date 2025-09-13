import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Elysian Branding */}
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold tracking-tight text-foreground">
              Elysian
            </span>
            <span className="text-sm text-muted-foreground font-sans">
              © 2025. All Rights Reserved.
            </span>
          </div>
          
          {/* STATIQUEX Attribution */}
          <div className="text-sm text-muted-foreground font-sans">
            Powered by{" "}
            <span className="font-medium text-foreground">
              STATIQUEX®
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}