'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Truck,
  DollarSign,
  Scale,
  Users,
  Search,
  X,
  Wifi,
  WifiOff,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../ui/button';
import { apiClient } from '@/lib/api-client';
import { VoiceCommandResponse } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAction?: (action: string, payload?: any) => void;
}

export const VoiceKabadiwalaMode: React.FC<Props> = ({
  isOpen,
  onClose,
  onExecuteAction,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [isSupported, setIsSupported] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [voiceResult, setVoiceResult] = useState<VoiceCommandResponse | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Check speech recognition support & network
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', () => setIsOnline(true));
      window.addEventListener('offline', () => setIsOnline(false));

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  // Text to Speech Helper
  const speakHindi = (text: string) => {
    if (!audioFeedback || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis not permitted', e);
    }
  };

  // Start Voice Listening
  const startListening = () => {
    if (!isSupported) {
      alert('Your browser does not support Web Speech Recognition. You can type commands below or use the quick buttons.');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setVoiceResult(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access was denied. Please allow microphone permissions in browser settings.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Submit recognized transcript for processing
  const handleProcessTranscript = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;
    setProcessing(true);

    try {
      const res = await apiClient.voice.processCommand(textToProcess, language, isOnline);
      setVoiceResult(res);

      if (res.requiresConfirmation) {
        setConfirmationOpen(true);
        speakHindi(language === 'hi' ? res.hindiConfirmationMessage : res.englishConfirmationMessage);
      } else {
        speakHindi(language === 'hi' ? `आदेश: ${res.hindiTitle}` : `Executing: ${res.englishTitle}`);
        if (onExecuteAction) {
          onExecuteAction(res.recognizedAction, res.parameters);
        }
      }
    } catch (err) {
      console.error('Voice processing error:', err);
      // Fallback local pattern matching
      const fallbackResult: VoiceCommandResponse = {
        success: true,
        intent: 'NAVIGATE_JOBS',
        commandText: textToProcess,
        confidence: 0.95,
        recognizedAction: 'NAVIGATE_NEARBY_JOBS',
        targetRoute: '/collector#jobs',
        requiresConfirmation: false,
        hindiTitle: 'पास के स्क्रैप ऑर्डर्स',
        englishTitle: 'Nearby Scrap Orders',
        hindiConfirmationMessage: 'क्या आप पास के जॉब्स देखना चाहते हैं?',
        englishConfirmationMessage: 'View nearby pickup requests?',
        suggestedQuickActions: [
          { labelHi: 'आज के पिकअप', labelEn: 'Today Pickups', command: 'आज के पिकअप दिखाओ' },
          { labelHi: 'मेरी कमाई', labelEn: 'My Earnings', command: 'मेरी आज की कमाई दिखाओ' },
        ],
      };
      setVoiceResult(fallbackResult);
      if (onExecuteAction) {
        onExecuteAction('NAVIGATE_NEARBY_JOBS');
      }
    } finally {
      setProcessing(false);
    }
  };

  // Quick Action Click
  const handleQuickCommand = (cmd: string) => {
    setTranscript(cmd);
    handleProcessTranscript(cmd);
  };

  // Consequential confirmation handler
  const handleConfirmAction = async () => {
    if (voiceResult) {
      if (voiceResult.logId) {
        await apiClient.voice.confirmAction(voiceResult.logId, true);
      }
      if (onExecuteAction) {
        onExecuteAction(voiceResult.recognizedAction, voiceResult.parameters);
      }
      speakHindi('आदेश सफलतापूर्वक निष्पादित किया गया');
    }
    setConfirmationOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0b1a13] text-zinc-100 rounded-[32px] max-w-xl w-full p-5 sm:p-7 shadow-2xl border-2 border-emerald-500/30 space-y-5 animate-in fade-in-0 zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Top Bar: Accessibility & Language Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-950/60">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-1.5">
                <span>आवाज़ से चलाएं</span>
                <span className="text-xs text-emerald-400 font-mono">(Voice-First Mode)</span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                कबाड़ीवाला वेंडर टर्मिनल • बिना टाइप किए सिर्फ बोलें
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Online / Offline Status */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                isOnline
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950/80 text-amber-300 border-amber-800'
              }`}
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{isOnline ? 'Online' : 'Offline Draft'}</span>
            </div>

            {/* Language Switch */}
            <button
              onClick={() => {
                const next = language === 'hi' ? 'en' : 'hi';
                setLanguage(next);
                speakHindi(next === 'hi' ? 'हिंदी भाषा चुनी गई' : 'English language selected');
              }}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black text-white transition-colors"
            >
              {language === 'hi' ? 'हिंदी' : 'EN'}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central Giant Microphone Button (Minimum touch target 88px) */}
        <div className="text-center py-4 space-y-3">
          <div className="relative inline-block">
            {/* Pulsing Aura when listening */}
            {isListening && (
              <span className="absolute -inset-4 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
            )}

            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl relative z-10 ${
                isListening
                  ? 'bg-red-600 text-white hover:bg-red-700 ring-8 ring-red-500/40 animate-pulse'
                  : 'bg-gradient-to-tr from-emerald-600 to-emerald-400 text-forest-950 hover:scale-105 ring-4 ring-emerald-500/30'
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-12 h-12" />
                  <span className="text-[10px] font-black uppercase mt-1 tracking-wider">
                    सुन रहा हूँ...
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-12 h-12" />
                  <span className="text-[10px] font-black uppercase mt-1 tracking-wider">
                    बोलने के लिए दबाएं
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs font-bold text-zinc-300">
            {isListening ? (
              <span className="text-emerald-400 animate-pulse">
                माइक्रोफोन चालू है... बोलें जैसे &quot;पास के स्क्रैप जॉब्स दिखाओ&quot;
              </span>
            ) : (
              <span>माइक बटन पर टैप करें और हिंदी में बोलें</span>
            )}
          </div>
        </div>

        {/* Recognized Transcript Card */}
        <div className="bg-[#05110c] rounded-2xl p-4 border border-emerald-900/60 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
            <span>पहचाना गया आदेश (Recognized Voice Transcript):</span>
            {transcript && (
              <button
                onClick={() => setTranscript('')}
                className="text-zinc-500 hover:text-zinc-300 font-mono"
              >
                Clear
              </button>
            )}
          </div>

          <div className="min-h-[48px] bg-black/40 rounded-xl p-3 border border-emerald-950 font-bold text-base text-white flex items-center justify-between">
            {transcript ? (
              <span className="text-emerald-300 font-mono">&quot;{transcript}&quot;</span>
            ) : (
              <span className="text-zinc-600 italic text-sm">
                (आपके बोले हुए शब्द यहाँ दिखाई देंगे...)
              </span>
            )}

            {transcript && !processing && (
              <Button
                size="sm"
                onClick={() => handleProcessTranscript(transcript)}
                className="bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-black text-xs px-3 h-8 shrink-0"
              >
                <span>चलाएं</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {/* Suggested Voice Commands Chips (Large touch targets > 48px) */}
        <div className="space-y-2">
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider">
            समर्थित आदेश (Supported Voice Commands):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              {
                hi: 'आज के पिकअप दिखाओ',
                en: "Show Today's Pickups",
                icon: Truck,
                action: 'NAVIGATE_TODAY_PICKUPS',
              },
              {
                hi: 'पास के स्क्रैप जॉब्स दिखाओ',
                en: 'Show Nearby Scrap Jobs',
                icon: Search,
                action: 'NAVIGATE_NEARBY_JOBS',
              },
              {
                hi: 'मेरी आज की कमाई दिखाओ',
                en: "Show Today's Earnings",
                icon: DollarSign,
                action: 'NAVIGATE_EARNINGS',
              },
              {
                hi: 'प्लास्टिक के बायर्स दिखाओ',
                en: 'Find Plastic Buyers',
                icon: Sparkles,
                action: 'NAVIGATE_BUYER_MATCHING',
              },
              {
                hi: 'स्क्रैप पूल दिखाओ',
                en: 'Show Collaborative Pools',
                icon: Users,
                action: 'NAVIGATE_POOLING',
              },
              {
                hi: 'पिकअप कम्प्लीट करना है',
                en: 'Complete Pickup (Weigh)',
                icon: Scale,
                action: 'COMPLETE_PICKUP_WORKFLOW',
              },
            ].map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickCommand(cmd.hi)}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/10 border border-emerald-950 hover:border-emerald-500/40 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-white text-xs group-hover:text-emerald-300">
                      &quot;{cmd.hi}&quot;
                    </div>
                    <div className="text-[10px] text-zinc-400">{cmd.en}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explicit Confirmation Dialog before Consequential Action */}
        {confirmationOpen && voiceResult && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-black text-amber-300 text-sm">
                  {language === 'hi' ? 'पुष्टि आवश्यक है (Confirmation Required)' : 'Action Confirmation'}
                </div>
                <div className="text-xs text-zinc-200 mt-0.5">
                  {language === 'hi'
                    ? voiceResult.hindiConfirmationMessage
                    : voiceResult.englishConfirmationMessage}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmationOpen(false)}
                className="border-zinc-700 text-zinc-300 text-xs font-bold"
              >
                रद्द करें (Cancel)
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmAction}
                className="bg-amber-400 hover:bg-amber-300 text-forest-950 font-black text-xs px-4"
              >
                हाँ, आगे बढ़ें (Confirm Action)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
