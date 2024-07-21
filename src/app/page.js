"use client";
import { useEffect, useState } from "react";
import CategoryPill from "./components/CategoryPill";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import VideoItem from "./components/VideoItem";
import { categories } from "./constants"; // Removed import of videos

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [videos, setVideos] = useState([]); // State to hold fetched videos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (window.innerWidth >= 768) setIsSidebarOpen(true);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/xnxx'); // Adjust API endpoint if necessary
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-h-screen flex flex-col overflow-hidden dark:bg-neutral-900">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex overflow-auto">
        <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div
          onClick={toggleSidebar}
          className={`md:hidden ${
            !isSidebarOpen && "opacity-0 pointer-events-none"
          } transition-all bg-black bg-opacity-50 h-screen w-full fixed left-0 top-0 z-20`}
        ></div>

        <div
          className={`w-full px-4 overflow-x-hidden custom_scrollbar ${
            isSidebarOpen && "hide_thumb"
          }`}
        >
          <div className="sticky bg-white top-0 z-10 pb-3 flex gap-3 overflow-y-auto no_scrollbar dark:bg-neutral-900">
            {categories.map((category) => (
              <CategoryPill key={category} category={category} />
            ))}
          </div>

          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] mt-5 pb-6">
            {videos.map((video) => (
              <VideoItem key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
