"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Feedback(params) {
  const [feedbackList, setFeedbackList] = useState([]);

  const router = useRouter();

  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.params.interviewId))
      .orderBy(UserAnswer.id);

    setFeedbackList(result);
  };

  return (
    <div className="p-10">
      {feedbackList?.length == 0 ? (
        <h2 className="mt-10 font-bold text-xl text-gray-500">
          No Interview Feedback found
        </h2>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-green-500">Congratulation!</h2>
          <h2 className="font-bold text-2xl">
            Here is your Interview Feedback
          </h2>
          {/* <h2 className="text-primary text-lg my-4">
            Your overall interview rating: <strong>7/10</strong>
          </h2> */}
          <h2 className="text-sm text-gray-500">
            Find below interview question with correct answer, your answer and
            feedback for improvements
          </h2>
          {feedbackList &&
            feedbackList.map((item, index) => (
              <Collapsible key={index} className="mt-5">
                <CollapsibleTrigger className="p-2 bg-secondary border rounded-lg flex justify-between my-2 text-left gap-7 w-full">
                  {item.question} <ChevronsUpDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-red-300 p-2 border rounded-lg">
                      <strong>Rating: </strong>
                      {item.rating}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                      <strong>Your Answer: </strong>
                      {item.userAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-green-100 text-sm text-green-900">
                      <strong>Correct Answer: </strong>
                      {item.correctAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                      <strong>Feedback: </strong>
                      {item.feedback} <br />
                      <strong>Missed Keywords: </strong>
                      <ul>
                        {item.missedKeywords
                          .split(",")
                          .map((keyword, index) => (
                            <li key={index}>{keyword.trim()}</li>
                          ))}
                      </ul>
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
        </>
      )}
      <Button
        className="mt-6"
        onClick={() => {
          router.replace("/dashboard");
        }}
      >
        Go Home
      </Button>
    </div>
  );
}

export default Feedback;