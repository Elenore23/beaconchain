<script lang="ts" setup>
import { useNotificationsManagementStore } from '~/stores/notifications/useNotificationsManagementStore'

const { t: $t } = useTranslation()
const { user } = useUserStore()
const hasAbilityCustomMachineAlerts = computed(() => user.value?.premium_perks.notifications_machine_custom_threshold)

const notificationsManagementStore = useNotificationsManagementStore()
const {
  status,
} = useAsyncData(
  () => notificationsManagementStore
    .getSettings()
    .then(({ data }) => notificationsManagementStore.settings = data),
)

const waitExtraLongForSliders = 5000
watchDebounced(() => notificationsManagementStore.settings.general_settings, async () => {
  await notificationsManagementStore.saveSettings()
}, {
  deep: true,
  maxWait: waitExtraLongForSliders,
})

const hasMachines = computed(() => notificationsManagementStore.settings.has_machines)
</script>

<template>
  <div>
    <BcTabPanel
      class="loading-container"
    >
      <div
        v-if="status === 'pending'"
        class="loading"
      >
        <BcLoadingSpinner
          class="spinner"
          alignment="center"
          has-backdrop
          size="large"
          loading
        />
      </div>
      <div class="notifications-management-machines__content">
        <BcListSection>
          <BcText
            class="grid-span-2"
            :is-dimmed="!hasMachines"
          >
            {{ $t('notifications.machine.settings.machine_offline') }}
          </BcText>
          <BcToggle
            v-model="notificationsManagementStore.settings.general_settings.is_machine_offline_subscribed"
            class="toggle"
            :disabled="!hasMachines"
          />
        </BcListSection>
        <BcListSection
          has-border-top
          :class="{ 'is-text-disabled': !hasAbilityCustomMachineAlerts }"
        >
          <BcText
            :is-dimmed="!hasMachines"
          >
            {{ $t('notifications.machine.settings.storage_usage') }}
          </BcText>
          <span class="slider-container">
            <BcSlider
              v-model="notificationsManagementStore.settings.general_settings.machine_storage_usage_threshold"
              class="slider"
              :min="0.05"
              :max="0.99"
              :step="0.01"
              :disabled="!hasMachines || !hasAbilityCustomMachineAlerts"
            />
            <span class="slider-value">
              <BcTextNumber prefix="≥ " suffix=" %" min-width="2ch">
                {{
                  formatFraction(notificationsManagementStore
                    .settings
                    .general_settings
                    .machine_storage_usage_threshold,
                  )
                }}
              </BcTextNumber>
            </span>
            <BcPremiumGem
              v-if="!hasAbilityCustomMachineAlerts"
              :tool-tip-text="$t('notifications.machine.settings.subscribe_to_premium_storage')"
              tooltip-width="220px"
              :screenreader-text="$t('notifications.machine.settings.subscribe_to_premium_storage')"
            />

          </span>
          <BcToggle
            v-model="notificationsManagementStore.settings.general_settings.is_machine_storage_usage_subscribed"
            class="toggle"
            :disabled="!hasMachines"
          />
          <BcText
            :is-dimmed="!hasMachines"
          >
            {{ $t('notifications.machine.settings.cpu_usage') }}
          </BcText>
          <span class="slider-container">
            <BcSlider
              v-model="notificationsManagementStore.settings.general_settings.machine_cpu_usage_threshold"
              class="slider"
              :min="0.05"
              :max="0.99"
              :step="0.01"
              :disabled="!hasMachines || !hasAbilityCustomMachineAlerts"
            />
            <span class="slider-value">
              <BcTextNumber prefix="≥ " suffix=" %" min-width="2ch">
                {{
                  formatFraction(notificationsManagementStore
                    .settings
                    .general_settings
                    .machine_cpu_usage_threshold,
                  )
                }}
              </BcTextNumber>
            </span>
            <BcPremiumGem
              v-if="!hasAbilityCustomMachineAlerts"
              :tool-tip-text="$t('notifications.machine.settings.subscribe_to_premium_cpu')"
              tooltip-width="220px"
              :screenreader-text="$t('notifications.machine.settings.subscribe_to_premium_cpu')"
            />
          </span>
          <BcToggle
            v-model="notificationsManagementStore.settings.general_settings.is_machine_cpu_usage_subscribed"
            class="toggle"
            :disabled="!hasMachines"
          />
          <BcText
            :is-dimmed="!hasMachines"
          >
            {{ $t('notifications.machine.settings.memory_usage') }}
          </BcText>
          <span class="slider-container">
            <BcSlider
              v-model="notificationsManagementStore.settings.general_settings.machine_memory_usage_threshold"
              class="slider"
              :min="0.1"
              :max="0.99"
              :step="0.01"
              :disabled="!hasMachines || !hasAbilityCustomMachineAlerts"
            />
            <BcTextNumber prefix="≥ " suffix=" %" min-width="2ch">
              {{
                formatFraction(notificationsManagementStore
                  .settings
                  .general_settings
                  .machine_memory_usage_threshold,
                )
              }}
            </BcTextNumber>
            <BcPremiumGem
              v-if="!hasAbilityCustomMachineAlerts"
              :tool-tip-text="$t('notifications.machine.settings.subscribe_to_premium_memory')"
              tooltip-width="220px"
              :screenreader-text="$t('notifications.machine.settings.subscribe_to_premium_memory')"
            />
          </span>
          <BcToggle
            v-model="notificationsManagementStore.settings.general_settings.is_machine_memory_usage_subscribed" class="toggle"
            :disabled="!hasMachines"
          />
        </BcListSection>
      </div>
    </BcTabPanel>
    <div v-if="!hasMachines" class="info">
      <BcText tag="p" variant="lg">
        {{ $t('notifications.machine.settings.info') }}
      </BcText>
    </div>
    <div class="tutorial">
      <BcText variant="lg" tag="p">
        {{ $t('notifications.machine.settings.check_out_knowlege_base') }}
        <br>
        <BcLink
          to="https://kb.beaconcha.in/v1-beaconcha.in-explorer/mobile-app-less-than-greater-than-beacon-node"
          class="link"
        >
          {{ $t('notifications.machine.settings.mobile_app_node_monitoring') }}
        </BcLink>
      </BcText>
      <div class="images">
        <BcLinkImage
          :screenreader-text="$t('common.download_app_ios')"
          to="https://apps.apple.com/app/beaconchain-dashboard/id1541822121"
        >
          <img width="135" src="/img/download_on_the_app_store.svg" alt="">
        </BcLinkImage>
        <BcLinkImage
          :screenreader-text="$t('common.download_app_google')"
          to="https://play.google.com/store/apps/details?id=in.beaconcha.mobile"
        >
          <img width="135" src="/img/get_it_on_goole_play.svg" alt="">
        </BcLinkImage>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-container {
  position: relative;;
}
.loading {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.info{
  text-align: center;
  color: var(--grey);
  margin-block: 3.75rem;
}
.is-text-disabled {
  color: var(--grey);
}
.slider-container {
  display: flex;
  gap: 10px;
}
.toggle {
  justify-content: end;
  margin: 0;
}
.grid-span-2{
  grid-column: span 2;
}
.tutorial {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2.125rem;
}
.images {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
