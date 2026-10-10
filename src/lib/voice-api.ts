export interface VoiceTranscriptionResponse {
  session_id: string;
  transcription: {
    id: string;
    audio_filename: string;
    audio_format: string;
    audio_size: number;
    transcribed_text: string;
    detected_language: string;
    language_confidence: number;
    confidence_score: number;
    processing_time: number;
    speech_model_used: string;
    speaker_count: number;
    word_count: number;
    created_at: string;
  };
  command: {
    command: {
      id: string;
      transcription: any;
      command_type: string;
      command_text: string;
      response_text: string;
      response_language: string;
      processing_time: number;
      created_at: string;
    };
    detected_language: string;
    language_confidence: number;
    response_language: string;
  };
  supported_languages: { [key: string]: string };
}

export interface SupportedLanguagesResponse {
  speech_recognition_languages: { [key: string]: string };
  response_languages: string[];
  speech_models: string[];
}

export class VoiceAPI {
  private get baseURL() {
    // Dynamic API base URL configuration
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return 'http://192.168.1.3:8000/api/v1/voice';
      }
    }
    return 'http://localhost:8000/api/v1/voice';
  }

  async transcribeAudio(
    audioFile: File,
    languageCode: string = 'auto',
    sessionId?: string
  ): Promise<VoiceTranscriptionResponse> {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    formData.append('language_code', languageCode);
    if (sessionId) {
      formData.append('session_id', sessionId);
    }

    const response = await fetch(`${this.baseURL}/transcribe/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Transcription failed: ${response.statusText}`);
    }

    return response.json();
  }

  async transcribeFromURL(
    audioUrl: string,
    languageCode: string = 'auto',
    sessionId?: string
  ): Promise<VoiceTranscriptionResponse> {
    const response = await fetch(`${this.baseURL}/transcribe-url/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        language_code: languageCode,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Transcription failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getSupportedLanguages(): Promise<SupportedLanguagesResponse> {
    const response = await fetch(`${this.baseURL}/languages/`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get supported languages: ${response.statusText}`);
    }

    return response.json();
  }

  // Utility method to check if voice features are available
  static isVoiceSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'mediaDevices' in navigator &&
      'getUserMedia' in navigator.mediaDevices
    );
  }

  // Utility method to check microphone permission
  static async checkMicrophonePermission(): Promise<PermissionState> {
    if (!this.isVoiceSupported()) {
      return 'denied';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return permission.state;
    } catch (error) {
      // Fallback: try to get user media to check permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return 'granted';
      } catch (err) {
        return 'denied';
      }
    }
  }

  // Utility method to request microphone permission
  static async requestMicrophonePermission(): Promise<boolean> {
    if (!this.isVoiceSupported()) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const voiceAPI = new VoiceAPI();
