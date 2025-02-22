<script setup lang="ts">
import type { VDBSummaryTableRow } from '~/types/api/validator_dashboard'
import {
  type SummaryDetailsEfficiencyCombinedProp,
  type SummaryRow,
  type SummaryTableVisibility,
  type SummaryTimeFrame,
} from '~/types/dashboard/summary'

interface Props {
  absolute: boolean,
  row: VDBSummaryTableRow,
  tableVisibility: SummaryTableVisibility,
  timeFrame: SummaryTimeFrame,
}
const props = defineProps<Props>()

const { dashboardKey } = useDashboardKey()

const { t: $t } = useTranslation()
const {
  details: summary, getDetails,
}
  = useValidatorDashboardSummaryDetailsStore(
    dashboardKey.value,
    props.row.group_id,
  )

watch(
  () => props.timeFrame,
  () => {
    getDetails(props.timeFrame)
  },
  {
    deep: true,
    immediate: true,
  },
)

type CombinedPropOrUndefined = SummaryDetailsEfficiencyCombinedProp | undefined

const data = computed<SummaryRow[][]>(() => {
  const list: SummaryRow[][] = [
    [],
    [],
    [],
  ]

  const addToList = (
    index: number,
    prop?: SummaryDetailsEfficiencyCombinedProp,
  ) => {
    if (!prop) {
      return
    }
    const title = $t(`dashboard.validator.summary.row.${prop}`)
    const row = {
      prop,
      title,
    }
    list[index].push(row)
  }

  const addPropsTolist = (
    index: number,
    props: CombinedPropOrUndefined[],
  ) => {
    props.forEach(p => addToList(index, p))
  }

  const rewardCols: CombinedPropOrUndefined[]
  = [ (!props.tableVisibility.reward ? 'reward' : undefined) ]

  let addCols: CombinedPropOrUndefined[] = props.tableVisibility
    .attestations
    ? []
    : rewardCols
  addPropsTolist(0, [
    (!props.tableVisibility.efficiency ? 'efficiency' : undefined),
    ...addCols,
    'attestations',
    'attestations_source',
    'attestations_target',
    'attestations_head',
    'attestation_efficiency',
    'attestation_avg_incl_dist',
  ])

  addPropsTolist(1, [
    'sync',
    'validators_sync',
    'proposals',
    'validators_proposal',
    'slashings',
    'validators_slashings',
  ])

  addCols = !props.tableVisibility.attestations ? [] : rewardCols
  addPropsTolist(2, [
    'apr',
    'luck',
    ...addCols,
  ])

  return list
})

const rowClass = (data: SummaryRow) => {
  if (!data.prop) {
    return 'bold' // headline without prop
  }
  const classNames: Partial<
    Record<SummaryDetailsEfficiencyCombinedProp, string>
  > = {
    apr: props.tableVisibility.attestations ? '' : 'spacing-top',
    attestations: 'bold',
    attestations_head: 'spacing-top',
    efficiency: 'bold',
    luck: 'spacing-top',
    proposals: 'bold spacing-top',
    reward: 'bold',
    slashings: 'bold spacing-top',
    sync: props.tableVisibility.efficiency ? 'bold' : 'bold spacing-top',
  }
  return classNames[data.prop]
}
</script>

<template>
  <div
    v-if="summary"
    class="details-container"
  >
    <div
      v-for="(list, index) in data"
      :key="index"
      class="group"
    >
      <div
        v-for="(prop, pIndex) in list"
        :key="pIndex"
        :class="rowClass(prop)"
        class="row"
      >
        <div class="label">
          {{ prop.title }}
        </div>
        <DashboardTableSummaryValue
          v-if="prop.prop"
          class="value"
          :data="summary"
          :absolute
          :property="prop.prop"
          :time-frame
          :row="props.row"
          :in-detail-view="true"
        />
      </div>
    </div>
  </div>
  <div v-else>
    <BcLoadingSpinner
      class="spinner"
      :loading="true"
      alignment="center"
    />
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/css/utils.scss";

.details-container {
  display: flex;
  flex-wrap: wrap;
  padding: 6px 0 0 var(--padding);
  color: var(--container-color);
  background-color: var(--container-background);

  font-size: var(--small_text_font_size);

  .bold {
    font-weight: var(--standard_text_bold_font_weight);
  }

  .group {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 6px var(--padding-large);
    margin: var(--padding) 0;
    width: 33%;

    &:not(:first-child) {
      border-left: var(--container-border);
    }

    .spacing-top {
      margin-top: var(--padding-small);
    }

    @media (max-width: 1014px) {
      width: 50%;

      &:last-child {
        border-top: var(--container-border);
        border-left: unset;
        margin-top: 0;

        @media (max-width: 729px) {
          border-top: unset;
        }
      }
    }

    @media (max-width: 729px) {
      width: 340px;

      &:not(:first-child) {
        border-left: unset;
        margin-top: 0;
      }
    }

    .row {
      display: flex;
      gap: var(--padding);

      .label {
        flex-shrink: 0;
        width: 170px;
        @include utils.truncate-text;

        @media (max-width: 729px) {
          width: 151px;
        }
      }

      .value {
        flex-grow: 1;
        overflow: hidden;
      }
    }
  }
}

.spinner {
  padding: var(--padding-large);
}
</style>
