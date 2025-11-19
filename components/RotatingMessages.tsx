import { Instrument_Serif } from "next/font/google";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils";

const instrumentserif = Instrument_Serif({
    subsets: ["latin"],
    weight: ["400"],
});

interface RotatingMessageProps {
    messages: string[];
    interval?: number;
    className?: string;
}

const RotatingMessage = ({messages, interval=3000, className=""}: RotatingMessageProps) => {
    const [currentMessageIdx, setCurrentMessageIdx] = useState(0);

    useEffect(()=>{
        const messageInterval = setInterval(()=>{
            setCurrentMessageIdx((prevIdx) => (prevIdx+1) % messages.length)
        }, interval);

        return () => clearInterval(messageInterval);
    }, [interval, messages.length]);



    const variant = {
        enter: {y:20, opacity:0},
        center: {y:0, opacity:1},
        exit: {y:-20, opacity:0},
    }

    return (
        <div className={`overflow-hidden ${className}`}>
            <AnimatePresence mode="wait">
                <motion.p
                    key={currentMessageIdx}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={variant}
                    transition={{stiffness: 300, damping: 30}}
                    className={cn("text-center font-medium", instrumentserif.className)}
                >
                    {messages[currentMessageIdx]}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

export default RotatingMessage;