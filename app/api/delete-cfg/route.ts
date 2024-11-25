import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";
import { supabase } from "@/lib/supabase";

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || !decoded.payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { cfgId } = await request.json();

  try {
    // First, check if the CFG belongs to the user
    const { data: cfgData, error: cfgError } = await supabase
      .from("configs")
      .select("user_id")
      .eq("id", cfgId)
      .single();

    if (cfgError) throw cfgError;

    if (cfgData.user_id !== decoded.payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If the CFG belongs to the user, delete it
    const { error } = await supabase.from("configs").delete().eq("id", cfgId);

    if (error) throw error;

    return NextResponse.json({ message: "CFG deleted successfully" });
  } catch (error) {
    console.error("Error deleting CFG:", error);
    return NextResponse.json({ error: "Error deleting CFG" }, { status: 500 });
  }
}
