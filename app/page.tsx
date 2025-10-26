"use client";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socketClient";

export default function Home() {
  const [room, setRoom] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    socket.on("user-joined", (message: string) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    return () => {
      socket.off("user-joined");
      socket.off("message");
    };
  }, []);

  const handleJoinRoom = (room: string) => {
    // if (!roomName.trim()) return alert("Please enter a room name!");
    if (room && userName) {
      socket.emit("join-room", { room: room, userName: userName });
    }
    setJoined(true);
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    const newMessage = { sender: userName || "You", message };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex mt-24 justify-center w-full">
      {!joined ? (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">Join a room</h1>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
              onChange={(e) => setUserName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter room name"
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
              onChange={(e) => setRoom(e.target.value)}
            />

            <button
              onClick={() => handleJoinRoom(room)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">
            Room: {room || "Unnamed Room"}
          </h1>

          <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center mt-48">
                No messages yet. Start chatting!
              </p>
            ) : (
              messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  sender={msg.sender}
                  message={msg.message}
                  isOwnMessage={msg.sender === userName}
                />
              ))
            )}
          </div>

          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
