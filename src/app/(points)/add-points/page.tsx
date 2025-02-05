"use client";

import { easeInOut, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const teamSchema = z.object({
  questionSet: z.string().min(1, { message: "Question set is required" }),
  testCases: z
    .number()
    .min(1)
    .max(5, { message: "Select between 1 and 5 test cases" }),
  hiddenTestCases: z
    .string()
    .min(1, { message: "Hidden test cases is required" }),
});

type FormData = z.infer<typeof teamSchema>;

const AddPoints = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const [teams, setTeams] = useState<
    {
      team_id: string;
      team_name: string;
      team_members: string[];
      score?: number;
    }[]
  >([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(teamSchema),
  });
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          "https://coding-relay-be.onrender.com/teams/getAllTeams"
        );
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
        toast.error("Failed to fetch teams");
      }
    };
    fetchTeams();
  }, []);
  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
  };
  const calculatePoints = (
    questionSet: string,
    testCases: number,
    hiddenTestCases: string
  ) => {
    let points = 0;
    if (!questionSet || !testCases || !hiddenTestCases) {
      return 0;
    }
    switch (questionSet) {
      case "easy":
        points = 1000 * testCases;
        break;
      case "medium":
        points = 1500 * testCases;
        break;
      case "hard":
        points = 2000 * testCases;
        break;
      default:
        points = 0;
    }
    if (hiddenTestCases === "Yes") {
      if (questionSet === "easy") points -= 750;
      if (questionSet === "medium") points -= 500;
      if (questionSet === "hard") points -= 250;
    }
    return points;
  };
  const onSubmit = async (data: FormData) => {
    if (!selectedTeam) {
      toast.error("Please select a team");
      return;
    }
    const { questionSet, testCases, hiddenTestCases } = data;
    const points = calculatePoints(questionSet, testCases, hiddenTestCases);
    if (!questionSet || !testCases || !hiddenTestCases) {
      toast.error("Please fill out all fields");
      return;
    }
    const total = calculatePoints(questionSet, testCases, hiddenTestCases);
    if (total === 0) {
      toast.error("Invalid data entered");
      return;
    }
    try {
      const selectedTeamData = teams.find(
        (team) => team.team_id === selectedTeam
      );
      const newScore = (selectedTeamData?.score || 0) + points;
      await axios.put(`https://coding-relay-be.onrender.com/teams/updateTeam`, {
        team_id: selectedTeam,
        score: newScore,
      });
      toast.success(`${points} points added to score`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error adding points:", error);
      toast.error("Failed to add points");
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
        <h1 className="sm:text-7xl text-4xl mb-12 sm:mt-0 mt-10">Add points</h1>
        <Select onValueChange={handleTeamSelect}>
          <SelectTrigger
            autoFocus={false}
            className="test-base sm:w-[32rem] w-[22rem] h-[3rem] bg-black text-white border-[2.5px] border-purple-700 mb-5 -mt-5"
          >
            <SelectValue placeholder="Select a Team" />
          </SelectTrigger>
          <SelectContent
            avoidCollisions={false}
            position="popper"
            className="bg-black text-white border-none absolute z-50"
          >
            {teams && teams.length > 0 ? (
              teams.map((team) => (
                <SelectItem
                  key={team.team_id}
                  value={team.team_id}
                  className="hover:text-black hover:bg-white"
                >
                  {team.team_name}
                </SelectItem>
              ))
            ) : (
              <p>No teams exist</p>
            )}
          </SelectContent>
        </Select>
        {selectedTeam !== null ? (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeInOut }}
            className="flex flex-col items-center justify-around h-1/2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mt-4 flex items-center justify-center w-full gap-x-10">
              {!isMobile && (
                <>
                  <div className="text-2xl w-[70%] flex flex-col items-center justify-center gap-y-8">
                    <span>Question Set</span>
                    <span>No. of Test Cases Passed</span>
                    <span>Hidden Test Cases Viewed?</span>
                  </div>
                  <div className="w-[40%] flex flex-col items-center justify-center gap-y-[1.7rem]">
                    <Controller
                      name="questionSet"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger className="w-64 bg-black text-white border-[2.5px] border-purple-700">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent className="bg-black text-white border-none absolute z-50">
                            <SelectItem
                              className="hover:text-black hover:bg-white"
                              value="easy"
                            >
                              Easy
                            </SelectItem>
                            <SelectItem
                              className="hover:text-black hover:bg-white"
                              value="medium"
                            >
                              Medium
                            </SelectItem>
                            <SelectItem
                              className="hover:text-black hover:bg-white"
                              value="hard"
                            >
                              Hard
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.questionSet && (
                      <span className="text-red-500 text-sm -mt-5">
                        {errors.questionSet.message}
                      </span>
                    )}
                    <Controller
                      name="testCases"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                        >
                          <SelectTrigger className="w-64 bg-black text-white border-[2.5px] border-purple-700">
                            <SelectValue
                              className="hover:text-black hover:bg-white"
                              placeholder="Select test cases"
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-black text-white border-none absolute z-50">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <SelectItem
                                className="hover:text-black hover:bg-white"
                                key={i}
                                value={i.toString()}
                              >
                                {i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.testCases && (
                      <span className="text-red-500 text-sm -mt-5">
                        {errors.testCases.message}
                      </span>
                    )}

                    <Controller
                      name="hiddenTestCases"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger className="w-64 bg-black text-white border-[2.5px] border-purple-700">
                            <SelectValue placeholder="Required" />
                          </SelectTrigger>
                          <SelectContent className="bg-black text-white border-none absolute z-50">
                            <SelectItem
                              className="hover:text-black hover:bg-white"
                              value="Yes"
                            >
                              Yes
                            </SelectItem>
                            <SelectItem
                              className="hover:text-black hover:bg-white"
                              value="No"
                            >
                              No
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.hiddenTestCases && (
                      <span className="text-red-500 text-sm -mt-5">
                        {errors.hiddenTestCases.message}
                      </span>
                    )}
                  </div>
                </>
              )}
              {isMobile && (
                <>
                  <div className="text-xl w-[70%] flex flex-col items-center justify-center gap-y-6">
                    <span>Question Set</span>
                    <Controller
                      name="questionSet"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger className="text-base w-[22rem] h-[3rem] bg-black text-white border-[2.5px] border-purple-700">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent className="bg-black text-white border-none absolute z-50">
                            <SelectItem
                              className="hover:text-black hover:bg-white"
                              value="easy"
                            >
                              Easy
                            </SelectItem>
                            <SelectItem
                              className="hover:text-black hover:bg-white"
                              value="medium"
                            >
                              Medium
                            </SelectItem>
                            <SelectItem
                              className="hover:text-black hover:bg-white"
                              value="hard"
                            >
                              Hard
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.questionSet && (
                      <span className="text-red-500 text-sm -mt-5">
                        {errors.questionSet.message}
                      </span>
                    )}
                    <span>No. of Test Cases Passed</span>
                    <Controller
                      name="testCases"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                        >
                          <SelectTrigger className="text-base w-[22rem] h-[3rem] bg-black text-white border-[2.5px] border-purple-700">
                            <SelectValue placeholder="Select test cases" />
                          </SelectTrigger>
                          <SelectContent className="bg-black text-white border-none absolute z-50">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <SelectItem
                                className="hover:text-black hover:bg-white"
                                key={i}
                                value={i.toString()}
                              >
                                {i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.testCases && (
                      <span className="text-red-500 text-sm -mt-5">
                        {errors.testCases.message}
                      </span>
                    )}
                    <span>Hidden Test Cases Viewed?</span>
                    <Controller
                      name="hiddenTestCases"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger className="text-base w-[22rem] h-[3rem] bg-black text-white border-[2.5px] border-purple-700">
                            <SelectValue placeholder="Required" />
                          </SelectTrigger>
                          <SelectContent className="bg-black text-white border-none absolute z-50">
                            <SelectItem
                              className="hover:text-black hover:bg-white"
                              value="Yes"
                            >
                              Yes
                            </SelectItem>
                            <SelectItem
                              className="hover:text-black hover:bg-white"
                              value="No"
                            >
                              No
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.hiddenTestCases && (
                      <span className="text-red-500 text-sm -mt-5">
                        {errors.hiddenTestCases.message}
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
              <div className="flex items-center justify-center w-full h-full text-xl text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[1.4rem]">
                Add points
              </div>
            </button>
          </motion.form>
        ) : (
          ""
        )}
      </motion.div>
      <Toaster />
    </>
  );
};

export default AddPoints;
