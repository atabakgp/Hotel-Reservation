<template>
  <div>
    <v-select :items="hotels" label="Rezervasyon yapmak istediginiz oteli seciniz" v-model="reservationDetails.hotel_id" item-text="hotel_name" item-value="id"> </v-select>
    <div class="hotel-checkins">
      <div class="hotel-checkins__item">
        <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="reservationDetails.start_date" label="Giris Tarihi" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="reservationDetails.start_date" @input="menu1 = false" :allowed-dates="allowedDatesIn"></v-date-picker>
        </v-menu>
      </div>
      <div class="hotel-checkins__item">
        <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="reservationDetails.end_date" label="Cikis tarihi" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="reservationDetails.end_date" @input="menu2 = false" :allowed-dates="allowedDatesOut"></v-date-picker>
        </v-menu>
      </div>
      <div class="hotel-checkins__item">
        <v-text-field v-model="reservationDetails.adult" type="number" min="0" :max="hotelDetail ? hotelDetail.max_adult_size : 0" label="yetiskin sayisi"></v-text-field>
      </div>
      <div class="hotel-checkins__item">
        <v-text-field v-model="reservationDetails.child" type="number" min="0" max="5" label="cocuk sayisi" :disabled="!child_status"></v-text-field>
        <v-alert type="warning" v-if="!child_status">
          Çocuk ziyaretçi kabul edilmiyor!
        </v-alert>
      </div>
    </div>
    <div class="hotel-checkins__btn">
      <v-btn color="primary" @click="checkValidation">Kaydet ve Devam et</v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import api from '../api/axios'

export default {
  name: 'Hotels',

  data: () => ({
    max_adult_size: 0,
    modal: false,
    menu1: false,
    menu2: false,
  }),

  computed: {
    ...mapState({
      hotels: (state) => state.hotels,
      reservationDetails: (state) => state.reservationDetails,
    }),

    ...mapGetters(['hotelDetail']),

    child_status() {
      return this.hotelDetail ? this.hotelDetail.child_status : true
    },
  },

  methods: {
    checkValidation() {
      if (this.reservationDetails.hotel_id == null) {
        this.$emit('showDialog', { messages: ['Lütfen bir otel seciniz'] })
      } else if (this.reservationDetails.start_date == null || this.reservationDetails.end_date == null) {
        this.$emit('showDialog', {
          messages: ['Lütfen giris ve cikis tarihlerini seciniz'],
        })
      } else if (this.reservationDetails.adult == 0) {
        this.$emit('showDialog', {
          messages: ['Lütfen yetiskin sayisi seciniz'],
        })
      } else {
        localStorage.setItem('reservationDetails', JSON.stringify(this.reservationDetails))
        this.$emit('toStep', 2)
      }
    },

    allowedDatesOut(val) {
      return new Date(val) > new Date(this.reservationDetails.start_date)
    },

    allowedDatesIn(val) {
      return new Date(val) >= Date.now()
    },
  },

  mounted() {
    api
      .getHotels()
      .then((response) => {
        this.$store.dispatch('getHotels', response.data)
      })
      .catch((error) => {
        console.log(error)
      })

    api
      .getHotelDetails()
      .then((response) => {
        this.$store.dispatch('hotelDetails', response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  },
}
</script>

<style lang="scss">
@import '../sass/variables.scss';

.v-alert {
  padding: 10px !important;

  &__content {
    font-size: 12px;
  }

  &__icon {
    display: none !important;
  }
}

.hotel-checkins {
  display: flex;
  flex-wrap: wrap;

  &__item {
    width: 100%;
    border: 1px solid;
    padding: 15px;
  }

  &__btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc !important;
  margin-bottom: 20px;
}

@media only screen and (min-width: 768px) {
  .hotel-checkins {
    &__item {
      width: 25%;
    }
  }
}
</style>
