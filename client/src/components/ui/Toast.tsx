"use client";

import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    onClose: (id: string) => void;
}

const Toast = ({ id, type, message, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [id, onClose]);

    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
    };

    const bgColors = {
        success: 'bg-white border-green-100',
        error: 'bg-white border-red-100',
        info: 'bg-white border-blue-100',
    };

    return (
        <div className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border border-l-4 min-w-[300px] animate-slide-in ${bgColors[type]}`}>
            <div className="flex-shrink-0">{icons[type]}</div>
            <p className="text-gray-800 text-sm font-medium flex-grow">{message}</p>
            <button onClick={() => onClose(id)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
