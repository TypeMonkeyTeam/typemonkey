import React, { useState, useEffect, useRef } from "react";
import "./Main.scss";

import RefreshIcon from "../../assets/icons/Refresh";
import Controls from "./components/Controls";
import TypeArea from "./components/TypeArea";
import MainPagePopup from "../../popups/MainPagePopup/MainPagePopup";
import { usePopup } from "../../context/PopupContext/PopupProvider";
import { get, post } from "../../hooks/requests";
import { API_ROUTES } from "../../hooks/routes";

const Main = () => {
  const [time, setTime] = useState(30);
  const [language, setLanguage] = useState("russian");
  const [timerTime, setTimerTime] = useState(time);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const correctCharsRef = useRef(0);
  const totalChars = useRef(0);
  const { openPopup, closePopup } = usePopup();

  async function calculateTypingStats() {
    if (time === 0) {
      return {
        wpm: 0.0,
        accuracy: 0.0,
        characters: "0/0/0",
        rank: null,
        updated: false,
      };
    }
  
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Пользователь:", user);
    
    if (!user || !user.id) {
      console.error("Пользователь не найден или некорректен");
      return null;
    }
  
    const wpm = parseFloat(
      ((correctCharsRef.current * 60) / (5 * time)).toFixed(2)
    );
    const accuracy = parseFloat(
      ((correctCharsRef.current / totalChars.current) * 100).toFixed(2)
    );
    const characters = `${totalChars.current}/${correctCharsRef.current}/${
      totalChars.current - correctCharsRef.current
    }`;
    

    
    // ⚠️ Один запрос, бэк сам решит, обновлять ли или вставлять
    const res = await post(API_ROUTES.record.submit, {
      userId: user.id,
      wpm,
      accuracy,
      time,
      characters,
      language,
    });

  
    if (!res.success) {
      console.error("Ошибка отправки рекорда:", res.error);
      return null;
    }

    console.log("Новый рекорд:", {
      wpm,
      accuracy,
      characters,
      time,
      language,
      avatar: user.avatar,
      rank: res.data.rank, // напрямую из API
      updated: res.data.updated, // пусть бек вернёт updated (true/false)
    });
    
  
    return {
      wpm,
      accuracy,
      characters,
      time,
      language,
      avatar: user.avatar,
      rank: res.data.rank, // напрямую из API
      updated: res.data.updated, // пусть бек вернёт updated (true/false)
    };
  }
  

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
    setTimerTime(time);
    setIsStarted(false);
    correctCharsRef.current = 0;
    totalChars.current = 0;
  };

  const tabPressed = useRef(false);

  const start = () => {
    if (!isStarted) {
      setIsStarted(true);
      setIsFinished(false);
    }
  };

  const finish = async () => {
    const record = await calculateTypingStats();
    console.log(record);
    
    setIsFinished(true);
    setIsStarted(false);
    openPopup(
      <MainPagePopup
        onClose={() => {
          closePopup();
          refresh();
          setIsFinished(false);
        }}
        tryAgain={refresh}
        record={record}
      />
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        tabPressed.current = true;
        e.preventDefault();
      } else if (e.key === "Enter" && tabPressed.current) {
        refresh();
        tabPressed.current = false;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Tab") {
        tabPressed.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [time]);

  useEffect(() => {
    if (!isStarted) return;

    const interval = setInterval(() => {
      setTimerTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted]);

  useEffect(() => {
    if (isStarted && timerTime <= 0) {
      setIsStarted(false);
      finish();
    }
  }, [timerTime, isStarted]);

  return (
    <div className="main">
      <div className="wrapper">
        {!isStarted ? (
          <Controls
            time={time}
            setTime={setTime}
            setTimerTime={setTimerTime}
            language={language}
            setLanguage={setLanguage}
          />
        ) : (
          <div className="timer">{timerTime}</div>
        )}
        <TypeArea
          key={`${language}-${refreshKey}`}
          start={start}
          isFinished={isFinished}
          language={language}
          correctCharsRef={correctCharsRef}
          totalChars={totalChars}
        />
        <div className="refresh" onClick={refresh}>
          <RefreshIcon />
        </div>
      </div>
      <div className="hotkey-hint">
        <div className="hint">
          <span className="key">tab</span>+<span className="key">enter</span>
        </div>
        <p className="equals">=</p>
        <p>restart test</p>
      </div>
    </div>
  );
};

export default Main;
