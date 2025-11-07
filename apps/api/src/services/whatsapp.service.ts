import axios from 'axios';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { encryptionService } from '../utils/encryption';

interface EmbeddedSignupResponse {
  access_token: string;
  token_type: string;
}

interface WABAInfo {
  id: string;
  name: string;
  timezone_id: string;
  message_template_namespace: string;
}

interface PhoneNumberInfo {
  id: string;
  display_phone_number: string;
  verified_name: string;
  code_verification_status: string;
  quality_rating: string;
}

export class WhatsAppService {
  private baseURL: string;
  private apiVersion: string;

  constructor() {
    this.apiVersion = process.env.WHATSAPP_API_VERSION || 'v18.0';
    this.baseURL = `https://graph.facebook.com/${this.apiVersion}`;
  }

  /**
   * Handle embedded signup callback after user authorizes
   * @param code - Authorization code from Facebook OAuth
   * @param organizationId - Organization ID of the user
   * @returns Created WhatsApp account
   */
  async handleEmbeddedSignupCallback(code: string, organizationId: string) {
    try {
      logger.info('Starting embedded signup callback', { organizationId });

      // Step 1: Exchange authorization code for access token
      const accessToken = await this.exchangeCodeForToken(code);

      // Step 2: Get WABA information
      const wabaInfo = await this.getWABAInfo(accessToken);

      // Step 3: Get phone number details
      const phoneNumbers = await this.getPhoneNumbers(wabaInfo.id, accessToken);

      if (!phoneNumbers || phoneNumbers.length === 0) {
        throw new Error('No phone numbers found for this WABA');
      }

      // Use the first phone number
      const phoneNumber = phoneNumbers[0];

      // Step 4: Subscribe to webhooks for this WABA
      await this.subscribeToWebhooks(wabaInfo.id, accessToken);

      // Step 5: Store WhatsApp account in database
      const whatsappAccount = await prisma.whatsAppAccount.create({
        data: {
          organizationId,
          wabaId: wabaInfo.id,
          phoneNumberId: phoneNumber.id,
          displayPhoneNumber: phoneNumber.display_phone_number,
          verifiedName: phoneNumber.verified_name,
          accessToken: encryptionService.encrypt(accessToken),
          qualityRating: phoneNumber.quality_rating,
          status: 'ACTIVE',
          messageLimit: 1000, // Default tier 1 limit
        },
      });

      logger.info('WhatsApp account created successfully', {
        accountId: whatsappAccount.id,
        wabaId: wabaInfo.id,
      });

      return whatsappAccount;
    } catch (error: any) {
      logger.error('Embedded signup callback failed', {
        error: error.message,
        organizationId,
      });
      throw new Error(`Embedded signup failed: ${error.message}`);
    }
  }

  /**
   * Exchange authorization code for access token
   * @param code - Authorization code
   * @returns Access token
   */
  private async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const response = await axios.post<EmbeddedSignupResponse>(
        `${this.baseURL}/oauth/access_token`,
        null,
        {
          params: {
            client_id: process.env.WHATSAPP_APP_ID,
            client_secret: process.env.WHATSAPP_APP_SECRET,
            code,
          },
        }
      );

      logger.info('Access token exchanged successfully');
      return response.data.access_token;
    } catch (error: any) {
      logger.error('Token exchange failed', {
        error: error.response?.data || error.message,
      });
      throw new Error('Failed to exchange code for access token');
    }
  }

  /**
   * Get WhatsApp Business Account information
   * @param accessToken - Access token
   * @returns WABA information
   */
  private async getWABAInfo(accessToken: string): Promise<WABAInfo> {
    try {
      // Get the debug token info to find WABA ID
      const debugResponse = await axios.get(`${this.baseURL}/debug_token`, {
        params: {
          input_token: accessToken,
          access_token: accessToken,
        },
      });

      const granularScopes = debugResponse.data.data.granular_scopes;
      const wabaScope = granularScopes?.find((scope: any) =>
        scope.scope.includes('whatsapp_business_management')
      );

      if (!wabaScope || !wabaScope.target_ids || wabaScope.target_ids.length === 0) {
        throw new Error('No WABA ID found in token');
      }

      const wabaId = wabaScope.target_ids[0];

      // Get WABA details
      const wabaResponse = await axios.get<WABAInfo>(`${this.baseURL}/${wabaId}`, {
        params: {
          fields: 'id,name,timezone_id,message_template_namespace',
          access_token: accessToken,
        },
      });

      logger.info('WABA info retrieved', { wabaId });
      return wabaResponse.data;
    } catch (error: any) {
      logger.error('Failed to get WABA info', {
        error: error.response?.data || error.message,
      });
      throw new Error('Failed to get WABA information');
    }
  }

  /**
   * Get phone numbers associated with WABA
   * @param wabaId - WhatsApp Business Account ID
   * @param accessToken - Access token
   * @returns Array of phone numbers
   */
  private async getPhoneNumbers(
    wabaId: string,
    accessToken: string
  ): Promise<PhoneNumberInfo[]> {
    try {
      const response = await axios.get(`${this.baseURL}/${wabaId}/phone_numbers`, {
        params: {
          access_token: accessToken,
        },
      });

      logger.info('Phone numbers retrieved', {
        count: response.data.data.length,
      });
      return response.data.data;
    } catch (error: any) {
      logger.error('Failed to get phone numbers', {
        error: error.response?.data || error.message,
      });
      throw new Error('Failed to get phone numbers');
    }
  }

  /**
   * Subscribe app to WABA webhooks
   * @param wabaId - WhatsApp Business Account ID
   * @param accessToken - Access token
   */
  private async subscribeToWebhooks(wabaId: string, accessToken: string): Promise<void> {
    try {
      await axios.post(
        `${this.baseURL}/${wabaId}/subscribed_apps`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      logger.info('Subscribed to webhooks', { wabaId });
    } catch (error: any) {
      logger.warn('Failed to subscribe to webhooks', {
        error: error.response?.data || error.message,
        wabaId,
      });
      // Don't throw - this is not critical for initial setup
    }
  }

  /**
   * Send a text message via WhatsApp
   * @param phoneNumberId - Phone number ID from which to send
   * @param to - Recipient phone number (with country code, no +)
   * @param message - Message text
   * @returns Message send response
   */
  async sendTextMessage(phoneNumberId: string, to: string, message: string) {
    try {
      const account = await prisma.whatsAppAccount.findUnique({
        where: { phoneNumberId },
      });

      if (!account) {
        throw new Error('WhatsApp account not found');
      }

      const accessToken = encryptionService.decrypt(account.accessToken);

      const response = await axios.post(
        `${this.baseURL}/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to.replace(/\+/g, ''),
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('Message sent successfully', {
        messageId: response.data.messages[0].id,
        to,
      });

      return response.data;
    } catch (error: any) {
      logger.error('Failed to send message', {
        error: error.response?.data || error.message,
        to,
      });
      throw new Error(`Failed to send message: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Get all WhatsApp accounts for an organization
   * @param organizationId - Organization ID
   * @returns Array of WhatsApp accounts (with decrypted tokens removed)
   */
  async getAccounts(organizationId: string) {
    const accounts = await prisma.whatsAppAccount.findMany({
      where: { organizationId },
      select: {
        id: true,
        wabaId: true,
        phoneNumberId: true,
        displayPhoneNumber: true,
        verifiedName: true,
        qualityRating: true,
        status: true,
        messageLimit: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return accounts;
  }

  /**
   * Delete a WhatsApp account
   * @param accountId - WhatsApp account ID
   * @param organizationId - Organization ID (for security)
   */
  async deleteAccount(accountId: string, organizationId: string) {
    const account = await prisma.whatsAppAccount.findFirst({
      where: {
        id: accountId,
        organizationId,
      },
    });

    if (!account) {
      throw new Error('WhatsApp account not found');
    }

    await prisma.whatsAppAccount.delete({
      where: { id: accountId },
    });

    logger.info('WhatsApp account deleted', { accountId });
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();
