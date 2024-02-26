// Code generated by tygo. DO NOT EDIT.
/* eslint-disable */

//////////
// source: common.go

export interface Paging {
    prev_cursor?: string;
    next_cursor?: string;
    total_count?: number /* uint64 */;
}
export interface ApiResponse {
    paging?: Paging;
    data: any;
}
export interface ApiErrorResponse {
    error: string;
}
export interface ApiDataResponse<T extends any> {
    data: T;
}
export interface ApiPagingResponse<T extends any> {
    paging: Paging;
    data: T[];
}
export type PubKey = string;
export type Hash = string; // blocks, txs etc.
export interface Address {
    hash: Hash;
    ens?: string;
}
export interface LuckItem {
    percent: number /* float64 */;
    expected: string /* time.Time */;
    average: any /* time.Duration */;
}
export interface Luck {
    proposal: LuckItem;
    sync: LuckItem;
}
export interface StatusCount {
    success: number /* uint64 */;
    failed: number /* uint64 */;
}
export type ClElUnion = 
        number /* float64 */ | string /* decimal.Decimal */;
export interface ClElValue<T extends ClElUnion> {
    el: T;
    cl: T;
}
export interface PeriodicClElValues<T extends ClElUnion> {
    total: ClElValue<T>;
    day: ClElValue<T>;
    week: ClElValue<T>;
    month: ClElValue<T>;
    year: ClElValue<T>;
}
export interface HighchartsDataPoint {
    x: number /* float64 */;
    y: number /* float64 */;
}
export interface HighchartsSeries {
    name: string;
    data: HighchartsDataPoint[];
}
export interface SearchResult {
    type: string;
    chain_id: number /* uint64 */;
    hash_value?: string;
    num_value?: number /* uint64 */;
    str_value?: string;
}
export interface SearchResponse {
    data: SearchResult[];
}
export interface Dashboard {
    id: string;
    name: string;
}
export interface DashboardData {
    validator_dashboards: Dashboard[];
    account_dashboards: Dashboard[];
}
