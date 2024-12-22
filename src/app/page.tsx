"use client";
import React, { useState, useEffect } from "react";
import { Button, Modal } from "@mantine/core";
import Link from "next/link";

const Home = () => {
  // State to manage button enabled/disabled
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to show the current time
  const [currentTime, setCurrentTime] = useState("");

  // Target date and time for enabling the button
  const targetDateTime = new Date("2024-12-20T10:56:00");

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12; // Convert to 12-hour format
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };

    const checkDate = () => {
      const currentDateTime = new Date();
      if (currentDateTime >= targetDateTime) {
        setIsButtonEnabled(true); // Enable button when the target time is met
      } else {
        setIsButtonEnabled(false); // Keep button disabled if the target time is not reached
      }
    };

    // Update time every second
    const timer = setInterval(() => {
      updateCurrentTime();
      checkDate();
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [targetDateTime]);

  // Function to trigger full-screen mode
  const enableFullScreen = () => {
    const docElement = document.documentElement;
    if (docElement.requestFullscreen) {
      docElement.requestFullscreen();
    } else if (docElement.mozRequestFullScreen) {
      docElement.mozRequestFullScreen(); // Firefox
    } else if (docElement.webkitRequestFullscreen) {
      docElement.webkitRequestFullscreen(); // Chrome, Safari, Opera
    } else if (docElement.msRequestFullscreen) {
      docElement.msRequestFullscreen(); // IE/Edge
    }
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      <p style={{ marginBottom: "20px", fontSize: "1.2rem", color: "#555" }}>
        Current Time: {currentTime}
      </p>

      {/* "Let's Go" Button */}
      <Button
        disabled={!isButtonEnabled}
        onClick={() => setIsModalOpen(true)}
        style={{
          fontSize: "1.2rem",
          padding: "10px 20px",
          backgroundColor: isButtonEnabled ? "#1D4ED8" : "#A5B4FC",
          color: "#fff",
          cursor: isButtonEnabled ? "pointer" : "not-allowed",
        }}
      >
        Let's Go
      </Button>

      {/* Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        centered
        size="sm" // Adjust modal size to small
        withCloseButton={false}
        styles={{
          modal: {
            textAlign: "center",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "20px",
            borderRadius: "10px",
          },
          body: { fontSize: "1.1rem" },
        }}
      >
        <h1>Warning</h1>
        <p>Are you sure you want to start the test?</p>
        <Link href="/TestDashboard">
          <Button
            style={{
              marginTop: "20px",
              backgroundColor: "#f44336",
              color: "#fff",
            }}
            onClick={enableFullScreen}
          >
            Start Test
          </Button>
        </Link>
      </Modal>
    </div>
  );
};

export default Home;
