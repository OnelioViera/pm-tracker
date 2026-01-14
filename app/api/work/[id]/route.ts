import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Work from '@/models/Work';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await request.json();
    const work = await Work.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!work) {
      return NextResponse.json({ success: false, error: 'Work item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: work });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const work = await Work.findByIdAndDelete(params.id);
    
    if (!work) {
      return NextResponse.json({ success: false, error: 'Work item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
