'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { ArrowUp, Sparkles } from 'lucide-react';

const defaults = ['Insight', 'Budgeting Tips', 'Advice', 'Analysis'];

interface Message {
	sender: 'user' | 'ai';
	content: string;
}

interface responseType {
	ok: boolean;
	response: string;
	error?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getStyle = (sender: 'user' | 'ai') => {
	//bg-black text-white rounded-xl px-3 py-2 ml-auto w-fit max-w-[70%] overflow-hidden flex-shrink-0
	if (sender === 'user') {
		return 'bg-blue-600 text-white rounded-xl  px-3 py-2 ml-auto w-fit max-w-[70%] overflow-hidden flex-shrink-0';
	} else {
		return 'bg-gray-100 text-black rounded-xl px-3 py-2 mr-auto w-fit max-w-[70%] overflow-hidden flex-shrink-0';
	}
};

export function AiHeader() {
	const [open, setOpen] = useState(false);
	const [text, setText] = useState('');
	const [messages, setMessage] = useState<Message[]>([]);
	const [loading, setLoading] = useState(false);

	const handleFetch = async (message: string, history: Message[]) => {
		const res = await fetch(`${apiUrl}/api/dashboard/promptAi`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify({
				prompt: message,
				conversationHistory: history,
			}),
		});

		const data: responseType = await res.json();
		if (!data.ok) throw new Error(data.error || 'Failed to fetch');
		console.log('Data from AI:', data);
		return data;
	};

	const onSubmit = (message: string) => {
		if (message.trim() === '') return;
		setLoading(true);

		setMessage((prev) => [...prev, { sender: 'user', content: message }]);

		handleFetch(message, messages)
			.then((data) => {
				setMessage((prev) => [
					...prev,
					{ sender: 'ai', content: data.response },
				]);
			})
			.catch((er) => {
				console.error('Error:', er);

				setMessage((prev) => [
					...prev,
					{
						sender: 'ai',
						content: 'Sorry, I encountered an error. Please try again.',
					},
				]);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div>
			<Button
				className="fixed bottom-7 right-7 h-12 w-12 bg-blue-600 hover:bg-blue-700 rounded-full z-50"
				onClick={() => {
					setOpen(!open);
				}}
			>
				<Sparkles />
			</Button>

			{open && (
				<div className="fixed bottom-17 right-20 h-120 w-120 flex flex-col-reverse bg-white rounded-xl shadow-sm z-50">
					<div className="sticky bottom-0 z-50 w-full h-20 flex before:content-[''] before:absolute before:top-0 before:left-4 before:right-4 before:h-px before:bg-gray-300">
						<textarea
							className="m-3 p-3 flex-grow resize-none outline-none"
							placeholder="Type your message..."
							onKeyDown={(event) => {
								if (event.key === 'Enter' && !event.shiftKey) {
									event.preventDefault();
									(event.target as HTMLTextAreaElement).value = '';
									onSubmit(text);
									setText('');
								}
							}}
							value={text}
							onChange={(event) => setText(event.target.value)}
						></textarea>

						<Button
							className="m-5 bg-blue-600 ml-auto hover:bg-blue-700"
							onClick={() => {
								onSubmit(text);
								setText('');
							}}
						>
							<ArrowUp />
						</Button>
					</div>

					<div className=" h-[81%] flex flex-col gap-3 p-3 overflow-auto">
						<div className="bg-gray-100 text-black rounded-xl px-3 py-2 mr-auto w-fit max-w-[70%] overflow-hidden flex-shrink-0">
							Welcome to True Balance AI 👋 How can I assist you with your
							finances today?
						</div>

						{messages.map((message, index) => (
							<div key={index} className={getStyle(message.sender)}>
								{message.content}
							</div>
						))}

						<div className="flex flex-row-reverse gap-2 gap-x-2.5 flex-wrap   rounded-xl  px-3 py-2 ml-auto w-fit max-w-[70%] overflow-hidden flex-shrink-0">
							{defaults.map((option: string, index) => (
								<Button
									key={index}
									className=" bg-white  text-blue-600 rounded-xl  border border-blue-600 hover:bg-blue-600 hover:text-white"
									onClick={() => onSubmit(option)}
								>
									{option}
								</Button>
							))}
						</div>

						{loading && (
							<div className="bg-gray-100 text-black rounded-xl px-3 py-2 mr-auto w-fit max-w-[70%] overflow-hidden flex-shrink-0">
								<div className="flex space-x-2">
									<div className="w-2 h-2 bg-black rounded-full animate-bounce delay-0"></div>
									<div className="w-2 h-2 bg-black rounded-full animate-bounce delay-150"></div>
									<div className="w-2 h-2 bg-black rounded-full animate-bounce delay-300"></div>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
