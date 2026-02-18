import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// ใช้ Service Role Key เพื่อข้าม RLS (เพราะเรากรองเองในโค้ด)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    // 1. รับ userId จาก Query Params (เช่น /api/v1/orders/history?userId=user-123)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // 2. ดึงข้อมูลจาก Supabase โดยกรอง user_id
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer_types(name),
        companies(name),
        order_items (
          *,
          product_categories(name)
        )
      `)
      .eq('user_id', userId) // <--- สำคัญมาก: กรองเฉพาะเจ้าของ
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}