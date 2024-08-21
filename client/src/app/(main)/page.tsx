"use client";
import { socket } from "@/lib";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to server");
      });
    }
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-semibold">Hello World!</h1>
    </section>
  );
}
