"use client";

import { easeInOut, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const teamSchema = z.object({
  totalPoints: z
    .number()
    .min(0, { message: "Points should be greater than or equal to 0" }),
  timeRemaining: z
    .union([
      z
        .number()
        .min(0)
        .max(60, { message: "Time remaining must be between 0 to 60 minutes" }),
      z.undefined(),
    ])
    .optional(), // Optional field
});

type FormData = z.infer<typeof teamSchema>;

const ModifyPoints = () => {
  const [teams, setTeams] = useState<
    {
      team_id: string;
      team_name: string;
      team_members: string[];
      score: number;
      time_remaining: number;
    }[]
  >([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
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
    const selectedTeamData = teams.find((team) => team.team_id === teamId);
    if (selectedTeamData) {
      setValue("totalPoints", selectedTeamData.score);
      setValue("timeRemaining", selectedTeamData.time_remaining);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedTeam) {
      toast.error("Please select a team");
      return;
    }
    const { totalPoints, timeRemaining } = data;

    if (totalPoints < 0) {
      toast.error("Total points must be a valid number and >= 0");
      return;
    }

    const updateData: {
      team_id: string;
      score: number;
      time_remaining?: number;
    } = {
      team_id: selectedTeam,
      score: totalPoints,
    };

    // Only include timeRemaining if the user provided a valid value
    if (timeRemaining !== undefined) {
      updateData.time_remaining = timeRemaining;
    }

    try {
      const confirmed = window.confirm(
        "Warning: This will overwrite the existing score. Do you wish to continue?"
      );
      if (!confirmed) return;
      await axios.put(
        `https://coding-relay-be.onrender.com/teams/updateTeam`,
        updateData
      );
      toast.success(`Score updated to ${totalPoints}`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error updating score:", error);
      toast.error("Failed to update score");
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
          Modify Points
        </h1>
        <Select onValueChange={handleTeamSelect}>
          <SelectTrigger
            autoFocus={false}
            className="sm:w-[32rem] w-[22rem] h-[3rem] bg-black text-white border-[2.5px] border-purple-700 mb-5 -mt-5"
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
            <div className="mt-4 flex sm:flex-row flex-row gap-y-5 sm:gap-y-0 items-center justify-center w-full sm:gap-x-10 gap-x-5 sm:px-0 px-5">
              <div className="text-2xl sm:w-[70%] w-full flex flex-col items-center justify-center sm:gap-y-[2.8rem] gap-y-7">
                <span>Total Points</span>
                <span>Time remaining</span>
              </div>
              <div className="w-[40%] flex flex-col items-center justify-center gap-y-[1.7rem]">
                <Controller
                  name="totalPoints"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      required
                      value={field.value !== undefined ? field.value : ""}
                      onChange={(e) => {
                        const newValue =
                          e.target.value === "" ? "" : Number(e.target.value);
                        field.onChange(newValue);
                      }}
                      className="sm:w-40 w-36 bg-black text-white border-[2.5px] border-purple-700 p-3 rounded-lg"
                    />
                  )}
                />
                {errors.totalPoints && (
                  <span className="text-red-500 text-sm w-40 h-2 m-5 p-0 sm:-mt-2 -mt-4 sm:mb-0 mb-8">
                    {errors.totalPoints.message}
                  </span>
                )}
                <Controller
                  name="timeRemaining"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      value={field.value !== undefined ? field.value : ""}
                      onChange={(e) => {
                        const newValue =
                          e.target.value === "" ? "" : Number(e.target.value);
                        field.onChange(newValue);
                      }}
                      className="sm:w-40 w-36 bg-black text-white border-[2.5px] border-purple-700 p-3 rounded-lg"
                    />
                  )}
                />
                {errors.timeRemaining && (
                  <span className="text-red-500 text-sm w-40 h-2 m-5 p-0 sm:-mt-2 -mt-4 sm:mb-0 mb-8">
                    {errors.timeRemaining.message}
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="mt-10 relative w-[9.5rem] h-14 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group"
            >
              <div className="flex items-center justify-center w-full h-full text-[1.35rem] text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[1.6rem]">
                Save
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

export default ModifyPoints;
