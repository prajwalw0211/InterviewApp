import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";

function InterviewItemCard({ interview }) {
  const router = useRouter();
  return (
    <div className="border shadow-sm rounded-lg p-3">
      <h2 className="font-bold text-primary">{interview.jobPosition}</h2>
      <h2 className="text-xs text-gray-500">
        Created At: {interview.createdAt}
      </h2>
      <div className="flex justify-between mt-4 gap-5">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => {
            router.replace(
              "/dashboard/interview/" + interview.mockId + "/feedback"
            );
          }}
        >
          Feedback
        </Button>
        <Button
          size="sm"
          className="w-full"
          onClick={() => {
            router.replace("/dashboard/interview/" + interview.mockId);
          }}
        >
          Start Interview
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
