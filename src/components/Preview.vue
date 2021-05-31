<template>
  <v-container>
    <div class="preview">
      <div class="preview__btns text-center">
        <v-icon> mdi-checkbox-marked-circle </v-icon>
        <div>
          <b>Rezervasyon kaydiniz alinmistir</b>
        </div>
        <div>
          Rezervasyon ozetiniz asagidaki gibidir, Rezervasyon kaydinizda degisiklik veya <br />
          yeni Rezervasyon yapmak icin asagidaki linkleri kullanabilirsiniz
        </div>
        <div>
          <v-btn class="pa-3 ma-3" color="primary" elevation="2" @click="newReservation">Yeni Rezervasyon Yap</v-btn>
          <v-btn class="pa-3 ma-3" color="primary" elevation="2" @click="updateReservation">Rezervasyonu guncelle</v-btn>
          <v-btn class="pa-3 ma-3" color="primary" elevation="2" @click="dialog = true">Rezervasyonu iptal et</v-btn>
        </div>
      </div>
      <div class="preview__details mt-4">
        <div class="preview-details__title">
          <b>{{ hotelName }} </b> ({{ cityName }})
        </div>
        <div class="checkout__details d-flex text-center">
          <div class="preview__box">
            <b> Giris Tarihi:</b> <br />
            <span>{{ reservationDetails.start_date }}</span>
          </div>
          <div class="preview__box">
            <b>Cikis Tarihi:</b> <br />
            <span>{{ reservationDetails.end_date }}</span>
          </div>
          <div class="preview__box">
            <b>Yetiskin: </b> <br />
            <span>{{ reservationDetails.adult }}</span>
          </div>
          <div class="preview__box">
            <b>Cocuk: </b> <br />
            <span>{{ reservationDetails.child }}</span>
          </div>
          <div class="preview__box">
            <b>Oda tipi: </b> <br />
            <span>{{ roomTitle }}</span>
          </div>
          <div class="preview__box">
            <b>Manzara: </b> <br />
            <span>{{ scenicTitle }}</span>
          </div>
        </div>
        <div class="preview__price-details pb-2 mt-2">
          <div class="py-1 d-flex justify-space-between">
            <b>Oda Fiyati:</b>
            <span>{{ $helpers.formatCurrency(roomUnitPrice) }}</span>
          </div>
          <div class="py-1 d-flex justify-space-between">
            <b>Fiyat Etki Orani:</b>
            <span>%{{ rate }} </span>
          </div>
          <div class="py-1 d-flex justify-space-between">
            <b>Konaklama ({{ days }} Gün):</b>
            <span>{{ $helpers.formatCurrency(roomPriceWithDays) }}</span>
          </div>
          <div class="py-1 d-flex justify-space-between" v-if="coupon">
            <b>indirim ({{ coupon.code }}):</b>
            <span>-{{ $helpers.formatCurrency(coupon.discount_ammount) }}</span>
          </div>
          <div class="total-price text-center">
            <b>TOPLAM TUTAR</b> <br />
            <b> {{ $helpers.formatCurrency(reservationDetails.price) }}</b>
          </div>
        </div>
      </div>
    </div>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card class="d-flex flex-column justify-center pa-12">
        Rezervasyonu iptal etmeğe eminmisiniz?
        <div class="d-flex justify-space-between mt-4">
          <v-btn color="success" @click="deleteReservation">Evet</v-btn>
          <v-btn color="secondary" @click="dialog = false">Hayır</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import api from '../api/axios'

export default {
  name: 'Preview',

  data() {
    return {
      dialog: false,
    }
  },

  computed: {
    ...mapGetters(['hotelName', 'cityName', 'roomTypes', 'roomScenics', 'cityName', 'roomTitle', 'scenicTitle', 'roomUnitPrice', 'rate', 'days', 'roomPriceWithDays']),
    ...mapState(['coupon', 'reservationDetails', 'reservedId']),
  },

  methods: {
    newReservation() {
      localStorage.removeItem('reservationDetails')
      localStorage.removeItem('step')
      this.$store.dispatch('setForms', {
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
      })
      this.$store.commit('finishReservation', false)
      this.$store.commit('isUpdate', false)
      this.$store.commit('reservedId', null)
      this.$emit('toStep', 1)
    },

    updateReservation() {
      this.$store.commit('finishReservation', false)
      this.$store.commit('isUpdate', true)
      this.$emit('toStep', 1)
    },

    deleteReservation() {
      api.deleteReservation(this.reservedId).then(() => {
        this.$emit('showDialog', {
          messages: ['Rezervasyonunuz iptal edildi'],
        })
        this.newReservation()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.v-icon {
  font-size: 80px;
}

.total-price {
  border-top: 1px solid #ccc;
  padding-top: 10px;
}
.preview {
  &__btns {
    border: 1px solid #ccc;
  }

  &__details {
    background-color: #eee;
    border-radius: 7px;
    padding: 20px;
  }

  &__box {
    width: 48%;
    background-color: #fff;
    border-radius: 10px;
    margin: 5px 0;
    padding: 10px;
    font-size: 15px;
    span {
      font-size: 14px;
    }
  }
  &__price-details {
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
  }
}

.checkout {
  &__details {
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 10px;
  }
}
</style>
