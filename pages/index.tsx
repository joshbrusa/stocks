import { useState } from "react";
import { Line } from "react-chartjs-2";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [labels, setLabels] = useState(null);
  const [data, setData] = useState(null);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setErrorMessage("");

    const res = await fetch("/api/symbol", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbol }),
    });

    if (!res.ok) {
      setErrorMessage(await res.json());
      return;
    }

    const json = await res.json();

    if (!json.empty) {
      setLabels(
        json.candles.map((item: { datetime: number }) => item.datetime)
      );
      setData(json.candles.map((item: { close: number }) => item.close));
    }
  }

  return (
    <>
      <div className="page-title">Stonks</div>
      <div className="mt-2">Enter a stock symbol and visualize the data.</div>
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col">
        <input
          type="text"
          placeholder="Symbol (case-sensitive)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <div className="">{errorMessage}</div>
      {labels && data ? (
        <Line data={{ labels: labels, datasets: [{ data: data }] }} />
      ) : null}
    </>
  );
}
