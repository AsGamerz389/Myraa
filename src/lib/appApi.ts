/**
 * Application API Client with Offline Stubs (Rule 5)
 * All backend /api calls are stubbed cleanly for standalone mobile execution.
 * Marked clearly as [OFFLINE STUB]. No fake success messages.
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  stubbed: true;
  message: string;
  data?: T;
}

export const appApi = {
  /**
   * [OFFLINE STUB] Server health and connectivity check.
   */
  async checkServerStatus(): Promise<ApiResponse<{ status: string; offlineMode: boolean }>> {
    console.info('[OFFLINE STUB] /api/status - Server offline, running client-only mode');
    return {
      ok: false,
      stubbed: true,
      message: '[OFFLINE STUB] Server is offline. Running in local mobile standalone mode.',
      data: { status: 'offline', offlineMode: true },
    };
  },

  /**
   * [OFFLINE STUB] Companion conversation query.
   */
  async sendChatMessage(message: string): Promise<ApiResponse<null>> {
    console.info(`[OFFLINE STUB] /api/companion/chat - query "${message}" rejected (server offline)`);
    return {
      ok: false,
      stubbed: true,
      message: '[OFFLINE STUB] Backend chat server is not running in this phase. Conversation API unavailable.',
      data: null,
    };
  },

  /**
   * [OFFLINE STUB] Companion memory retrieval.
   */
  async getMemories(): Promise<ApiResponse<any[]>> {
    console.info('[OFFLINE STUB] /api/memory - returning empty local stub');
    return {
      ok: false,
      stubbed: true,
      message: '[OFFLINE STUB] Server memory sync unavailable offline.',
      data: [],
    };
  },

  /**
   * [OFFLINE STUB] Speech synthesis / TTS.
   */
  async synthesizeVoice(text: string): Promise<ApiResponse<null>> {
    console.info(`[OFFLINE STUB] /api/voice/synthesize - TTS "${text}" stubbed`);
    return {
      ok: false,
      stubbed: true,
      message: '[OFFLINE STUB] Server TTS synthesis is unavailable offline.',
      data: null,
    };
  },

  /**
   * [OFFLINE STUB] Cloud configuration sync.
   */
  async syncConfig(config: any): Promise<ApiResponse<null>> {
    console.info('[OFFLINE STUB] /api/config/sync - local preferences stored in DataStore/localStorage');
    return {
      ok: false,
      stubbed: true,
      message: '[OFFLINE STUB] Remote config sync is not active.',
      data: null,
    };
  },
};
