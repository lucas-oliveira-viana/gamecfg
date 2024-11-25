import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/utils/jwt";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || !decoded.payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { configLink, userId } = await request.json();

  if (!configLink || !userId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const linkIdentifier = configLink.split("/").pop();

    const { data, error } = await supabase
      .from("configs")
      .update({ user_id: userId, is_public: false })
      .eq("link_identifier", linkIdentifier)
      .select();

    if (error) throw error;

    if (data && data.length > 0) {
      return NextResponse.json(
        { message: "Config linked successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error linking config:", error);
    return NextResponse.json(
      { error: "Error linking config" },
      { status: 500 }
    );
  }
}
