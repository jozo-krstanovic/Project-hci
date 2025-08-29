"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation';
import type { User } from "@supabase/supabase-js";

export default function AccountSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState("/assets/palestra-account.png");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login"); // Redirect to login if not authenticated
        return;
      }
      setUser(user);
      setNickname(user.user_metadata?.full_name || user.email?.split('@')[0] || ""); // Use full_name or part of email
      setEmail(user.email || "");
      setProfileImage(user.user_metadata?.avatar_url || "/assets/palestra-account.png");
    };

    getUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      }
      else if(session.user !== user){
        setUser(session.user)
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, user]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be logged in to upload a profile picture.");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(filePath);

        const { error: updateUserError } = await supabase.auth.updateUser({
          data: { avatar_url: publicUrl },
        });

        if (updateUserError) {
          throw updateUserError;
        }

        setProfileImage(publicUrl);
        setMessage("Profile picture updated successfully!");
      } catch (err) {
        setError((err as Error).message);
        console.error("Error uploading profile picture:", err);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveNickname = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: { full_name: nickname },
      });
      if (updateError) throw updateError;
      setMessage("Nickname updated successfully!");
    } catch (err) {
      setError((err as Error).message);
      console.error("Error updating nickname:", err);
    }
  };

  const handleSaveEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!email) {
      setError("Email cannot be empty.");
      return;
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        email: email,
      });
      console.log(data);
      if (updateError) throw updateError;
      setMessage("Email updated successfully! Please check your new email for a confirmation link.");
    } catch (err) {
      setError((err as Error).message);
      console.error("Error updating email:", err);
    }
  };

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!currentPassword) {
      setError("Current password is required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (!newPassword) {
      setError("New password cannot be empty.");
      return;
    }

    try {
      // Verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: currentPassword,
      });

      if (signInError) {
        setError("Invalid current password.");
        return;
      }

      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;
      setMessage("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword(""); // Clear current password field as well
    } catch (err) {
      setError((err as Error).message);
      console.error("Error updating password:", err);
    }
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
                  fill
                  style={{objectFit: "cover"}}
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
            <form className="space-y-4" onSubmit={handleSaveNickname}>
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
            <form className="space-y-4" onSubmit={handleSaveEmail}>
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
          <form className="space-y-4" onSubmit={handleChangePassword}>
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
      {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
    </div>
  );
}