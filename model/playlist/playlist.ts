import mongoose from "mongoose";

const SongSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
});

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  songs: [SongSchema],
});

const UserPlaylistSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  playlists: [PlaylistSchema],
});

const UserPlaylist =
  mongoose.models.UserPlaylist ||
  mongoose.model("UserPlaylist", UserPlaylistSchema);

export default UserPlaylist;
