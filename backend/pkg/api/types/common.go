package types

import (
	"github.com/shopspring/decimal"
)

// frontend can ignore ApiResponse type, it's just for the backend

type Paging struct {
	PrevCursor string `json:"prev_cursor,omitempty"`
	NextCursor string `json:"next_cursor,omitempty"`
	TotalCount uint64 `json:"total_count,omitempty"`
}
type ApiResponse struct {
	Paging *Paging     `json:"paging,omitempty"`
	Data   interface{} `json:"data"`
}

type ApiErrorResponse struct {
	Error string `json:"error"`
}

type ApiDataResponse[T any] struct {
	Data T `json:"data"`
}
type ApiPagingResponse[T any] struct {
	Paging Paging `json:"paging"`
	Data   []T    `json:"data"`
}

type PubKey string
type Hash string // blocks, txs etc.

type Address struct {
	Hash       Hash   `json:"hash"`
	IsContract bool   `json:"is_contract"`
	Ens        string `json:"ens,omitempty"`
	Label      string `json:"label,omitempty"`
}

type LuckItem struct {
	Percent                float64 `json:"percent"`
	ExpectedTimestamp      uint64  `json:"expected_timestamp"`
	AverageIntervalSeconds uint64  `json:"average_interval_seconds"`
}

type Luck struct {
	Proposal LuckItem `json:"proposal"`
	Sync     LuckItem `json:"sync"`
}

type StatusCount struct {
	Success uint64 `json:"success"`
	Failed  uint64 `json:"failed"`
}

type ClElValue[T any] struct {
	El T `json:"el"`
	Cl T `json:"cl"`
}

type PeriodicValues[T any] struct {
	AllTime T `json:"all_time"`
	Last24h T `json:"last_24h"`
	Last7d  T `json:"last_7d"`
	Last30d T `json:"last_30d"`
}

type PercentageDetails[T any] struct {
	Percentage float64 `json:"percentage"`
	MinValue   T       `json:"min_value"`
	MaxValue   T       `json:"max_value"`
}

type ChartSeries[I int | string, D float64 | decimal.Decimal] struct {
	Id       I      `json:"id"`                 // id may be a string or an int
	Property string `json:"property,omitempty"` // for stacking bar charts
	Data     []D    `json:"data"`               // y-axis values
}

type ChartData[I int | string, D float64 | decimal.Decimal] struct {
	Categories []uint64            `json:"categories"` // x-axis
	Series     []ChartSeries[I, D] `json:"series"`
}

type ValidatorHistoryEvent struct {
	Status string          `json:"status" tstype:"'success' | 'partial' | 'failed'" faker:"oneof: success, partial, failed"`
	Income decimal.Decimal `json:"income"`
}

type ValidatorHistoryProposal struct {
	Status                       string          `json:"status" tstype:"'success' | 'partial' | 'failed'" faker:"oneof: success, partial, failed"`
	ElIncome                     decimal.Decimal `json:"el_income"`
	ClAttestationInclusionIncome decimal.Decimal `json:"cl_attestation_inclusion_income"`
	ClSyncInclusionIncome        decimal.Decimal `json:"cl_sync_inclusion_income"`
	ClSlashingInclusionIncome    decimal.Decimal `json:"cl_slashing_inclusion_income"`
}

type ValidatorHistoryDuties struct {
	AttestationSource *ValidatorHistoryEvent    `json:"attestation_source,omitempty"`
	AttestationTarget *ValidatorHistoryEvent    `json:"attestation_target,omitempty"`
	AttestationHead   *ValidatorHistoryEvent    `json:"attestation_head,omitempty"`
	Sync              *ValidatorHistoryEvent    `json:"sync,omitempty"`
	Slashing          *ValidatorHistoryEvent    `json:"slashing,omitempty"`
	Proposal          *ValidatorHistoryProposal `json:"proposal,omitempty"`

	SyncCount uint64 `json:"sync_count,omitempty"` // count of successful sync duties for the epoch
}

type ChainConfig struct {
	ChainId uint64 `json:"chain_id"`
	Name    string `json:"name"`
	// TODO: add more fields, depending on what frontend needs
}

type SearchResult struct {
	Type      string  `json:"type"`
	ChainId   uint64  `json:"chain_id"`
	HashValue string  `json:"hash_value,omitempty"`
	StrValue  string  `json:"str_value,omitempty"`
	NumValue  *uint64 `json:"num_value,omitempty"`
}

type InternalPostSearchResponse ApiDataResponse[[]SearchResult]

type VDBPublicId struct {
	PublicId      string `json:"public_id"`
	DashboardId   int    `json:"-"`
	Name          string `json:"name,omitempty"`
	ShareSettings struct {
		ShareGroups bool `json:"share_groups"`
	} `json:"share_settings"`
}

type ChartHistorySeconds struct {
	Epoch  uint64 `json:"epoch"`
	Hourly uint64 `json:"hourly"`
	Daily  uint64 `json:"daily"`
	Weekly uint64 `json:"weekly"`
}

type IndexEpoch struct {
	Index uint64 `json:"index"`
	Epoch uint64 `json:"epoch"`
}

type IndexBlocks struct {
	Index  uint64   `json:"index"`
	Blocks []uint64 `json:"blocks"`
}

type IndexSlots struct {
	Index uint64   `json:"index"`
	Slots []uint64 `json:"slots"`
}

type ValidatorStateCounts struct {
	Online  uint64 `json:"online"`
	Offline uint64 `json:"offline"`
	Pending uint64 `json:"pending"`
	Exited  uint64 `json:"exited"`
	Slashed uint64 `json:"slashed"`
}
