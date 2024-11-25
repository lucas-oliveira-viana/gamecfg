"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

type CFG = {
  id: number;
  file_name: string;
  link_identifier: string;
  created_at: string;
};

export function CFGList({ userId }: { userId: number }) {
  const [cfgs, setCfgs] = useState<CFG[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCFGs = async () => {
      try {
        const response = await fetch(`/api/user-cfgs?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch CFGs");
        }
        const data = await response.json();
        setCfgs(data);
      } catch (err) {
        setError("Failed to load CFGs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCFGs();
  }, [userId]);

  const handleDelete = async (cfgId: number) => {
    try {
      const response = await fetch(`/api/delete-cfg`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ cfgId }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete CFG");
      }
      setCfgs(cfgs.filter((cfg) => cfg.id !== cfgId));
    } catch (err) {
      setError("Failed to delete CFG. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-4 bg-black border-gray-700">
        <CardContent className="pt-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-4 bg-black border-gray-700">
        <CardContent className="pt-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4 bg-black border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Your CFGs</CardTitle>
      </CardHeader>
      <CardContent>
        {cfgs.length === 0 ? (
          <p className="text-gray-400">You haven't uploaded any CFGs yet.</p>
        ) : (
          <ul className="space-y-4">
            {cfgs.map((cfg) => (
              <li
                key={cfg.id}
                className="flex items-center justify-between bg-gray-800 p-4 rounded-md"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {cfg.file_name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Created: {new Date(cfg.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/config/${cfg.link_identifier}`}>View</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(cfg.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
