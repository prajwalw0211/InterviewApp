import { chatSession } from "@/utils/GeminiAIModel";
import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionsSection({
  interviewQuestions,
  activeQuestionIndex,
  setActiveQuestionIndex,
  userAnswer,
  setUserAnswer,
}) {
  // console.log(interviewQuestions);

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech");
    }
  };

  const handleTextChange = (e) => {
    setUserAnswer(e.target.value); // Update the userAnswer with manual input
  };

  return (
    interviewQuestions && (
      <div className="p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {interviewQuestions &&
            interviewQuestions.map((question, index) => (
              <h2
                className={`p-2 rounded-lg text-xs md:text-sm text-center cursor-pointer 
                ${
                  activeQuestionIndex == index
                    ? " text-white bg-primary"
                    : "bg-secondary"
                }`}
                key={index}
                onClick={() => setActiveQuestionIndex(index)}
              >
                Question #{index + 1}
              </h2>
            ))}
        </div>
        <h2 className="mt-5 mb-2 text-md md:text-md">
          {interviewQuestions[activeQuestionIndex]?.Question ||
            interviewQuestions[activeQuestionIndex]?.question}
        </h2>
        <Volume2
          className="cursor-pointer"
          onClick={() =>
            textToSpeech(
              interviewQuestions[activeQuestionIndex]?.Question ||
                interviewQuestions[activeQuestionIndex]?.question
            )
          }
        />
        <textarea
          className="my-3 p-3 w-full h-25 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type your answer here..."
          value={userAnswer}
          onChange={handleTextChange}
        />
        <div className="mt-2 border rounded-lg p-5 bg-blue-100">
          <h2 className="flex gap-2 items-center text-primary">
            <Lightbulb />
            <strong>Note: </strong>
          </h2>
          <h2 className="text-sm text-primary my-2">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
