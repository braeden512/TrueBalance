import OpenAi from 'openai';
import dotenv from 'dotenv';

import { findUserByEmail } from '../../models/user/index.js';
import { getTransactionsByUserId } from '../../models/transaction/index.js';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config({ path: '.env.development' });
}

const openai = new OpenAi({
	apiKey: process.env.OPENAI_API_KEY,
});

const defaults = {
	Analysis:
		'Baesed on my transactions , provide a brief analysis of my spending habits.',
	Budgeting: 'Based on my transactions, help me create a budget plan.',
	Advice:
		'Based on my transactions, provide me with some advice to improve my financial health.',
	'Bugeting Tips': 'Based on my transactions, give me some budgeting tips.',
};

const tools = [];

export const promptAi = async (req, res) => {
	try {
		const email = req.user.email;

		const existingUser = await findUserByEmail(email);

		if (!existingUser) {
			return res.status(400).json({ error: 'User does not exist' });
		}

		const userTransactions = await getTransactionsByUserId(existingUser.id);

		const { prompt, conversationHistory } = req.body;

		if (!prompt || typeof prompt !== 'string' || prompt.length > 500) {
			return res.status(400).json({ error: 'Invalid prompt' });
		}

		if (
			conversationHistory &&
			(!Array.isArray(conversationHistory) || conversationHistory.length > 10)
		) {
			return res.status(400).json({ error: 'Invalid conversation history' });
		}

		// 		const messages = [
		// 			{
		// 				role: 'system',
		// 				content: `You are a helpful finance assistant for True Balance. Help users understand their spending habits and provide budgeting advice.

		// User's transactions:
		// ${JSON.stringify(userTransactions, null, 2)}

		// Analyze their spending patterns, provide insights, and give actionable advice. Keep responses concise (under 200 words) unless asked for details.

		// Today is ${new Date().toLocaleDateString()}.`,
		// 			},
		// 		];

		const messages = [
			{
				role: 'system',
				content: `You are a helpful finance assistant. Help users based on there questions and there data such as transactions.

				 User's transactions:
				${JSON.stringify(userTransactions, null, 2)}
  
  					Keep responses concise and under 3 sentences unless asked for details.
  
  					Today is ${new Date().toLocaleDateString()}.`,
			},
		];

		if (conversationHistory && conversationHistory.length > 0) {
			conversationHistory.forEach((msg) => {
				const realContent =
					msg.content in defaults ? defaults[msg.content] : msg.content;
				messages.push({
					role: msg.sender === 'user' ? 'user' : 'assistant',
					content: realContent,
				});
			});
		}

		messages.push({
			role: 'user',
			content: prompt,
		});

		const response = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: messages,
			//tools: tools,
			max_tokens: 150,
			//tool_choice: 'auto',
		});

		const responseMessage = response.choices[0].message;

		// if (responseMessage.tool_calls) {
		// 	console.log('wants tools?');
		// }

		return res.json({
			ok: true,
			response: responseMessage.content || '',
		});
	} catch (err) {
		console.error(err);
		return res.json({
			ok: false,
			error: 'Failed to get AI response',
		});
	}
};
