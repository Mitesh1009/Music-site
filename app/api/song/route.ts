import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import UserPlaylist from "@/model/playlist/playlist";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.cookies.get("userId")?.value;
    const { playlistId, song } = await request.json();

    if (!userId || !playlistId || !song) {
      return NextResponse.json(
        { error: "User ID, Playlist ID and Song are required" },
        { status: 400 }
      );
    }

    const userPlaylist = await UserPlaylist.findOne({ userId });

    if (!userPlaylist) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const playlist = userPlaylist.playlists.find(
      (p: any) => String(p._id) === playlistId
    );

    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    const newSong = {
      ...song,
    };

    playlist.songs.push(newSong);
    await userPlaylist.save();

    const savedSong = playlist.songs[playlist.songs.length - 1];

    return NextResponse.json(
      {
        id: String(savedSong._id),
        name: savedSong.name,
        artist: savedSong.artist,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to add song" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.cookies.get("userId")?.value;
    const { playlistId, songId } = await request.json();

    if (!userId || !playlistId || !songId) {
      return NextResponse.json(
        { error: "User ID, Playlist ID and Song ID are required" },
        { status: 400 }
      );
    }

    const userPlaylist = await UserPlaylist.findOne({ userId });

    if (!userPlaylist) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const playlist = userPlaylist.playlists.find(
      (p: any) => String(p._id) === playlistId
    );

    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    const originalLength = playlist.songs.length;
    playlist.songs = playlist.songs.filter((s: any) => s.id !== songId);

    if (playlist.songs.length === originalLength) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    await userPlaylist.save();

    return NextResponse.json({ message: "Song deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete song" },
      { status: 500 }
    );
  }
}
