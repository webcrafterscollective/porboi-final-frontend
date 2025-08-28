// pages/contact.js
import React from 'react';
import Head from 'next/head';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <>
      <Head>
        <title>Contact Us - porboi.in</title>
        <meta name="description" content="Get in touch with the porboi.in team. We're here to help with your orders, questions, and publishing inquiries." />
      </Head>

      <div className="bg-white">
        {/* Page Header */}
        <div className="bg-gray-100 py-16">
          <div className="container text-center">
            <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-4">Get In Touch</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question about an order or our services, our team is ready to assist.
            </p>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="section-padding container">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif text-heading mb-4">Customer Support</h2>
                <p className="text-gray-600 mb-4">For general inquiries, order-related questions, or assistance with our website, please contact our customer support team.</p>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-3 text-red-600" />
                    <a href="mailto:support@porboi.in" className="hover:text-red-600">support@porboi.in</a>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-5 h-5 mr-3 text-red-600" />
                    <a href="https://wa.me/7044726990" target="_blank" rel="noopener noreferrer" className="hover:text-red-600">+91 7044726990 (WhatsApp available)</a>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-3 text-red-600" />
                    <span>Monday – Friday, 10:00 AM to 6:00 PM (IST)</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-serif text-heading mb-4">Self-Publishing Inquiries</h2>
                <p className="text-gray-600 mb-4">For authors interested in our self-publishing services, please reach out to our publishing department.</p>
                 <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-3 text-red-600" />
                    <a href="mailto:publishing@porboi.in" className="hover:text-red-600">publishing@porboi.in</a>
                  </div>
              </div>
            </div>

            {/* Business Address */}
            <div className="bg-gray-50 p-8 rounded-lg">
               <h2 className="text-2xl font-serif text-heading mb-4">Our Address</h2>
                <div className="space-y-3">
                   <div className="flex items-start text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 mt-1 text-red-600 flex-shrink-0" />
                    <div>
                        <p className="font-semibold">porboi.in</p>
                        <p>123 Literary Lane,</p>
                        <p>Kolkata, West Bengal, 700001</p>
                        <p>India</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;