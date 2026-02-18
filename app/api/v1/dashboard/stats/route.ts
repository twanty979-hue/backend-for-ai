import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ค่า Config (ดึงจาก .env จะดีที่สุด แต่ใส่ตรงนี้เพื่อให้เห็นภาพครับ)
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ใช้ Service Key เพื่อให้อ่านข้อมูลได้ชัวร์ๆ

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    // 1. ตรวจสอบ Token ว่าถูกต้องไหม
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. หา Team ID ของ User คนนี้
    const { data: profile } = await supabase
      .from('profiles')
      .select('team_id')
      .eq('id', user.id)
      .single()

    const teamId = profile?.team_id

    // 3. นับยอด "ของฉัน" (My Orders)
    const { count: myCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true }) // head: true คือนับจำนวนอย่างเดียว ไม่ดึง data
      .eq('user_id', user.id)

    // 4. นับยอด "ของทีม" (Team Orders - ไม่รวมของฉัน)
    let teamCount = 0
    if (teamId) {
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId)
        .neq('user_id', user.id) // ไม่เอา user_id ของตัวเอง
      
      teamCount = count || 0
    }

    // 5. ส่งค่ากลับไป
    return NextResponse.json({
      myOrders: myCount || 0,
      teamOrders: teamCount,
      totalOrders: (myCount || 0) + teamCount
    })

  } catch (error) {
    console.error('Stats Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}