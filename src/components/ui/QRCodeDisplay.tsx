"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  roomCode: string;
  size?: number;
}

export function QRCodeDisplay({ roomCode, size = 200 }: QRCodeDisplayProps) {
  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/join?code=${roomCode}`
      : `/join?code=${roomCode}`;

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <QRCodeSVG
          value={joinUrl}
          size={size}
          level="M"
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
      <p className="text-gray-500 mt-3 text-sm">Scan to join instantly</p>
    </div>
  );
}
