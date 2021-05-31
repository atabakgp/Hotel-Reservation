<template>
  <div class="hotel-details">
    <div class="hotel-details__checkin">
      <h3>
        {{ hotelName }}
        <small>( {{ cityName }} )</small>
      </h3>
      <span> <b>Giris Tarihi:</b> {{ reservationDetails.start_date }} </span>
      <span> <b>Cikis Tarihi:</b> {{ reservationDetails.end_date }} </span>
      <span> <b>Yetiskin:</b> {{ reservationDetails.adult }} </span>
      <span> <b>cocuk:</b> {{ reservationDetails.child }} </span>
    </div>
    <div class="hotel-details__title">Oda tipi Secimi</div>
    <div class="hotel-details__rooms">
      <div v-for="type in roomTypes" :key="type.id" class="hotel-details__rooms-type">
        <label>
          {{ type.title }}
          <input type="radio" name="roomType" v-model="reservationDetails.room_type" :value="type.id" />
          <figure>
            <img :src="type.photo" :alt="type.title" />
            <figcaption class="hotel-details__figcaption">
              <div class="hotel-details__counts">
                <div class="hotel-details__days">{{ days }} Gün</div>
                <div class="hotel-details__adult">
                  {{ reservationDetails.adult }}
                  <span>Yetiskin</span>
                </div>
              </div>
              <div class="hotel-details__price">{{ $helpers.formatCurrency(getRoomTypePrice(type.price)) }}</div>
            </figcaption>
          </figure>
        </label>
      </div>
    </div>
    <div class="hotel-details__title">
      Manzara Seçimi
    </div>
    <div class="hotel-details__rooms">
      <div v-for="type in roomScenics" :key="type.id" class="hotel-details__rooms-type">
        <label>
          {{ type.title }}
          <input type="radio" name="roomScenic" v-model="reservationDetails.room_scenic" :value="type.id" />
          <figure>
            <img :src="type.photo" :alt="type.title" />
            <figcaption class="hotel-details__figcaption ">
              <span>Fiyata etki orani</span>
              <span>+{{ type.price_rate }}%</span>
            </figcaption>
          </figure>
        </label>
      </div>
    </div>
    <div class="d-flex justify-space-between">
      <v-btn class="pa-3 ma-3" color="secondary" elevation="2" @click="$emit('toStep', 1)">Geri</v-btn>
      <v-btn class="pa-3 ma-3" color="primary" elevation="2" @click="roomValidation">Kaydet ve Devam et</v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'HotelDetails',

  computed: {
    ...mapGetters(['hotelName', 'cityName', 'roomTypes', 'roomScenics', 'days', 'roomPriceWithDays', 'rate', 'roomPriceWithScenic']),
    ...mapState(['reservationDetails']),
  },

  methods: {
    getRoomTypePrice(typePrice) {
      return typePrice * this.days * this.reservationDetails.adult
    },

    roomValidation() {
      if (this.reservationDetails.room_type != null && this.reservationDetails.room_scenic != null) {
        let details = {
          room_type: this.reservationDetails.room_type,
          room_scenic: this.reservationDetails.room_scenic,
          price: this.roomPriceWithScenic,
        }
        this.$store.commit('reservationDetails', details)
        localStorage.setItem('reservationDetails', JSON.stringify(this.reservationDetails))
        this.$emit('toStep', 3)
      } else {
        this.$emit('showDialog', {
          messages: [!this.reservationDetails.room_type ? 'Lütfen odanızın tipini seçiniz!' : !this.reservationDetails.room_scenic ? 'Lütfen odanızın manzarasını seçiniz!' : ''],
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.hotel-details {
  &__title {
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
    margin: 30px 0;
    padding-bottom: 10px;
  }

  &__rooms {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    &-type {
      width: 100%;
      padding: 25px;
      border: 1px solid #ccc;
      border-radius: 15px;
      margin-bottom: 15px;
      img {
        width: 100%;
      }
    }
  }

  &__figcaption {
    display: flex;
    justify-content: space-between;
  }

  &__checkin {
    background-color: #eee;
    padding: 20px;
    border-radius: 10px;
    h3 {
      margin-bottom: 10px;
    }
    span {
      margin-right: 10px;
    }
  }
}

@media only screen and (min-width: 768px) {
  .hotel-details {
    &__rooms {
      flex-wrap: nowrap;

      &-type {
        width: 33%;
        &:not(:last-child) {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
