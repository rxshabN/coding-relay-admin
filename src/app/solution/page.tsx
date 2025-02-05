"use client";

import { useState, useEffect } from "react";
import { motion, easeInOut } from "framer-motion";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";

interface TestCase {
  id: number;
  input: string;
  output: string;
}

interface Question {
  id: number;
  question: string;
  testCaseId: TestCase[];
}

const SolutionPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questionSet, setQuestionSet] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [selectedQuestionData, setSelectedQuestionData] =
    useState<Question | null>(null);

  const fetchQuestions = async (difficulty: string) => {
    try {
      const response = await axios.get(
        `https://coding-relay-be.onrender.com/questions/getQuestionsByDifficulty?difficulty=${difficulty}`
      );
      setQuestions(response.data);
      setSelectedQuestionId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch questions"
      );
    }
  };
  useEffect(() => {
    if (selectedQuestionId) {
      const question = questions.find((q) => q.id === selectedQuestionId);
      setSelectedQuestionData(question || null);
    }
  }, [selectedQuestionId, questions]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: easeInOut }}
        className="flex flex-col text-center items-center justify-center mt-12"
      >
        <h1 className="sm:text-7xl text-4xl mb-7 sm:mt-0 mt-10">
          Solution for question
        </h1>
        <Select
          onValueChange={(value) => {
            setQuestionSet(value);
            fetchQuestions(value);
          }}
        >
          <SelectTrigger className="sm:w-[32rem] w-[22rem] h-[3rem] bg-black text-white border-[2.5px] border-purple-700 mb-5">
            <SelectValue placeholder="Select Question Set" />
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
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easeInOut }}
          >
            <Select
              onValueChange={(value) => setSelectedQuestionId(Number(value))}
            >
              <SelectTrigger className="sm:w-[32rem] w-[22rem] h-[3rem] bg-black text-white border-[2.5px] border-purple-700 mb-5">
                <SelectValue placeholder="Select Question ID" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border-none absolute z-50">
                {questions.map((q) => (
                  <SelectItem
                    className="hover:text-black hover:bg-white"
                    key={q.id}
                    value={q.id.toString()}
                  >
                    {q.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        )}
        {selectedQuestionData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeInOut }}
            className="mb-10 border border-white/50 text-left bg-gray-900/20 text-white p-6 rounded-lg sm:w-[32rem] w-[22rem]"
          >
            <h2 className="text-2xl mb-4 text-purple-500">Question:</h2>
            <p className="text-lg mb-6">{selectedQuestionData.question}</p>
            <div className="flex items-center justify-center gap-x-0 -mt-2 mb-3">
              <div className="w-full h-[2px] bg-gradient-to-r from-black to-purple-500"></div>
              <div className="w-full h-[2px] bg-gradient-to-l from-black to-purple-500"></div>
            </div>
            <h2 className="text-2xl mb-4 text-purple-500">Test Cases:</h2>
            <div className="space-y-4">
              {selectedQuestionData.testCaseId.map((test) => (
                <div key={test.id} className="p-4 bg-gray-700 rounded-lg">
                  <p>Input : {test.input}</p>
                  <p>Expected Output : {test.output}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
      <Toaster />
    </>
  );
};

export default SolutionPage;
