import { createAnonSupabase, jsonError, jsonResponse } from "@/lib/server/supabase"

export async function GET() {
  const supabase = createAnonSupabase()
  const { data, error } = await supabase
    .from("membership_products")
    .select("type,name,price,original_price,duration_days,credits,description,features")
    .eq("active", true)
    .order("sort_order")

  if (error) return jsonError(error.message)

  return jsonResponse({
    plans: (data || []).map((product) => ({
      id: product.type,
      plan_type: product.type,
      name: product.name,
      price: Number(product.price),
      original_price: product.original_price ? Number(product.original_price) : undefined,
      duration_days: product.duration_days,
      credits_gift: product.credits,
      description: product.description,
      features: Array.isArray(product.features) ? product.features.join("\n") : undefined,
    })),
  })
}
