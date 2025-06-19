import { cookies } from "next/headers";
import dbConnect from "@/lib/dbconnect";
import UserPlaylist from "@/model/playlist/playlist";
import { notFound } from "next/navigation";
import PlaylistSongs from "./_components/songs";

interface Song {
  id: string;
  name: string;
  artist: string;
}

interface PlaylistItem {
  id: string;
  name: string;
  description: string;
  songs: Song[];
}

interface Props {
  params: { playlistId: string };
}

async function fetchPlaylistById(
  playlistId: string
): Promise<PlaylistItem | null> {
  try {
    await dbConnect();

    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) return null;

    const userDoc = await UserPlaylist.findOne({ userId });

    if (!userDoc) return null;

    const playlist = userDoc.playlists.find((pl: any) => pl.id === playlistId);

    if (!playlist) return null;

    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      songs: playlist.songs.map((song: any) => ({
        id: song._id.toString(),
        name: song.name,
        artist: song.artist,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch playlist by ID", error);
    return null;
  }
}

export default async function PlaylistPage({ params }: Props) {
  const playlist = await fetchPlaylistById(params.playlistId);

  if (!playlist) {
    return notFound();
  }

  return <PlaylistSongs playlist={playlist} />;
}
