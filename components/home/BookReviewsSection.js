import React from 'react';

const BookReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      bookTitle: "রক্তিম সাইফার",
      author: "এলেনা ভ্যান্স",
      reviewExcerpt: "ইতিহাস ও রহস্যের অসাধারণ মেলবন্ধন—এক নিঃশ্বাসে পড়ে ফেলার মতো এক অনন্য থ্রিলার।",
      reviewer: "সাহিত্য সমাচার",
      coverImage: "https://images.pexels.com/photos/1314544/pexels-photo-1314544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: 2,
      bookTitle: "আগামীর প্রতিধ্বনি",
      author: "মার্কাস চেন",
      reviewExcerpt: "মানবজাতির ভবিষ্যৎ নিয়ে দারুণ এক কল্পবিজ্ঞান যাত্রা—গভীর, চিন্তাশীল এবং মননে গেঁথে থাকার মতো।",
      reviewer: "ভবিষ্যতের পাতা",
      coverImage: "https://images.pexels.com/photos/2177013/pexels-photo-2177013.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: 3,
      bookTitle: "যেখানে নদী বাঁক নেয়",
      author: "সোফিয়া গার্সিয়া",
      reviewExcerpt: "ভালবাসা ও হারানোর এক কবিতার মতো লেখা গল্প—মনকে নাড়া দেওয়ার মতো এক দুর্দান্ত আত্মপ্রকাশ।",
      reviewer: "পাঠক মাসিক",
      coverImage: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-subheading mb-4">সমালোচকের চোখে</p>
          <h2 className="text-3xl lg:text-4xl font-serif text-heading mb-6">
            প্রি-অর্ডার বইয়ের পর্যালোচনা
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            আসন্ন প্রকাশিতব্য বইগুলো সম্পর্কে সমালোচকদের প্রথম প্রতিক্রিয়া। আপনার প্রিয় বইটি প্রি-অর্ডার করার আগে জেনে নিন কী বলছেন তারা।
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg overflow-hidden flex flex-col group">
              <div className="relative">
                <img
                  src={review.coverImage}
                  alt={review.bookTitle}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  {review.author}
                </p>
                <h3 className="text-xl font-serif text-heading mb-4">
                  {review.bookTitle}
                </h3>
                <blockquote className="text-gray-600 text-sm leading-relaxed border-l-4 border-red-200 pl-4 flex-grow">
                  "{review.reviewExcerpt}"
                  <footer className="mt-2 text-xs font-semibold text-gray-500">
                    - {review.reviewer}
                  </footer>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookReviewsSection;
