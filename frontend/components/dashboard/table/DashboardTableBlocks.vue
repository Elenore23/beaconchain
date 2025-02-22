<script setup lang="ts">
import type { DataTableSortEvent } from 'primevue/datatable'
import type { VDBBlocksTableRow } from '~/types/api/validator_dashboard'
import type {
  Cursor, TableQueryParams,
} from '~/types/datatable'
import { useValidatorDashboardBlocksStore } from '~/stores/dashboard/useValidatorDashboardBlocksStore'
import { BcFormatHash } from '#components'
import { getGroupLabel } from '~/utils/dashboard/group'

const {
  dashboardKey, isPublic,
} = useDashboardKey()

const cursor = ref<Cursor>()
const pageSize = ref<number>(10)
const { t: $t } = useTranslation()

const {
  blocks,
  getBlocks,
  isLoading,
  query: lastQuery,
} = useValidatorDashboardBlocksStore()
const {
  bounce: setQuery,
  temp: tempQuery,
  value: query,
} = useDebounceValue<TableQueryParams | undefined>(undefined, 500)

const { groups } = useValidatorDashboardGroups()
const {
  hasValidators, overview,
} = useValidatorDashboardOverviewStore()

const { width } = useWindowSize()
const colsVisible = computed(() => {
  return {
    age: width.value > 1005,
    epoch: width.value > 1260,
    graffiti: width.value > 1370,
    groupSort: width.value > 450,
    mobileStatus: width.value < 1060,
    rewards: width.value > 650,
    rewardsRecipient: width.value > 850,
    slot: width.value > 1120,
    status: width.value > 750,
  }
})

const loadData = (query?: TableQueryParams) => {
  if (!query) {
    query = {
      limit: pageSize.value,
      sort: 'slot:desc',
    }
  }
  setQuery(query, true, true)
}

watch(
  [
    dashboardKey,
    overview,
  ],
  () => {
    loadData()
  },
  { immediate: true },
)

watch(
  query,
  (q) => {
    if (q) {
      getBlocks(dashboardKey.value, q)
    }
  },
  { immediate: true },
)

const groupNameLabel = (groupId?: number) => {
  return getGroupLabel($t, groupId, groups.value, 'Σ')
}

const onSort = (sort: DataTableSortEvent) => {
  loadData(setQuerySort(sort, lastQuery.value))
}

const setCursor = (value: Cursor) => {
  cursor.value = value
  loadData(setQueryCursor(value, lastQuery.value))
}

const setPageSize = (value: number) => {
  pageSize.value = value
  loadData(setQueryPageSize(value, lastQuery.value))
}

const setSearch = (value?: string) => {
  loadData(setQuerySearch(value, lastQuery.value))
}

const getRowClass = (row: VDBBlocksTableRow) => {
  if (row.status === 'scheduled') {
    return 'future-row'
  }
}

const isRowExpandable = (row: VDBBlocksTableRow) => {
  return row.status !== 'scheduled'
}
</script>

<template>
  <div>
    <BcTableControl
      :title="$t('dashboard.validator.blocks.title')"
      :search-placeholder="
        $t(
          isPublic
            ? 'dashboard.validator.blocks.search_placeholder_public'
            : 'dashboard.validator.blocks.search_placeholder',
        )
      "
      @set-search="setSearch"
    >
      <template #table>
        <ClientOnly fallback-tag="span">
          <BcTable
            :data="blocks"
            data-key="slot"
            :expandable="!colsVisible.graffiti"
            class="block-table"
            :cursor
            :page-size
            :row-class="getRowClass"
            :add-spacer="true"
            :is-row-expandable
            :selected-sort="tempQuery?.sort"
            :loading="isLoading"
            @set-cursor="setCursor"
            @sort="onSort"
            @set-page-size="setPageSize"
          >
            <Column
              field="proposer"
              :sortable="true"
              :header="$t('block.col.proposer')"
              body-class="proposer"
              header-class="proposer"
            >
              <template #body="slotProps">
                <BcLink
                  :to="`/validator/${slotProps.data.proposer}`"
                  target="_blank"
                  class="link"
                >
                  {{ slotProps.data.proposer || "-" }}
                </BcLink>
              </template>
            </Column>
            <Column
              field="group_id"
              body-class="group-id"
              header-class="group-id"
              :header="$t('dashboard.validator.col.group')"
            >
              <template #body="slotProps">
                <span>
                  {{ groupNameLabel(slotProps.data.group_id) }}
                </span>
              </template>
            </Column>
            <Column
              v-if="colsVisible.epoch"
              field="epoch"
              :header="$t('common.epoch')"
            >
              <template #body="slotProps">
                <BcLink
                  :to="`/epoch/${slotProps.data.epoch}`"
                  target="_blank"
                  class="link"
                >
                  <BcFormatNumber
                    :value="slotProps.data.epoch"
                    default="-"
                  />
                </BcLink>
              </template>
            </Column>
            <Column
              v-if="colsVisible.slot"
              field="slot"
              :sortable="true"
              :header="$t('common.slot')"
            >
              <template #body="slotProps">
                <BcLink
                  :to="`/slot/${slotProps.data.slot}`"
                  target="_blank"
                  class="link"
                >
                  <BcFormatNumber
                    :value="slotProps.data.slot"
                    default="-"
                  />
                </BcLink>
              </template>
            </Column>
            <Column
              field="block"
              :sortable="true"
              :header="$t('common.block')"
            >
              <template #body="slotProps">
                <BcLink
                  v-if="slotProps.data.block || slotProps.data.slot === 0"
                  :to="`/block/${slotProps.data.block}`"
                  target="_blank"
                  class="link"
                >
                  <BcFormatNumber
                    :value="slotProps.data.block"
                    default="0"
                  />
                </BcLink>
                <span v-else>-</span>
              </template>
            </Column>
            <Column
              v-if="colsVisible.age"
              field="age"
              body-class="age-field"
            >
              <template #header>
                <BcTableAgeHeader />
              </template>
              <template #body="slotProps">
                <BcFormatTimePassed :value="slotProps.data.epoch" />
              </template>
            </Column>
            <Column
              v-if="colsVisible.status"
              field="status"
              :sortable="!colsVisible.mobileStatus"
              :header="$t('dashboard.validator.col.status')"
              :body-class="
                colsVisible.mobileStatus ? 'status-mobile status' : 'status'
              "
            >
              <template #body="slotProps">
                <BlockTableStatus
                  class="block-status"
                  :block-slot="slotProps.data.slot"
                  :status="slotProps.data.status"
                  :mobile="colsVisible.mobileStatus"
                />
              </template>
            </Column>
            <Column
              v-if="colsVisible.rewardsRecipient"
              field="reward_recipient"
              header-class="reward_recipient"
              :header="$t('dashboard.validator.col.reward_recipient')"
            >
              <template #body="slotProps">
                <BcFormatHash
                  v-if="slotProps.data.reward_recipient?.hash"
                  type="address"
                  class="reward_recipient"
                  :no-wrap="true"
                  :hash="slotProps.data.reward_recipient?.hash"
                  :ens="slotProps.data.reward_recipient?.ens"
                />
                <span v-else>-</span>
              </template>
            </Column>
            <Column
              v-if="colsVisible.rewards"
              field="reward"
              :sortable="true"
              body-class="reward"
              header-class="reward"
              :header="$t('dashboard.validator.col.proposer_rewards')"
            >
              <template #body="slotProps">
                <BlockTableRewardItem
                  :reward="slotProps.data.reward"
                  :status="slotProps.data.status"
                />
              </template>
            </Column>
            <Column
              v-if="colsVisible.graffiti"
              field="graffiti"
              body-class="graffiti"
              header-class="graffiti"
              :header="$t('block.col.graffiti')"
            >
              <template #body="slotProps">
                <BcFormatGraffiti :graffiti="slotProps.data.graffiti" />
              </template>
            </Column>
            <template #expansion="slotProps">
              <div class="expansion">
                <div class="row">
                  <div class="label">
                    {{ $t("common.epoch") }}:
                  </div>
                  <BcLink
                    :to="`/epoch/${slotProps.data.epoch}`"
                    target="_blank"
                    class="link"
                  >
                    <BcFormatNumber
                      :value="slotProps.data.epoch"
                      default="-"
                    />
                  </BcLink>
                </div>
                <div class="row">
                  <div class="label">
                    {{ $t("common.slot") }}:
                  </div>
                  <BcLink
                    :to="`/slot/${slotProps.data.slot}`"
                    target="_blank"
                    class="link"
                  >
                    <BcFormatNumber
                      :value="slotProps.data.slot"
                      default="-"
                    />
                  </BcLink>
                </div>
                <div class="row">
                  <div class="label">
                    <BcTableAgeHeader />
                  </div>
                  <BcFormatTimePassed
                    class="age-field"
                    :value="slotProps.data.epoch"
                  />
                </div>
                <div class="row">
                  <div class="label">
                    {{ $t("dashboard.validator.col.status") }}:
                  </div>
                  <div class="value">
                    <BlockTableStatus
                      :block-slot="slotProps.data.slot"
                      :status="slotProps.data.status"
                      :mobile="false"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="label">
                    {{ $t("dashboard.validator.col.reward_recipient") }}:
                  </div>
                  <BcFormatHash
                    v-if="slotProps.data.reward_recipient?.hash"
                    type="address"
                    class="reward_recipient"
                    :no-wrap="true"
                    :hash="slotProps.data.reward_recipient?.hash"
                    :ens="slotProps.data.reward_recipient?.ens"
                  />
                  <span v-else>-</span>
                </div>
                <div class="row">
                  <div class="label">
                    {{ $t("dashboard.validator.col.proposer_rewards") }}:
                  </div>
                  <BlockTableRewardItem
                    :reward="slotProps.data.reward"
                    :status="slotProps.data.status"
                  />
                </div>
                <div class="row">
                  <div class="label">
                    {{ $t("block.col.graffiti") }}:
                  </div>
                  <BcFormatGraffiti :graffiti="slotProps.data.graffiti" />
                </div>
              </div>
            </template>
            <template #empty>
              <DashboardTableAddValidator v-if="!hasValidators" />
            </template>
          </BcTable>
        </ClientOnly>
      </template>
    </BcTableControl>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/css/utils.scss";

:deep(.block-table) {
  > .p-datatable-wrapper {
    min-height: 529px;
  }

  .proposer {
    @include utils.set-all-width(110px);
  }

  .group-id {
    @include utils.set-all-width(120px);
    @include utils.truncate-text;
  }

  @media (max-width: 399px) {
    .group-id {
      @include utils.set-all-width(80px);
      @include utils.truncate-text;
    }
  }

  .status-mobile {
    @include utils.set-all-width(40px);
    @include utils.truncate-text;
  }

  .age-field {
    white-space: nowrap;
  }
  tr > td.age-field {
    padding: 0 7px;
    @include utils.set-all-width(142px);
  }

  .reward,
  .reward_recipient {
    .p-column-title {
      @include utils.truncate-text;
    }
  }
  .reward {
    padding: 4px 7px !important;
  }
  .status {
    padding: 13px 7px !important;
  }

  .graffiti {
    @include utils.set-all-width(140px);
    @include utils.truncate-text;
  }

  .future-row {
    td {
      > div:not(.block-status),
      > span {
        opacity: 0.5;
      }
    }
  }
}

.reward_recipient {
  @include utils.set-all-width(120px);
}

.expansion {
  display: flex;
  flex-direction: column;
  gap: var(--padding-small);
  padding: var(--padding) 41px;
  background: var(--table-header-background);
  font-size: var(--small_text_font_size);

  .row {
    display: flex;
    align-items: center;

    .label {
      width: 90px;
      font-weight: var(--small_text_bold_font_weight);
      flex-shrink: 0;
    }

    .value {
      text-wrap: wrap;
      word-break: break-all;
    }
  }
}
</style>
