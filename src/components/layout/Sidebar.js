"use client";

import React from "react";
import {
  FiBarChart2,
  FiUsers,
  FiLayers,
  FiTool,
  FiLogOut,
  FiX,
  FiGrid,
  FiMaximize
} from "react-icons/fi";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const section = params.get("page");
  const { logout } = useAuth();

  /**
   * MAIN NAVIGATION LINKS
   */
  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: FiBarChart2 },

    // NEW MANAGEMENT BUTTONS
    { href: "/orders?page=ceiling", label: "Ceiling Management", icon: FiGrid},
    { href: "/orders?page=finishes", label: "Finishes Management", icon: FiLayers },
    { href: "/orders?page=handrail", label: "Handrail Management", icon: FiTool },
      { href: "/orders?page=size", label: "Size Management", icon: FiMaximize },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const NavItem = ({ href, label, Icon }) => {
    // Check BOTH pathname & query param for active highlighting
    const isActive =
      pathname === href.split("?")[0] &&
      (section === href.split("=")[1] || (!section && href.includes("ceiling")));

    return (
      <a
        href={href}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition
          ${
            isActive
              ? "bg-white/15 text-white shadow-md"
              : "text-blue-100 hover:bg-white/10"
          }
        `}
      >
        <Icon className="mr-3 text-lg" />
        {label}
      </a>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-screen flex-col bg-gradient-to-b from-cyan-900 to-blue-900 text-white">

          {/* Header */}
          <div className="flex items-center h-20 px-4 border-b border-white/10 bg-gradient-to-r from-cyan-900 to-blue-900">
            <span className="text-4xl font-extrabold tracking-wide text-white drop-shadow-lg">
              G&R Admin
            </span>
            <button className="lg:hidden text-white ml-auto" onClick={onClose}>
              <FiX size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {navLinks.map(({ href, label, icon }) => (
              <NavItem key={href} href={href} label={label} Icon={icon} />
            ))}

            {/* <div className="pt-2">
              <NavItem href="/help-support" label="Help & Support" Icon={FiMessageSquare} />
            </div> */}
          </nav>

          {/* Logout */}
          <div className="px-4 pb-5 pt-3 border-t border-white/10 bg-black/20 sticky bottom-0">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg 
                border border-white/20 bg-white/10 text-blue-100 
                hover:bg-white/20 hover:text-white transition font-medium shadow-sm"
            >
              <FiLogOut className="text-lg" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
