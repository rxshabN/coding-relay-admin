"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { easeInOut, motion } from "framer-motion";

interface Team {
  team_id: string;
  team_name: string;
  team_members: string[];
  score: number;
  time_remaining: number;
}

const Leaderboard = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          "https://coding-relay-be.onrender.com/teams/getAllTeams"
        );
        const sortedTeams = response.data.sort(
          (a: { score: number }, b: { score: number }) => b.score - a.score
        );
        setTeams(sortedTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: easeInOut }}
      className="flex flex-col items-center justify-start mt-5 w-full px-4"
    >
      <h1 className="text-center sm:text-7xl text-4xl sm:mt-7 mt-16">
        Leaderboard
      </h1>
      <table className="mx-auto sm:w-1/2 w-full px-10 sm:px-0 my-10 bg-gray-900/20 border border-white/50 border-collapse mb-16 sm:mb-10">
        <thead className="bg-gradient-to-r from-purple-500 to-pink-500">
          <tr>
            <th className="py-2 px-4 text-center border border-white/50 text-xl">
              Sr. no.
            </th>
            <th className="py-2 px-4 text-center border border-white/50 text-xl">
              Team name
            </th>
            <th className="sm:block hidden py-2 px-4 text-center border border-white/50 text-xl">
              Team leader
            </th>
            <th className="py-2 px-4 text-center text-xl">Total Score</th>
            <th className="sm:block hidden py-2 px-4 text-center text-xl">
              Time Remaining
            </th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={team.team_id}>
              <td className="py-2 px-4 text-center border border-white/50">
                {index + 1}
              </td>
              <td className="py-2 px-4 text-center border border-white/50">
                {team.team_name}
              </td>
              <td className="sm:block hidden py-2 px-4 text-center border border-white/50">
                {team.team_members[0]}
              </td>
              <td className="py-2 px-4 text-center border border-white/50">
                {team.score}
              </td>
              <td className="sm:block hidden py-2 px-4 text-center border border-white/50">
                {team.time_remaining}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default Leaderboard;
