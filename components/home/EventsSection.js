// components/home/EventsSection.js
import React from 'react';
import Link from 'next/link';

const EventsSection = () => {
  const events = [
    {
      id: 1,
      date: "21.07.2019",
      location: "LA, CALIFORNIA",
      title: "Festival of Books",
      status: "available",
      link: "/events/festival-of-books"
    },
    {
      id: 2,
      date: "25.07.2019", 
      location: "PARIS, FRANCE",
      title: "Book Signing",
      status: "sold_out",
      link: "/events/book-signing"
    },
    {
      id: 3,
      date: "26.07.2019",
      location: "WASHINGTON, US", 
      title: "Book Fair",
      status: "available",
      link: "/events/book-fair"
    },
    {
      id: 4,
      date: "31.07.2019",
      location: "MADRID, SPAIN",
      title: "Promotion Book", 
      status: "available",
      link: "/events/promotion-book"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-subheading mb-4">EVENTS</p>
          <h2 className="text-3xl lg:text-4xl font-serif text-heading mb-6">
            Book promotions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Events List */}
        <div className="max-w-4xl mx-auto space-y-8">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              {/* Date & Location */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 mb-4 lg:mb-0">
                <div className="text-sm text-gray-500 uppercase tracking-wide mb-2 lg:mb-0">
                  {event.date} / {event.location}
                </div>
              </div>

              {/* Event Title */}
              <div className="flex-1 lg:px-8">
                <h3 className="text-xl font-serif text-heading mb-2 lg:mb-0">
                  {event.title}
                </h3>
              </div>

              {/* Action Button */}
              <div className="mt-4 lg:mt-0">
                {event.status === 'sold_out' ? (
                  <button 
                    disabled
                    className="px-6 py-3 bg-gray-400 text-white rounded-md font-medium cursor-not-allowed"
                  >
                    SOLD OUT
                  </button>
                ) : (
                  <Link href={event.link}>
                    <button className="btn-secondary">
                      SEE TICKETS
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;