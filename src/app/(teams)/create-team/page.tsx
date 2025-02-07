"use client";

import { easeInOut, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const teamSchema = z.object({
  // teamName: z
  //   .string()
  //   .min(1, { message: "Team name is required" })
  //   .max(50, { message: "Team name must be less than 50 characters" }),
  // member1: z.string().min(1, { message: "Member 1 name is required" }),
  // member2: z.string().min(1, { message: "Member 2 name is required" }),
  // member3: z.string().min(1, { message: "Member 3 name is required" }),
  // member4: z.string().min(1, { message: "Member 4 name is required" }),


  teamName: z
    .string()
    .min(1, { message: "Team name is required" })
    .max(50, { message: "Team name must be less than 50 characters" }),

  member1: z.string().optional(),
  member2: z.string().optional(),
  member3: z.string().optional(),
  member4: z.string().optional(),
});

type FormData = z.infer<typeof teamSchema>;

const CreateTeam = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(teamSchema),
  });

  const onSubmit = async (data: FormData) => {
    const { teamName, member1, member2, member3, member4 } = data;
    const teamData = {
      team_name: teamName,
      team_members: [member1, member2, member3, member4],
    };
    try {
      await axios.post(
        "https://coding-relay-be.onrender.com/teams/createTeam",
        teamData
      );
      toast.success("Team created successfully");
      reset(undefined, { keepErrors: true, keepDirty: false });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 500) {
        toast.error("Team name already exists.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: easeInOut }}
        className="flex flex-col text-center items-center justify-center mt-12"
      >
        <h1 className="sm:text-7xl text-4xl mb-12 sm:mt-0 mt-10">
          Create Team
        </h1>
        <form
          className="sm:mb-0 mb-10 flex flex-col items-center sm:justify-around justify-center h-1/2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex items-center justify-around w-full gap-x-10">
            {!isMobile && (
              <>
                <div className="text-3xl w-max flex flex-col items-center justify-center gap-y-[2.35rem]">
                  <span>Team name</span>
                  <span>Member 1</span>
                  <span>Member 2</span>
                  <span>Member 3</span>
                  <span>Member 4</span>
                </div>
                <div className="w-max flex flex-col items-center justify-center gap-y-7">
                  <input
                    {...register("teamName")}
                    type="text"
                    placeholder="Enter team name"
                    className="caret-white bg-black p-2 rounded-lg text-white border-[2.5px] border-purple-700 focus:outline-none"
                  />
                  {errors.teamName && (
                    <span className="text-red-500 text-sm -mt-5">
                      {errors.teamName.message}
                    </span>
                  )}
                  <input
                    {...register("member1")}
                    type="text"
                    placeholder="Enter member 1 name"
                    className="caret-white bg-black p-2 rounded-lg text-white border-[2.5px] border-purple-700 focus:outline-none"
                  />
                  {errors.member1 && (
                    <span className="text-red-500 text-sm -mt-5">
                      {errors.member1.message}
                    </span>
                  )}
                  <input
                    {...register("member2")}
                    type="text"
                    id="member2"
                    placeholder="Enter member 2 name"
                    className="caret-white bg-black p-2 rounded-lg text-white border-[2.5px] border-purple-700 focus:outline-none"
                  />
                  {errors.member2 && (
                    <span className="text-red-500 text-sm -mt-5">
                      {errors.member2.message}
                    </span>
                  )}
                  <input
                    {...register("member3")}
                    type="text"
                    placeholder="Enter member 3 name"
                    className="caret-white bg-black p-2 rounded-lg text-white border-[2.5px] border-purple-700 focus:outline-none"
                  />
                  {errors.member3 && (
                    <span className="text-red-500 text-sm -mt-5">
                      {errors.member3.message}
                    </span>
                  )}
                  <input
                    {...register("member4")}
                    type="text"
                    placeholder="Enter member 4 name"
                    className="caret-white bg-black p-2 rounded-lg text-white border-[2.5px] border-purple-700 focus:outline-none"
                  />
                  {errors.member4 && (
                    <span className="text-red-500 text-sm -mt-5">
                      {errors.member4.message}
                    </span>
                  )}
                </div>
              </>
            )}
            {isMobile && (
              <>
                <div className="text-xl w-max flex flex-col items-center justify-center sm:gap-y-[2.35rem] gap-y-[1rem] sm:mt-0 -mt-7">
                  <span>Team name</span>
                  <input
                    {...register("teamName")}
                    type="text"
                    placeholder="Enter team name"
                    className="text-base w-[22rem] h-[3rem] caret-white bg-black p-2 rounded-lg text-white border-[2.5px] border-purple-700 focus:outline-none"
                  />
                  {errors.teamName && (
                    <span className="text-red-500 text-sm sm:-mt-5">
                      {errors.teamName.message}
                    </span>
                  )}
                  <span>Member 1</span>
                  <input
                    {...register("member1")}
                    type="text"
                    placeholder="Enter member 1 name"
                    className="text-base w-[22rem] h-[3rem] caret-white bg-black p-2 rounded-lg text-white border-[2.5px] border-purple-700 focus:outline-none"
                  />
                  {errors.member1 && (
                    <span className="text-red-500 text-sm sm:-mt-5">
                      {errors.member1.message}
                    </span>
                  )}
                  <span>Member 2</span>
                  <input
                    {...register("member2")}
                    type="text"
                    id="member2"
                    placeholder="Enter member 2 name"
                    className="text-base w-[22rem] h-[3rem] caret-white bg-black p-2 rounded-lg text-white border-[2.5px] border-purple-700 focus:outline-none"
                  />
                  {errors.member2 && (
                    <span className="text-red-500 text-sm sm:-mt-5">
                      {errors.member2.message}
                    </span>
                  )}
                  <span>Member 3</span>
                  <input
                    {...register("member3")}
                    type="text"
                    placeholder="Enter member 3 name"
                    className="text-base w-[22rem] h-[3rem] caret-white bg-black p-2 rounded-lg text-white border-[2.5px] border-purple-700 focus:outline-none"
                  />
                  {errors.member3 && (
                    <span className="text-red-500 text-sm sm:-mt-5">
                      {errors.member3.message}
                    </span>
                  )}
                  <span>Member 4</span>
                  <input
                    {...register("member4")}
                    type="text"
                    placeholder="Enter member 4 name"
                    className="text-base w-[22rem] h-[3rem] caret-white bg-black p-2 rounded-lg text-white border-[2.5px] border-purple-700 focus:outline-none"
                  />
                  {errors.member4 && (
                    <span className="text-red-500 text-sm sm:-mt-5">
                      {errors.member4.message}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
          <button
            type="submit"
            className="mt-10 relative w-[12.5rem] h-12 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group"
          >
            <div className="flex items-center justify-center w-full h-full text-xl text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[1.5rem]">
              Create
            </div>
          </button>
        </form>
      </motion.div>
      <Toaster />
    </>
  );
};

export default CreateTeam;
