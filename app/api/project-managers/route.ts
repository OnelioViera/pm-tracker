import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ProjectManager from '@/models/ProjectManager';

export async function GET() {
  try {
    await dbConnect();
    const projectManagers = await ProjectManager.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projectManagers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const projectManager = await ProjectManager.create(body);
    return NextResponse.json({ success: true, data: projectManager }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
