// pages/event.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Mic, Users } from 'lucide-react';
import { api } from '../lib/api'; // We will update this file next

const EventPage = ({ upcomingEvents, pastEvents }) => {
  return (
    <>
      <Head>
        <title>Upcoming Events - ChapterOne Bookstore</title>
        <meta name="description" content="Join us for author signings, book launches, and literary events. See what's happening at ChapterOne." />
      </Head>

      <div className="bg-white">
        {/* Page Header */}
        <div className="bg-gray-900 text-white py-20" style={{ backgroundImage: "url('https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="container text-center bg-black bg-opacity-50 py-10 rounded-lg">
            <h1 className="text-4xl lg:text-5xl font-serif mb-4">Literary Events</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Connect with authors, discover new books, and celebrate the world of literature with our community.
            </p>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="section-padding container">
          <h2 className="text-3xl font-serif text-center text-heading mb-12">Upcoming Events</h2>
          <div className="space-y-16">
            {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
              <div key={event.id} className="grid md:grid-cols-3 gap-8 items-center group">
                <div className="md:col-span-1">
                  <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /><span>{event.date}</span></div>
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /><span>{event.time}</span></div>
                  </div>
                  <h3 className="text-2xl font-serif text-heading mb-3 group-hover:text-red-600 transition-colors">
                    <Link href={`/event/${event.slug}`}>{event.title}</Link>
                  </h3>
                  <div className="flex items-center text-md text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{event.venue}</span>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                  <Link href={`/event/${event.slug}`}>
                    <button className="btn-secondary">View Details & RSVP</button>
                  </Link>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-600">No upcoming events scheduled. Please check back soon!</p>
            )}
          </div>
        </div>
        
        {/* Past Events Section */}
        {pastEvents.length > 0 && (
            <div className="bg-gray-50">
                <div className="section-padding container">
                    <h2 className="text-3xl font-serif text-center text-heading mb-12">From Our Archives: Past Events</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pastEvents.map(event => (
                            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                                <div className="aspect-w-16 aspect-h-9">
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-gray-500 mb-1">{event.date}</p>
                                    <h3 className="text-lg font-serif text-heading mb-3">{event.title}</h3>
                                    <Link href={`/event/${event.slug}`}>
                                        <span className="text-red-600 font-semibold text-sm hover:underline">View Gallery &rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* CTA Section */}
        <div className="section-padding container text-center">
             <Mic className="w-12 h-12 text-red-600 mx-auto mb-4" />
             <h2 className="text-3xl font-serif text-heading mb-4">Host Your Literary Event</h2>
             <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Looking for a venue for your book launch, signing, or workshop? Our bookstore offers a unique and intimate setting.
             </p>
             <Link href="/contact">
                <button className="btn-primary">
                    Inquire About Hosting
                </button>
             </Link>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  // In a real app, you would fetch all events and then filter them.
  // const allEvents = await api.getEvents();
  
  const mockEvents = [
    { id: 1, title: "An Evening with Elena Vance", slug: "elena-vance-book-signing", date: "2025-08-15", time: "7:00 PM", venue: "ChapterOne Downtown Flagship Store", description: "Join bestselling author Elena Vance for a reading and signing of her latest historical thriller. A Q&A session will follow.", image: "https://images.pexels.com/photos/3772509/pexels-photo-3772509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { id: 2, title: "Poetry Open Mic Night", slug: "poetry-open-mic-august", date: "2025-08-22", time: "8:00 PM", venue: "The Poet's Corner Café", description: "Share your own work or listen to the vibrant voices of our local poetry community. Sign-ups start at 7:30 PM.", image: "https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { id: 3, title: "Sci-Fi Symposium with Marcus Chen", slug: "sci-fi-symposium-marcus-chen", date: "2025-09-05", time: "6:30 PM", venue: "Online Webinar (Virtual Event)", description: "A deep dive into the themes of 'Echoes of Tomorrow' with the author himself. This virtual event will explore the future of AI and society.", image: "https://images.pexels.com/photos/574282/pexels-photo-574282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { id: 4, title: "Children's Story Time", slug: "childrens-story-time-july", date: "2024-07-20", time: "11:00 AM", venue: "ChapterOne Kids Section", description: "A fun-filled morning of stories and activities for our youngest readers. Featuring the works of local children's authors.", image: "https://images.pexels.com/photos/1647214/pexels-photo-1647214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { id: 5, title: "Summer Reading Gala", slug: "summer-reading-gala-2024", date: "2024-06-15", time: "7:00 PM", venue: "Grand City Ballroom", description: "A look back at our biggest event of last summer, celebrating the joy of reading with guest authors and live music.", image: "https://images.pexels.com/photos/1167021/pexels-photo-1167021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }
  ];

  const currentDate = new Date();
  const upcomingEvents = mockEvents
    .filter(event => new Date(event.date) >= currentDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
    
  const pastEvents = mockEvents
    .filter(event => new Date(event.date) < currentDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    props: {
      upcomingEvents,
      pastEvents,
    },
    revalidate: 3600,
  };
}

export default EventPage;
