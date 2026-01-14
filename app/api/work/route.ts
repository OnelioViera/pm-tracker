import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Work from '@/models/Work';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const pmId = searchParams.get('pmId');
    
    const filter = pmId ? { projectManagerId: pmId } : {};
    const work = await Work.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: work });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const work = await Work.create(body);
    return NextResponse.json({ success: true, data: work }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
