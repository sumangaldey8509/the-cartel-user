'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Loader2, Globe, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceAPI } from '@/lib/voice-api';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string, language: string, confidence: number) => void;
  onError: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

export default function VoiceRecorder({ 
  onTranscriptionComplete, 
  onError, 
  className,
  disabled = false 
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [supportedLanguages, setSupportedLanguages] = useState<Language[]>([
    { code: 'auto', name: 'Auto Detect' }
  ]);
  const [languagesLoading, setLanguagesLoading] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchSupportedLanguages = async () => {
      try {
        const voiceAPI = new VoiceAPI();
        const response = await voiceAPI.getSupportedLanguages();
        
        const languages: Language[] = [
          { code: 'auto', name: 'Auto Detect' },
          ...Object.entries(response.speech_recognition_languages).map(([code, name]) => ({
            code,
            name: name as string
          }))
        ];
        
        setSupportedLanguages(languages);
      } catch (error) {
        console.error('Failed to fetch supported languages:', error);
        setSupportedLanguages([
          { code: 'auto', name: 'Auto Detect' },
          { code: 'en', name: 'English' },
          { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
          { code: 'es', name: 'Spanish', nativeName: 'Español' },
          { code: 'fr', name: 'French', nativeName: 'Français' },
          { code: 'de', name: 'German', nativeName: 'Deutsch' },
        ]);
      } finally {
        setLanguagesLoading(false);
      }
    };

    fetchSupportedLanguages();
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAudioLevel(average / 255);
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();

    } catch (error) {
      console.error('Error starting recording:', error);
      onError('Failed to access microphone. Please check your permissions.');
    }
  }, [onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      setAudioLevel(0);
    }
  }, [isRecording]);

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, `voice_${Date.now()}.webm`);
      formData.append('language_code', selectedLanguage);
      
      // Dynamic API base URL configuration
      const getApiBaseUrl = () => {
        if (typeof window !== 'undefined') {
          const hostname = window.location.hostname;
          if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return 'http://192.168.1.3:8000';
          }
        }
        return 'http://localhost:8000';
      };
      
      const response = await fetch(`${getApiBaseUrl()}/api/v1/voice/transcribe/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      const transcription = result.transcription;
      const command = result.command;
      
      if (transcription.transcribed_text) {
        onTranscriptionComplete(
          transcription.transcribed_text,
          transcription.detected_language || 'en',
          transcription.language_confidence || 0.8
        );
      } else {
        onError('No speech detected. Please try again.');
      }

    } catch (error) {
      console.error('Error processing audio:', error);
      onError(error instanceof Error ? error.message : 'Failed to process audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentLanguage = supportedLanguages.find(lang => lang.code === selectedLanguage);

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2">

        <button
          onClick={toggleRecording}
          disabled={disabled || isProcessing}
          className={cn(
            "relative p-3 rounded-full transition-all duration-200",
            isRecording 
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
              : "bg-primary hover:bg-primary/90 text-primary-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          title={isRecording ? "Stop recording" : "Start voice recording"}
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isRecording ? (
            <>
              <MicOff className="w-5 h-5" />
              <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping" />
              <div 
                className="absolute inset-0 rounded-full bg-red-400 opacity-20"
                style={{ transform: `scale(${1 + audioLevel * 0.3})` }}
              />
            </>
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="absolute bottom-full mb-2 left-0 right-0 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
