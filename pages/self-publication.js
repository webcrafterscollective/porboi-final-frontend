// pages/self-publication.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { User, FileText, Image as ImageIcon, CreditCard, HelpCircle, UploadCloud, Send } from 'lucide-react';

const SelfPublicationPage = () => {
    const { user } = useAuth();
    const [activeStep, setActiveStep] = useState('profile');
    const [loading, setLoading] = useState(false);

    // State for each form
    const [profileData, setProfileData] = useState({ authorName: '', authorEmail: '', bio: '' });
    const [contentData, setContentData] = useState({ manuscriptTitle: '', synopsis: '' });
    const [paymentData, setPaymentData] = useState({ transactionId: '' });
    
    const [manuscriptFile, setManuscriptFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [paymentFile, setPaymentFile] = useState(null);

    // Pre-fill user data
    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                authorName: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                authorEmail: user.email || '',
            }));
        }
    }, [user]);

    const handleFileChange = (setter) => (e) => {
        const file = e.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
            toast.error('File size should not exceed 10MB.');
            e.target.value = null;
            return;
        }
        setter(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        toast.loading('Submitting your publication...');

        // In a real app, you would gather all state and send it to an API
        console.log({
            profile: profileData,
            content: contentData,
            manuscript: manuscriptFile?.name,
            cover: coverFile?.name,
            payment: paymentData,
            paymentProof: paymentFile?.name,
        });

        setTimeout(() => {
            setLoading(false);
            toast.dismiss();
            toast.success('Your submission has been received!');
            // Optionally reset all forms here
        }, 2000);
    };

    const steps = [
        { id: 'profile', name: 'Author Profile', icon: User },
        { id: 'content', name: 'Content PDF', icon: FileText },
        { id: 'cover', name: 'Cover', icon: ImageIcon },
        { id: 'payment', name: 'Payment', icon: CreditCard },
        { id: 'help', name: 'Need Help?', icon: HelpCircle },
    ];

    const renderStepContent = () => {
        switch (activeStep) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">Create Your Author Profile</h3>
                        <p className="text-gray-600">Tell us about yourself. This information will help us get to know you as an author.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Author Name *</label>
                            <input type="text" value={profileData.authorName} onChange={(e) => setProfileData({...profileData, authorName: e.target.value})} className="form-input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
                            <input type="email" value={profileData.authorEmail} onChange={(e) => setProfileData({...profileData, authorEmail: e.target.value})} className="form-input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio</label>
                            <textarea rows="4" value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} className="form-textarea" placeholder="A brief introduction about yourself..."></textarea>
                        </div>
                    </div>
                );
            case 'content':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">Upload Your Manuscript</h3>
                        <p className="text-gray-600">Please provide your manuscript title, a brief synopsis, and the content file in PDF or DOCX format.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Manuscript Title *</label>
                            <input type="text" value={contentData.manuscriptTitle} onChange={(e) => setContentData({...contentData, manuscriptTitle: e.target.value})} className="form-input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Synopsis *</label>
                            <textarea rows="4" value={contentData.synopsis} onChange={(e) => setContentData({...contentData, synopsis: e.target.value})} className="form-textarea" placeholder="A short summary of your work..." required></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content File (PDF) *</label>
                            <FileUploadInput file={manuscriptFile} onFileChange={handleFileChange(setManuscriptFile)} acceptedFiles=".pdf,.doc,.docx" />
                        </div>
                    </div>
                );
            case 'cover':
                return (
                     <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">Upload Your Book Cover</h3>
                        <p className="text-gray-600">Have a cover design? Upload it here. If not, you can skip this step and our design team can help.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image (JPG, PNG)</label>
                            <FileUploadInput file={coverFile} onFileChange={handleFileChange(setCoverFile)} acceptedFiles="image/jpeg,image/png" />
                        </div>
                    </div>
                );
            case 'payment':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">Submit Your Payment</h3>
                        <p className="text-gray-600">Please complete the payment via the provided instructions and upload your transaction details below.</p>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Number *</label>
                            <input type="text" value={paymentData.transactionId} onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})} className="form-input" placeholder="Enter the transaction ID or reference number" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Photo/Screenshot *</label>
                            <FileUploadInput file={paymentFile} onFileChange={handleFileChange(setPaymentFile)} acceptedFiles="image/*,.pdf" />
                        </div>
                    </div>
                );
            case 'help':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">Need Help?</h3>
                        <p className="text-gray-600">If you have any questions about the self-publication process, our guidelines, or payments, please don't hesitate to reach out to our support team.</p>
                        <div className="bg-blue-50 p-4 rounded-md">
                            <p className="font-semibold text-gray-800">Contact Support</p>
                            <p className="text-gray-600">Email us at: <a href="mailto:publishing@porboi.in" className="text-red-600 hover:underline">publishing@porboi.in</a></p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <ProtectedRoute>
            <Head>
                <title>Self Publication - ChapterOne Bookstore</title>
                <meta name="description" content="Submit your manuscript for a chance to be published. Join our community of authors at ChapterOne." />
            </Head>

            <div className="bg-gray-50 min-h-screen">
                <div className="container section-padding">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-4">Self Publication Portal</h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">Follow the steps below to submit your work for publication. We're excited to see what you've created.</p>
                    </div>

                    <div className="max-w-5xl mx-auto md:grid md:grid-cols-4 md:gap-10">
                        {/* Step Navigation */}
                        <nav className="md:col-span-1 mb-8 md:mb-0">
                            <ul className="space-y-2">
                                {steps.map(step => (
                                    <li key={step.id}>
                                        <button onClick={() => setActiveStep(step.id)} className={`w-full flex items-center p-3 rounded-md text-left transition-colors ${activeStep === step.id ? 'bg-red-600 text-white' : 'hover:bg-gray-200'}`}>
                                            <step.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                                            <span className="text-sm font-medium">{step.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Step Content */}
                        <div className="md:col-span-3">
                            <div className="bg-white p-8 rounded-lg shadow-md">
                                <form onSubmit={handleSubmit}>
                                    {renderStepContent()}
                                    <div className="pt-8 mt-8 border-t border-gray-200">
                                        <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center space-x-2">
                                            <Send className="w-4 h-4" />
                                            <span>{loading ? 'Submitting...' : 'Submit Your Publication'}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

// Reusable File Upload Component
const FileUploadInput = ({ file, onFileChange, acceptedFiles }) => (
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
                <label htmlFor={`file-upload-${acceptedFiles}`} className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id={`file-upload-${acceptedFiles}`} name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept={acceptedFiles} />
                </label>
                <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">File up to 10MB</p>
            {file && <p className="text-sm text-green-600 mt-2">Selected: {file.name}</p>}
        </div>
    </div>
);

export default SelfPublicationPage;
