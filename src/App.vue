<template>
  <v-app>
    <Header></Header>
    <v-stepper v-model="steps" v-if="!finishReservation">
      <v-stepper-header>
        <v-stepper-step :editable="steps > 0" step="1">
          Otel ve tarihi secimi
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :editable="steps > 1" step="2">
          Oda tipi ve manzara secimi
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :editable="steps > 2" step="3">
          Onizleme ve odeme islemleri
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <Hotels @showDialog="showDialog" @toStep="changeStep"></Hotels>
        </v-stepper-content>

        <v-stepper-content step="2">
          <hotelDetails @showDialog="showDialog" @toStep="changeStep"></hotelDetails>
        </v-stepper-content>

        <v-stepper-content step="3">
          <Checkout @showDialog="showDialog" @toStep="changeStep"></Checkout>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <Preview v-else @showDialog="showDialog" @toStep="changeStep"></Preview>

    <v-dialog class="dialog" v-model="dialog" width="500">
      <v-card :class="{ 'dialog-success': dialogSuccess }">
        <div class="dialog-header d-flex justify-center py-3 mb-8">
          <h2 class="dialog-header-title">UYARI</h2>
        </div>
        <v-card-text>
          <p class="dialog-text" v-for="(message, i) in dialogMessage" :key="i">
            <v-icon class="dialog-icons mr-2" :color="dialogSuccess ? 'success' : 'error'">{{ dialogSuccess ? 'mdi-checkbox-marked-circle-outline' : 'mdi-alert-circle-outline' }}</v-icon
            >{{ message }}
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <div class="d-flex justify-end pa-4">
          <v-btn class="pa-3" color="secondary" @click="dialog = false">Tamam</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Header from './components/Header'
import Hotels from './components/Hotels'
import HotelDetails from './components/HotelDetails'
import Checkout from './components/Checkout'
import Preview from './components/Preview'
import { mapState } from 'vuex'

export default {
  name: 'App',

  components: {
    Header,
    Hotels,
    HotelDetails,
    Checkout,
    Preview,
  },

  data: () => ({
    steps: 1,
    dialog: false,
    dialogMessage: [],
    dialogSuccess: false,
  }),

  methods: {
    changeStep(step) {
      this.steps = step
    },

    showDialog(payload) {
      this.dialogMessage = payload.messages
      this.dialogSuccess = payload.dialogState ? payload.dialogState : false
      this.dialog = true
    },
  },

  computed: {
    ...mapState(['finishReservation']),
  },

  watch: {
    steps(n) {
      localStorage.setItem('step', n)
    },
  },

  created() {
    let defaultData = {
      hotel_id: null,
      start_date: null,
      end_date: null,
      adult: 0,
      child: 0,
      room_type: null,
      room_scenic: null,
      card_name: '',
      card_number: '',
      card_date_month: '',
      card_date_year: '',
      card_cvv: '',
      price: 0,
      coupon_code: '',
    }
    let storagedData = localStorage.getItem('reservationDetails')
    if (storagedData) {
      defaultData = JSON.parse(storagedData)
    }
    this.$store.dispatch('setForms', defaultData)
    let storagedStep = localStorage.getItem('step')
    if (storagedStep) {
      this.steps = Number(storagedStep)
    }
  },
}
</script>
<style lang="scss">
// .v-stepper {
//   &__content {
//     padding: 0 !important;
//   }
// }
</style>
