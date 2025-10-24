"use client";
import React, { useState } from "react";
import Image from "next/image";
import { activeJobs } from "@/src/constants";
import { Buttons } from "@/src/components/export_components";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  messages: z.string().min(30, "Please write a short note"),
});
type FormData = z.infer<typeof formSchema>;
const ActiveJob = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    setIsOpen(false);
    reset();
  };

  return (
    <main className="flex flex-col py-10 gap-3 font-raleway">
      <div className="flex justify-between items-end max-sm:h-20 h-30  border-b-2 border-primary pb-2">
        <div className="flex flex-col justify-between h-full">
          <h2 className="text-sm  md:text-lg lg:text-xl  font-black text-primary">
            Dashboard
          </h2>
          <h2 className="smallHeading text-primary">Active Job</h2>
        </div>

        <Image
          src={"/assets/creativeImage.svg"}
          alt="recruiter profile"
          width={150}
          height={150}
        />
      </div>
      <div className="border rounded border-gray200 w-full flex gap-5   py-1 text-sm md:text-xl">
        <h2 className="flex-1 text-center w-18">Jobs</h2>
        <h2 className="flex-1 text-center w-18">Applicants</h2>
        <div className="flex-1"></div>
        <div className="flex-1"></div>
      </div>

      <div className="flex flex-col gap-5">
        {activeJobs.map((job, index) => (
          <div
            key={index}
            className="flex gap-2 text-center text-sm md:text-xl  text-primary">
            <div className="flex-1 center rounded py-2 px-2 bg-gray200">
              {job.jobName}
            </div>
            <div className="flex-1 center rounded py-1 px-2 bg-gray200">
              {job.numberOfApplicants}
            </div>
            <Buttons
              className="bg-primary! rounded! flex-1 center py-1 px-2 text-white cursor-pointer"
              label="Close job"
              onClick={() => setIsOpen(true)}
            />
            <Buttons
              className="bg-primary! rounded! flex-1 center py-1 px-2  text-white cursor-pointer"
              label=" View Applicants"
            />
          </div>
        ))}
      </div>

      <h2 className="smallHeading text-primary">Closed Jobs</h2>
      <hr className="border-t border-primary" />
      <div className="flex flex-col gap-5">
        {activeJobs.map((job, index) => (
          <div
            key={index}
            className="flex gap-2 text-center text-sm md:text-xl  text-primary">
            <div className="w-30 md:w-40  center py-2 px-2 bg-gray200">
              {job.jobName}
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex  items-center justify-center bg-secondary/40 bg-opacity-50 font-raleway"
          onClick={() => setIsOpen(false)}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg center-flexCol gap-5">
            <h2 className="text-primary text-lg font-bold  text-center">
              Send a note to Applicants that didn’t get the job
            </h2>
            <p className="text-gray-700 ">Please be nice</p>

            <textarea
              id="messages"
              {...register("messages")}
              className="w-full bg-gray100 p-3 rounded  focus:border focus:outline-none focus:border-secondary transition-colors duration-200 min-h-30"
            />
            {errors.messages && (
              <p className="text-red500 text-sm">{errors.messages.message}</p>
            )}

            <button
              className="bg-primary text-white px-5 py-2 rounded"
              type="submit">
              Close Job
            </button>
          </form>
        </div>
      )}
    </main>
  );
};

export default ActiveJob;
