"use client";

import Image from "@/components/shared/SmartImage";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import Spinner from "@/components/shared/Spinner";
import Testimonials from "@/components/home/Testimonials";
import ConnectWithExperts from "@/components/home/ConnectWithExperts";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

interface Event {
  _id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  eventDate?: string;
  location?: string;
}

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ success: boolean; events: Event[] }>(
          "/api/resources/events"
        );
        if (response.success && response.events) {
          setEvents(response.events);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="w-full bg-[#1a1a2e] text-white py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Events</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Upcoming and past events, webinars, and industry gatherings.
          </p>
        </div>
      </section>

      {/* List */}
      <section className="w-full py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex justify-center gap-3 py-16">
              <Spinner size="sm" />
              <span className="text-sm text-gray-500">Loading events…</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No events available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {events.map((event) => (
                <Link
                  key={event._id}
                  href={`/resources/events/${event.slug}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden block"
                >
                  <div className="relative w-full h-[200px] sm:h-[220px] bg-gray-100">
                    <Image
                      src={event.image || PLACEHOLDER_IMAGE}
                      fill
                      alt={event.title}
                      className="object-cover"
                      unoptimized={event.image?.startsWith("http")}
                    />
                  </div>
                  <div className="p-5">
                    {event.eventDate && (
                      <p className="text-sm font-medium text-blue-600 mb-1">
                        {formatDate(event.eventDate)}
                      </p>
                    )}
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2">
                      {event.title}
                    </h2>
                    {event.location && (
                      <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                    <span className="inline-block mt-4 text-blue-600 font-medium text-sm hover:underline">
                      View event →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Testimonials />
      <ConnectWithExperts />
    </>
  );
}
