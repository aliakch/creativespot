/* eslint-disable react/jsx-no-bind */
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isAfter,
  isBefore,
  isEqual,
  isSameMonth,
  isThisMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
  startOfYesterday,
} from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export const CalendarView = () => {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [selectedDay, setSelectedDay] = useState(today);
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 1 }),
  });

  function prevMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  return (
    <>
      {/* calendar implementation */}
      <div className="my-6 flex w-[380px] flex-col gap-2">
        {/* calendar header */}
        <div className="grid grid-cols-3">
          <button
            type="button"
            onClick={prevMonth}
            disabled={isThisMonth(new Date(currentMonth))}
          >
            {/* <ChevronLeft
              size={20}
              aria-hidden="true"
              className={cn(
                isThisMonth(new Date(currentMonth)) && "text-gray-300"
              )}
            /> */}
          </button>
          <h2 className="flex justify-center font-semibold text-white">
            {format(firstDayCurrentMonth, " MMM yyyy", { locale: ru })}
          </h2>
          <button
            type="button"
            className="flex justify-end"
            onClick={nextMonth}
          >
            {/* <ChevronRight size={20} aria-hidden="true" /> */}
          </button>
        </div>

        {/* calendar body */}
        <div>
          <div className="mb-2 mt-4 grid grid-cols-7 gap-2">
            {dayNames.map((day, i) => {
              return (
                <div
                  key={i}
                  className={`flex w-full items-center justify-center py-2 text-sm text-gray-200 ${
                    day === "Вс" || day === "Сб"
                      ? "rounded-lg !bg-orange-950 !text-orange-200"
                      : ""
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7 gap-2 text-sm">
            {days.map((day, dayIdx) => {
              return (
                <div
                  key={day.toString()}
                  className={`${
                    dayIdx === 0 && colStartClasses[getDay(day) - 1]
                      ? "flex h-14 items-center justify-center"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedDay(day);
                    }}
                    className={`
                      group relative flex h-12 w-12 flex-col items-center justify-center gap-0 rounded-xl bg-[#1d1d1d] p-2
                      ${
                        getDay(day) === 0 || getDay(day) === 6
                          ? "!bg-orange-950"
                          : ""
                      }    
                      ${
                        isEqual(day, selectedDay)
                          ? "bg-orange-900 text-lg text-slate-100"
                          : ""
                      }
                      ${isEqual(today, day) ? "!bg-cs-primary" : ""}
                      ${
                        isBefore(day, today)
                          ? "cursor-not-allowed bg-[#171717] font-semibold !text-red-600 opacity-70"
                          : ""
                      }
                      ${isBefore(day, today) ? "cursor-not-allowed" : ""}
                      ${
                        isEqual(day, selectedDay) && isToday(day)
                          ? "bg-blue-200"
                          : ""
                      }
                      ${
                        !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth)
                          ? "text-gray-400"
                          : ""
                      }
                      ${
                        !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth)
                          ? "text-gray-100"
                          : ""
                      }
                    `}
                    disabled={isBefore(day, today)}
                  >
                    {isAfter(day, startOfYesterday()) && (
                      <span className="-translate-x-.5 absolute top-0 z-10 hidden -translate-y-4 gap-1 rounded-md bg-slate-900 px-1 text-[11px] text-slate-100 group-hover:flex">
                        <span>Доступно</span>
                      </span>
                    )}

                    <time
                      dateTime={format(day, "yyyy-MM-dd")}
                      className={`group-hover:text-lg ${
                        isEqual(day, selectedDay) || isToday(day)
                          ? "font-semibold"
                          : ""
                      }`}
                    >
                      {format(day, "d")}
                    </time>

                    {/* <CheckCircle2
                      className={cn(
                        "hidden",
                        isEqual(day, selectedDay) &&
                          "absolute right-0 top-0 block h-[18px] w-[18px] -translate-y-1 translate-x-1 text-orange-900",
                        isEqual(day, today) && "text-blue-900"
                      )}
                    /> */}

                    {/* {isAfter(day, startOfYesterday()) && (
                      <TimesBar
                        times={availableTimesInThisMonthForEachDay[dayIdx]}
                      />
                    )} */}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
