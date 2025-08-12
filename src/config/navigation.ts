import {
  Home,
  User,
  Gamepad,
  Globe,
  BookOpen,
  Award,
  Briefcase,
  MessageSquare,
  Edit,
  type LucideIcon,
} from "lucide-react";

// Enhanced navigation item interface
export interface NavigationItem {
  readonly id: string;
  readonly href: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly description?: string;
  readonly subItems?: readonly NavigationItem[];
  readonly external?: boolean;
  readonly badge?: string;
  readonly disabled?: boolean;
}

// Main navigation configuration
export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  {
    id: "home",
    href: "#home",
    label: "Home",
    icon: Home,
    description: "Welcome to my portfolio",
  },
  {
    id: "about",
    href: "#about",
    label: "About",
    icon: User,
    description: "Learn more about me",
  },
  {
    id: "projects",
    href: "#projects",
    label: "Projects",
    icon: Briefcase,
    description: "View my work",
    subItems: [
      {
        id: "games",
        href: "#games",
        label: "Game Development",
        icon: Gamepad,
        description: "Game projects and demos",
      },
      {
        id: "web",
        href: "#web",
        label: "Web Applications",
        icon: Globe,
        description: "Web apps and tools",
      },
    ],
  },
  {
    id: "blog",
    href: "#blog",
    label: "Blog",
    icon: BookOpen,
    description: "Read my articles"
  },
  {
    id: "certifications",
    href: "#certifications",
    label: "Certifications",
    icon: Award,
    description: "My achievements and certifications",
  },
  {
    id: "contact",
    href: "#contact",
    label: "Contact",
    icon: MessageSquare,
    description: "Get in touch with me",
  },
] as const;

// Development-only navigation items
export const DEVELOPMENT_ITEMS: readonly NavigationItem[] = [
  {
    id: "studio",
    href: "studio",
    label: "Studio",
    icon: Edit,
    description: "Access Sanity Studio",
    external: true,
    disabled: process.env.NODE_ENV !== "development",
  },
] as const;

// --- HELPER FUNCTIONS ---

export const getAllNavigationItems = (): readonly NavigationItem[] => {
  const items = [...NAVIGATION_ITEMS];
  if (process.env.NODE_ENV === "development") {
    // A simple way to add dev items without mutation
    return [...items, ...DEVELOPMENT_ITEMS];
  }
  return items;
};

export const isNavigationItemActive = (item: NavigationItem, activeSection: string): boolean => {
  if (item.id === activeSection) return true;
  if (item.subItems) {
    return item.subItems.some(sub => sub.id === activeSection);
  }
  return false;
};

// --- CONFIGURATIONS ---

export const NAVIGATION_ANIMATIONS = {
  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  },
  smooth: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as const,
  },
  quick: {
    duration: 0.15,
    ease: "easeOut" as const,
  },
} as const;

export const NAVIGATION_STYLES = {
  light: {
    background: "bg-white/95",
    border: "border-gray-200/50",
    text: "text-gray-700",
    hover: "hover:bg-gray-100",
    active: "bg-indigo-50 text-indigo-900",
    focus: "focus:ring-indigo-500",
  },
  dark: {
    background: "bg-slate-800/95",
    border: "border-slate-700/50",
    text: "text-gray-300",
    hover: "hover:bg-slate-700/50",
    active: "bg-indigo-600/30 text-white",
    focus: "focus:ring-indigo-500",
  },
} as const;

/**
 * A reusable type that describes the shape of a style object,
 * making it compatible with both light and dark theme configurations.
 */
export type NavigationStyle = {
  background: string;
  border: string;
  text: string;
  hover: string;
  active: string;
  focus: string;
};