"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AccountSettingsPage() {
  const [nickname, setNickname] = useState("current_user_nickname"); // Placeholder for nickname
  const [email, setEmail] = useState("user@example.com"); // Placeholder for email
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState("/assets/palestra-account.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-background px-4 sm:px-10 md:px-[178px] py-10">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-card border border-border rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Profile Settings</h2>

            {/* Profile Picture */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative w-24 h-24">
                <Image
                  src={profileImage}
                  alt="Profile Picture"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  onClick={handleUploadClick}
                  variant="outline"
                >
                  Upload New Picture
                </Button>
                <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB.</p>
              </div>
            </div>

            {/* Nickname Form */}
            <form className="space-y-4">
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-card-foreground">Nickname</label>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="mt-1 block w-full p-3 bg-input border border-border rounded-md shadow-sm focus:ring-ring focus:border-ring"
                />
              </div>
              <div className="text-right">
                <Button type="submit">
                  Save Nickname
                </Button>
              </div>
            </form>
          </div>

          {/* Contact Information Section */}
          <div className="bg-card border border-border rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Contact Information</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-card-foreground">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full p-3 bg-input border border-border rounded-md shadow-sm focus:ring-ring focus:border-ring"
                />
              </div>
              <div className="text-right">
                <Button type="submit">
                  Save Email
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Security Section */}
        <div className="bg-card border border-border rounded-xl shadow-md p-8 lg:row-span-2">
          <h2 className="text-2xl font-bold mb-6 text-card-foreground">Security Settings</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-card-foreground">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full p-3 bg-input border border-border rounded-md shadow-sm focus:ring-ring focus:border-ring"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-card-foreground">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full p-3 bg-input border border-border rounded-md shadow-sm focus:ring-ring focus:border-ring"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-card-foreground">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full p-3 bg-input border border-border rounded-md shadow-sm focus:ring-ring focus:border-ring"
              />
            </div>
            <div className="text-right">
              <Button type="submit">
                Change Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}