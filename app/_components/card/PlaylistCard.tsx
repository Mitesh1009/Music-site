"use client";

import React from "react";
import { Edit, PlayArrow } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

import styles from "./PlaylistCard.module.scss";
import { useRouter } from "next/navigation";

export interface PlaylistCardData {
  id: string;
  name: string;
  description: string;
  songs?: { name: string; artist: string }[];
}

interface PlaylistCardProps {
  playlist: PlaylistCardData;
  onEdit: (playlist: PlaylistCardData) => void;
  onDelete: (playlistId: string) => void;
}

export default function PlaylistCard({
  playlist,
  onEdit,
  onDelete,
}: PlaylistCardProps) {
  const router = useRouter();
  const handleDelete = () => {
    onDelete(playlist.id);
  };

  const handleNavigation = (e: any, playlistId: string) => {
    e.preventDefault();
    router.push(`/dashboard/${playlistId}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.details}>
          <h3 className={styles.title}>{playlist.name}</h3>
          <p className={styles.description}>{playlist.description}</p>
          <span className={styles.songCount}>
            {playlist.songs?.length ?? 0} songs
          </span>
        </div>
        <div className={styles.icons}>
          <button className={styles.iconButton} onClick={handleDelete}>
            <DeleteIcon color="error" />
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${styles.contained}`}
          onClick={(e) => {
            handleNavigation(e, playlist.id);
          }}
        >
          <PlayArrow />
          Open
        </button>
        <button
          onClick={() => onEdit(playlist)}
          className={`${styles.actionBtn} ${styles.outlined}`}
        >
          <Edit />
          Edit
        </button>
      </div>
    </div>
  );
}
