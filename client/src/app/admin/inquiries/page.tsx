"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Eye, Send, X, Calendar, Phone, User, MessageSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Inquiry {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string | null;
    tourDate: string | null;
    status: 'new' | 'read' | 'replied';
    createdAt: string;
}

export default function AdminInquiriesPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchInquiries();
    }, [router]);

    const fetchInquiries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/inquiries`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                router.push('/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setInquiries(data);
            }
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            showToast('Failed to load inquiries', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, status: 'new' | 'read' | 'replied') => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/inquiries/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                fetchInquiries();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleViewInquiry = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        if (inquiry.status === 'new') {
            updateStatus(inquiry.id, 'read');
        }
    };

    const handleReply = () => {
        if (!selectedInquiry) return;
        setIsReplyModalOpen(true);
    };

    const sendReply = async () => {
        if (!selectedInquiry || !replyMessage.trim()) {
            showToast('Please enter a reply message', 'error');
            return;
        }

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/inquiries/${selectedInquiry.id}/reply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ replyMessage })
            });

            if (response.ok) {
                showToast('Reply sent successfully!', 'success');
                setReplyMessage('');
                setIsReplyModalOpen(false);
                setSelectedInquiry(null);
                fetchInquiries();
            } else {
                const error = await response.json();
                showToast(error.error || 'Failed to send reply', 'error');
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            showToast('Failed to send reply', 'error');
        } finally {
            setSending(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            new: 'bg-blue-100 text-blue-800',
            read: 'bg-yellow-100 text-yellow-800',
            replied: 'bg-green-100 text-green-800'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const filteredInquiries = filter === 'all'
        ? inquiries
        : inquiries.filter(inq => inq.status === filter);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Inquiries</h1>
                    <p className="text-gray-600">View and respond to visitor messages and tour requests</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex gap-3">
                    {['all', 'new', 'read', 'replied'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === f
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            <span className="ml-2 text-sm">
                                ({f === 'all' ? inquiries.length : inquiries.filter(inq => inq.status === f).length})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Inquiries Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {filteredInquiries.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Mail size={48} className="mx-auto mb-4 opacity-30" />
                            <p>No inquiries found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredInquiries.map((inquiry) => (
                                        <tr key={inquiry.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{inquiry.name}</div>
                                                {inquiry.phone && (
                                                    <div className="text-sm text-gray-500">{inquiry.phone}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {inquiry.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(inquiry.createdAt).toLocaleDateString()}
                                                <div className="text-xs text-gray-400">
                                                    {new Date(inquiry.createdAt).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(inquiry.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => handleViewInquiry(inquiry)}
                                                    className="text-primary hover:text-blue-700 font-medium flex items-center gap-1"
                                                >
                                                    <Eye size={16} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedInquiry && !isReplyModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Inquiry Details</h2>
                            <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <User size={20} className="text-gray-400 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{selectedInquiry.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail size={20} className="text-gray-400 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <a href={`mailto:${selectedInquiry.email}`} className="font-medium text-primary hover:underline">
                                        {selectedInquiry.email}
                                    </a>
                                </div>
                            </div>

                            {selectedInquiry.phone && (
                                <div className="flex items-start gap-3">
                                    <Phone size={20} className="text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <a href={`tel:${selectedInquiry.phone}`} className="font-medium text-primary hover:underline">
                                            {selectedInquiry.phone}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {selectedInquiry.tourDate && (
                                <div className="flex items-start gap-3">
                                    <Calendar size={20} className="text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Preferred Tour Date</p>
                                        <p className="font-medium">{selectedInquiry.tourDate}</p>
                                    </div>
                                </div>
                            )}

                            {selectedInquiry.message && (
                                <div className="flex items-start gap-3">
                                    <MessageSquare size={20} className="text-gray-400 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-2">Message</p>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500">Received on {new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
                            <button
                                onClick={handleReply}
                                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                                <Send size={18} /> Reply via Email
                            </button>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {isReplyModalOpen && selectedInquiry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full">
                        <div className="bg-primary text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
                            <h2 className="text-xl font-bold">Reply to {selectedInquiry.name}</h2>
                            <button onClick={() => setIsReplyModalOpen(false)} className="text-white/80 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">To: <span className="font-medium text-gray-900">{selectedInquiry.email}</span></p>
                            </div>

                            <textarea
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type your reply message here..."
                                rows={8}
                                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                            />

                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
                                <p><strong>Note:</strong> This will send a professional email with your message to the visitor. The email will include your facility contact information.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3">
                            <button
                                onClick={sendReply}
                                disabled={sending || !replyMessage.trim()}
                                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} /> Send Reply
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setIsReplyModalOpen(false)}
                                disabled={sending}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
