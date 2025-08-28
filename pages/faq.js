// pages/faq.js
import React from 'react';
import Head from 'next/head';

const FAQPage = () => {
  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept UPI, major credit/debit cards, netbanking, popular wallets, and Pay Later options via our secure Razorpay checkout.'
    },
    {
      question: 'Is my payment information secure?',
      answer:
        'Yes. All payments are processed on Razorpay’s secure checkout. Your details are sent over encrypted connections, and we do not store full card details on our servers.'
    },
    {
      question: 'My payment went through but my order isn’t showing—what should I do?',
      answer:
        'Occasionally banks confirm payments with a delay. Most such payments auto-reconcile shortly. If it still doesn’t reflect, the amount is usually reversed by your bank within a few business days. Please share your Razorpay Payment ID with support and we’ll check right away.'
    },
    {
      question: 'How do I track my order?',
      answer:
        'You can track your order from your "My Account" page. Once your order is shipped, you will receive an email with tracking information.'
    },
    {
      question: 'Where do you ship?',
      answer: 'We ship to all locations across India.'
    },
    {
      question: 'How are shipping costs calculated?',
      answer:
        'Shipping costs are calculated at checkout based on your location and the weight of your order. You will be able to see the shipping options and costs before completing your purchase.'
    },
    {
      question: 'How long will it take to receive my order?',
      answer:
        'Orders are typically processed within 1–2 business days. Delivery times vary by location but generally take 5–7 business days.'
    },
    {
      question: 'What is your return policy?',
      answer:
        'We accept returns within 15 days of delivery for items that are damaged, defective, or incorrect. Please contact our customer support team to initiate a return.'
    },
    {
      question: 'Can I cancel my order?',
      answer:
        'You can cancel your order as long as it has not yet been shipped. Please contact us as soon as possible to request a cancellation.'
    },
    {
      question: 'How can I submit my work for publication?',
      answer:
        'We have a dedicated self-publication portal where you can submit your manuscript and other required information. Please visit our "Self Publication" page for more details.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    }))
  };

  return (
    <>
      <Head>
        <title>FAQ - porboi.in</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about orders, payments (via Razorpay), shipping, returns, and more at porboi.in."
        />
        <script
          type="application/ld+json"
          // JSON-LD must be a string
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <div className="bg-white">
        {/* Page Header */}
        <div className="bg-gray-100 py-16">
          <div className="container text-center">
            <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re
              looking for, feel free to contact us.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="section-padding container">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Optional contact block */}
            <div className="mt-12 text-center">
              <p className="text-gray-700">
                Still need help?{' '}
                <a href="/contact" className="underline">
                  Contact support
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
