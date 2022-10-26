import type { NextApiRequest, NextApiResponse } from "next";

export default async function stock(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      res.status(400).json("Symbol required.");
    }

    const apikey = process.env.TD_AMERITRADE_APIKEY;

    const stockRes = await fetch(
      `https://api.tdameritrade.com/v1/marketdata/${symbol}/pricehistory?apikey=${apikey}`
    );

    res.json(await stockRes.json());
  } catch (error) {
    console.log(error);
    res.status(400).json("Unknown error.");
  }
}
