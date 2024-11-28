import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from '@/utils/jwt'

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  let userId: number | null = null

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (decoded && decoded.payload) {
      userId = decoded.payload.id
    }
  }

  try {
    const { data, error } = await supabase
      .from("configs")
      .select(
        `
        id,
        file_name,
        link_identifier,
        created_at,
        users (id, username, steam_id, avatar)
      `
      )
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    let formattedData = data.map((cfg) => ({
      id: cfg.id,
      file_name: cfg.file_name,
      link_identifier: cfg.link_identifier,
      created_at: cfg.created_at,
      creator: cfg.users,
      is_favorited: false, // Default to false, we'll update this later if needed
    }));

    // If user is authenticated, fetch their favorites
    if (userId) {
      const { data: favorites, error: favoritesError } = await supabase
        .from("cfg_favorites")
        .select("cfg_id")
        .eq("user_id", userId);

      if (favoritesError) throw favoritesError;

      const favoriteIds = new Set(favorites.map(fav => fav.cfg_id));

      formattedData = formattedData.map(cfg => ({
        ...cfg,
        is_favorited: favoriteIds.has(cfg.id),
      }));
    }

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching public CFGs:", error);
    return NextResponse.json(
      { error: "Error fetching public CFGs" },
      { status: 500 }
    );
  }
}

