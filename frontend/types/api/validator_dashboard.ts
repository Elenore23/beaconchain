// Code generated by tygo. DO NOT EDIT.
/* eslint-disable */
import type { PeriodicClElValues, Luck, ApiDataResponse, ApiPagingResponse, StatusCount, ClElValue, ChartData, PubKey, Address, Hash } from './common'

//////////
// source: validator_dashboard.go

/**
 * ------------------------------------------------------------
 * Overview
 */
export interface VDBOverviewValidators {
  total: number /* uint64 */;
  active: number /* uint64 */;
  pending: number /* uint64 */;
  exited: number /* uint64 */;
  slashed: number /* uint64 */;
}
export interface VDBOverviewEfficiency {
  total: number /* float64 */;
  attestation: number /* float64 */;
  proposal: number /* float64 */;
  sync: number /* float64 */;
}
export interface VDBOverviewGroup {
  id: number /* uint64 */;
  name: string;
}
export interface VDBOverviewData {
  groups: VDBOverviewGroup[];
  validators: VDBOverviewValidators;
  efficiency: VDBOverviewEfficiency;
  rewards: PeriodicClElValues<string /* decimal.Decimal */>;
  luck: Luck;
  apr: PeriodicClElValues<number /* float64 */>;
}
export type InternalGetValidatorDashboardResponse = ApiDataResponse<VDBOverviewData>;
/**
 * ------------------------------------------------------------
 * Summary Tab
 */
export interface VDBSummaryTableRow {
  group_id: number /* uint64 */;
  efficiency_day: number /* float64 */;
  efficiency_week: number /* float64 */;
  efficiency_month: number /* float64 */;
  efficiency_total: number /* float64 */;
  validators: number /* uint64 */[];
}
export type InternalGetValidatorDashboardSummaryResponse = ApiPagingResponse<VDBSummaryTableRow>;
export interface VDBGroupSummaryColumnItem {
  status_count: StatusCount;
  earned: string /* decimal.Decimal */;
  penalty: string /* decimal.Decimal */;
  validators?: number /* uint64 */[];
}
export interface VDBGroupSummaryColumn {
  attestation_head: VDBGroupSummaryColumnItem;
  attestation_source: VDBGroupSummaryColumnItem;
  attestation_target: VDBGroupSummaryColumnItem;
  attestation_efficiency: number /* float64 */;
  attestation_avg_incl_dist: number /* float64 */;
  sync: VDBGroupSummaryColumnItem;
  proposals: VDBGroupSummaryColumnItem;
  slashed: VDBGroupSummaryColumnItem; // Failed slashings are count of validators in the group that were slashed
  apr: ClElValue<number /* float64 */>;
  income: ClElValue<string /* decimal.Decimal */>;
  luck: Luck;
}
export interface VDBGroupSummaryData {
  details_day: VDBGroupSummaryColumn;
  details_week: VDBGroupSummaryColumn;
  details_month: VDBGroupSummaryColumn;
  details_total: VDBGroupSummaryColumn;
}
export type InternalGetValidatorDashboardGroupSummaryResponse = ApiDataResponse<VDBGroupSummaryData>;
export type InternalGetValidatorDashboardSummaryChartResponse = ApiDataResponse<ChartData<number /* int */>>; // line chart, series id is group id, no stack
/**
 * ------------------------------------------------------------
 * Rewards Tab
 */
export interface VDBRewardesTableDuty {
  attestation: number /* float64 */;
  proposal: number /* float64 */;
  sync: number /* float64 */;
  slashing: number /* uint64 */;
}
export interface VDBRewardsTableRow {
  epoch: number /* uint64 */;
  duty: VDBRewardesTableDuty;
  group_id: number /* uint64 */;
  reward: ClElValue<string /* decimal.Decimal */>;
}
export type InternalGetValidatorDashboardRewardsResponse = ApiPagingResponse<VDBRewardsTableRow>;
export interface VDBGroupRewardsDetails {
  status_count: StatusCount;
  income: string /* decimal.Decimal */;
}
export interface VDBGroupRewardsData {
  attestation_source: VDBGroupRewardsDetails;
  attestation_target: VDBGroupRewardsDetails;
  attestation_head: VDBGroupRewardsDetails;
  sync: VDBGroupRewardsDetails;
  slashing: VDBGroupRewardsDetails;
  proposal: VDBGroupRewardsDetails;
  proposal_el_reward: string /* decimal.Decimal */;
}
export type InternalGetValidatorDashboardGroupRewardsResponse = ApiDataResponse<VDBGroupRewardsData>;
export type InternalGetValidatorDashboardRewardsChartResponse = ApiDataResponse<ChartData<number /* int */>>; // bar chart, series id is group id, stack is 'execution' or 'consensus'
/**
 * Duties Modal
 */
export interface VDBEpochDutiesItem {
  status: 'success' | 'partial' | 'failed' | 'orphaned';
  reward: string /* decimal.Decimal */;
}
export interface VDBEpochDutiesTableRow {
  validator: number /* uint64 */;
  attestation_source: VDBEpochDutiesItem;
  attestation_target: VDBEpochDutiesItem;
  attestation_head: VDBEpochDutiesItem;
  proposal: VDBEpochDutiesItem;
  sync: VDBEpochDutiesItem;
  slashing: VDBEpochDutiesItem;
}
export type InternalGetValidatorDashboardDutiesResponse = ApiPagingResponse<VDBEpochDutiesTableRow>;
/**
 * ------------------------------------------------------------
 * Blocks Tab
 */
export interface VDBBlocksTableRow {
  proposer: number /* uint64 */;
  group_id: number /* uint64 */;
  epoch: number /* uint64 */;
  slot: number /* uint64 */;
  block: number /* uint64 */;
  status: 'success' | 'missed' | 'orphaned' | 'scheduled';
  reward: ClElValue<string /* decimal.Decimal */>;
}
export type InternalGetValidatorDashboardBlocksResponse = ApiPagingResponse<VDBBlocksTableRow>;
/**
 * ------------------------------------------------------------
 * Heatmap Tab
 */
export interface VDBHeatmapCell {
  x: number /* uint64 */;
  y: number /* uint64 */;
  value: number /* float64 */; // Attestaton Rewards
}
export interface VDBHeatmap {
  epochs: number /* uint64 */[]; // X-Axis Categories
  group_ids: number /* uint64 */[]; // Y-Axis Categories
  data: VDBHeatmapCell[];
}
export type InternalGetValidatorDashboardHeatmapResponse = ApiDataResponse<VDBHeatmap>;
export interface VDBHeatmapTooltipDuty {
  validator: number /* uint64 */;
  status: 'success' | 'failed' | 'orphaned';
}
export interface VDBHeatmapTooltipData {
  epoch: number /* uint64 */;
  proposers: VDBHeatmapTooltipDuty[];
  syncs: VDBHeatmapTooltipDuty[];
  slashings: VDBHeatmapTooltipDuty[];
  attestation_head: StatusCount;
  attestation_source: StatusCount;
  attestation_target: StatusCount;
  attestation_income: string /* decimal.Decimal */;
}
export type InternalGetValidatorDashboardGroupHeatmapResponse = ApiDataResponse<VDBHeatmapTooltipData>;
/**
 * ------------------------------------------------------------
 * Deposits Tab
 */
export interface VDBExecutionDepositsTableRow {
  public_key: PubKey;
  index: number /* uint64 */;
  group_id: number /* uint64 */;
  block: number /* uint64 */;
  from: Address;
  depositor: Address;
  tx_hash: Hash;
  withdrawal_credentials: Hash;
  amount: string /* decimal.Decimal */;
  valid: boolean;
}
export type InternalGetValidatorDashboardExecutionLayerDepositsResponse = ApiPagingResponse<VDBExecutionDepositsTableRow>;
export interface VDBConsensusDepositsTableRow {
  public_key: PubKey;
  index: number /* uint64 */;
  group_id: number /* uint64 */;
  epoch: number /* uint64 */;
  slot: number /* uint64 */;
  withdrawal_credential: Hash;
  amount: string /* decimal.Decimal */;
  signature: Hash;
}
export type InternalGetValidatorDashboardConsensusLayerDepositsResponse = ApiPagingResponse<VDBConsensusDepositsTableRow>;
/**
 * ------------------------------------------------------------
 * Withdrawals Tab
 */
export interface VDBWithdrawalsTableRow {
  epoch: number /* uint64 */;
  index: number /* uint64 */;
  group_id: number /* uint64 */;
  recipient: Address;
  amount: string /* decimal.Decimal */;
}
export type InternalGetValidatorDashboardWithdrawalsResponse = ApiPagingResponse<VDBWithdrawalsTableRow>;
/**
 * ------------------------------------------------------------
 * Manage Modal
 */
export interface VDBManageValidatorsTableRow {
  index: number /* uint64 */;
  public_key: PubKey;
  group_id: number /* uint64 */;
  balance: string /* decimal.Decimal */;
  status: string;
  withdrawal_credential: Hash;
}
export type InternalGetValidatorDashboardValidatorsResponse = ApiPagingResponse<VDBManageValidatorsTableRow>;
/**
 * ------------------------------------------------------------
 * Misc.
 */
export type VDBIdPrimary = number /* int */;
export type VDBIdPublic = string;
export type VDBIdValidatorSet = VDBValidator[];
export interface VDBValidator {
  index: number /* uint64 */;
  version: number /* uint64 */;
}
export interface VDBPostReturnData {
  id: number /* uint64 */;
  user_id: number /* uint64 */;
  name: string;
  network: number /* uint64 */;
  created_at: string /* time.Time */;
}
export interface VDBPostValidatorsData {
  public_key: string;
  group_id: number /* uint64 */;
}
export interface VDBPostPublicIdData {
  public_id: string;
  name: string;
  share_settings: {
    group_names: boolean;
  };
}
