import { createAnonSupabase, jsonError, jsonResponse } from "@/lib/server/supabase"

export async function GET() {
  const supabase = createAnonSupabase()
  const { data, error } = await supabase
    .from("membership_products")
    .select("type,name,price,duration_days,credits,stripe_enabled")
    .eq("active", true)
    .order("sort_order")

  if (error) return jsonError(error.message)

  const stripeReady = Boolean(process.env.STRIPE_SECRET_KEY)

  return jsonResponse({
    products: (data || []).map((product) => ({
      type: product.type,
      name: product.name,
      price: Number(product.price),
      days: product.duration_days,
      credits: product.credits,
      stripe_enabled: Boolean(product.stripe_enabled && stripeReady),
    })),
  })
}
