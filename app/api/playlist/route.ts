import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import UserPlaylist from "@/model/playlist/playlist";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.cookies.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const playlists = await UserPlaylist.find({ userId }).sort({
      updatedAt: -1,
    });

    const cleanPlaylists = playlists.map((item) => {
      return {
        id: item._id,
        playlists: item.playlists.map((pl: any) => ({
          name: pl.name,
          description: pl.description,
          songs: pl.songs.map((el: any) => {
            return { id: el._id, name: el.name, artist: el.artist };
          }),
          id: pl.id,
        })),
      };
    });

    return NextResponse.json(cleanPlaylists);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.cookies.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "UserPlaylist name is required" },
        { status: 400 }
      );
    }

    const newPlaylist = {
      id: Date.now().toString(),
      name,
      description: description || "",
      songs: [],
    };

    let userPlaylist = await UserPlaylist.findOne({ userId });

    if (!userPlaylist) {
      userPlaylist = await UserPlaylist.create({
        userId,
        playlists: [newPlaylist],
      });
    } else {
      userPlaylist.playlists.push(newPlaylist);
      await userPlaylist.save();
    }

    const createdPlaylist =
      userPlaylist.playlists[userPlaylist.playlists.length - 1];

    const playlistToReturn = {
      id: createdPlaylist._id.toString(),
      name: createdPlaylist.name,
      description: createdPlaylist.description,
      songs: createdPlaylist.songs.map((song: any) => ({
        id: song._id?.toString(),
        name: song.name,
        artist: song.artist,
      })),
    };

    return NextResponse.json(playlistToReturn, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create playlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.cookies.get("userId")?.value;

    const { playlistId } = await request.json();

    if (!userId || !playlistId) {
      return NextResponse.json(
        { error: "User ID and UserPlaylist ID are required" },
        { status: 400 }
      );
    }

    const userPlaylist = await UserPlaylist.findOne({ userId });

    if (!userPlaylist) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedPlaylists = userPlaylist.playlists.filter(
      (p: any) => p._id.toString() !== playlistId
    );

    if (updatedPlaylists.length === userPlaylist.playlists.length) {
      return NextResponse.json(
        { error: "UserPlaylist not found" },
        { status: 404 }
      );
    }

    userPlaylist.playlists = updatedPlaylists;
    await userPlaylist.save();

    return NextResponse.json({ message: "UserPlaylist deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete playlist" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.cookies.get("userId")?.value;
    const { name, description, id } = await request.json();

    if (!userId || !id) {
      return NextResponse.json(
        { error: "User ID and UserPlaylist ID are required" },
        { status: 400 }
      );
    }

    const userPlaylist = await UserPlaylist.findOne({ userId });

    if (!userPlaylist) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const playlist = userPlaylist.playlists.find(
      (p: any) => p._id.toString() === id
    );

    if (!playlist) {
      return NextResponse.json(
        { error: "UserPlaylist not found" },
        { status: 404 }
      );
    }

    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;

    await userPlaylist.save();

    const updatedPlaylist = {
      id: playlist._id.toString(),
      name: playlist.name,
      description: playlist.description,
      songs: playlist.songs.map((song: any) => ({
        id: song._id?.toString(),
        name: song.name,
        artist: song.artist,
      })),
    };

    return NextResponse.json({
      message: "UserPlaylist updated",
      playlist: updatedPlaylist,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update playlist" },
      { status: 500 }
    );
  }
}
