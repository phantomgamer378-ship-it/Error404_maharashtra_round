import { z } from 'zod';
import { CreatorProfile } from '../../types';
import { TimelineClip, EditorState } from '../../features/editor/types';

export interface SelectionScope {
  clipId: string | null;
  trackType: string | null;
  clipTitle: string;
  currentContent?: string;
  startSeconds?: number;
  endSeconds?: number;
}

export const StructuredAIOperationSchema = z.object({
  id: z.string(),
  type: z.enum(['replace_text', 'trim', 'remove', 'change_duration', 'regenerate_caption', 'change_style']),
  targetClipId: z.string(),
  targetTrackType: z.string(),
  elementLabel: z.string(),
  beforeValue: z.union([z.string(), z.number()]),
  afterValue: z.union([z.string(), z.number()]),
  explanation: z.string(),
  dnaInfluence: z.string(),
  diff: z.object({
    before: z.string(),
    after: z.string()
  }),
  timestamp: z.number()
});

export const EditorAIResponseSchema = z.object({
  operations: z.array(StructuredAIOperationSchema),
  summary: z.string(),
  requiresScopeConfirmation: z.boolean(),
  proposedWiderScope: z.string().optional(),
  fallbackApplied: z.boolean().optional()
});

export type StructuredAIOperation = z.infer<typeof StructuredAIOperationSchema>;
export type EditorAIResponse = z.infer<typeof EditorAIResponseSchema>;

export interface EditorAIRequest {
  command: string;
  scope: SelectionScope;
  editorState: EditorState;
  creator: CreatorProfile;
}

export class EditorAIService {
  async processCommand(req: EditorAIRequest): Promise<EditorAIResponse> {
    const { command, scope, creator } = req;
    const lowerCmd = command.toLowerCase().trim();

    // Default target clip: either scope.clipId or find the hook/caption clip
    let targetClipId = scope.clipId;
    let targetClip: TimelineClip | undefined;

    if (targetClipId) {
      targetClip = req.editorState.tracks.flatMap(t => t.clips).find(c => c.id === targetClipId);
    } else {
      // Find hook text clip as default fallback
      targetClip = req.editorState.tracks.flatMap(t => t.clips).find(c => c.id.includes('hook') || c.trackType === 'text');
      targetClipId = targetClip ? targetClip.id : 'clip-hook-title';
    }

    const currentText = targetClip?.content || scope.currentContent || "If your mom calls asking for $500, STOP.";

    // Simulate LLM latency
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      let rawResult: EditorAIResponse;

      // RULE 5: SCOPED EDITING. Check if command tries to silently affect wider project without scope
      if (lowerCmd.includes('entire project') || lowerCmd.includes('all tracks') || lowerCmd.includes('whole video') || lowerCmd.includes('re-edit everything')) {
        rawResult = {
          summary: `Command asks for full-project modifications. As per Scoped Editing (Rule 5), CreatorAi proposes wider scope confirmation before modifying other tracks.`,
          requiresScopeConfirmation: true,
          proposedWiderScope: `All Tracks (Video, Captions, Text, Audio, B-Roll)`,
          operations: [
            {
              id: `ai-op-${Date.now()}`,
              type: 'replace_text',
              targetClipId: targetClipId!,
              targetTrackType: targetClip?.trackType || 'text',
              elementLabel: targetClip?.title || 'Selected Scope',
              beforeValue: currentText,
              afterValue: `[Proposed Scope]: ${currentText}`,
              explanation: `Requires explicit creator confirmation to expand scope beyond ${targetClip?.title || 'selected element'}.`,
              dnaInfluence: `Scoped Safety: Never silently rewrite full project.`,
              diff: {
                before: currentText,
                after: `[Proposed Scope]: ${currentText}`
              },
              timestamp: Date.now()
            }
          ]
        };
        return EditorAIResponseSchema.parse(rawResult);
      }

      // Case 1: "Make this more engaging but keep my style" or "engaging"
      if (lowerCmd.includes('engaging') || lowerCmd.includes('keep my style')) {
        const newText = "If your mom calls you crying right now asking for wire transfer money, STOP. Ask this 1 safe-word first.";
        rawResult = {
          summary: `Enhanced hook curiosity with high-stakes scenario while preserving ${creator.name}'s Educational + Humorous voice.`,
          requiresScopeConfirmation: false,
          operations: [
            {
              id: `ai-op-${Date.now()}`,
              type: 'replace_text',
              targetClipId: targetClipId!,
              targetTrackType: targetClip?.trackType || 'text',
              elementLabel: targetClip?.title || 'Hook Overlay',
              beforeValue: currentText,
              afterValue: newText,
              explanation: `Replaced static opener with high-retention emergency curiosity test.`,
              dnaInfluence: `Sarth DNA: Question hook + High-stakes consumer tech alert.`,
              diff: {
                before: currentText,
                after: newText
              },
              timestamp: Date.now()
            }
          ]
        };
      }

      // Case 2: "Make this hook stronger" or "sharpen"
      else if (lowerCmd.includes('stronger') || lowerCmd.includes('hook') || lowerCmd.includes('sharpen')) {
        const newText = "STOP! Scammers only need 3 seconds of audio to clone your family's voice in real time.";
        rawResult = {
          summary: `Compressed hook into a 3.8s high-velocity statement with direct proof.`,
          requiresScopeConfirmation: false,
          operations: [
            {
              id: `ai-op-${Date.now()}`,
              type: 'replace_text',
              targetClipId: targetClipId!,
              targetTrackType: targetClip?.trackType || 'text',
              elementLabel: targetClip?.title || 'Hook Overlay',
              beforeValue: currentText,
              afterValue: newText,
              explanation: `Front-loaded the 3-second audio statistic to maximize 3-second retention.`,
              dnaInfluence: `Sarth DNA: Fast 30-45s vertical pacing.`,
              diff: {
                before: currentText,
                after: newText
              },
              timestamp: Date.now()
            }
          ]
        };
      }

      // Case 3: "Make this more humorous" or "humorous"
      else if (lowerCmd.includes('humor') || lowerCmd.includes('funny')) {
        const newText = "My mom called crying asking for $500... so I tested her with a cybersecurity pop quiz.";
        rawResult = {
          summary: `Reframed hook with relatable humor without losing educational integrity.`,
          requiresScopeConfirmation: false,
          operations: [
            {
              id: `ai-op-${Date.now()}`,
              type: 'replace_text',
              targetClipId: targetClipId!,
              targetTrackType: targetClip?.trackType || 'text',
              elementLabel: targetClip?.title || 'Hook Overlay',
              beforeValue: currentText,
              afterValue: newText,
              explanation: `Added self-deprecating creator anecdote to build instant viewer rapport.`,
              dnaInfluence: `Sarth DNA: Educational + Humorous tone anchor.`,
              diff: {
                before: currentText,
                after: newText
              },
              timestamp: Date.now()
            }
          ]
        };
      }

      // Case 4: "Rewrite this in Hinglish"
      else if (lowerCmd.includes('hinglish') || lowerCmd.includes('hindi')) {
        const newText = "Agar mom ka call aaye crying for urgent money, RUK JAO! Pehle ye secret family safe-word pucho.";
        rawResult = {
          summary: `Adapted dialogue into high-engagement colloquial Hinglish.`,
          requiresScopeConfirmation: false,
          operations: [
            {
              id: `ai-op-${Date.now()}`,
              type: 'replace_text',
              targetClipId: targetClipId!,
              targetTrackType: targetClip?.trackType || 'text',
              elementLabel: targetClip?.title || 'Hook Overlay',
              beforeValue: currentText,
              afterValue: newText,
              explanation: `Localized vernacular rhythm with punchy imperative ("Ruk jao!").`,
              dnaInfluence: `Creator DNA: Multi-lingual short-form adaptation.`,
              diff: {
                before: currentText,
                after: newText
              },
              timestamp: Date.now()
            }
          ]
        };
      }

      // Case 5: "Create a LinkedIn version"
      else if (lowerCmd.includes('linkedin')) {
        const newText = "Security Briefing: Why 78% of family emergency wire frauds now leverage deepfake audio telemetry.";
        rawResult = {
          summary: `Adapted copy for LinkedIn audience: professional data-backed executive framing.`,
          requiresScopeConfirmation: false,
          operations: [
            {
              id: `ai-op-${Date.now()}`,
              type: 'replace_text',
              targetClipId: targetClipId!,
              targetTrackType: targetClip?.trackType || 'text',
              elementLabel: targetClip?.title || 'Hook Overlay',
              beforeValue: currentText,
              afterValue: newText,
              explanation: `Converted casual hook into enterprise thought-leadership data hook.`,
              dnaInfluence: `Sarth DNA: Professional cross-posting mode.`,
              diff: {
                before: currentText,
                after: newText
              },
              timestamp: Date.now()
            }
          ]
        };
      }

      // Case 6: "Make this more professional"
      else if (lowerCmd.includes('professional') || lowerCmd.includes('corporate')) {
        const newText = "Critical Advisory: Zero-shot audio deepfakes can replicate executive voice cadence in under 3 seconds.";
        rawResult = {
          summary: `Elevated phrasing to enterprise cybersecurity advisory standard.`,
          requiresScopeConfirmation: false,
          operations: [
            {
              id: `ai-op-${Date.now()}`,
              type: 'replace_text',
              targetClipId: targetClipId!,
              targetTrackType: targetClip?.trackType || 'text',
              elementLabel: targetClip?.title || 'Hook Overlay',
              beforeValue: currentText,
              afterValue: newText,
              explanation: `Replaced conversational phrasing with formal threat analysis terminology.`,
              dnaInfluence: `Sarth DNA: Technical credibility & security domain authority.`,
              diff: {
                before: currentText,
                after: newText
              },
              timestamp: Date.now()
            }
          ]
        };
      }

      // Case 7: "Remove the boring section" or "trim"
      else if (lowerCmd.includes('boring') || lowerCmd.includes('remove') || lowerCmd.includes('trim')) {
        const videoTrack = req.editorState.tracks.find(t => t.type === 'video');
        const videoClip = videoTrack?.clips[0];
        const targetId = videoClip?.id || targetClipId!;
        const oldDuration = videoClip?.duration || 38.0;
        const newDuration = +(oldDuration - 4.5).toFixed(1);

        rawResult = {
          summary: `Detected 4.5s of low audio energy between 00:12 - 00:16 and trimmed dead air.`,
          requiresScopeConfirmation: false,
          operations: [
            {
              id: `ai-op-${Date.now()}`,
              type: 'trim',
              targetClipId: targetId,
              targetTrackType: 'video',
              elementLabel: videoClip?.title || 'Main Video Clip',
              beforeValue: `${oldDuration}s duration`,
              afterValue: `${newDuration}s duration (-4.5s trimmed)`,
              explanation: `Eliminated vocal hesitation pause and redundant slide transition.`,
              dnaInfluence: `Retention rule: Cut dead air to maintain >80% retention past 10s.`,
              diff: {
                before: `Duration: ${oldDuration}s (with 4.5s pause)`,
                after: `Duration: ${newDuration}s (fast-paced cut)`
              },
              timestamp: Date.now()
            }
          ]
        };
      }

      // Case 8: "Make this 25 seconds" (Change duration)
      else if (lowerCmd.includes('25') || lowerCmd.includes('seconds')) {
        rawResult = {
          summary: `Paced script and cuts to target 25-second ultra-short format.`,
          requiresScopeConfirmation: false,
          operations: [
            {
              id: `ai-op-${Date.now()}`,
              type: 'change_duration',
              targetClipId: targetClipId!,
              targetTrackType: targetClip?.trackType || 'text',
              elementLabel: 'Project Timeline Duration',
              beforeValue: '38s',
              afterValue: '25s',
              explanation: `Compressed timeline bounds for high-tempo YouTube Shorts loop.`,
              dnaInfluence: `DNA Target: High-density short-form pacing.`,
              diff: {
                before: '38.0s timeline total',
                after: '25.0s timeline total (-13s condensed)'
              },
              timestamp: Date.now()
            }
          ]
        };
      }

      // Default Fallback: Customized Scoped Refinement
      else {
        const newText = `[Refined for ${creator.name}]: ${command} applied to "${currentText.slice(0, 30)}..."`;
        rawResult = {
          summary: `Applied targeted AI adjustment: "${command}" to ${scope.clipTitle || 'selected element'}.`,
          requiresScopeConfirmation: false,
          operations: [
            {
              id: `ai-op-${Date.now()}`,
              type: 'replace_text',
              targetClipId: targetClipId!,
              targetTrackType: targetClip?.trackType || 'text',
              elementLabel: targetClip?.title || 'Selected Scope',
              beforeValue: currentText,
              afterValue: newText,
              explanation: `Updated text content specifically within the active selection.`,
              dnaInfluence: `Creator DNA: Preserved Educational + Humorous balance.`,
              diff: {
                before: currentText,
                after: newText
              },
              timestamp: Date.now()
            }
          ]
        };
      }

      // Strict Zod validation
      return EditorAIResponseSchema.parse(rawResult);
    } catch (err) {
      console.warn('AI processing error or Zod validation issue, providing resilient fallback:', err);
      // Resilient fallback: Never crash the editor!
      const fallbackResult: EditorAIResponse = {
        summary: `Recovered from AI latency with prepared high-retention suggestion for ${creator.name}.`,
        requiresScopeConfirmation: false,
        fallbackApplied: true,
        operations: [
          {
            id: `ai-op-${Date.now()}`,
            type: 'replace_text',
            targetClipId: targetClipId!,
            targetTrackType: targetClip?.trackType || 'text',
            elementLabel: targetClip?.title || 'Selected Scope',
            beforeValue: currentText,
            afterValue: `Emergency Alert: Verify this 1 code before sending money.`,
            explanation: `Resilient fallback applied with guaranteed safe retention opener.`,
            dnaInfluence: `Creator DNA: Educational alert anchor.`,
            diff: {
              before: currentText,
              after: `Emergency Alert: Verify this 1 code before sending money.`
            },
            timestamp: Date.now()
          }
        ]
      };
      return fallbackResult;
    }
  }
}

export const editorAIService = new EditorAIService();
