// components/home/AuthorsSection.js
import React from 'react';

const AuthorsSection = () => {
  const authors = [
    {
      id: 1,
      name: "সুনীল গঙ্গোপাধ্যায়",
      role: "কথাসাহিত্যিক ও কবি",
      image: "https://www.poetryinternational.com/media/3/_resized/21074_bgr_sunil_g_w336.jpg",
      description: "‘সেই সময়’, ‘প্রথম আলো’ ও কাকাবাবু সিরিজের স্রষ্টা—বাংলা সাহিত্যের আধুনিক মুখ, যিনি গল্পে মিশিয়েছেন ইতিহাস, প্রেম ও অভিযানের রোমাঞ্চ।"
    },
    {
      id: 2,
      name: "শীর্ষেন্দু মুখোপাধ্যায়",
      role: "উপন্যাসিক ও ছোটগল্পকার",
      image: "https://niyogibooksindia.com/wp-content/uploads/2023/10/Shirshendu-Mukhopadhyay_My-Paper-Half.jpg", 
      description: "‘মনোজদের অদ্ভুত বাড়ি’ থেকে ‘গয়নার বাক্স’—অভিযান, রহস্য আর শৈশবের রঙিন দুনিয়াকে জীবন্ত করে তোলার এক অনন্য গল্পকার।"
    },
    {
      id: 3,
      name: "বুদ্ধদেব গুহ",
      role: "প্রকৃতিপ্রেমী সাহিত্যিক",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR53xlnmfYcDVV3h47NJoaHmU0FwbQw1hg1Ow&s", 
      description: "‘ঋজুদা’ ও ‘মাধুকরী’–র স্রষ্টা, যার লেখায় প্রকৃতির সৌন্দর্য আর মানুষের অন্তর্দ্বন্দ্ব মিলেমিশে এক অপূর্ব মেলবন্ধন তৈরি করে।"
    },
    {
      id: 4,
      name: "মহাশ্বেতা দেবী",
      role: "সমাজসচেতন লেখিকা",
      image: "https://images.hindustantimes.com/rf/image_size_640x362/HT/p2/2016/07/28/Pictures/mahasweta-mahasweta-ghatsila-jharkhand-activist-struggle-eminent_08048120-54d4-11e6-bc43-9f8bec77897c.jpg",
      description: "‘হাজার চুরাশির মা’ ও ‘অরণ্যের অধিকার’–এর মতো সৃষ্টি দিয়ে শোষিত মানুষের সংগ্রামকে বিশ্বসাহিত্যে তুলে ধরেছেন এই কিংবদন্তি লেখিকা।"
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-subheading mb-4">আমাদের সাহিত্যিক অঙ্গনের তারকারা</p>
          <h2 className="text-3xl lg:text-4xl font-serif text-heading mb-6">
            মাসের নির্বাচিত লেখক
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            বাংলা সাহিত্যের শ্রেষ্ঠ স্রষ্টাদের নিয়ে আমাদের এই মাসের বিশেষ আয়োজন। 
            তাদের অমর সৃষ্টি আপনাকে নিয়ে যাবে কল্পনা, ইতিহাস আর বাস্তবের অনন্য ভ্রমণে।
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {authors.map((author) => (
            <div key={author.id} className="text-center group">
              {/* Author Image */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
                  {author.image ? (
                    <img
                      src={author.image}
                      alt={author.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Author Info */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {author.role}
                </p>
                <h3 className="text-xl font-serif text-heading">
                  {author.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {author.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuthorsSection;
