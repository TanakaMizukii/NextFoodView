'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import './App.css';
import KaishuStartPanel from "@/components/KaishuStartPanel";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    router.push('/viewer')
  };

  return (
    <KaishuStartPanel onUpdate={handleStart} loading={loading} />
  );
}
