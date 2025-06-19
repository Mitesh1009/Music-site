"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";

import { Drawer, IconButton } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import styles from "./Header.module.scss";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const navigationItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
    },
  ];

  const drawer = (
    <div className={styles.drawerContent}>
      <ul>
        {navigationItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} onClick={() => setMobileOpen(false)}>
              <item.icon fontSize="small" /> {item.label}
            </Link>
          </li>
        ))}

        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout}>
              <LogoutIcon fontSize="small" /> Log Out
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <PersonIcon fontSize="small" /> Sign In
              </Link>
            </li>
            <li>
              <Link href="/signup" onClick={() => setMobileOpen(false)}>
                <PersonIcon fontSize="small" /> Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );

  return (
    <>
      <header className={styles.header}>
        <div className={styles.toolbar}>
          <Link href="/" className={styles.logo}>
            <MusicNoteIcon />
            MusicApp
          </Link>

          <nav className={styles.nav}>
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className={styles.navLink}>
                <item.icon fontSize="small" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.userSection}>
            {isLoggedIn ? (
              <div className={styles.signOut}>
                <span onClick={handleLogout}>
                  <LogoutIcon fontSize="small" /> Sign Out
                </span>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link href="/login" className={styles.outlinedBtn}>
                  Sign In
                </Link>
                <Link href="/signup" className={styles.filledBtn}>
                  Sign Up
                </Link>
              </div>
            )}

            <IconButton
              className={styles.mobileMenu}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </div>
        </div>
      </header>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
}
