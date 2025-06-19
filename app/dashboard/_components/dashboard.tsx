"use client";

import { useState } from "react";
import { Add } from "@mui/icons-material";
import PlaylistCard from "@/app/_components/card/PlaylistCard";
import PlaylistDialog from "@/app/_components/create-playlist/CreatePlaylistDialog";
import styles from "./dashboard.module.scss";
import axios from "axios";
import PlaylistSongsModal from "@/app/dashboard/[playlistId]/_components/songs";

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

interface DashboardClientProps {
  initialData: PlaylistData | null;
}

export default function Dashboard({ initialData }: DashboardClientProps) {
  const [playlistData, setPlaylists] = useState<PlaylistData | null>(
    initialData
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistItem | null>(
    null
  );

  const handleCreatePlaylist = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      const res = await axios.post("/api/playlist", data);
      setPlaylists((prev) =>
        prev
          ? {
              ...prev,
              playlists: [...prev.playlists, res.data],
            }
          : null
      );
    } catch (err) {
      alert("Failed to create playlist.");
    } finally {
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditPlaylist = async (data: {
    name: string;
    description: string;
  }) => {
    if (!editingPlaylist) return;
    try {
      const res = await axios.put("/api/playlist", {
        id: editingPlaylist.id,
        ...data,
      });
      setPlaylists((prev) =>
        prev
          ? {
              ...prev,
              playlists: prev.playlists.map((p) =>
                p.id === editingPlaylist.id ? res.data?.playlist : p
              ),
            }
          : null
      );
    } catch (err) {
      alert("Failed to update playlist.");
    } finally {
      setEditingPlaylist(null);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      await axios.delete("/api/playlist", {
        data: { playlistId },
      });
      setPlaylists((prev) =>
        prev
          ? {
              ...prev,
              playlists: prev.playlists.filter((p) => p.id !== playlistId),
            }
          : null
      );
    } catch (err) {
      alert("Failed to delete playlist.");
    }
  };

  const handleAddSong = async (playlistId: string, song: Song) => {
    try {
      const res = await axios.post("/api/song", { playlistId, song });
      const newSongWithCorrectId = res.data;

      setPlaylists((prev) =>
        prev
          ? {
              ...prev,
              playlists: prev.playlists.map((p) =>
                p.id === playlistId
                  ? { ...p, songs: [...p.songs, newSongWithCorrectId] }
                  : p
              ),
            }
          : null
      );
    } catch (err) {
      console.error("Failed to add song", err);
    }
  };

  const handleDeleteSong = async (playlistId: string, songId: string) => {
    try {
      await axios.delete("/api/song", {
        data: { playlistId, songId },
      });

      setPlaylists((prev) =>
        prev
          ? {
              ...prev,
              playlists: prev.playlists.map((p) =>
                p.id === playlistId
                  ? {
                      ...p,
                      songs: p.songs.filter((s) => s.id !== songId),
                    }
                  : p
              ),
            }
          : null
      );
    } catch (err) {
      console.error("Failed to delete song", err);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>My Dashboard</h1>
          <p className={styles.description}>
            Manage your playlists and discover new music
          </p>
        </div>
        <button
          className={styles.createButton}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Add fontSize="small" /> Create Playlist
        </button>
      </header>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Playlists</p>
          <h3>{playlistData?.playlists?.length ?? 0}</h3>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Songs</p>
          <h3>
            {playlistData?.playlists.reduce(
              (total, playlist) => total + (playlist.songs?.length || 0),
              0
            ) ?? 0}
          </h3>
        </div>
      </section>

      <section className={styles.playlistsSection}>
        <h2 className={styles.sectionTitle}>Your Playlists</h2>

        {!playlistData?.playlists?.length ? (
          <div className={styles.emptyState}>
            <h3>No playlists yet</h3>
            <p>Create your first playlist to get started</p>
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className={styles.createButton}
            >
              <Add fontSize="small" /> Create Playlist
            </button>
          </div>
        ) : (
          <div className={styles.playlistGrid}>
            {playlistData.playlists.map((playlist, index) => (
              <div key={playlist.id ?? index} className={styles.playlistCard}>
                <PlaylistCard
                  playlist={playlist}
                  onEdit={() => setEditingPlaylist(playlist)}
                  onDelete={handleDeletePlaylist}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <PlaylistDialog
        open={isCreateDialogOpen || !!editingPlaylist}
        mode={editingPlaylist ? "edit" : "create"}
        initialData={editingPlaylist || undefined}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setEditingPlaylist(null);
        }}
        onSubmit={(data) => {
          editingPlaylist
            ? handleEditPlaylist(data)
            : handleCreatePlaylist(data);
        }}
      />
    </div>
  );
}
