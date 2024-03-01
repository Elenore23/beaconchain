// Code generated by tygo. DO NOT EDIT.
/* eslint-disable */
import type { ApiDataResponse } from './common'

//////////
// source: slot_viz.go

/**
 * ------------------------------------------------------------
 * Slot Viz
 */
export interface VDBSlotVizDuty {
  total_count: number /* uint64 */;
  validators: number /* uint64 */[]; // up to 6 validators that performed the duty, only for scheduled and failed
}
export interface VDBSlotVizTuple {
  validator: number /* uint64 */;
  duty_object: number /* uint64 */;
}
export interface VDBSlotVizSlashing {
  total_count: number /* uint64 */;
  slashings: VDBSlotVizTuple[]; // up to 6 slashings, validator is always the slashing validator
}
export interface VDBSlotVizStatus<T extends any> {
  success?: T;
  failed?: T;
  scheduled?: T;
}
export interface VDBSlotVizSlot {
  slot: number /* uint64 */;
  status: 'proposed' | 'missed' | 'scheduled' | 'orphaned';
  proposal?: VDBSlotVizTuple;
  attestations: VDBSlotVizStatus<VDBSlotVizDuty>;
  sync: VDBSlotVizStatus<VDBSlotVizDuty>;
  slashing: VDBSlotVizStatus<VDBSlotVizSlashing>;
}
export interface SlotVizEpoch {
  epoch: number /* uint64 */;
  state?: 'scheduled' | 'head' | 'justifying' | 'justified' | 'finalized'; // only on landing page
  progress?: number /* float64 */; // only on landing page
  slots?: VDBSlotVizSlot[]; // only on dashboard page
}
export type InternalGetValidatorDashboardSlotVizResponse = ApiDataResponse<SlotVizEpoch[]>;
