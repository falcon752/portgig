"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Buttons } from "@/src/components/export_components";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  messages: z.string().min(30, "Please write a short note"),
});

type FormData = z.infer<typeof formSchema>;

const Form = () => {
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
    reset();
  };

  return (
    <div className="pt-10 lg:pt-24 px-4 pb-10 bg-white bodyMargin">
      <div className="w-full max-w-6xl mx-auto">
        <h4 className="text-[#0A1754] text-2xl md:text-3xl lg:text-4xl font-extrabold font-urbanist mb-6 text-left">
          Send us a message, we will work on it soonest
        </h4>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-6"
        >
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-base md:text-lg font-semibold text-[#0A1754] font-raleway">
              Name
            </label>
            <input
              {...register("fullName")}
              type="text"
              className="text-sm bg-gray100 p-3 border border-gray200 rounded-lg focus:outline-none focus:border-secondary font-raleway placeholder-raleway"
              placeholder="yourname"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-base md:text-lg font-semibold text-[#0A1754] font-raleway">
              Email
            </label>
            <input
              {...register("email")}
              type="text"
              className="text-sm bg-gray100 p-3 border border-gray200 rounded-lg focus:outline-none focus:border-secondary font-raleway placeholder-raleway"
              placeholder="youremail@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="text-base md:text-lg font-semibold text-[#0A1754] font-raleway">
              Message
            </label>
            <textarea
              {...register("messages")}
              className="text-sm bg-gray100 p-3 border border-gray200 rounded-lg focus:outline-none focus:border-secondary min-h-40 font-raleway placeholder-raleway"
              placeholder="Write your message here"
            />
            {errors.messages && (
              <p className="text-red-500 text-xs">{errors.messages.message}</p>
            )}
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <Buttons
              type="submit"
              label="Send"
              className="bg-secondary! text-white rounded-md font-semibold text-sm px-6 md:px-12 lg:px-20 py-3 mt-3"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
