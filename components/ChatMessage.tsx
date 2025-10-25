import React from "react";

interface ChatMessageProps {
  message: string;
  isOwnMessage: boolean;
  isSystemMessage: boolean;
}

const ChatMessage = ({
  message,
  isOwnMessage,
  isSystemMessage,
}: ChatMessageProps) => {
  return (
    <div
      className={`flex ${
        isSystemMessage
          ? "justify-center"
          : isOwnMessage
          ? "justify-end"
          : "justify-start"
      } mb-3`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm break-words ${
          isSystemMessage
            ? "bg-gray-300 text-gray-700"
            : isOwnMessage
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-900"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;
