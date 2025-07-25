import { useState, useRef, useEffect } from "react";
import { ValidationError } from "../types";

interface UseInlineEditProps<T = any> {
    id: string;
    field: string;
    value: T;
    validateField: (field: string, value: T) => ValidationError | null;
    onSave: (id: string, field: string, value: T) => ValidationError[] | null;
    onCancel?: () => void;
};

export function useInlineEdit<T = any>({ 
    id, 
    field, 
    value, 
    validateField, 
    onSave, 
    onCancel,
}: UseInlineEditProps<T>) {
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState<T>(value);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    const startEditing = () => {
        setEditing(true);
        setEditValue(value);
        setErrors([]);
    };

    const cancelEdit = () => {
        setEditing(false);
        setEditValue(value);
        setErrors([]);
        onCancel && onCancel();
    };

    const handleChange = (val : any) => {
        setEditValue(val);
        const error = validateField(field, val);
        setErrors(error ? [error] : []);
    };

    const saveEdit = () => {
        if(errors.length > 0) return;
        const result = onSave(id, field, editValue);
        if(result && result.length > 0) {
            setErrors(result);
            return;
        }
        setEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") saveEdit();
        else if (e.key === "Escape") cancelEdit();
    };
    
    return {
    editing,
    editValue,
    errors,
    inputRef,
    startEditing,
    handleChange,
    saveEdit,
    cancelEdit,
    handleKeyDown,
    setEditValue,
    };
}