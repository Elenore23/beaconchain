// Code generated by tygo. DO NOT EDIT.
/* eslint-disable */
import type { ApiDataResponse } from './common'

//////////
// source: latest_state.go

/**
 * EthConversionRate is the exchange rate of ETH to a specific currency
 */
export interface EthConversionRate {
  currency: string;
  code: string;
  symbol: string;
  rate: number /* float64 */;
}
export interface LatestStateData {
  current_slot: number /* uint64 */;
  finalized_epoch: number /* uint64 */;
  exchange_rates: EthConversionRate[];
}
export type InternalGetLatestStateResponse = ApiDataResponse<LatestStateData>;
