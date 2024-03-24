export const description = `
[ARFC] GHO Stewards + Borrow Rate Update

Summary
In response to recent market events, this publication proposes increasing the GHO Borrow Rate and amending GHO Steward's capabilities to better respond to varying market conditions.

Motivation
In response to recent stable coin rates increasing and Maker DAO's recently proposed changes, detailed here, this publication seeks to amend the current GHO Interest Rate strategy and better equip the GHO Stewards to respond to evolving market conditions.

Given Maker is progressing via an accelerated progress, we suggest the Aave DAO should implement this proposal via the Direct-to-AIP progress. The GHO Borrow Rate is to be adjusted from 7.49% to 13.00% to match the DSR.

The chart below shows the last 7 days hourly borrow rates.

Screenshot 2024-03-13 at 11.52.50

The table below shows the average Borrow Rate over longer duration time horizons. There is a clear trend which is also noted in this ARFC.

Screenshot 2024-03-13 at 18.47.03

The Maker DAO proposal is expected to lead to higher borrowing rates. To enable GHO to continue growing with improved peg stability, this proposal acts to heavily reduce the Borrow Rate arbitrage opportunity created by incrementally increasing the GHO Borrow Rate within the current approved Direct-to-AIP process.

This publication grants the GHO Stewards additional flexibility. The maximum the GHO Borrow Cap implemented by the GHO Stewards is to be increased from 50M to 100M. This clears the path forward in the near term as we look to grow GHO supply.

In addition, the Max GHO Borrow Rate Adjustment has been revised from 0.50% to 5.00% to enable the GHO Stewards to better accommodate potential volatility in the market. This is a maximum limit for which the Borrow Rate can be changed at any one time.

The frequency at which the Borrow Rate can be adjusted is to be reduced from 5 days to 2 days. This provides the ability to move quickly when larger Borrow Rate changes are needed over short spans of time.

The overall maximum GHO Borrow Rate that can be implemented by the stewards is 25.00%. As a result, the GHO Stewards can increase the Borrow Rate by a maximum of 5.00%, every 2 days, up to a maximum of 25.00%.

With the volatility of GHO trending lower over time and the peg improving, the previous requirement, "the monthly average price of GHO stays outside a 0.995<>1.005 price range" relating to the GHO Stewards ability to adjust the Borrow Rate is to be removed. This grants the GHO Stewards the ability to increase the Borrow Rate independent of GHO price performance.
`;
