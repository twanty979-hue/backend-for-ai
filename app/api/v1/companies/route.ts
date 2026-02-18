import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🔍 GET: ดึงรายชื่อบริษัทตามประเภทลูกค้า
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const typeId = searchParams.get('type_id');

  try {
    let query = supabase.from('companies').select('id, name');

    // ถ้ามี type_id ส่งมา ให้กรอง (ถ้าไม่มี จะส่งกลับไปทั้งหมด)
    if (typeId) {
      query = query.eq('customer_type_id', typeId);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}