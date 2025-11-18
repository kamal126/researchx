import React from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const Navbar = () => {
    return (
        <nav className="">
            <Link href="/" className="">
                <div className="">ResearchX</div>
            </Link>
            <div className="">
                <ThemeToggle/>
                <a href="https://github.com/kamal126/researchX" target="_blank" rel="noopener noreferrer">
                    <Button className="">Github</Button>
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
