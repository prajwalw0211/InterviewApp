"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle, LucideLoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [techSkills, setTechSkills] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();
  // useEffect(() => {
  //   // const techSkillsArray = techSkills.split(",").map((skill) => skill.trim());
  //   console.log(techSkills);
  // });
  const onSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const InputPrompt =
      "Job Position :" +
      jobPosition +
      ", Technical Skills :" +
      techSkills.toString() +
      ". Based on this information please provide me 10 conceptual based Interview Questions with Answers according to difficulty level (Easy, Moderate, Difficult). 5 easy , 3 moderate and 2 difficult (Total 10 Questions) in json format. Question , Answers , skill , difficulty level should be fields in JSON";

    const result = await chatSession.sendMessage(InputPrompt);
    console.log(result.response.text());

    const mockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "")
      .replace("```", "");

    setJsonResponse(mockJsonResp);

    if (mockJsonResp) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: mockJsonResp,
          jobPosition: jobPosition,
          techSkills: JSON.stringify(techSkills),
          createdBy: user.primaryEmailAddress.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("inserted Id :", resp);
      if (resp) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + resp[0].mockId);
      }
    } else {
      console.log("ERROR");
    }
    setLoading(false);
  };
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about you for the job interviewing
            </DialogTitle>
            <DialogDescription>
              <h2>
                Add details about your Job Position/Role and Technical Skills
              </h2>
            </DialogDescription>
            <form onSubmit={onSubmit}>
              <div>
                <div className="mt-7 my-3">
                  <label>Job Role / Job Position</label>
                  <Input
                    className="my-1"
                    placeholder="Ex.Full Stack Developer"
                    required
                    onChange={(event) => setJobPosition(event.target.value)}
                  />
                </div>
                <div className="my-3">
                  <label>Tech Stack / Job Description / Technical Skills</label>
                  <Textarea
                    className="my-1"
                    placeholder="Ex. React, Angular, Python, .Net"
                    required
                    onChange={(event) =>
                      setTechSkills(
                        event.target.value
                          .split(",")
                          .map((skill) => skill.trim())
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex gap-5 justify-end mt-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      Generating Interview
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
