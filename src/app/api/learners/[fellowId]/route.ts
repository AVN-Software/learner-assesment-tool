import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request, { params }: any) {
  const supabase = await createClient(cookies());
  const { fellowId } = params;

  const { data, error } = await supabase
    .from('ll_tool_learners')
    .select('*')
    .eq('fellow_id', fellowId)
    .order('learner_name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
