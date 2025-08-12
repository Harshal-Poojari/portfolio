// components/Header.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent as ReactKeyboardEvent,
  useMemo,
} from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import {
  IconChevronDown,
  IconMenu2,
  IconX,
  IconCode,
  IconSun,
  IconMoon,
  IconExternalLink,
  IconSearch,
} from "@tabler/icons-react";
import { cn } from "../utils/cn";
import { useTheme } from "../context/ThemeContext";
import {
  NavigationItem,
  isNavigationItemActive,
  NAVIGATION_ANIMATIONS,
} from "../config/navigation";

/**
 * Header props:
 * - navItems: the navigation config (with optional subItems)
 * - activeSection: current section id (for active styling)
 * - onNavigate: navigation handler
 * - onOpenPalette?: optional handler to open command palette (Ctrl/Cmd+K)
 */
interface HeaderProps {
  navItems: readonly NavigationItem[];
  activeSection: string;
  onNavigate: (item: NavigationItem) => void;
  onOpenPalette?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  navItems,
  activeSection,
  onNavigate,
  onOpenPalette,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const { isDarkMode } = useTheme();

  // Refs for focus management
  const triggerRefs = useRef<Map<string, HTMLAnchorElement | null>>(new Map());
  const dropdownRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  // Update scroll state for header styling
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Mouse tracking for radial hover effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  // Focus the first interactive element in dropdown when it opens
  useEffect(() => {
    if (!openId) return;
    const dropdown = dropdownRefs.current.get(openId);
    if (!dropdown) return;
    // Focus first link/button within dropdown
    const focusable = dropdown.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, [openId]);

  // Close any open dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!openId) return;
      const trigger = triggerRefs.current.get(openId);
      const dropdown = dropdownRefs.current.get(openId);
      const target = e.target as Node;
      if (
        trigger &&
        (trigger === target || trigger.contains(target as Node))
      ) {
        return;
      }
      if (dropdown && (dropdown === target || dropdown.contains(target))) {
        return;
      }
      // Close and restore focus to trigger
      setOpenId((prev) => {
        if (prev) {
          const t = triggerRefs.current.get(prev);
          // restore after microtask to avoid immediate blur conflicts
          setTimeout(() => t?.focus(), 0);
        }
        return null;
      });
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openId]);

  // Trap focus within open dropdown
  const onDropdownKeyDown = (e: ReactKeyboardEvent, id: string) => {
    if (!openId || openId !== id) return;
    if (e.key !== "Tab") return;

    const dropdown = dropdownRefs.current.get(id);
    if (!dropdown) return;
    const focusable = dropdown.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift+Tab on first loops to last
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab on last loops to first
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Helper functions for keyboard navigation
  const getTopLevelTriggers = () => {
    const arr: HTMLAnchorElement[] = [];
    navItems.forEach((n) => {
      const ref = triggerRefs.current.get(n.id);
      if (ref) arr.push(ref);
    });
    return arr;
  };

  const focusTopLevelByIndex = (index: number) => {
    const all = getTopLevelTriggers();
    if (!all.length) return;
    const max = all.length;
    const next = ((index % max) + max) % max; // wrap
    all[next]?.focus();
  };

  const focusDropdownIndex = (parentId: string, idx: number) => {
    const dropdown = dropdownRefs.current.get(parentId);
    if (!dropdown) return;
    const focusable = dropdown.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const next = ((idx % focusable.length) + focusable.length) % focusable.length;
    focusable[next]?.focus();
  };

  // Keyboard support for desktop trigger buttons (open/close, arrow nav)
  const handleNavTriggerKey = (
    e: ReactKeyboardEvent<HTMLAnchorElement>,
    item: NavigationItem,
    index: number
  ) => {
    const hasSub = !!item.subItems?.length;
    const isOpen = openId === item.id;

    // Enter/Space: toggle dropdown or navigate if no subItems
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (hasSub) {
        setOpenId(isOpen ? null : item.id);
      } else {
        handleNavigate(item);
      }
      return;
    }

    // Down arrow: open dropdown and focus first subItem
    if (e.key === "ArrowDown" && hasSub) {
      e.preventDefault();
      if (!isOpen) setOpenId(item.id);
      // focusing handled by useEffect when openId changes
      return;
    }

    // Left/Right arrows to move between top-level items
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const nextIndex =
        e.key === "ArrowRight" ? index + 1 : index - 1;
      focusTopLevelByIndex(nextIndex);
      return;
    }

    // Escape closes dropdown and returns focus to trigger
    if (e.key === "Escape" && hasSub) {
      if (isOpen) {
        e.preventDefault();
        setOpenId(null);
        const trigger = triggerRefs.current.get(item.id);
        trigger?.focus();
      }
      return;
    }
  };

  // Keyboard within dropdown: arrow navigate between items, Enter to activate, Escape to close
  const handleDropdownItemKey = useCallback((
    e: ReactKeyboardEvent<HTMLAnchorElement | HTMLButtonElement>,
    parentId: string,
    i: number,
    total: number,
    item: NavigationItem
  ) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpenId(null);
      const trigger = triggerRefs.current.get(parentId);
      trigger?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusDropdownIndex(parentId, (i + 1) % total);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      focusDropdownIndex(parentId, (i - 1 + total) % total);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate(item);
      return;
    }
    // Left/Right on dropdown could move focus back to top-level triggers
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      // Move to adjacent top-level trigger
      const allTriggers = getTopLevelTriggers();
      const currentIdx = allTriggers.findIndex(
        (el) => el === triggerRefs.current.get(parentId)
      );
      const nextIndex =
        e.key === "ArrowRight" ? currentIdx + 1 : currentIdx - 1;
      setOpenId(null);
      focusTopLevelByIndex(nextIndex);
      return;
    }
  }, []);

  // Navigate and close menus appropriately
  const handleNavigate = useCallback(
    (item: NavigationItem, e?: React.MouseEvent) => {
      e?.preventDefault();
      const closingId = openId;
      setOpenId(null);
      setHoveredId(null);
      setMobileMenuOpen(false);

      if (item.external) {
        window.open(item.href, "_blank", "noreferrer noopener");
      } else if (item.href.startsWith("#")) {
        const el = document.querySelector(item.href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        onNavigate(item);
      }

      // Restore focus to the trigger if we navigated from a dropdown
      if (closingId) {
        const trigger = triggerRefs.current.get(closingId);
        setTimeout(() => trigger?.focus(), 0);
      }
    },
    [onNavigate, openId]
  );

  // Toggle dropdown open/close (desktop)
  const toggleDropdown = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setOpenId((prev) => {
        const next = prev === id ? null : id;
        return next;
      });
    },
    []
  );

  // ARIA ids for dropdowns
  const dropdownIdFor = (id: string) => `nav-dropdown-${id}`;

  // Memoized search hotkey label
  const kbdLabel = useMemo(() => {
    const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    return isMac ? "⌘K" : "Ctrl+K";
  }, []);

  return (
    <>
      {/* Header Top Bar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm",
          isScrolled ? "shadow-lg" : "shadow-none"
        )}
      >
        <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 select-none">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a
              href="#home"
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group outline-none focus-visible:ring-2 ring-sky-500 rounded-md"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(navItems[0]);
              }}
            >
              <img 
                src="/images/logo.png" 
                alt="Logo" 
                className="h-7 w-auto drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                width={28}
                height={28}
              />
              <div>
                <h1 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-50">
                  Harshal Poojari
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Game Developer & Engineer
                </p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 relative">
              <ul
                onMouseMove={handleMouseMove}
                className="relative flex items-center gap-2 p-1 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 group"
                role="menubar"
                aria-label="Primary navigation"
              >
                <LayoutGroup>
                  {navItems.map((item, idx) => {
                    const isActive = isNavigationItemActive(item, activeSection);
                    const isDropdownOpen = openId === item.id;
                    const hasSub = !!item.subItems?.length;

                    return (
                      <li
                        key={item.id}
                        className="relative select-none"
                        onMouseEnter={() => {
                          setHoveredId(item.id);
                          if (hasSub) setOpenId(item.id);
                        }}
                        onMouseLeave={() => {
                          setHoveredId(null);
                          if (hasSub) setOpenId((curr) => (curr === item.id ? null : curr));
                        }}
                        role="none"
                      >
                        <a
                          href={item.href}
                          role="menuitem"
                          tabIndex={0}
                          ref={(el) => {
                            triggerRefs.current.set(item.id, el);
                          }}
                          onKeyDown={(e) => handleNavTriggerKey(e, item, idx)}
                          onClick={(e) => {
                            if (hasSub) {
                              toggleDropdown(item.id, e);
                            } else {
                              handleNavigate(item, e);
                            }
                          }}
                          className={cn(
                            "relative flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full z-20 cursor-pointer outline-none transition-colors focus-visible:ring-2 ring-sky-500",
                            isActive
                              ? "text-slate-900 dark:text-slate-50"
                              : "text-slate-600 dark:text-slate-400",
                            isDropdownOpen && "ring-2 ring-sky-500"
                          )}
                          aria-haspopup={hasSub ? "menu" : undefined}
                          aria-expanded={hasSub ? isDropdownOpen : undefined}
                          aria-controls={hasSub ? dropdownIdFor(item.id) : undefined}
                          id={`nav-trigger-${item.id}`}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-purple-500/80 dark:from-blue-400/80 dark:to-purple-400/80 rounded-full"
                            initial={false}
                            animate={{ opacity: isActive ? 1 : 0 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            aria-hidden
                          />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-300/10 dark:to-purple-300/10 rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                            transition={{ duration: 0.1 }}
                            aria-hidden
                          />
                          <div className="relative z-10 flex items-center gap-2">
                            {React.createElement(item.icon, { className: "w-5 h-5" })}
                            <span>{item.label}</span>
                            {hasSub && (
                              <motion.div
                                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 20,
                                }}
                                aria-hidden
                              >
                                <IconChevronDown size={16} />
                              </motion.div>
                            )}
                          </div>
                        </a>

                        {/* Active nav highlight pill */}
                        {isActive && (
                          <motion.div
                            layoutId="active-desktop-pill"
                            className="absolute inset-0 bg-white dark:bg-slate-700 shadow-md rounded-full z-10"
                            transition={NAVIGATION_ANIMATIONS.spring}
                            aria-hidden
                          />
                        )}

                        {/* Dropdown menu */}
                        <AnimatePresence>
                          {hasSub && isDropdownOpen && (
                            <DropdownMenu
                              id={dropdownIdFor(item.id)}
                              parentId={item.id}
                              items={item.subItems!}
                              onNavigate={handleNavigate}
                              onKeyDown={onDropdownKeyDown}
                              onItemKeyDown={handleDropdownItemKey}
                              dropdownRefs={dropdownRefs}
                            />
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </LayoutGroup>

                {/* Radial hover effect */}
                <motion.div
                  className="absolute -inset-px rounded-full opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: useMotionTemplate`radial-gradient(450px at ${mouseX}px ${mouseY}px, ${
                      isDarkMode ? "rgba(45, 212, 191, 0.15)" : "rgba(59, 130, 246, 0.18)"
                    }, transparent 80%)`,
                  }}
                  aria-hidden
                />
              </ul>

              {/* Command palette button (also supports Ctrl/Cmd+K) */}
              {onOpenPalette && (
                <button
                  type="button"
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-slate-200/60 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300/50 dark:border-slate-700/50 outline-none focus-visible:ring-2 ring-sky-500"
                  onClick={() => onOpenPalette()}
                  aria-label="Open command palette"
                >
                  <IconSearch size={16} />
                  <span className="text-slate-600 dark:text-slate-300">Search</span>
                  <kbd className="ml-1 px-1.5 py-0.5 text-[10px] rounded bg-slate-300/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200">
                    {kbdLabel}
                  </kbd>
                </button>
              )}

              <ThemeToggle />
            </div>

            {/* Mobile Navigation & Theme Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Mobile search trigger */}
              {onOpenPalette && (
                <button
                  type="button"
                  className="p-2 rounded-lg outline-none focus-visible:ring-2 ring-sky-500"
                  aria-label="Open command palette"
                  onClick={() => onOpenPalette()}
                >
                  <IconSearch size={20} />
                </button>
              )}
              <ThemeToggle />
              <MobileMenuToggle open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
            </div>
          </div>
        </nav>
      </header>
      {/* Increased spacing for mobile - was h-20, now responsive */}
      <div className="h-16 sm:h-20 lg:h-24" />

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu items={navItems} onNavigate={handleNavigate} setOpen={setMobileMenuOpen} />
        )}
      </AnimatePresence>
    </>
  );
};

// Dropdown bento menu with accessibility and focus trap support - SIMPLIFIED VERSION
const DropdownMenu = React.memo(
  ({
    id,
    parentId,
    items,
    onNavigate,
    onKeyDown,
    onItemKeyDown,
    dropdownRefs,
  }: {
    id: string;
    parentId: string;
    items: readonly NavigationItem[];
    onNavigate: (item: NavigationItem) => void;
    onKeyDown: (e: ReactKeyboardEvent, id: string) => void;
    onItemKeyDown: (
      e: ReactKeyboardEvent<HTMLAnchorElement | HTMLButtonElement>,
      parentId: string,
      i: number,
      total: number,
      item: NavigationItem
    ) => void;
    dropdownRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
  }) => {
    const { isDarkMode } = useTheme();

    return (
      <motion.div
        id={id}
        role="menu"
        aria-labelledby={`nav-trigger-${parentId}`}
        ref={(el) => {
          dropdownRefs.current.set(parentId, el);
        }}
        initial={{ opacity: 0, y: 15, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.97 }}
        transition={{ ...NAVIGATION_ANIMATIONS.smooth, duration: 0.22 }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 shadow-2xl z-30"
        onKeyDown={(e) => onKeyDown(e, parentId)}
      >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 bg-white dark:bg-slate-800 border-l border-t border-gray-200 dark:border-slate-700/70 z-20" />
        <div className="relative w-64 p-3 rounded-2xl shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl border border-gray-200 dark:border-slate-700">
          <div className="flex flex-col gap-1">
            {items.map((subItem, i) => {
              const ItemIcon = subItem.icon;
              const isButton = !subItem.href || subItem.href === "#";
              const commonProps = {
                className: cn(
                  "group relative flex items-center gap-3 p-3 rounded-xl text-left transition-colors cursor-pointer outline-none focus-visible:ring-2 ring-sky-500",
                  isDarkMode ? "hover:bg-indigo-900/10" : "hover:bg-indigo-500/10"
                ),
                onKeyDown: (e: ReactKeyboardEvent<HTMLAnchorElement | HTMLButtonElement>) =>
                  onItemKeyDown(e, parentId, i, items.length, subItem),
                role: "menuitem" as const,
                tabIndex: 0,
              };

              return isButton ? (
                <motion.button
                  key={subItem.id}
                  type="button"
                  {...commonProps}
                  whileHover={{ scale: 1.02 }}
                  transition={NAVIGATION_ANIMATIONS.spring}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    onNavigate(subItem);
                  }}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      isDarkMode ? "bg-slate-700 group-hover:bg-indigo-500/20" : "bg-indigo-50 group-hover:bg-indigo-100/60"
                    )}
                  >
                    {ItemIcon && <ItemIcon size={18} />}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {subItem.label}
                  </span>
                  {subItem.external && (
                    <IconExternalLink size={12} className="ml-auto opacity-40" />
                  )}
                </motion.button>
              ) : (
                <motion.a
                  key={subItem.id}
                  href={subItem.href}
                  {...commonProps}
                  whileHover={{ scale: 1.02 }}
                  transition={NAVIGATION_ANIMATIONS.spring}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(subItem);
                  }}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      isDarkMode ? "bg-slate-700 group-hover:bg-indigo-500/20" : "bg-indigo-50 group-hover:bg-indigo-100/60"
                    )}
                  >
                    {ItemIcon && <ItemIcon size={18} />}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {subItem.label}
                  </span>
                  {subItem.external && (
                    <IconExternalLink size={12} className="ml-auto opacity-40" />
                  )}
                </motion.a>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }
);

// Theme Toggle button with animation and accessibility
const ThemeToggle = React.memo(() => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label="Toggle light/dark theme"
      className="p-2 rounded-lg outline-none focus-visible:ring-2 ring-sky-500"
      whileTap={{ scale: 0.93, rotate: 15 }}
      type="button"
    >
      <AnimatePresence mode="wait">
        {isDarkMode ? (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={NAVIGATION_ANIMATIONS.quick}
          >
            <IconMoon size={20} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={NAVIGATION_ANIMATIONS.quick}
          >
            <IconSun size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
});

// Mobile menu toggle button
const MobileMenuToggle = React.memo(
  ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => (
    <motion.button
      onClick={() => setOpen(!open)}
      className="p-2 rounded-lg outline-none focus-visible:ring-2 ring-sky-500"
      whileTap={{ scale: 0.9 }}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="mobile-menu-drawer"
      type="button"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={open ? "x" : "menu"}
          initial={{ rotate: open ? -90 : 90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: open ? 90 : -90, opacity: 0 }}
          transition={NAVIGATION_ANIMATIONS.quick}
        >
          {open ? <IconX size={20} /> : <IconMenu2 size={20} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
);

// Mobile menu drawer with accordions
const MobileMenu = React.memo(
  ({
    items,
    onNavigate,
    setOpen,
  }: {
    items: readonly NavigationItem[];
    onNavigate: (item: NavigationItem) => void;
    setOpen: (v: boolean) => void;
  }) => {
    const [accordionOpen, setAccordionOpen] = useState<string | null>(null);

    // Esc to close drawer
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [setOpen]);

    return (
      <motion.div
        id="mobile-menu-drawer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        aria-modal="true"
        role="dialog"
        aria-label="Mobile navigation"
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={NAVIGATION_ANIMATIONS.spring}
          className="fixed top-0 right-0 h-full w-full max-w-xs p-6 bg-white dark:bg-slate-900 shadow-2xl"
        >
          <ul className="flex flex-col gap-2 mt-16">
            {items.map((item, idx) => {
              const Icon = item.icon;
              const isOpen = accordionOpen === item.id;

              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: 35 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: idx * 0.05,
                    ...NAVIGATION_ANIMATIONS.smooth,
                  }}
                >
                  {item.subItems ? (
                    <div>
                      <button
                        className={cn(
                          "flex items-center w-full justify-between p-3 rounded-lg text-base font-medium hover:bg-slate-200 dark:hover:bg-slate-800 outline-none focus-visible:ring-2 ring-sky-500"
                        )}
                        aria-expanded={isOpen}
                        aria-controls={`mobile-accordion-${item.id}`}
                        onClick={() => setAccordionOpen(isOpen ? null : item.id)}
                        type="button"
                      >
                        <div className="flex items-center gap-3">
                          {Icon && <Icon size={18} />}
                          {item.label}
                        </div>
                        <IconChevronDown
                          className={cn(
                            "transition-transform",
                            isOpen ? "rotate-180" : ""
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.ul
                            id={`mobile-accordion-${item.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-7 py-2 space-y-2"
                            transition={{
                              height: { duration: 0.3 },
                              opacity: { duration: 0.2 },
                            }}
                          >
                            {item.subItems.map((subItem) => {
                              const SubIcon = subItem.icon;
                              return (
                                <li key={subItem.id}>
                                  <a
                                    href={subItem.href}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      onNavigate(subItem);
                                      setOpen(false);
                                    }}
                                    className="flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-800 outline-none focus-visible:ring-2 ring-sky-500"
                                  >
                                    {SubIcon && <SubIcon size={16} />}
                                    {subItem.label}
                                    {subItem.external && (
                                      <IconExternalLink
                                        size={13}
                                        className="ml-1 inline-block opacity-60"
                                      />
                                    )}
                                  </a>
                                </li>
                              );
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 p-3 rounded-lg text-base font-medium hover:bg-slate-200 dark:hover:bg-slate-800 outline-none focus-visible:ring-2 ring-sky-500"
                    >
                      {Icon && <Icon size={18} />}
                      {item.label}
                    </a>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </motion.div>
    );
  }
);

export default Header;
