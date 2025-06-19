import { cookies } from "next/headers";
import dbConnect from "@/lib/dbconnect";
import UserPlaylist from "@/model/playlist/playlist";
import Dashboard from "./_components/dashboard";

export interface Song {
  id?: string;
  name: string;
  artist: string;
}

export interface PlaylistItem {
  id: string;
  name: string;
  description: string;
  songs: Song[];
}

export interface PlaylistData {
  userId: string;
  id: string;
  playlists: PlaylistItem[];
}

async function fetchPlaylists(): Promise<PlaylistData | null> {
  try {
    await dbConnect();

    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return null;
    }

    const playlists = await UserPlaylist.find({ userId }).sort({
      updatedAt: -1,
    });

    if (!playlists.length) {
      return null;
    }

    const cleanPlaylists = playlists.map((item) => {
      return {
        id: item._id.toString(),
        userId,
        playlists: item.playlists.map((pl: any) => ({
          name: pl.name,
          description: pl.description,
          songs: pl.songs.map((el: any) => {
            return {
              id: el._id.toString(),
              name: el.name,
              artist: el.artist,
            };
          }),
          id: pl.id,
        })),
      };
    });

    return cleanPlaylists[0];
  } catch (error) {
    console.error("Failed to fetch playlistData", error);
    return null;
  }
}

export default async function DashboardPage() {
  const initialData = await fetchPlaylists();

  return <Dashboard initialData={initialData} />;
}
