import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../../context/AuthContext';

// Load the Inter font using the correct import
const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'TrueBalance',
	description: 'Track your income and expenses',
	icons: {
		icon: '/favicon.ico',
		apple: '/apple-touch-icon.png',
	},
	manifest: '/site.webmanifest',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.variable}>
			<body className={`${inter.className} antialiased bg-gray-50`}>
				<AuthProvider>
					<main>{children}</main>
				</AuthProvider>
			</body>
		</html>
	);
}
