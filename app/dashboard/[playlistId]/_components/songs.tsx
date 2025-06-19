"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import styles from "./songs.module.scss";

interface Song {
  id?: string;
  name: string;
  artist: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
}

interface Props {
  playlist: Playlist;
}

export default function PlaylistSongs({ playlist }: Props) {
  const [songs, setSongs] = useState<Song[]>(playlist.songs || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSong, setNewSong] = useState({ name: "", artist: "" });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const tokenRes = await fetch("/api/spotify", { method: "POST" });
      const tokenData = await tokenRes.json();

      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery
        )}&type=track&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );

      const data = await res.json();
      setSearchResults(data.tracks?.items || []);
    } catch (err) {
      console.error("Spotify search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSong = (track: any) => {
    const selected = {
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
    };
    setNewSong(selected);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleAddSong = async () => {
    if (!newSong.name || !newSong.artist) return;

    try {
      const res = await axios.post("/api/song", {
        playlistId: playlist.id,
        song: newSong,
      });

      const newSongWithId = res.data;
      setSongs((prev) => [...prev, newSongWithId]);
      setNewSong({ name: "", artist: "" });
    } catch (err) {
      console.error("Failed to add song", err);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      await axios.delete("/api/song", {
        data: { playlistId: playlist.id, songId },
      });

      setSongs((prev) => prev.filter((s) => s.id !== songId));
    } catch (err) {
      console.error("Failed to delete song", err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <h1>{playlist.name}</h1>
        <h2>Search on Spotify</h2>
        <TextField
          label="Search by song or artist"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          margin="dense"
        />
        <Button
          variant="outlined"
          onClick={handleSearch}
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading ? <CircularProgress size={20} /> : "Search"}
        </Button>

        {searchResults.length > 0 && (
          <List sx={{ mt: 2, maxHeight: 200, overflowY: "auto" }}>
            {searchResults.map((track) => (
              <ListItem key={track.id} onClick={() => handleSelectSong(track)}>
                <ListItemText
                  primary={track.name}
                  secondary={track.artists.map((a: any) => a.name).join(", ")}
                />
              </ListItem>
            ))}
          </List>
        )}

        <h2>Add Manually</h2>
        <TextField
          label="Song Name"
          fullWidth
          margin="dense"
          value={newSong.name}
          onChange={(e) =>
            setNewSong((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <TextField
          label="Artist"
          fullWidth
          margin="dense"
          value={newSong.artist}
          onChange={(e) =>
            setNewSong((prev) => ({ ...prev, artist: e.target.value }))
          }
        />
        <Button
          onClick={handleAddSong}
          variant="contained"
          sx={{ mt: 1 }}
          disabled={!newSong.name || !newSong.artist}
        >
          Add Song
        </Button>
      </div>

      <div className={styles.right}>
        <h2>Song List</h2>
        {songs.length === 0 ? (
          <p>No songs yet.</p>
        ) : (
          <ul className={styles.songList}>
            {songs.map((song) => (
              <li key={song.id} className={styles.songItem}>
                <div>
                  <p>
                    <strong>{song.name}</strong>
                  </p>
                  <p>{song.artist}</p>
                </div>
                <IconButton onClick={() => handleDeleteSong(song.id ?? "")}>
                  <DeleteIcon color="error" />
                </IconButton>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
