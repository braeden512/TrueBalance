import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	const { path } = await params;
	const pathString = path.join('/');
	const searchParams = request.nextUrl.searchParams.toString();
	const url = `${BACKEND_URL}/${pathString}${searchParams ? `?${searchParams}` : ''}`;

	const token = request.headers.get('authorization');

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: token }),
			},
		});

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch {
		return NextResponse.json(
			{ error: 'Failed to fetch from backend' },
			{ status: 500 }
		);
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	const { path } = await params;
	const pathString = path.join('/');
	const url = `${BACKEND_URL}/${pathString}`;
	const body = await request.json();
	const token = request.headers.get('authorization');

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: token }),
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch {
		return NextResponse.json(
			{ error: 'Failed to post to backend' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	const { path } = await params;
	const pathString = path.join('/');
	const url = `${BACKEND_URL}/${pathString}`;
	const token = request.headers.get('authorization');

	try {
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: token }),
			},
		});

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch {
		return NextResponse.json(
			{ error: 'Failed to delete from backend' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	const { path } = await params;
	const pathString = path.join('/');
	const url = `${BACKEND_URL}/${pathString}`;
	const body = await request.json();
	const token = request.headers.get('authorization');

	try {
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: token }),
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch {
		return NextResponse.json(
			{ error: 'Failed to update backend' },
			{ status: 500 }
		);
	}
}
