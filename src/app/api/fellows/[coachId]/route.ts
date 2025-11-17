import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(req: Request, { params }: any) {
  const supabase = await createClient(cookies());
  const { coachId } = params;

  const { data, error } = await supabase
    .from('ll_tool_fellows')
    .select(
      `
      *,
      ll_tool_coaches!ll_tool_fellows_coach_id_fkey (
        coach_name
      )
    `,
    )
    .eq('coach_id', coachId)
    .order('fellow_name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mapped = (data || []).map((f: any) => ({
    ...f,
    coach_name: f.ll_tool_coaches?.coach_name,
  }));

  return NextResponse.json(mapped);
}
