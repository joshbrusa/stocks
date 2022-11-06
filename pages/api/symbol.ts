import type { NextApiRequest, NextApiResponse } from "next";

export default async function stock(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { symbol, periodType, period } = req.body;

    if (!symbol) {
      res.status(400).json("Symbol required.");
      return;
    }
    if (!periodType) {
      res.status(400).json("Period Type required.");
      return;
    }
    if (!period) {
      res.status(400).json("Period required.");
      return;
    }

    const apikey = process.env.TD_AMERITRADE_APIKEY;

    const stockRes = await fetch(
      `https://api.tdameritrade.com/v1/marketdata/${symbol}/pricehistory?apikey=${apikey}&periodType=${periodType}&period=${period}`
    );

    res.json(await stockRes.json());
  } catch (error) {
    console.log(error);
    res.status(400).json("Unknown error.");
  }
}
