import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || !decoded.payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId || parseInt(userId) !== decoded.payload.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("configs")
      .select("id, file_name, link_identifier, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user CFGs:", error);
    return NextResponse.json({ error: "Error fetching CFGs" }, { status: 500 });
  }
}
