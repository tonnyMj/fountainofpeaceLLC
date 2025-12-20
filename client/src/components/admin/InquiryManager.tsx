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

export default function InquiryManager() {
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
        fetchInquiries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                // Sanitize data: Default missing status to 'new' for older records
                const sanitizedData = data.map((item: any) => ({
                    ...item,
                    status: item.status || 'new'
                }));
                setInquiries(sanitizedData);
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
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Inquiry Management</h2>
                    <p className="text-gray-600">View and respond to visitor messages</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-1 inline-flex self-start">
                    {['all', 'new', 'read', 'replied'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${filter === f
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-gray-200'}`}>
                                {f === 'all' ? inquiries.length : inquiries.filter(inq => inq.status === f).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredInquiries.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <Mail size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No inquiries found</p>
                        <p className="text-sm mt-1">Check back later for new messages.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visitor</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredInquiries.map((inquiry) => (
                                    <tr key={inquiry.id} className={`hover:bg-gray-50/80 transition-colors ${inquiry.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{inquiry.name}</div>
                                            {inquiry.tourDate && (
                                                <div className="text-xs text-primary mt-1 flex items-center gap-1">
                                                    <Calendar size={10} /> Tour: {inquiry.tourDate}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="text-gray-900">{inquiry.email}</div>
                                            {inquiry.phone && <div className="text-gray-500 text-xs mt-0.5">{inquiry.phone}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(inquiry.createdAt).toLocaleDateString()}
                                            <div className="text-xs text-gray-400">
                                                {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(inquiry.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleViewInquiry(inquiry)}
                                                className="text-primary hover:text-blue-700 font-medium inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
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

            {/* Detail Modal */}
            {selectedInquiry && !isReplyModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Inquiry Details</h2>
                                <p className="text-xs text-gray-500 mt-1">ID: #{selectedInquiry.id}</p>
                            </div>
                            <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg">
                                        <User size={20} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</p>
                                        <p className="font-medium text-lg text-gray-900">{selectedInquiry.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg">
                                        <Mail size={20} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                                        <a href={`mailto:${selectedInquiry.email}`} className="font-medium text-lg text-primary hover:underline">
                                            {selectedInquiry.email}
                                        </a>
                                    </div>
                                </div>

                                {selectedInquiry.phone && (
                                    <div className="flex items-start gap-3">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <Phone size={20} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</p>
                                            <a href={`tel:${selectedInquiry.phone}`} className="font-medium text-lg text-primary hover:underline">
                                                {selectedInquiry.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {selectedInquiry.tourDate && (
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-50 p-2 rounded-lg">
                                            <Calendar size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Requested Tour</p>
                                            <p className="font-medium text-lg text-gray-900">{selectedInquiry.tourDate}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedInquiry.message && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <MessageSquare size={18} className="text-gray-400" />
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Message</span>
                                    </div>
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedInquiry.message}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                                <span>Status: {getStatusBadge(selectedInquiry.status)}</span>
                                <span>Received: {new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50/80 backdrop-blur-md border-t border-gray-200 px-6 py-4 flex gap-3">
                            <button
                                onClick={handleReply}
                                className="flex-1 bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-500/20"
                            >
                                <Send size={18} /> Reply via Email
                            </button>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="px-6 py-2.5 border border-gray-300 bg-white rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {isReplyModalOpen && selectedInquiry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-900 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold">Reply to {selectedInquiry.name}</h2>
                                <p className="text-xs text-gray-400">Via Email</p>
                            </div>
                            <button onClick={() => setIsReplyModalOpen(false)} className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4 flex items-center gap-2 text-sm">
                                <span className="text-gray-500">To:</span>
                                <span className="font-medium bg-gray-100 px-2 py-1 rounded text-gray-900">{selectedInquiry.email}</span>
                            </div>

                            <textarea
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type your professional reply here..."
                                rows={8}
                                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-base"
                            />

                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 flex gap-2">
                                <div className="shrink-0 mt-0.5">ℹ️</div>
                                <p>The email will be sent from <strong>Fountain of Peace</strong> and will include your official signature and contact details automatically.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3 border-t border-gray-100">
                            <button
                                onClick={sendReply}
                                disabled={sending || !replyMessage.trim()}
                                className="flex-1 bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
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
                                className="px-6 py-2.5 border border-gray-300 bg-white rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 disabled:opacity-50"
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
