import Link from "next/link";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import SearchIcon from "@mui/icons-material/Search";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import styles from "./home.module.scss";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Your Music, Your Way</h1>
        <h2 className={styles.subtitle}>
          Create, manage, and discover playlists with Spotify integration
        </h2>
        <div className={styles.buttons}>
          <Link href="/signup" className={styles.primaryBtn}>
            Get Started
          </Link>
          <Link href="/login" className={styles.outlinedBtn}>
            Sign In
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.card}>
          <span>
            <QueueMusicIcon />
          </span>
          <h3>Create Playlists</h3>
          <p>Organize your favorite songs into custom playlists</p>
        </div>
        <div className={styles.card}>
          <span className={styles.icon}>
            <SearchIcon />
          </span>
          <h3>Search Songs</h3>
          <p>Find any song using Spotify's vast music library</p>
        </div>
        <div className={styles.card}>
          <span className={styles.icon}>
            <MusicNoteIcon />
          </span>
          <h3>Manage Music</h3>
          <p>Add, remove, and organize songs in your playlists</p>
        </div>
      </section>
    </div>
  );
}
