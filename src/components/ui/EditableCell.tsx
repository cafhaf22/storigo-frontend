import React from "react";
import { Check, X } from "lucide-react";

interface EditableCellProps {
    type?: string;
    value: any;
    editing: boolean;
    errors: any[];
    inputRef: React.RefObject<HTMLInputElement>;
    onChange: (value: any) => void;
    onSave: () => void;
    onCancel: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    min?: number;
    step?: number;
    className?: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
    type = "text",
    value,
    editing,
    errors,
    inputRef,
    onChange,
    onSave,
    onCancel,
    onKeyDown,
    min,
    step,
    className = "",
}) => {
    if(!editing)
        return <span className={className}>{value}</span>;

    return (
        <div className="flex items-center gap-1 w-full">
            <input
                ref={inputRef}
                type={type}
                className={`w-full px-2 py-1 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-800
                ${errors.length > 0
                    ? "border-danger-500 bg-danger-50 dark:bg-danger-900/30"
                    : "border-gray-300 dark:border-gray-700"
                }`}
                value={value}
                min={min}
                step={step}
                onChange={e => onChange(type === "number" ? e.target.valueAsNumber : e.target.value)}
                onKeyDown={onKeyDown}
            />
            <button
                className="p-1 rounded-full text-success-500 hover:bg-success-100 dark:hover:bg-success-900/30"
                onClick={onSave}
                tabIndex={-1}
            >
                <Check size={16} />
            </button>
            <button
                className="p-1 rounded-full text-danger-500 hover:bg-danger-100 dark:hover:bg-danger-900/30"
                onClick={onCancel}
                tabIndex={-1}
            >
                <X size={16} />
            </button>
        </div>
    );
};