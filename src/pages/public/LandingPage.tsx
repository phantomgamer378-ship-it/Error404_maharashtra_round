import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Target, Zap, Video, BarChart3, ChevronRight } from 'lucide-react';
import { LandingNavbar } from '../../components/landing/LandingNavbar';
import { HeroCanvas } from '../../components/landing/HeroCanvas';
import { Link } from 'react-router-dom';

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const LandingPage: React.FC = () => {
  useEffect(() => {
    // Ensures scroll is at top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#10131A] text-[#111318] dark:text-[#F5F7FA] font-sans overflow-x-hidden selection:bg-[#356AE6]/20">
      <LandingNavbar />

      {/* 
        ========================================
        HERO SECTION
        ========================================
      */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center pt-20">
        <HeroCanvas />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <h1 className="text-[clamp(3.5rem,7vw,8.5rem)] leading-[1.05] font-medium tracking-[-0.02em] text-[#111318] dark:text-white max-w-5xl mx-auto">
              Create smarter.<br />
              <span className="text-[#667085] dark:text-[#A7AFBD]">Grow with intention.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col items-center"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#356AE6] dark:bg-[#78A1FF] animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#667085] dark:text-[#A7AFBD] uppercase">
                Your Creator Operating System
              </span>
            </div>
            
            <p className="text-lg md:text-xl text-[#667085] dark:text-[#A7AFBD] max-w-2xl font-light leading-relaxed">
              Find the right opportunity, build better content, and learn what actually moves your audience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link 
              to="/register" 
              className="group flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-[#111318] text-white dark:bg-white dark:text-[#111318] text-base font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/5 dark:shadow-white/5"
            >
              Start creating
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a 
              href="#why-vidora"
              className="flex items-center justify-center h-14 px-8 rounded-full bg-[#F7F8FA] text-[#111318] dark:bg-[#1D2330] dark:text-white text-base font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Explore VIDORA
            </a>
          </motion.div>
        </div>
      </section>

      {/* 
        ========================================
        SECTION 1: WHY VIDORA
        ========================================
      */}
      <section id="why-vidora" className="py-32 md:py-48 px-6 bg-[#FFFFFF] dark:bg-[#10131A] relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-[#111318] dark:text-white leading-tight">
              Creating is easy.<br />
              <span className="text-[#667085] dark:text-[#A7AFBD]">Knowing what to create next is not.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2} className="mt-8">
            <p className="text-xl text-[#667085] dark:text-[#A7AFBD] font-light max-w-2xl mx-auto">
              VIDORA replaces the guesswork of content creation with a unified, intelligent operating system that understands you, spots trends before they peak, and guides you from idea to publication.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 
        ========================================
        SECTION 2: CREATOR INTELLIGENCE
        ========================================
      */}
      <section className="py-24 px-6 bg-[#F7F8FA] dark:bg-[#171B24] border-y border-[#E7EAF0] dark:border-[#2A3140]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#1D2330] border border-[#E7EAF0] dark:border-[#2A3140] mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#356AE6] dark:text-[#78A1FF]" />
                <span className="text-[11px] font-bold tracking-wider uppercase">Creator Intelligence</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
                An AI that learns your DNA.
              </h2>
              <p className="text-lg text-[#667085] dark:text-[#A7AFBD] font-light mb-8">
                Your niche, your tone, your platforms. VIDORA continuously builds a profile of your creative identity based on your content patterns, ensuring every recommendation feels authentically yours.
              </p>
              
              <div className="space-y-4">
                {[
                  'Niche & Audience Mapping',
                  'Tone & Voice Calibration',
                  'Format Preferences',
                  'Historical Performance Patterns'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-[#EEF3FF] dark:bg-[#356AE6]/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#356AE6] dark:bg-[#78A1FF]" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="relative aspect-square md:aspect-[4/3] rounded-3xl bg-white dark:bg-[#1D2330] border border-[#E7EAF0] dark:border-[#2A3140] shadow-glass-md overflow-hidden flex items-center justify-center p-8">
                {/* Minimal Interface Preview Mockup */}
                <div className="w-full max-w-sm space-y-4">
                  <div className="h-12 w-full bg-[#F7F8FA] dark:bg-[#171B24] rounded-xl border border-[#E7EAF0] dark:border-[#2A3140] flex items-center px-4 gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#356AE6] dark:bg-[#78A1FF] opacity-20" />
                    <div className="h-2 w-24 bg-[#E7EAF0] dark:bg-[#2A3140] rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-[#F7F8FA] dark:bg-[#171B24] rounded-xl border border-[#E7EAF0] dark:border-[#2A3140] p-4 flex flex-col justify-end">
                      <div className="h-1.5 w-16 bg-[#E7EAF0] dark:bg-[#2A3140] rounded-full mb-2" />
                      <div className="h-2 w-12 bg-[#356AE6] dark:bg-[#78A1FF] rounded-full" />
                    </div>
                    <div className="h-24 bg-[#F7F8FA] dark:bg-[#171B24] rounded-xl border border-[#E7EAF0] dark:border-[#2A3140] p-4 flex flex-col justify-end">
                      <div className="h-1.5 w-20 bg-[#E7EAF0] dark:bg-[#2A3140] rounded-full mb-2" />
                      <div className="h-2 w-16 bg-[#356AE6] dark:bg-[#78A1FF] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 
        ========================================
        SECTION 3: OPPORTUNITY ENGINE
        ========================================
      */}
      <section className="py-24 px-6 bg-[#FFFFFF] dark:bg-[#10131A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center flex-row-reverse">
            <FadeIn className="md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F8FA] dark:bg-[#1D2330] border border-[#E7EAF0] dark:border-[#2A3140] mb-6">
                <Target className="w-3.5 h-3.5 text-[#356AE6] dark:text-[#78A1FF]" />
                <span className="text-[11px] font-bold tracking-wider uppercase">Opportunity Engine</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
                Signals over noise.
              </h2>
              <p className="text-lg text-[#667085] dark:text-[#A7AFBD] font-light mb-8">
                Stop guessing what's trending. VIDORA cross-references global market signals against your Creator DNA to highlight high-confidence opportunities tailored exactly for you.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-medium mb-1">Why Now</div>
                  <p className="text-sm text-[#667085] dark:text-[#A7AFBD]">Real-time trend velocity and market gaps.</p>
                </div>
                <div>
                  <div className="text-2xl font-medium mb-1">Why You</div>
                  <p className="text-sm text-[#667085] dark:text-[#A7AFBD]">Direct alignment with your unique audience.</p>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2} className="md:order-1">
              <div className="relative aspect-square md:aspect-[4/3] rounded-3xl bg-[#F7F8FA] dark:bg-[#171B24] border border-[#E7EAF0] dark:border-[#2A3140] shadow-sm overflow-hidden flex items-center justify-center p-8">
                {/* Abstract Radar Mockup */}
                <div className="relative w-full max-w-xs aspect-square rounded-full border border-[#E7EAF0] dark:border-[#2A3140] flex items-center justify-center">
                  <div className="absolute w-3/4 h-3/4 rounded-full border border-[#E7EAF0] dark:border-[#2A3140]" />
                  <div className="absolute w-1/2 h-1/2 rounded-full border border-[#E7EAF0] dark:border-[#2A3140]" />
                  
                  {/* Radar sweep */}
                  <div className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left bg-gradient-to-tr from-[#356AE6]/20 to-transparent rounded-tr-full animate-radar-spin" />
                  
                  {/* Dots */}
                  <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-[#356AE6] dark:bg-[#78A1FF] shadow-glow-primary" />
                  <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                  <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 
        ========================================
        SECTION 4: WORKFLOW PIPELINE
        ========================================
      */}
      <section className="py-32 px-6 bg-[#111318] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">
              One continuous motion.
            </h2>
            <p className="text-[#A7AFBD] text-lg font-light">From a raw signal to a published masterpiece, seamlessly.</p>
          </FadeIn>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
            {[
              { title: 'Signal', icon: Target },
              { title: 'Idea', icon: Zap },
              { title: 'Script', icon: Sparkles },
              { title: 'Edit', icon: Video },
              { title: 'Learn', icon: BarChart3 }
            ].map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#1D2330] border border-white/10 flex items-center justify-center mb-4 text-white shadow-glass-md">
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium">{step.title}</div>
                {idx < 4 && <ChevronRight className="w-4 h-4 text-white/20 mt-4 md:hidden" />}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ========================================
        FOOTER
        ========================================
      */}
      <footer className="py-12 px-6 bg-[#FFFFFF] dark:bg-[#10131A] border-t border-[#E7EAF0] dark:border-[#2A3140]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#111318] dark:bg-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white dark:bg-[#10131A] rounded-sm" />
            </div>
            <span className="text-sm font-bold tracking-tight">VIDORA</span>
          </div>
          <div className="text-xs text-[#667085] dark:text-[#A7AFBD]">
            © {new Date().getFullYear()} VIDORA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
