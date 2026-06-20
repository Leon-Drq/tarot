import { jsonResponse } from "@/lib/server/supabase"

export async function POST() {
  return jsonResponse({
    questions: [
      "我现在最应该采取哪一步行动？",
      "这件事里我忽略了什么信号？",
      "未来一周我需要注意什么？",
    ],
  })
}
