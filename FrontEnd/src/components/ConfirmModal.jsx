import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDark }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 ${isDark ? "bg-[#141b2a] text-white border border-gray-700" : "bg-white text-gray-900"
                    }`}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 text-red-500">
                            <AlertTriangle size={24} />
                            <h3 className="text-xl font-bold">{title}</h3>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                            <X size={20} />
                        </button>
                    </div>

                    <p className={`mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {message}
                    </p>

                    <div className="flex gap-4 justify-end">
                        <button
                            onClick={onClose}
                            className={`px-4 py-2 rounded-lg font-medium transition ${isDark ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition shadow-lg shadow-red-500/30"
                        >
                            Confirm Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
