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
      .from("cfg_favorites")
      .select(
        `
        configs (
          id,
          file_name,
          link_identifier,
          created_at,
          is_public,
          users (
            id,
            username,
            steam_id,
            avatar
          )
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedData = data.map((item) => ({
      ...item.configs,
      creator: (item.configs as any).users,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching favorite CFGs:", error);
    return NextResponse.json(
      { error: "Error fetching favorite CFGs" },
      { status: 500 }
    );
  }
}
