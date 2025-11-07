# BotPe AI - Claude Code Approach

## Document Overview

This document outlines the technical approach, architecture patterns, AI integration strategies, and code implementation guidelines for BotPe AI using modern web technologies and AI capabilities.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [AI Integration Strategy](#2-ai-integration-strategy)
3. [Core Components](#3-core-components)
4. [WhatsApp API Integration](#4-whatsapp-api-integration)
5. [Bot Builder Implementation](#5-bot-builder-implementation)
6. [AI-Powered Features](#6-ai-powered-features)
7. [Real-time Communication](#7-real-time-communication)
8. [Data Models](#8-data-models)
9. [State Management](#9-state-management)
10. [Security Implementation](#10-security-implementation)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment Strategy](#12-deployment-strategy)

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │  Mobile App  │  │  Admin Panel │      │
│  │  (React/Next)│  │ (React Native│  │   (React)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/WSS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                        │
│  ┌────────────────────────────────────────────────────┐     │
│  │  API Gateway (Kong/AWS API Gateway)                 │     │
│  │  - Rate Limiting                                    │     │
│  │  - Authentication                                   │     │
│  │  - Request Routing                                  │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   APPLICATION LAYER     │   │   AI SERVICES LAYER     │
│                         │   │                         │
│  ┌──────────────────┐   │   │  ┌──────────────────┐   │
│  │  Auth Service    │   │   │  │  Claude AI API   │   │
│  ├──────────────────┤   │   │  ├──────────────────┤   │
│  │  Bot Service     │   │   │  │  NLP Service     │   │
│  ├──────────────────┤   │   │  ├──────────────────┤   │
│  │  Message Service │   │   │  │  Intent Engine   │   │
│  ├──────────────────┤   │   │  ├──────────────────┤   │
│  │  Template Service│   │   │  │  Entity Extract  │   │
│  ├──────────────────┤   │   │  ├──────────────────┤   │
│  │  Campaign Service│   │   │  │  Flow Generator  │   │
│  ├──────────────────┤   │   │  └──────────────────┘   │
│  │  Analytics Svc   │   │   │                         │
│  └──────────────────┘   │   └─────────────────────────┘
└─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│               WHATSAPP INTEGRATION LAYER                     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  WhatsApp Business API Client                       │     │
│  │  - Message Sender                                   │     │
│  │  - Webhook Handler                                  │     │
│  │  - Media Manager                                    │     │
│  │  - Template Manager                                 │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │PostgreSQL│  │   Redis  │  │  MongoDB │  │   S3     │   │
│  │(Relational)  │ (Cache)  │ (Logs/Chat)  │ (Media)  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Design Patterns

#### Microservices Architecture

-   Each major feature as independent service
-   Event-driven communication
-   Asynchronous processing for heavy operations
-   Service mesh for inter-service communication

#### Event Sourcing

-   All state changes captured as events
-   Audit trail and replay capability
-   CQRS for read/write optimization

#### Repository Pattern

-   Abstract data access layer
-   Testable business logic
-   Database-agnostic code

---

## 2. AI Integration Strategy

### 2.1 Claude AI Integration Architecture

```typescript
// AI Service Wrapper
class ClaudeAIService {
	private client: Anthropic;

	constructor() {
		this.client = new Anthropic({
			apiKey: process.env.CLAUDE_API_KEY,
		});
	}

	async generateBotFlow(prompt: string, context?: BotContext): Promise<BotFlow> {
		const systemPrompt = `You are an expert bot flow designer for WhatsApp.
    Create structured, user-friendly conversation flows that follow WhatsApp best practices.

    Context: ${JSON.stringify(context)}

    Return a JSON structure with nodes, edges, and configurations.`;

		const response = await this.client.messages.create({
			model: 'claude-sonnet-4-20250514',
			max_tokens: 4000,
			temperature: 0.7,
			system: systemPrompt,
			messages: [
				{
					role: 'user',
					content: prompt,
				},
			],
		});

		return this.parseBotFlowResponse(response.content);
	}

	async generateIntent(userMessage: string, existingIntents: Intent[]): Promise<Intent> {
		const prompt = `Analyze this user message and suggest an intent:

    User Message: "${userMessage}"

    Existing Intents: ${existingIntents.map((i) => i.name).join(', ')}

    Return JSON with: name, description, examples, entities`;

		// Implementation
	}

	async enhanceResponse(baseResponse: string, context: ConversationContext): Promise<string> {
		// Use Claude to make responses more natural and contextual
	}

	async extractEntities(message: string, schema: EntitySchema): Promise<ExtractedEntities> {
		// Use Claude for intelligent entity extraction
	}
}
```

### 2.2 AI-Powered Features Implementation

#### 2.2.1 Natural Language Bot Builder

```typescript
interface BotCreationPrompt {
	description: string;
	businessType: string;
	goals: string[];
	sampleConversations?: string[];
}

class AINaturalLanguageBotBuilder {
	async createBotFromPrompt(prompt: BotCreationPrompt): Promise<Bot> {
		// Step 1: Generate bot structure
		const botStructure = await this.aiService.generateBotFlow(
			`Create a WhatsApp bot for ${prompt.businessType}.

       Goals: ${prompt.goals.join(', ')}
       Description: ${prompt.description}

       Include:
       - Welcome flow
       - Main menu
       - FAQ handling
       - Escalation to human
       - Appropriate intents and responses`,
			{
				businessType: prompt.businessType,
				requirements: prompt.goals,
			}
		);

		// Step 2: Generate intents from description
		const intents = await this.generateIntents(prompt);

		// Step 3: Create responses
		const responses = await this.generateResponses(intents, prompt);

		// Step 4: Build complete bot configuration
		return {
			id: generateId(),
			name: `${prompt.businessType} Bot`,
			structure: botStructure,
			intents,
			responses,
			createdAt: new Date(),
			status: 'draft',
		};
	}

	private async generateIntents(prompt: BotCreationPrompt): Promise<Intent[]> {
		// Use Claude to generate relevant intents based on business type
		const intentPrompt = `For a ${prompt.businessType} business with goals:
    ${prompt.goals.join('\n')}

    Generate 10-15 common customer intents with:
    - Intent name
    - Training phrases (5-10 per intent)
    - Required entities
    - Response templates`;

		const response = await this.aiService.generateIntents(intentPrompt);
		return response;
	}
}
```

#### 2.2.2 Intent Recognition Engine

```typescript
class IntentRecognitionEngine {
	private intentCache: Map<string, Intent[]> = new Map();

	async recognizeIntent(message: string, botId: string, context: ConversationContext): Promise<IntentResult> {
		// Get bot intents (cached)
		const intents = await this.getIntents(botId);

		// Use Claude for intent recognition
		const prompt = `Given this user message: "${message}"

    And conversation context:
    Previous messages: ${context.history
		.slice(-3)
		.map((m) => m.content)
		.join('\n')}
    User attributes: ${JSON.stringify(context.userAttributes)}

    Match to one of these intents:
    ${intents.map((i) => `- ${i.name}: ${i.description}`).join('\n')}

    Return JSON: { intent: string, confidence: number, entities: object }`;

		const result = await this.aiService.recognizeIntent(prompt);

		return {
			intent: result.intent,
			confidence: result.confidence,
			entities: result.entities,
			fallback: result.confidence < 0.6,
		};
	}

	async trainIntentModel(botId: string, trainingData: TrainingExample[]): Promise<void> {
		// Use Claude for few-shot learning
		// Store enhanced intent models
	}
}
```

#### 2.2.3 Smart Response Generation

```typescript
class SmartResponseGenerator {
	async generateResponse(
		intent: Intent,
		entities: any,
		context: ConversationContext,
		botPersonality: BotPersonality
	): Promise<GeneratedResponse> {
		const prompt = `Generate a WhatsApp message response for:

    Intent: ${intent.name}
    Entities: ${JSON.stringify(entities)}
    User name: ${context.userName}
    Conversation history: ${context.history
		.slice(-3)
		.map((m) => m.content)
		.join('\n')}

    Bot personality:
    - Tone: ${botPersonality.tone}
    - Formality: ${botPersonality.formality}
    - Brand voice: ${botPersonality.brandVoice}

    Requirements:
    - Natural and conversational
    - Under 1000 characters
    - Include relevant emojis if appropriate
    - Personalized to the user
    - Suggest next steps or quick replies`;

		const response = await this.aiService.generateResponse(prompt);

		return {
			text: response.text,
			quickReplies: response.suggestedActions,
			nextNode: this.determineNextNode(intent, entities),
		};
	}
}
```

#### 2.2.4 Flow Optimization Analyzer

```typescript
class FlowOptimizationAnalyzer {
	async analyzeFlowPerformance(botId: string): Promise<OptimizationSuggestions> {
		// Get analytics data
		const analytics = await this.analyticsService.getBotAnalytics(botId);
		const conversations = await this.getConversationSamples(botId, 1000);

		const prompt = `Analyze this WhatsApp bot performance data:

    Metrics:
    - Completion rate: ${analytics.completionRate}%
    - Average messages per conversation: ${analytics.avgMessages}
    - Fallback rate: ${analytics.fallbackRate}%
    - Top drop-off points: ${analytics.dropOffPoints.join(', ')}

    Sample conversations:
    ${conversations
		.slice(0, 10)
		.map((c) => c.summary)
		.join('\n---\n')}

    Provide:
    1. Identified bottlenecks
    2. Suggested flow improvements
    3. Missing intents to add
    4. Response improvements
    5. Priority ranking of changes`;

		const suggestions = await this.aiService.analyzeFlow(prompt);

		return suggestions;
	}
}
```

---

## 3. Core Components

### 3.1 Bot Builder Component Architecture

```typescript
// React Component Structure
interface BotBuilderProps {
	botId?: string;
	mode: 'create' | 'edit';
}

const BotBuilder: React.FC<BotBuilderProps> = ({ botId, mode }) => {
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);

	return (
		<div className="bot-builder">
			<BuilderToolbar />
			<div className="builder-main">
				<NodePalette />
				<FlowCanvas
					nodes={nodes}
					edges={edges}
					onNodesChange={setNodes}
					onEdgesChange={setEdges}
					onNodeSelect={setSelectedNode}
				/>
				<PropertyPanel node={selectedNode} />
			</div>
		</div>
	);
};

// Flow Canvas using ReactFlow
const FlowCanvas: React.FC<FlowCanvasProps> = ({ nodes, edges, onNodesChange, onEdgesChange, onNodeSelect }) => {
	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onNodeClick={(_, node) => onNodeSelect(node)}
			nodeTypes={customNodeTypes}
			edgeTypes={customEdgeTypes}
			fitView
		>
			<Background />
			<Controls />
			<MiniMap />
		</ReactFlow>
	);
};

// Custom Node Types
const customNodeTypes = {
	messageNode: MessageNode,
	conditionNode: ConditionNode,
	apiNode: APINode,
	actionNode: ActionNode,
	aiNode: AINode,
};

// Message Node Component
const MessageNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
	return (
		<div className="message-node">
			<Handle type="target" position={Position.Top} isConnectable={isConnectable} />
			<div className="node-content">
				<div className="node-icon">💬</div>
				<div className="node-label">{data.label}</div>
				{data.preview && <div className="node-preview">{truncate(data.preview, 50)}</div>}
			</div>
			<Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
		</div>
	);
};
```

### 3.2 Node Configuration Components

```typescript
// Property Panel for Node Configuration
const PropertyPanel: React.FC<{ node: Node | null }> = ({ node }) => {
	if (!node) return <EmptyState />;

	const renderConfigPanel = () => {
		switch (node.type) {
			case 'messageNode':
				return <MessageNodeConfig node={node} />;
			case 'conditionNode':
				return <ConditionNodeConfig node={node} />;
			case 'apiNode':
				return <APINodeConfig node={node} />;
			case 'aiNode':
				return <AINodeConfig node={node} />;
			default:
				return null;
		}
	};

	return (
		<div className="property-panel">
			<h3>{node.data.label}</h3>
			{renderConfigPanel()}
		</div>
	);
};

// Message Node Configuration
const MessageNodeConfig: React.FC<{ node: Node }> = ({ node }) => {
	const [messageType, setMessageType] = useState(node.data.messageType || 'text');
	const [content, setContent] = useState(node.data.content || '');
	const [variables, setVariables] = useState(node.data.variables || []);

	return (
		<div className="message-config">
			<FormGroup>
				<Label>Message Type</Label>
				<Select value={messageType} onChange={setMessageType}>
					<option value="text">Text</option>
					<option value="image">Image</option>
					<option value="video">Video</option>
					<option value="document">Document</option>
					<option value="template">Template</option>
				</Select>
			</FormGroup>

			{messageType === 'text' && (
				<FormGroup>
					<Label>Message Content</Label>
					<RichTextEditor
						value={content}
						onChange={setContent}
						placeholder="Enter your message..."
						features={['bold', 'italic', 'emoji', 'variables']}
					/>
					<VariableInserter variables={variables} onInsert={insertVariable} />
				</FormGroup>
			)}

			{messageType === 'template' && (
				<TemplateSelector selected={node.data.templateId} onSelect={handleTemplateSelect} />
			)}

			<ButtonConfiguration buttons={node.data.buttons} onChange={updateButtons} />
		</div>
	);
};

// AI-Enhanced Message Suggestions
const AIMessageSuggester: React.FC = () => {
	const [context, setContext] = useState('');
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const getSuggestions = async () => {
		setLoading(true);
		const result = await aiService.suggestMessages(context);
		setSuggestions(result);
		setLoading(false);
	};

	return (
		<div className="ai-suggester">
			<TextArea placeholder="Describe what you want to say..." value={context} onChange={setContext} />
			<Button onClick={getSuggestions} loading={loading}>
				✨ Generate with AI
			</Button>
			{suggestions.length > 0 && (
				<div className="suggestions">
					{suggestions.map((suggestion, idx) => (
						<SuggestionCard key={idx} text={suggestion} onUse={() => usesuggestion(suggestion)} />
					))}
				</div>
			)}
		</div>
	);
};
```

---

## 4. WhatsApp API Integration

### 4.1 WhatsApp Client Wrapper

```typescript
class WhatsAppClient {
	private baseURL: string;
	private phoneNumberId: string;
	private accessToken: string;

	constructor(config: WhatsAppConfig) {
		this.baseURL = `https://graph.facebook.com/${config.apiVersion}`;
		this.phoneNumberId = config.phoneNumberId;
		this.accessToken = config.accessToken;
	}

	async sendMessage(to: string, message: WhatsAppMessage): Promise<MessageResponse> {
		const endpoint = `${this.baseURL}/${this.phoneNumberId}/messages`;

		const payload = this.formatMessagePayload(to, message);

		try {
			const response = await axios.post(endpoint, payload, {
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			return {
				success: true,
				messageId: response.data.messages[0].id,
				wabaId: response.data.contacts[0].wa_id,
			};
		} catch (error) {
			return this.handleError(error);
		}
	}

	async sendTextMessage(to: string, text: string, options?: MessageOptions): Promise<MessageResponse> {
		return this.sendMessage(to, {
			type: 'text',
			text: { body: text },
			...options,
		});
	}

	async sendTemplateMessage(
		to: string,
		templateName: string,
		language: string,
		components: TemplateComponent[]
	): Promise<MessageResponse> {
		return this.sendMessage(to, {
			type: 'template',
			template: {
				name: templateName,
				language: { code: language },
				components,
			},
		});
	}

	async sendInteractiveMessage(to: string, interactive: InteractiveMessage): Promise<MessageResponse> {
		return this.sendMessage(to, {
			type: 'interactive',
			interactive,
		});
	}

	async sendMediaMessage(
		to: string,
		mediaType: 'image' | 'video' | 'document' | 'audio',
		mediaId: string,
		caption?: string
	): Promise<MessageResponse> {
		return this.sendMessage(to, {
			type: mediaType,
			[mediaType]: {
				id: mediaId,
				caption,
			},
		});
	}

	async uploadMedia(file: Buffer, mimeType: string): Promise<string> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('type', mimeType);
		formData.append('messaging_product', 'whatsapp');

		const response = await axios.post(`${this.baseURL}/${this.phoneNumberId}/media`, formData, {
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				...formData.getHeaders(),
			},
		});

		return response.data.id;
	}

	async getMediaUrl(mediaId: string): Promise<string> {
		const response = await axios.get(`${this.baseURL}/${mediaId}`, {
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
			},
		});

		return response.data.url;
	}

	async downloadMedia(url: string): Promise<Buffer> {
		const response = await axios.get(url, {
			responseType: 'arraybuffer',
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
			},
		});

		return Buffer.from(response.data);
	}

	async markAsRead(messageId: string): Promise<void> {
		await axios.post(
			`${this.baseURL}/${this.phoneNumberId}/messages`,
			{
				messaging_product: 'whatsapp',
				status: 'read',
				message_id: messageId,
			},
			{
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);
	}

	private formatMessagePayload(to: string, message: WhatsAppMessage): any {
		return {
			messaging_product: 'whatsapp',
			recipient_type: 'individual',
			to: to.replace('+', ''),
			...message,
		};
	}

	private handleError(error: any): MessageResponse {
		console.error('WhatsApp API Error:', error.response?.data || error);
		return {
			success: false,
			error: error.response?.data?.error?.message || 'Unknown error',
		};
	}
}
```

### 4.2 Webhook Handler

```typescript
class WhatsAppWebhookHandler {
	private botEngine: BotEngine;
	private messageQueue: MessageQueue;

	async handleWebhook(req: Request, res: Response): Promise<void> {
		// Verify webhook
		if (req.method === 'GET') {
			return this.verifyWebhook(req, res);
		}

		// Process webhook payload
		const payload = req.body;

		// Quick response
		res.sendStatus(200);

		// Async processing
		await this.processWebhookAsync(payload);
	}

	private verifyWebhook(req: Request, res: Response): void {
		const mode = req.query['hub.mode'];
		const token = req.query['hub.verify_token'];
		const challenge = req.query['hub.challenge'];

		if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
			res.status(200).send(challenge);
		} else {
			res.sendStatus(403);
		}
	}

	private async processWebhookAsync(payload: any): Promise<void> {
		try {
			if (payload.object !== 'whatsapp_business_account') return;

			for (const entry of payload.entry) {
				for (const change of entry.changes) {
					if (change.field === 'messages') {
						await this.handleMessageEvent(change.value);
					} else if (change.field === 'message_template_status_update') {
						await this.handleTemplateStatusUpdate(change.value);
					}
				}
			}
		} catch (error) {
			console.error('Webhook processing error:', error);
			await this.logError(error);
		}
	}

	private async handleMessageEvent(value: any): Promise<void> {
		const { metadata, contacts, messages, statuses } = value;

		if (messages && messages.length > 0) {
			for (const message of messages) {
				await this.processIncomingMessage(message, metadata, contacts[0]);
			}
		}

		if (statuses && statuses.length > 0) {
			for (const status of statuses) {
				await this.processMessageStatus(status);
			}
		}
	}

	private async processIncomingMessage(message: any, metadata: any, contact: any): Promise<void> {
		// Add to processing queue
		await this.messageQueue.add({
			messageId: message.id,
			from: message.from,
			timestamp: message.timestamp,
			type: message.type,
			content: this.extractMessageContent(message),
			phoneNumberId: metadata.phone_number_id,
			displayPhoneNumber: metadata.display_phone_number,
			contactName: contact.profile.name,
		});
	}

	private extractMessageContent(message: any): any {
		switch (message.type) {
			case 'text':
				return { text: message.text.body };
			case 'image':
				return {
					mediaId: message.image.id,
					mimeType: message.image.mime_type,
					caption: message.image.caption,
				};
			case 'video':
				return {
					mediaId: message.video.id,
					mimeType: message.video.mime_type,
					caption: message.video.caption,
				};
			case 'document':
				return {
					mediaId: message.document.id,
					mimeType: message.document.mime_type,
					filename: message.document.filename,
					caption: message.document.caption,
				};
			case 'audio':
				return {
					mediaId: message.audio.id,
					mimeType: message.audio.mime_type,
				};
			case 'location':
				return {
					latitude: message.location.latitude,
					longitude: message.location.longitude,
					name: message.location.name,
					address: message.location.address,
				};
			case 'interactive':
				return this.extractInteractiveResponse(message.interactive);
			default:
				return {};
		}
	}

	private extractInteractiveResponse(interactive: any): any {
		if (interactive.type === 'button_reply') {
			return {
				buttonId: interactive.button_reply.id,
				buttonText: interactive.button_reply.title,
			};
		} else if (interactive.type === 'list_reply') {
			return {
				listId: interactive.list_reply.id,
				listTitle: interactive.list_reply.title,
				listDescription: interactive.list_reply.description,
			};
		}
		return {};
	}
}
```

### 4.3 Message Processing Queue

```typescript
class MessageProcessor {
	private botEngine: BotEngine;
	private conversationManager: ConversationManager;
	private whatsappClient: WhatsAppClient;

	async processMessage(queuedMessage: QueuedMessage): Promise<void> {
		try {
			// Get or create conversation
			const conversation = await this.conversationManager.getOrCreateConversation(
				queuedMessage.from,
				queuedMessage.phoneNumberId
			);

			// Store incoming message
			await this.conversationManager.addMessage(conversation.id, {
				direction: 'incoming',
				type: queuedMessage.type,
				content: queuedMessage.content,
				timestamp: new Date(parseInt(queuedMessage.timestamp) * 1000),
			});

			// Check if bot should handle
			const shouldBotHandle = await this.shouldBotHandle(conversation);

			if (shouldBotHandle) {
				await this.botEngine.processMessage(conversation, queuedMessage);
			} else {
				// Route to inbox for human agent
				await this.routeToInbox(conversation, queuedMessage);
			}

			// Mark as read
			await this.whatsappClient.markAsRead(queuedMessage.messageId);
		} catch (error) {
			console.error('Message processing error:', error);
			await this.handleProcessingError(queuedMessage, error);
		}
	}

	private async shouldBotHandle(conversation: Conversation): Promise<boolean> {
		// Check if conversation is assigned to agent
		if (conversation.assignedTo) return false;

		// Check bot availability (business hours, etc.)
		const botAvailable = await this.checkBotAvailability(conversation);
		if (!botAvailable) return false;

		// Check if bot is enabled
		return conversation.bot && conversation.bot.enabled;
	}
}
```

---

## 5. Bot Builder Implementation

### 5.1 Bot Execution Engine

```typescript
class BotEngine {
	private conversationContext: Map<string, ConversationContext> = new Map();
	private aiService: ClaudeAIService;

	async processMessage(conversation: Conversation, message: QueuedMessage): Promise<void> {
		// Get or initialize context
		const context = this.getContext(conversation.id);

		// Update context with new message
		context.history.push({
			role: 'user',
			content: message.content.text || JSON.stringify(message.content),
			timestamp: new Date(),
		});

		// Get bot configuration
		const bot = await this.getBotConfig(conversation.botId);

		// Determine current node
		const currentNode = context.currentNode || bot.entryNode;

		// Execute node
		const result = await this.executeNode(currentNode, message, context, bot);

		// Handle result
		await this.handleNodeResult(result, conversation, context);
	}

	private async executeNode(
		node: BotNode,
		message: QueuedMessage,
		context: ConversationContext,
		bot: BotConfig
	): Promise<NodeExecutionResult> {
		switch (node.type) {
			case 'message':
				return await this.executeMessageNode(node, context);

			case 'condition':
				return await this.executeConditionNode(node, message, context);

			case 'ai':
				return await this.executeAINode(node, message, context, bot);

			case 'api':
				return await this.executeAPINode(node, context);

			case 'action':
				return await this.executeActionNode(node, context);

			default:
				throw new Error(`Unknown node type: ${node.type}`);
		}
	}

	private async executeMessageNode(node: MessageNode, context: ConversationContext): Promise<NodeExecutionResult> {
		// Process message with variables
		const processedMessage = this.processVariables(node.content, context.variables);

		// Build WhatsApp message
		const whatsappMessage = this.buildWhatsAppMessage(node, processedMessage);

		// Send message
		await this.sendMessage(context.phoneNumber, whatsappMessage);

		// Update context
		context.history.push({
			role: 'assistant',
			content: processedMessage,
			timestamp: new Date(),
		});

		return {
			nextNode: node.nextNode,
			waitForResponse: node.waitForResponse,
		};
	}

	private async executeConditionNode(
		node: ConditionNode,
		message: QueuedMessage,
		context: ConversationContext
	): Promise<NodeExecutionResult> {
		// Evaluate conditions
		for (const condition of node.conditions) {
			if (await this.evaluateCondition(condition, message, context)) {
				return {
					nextNode: condition.nextNode,
					waitForResponse: false,
				};
			}
		}

		// Default path
		return {
			nextNode: node.defaultNext,
			waitForResponse: false,
		};
	}

	private async executeAINode(
		node: AINode,
		message: QueuedMessage,
		context: ConversationContext,
		bot: BotConfig
	): Promise<NodeExecutionResult> {
		// Use AI to generate response
		const aiResponse = await this.aiService.generateResponse(node.prompt, {
			message: message.content.text,
			context: context.history,
			userInfo: context.userAttributes,
			botPersonality: bot.personality,
		});

		// Send AI-generated response
		await this.sendMessage(context.phoneNumber, {
			type: 'text',
			text: { body: aiResponse.text },
		});

		// Store in context
		context.history.push({
			role: 'assistant',
			content: aiResponse.text,
			timestamp: new Date(),
		});

		// Extract any entities from user message
		if (node.extractEntities) {
			const entities = await this.aiService.extractEntities(message.content.text, node.entitySchema);
			Object.assign(context.variables, entities);
		}

		return {
			nextNode: node.nextNode,
			waitForResponse: true,
		};
	}

	private async executeAPINode(node: APINode, context: ConversationContext): Promise<NodeExecutionResult> {
		try {
			// Build API request
			const request = this.buildAPIRequest(node, context);

			// Execute API call
			const response = await axios(request);

			// Store response in variables
			if (node.responseMapping) {
				this.mapResponseToVariables(response.data, node.responseMapping, context.variables);
			}

			return {
				nextNode: node.successNode,
				waitForResponse: false,
			};
		} catch (error) {
			console.error('API call failed:', error);
			return {
				nextNode: node.errorNode,
				waitForResponse: false,
			};
		}
	}

	private async executeActionNode(node: ActionNode, context: ConversationContext): Promise<NodeExecutionResult> {
		// Execute actions
		for (const action of node.actions) {
			await this.executeAction(action, context);
		}

		return {
			nextNode: node.nextNode,
			waitForResponse: false,
		};
	}

	private async evaluateCondition(
		condition: Condition,
		message: QueuedMessage,
		context: ConversationContext
	): Promise<boolean> {
		switch (condition.type) {
			case 'keyword':
				return this.matchKeyword(message.content.text, condition.keywords);

			case 'variable':
				return this.compareVariable(context.variables[condition.variable], condition.operator, condition.value);

			case 'intent':
				const intent = await this.aiService.recognizeIntent(message.content.text, context);
				return intent.intent === condition.intent && intent.confidence > 0.7;

			default:
				return false;
		}
	}

	private processVariables(content: string, variables: Record<string, any>): string {
		return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
			return variables[key] || match;
		});
	}
}
```

---

## 6. AI-Powered Features

### 6.1 Smart Campaign Optimization

```typescript
class CampaignOptimizer {
	async optimizeCampaignTiming(campaignId: string): Promise<OptimalTiming> {
		const campaign = await this.getCampaign(campaignId);
		const historicalData = await this.getHistoricalPerformance(campaign);

		const prompt = `Analyze campaign performance data and suggest optimal send times:

    Historical open rates by hour: ${JSON.stringify(historicalData.openRatesByHour)}
    Historical open rates by day: ${JSON.stringify(historicalData.openRatesByDay)}
    Target audience timezone: ${campaign.timezone}
    Campaign type: ${campaign.type}

    Suggest:
    1. Best time of day (hour)
    2. Best day of week
    3. Confidence level
    4. Reasoning`;

		const result = await this.aiService.optimizeTime(prompt);
		return result;
	}

	async generateCampaignVariants(baseTemplate: string, count: number): Promise<string[]> {
		const prompt = `Create ${count} variants of this WhatsApp campaign message:

    Original: "${baseTemplate}"

    Requirements:
    - Keep under 1000 characters
    - Maintain core message
    - Vary tone, structure, and wording
    - Include relevant emojis
    - Make each variant distinct for A/B testing`;

		const variants = await this.aiService.generateVariants(prompt);
		return variants;
	}
}
```

### 6.2 Intelligent Contact Segmentation

```typescript
class AISegmentationEngine {
	async suggestSegments(contactData: ContactData[]): Promise<SegmentSuggestion[]> {
		// Analyze contact attributes and behavior
		const analysis = this.analyzeContactPatterns(contactData);

		const prompt = `Based on this customer data analysis, suggest 5-7 valuable segments:

    Total contacts: ${contactData.length}
    Common attributes: ${analysis.attributes.join(', ')}
    Behavior patterns: ${JSON.stringify(analysis.behaviors)}
    Purchase patterns: ${JSON.stringify(analysis.purchases)}
    Engagement levels: ${JSON.stringify(analysis.engagement)}

    For each segment suggest:
    - Name
    - Definition (conditions)
    - Size estimate
    - Marketing opportunity
    - Priority`;

		const suggestions = await this.aiService.suggestSegments(prompt);
		return suggestions;
	}

	async autoSegmentContact(contact: Contact): Promise<string[]> {
		// Use AI to automatically assign segments based on contact data
		const contactSummary = this.summarizeContact(contact);

		const segments = await this.aiService.categorizeContact(contactSummary);
		return segments;
	}
}
```

---

## 7. Real-time Communication

### 7.1 WebSocket Server

```typescript
class WebSocketServer {
	private io: SocketIO.Server;
	private redis: RedisClient;

	constructor(server: HttpServer) {
		this.io = new SocketIO.Server(server, {
			cors: {
				origin: process.env.CLIENT_URL,
				credentials: true,
			},
		});

		this.setupMiddleware();
		this.setupEventHandlers();
	}

	private setupMiddleware() {
		this.io.use(async (socket, next) => {
			try {
				// Authenticate socket connection
				const token = socket.handshake.auth.token;
				const user = await this.verifyToken(token);
				socket.data.user = user;
				next();
			} catch (error) {
				next(new Error('Authentication failed'));
			}
		});
	}

	private setupEventHandlers() {
		this.io.on('connection', (socket) => {
			console.log(`User connected: ${socket.data.user.id}`);

			// Join user-specific room
			socket.join(`user:${socket.data.user.id}`);

			// Join organization room
			socket.join(`org:${socket.data.user.organizationId}`);

			// Handle incoming message events
			socket.on('message:send', async (data) => {
				await this.handleSendMessage(socket, data);
			});

			// Handle typing indicators
			socket.on('typing:start', (conversationId) => {
				socket.to(`conversation:${conversationId}`).emit('typing:start', {
					userId: socket.data.user.id,
					userName: socket.data.user.name,
				});
			});

			socket.on('typing:stop', (conversationId) => {
				socket.to(`conversation:${conversationId}`).emit('typing:stop', {
					userId: socket.data.user.id,
				});
			});

			// Handle conversation events
			socket.on('conversation:join', (conversationId) => {
				socket.join(`conversation:${conversationId}`);
			});

			socket.on('conversation:leave', (conversationId) => {
				socket.leave(`conversation:${conversationId}`);
			});

			// Handle disconnection
			socket.on('disconnect', () => {
				console.log(`User disconnected: ${socket.data.user.id}`);
			});
		});
	}

	// Emit to specific user
	emitToUser(userId: string, event: string, data: any) {
		this.io.to(`user:${userId}`).emit(event, data);
	}

	// Emit to organization
	emitToOrganization(orgId: string, event: string, data: any) {
		this.io.to(`org:${orgId}`).emit(event, data);
	}

	// Emit to conversation participants
	emitToConversation(conversationId: string, event: string, data: any) {
		this.io.to(`conversation:${conversationId}`).emit(event, data);
	}
}
```

### 7.2 Real-time Message Synchronization

```typescript
class RealtimeMessageSync {
	constructor(private wsServer: WebSocketServer, private messageQueue: MessageQueue) {
		this.setupMessageHandlers();
	}

	private setupMessageHandlers() {
		// Listen for new messages from WhatsApp
		this.messageQueue.on('message:received', async (message) => {
			await this.syncMessageToClients(message);
		});

		// Listen for message status updates
		this.messageQueue.on('status:updated', async (status) => {
			await this.syncStatusToClients(status);
		});
	}

	private async syncMessageToClients(message: Message) {
		const conversation = await this.getConversation(message.conversationId);

		// Emit to all relevant clients
		this.wsServer.emitToConversation(conversation.id, 'message:new', {
			message,
			conversation,
		});

		// Emit to organization for inbox updates
		this.wsServer.emitToOrganization(conversation.organizationId, 'inbox:update', {
			conversationId: conversation.id,
			unreadCount: conversation.unreadCount + 1,
		});

		// Emit to assigned agent if any
		if (conversation.assignedTo) {
			this.wsServer.emitToUser(conversation.assignedTo, 'notification:new', {
				type: 'new_message',
				conversationId: conversation.id,
				message: message.content,
			});
		}
	}
}
```

---

## 8. Data Models

### 8.1 Core Entities

```typescript
// User & Organization
interface User {
	id: string;
	email: string;
	name: string;
	role: 'admin' | 'agent' | 'viewer';
	organizationId: string;
	permissions: string[];
	createdAt: Date;
	lastLoginAt: Date;
}

interface Organization {
	id: string;
	name: string;
	slug: string;
	plan: 'free' | 'starter' | 'professional' | 'enterprise';
	whatsappAccounts: WhatsAppAccount[];
	settings: OrganizationSettings;
	createdAt: Date;
}

interface WhatsAppAccount {
	id: string;
	wabaId: string;
	phoneNumberId: string;
	displayPhoneNumber: string;
	accessToken: string; // encrypted
	businessProfile: BusinessProfile;
	status: 'active' | 'pending' | 'suspended';
	messageLimit: number;
	createdAt: Date;
}

// Bot Configuration
interface Bot {
	id: string;
	name: string;
	description: string;
	organizationId: string;
	whatsappAccountId: string;
	status: 'draft' | 'active' | 'paused';
	entryNode: string;
	nodes: BotNode[];
	edges: BotEdge[];
	personality: BotPersonality;
	intents: Intent[];
	variables: Variable[];
	settings: BotSettings;
	analytics: BotAnalytics;
	createdAt: Date;
	updatedAt: Date;
}

interface BotNode {
	id: string;
	type: 'message' | 'condition' | 'ai' | 'api' | 'action';
	label: string;
	position: { x: number; y: number };
	data: NodeData;
}

interface MessageNode extends BotNode {
	type: 'message';
	data: {
		messageType: 'text' | 'image' | 'video' | 'template' | 'interactive';
		content: string;
		media?: MediaContent;
		buttons?: Button[];
		variables?: string[];
		waitForResponse: boolean;
		nextNode?: string;
	};
}

interface AINode extends BotNode {
	type: 'ai';
	data: {
		prompt: string;
		model: string;
		temperature: number;
		maxTokens: number;
		extractEntities: boolean;
		entitySchema?: EntitySchema;
		nextNode?: string;
	};
}

interface ConditionNode extends BotNode {
	type: 'condition';
	data: {
		conditions: Condition[];
		defaultNext?: string;
	};
}

interface Condition {
	id: string;
	type: 'keyword' | 'variable' | 'intent' | 'regex';
	operator?: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
	value: any;
	nextNode: string;
}

// Intent
interface Intent {
	id: string;
	name: string;
	description: string;
	trainingPhrases: string[];
	entities: Entity[];
	responses: Response[];
	confidence: number;
}

interface Entity {
	id: string;
	name: string;
	type: 'system' | 'custom';
	values: string[];
	synonyms: Record<string, string[]>;
}

// Conversation
interface Conversation {
	id: string;
	organizationId: string;
	whatsappAccountId: string;
	phoneNumber: string;
	contactId: string;
	botId?: string;
	assignedTo?: string;
	status: 'open' | 'pending' | 'resolved' | 'closed';
	tags: string[];
	messages: Message[];
	context: ConversationContext;
	metadata: Record<string, any>;
	createdAt: Date;
	updatedAt: Date;
	lastMessageAt: Date;
}

interface Message {
	id: string;
	conversationId: string;
	direction: 'incoming' | 'outgoing';
	type: string;
	content: any;
	status: 'sent' | 'delivered' | 'read' | 'failed';
	sentBy?: string; // userId for agent messages
	timestamp: Date;
}

interface ConversationContext {
	currentNode?: string;
	variables: Record<string, any>;
	history: ContextMessage[];
	userAttributes: Record<string, any>;
}

// Template
interface Template {
	id: string;
	name: string;
	category: 'marketing' | 'utility' | 'authentication';
	language: string;
	status: 'draft' | 'pending' | 'approved' | 'rejected';
	components: TemplateComponent[];
	rejectionReason?: string;
	organizationId: string;
	whatsappAccountId: string;
	createdAt: Date;
	approvedAt?: Date;
}

interface TemplateComponent {
	type: 'header' | 'body' | 'footer' | 'buttons';
	format?: 'text' | 'image' | 'video' | 'document' | 'location';
	text?: string;
	buttons?: TemplateButton[];
	variables?: string[];
}

// Campaign
interface Campaign {
	id: string;
	name: string;
	description: string;
	organizationId: string;
	templateId: string;
	audienceSegmentId: string;
	status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
	scheduledAt?: Date;
	sentCount: number;
	deliveredCount: number;
	readCount: number;
	clickCount: number;
	conversionCount: number;
	budget?: number;
	spent: number;
	createdAt: Date;
	completedAt?: Date;
}

// WhatsApp Flow
interface WhatsAppFlow {
	id: string;
	name: string;
	description: string;
	category: string;
	organizationId: string;
	status: 'draft' | 'published';
	version: number;
	screens: FlowScreen[];
	dataEndpoint?: string;
	analytics: FlowAnalytics;
	createdAt: Date;
	publishedAt?: Date;
}

interface FlowScreen {
	id: string;
	title: string;
	layout: 'single' | 'form';
	components: FlowComponent[];
	navigationButtons: NavigationButton[];
}

interface FlowComponent {
	type: 'text-input' | 'text-area' | 'radio' | 'checkbox' | 'dropdown' | 'date' | 'time';
	name: string;
	label: string;
	required: boolean;
	validation?: ValidationRule;
	options?: Option[];
}
```

---

## 9. State Management

### 9.1 Redux Store Structure

```typescript
// Store configuration
const store = configureStore({
	reducer: {
		auth: authReducer,
		bots: botsReducer,
		conversations: conversationsReducer,
		templates: templatesReducer,
		campaigns: campaignsReducer,
		contacts: contactsReducer,
		analytics: analyticsReducer,
		ui: uiReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}).concat(sagaMiddleware, loggerMiddleware),
});

// Bot Builder State
interface BotBuilderState {
	currentBot: Bot | null;
	nodes: Node[];
	edges: Edge[];
	selectedNode: Node | null;
	clipboard: Node | null;
	history: {
		past: BotSnapshot[];
		future: BotSnapshot[];
	};
	isDirty: boolean;
	isSaving: boolean;
	validationErrors: ValidationError[];
}

// Actions
const botBuilderActions = {
	// Node operations
	addNode: createAction<Node>('bot/addNode'),
	updateNode: createAction<{ id: string; data: Partial<Node> }>('bot/updateNode'),
	deleteNode: createAction<string>('bot/deleteNode'),

	// Edge operations
	addEdge: createAction<Edge>('bot/addEdge'),
	deleteEdge: createAction<string>('bot/deleteEdge'),

	// Selection
	selectNode: createAction<string>('bot/selectNode'),
	deselectNode: createAction('bot/deselectNode'),

	// History
	undo: createAction('bot/undo'),
	redo: createAction('bot/redo'),

	// Persistence
	saveBot: createAsyncThunk('bot/save', async (bot: Bot) => {
		const response = await api.saveBotConfig(bot);
		return response;
	}),

	// AI features
	generateBotFromPrompt: createAsyncThunk('bot/generateFromPrompt', async (prompt: string) => {
		const response = await api.generateBot(prompt);
		return response;
	}),
};
```

### 9.2 React Query for Server State

```typescript
// Custom hooks for data fetching
function useBots() {
	return useQuery({
		queryKey: ['bots'],
		queryFn: api.getBots,
		staleTime: 60000, // 1 minute
	});
}

function useBot(botId: string) {
	return useQuery({
		queryKey: ['bots', botId],
		queryFn: () => api.getBot(botId),
		enabled: !!botId,
	});
}

function useCreateBot() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.createBot,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['bots'] });
		},
	});
}

function useUpdateBot() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Bot> }) => api.updateBot(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['bots', variables.id] });
			queryClient.invalidateQueries({ queryKey: ['bots'] });
		},
	});
}

// Conversations
function useConversations(filters?: ConversationFilters) {
	return useInfiniteQuery({
		queryKey: ['conversations', filters],
		queryFn: ({ pageParam = 0 }) => api.getConversations({ ...filters, offset: pageParam }),
		getNextPageParam: (lastPage) => lastPage.nextOffset,
	});
}

function useSendMessage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.sendMessage,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['conversations', variables.conversationId],
			});
		},
	});
}
```

---

## 10. Security Implementation

### 10.1 Authentication & Authorization

```typescript
// JWT Authentication
class AuthService {
	async login(email: string, password: string): Promise<AuthResponse> {
		// Verify credentials
		const user = await this.verifyCredentials(email, password);

		if (!user) {
			throw new UnauthorizedError('Invalid credentials');
		}

		// Generate tokens
		const accessToken = this.generateAccessToken(user);
		const refreshToken = this.generateRefreshToken(user);

		// Store refresh token
		await this.storeRefreshToken(user.id, refreshToken);

		return {
			user,
			accessToken,
			refreshToken,
		};
	}

	private generateAccessToken(user: User): string {
		return jwt.sign(
			{
				userId: user.id,
				email: user.email,
				role: user.role,
				organizationId: user.organizationId,
			},
			process.env.JWT_SECRET!,
			{
				expiresIn: '15m',
				issuer: 'botpe-api',
				audience: 'botpe-client',
			}
		);
	}

	private generateRefreshToken(user: User): string {
		return jwt.sign(
			{
				userId: user.id,
				tokenVersion: user.tokenVersion,
			},
			process.env.REFRESH_TOKEN_SECRET!,
			{
				expiresIn: '7d',
			}
		);
	}

	async refreshAccessToken(refreshToken: string): Promise<string> {
		try {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;

			const user = await this.getUserById(decoded.userId);

			if (!user || user.tokenVersion !== decoded.tokenVersion) {
				throw new Error('Invalid refresh token');
			}

			return this.generateAccessToken(user);
		} catch (error) {
			throw new UnauthorizedError('Invalid or expired refresh token');
		}
	}
}

// Authorization Middleware
const authorize = (requiredPermissions: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization?.split(' ')[1];

			if (!token) {
				throw new UnauthorizedError('No token provided');
			}

			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

			// Attach user to request
			req.user = await getUserById(decoded.userId);

			// Check permissions
			if (!hasPermissions(req.user, requiredPermissions)) {
				throw new ForbiddenError('Insufficient permissions');
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};

// RBAC Implementation
const permissions = {
	'bot:create': ['admin', 'agent'],
	'bot:edit': ['admin', 'agent'],
	'bot:delete': ['admin'],
	'bot:view': ['admin', 'agent', 'viewer'],
	'conversation:assign': ['admin', 'agent'],
	'conversation:view': ['admin', 'agent', 'viewer'],
	'template:create': ['admin', 'agent'],
	'campaign:create': ['admin'],
	'analytics:view': ['admin', 'agent'],
};

function hasPermissions(user: User, required: string[]): boolean {
	return required.every((permission) => permissions[permission]?.includes(user.role));
}
```

### 10.2 Data Encryption

```typescript
// Encryption utilities
class EncryptionService {
	private algorithm = 'aes-256-gcm';
	private key: Buffer;

	constructor() {
		this.key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
	}

	encrypt(text: string): string {
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

		let encrypted = cipher.update(text, 'utf8', 'hex');
		encrypted += cipher.final('hex');

		const authTag = cipher.getAuthTag();

		return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
	}

	decrypt(encryptedText: string): string {
		const [ivHex, authTagHex, encrypted] = encryptedText.split(':');

		const iv = Buffer.from(ivHex, 'hex');
		const authTag = Buffer.from(authTagHex, 'hex');

		const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
		decipher.setAuthTag(authTag);

		let decrypted = decipher.update(encrypted, 'hex', 'utf8');
		decrypted += decipher.final('utf8');

		return decrypted;
	}

	// Hash sensitive data
	hash(text: string): string {
		return crypto.createHash('sha256').update(text).digest('hex');
	}
}

// Encrypt sensitive fields before storage
const encryptionService = new EncryptionService();

// Mongoose plugin for automatic encryption
function encryptionPlugin(schema: Schema) {
	const encryptedFields = [];

	schema.eachPath((pathname, schemaType) => {
		if (schemaType.options.encrypted) {
			encryptedFields.push(pathname);
		}
	});

	schema.pre('save', function (next) {
		encryptedFields.forEach((field) => {
			if (this.isModified(field) && this[field]) {
				this[field] = encryptionService.encrypt(this[field]);
			}
		});
		next();
	});

	schema.post('init', function () {
		encryptedFields.forEach((field) => {
			if (this[field]) {
				this[field] = encryptionService.decrypt(this[field]);
			}
		});
	});
}
```

---

## 11. Testing Strategy

### 11.1 Unit Testing

```typescript
// Bot Engine Tests
describe('BotEngine', () => {
	let botEngine: BotEngine;
	let mockAIService: jest.Mocked<ClaudeAIService>;

	beforeEach(() => {
		mockAIService = {
			generateResponse: jest.fn(),
			recognizeIntent: jest.fn(),
			extractEntities: jest.fn(),
		} as any;

		botEngine = new BotEngine(mockAIService);
	});

	describe('executeMessageNode', () => {
		it('should process variables in message content', async () => {
			const node: MessageNode = {
				id: '1',
				type: 'message',
				label: 'Welcome',
				position: { x: 0, y: 0 },
				data: {
					messageType: 'text',
					content: 'Hello {{name}}, welcome to {{company}}!',
					waitForResponse: false,
				},
			};

			const context: ConversationContext = {
				variables: {
					name: 'John',
					company: 'BotPe AI',
				},
				history: [],
				userAttributes: {},
				phoneNumber: '+1234567890',
			};

			const result = await botEngine.executeMessageNode(node, context);

			expect(result.message).toBe('Hello John, welcome to BotPe AI!');
		});
	});

	describe('executeAINode', () => {
		it('should generate AI response and extract entities', async () => {
			mockAIService.generateResponse.mockResolvedValue({
				text: 'Sure, I can help you with that!',
				entities: { product: 'shoes', size: '10' },
			});

			const node: AINode = {
				id: '2',
				type: 'ai',
				label: 'AI Response',
				position: { x: 0, y: 0 },
				data: {
					prompt: 'Respond to customer inquiry',
					model: 'claude-sonnet-4',
					temperature: 0.7,
					maxTokens: 1000,
					extractEntities: true,
					entitySchema: {
						product: 'string',
						size: 'number',
					},
				},
			};

			const context: ConversationContext = {
				variables: {},
				history: [],
				userAttributes: {},
				phoneNumber: '+1234567890',
			};

			const message = { content: { text: 'I need shoes size 10' } };

			await botEngine.executeAINode(node, message, context, {});

			expect(mockAIService.generateResponse).toHaveBeenCalled();
			expect(context.variables.product).toBe('shoes');
			expect(context.variables.size).toBe('10');
		});
	});
});

// WhatsApp Client Tests
describe('WhatsAppClient', () => {
	let client: WhatsAppClient;
	let mockAxios: jest.Mocked<typeof axios>;

	beforeEach(() => {
		mockAxios = axios as any;
		client = new WhatsAppClient({
			apiVersion: 'v18.0',
			phoneNumberId: '123456',
			accessToken: 'test-token',
		});
	});

	it('should send text message successfully', async () => {
		mockAxios.post.mockResolvedValue({
			data: {
				messages: [{ id: 'msg_123' }],
				contacts: [{ wa_id: '1234567890' }],
			},
		});

		const result = await client.sendTextMessage('+1234567890', 'Hello');

		expect(result.success).toBe(true);
		expect(result.messageId).toBe('msg_123');
		expect(mockAxios.post).toHaveBeenCalledWith(
			expect.stringContaining('/messages'),
			expect.objectContaining({
				messaging_product: 'whatsapp',
				to: '1234567890',
				type: 'text',
				text: { body: 'Hello' },
			}),
			expect.any(Object)
		);
	});
});
```

### 11.2 Integration Testing

```typescript
// API Integration Tests
describe('Bot API Integration', () => {
	let app: Express;
	let testUser: User;
	let authToken: string;

	beforeAll(async () => {
		app = await createTestApp();
		testUser = await createTestUser();
		authToken = await getAuthToken(testUser);
	});

	afterAll(async () => {
		await cleanupTestData();
	});

	describe('POST /api/bots', () => {
		it('should create a new bot', async () => {
			const response = await request(app).post('/api/bots').set('Authorization', `Bearer ${authToken}`).send({
				name: 'Test Bot',
				description: 'A test bot',
			});

			expect(response.status).toBe(201);
			expect(response.body.data).toHaveProperty('id');
			expect(response.body.data.name).toBe('Test Bot');
		});

		it('should require authentication', async () => {
			const response = await request(app).post('/api/bots').send({ name: 'Test Bot' });

			expect(response.status).toBe(401);
		});
	});

	describe('POST /api/bots/:id/test', () => {
		it('should test bot with sample message', async () => {
			const bot = await createTestBot();

			const response = await request(app)
				.post(`/api/bots/${bot.id}/test`)
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					message: 'Hello',
					context: {},
				});

			expect(response.status).toBe(200);
			expect(response.body.data).toHaveProperty('response');
		});
	});
});
```

### 11.3 E2E Testing

```typescript
// Playwright E2E Tests
import { test, expect } from '@playwright/test';

test.describe('Bot Builder', () => {
	test('should create a bot using drag and drop', async ({ page }) => {
		await page.goto('/bots');
		await page.click('button:has-text("Create Bot")');

		// Wait for builder to load
		await page.waitForSelector('.bot-builder');

		// Drag message node to canvas
		await page.dragAndDrop('.node-palette .message-node', '.flow-canvas', { targetPosition: { x: 400, y: 300 } });

		// Configure message
		await page.click('.message-node');
		await page.fill('[name="message-content"]', 'Hello, how can I help you?');

		// Save bot
		await page.click('button:has-text("Save")');

		// Verify success
		await expect(page.locator('.toast-success')).toBeVisible();
	});

	test('should test bot conversation', async ({ page }) => {
		await page.goto('/bots/test-bot-id');

		// Open test panel
		await page.click('button:has-text("Test Bot")');

		// Send test message
		await page.fill('[name="test-message"]', 'Hello');
		await page.click('button:has-text("Send")');

		// Verify response
		await expect(page.locator('.bot-response')).toContainText('Hello');
	});
});

test.describe('Inbox', () => {
	test('should handle incoming message', async ({ page }) => {
		await page.goto('/inbox');

		// Wait for conversation list
		await page.waitForSelector('.conversation-list');

		// Click on first conversation
		await page.click('.conversation-item:first-child');

		// Type and send reply
		await page.fill('[name="message"]', 'Thanks for your message!');
		await page.click('button:has-text("Send")');

		// Verify message sent
		await expect(page.locator('.message.outgoing').last()).toContainText('Thanks for your message!');
	});
});
```

---

## 12. Deployment Strategy

### 12.1 Docker Configuration

```dockerfile
# Production Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
    api:
        build: .
        ports:
            - '3000:3000'
        environment:
            - NODE_ENV=production
            - DATABASE_URL=${DATABASE_URL}
            - REDIS_URL=${REDIS_URL}
            - CLAUDE_API_KEY=${CLAUDE_API_KEY}
        depends_on:
            - postgres
            - redis
            - mongodb

    postgres:
        image: postgres:15-alpine
        volumes:
            - postgres_data:/var/lib/postgresql/data
        environment:
            - POSTGRES_DB=botpe
            - POSTGRES_USER=${DB_USER}
            - POSTGRES_PASSWORD=${DB_PASSWORD}

    redis:
        image: redis:7-alpine
        volumes:
            - redis_data:/data

    mongodb:
        image: mongo:6
        volumes:
            - mongo_data:/data/db

    nginx:
        image: nginx:alpine
        ports:
            - '80:80'
            - '443:443'
        volumes:
            - ./nginx.conf:/etc/nginx/nginx.conf
            - ./ssl:/etc/nginx/ssl
        depends_on:
            - api

volumes:
    postgres_data:
    redis_data:
    mongo_data:
```

### 12.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
    push:
        branches: [main]

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                  node-version: '18'
            - run: npm ci
            - run: npm run lint
            - run: npm run test:unit
            - run: npm run test:integration

    build:
        needs: test
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: docker/setup-buildx-action@v2
            - uses: docker/login-action@v2
              with:
                  registry: ${{ secrets.REGISTRY_URL }}
                  username: ${{ secrets.REGISTRY_USERNAME }}
                  password: ${{ secrets.REGISTRY_PASSWORD }}
            - uses: docker/build-push-action@v4
              with:
                  push: true
                  tags: ${{ secrets.REGISTRY_URL }}/botpe-api:${{ github.sha }}

    deploy:
        needs: build
        runs-on: ubuntu-latest
        steps:
            - name: Deploy to Kubernetes
              uses: azure/k8s-deploy@v4
              with:
                  manifests: |
                      k8s/deployment.yml
                      k8s/service.yml
                  images: |
                      ${{ secrets.REGISTRY_URL }}/botpe-api:${{ github.sha }}
```

---

## Document Control

**Version:** 1.0
**Last Updated:** November 2025
**Owner:** Engineering Team

---

This document provides the comprehensive technical approach for building BotPe AI with modern architecture patterns, AI integration, and best practices for scalable SaaS applications.
