"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, Radio } from "@mantine/core";
import Link from "next/link";
import questionsData from "../../../public/Questions.json";

const TestDashboard = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({}); // Store selected options for each question
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60); // 1 minute = 60 seconds
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  const questions = questionsData.questions;
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (remainingTime === 0) {
      setIsTimeUp(true);
      setIsModalOpen(true);
      setIsTestSubmitted(true); // Auto-submit the test when time is up
    } else {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) => {
      const updatedOptions = { ...prev, [currentQuestionIndex]: option };
      return updatedOptions;
    });
  };

  const handleNext = () => {
    if (!answeredQuestions.includes(currentQuestionIndex) && selectedOptions[currentQuestionIndex]) {
      setAnsweredQuestions([...answeredQuestions, currentQuestionIndex]);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    setIsTestSubmitted(true);
    setIsModalOpen(true); // Show the modal when final submit is clicked
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const startFullScreen = () => {
    document.documentElement.requestFullscreen();
    document.addEventListener('keydown', (e) => {
      // Disable ESC and F12
      if (e.key === 'Escape' || e.key === 'F12') {
        e.preventDefault(); // Disable ESC and F12 to prevent leaving fullscreen or opening dev tools
      }
    });

    // Disable right-click
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault(); // Disable right-click context menu
    });
  };

  return (
    <div className="container">
      {/* Left Bar */}
      <div className="left">
        <div className="header">
          <h2>Online Screening Test</h2>
          <p>
            Remaining Time: <b>{Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60} min left</b>
          </p>
        </div>
        <div className="question-container" style={{margin:"20px"}}>
          <h3 className="mb-4">
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </h3>
          <div className="answer-list">
            <ul>
              {currentQuestion.options.map((option, index) => (
                <li key={index}>
                  <Radio
                    label={option}
                    value={option}
                    checked={selectedOptions[currentQuestionIndex] === option}
                    onChange={() => handleOptionChange(option)}
                    style={{marginTop:'10px'}}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="skip-button">
          <Button
            style={{margin:'10px'}}
            variant="filled"
            color="red"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || isTestSubmitted}
          >
            Previous
          </Button>
          <Button
            style={{margin:'10px'}}
            variant="filled"
            color="blue"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1 || isTestSubmitted}
          >
            Next
          </Button>
        </div>
        <Button
          variant="filled"
          color="green"
          onClick={handleFinalSubmit}
          disabled={isTestSubmitted}
          style={{ margin: "20px" }}
        >
          Final Submit
        </Button>
      </div>

      {/* Right Bar */}
      <div className="right">
        <p>Total Questions: {questions.length}</p>
        <div className="list">
          <ul>
            {questions.map((_, index) => (
              <li
                key={index}
                style={{
                  backgroundColor:
                    currentQuestionIndex === index
                      ? "orangered"
                      : answeredQuestions.includes(index)
                      ? "green"
                      : "white",
                  color:
                    currentQuestionIndex === index || answeredQuestions.includes(index)
                      ? "white"
                      : "black",
                  cursor: "pointer",
                  height: "40px", // Adjust this to your desired height
                  lineHeight: "20px", // Ensures text is vertically centered
                  padding: "10px 20px", // Adjust padding for internal spacing
                  marginBottom: "5px", // Optional: space between items
                  borderRadius: "5px", // Optional: rounded corners for the list items
                }}
                onClick={() => handleQuestionClick(index)}
              >
                {index + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Timeout Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        centered
        size="sm"
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
        <h1>{isTimeUp ? "Time's Up!" : "Test Submitted"}</h1>
        <p>{isTimeUp ? "You have run out of time." : "Your test has been successfully submitted."}</p>
        <Link href="/TestDashboard">
          <Button
            style={{
              marginTop: "20px",
              backgroundColor: "#f44336",
              color: "#fff",
            }}
            onClick={startFullScreen}
          >
            Go to Dashboard
          </Button>
        </Link>
      </Modal>
    </div>
  );
};

export default TestDashboard;
