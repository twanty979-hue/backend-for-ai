// app/lib/services/aiService.ts
// import { createClient } from '@supabase/supabase-js'; // ปิดไว้ก่อน

// 2. ตั้งค่า n8n URL (ดึงจาก .env)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'YOUR_N8N_URL_HERE'; 

export const AIService = {
  async processUserChat(message: string, userId: string) {
    try {
      // --- Step 1: (ข้าม) บันทึกคำถาม User ---
      const validUserId = userId || 'anonymous'; 

      // --- Step 2: ยิงไปหา n8n (AI) ---
      console.log(`Sending to n8n... Msg: ${message}`);
      
      const response = await fetch(AI_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userId: validUserId }), 
      });

      if (!response.ok) {
        throw new Error(`n8n Error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      // ดึงคำตอบ (รองรับหลาย key กันเหนียว)
      const aiReply = data.reply || data.text || data.output || "ขออภัย ระบบขัดข้อง";

      return aiReply;

    } catch (error) {
      console.error("AIService Error:", error);
      throw error;
    }
  },
};