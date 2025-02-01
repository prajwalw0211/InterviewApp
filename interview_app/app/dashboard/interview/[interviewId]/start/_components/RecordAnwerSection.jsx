"use client";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import {
//   Camera,
//   CameraOff,
//   Loader2,
//   Mic,
//   StopCircle,
//   WebcamIcon,
// } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import useSpeechToText from "react-hook-speech-to-text";
// import Webcam from "react-webcam";
// import { chatSession } from "@/utils/GeminiAIModel";
// import { db } from "@/utils/db";
// import { UserAnswer } from "@/utils/schema";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment";

// function RecordAnswerSection({
//   userAnswer,
//   setUserAnswer,
//   interviewQuestions,
//   activeQuestionIndex,
//   interviewData,
// }) {
//   const [webCamEnabled, setWebCamEnabled] = useState(false);
//   const { user } = useUser();
//   const [loading, setLoading] = useState(false);
//   const {
//     error,
//     interimResult,
//     isRecording,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//   } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false,
//   });

//   useEffect(() => {
//     if (results.length > 0) {
//       const latestTranscript = results[results.length - 1]?.transcript;
//       setUserAnswer((prevAns) => prevAns + latestTranscript);
//     }
//   }, [results, setUserAnswer]);

//   const startStopRecording = () => {
//     if (isRecording) {
//       stopSpeechToText();
//       if (results[results.length - 1]?.transcript?.length < 10) {
//         toast("Error while saving your answer, please record again");
//       }
//     } else {
//       startSpeechToText();
//       setUserAnswer("");
//     }
//   };
//   const submitUserAnswer = async () => {
//     setLoading(true);
//     const feedbackPrompt = `
//   {
//     "Question": "${
//       interviewQuestions[activeQuestionIndex]?.question ||
//       interviewQuestions[activeQuestionIndex]?.Question
//     }",
//     "User Answer": "${userAnswer}",
//     "Instructions": "Based on the question and user answer, please provide the following in JSON format:
//       1. A rating for the answer (between 1 to 10).
//       2. Feedback in 3 to 5 sentences on areas of improvement.
//       3. A list of missed keywords in the answer."
//   }
// `;
//     const result = await chatSession.sendMessage(feedbackPrompt);
//     const jsonMockResp = result.response
//       .text()
//       .replace("```json", "")
//       .replace("```", "");
//     const JsonFeedbackResp = JSON.parse(jsonMockResp);
//     // console.log(JsonFeedbackResp);
//     const resp = await db.insert(UserAnswer).values({
//       mockIdRef: interviewData?.mockId,
//       question:
//         interviewQuestions[activeQuestionIndex]?.question ||
//         interviewQuestions[activeQuestionIndex]?.Question,
//       correctAns:
//         interviewQuestions[activeQuestionIndex]?.answer ||
//         interviewQuestions[activeQuestionIndex]?.Answer,
//       userAns: userAnswer,
//       feedback: JsonFeedbackResp?.feedback,
//       rating: JsonFeedbackResp?.rating,
//       userEmail: user?.primaryEmailAddress?.emailAddress,
//       createdAt: moment().format("DD-MM-yyyy"),
//       missedKeywords: JsonFeedbackResp?.missed_keywords,
//     });

//     if (resp) {
//       toast("User Answer recorded successfully", {
//         duration: 1000,
//       });
//     }
//     setUserAnswer("");
//     setLoading(false);
//   };
//   return (
//     // <div>
//     <div className="my-20 flex flex-col justify-center items-center">
//       {webCamEnabled ? (
//         <>
//           <CameraOff
//             className="ml-auto"
//             variant="ghost"
//             onClick={() => setWebCamEnabled(false)}
//           >
//             Close WebCam
//           </CameraOff>
//           <Webcam
//             onUserMedia={() => setWebCamEnabled(true)}
//             onUserMediaError={() => setWebCamEnabled(false)}
//             mirrored={true}
//             style={{ height: 350, width: 400 }}
//           />
//         </>
//       ) : (
//         <>
//           <Camera className="ml-auto" onClick={() => setWebCamEnabled(true)}>
//             Enable Web Cam And Microphone
//           </Camera>
//           <WebcamIcon className="h-72 w-full my-7 p-20 bg-gray-300 rounded-lg border" />
//         </>
//       )}
//       <div className="flex justify-center gap-10">
//         <Button variant="outline" className="my-2" onClick={startStopRecording}>
//           {isRecording ? (
//             <h2 className="text-red-600 flex gap-2">
//               <StopCircle /> Stop Recording
//             </h2>
//           ) : (
//             <h2 className="text-blue-600 flex gap-2">
//               <Mic /> Record Answer
//             </h2>
//           )}
//         </Button>
//         <Button disabled={loading} className="my-2" onClick={submitUserAnswer}>
//           {loading ? (
//             <>
//               <Loader2 className="animate-spin mr-2" /> Submitting...
//             </>
//           ) : (
//             "Submit Answer"
//           )}
//         </Button>
//       </div>
//     </div>
//     // </div>
//   );
// }

// export default RecordAnswerSection;

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Camera,
  CameraOff,
  Loader2,
  Mic,
  StopCircle,
  WebcamIcon,
} from "lucide-react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import MicRecorder from "mic-recorder-to-mp3";
import axios from "axios";
import moment from "moment";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";

const ASSEMBLYAI_UPLOAD_URL = "https://api.assemblyai.com/v2/upload";
const ASSEMBLYAI_TRANSCRIPT_URL = "https://api.assemblyai.com/v2/transcript";

const RecordAnswerSection = ({
  userAnswer,
  setUserAnswer,
  interviewQuestions,
  activeQuestionIndex,
  interviewData,
}) => {
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [recorder] = useState(new MicRecorder({ bitRate: 128 }));
  const [audioUrl, setAudioUrl] = useState(null);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0) {
      const latestTranscript = results[results.length - 1]?.transcript;
      setUserAnswer((prevAns) => prevAns + latestTranscript);
    }
  }, [results, setUserAnswer]);

  const uploadToAssemblyAI = async (file) => {
    const headers = { authorization: ASSEMBLYAI_API_KEY };
    const response = await axios.post(ASSEMBLYAI_UPLOAD_URL, file, { headers });
    return response.data.upload_url;
  };

  const transcribeWithAssemblyAI = async (audioUrl) => {
    const headers = { authorization: ASSEMBLYAI_API_KEY };
    const data = { audio_url: audioUrl, sentiment_analysis: true };
    const response = await axios.post(ASSEMBLYAI_TRANSCRIPT_URL, data, {
      headers,
    });
    return response.data.id;
  };

  const getAssemblyAIResults = async (transcriptionId) => {
    const headers = { authorization: ASSEMBLYAI_API_KEY };
    while (true) {
      const response = await axios.get(
        `${ASSEMBLYAI_TRANSCRIPT_URL}/${transcriptionId}`,
        { headers }
      );
      const result = response.data;
      console.log(result.data);

      if (result.status === "completed") {
        return result;
      } else if (result.status === "failed") {
        throw new Error("Transcription failed");
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  };

  const startStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      const [buffer, blob] = await recorder.stop().getMp3();
      const file = new File(buffer, "recording.mp3", { type: blob.type });
      const audioUrl = URL.createObjectURL(file);
      setAudioUrl(audioUrl);

      if (results[results.length - 1]?.transcript?.length < 10) {
        toast("Error while saving your answer, please record again");
      } else {
        try {
          const assemblyAiAudioUrl = await uploadToAssemblyAI(file);
          const transcriptionId = await transcribeWithAssemblyAI(
            assemblyAiAudioUrl
          );
          console.log("h");
          const transcriptionResult = await getAssemblyAIResults(
            transcriptionId
          );

          console.log("AssemblyAI Transcription Result:", transcriptionResult);
          const transcriptText = transcriptionResult.text;
          setUserAnswer(transcriptText);
        } catch (error) {
          console.error("Error with AssemblyAI:", error.message);
        }
      }
    } else {
      await recorder.start();
      startSpeechToText();
      setUserAnswer("");
    }
  };

  const submitUserAnswer = async () => {
    setLoading(true);

    const feedbackPrompt = `
    {
      "Question": "${
        interviewQuestions[activeQuestionIndex]?.question ||
        interviewQuestions[activeQuestionIndex]?.Question
      }",
      "User Answer": "${userAnswer}",
      "Instructions": "Based on the question and user answer, please provide the following in JSON format:
        1. A rating for the answer (between 1 to 10).
        2. Feedback in 3 to 5 sentences on areas of improvement.
        3. A list of missed keywords in the answer."
    }
  `;

    const result = await chatSession.sendMessage(feedbackPrompt);
    const jsonMockResp = result.response
      .text()
      .replace("json", "")
      .replace("", "");
    const JsonFeedbackResp = JSON.parse(jsonMockResp);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question:
        interviewQuestions[activeQuestionIndex]?.question ||
        interviewQuestions[activeQuestionIndex]?.Question,
      correctAns:
        interviewQuestions[activeQuestionIndex]?.answer ||
        interviewQuestions[activeQuestionIndex]?.Answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-yyyy"),
      missedKeywords: JsonFeedbackResp?.missed_keywords,
    });

    if (resp) {
      toast("User Answer recorded successfully", { duration: 1000 });
    }

    setUserAnswer("");
    setLoading(false);
  };

  return (
    <div className="my-20 flex flex-col justify-center items-center">
      {webCamEnabled ? (
        <>
          <CameraOff
            className="ml-auto"
            variant="ghost"
            onClick={() => setWebCamEnabled(false)}
          >
            Close WebCam
          </CameraOff>
          <Webcam
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            mirrored={true}
            style={{ height: 350, width: 400 }}
          />
        </>
      ) : (
        <>
          <Camera className="ml-auto" onClick={() => setWebCamEnabled(true)}>
            Enable Web Cam And Microphone
          </Camera>
          <WebcamIcon className="h-72 w-full my-7 p-20 bg-gray-300 rounded-lg border" />
        </>
      )}
      <div className="flex justify-center gap-10">
        <Button variant="outline" className="my-2" onClick={startStopRecording}>
          {isRecording ? (
            <h2 className="text-red-600 flex gap-2">
              <StopCircle /> Stop Recording
            </h2>
          ) : (
            <h2 className="text-blue-600 flex gap-2">
              <Mic /> Record Answer
            </h2>
          )}
        </Button>
        <Button disabled={loading} className="my-2" onClick={submitUserAnswer}>
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Submitting...
            </>
          ) : (
            "Submit Answer"
          )}
        </Button>
      </div>
      {audioUrl && (
        <div className="mt-5">
          <audio controls src={audioUrl}></audio>
          <a href={audioUrl} download="recording.mp3">
            Download Recording
          </a>
        </div>
      )}
    </div>
  );
};

export default RecordAnswerSection;
