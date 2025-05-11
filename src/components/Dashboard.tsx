import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { useAuth } from "../context/AuthContext";
import pb from "../api/pocketbase";
import Loading from "./Loading";
import Login from "./Login";
import { Link } from "react-router-dom";

// 定义心情数据类型
interface MoodData {
  [year: string]: {
    [month: string]: {
      [day: string]: number;
    };
  };
}

export default function Dashboard() {
  const { currentUser, isLoading, isAuthenticated } = useAuth();
  const [data, setData] = useState<MoodData>({});
  const now = new Date();

  // 计算心情统计信息
  function countValues() {
    let total_number_of_days = 0;
    let sum_moods = 0;
    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          let days_mood = data[year][month][day];
          total_number_of_days++;
          sum_moods += days_mood;
        }
      }
    }
    return {
      num_days: total_number_of_days,
      average_mood: (sum_moods / total_number_of_days || 0).toFixed(4),
    };
  }

  const statuses = {
    ...countValues(),
    time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
  };

  // 设置心情数据
  async function handleSetMood(mood: number) {
    if (!currentUser) return;

    const day = now.getDate().toString();
    const month = now.getMonth().toString();
    const year = now.getFullYear().toString();

    try {
      // 克隆当前数据
      const newData = { ...data };

      // 确保数据结构存在
      if (!newData?.[year]) {
        newData[year] = {};
      }
      if (!newData?.[year]?.[month]) {
        newData[year][month] = {};
      }

      // 更新本地状态
      newData[year][month][day] = mood;
      setData(newData);

      // 检查记录是否已存在
      try {
        // 尝试查找该用户当天的心情记录
        const records = await pb.collection("moods").getList(1, 1, {
          filter: `user="${currentUser.id}" && year="${year}" && month="${month}" && day="${day}"`,
        });

        if (records.items.length > 0) {
          // 如果找到记录则更新
          const recordId = records.items[0].id;
          await pb.collection("moods").update(recordId, {
            mood: mood,
          });
        } else {
          // 如果没有找到则创建新记录
          await pb.collection("moods").create({
            user: currentUser.id,
            year,
            month,
            day,
            mood,
          });
        }
      } catch (err) {
        console.error("Error saving mood:", err);
      }
    } catch (err: any) {
      console.log("Failed to set data: ", err.message);
    }
  }

  // 加载用户心情数据
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    async function loadUserMoods() {
      try {
        const records = await pb.collection("moods").getList(1, 200, {
          filter: `user="${currentUser.id}"`,
        });

        // 将记录转换为数据格式
        const moodData: MoodData = {};

        records.items.forEach((record) => {
          const { year, month, day, mood } = record;

          if (!moodData[year]) {
            moodData[year] = {};
          }

          if (!moodData[year][month]) {
            moodData[year][month] = {};
          }

          moodData[year][month][day] = mood;
        });

        setData(moodData);
      } catch (error) {
        console.error("Error loading moods:", error);
      }
    }

    loadUserMoods();
  }, [currentUser]);

  const moods = {
    "&*@#$": "😫",
    Sad: "😔",
    Existing: "😐",
    Good: "😉",
    Elated: "😏",
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated || !currentUser) {
    return <Login />;
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      <div className="grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className="flex flex-col gap-1 sm:gap-2">
              <p className="font-medium capitalize text-xs sm:text-sm truncate">
                {status.replaceAll("_", " ")}
              </p>
              <p className="text-base sm:text-lg truncate fugaz-font">
                {statuses[status as keyof typeof statuses]}
                {status === "num_days" ? " 🔥" : ""}
              </p>
            </div>
          );
        })}
      </div>
      <h4 className="text-5xl sm:text-6xl md:text-7xl text-center fugaz-font">
  What's your <span className="textGradient">vibe</span> right now?
</h4>
      <div className="flex items-stretch flex-wrap gap-4">
        {Object.keys(moods).map((mood, moodIndex) => {
          return (
            <button
              onClick={() => {
                const currentMoodValue = moodIndex + 1;
                handleSetMood(currentMoodValue);
              }}
              className="p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col items-center gap-2 flex-1"
              key={moodIndex}
            >
              <p className="text-4xl sm:text-5xl md:text-6xl">
                {moods[mood as keyof typeof moods]}
              </p>
              <p className="text-indigo-500 text-xs sm:text-sm md:text-base fugaz-font">
                {mood}
              </p>
            </button>
          );
        })}
      </div>
      <Calendar completeData={data} handleSetMood={handleSetMood} />

      <div className="flex flex-col gap-4 items-center mt-8">
        <Link
          to="/avatar"
          className="rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors duration-300 text-white font-medium px-6 py-3 flex items-center gap-2"
        >
          <span>Create Your 3D Avatar</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </Link>

        <Link
          to="/music-sky"
          className="rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 hover:from-blue-600 hover:via-purple-600 hover:to-red-600 transition-colors duration-300 text-white font-medium px-6 py-3 flex items-center gap-2"
        >
          <span>Enter Music Sky</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
