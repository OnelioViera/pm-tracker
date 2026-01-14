import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ProjectManager from '@/models/ProjectManager';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await request.json();
    const projectManager = await ProjectManager.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!projectManager) {
      return NextResponse.json({ success: false, error: 'Project Manager not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: projectManager });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const projectManager = await ProjectManager.findByIdAndDelete(params.id);
    
    if (!projectManager) {
      return NextResponse.json({ success: false, error: 'Project Manager not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
