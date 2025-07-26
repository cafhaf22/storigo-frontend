import React, { useEffect, useRef } from "react";

interface ContextMenuProps {
    open: boolean;
    x: number;
    y: number;
    onClose: () => void;
    children: React.ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    open, x, y, onClose, children
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            onClose();
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
        ref={menuRef}
        className="fixed z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 border border-gray-200 dark:border-gray-700 min-w-[160px]"
        style={{ top: y, left: x }}
        >
        {children}
        </div>
    );
};
