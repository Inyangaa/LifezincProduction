import React from "react";

export default function DataDeletionPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div style={{
      maxWidth: "900px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "system-ui, sans-serif",
      lineHeight: 1.7,
      color: "#123",
    }}>

      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 20 }}>
        Data Deletion Instructions
      </h1>

      <p><strong>Effective Date:</strong> January 2025</p>
      <p><strong>Last Updated:</strong> January 2025</p>

      <h2>1. Introduction</h2>
      <p>
        LifeZinc allows you to delete your account, journal entries, and personal
        data at any time. These steps outline how you can remove your data or
        request full deletion. Requests are processed within 30 days.
      </p>

      <h2>2. How to Delete Your Data Inside the App</h2>

      <h3>A. Delete Journal Entries</h3>
      <ul>
        <li>Open the Journal page</li>
        <li>Select the entry you want to delete</li>
        <li>Tap "Delete Entry" and confirm</li>
      </ul>

      <h3>B. Delete Saved Favorites / Reframes</h3>
      <ul>
        <li>Go to Favorites</li>
        <li>Select an item</li>
        <li>Tap "Remove from Favorites"</li>
      </ul>

      <h3>C. Delete Your Account (If Enabled)</h3>
      <ul>
        <li>Open Settings</li>
        <li>Select "Delete Account"</li>
        <li>Confirm deletion</li>
      </ul>

      <p>
        Deleting your account removes all journals, preferences, and personal
        data associated with your profile.
      </p>

      <h2>3. Request Full Manual Data Deletion</h2>
      <p>
        You may also request manual deletion of your data by emailing:
        <br/>
        <strong>support@lifezinc.com</strong>
      </p>
      <p>Use the subject line: <strong>"Data Deletion Request"</strong></p>

      <p>Please include the email associated with your LifeZinc account.</p>

      <h2>4. What Gets Deleted</h2>
      <ul>
        <li>Journal entries</li>
        <li>Favorites and reframes</li>
        <li>User account details</li>
        <li>Email address and preferences</li>
        <li>Reflection history</li>
        <li>Therapist search preferences</li>
      </ul>

      <h2>5. What Cannot Be Deleted</h2>
      <p>
        Anonymous analytics and security logs cannot be deleted because they do
        not contain personal information.
      </p>

      <h2>6. Contact Us</h2>
      <p>
        For questions about data deletion, email us at:
        <br/>
        <strong>support@lifezinc.com</strong>
      </p>

      <button
        onClick={() => onNavigate("home")}
        style={{
          marginTop: 30,
          padding: "12px 24px",
          borderRadius: 999,
          background: "#1AB0A8",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        Back to Home
      </button>
    </div>
  );
}
