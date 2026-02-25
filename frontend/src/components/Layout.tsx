import { type ReactNode } from 'react';
import { Zap, History, PlusCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
  currentView: 'form' | 'results' | 'history';
  onNewCreative: () => void;
  onViewHistory: () => void;
}

export default function Layout({ children, currentView, onNewCreative, onViewHistory }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-surface sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={onNewCreative}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center shadow-brand">
                <Zap className="w-5 h-5 text-brand-foreground fill-brand-foreground" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-lg text-foreground tracking-tight">
                  UGC<span className="text-brand">Director</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
                  Creative AI Agent
                </span>
              </div>
            </button>

            {/* Nav */}
            <nav className="flex items-center gap-2">
              <Button
                variant={currentView === 'form' || currentView === 'results' ? 'ghost' : 'ghost'}
                size="sm"
                onClick={onNewCreative}
                className={`gap-2 ${currentView !== 'history' ? 'text-brand' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New Creative</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewHistory}
                className={`gap-2 ${currentView === 'history' ? 'text-brand' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Banner — only on form view */}
      {currentView === 'form' && (
        <div className="relative overflow-hidden bg-surface-2 border-b border-border/30">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt="UGC Director Hero"
            className="w-full h-40 sm:h-52 object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex items-center px-6 sm:px-12 max-w-7xl mx-auto">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img
                  src="/assets/generated/icon-lightning.dim_64x64.png"
                  alt="Lightning"
                  className="w-7 h-7"
                />
                <span className="text-brand text-sm font-semibold tracking-widest uppercase">
                  AI-Powered Creative Engine
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground leading-tight">
                Generate High-Converting<br />
                <span className="text-brand">UGC Ad Scripts</span> in Seconds
              </h1>
              <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-lg">
                Platform-optimized scripts, Meta & Google ad copy, shot breakdowns, and more — all in one click.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-surface mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Video className="w-4 h-4 text-brand" />
              <span>UGCDirector — Professional Creative AI Agent</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <span>© {new Date().getFullYear()} Built with</span>
              <span className="text-brand">♥</span>
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'ugc-director')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-brand/80 font-semibold transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
