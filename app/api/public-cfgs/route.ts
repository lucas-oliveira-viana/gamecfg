import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("configs")
      .select(
        `
        id,
        file_name,
        link_identifier,
        created_at,
        users (username)
      `
      )
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    const formattedData = data.map((cfg) => ({
      id: cfg.id,
      file_name: cfg.file_name,
      link_identifier: cfg.link_identifier,
      created_at: cfg.created_at,
      username: cfg.users.username,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching public CFGs:", error);
    return NextResponse.json(
      { error: "Error fetching public CFGs" },
      { status: 500 }
    );
  }
}
