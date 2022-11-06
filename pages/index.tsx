import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import {
  symbols,
  periodTypes,
  dayPeriods,
  monthPeriods,
  yearPeriods,
  ytdPeriods,
} from "../constants/symbol";
import type { SyntheticEvent } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Page() {
  const [symbol, setSymbol] = useState("");
  const [periodType, setPeriodType] = useState("");
  const [period, setPeriod] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [display, setDisplay] = useState(false);
  const [labels, setLabels] = useState([]);
  const [high, setHigh] = useState([]);
  const [low, setLow] = useState([]);
  const [close, setClose] = useState([]);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setDisplay(false);
    setErrorMessage("");

    const res = await fetch("/api/symbol", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbol, periodType, period }),
    });

    if (!res.ok) {
      setErrorMessage(await res.json());
      return;
    }

    const json = await res.json();

    if (json.error) {
      setErrorMessage(json.error);
      return;
    }

    if (json.empty) {
      setErrorMessage("Response empty.");
      return;
    }

    setLabels(
      json.candles.map((item: { datetime: number }) =>
        new Date(item.datetime).toLocaleDateString()
      )
    );
    setHigh(json.candles.map((item: { high: number }) => item.high));
    setLow(json.candles.map((item: { low: number }) => item.low));
    setClose(json.candles.map((item: { close: number }) => item.close));

    setDisplay(true);
  }

  const data = {
    labels,
    datasets: [
      {
        label: "High",
        data: high,
        borderColor: "rgb(255,0,0)",
        backgroundColor: "rgb(255,0,0)",
      },
      {
        label: "Low",
        data: low,
        borderColor: "rgb(0,255,0)",
        backgroundColor: "rgb(0,255,0)",
      },
      {
        label: "Close",
        data: close,
        borderColor: "rgb(0,0,255)",
        backgroundColor: "rgb(0,0,255)",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date [UTC]",
        },
        ticks: {
          maxRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: "Value [USD]",
        },
      },
    },
  };

  function periodOptions() {
    if (periodType === "day") {
      return (
        <>
          {dayPeriods.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </>
      );
    }
    if (periodType === "month") {
      return (
        <>
          {monthPeriods.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </>
      );
    }
    if (periodType === "year") {
      return (
        <>
          {yearPeriods.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </>
      );
    }
    if (periodType === "ytd") {
      return (
        <>
          {ytdPeriods.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </>
      );
    }
  }

  return (
    <>
      <div className="p-2 w-full flex items-center justify-between">
        <div className="mt-2 text-xl">Stonks</div>
        <Link href={"https://github.com/joshbrusa/website-stonks"}>
          <a target="_blank">
            <Image src="/github.svg" alt="GitHub" height={32} width={32} />
          </a>
        </Link>
      </div>
      <div className="mt-2">
        A GUI to interact with the TD Ameritrade API Get Price History.
      </div>
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col">
        <div className="mt-2 flex justify-between">
          <div>Symbol</div>
          <select onChange={(e) => setSymbol(e.target.value)} className="ml-10">
            <option value=""></option>
            {symbols.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2 flex justify-between">
          <div>Period Type</div>
          <select
            onChange={(e) => setPeriodType(e.target.value)}
            className="ml-10"
          >
            <option value=""></option>
            {periodTypes.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2 flex justify-between">
          <div>Periods</div>
          <select onChange={(e) => setPeriod(e.target.value)} className="ml-10">
            <option value=""></option>
            {periodOptions()}
          </select>
        </div>
        <button type="submit" className="mt-2">
          Submit
        </button>
      </form>
      <div className="text-red-500">{errorMessage}</div>
      {display ? (
        <div className="mt-2 w-full">
          <Line data={data} options={options} />
        </div>
      ) : null}
    </>
  );
}
