// pages/about.js
import React from 'react';
import Head from 'next/head';

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About Us - porboi.in</title>
        <meta name="description" content="Learn about the story and mission of porboi.in, a place where timeless classics meet fresh literary voices." />
      </Head>

      <div className="bg-white">
        {/* Page Header */}
        <div className="relative bg-gray-900 text-white py-20" style={{ backgroundImage: "url('https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative container text-center z-10">
            <h1 className="text-4xl lg:text-5xl font-serif mb-4">Our Story</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Where timeless classics meet fresh literary voices.
            </p>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="section-padding container">
          <div className="max-w-4xl mx-auto">
            <div className="prose lg:prose-lg max-w-none text-gray-700">
              <p className="lead">
                Welcome to porboi.in, a place born from a passion for literature. We believe that books are more than just pages—they are journeys, conversations, and connections that span generations. Our mission is to celebrate the richness of Bengali and world literature while championing the next wave of emerging writers.
              </p>
              
              <h2 className="font-serif">What We Do</h2>
              <p>
                At porboi.in, we are dedicated to curating a diverse collection of books and handmade goods for our readers. Our offerings include:
              </p>
              <ul>
                <li><strong>A Wide Selection of Books:</strong> From beloved classics and essential textbooks to rare old books, we have something for every reader.</li>
                <li><strong>Handmade Corner:</strong> Discover unique, handcrafted items that celebrate art and literature.</li>
                <li><strong>Self-Publishing Services:</strong> We provide a platform for aspiring authors to bring their stories to life and share them with the world. We are passionate about fostering new talent and helping writers begin their literary journey.</li>
              </ul>

              <h2 className="font-serif">Our Vision</h2>
              <p>
                We aim to be more than just a bookstore. We strive to be a vibrant community hub for authors, publishers, and readers alike. Whether you're searching for a long-lost favorite, your next great read, or the perfect literary-themed gift, we are here to help you find it. Thank you for being a part of our story.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;