"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";
// imoprt { Toaster } from "@/components/ui/sonner";


const ToasterWithTheme = () => {
    const { theme } = useTheme();
    return <Toaster richColors closeButton theme= {theme === "dark" ? "dark" : "light"} />;
}

export default ToasterWithTheme;