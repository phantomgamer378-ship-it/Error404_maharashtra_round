import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  Video, 
  Film, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight, 
  Scissors, 
  Sliders, 
  Layers, 
  Cpu, 
  Zap, 
  Play, 
  Check, 
  Info,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { 
  footageService, 
  RawFootageMetadata, 
  CandidateKeyMoment, 
  ProcessingStage,
  SAMPLE_FOOTAGE_METADATA 
} from '../../lib/services/FootageService';
import { useCreator } from '../../context/CreatorContext';
import { apiClient } from '../../lib/api';
import { Project, NavigationTab } from '../../types';
import { ScoreRing } from '../ui/ScoreRing';
import { DemoDataBadge } from '../ui/DemoDataBadge';

interface RawFootageAnalysisViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenVideoEditor: () => void;
  onClipCreated?: (project: Project) => void;
}

const STAGES: ProcessingStage[] = [
  { stage: 'Uploading', progress: 18, description: 'Parsing media container & verifying resolution (4K ProRes 60fps)...' },
  { stage: 'Transcribing', progress: 38, description: 'Whisper AI transcribing audio stream and aligning word timestamps...' },
  { stage: 'Understanding', progress: 58, description: 'Semantic chunking & topic boundary detection across 44m stream...' },
  { stage: 'Finding moments', progress: 76, description: 'Ranking curiosity spikes, emotional delivery & retention potential...' },
  { stage: 'Matching script', progress: 90, description: 'Aligning detected dialogue against Sarth’s Creator DNA script...' },
  { stage: 'Generating clips', progress: 100, description: 'Formulating 9:16 vertical crop coordinates & caption blocks...' },
];

export const RawFootageAnalysisView: React.FC<RawFootageAnalysisViewProps> = ({
  onNavigate,
  onOpenVideoEditor,
  onClipCreated,
}) => {
  const { addProject, creator } = useCreator();

  // State: 'idle' | 'processing' | 'results'
  const [viewState, setViewState] = useState<'idle' | 'processing' | 'results'>('idle');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isScriptAttached, setIsScriptAttached] = useState(true);
  const [selectedScriptTitle, setSelectedScriptTitle] = useState('AI Voice Cloning & Campus Emergency Phishing Script v2');
  const [footageData, setFootageData] = useState<RawFootageMetadata | null>(null);
  const [activeCreatedMomentId, setActiveCreatedMomentId] = useState<string | null>(null);

  // Trigger processing animation
  const runProcessingPipeline = (data: RawFootageMetadata) => {
    setViewState('processing');
    setCurrentStageIndex(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      if (idx < STAGES.length) {
        setCurrentStageIndex(idx);
      } else {
        clearInterval(interval);
        setFootageData(data);
        setTimeout(() => {
          setViewState('results');
        }, 300);
      }
    }, 450);
  };

  // Handler for Picking Prepared Sample (Instant Live Demo safety)
  const handlePickSample = async () => {
    const sample = await footageService.getSampleFootage();
    runProcessingPipeline(sample);
  };

  // Handler for Real Upload
  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
    let file: File | null = null;
    if ('dataTransfer' in e && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      file = e.dataTransfer.files[0];
    } else {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        file = target.files[0];
      }
    }

    if (file) {
      try {
        // 1. Request upload signature from API
        const uploadRes = await apiClient.assets.requestUpload({
          filename: file.name,
          content_type: file.type,
          size: file.size
        });
        
        // 2. Confirm upload with backend (Simulating actual file upload)
        await apiClient.assets.confirmUpload(uploadRes.asset_id);
        
        // 3. Fallback to local fake processing for the complex UI metadata
        const processed = await footageService.processUploadedFootage(
          file,
          isScriptAttached ? selectedScriptTitle : undefined
        );
        runProcessingPipeline(processed);
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  // Handler for "Create Clip" from a candidate key moment
  const handleCreateClip = async (moment: CandidateKeyMoment) => {
    if (!footageData) return;
    setActiveCreatedMomentId(moment.id);

    const clipProject = await footageService.createClipProject(footageData.id, moment);
    
    // Create short-form Project with structured editor state
    const newProject: Project = {
      id: clipProject.id,
      title: `${moment.topic} (9:16 Short Clip)`,
      niche: creator.niche[0] || 'Cybersecurity',
      status: 'Editing',
      updatedAt: 'Just now',
      duration: moment.duration,
      thumbnail: moment.previewThumbnail,
      hookText: moment.suggestedHook,
      scriptText: `[HOOK 0:00 - 0:05]\n${moment.suggestedHook}\n\n[BODY ${moment.timestamp} - ${moment.timestampEnd}]\n${moment.topic}\n\n[CTA]\n${moment.ctaSuggestion}`,
      opportunityScore: moment.potentialScore,
      platformVariants: [
        {
          platform: 'TikTok',
          icon: 'Video',
          format: 'Vertical (9:16)',
          length: moment.duration,
          hook: moment.suggestedHook,
          scriptSnippet: `Source: ${footageData.fileName} @ ${moment.timestamp}`,
          cta: moment.ctaSuggestion,
          estimatedReach: '50k - 100k'
        }
      ]
    };

    addProject(newProject);
    if (onClipCreated) {
      onClipCreated(newProject);
    }

    setTimeout(() => {
      onOpenVideoEditor();
    }, 400);
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Film className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>RAW FOOTAGE INTELLIGENCE</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
              Whisper + Semantic Moment Extraction
            </span>
            <DemoDataBadge />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Long-Form Footage <span className="text-gradient-accent">Clip Generator</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Upload raw multi-camera studio recordings or podcasts. VIDORA detects high-retention moments, matches scripts, and exports vertical 9:16 cuts.
          </p>
        </div>

        {viewState === 'results' && (
          <button
            onClick={() => setViewState('idle')}
            className="px-4 py-2 rounded-xl glass-button text-xs font-semibold text-slate-300 flex items-center gap-2 self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Upload Another Video</span>
          </button>
        )}
      </div>

      {/* 1. IDLE STATE: UPLOAD EXPERIENCE */}
      {viewState === 'idle' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Upload Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="p-8 sm:p-12 rounded-3xl glass-panel-l3 border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 transition-all flex flex-col items-center justify-center text-center space-y-4 shadow-2xl relative overflow-hidden group cursor-pointer"
          >
            <input
              type="file"
              accept="video/*"
              onChange={handleFileDrop}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />

            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-primary">
              <UploadCloud className="w-8 h-8 text-indigo-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Drag and drop raw footage here
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Supports MP4, MOV, ProRes up to 8GB. Audio is automatically extracted and transcribed.
              </p>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-2">
              <span>• Auto-Transcribe</span>
              <span>• Topic Boundary Detection</span>
              <span>• 9:16 Smart Crop</span>
            </div>
          </div>

          {/* Quick Demo Pick Action */}
          <div className="rounded-2xl glass-panel-l2 p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Prepared Studio Sample</h4>
                <p className="text-[11px] text-slate-400">
                  {SAMPLE_FOOTAGE_METADATA.fileName} ({SAMPLE_FOOTAGE_METADATA.duration}, 4K ProRes)
                </p>
              </div>
            </div>

            <button
              onClick={handlePickSample}
              className="px-5 py-2.5 rounded-xl glass-button-primary text-xs font-bold text-white flex items-center gap-2 shadow-glow-primary shrink-0 w-full sm:w-auto justify-center"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Prepared Sample</span>
            </button>
          </div>

          {/* Optional Script Attachment */}
          <div className="rounded-2xl glass-panel-l2 p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isScriptAttached}
                  onChange={(e) => setIsScriptAttached(e.target.checked)}
                  className="rounded border-white/20 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Attach Prepared Script for Alignment Verification</span>
              </label>
              <span className="text-[10px] text-indigo-300 font-mono">RECOMMENDED</span>
            </div>

            {isScriptAttached && (
              <div className="pt-2">
                <select
                  value={selectedScriptTitle}
                  onChange={(e) => setSelectedScriptTitle(e.target.value)}
                  className="w-full bg-[#0b0d17] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-400 font-medium"
                >
                  <option value="AI Voice Cloning & Campus Emergency Phishing Script v2">
                    AI Voice Cloning & Campus Emergency Phishing Script v2 (38s Target)
                  </option>
                  <option value="Autonomous Agent Bash Security Script v1">
                    Autonomous Agent Bash Security Script v1 (45s Target)
                  </option>
                  <option value="Deepfake CEO Wire Fraud Breakdown">
                    Deepfake CEO Wire Fraud Breakdown (40s Target)
                  </option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. PROCESSING PIPELINE ANIMATION */}
      {viewState === 'processing' && (
        <div className="max-w-xl mx-auto py-12 space-y-6 text-center">
          <div className="relative w-20 h-20 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full rounded-full border-2 border-indigo-500/30 border-t-indigo-400 shadow-glow-primary"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="w-8 h-8 text-indigo-300 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">
              Stage: {STAGES[currentStageIndex].stage}
            </h3>
            <p className="text-xs text-slate-300 font-mono">
              {STAGES[currentStageIndex].description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${STAGES[currentStageIndex].progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Stage {currentStageIndex + 1} of {STAGES.length}</span>
            <span>{STAGES[currentStageIndex].progress}% complete</span>
          </div>
        </div>
      )}

      {/* 3. RESULTS STATE: KEY MOMENTS FOUND & SCRIPT MAPPING */}
      {viewState === 'results' && footageData && (
        <div className="space-y-8 animate-fadeIn">
          {/* Footage Overview Banner */}
          <div className="rounded-3xl glass-panel-l3 p-6 border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <img
                src={footageData.thumbnail}
                alt={footageData.fileName}
                className="w-24 h-20 rounded-2xl object-cover border border-white/10 shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Analyzed Source Asset
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {footageData.fileName}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono flex-wrap">
                  <span>Duration: <strong className="text-white">{footageData.duration}</strong></span>
                  <span>• {footageData.resolution}</span>
                  <span>• Size: {footageData.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/[0.03] p-3 rounded-2xl border border-white/5 self-stretch lg:self-auto justify-between lg:justify-start">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Detected Clips</span>
                <span className="text-xl font-extrabold text-white font-mono">
                  {footageData.keyMoments.length} Key Moments
                </span>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Script Alignment</span>
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 96% Match
                </span>
              </div>
            </div>
          </div>

          {/* Script-to-Footage Alignment Banner */}
          {footageData.attachedScriptTitle && (
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase">Attached Creator Script</span>
                  <p className="text-white font-semibold">{footageData.attachedScriptTitle}</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Script sections mapped directly to video timestamps below
              </span>
            </div>
          )}

          {/* Key Moments Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Key Moments Found for Short-Form Clips
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Source range preserved • Editable in Timeline
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {footageData.keyMoments.map((moment) => (
                <div
                  key={moment.id}
                  className="rounded-3xl glass-panel-l2 border border-white/10 hover:border-indigo-500/40 transition-all p-5 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Thumbnail & Timing Badge */}
                    <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group">
                      <img
                        src={moment.previewThumbnail}
                        alt={moment.topic}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/10 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{moment.timestamp} - {moment.timestampEnd} ({moment.duration})</span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/80 backdrop-blur-md text-[10px] font-mono font-bold text-white">
                          9:16 CROP READY
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-300">
                        Cadence: {moment.speechCadence}
                      </div>
                    </div>

                    {/* Topic and Score */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white leading-snug">
                          {moment.topic}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          Suggested Hook: "{moment.suggestedHook}"
                        </span>
                      </div>
                      <ScoreRing
                        score={moment.potentialScore}
                        size={56}
                        strokeWidth={4.5}
                        label="POT"
                      />
                    </div>

                    {/* Why this was selected */}
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 space-y-1">
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                        Why this was selected:
                      </span>
                      <p className="leading-relaxed text-[11px]">
                        {moment.reason}
                      </p>
                    </div>

                    {/* Script Alignment Mapping (if present) */}
                    {moment.scriptAlignment && (
                      <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-200 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white">
                            Aligned to Script: "{moment.scriptAlignment.scriptSectionTitle}" ({moment.scriptAlignment.similarityScore}% match)
                          </span>
                          <p className="text-[10px] text-slate-300 italic mt-0.5">
                            "{moment.scriptAlignment.dialogueSnippet}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Create Clip Button */}
                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={() => handleCreateClip(moment)}
                      disabled={activeCreatedMomentId === moment.id}
                      className="w-full py-2.5 rounded-xl glass-button-primary font-bold text-xs text-white flex items-center justify-center gap-2 shadow-glow-primary transition-all disabled:opacity-50"
                    >
                      <Scissors className="w-4 h-4" />
                      <span>{activeCreatedMomentId === moment.id ? 'Creating Project Clip...' : 'Create Clip (9:16 Short)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
