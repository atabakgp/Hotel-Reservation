<template>
  <div class="checkout">
    <v-container>
      <v-row>
        <v-col class="col-md-8 col-12 px-0">
          <PayCard></PayCard>
        </v-col>
        <v-col class="checkout__right col-md-4 col-12">
          <div class="checkout__hotel">
            <b>{{ hotelName }}</b>
            <span> ({{ cityName }}) </span>
          </div>
          <div class="checkout__details d-flex text-center">
            <div class="checkout__box">
              <b> Giris Tarihi:</b> <br />
              <span>{{ reservationDetails.start_date }}</span>
            </div>
            <div class="checkout__box">
              <b>Cikis Tarihi:</b> <br />
              <span>{{ reservationDetails.end_date }}</span>
            </div>
            <div class="checkout__box">
              <b>Yetiskin: </b> <br />
              <span>{{ reservationDetails.adult }}</span>
            </div>
            <div class="checkout__box">
              <b>Cocuk: </b> <br />
              <span>{{ reservationDetails.child }}</span>
            </div>
            <div class="checkout__box">
              <b>Oda tipi: </b> <br />
              <span>{{ roomTitle }}</span>
            </div>
            <div class="checkout__box">
              <b>Manzara: </b> <br />
              <span>{{ scenicTitle }}</span>
            </div>
          </div>
          <div class="checkout__coupon d-flex">
            <v-text-field label="Kupon kodu" v-model="userCoupon"></v-text-field>
            <v-btn class="pa-3 ma-3" color="primary" @click="getCoupon">
              Kodu Kullan
            </v-btn>
          </div>
          <div class="checkout__price-details pb-2">
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
              <b> {{ $helpers.formatCurrency(reservationDetails.price) }} </b>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <div class="d-flex justify-space-between">
      <v-btn class="pa-3 ma-3" color="primary" elevation="2" @click="$emit('toStep', 2)"> Geri</v-btn>
      <v-btn class="pa-3 ma-3" color="primary" elevation="2" @click="submit">Ödeme yap ve bitir</v-btn>
    </div>
  </div>
</template>

<script>
import PayCard from './PayCard'
import { mapGetters, mapState } from 'vuex'
import api from '../api/axios'

export default {
  components: {
    PayCard,
  },

  data: () => ({
    userCoupon: '',
  }),

  computed: {
    ...mapGetters(['hotelName', 'cityName', 'roomTypes', 'roomScenics', 'days', 'roomTitle', 'scenicTitle', 'roomUnitPrice', 'rate', 'roomPriceWithDays']),
    ...mapState(['reservationDetails', 'coupon', 'reservedId', 'isUpdate']),
  },

  methods: {
    submit() {
      let details = this.$store.state.reservationDetails
      let messages = []
      for (let detail in details) {
        if (!details[detail]) {
          switch (detail) {
            case 'card_number':
              messages.unshift('Lütfen kart numaranızı giriniz!')
              break
            case 'card_name':
              messages.push('Lütfen kartınızın üzerindeki ismi giriniz!')
              break
            case 'card_date_month' || 'card_date_year':
              messages.push('Lütfen kartınızın bitiş tarihini giriniz!')
              break
            case 'card_cvv':
              messages.push('Lütfen kartınızın güvenlik kodunu giriniz!')
              break
            default:
              break
          }
        }
      }

      if (details.card_number && details.card_number.length !== 13) {
        messages.unshift('Lütfen geçerli bir kart numarası giriniz!')
      }

      if (messages.length === 0) {
        localStorage.setItem('reservationDetails', JSON.stringify(this.reservationDetails))
        if (this.isUpdate) {
          api
            .updateReservation(this.reservationDetails, this.reservedId)
            .then((response) => {
              this.$store.commit('reservedId', parseInt(response.data.id))
              this.$store.commit('finishReservation', true)
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          api
            .submitReservation(this.reservationDetails)
            .then((response) => {
              this.$store.commit('reservedId', parseInt(response.data.id))
              this.$store.commit('finishReservation', true)
            })
            .catch((error) => {
              console.log(error)
            })
        }
      } else {
        this.$emit('showDialog', { messages: messages })
      }
    },

    getCoupon() {
      if (this.userCoupon == '') {
        this.$emit('showDialog', {
          messages: ['Lutfen bir Kupon kodu giriniz'],
        })
      } else if (this.coupon) {
        this.$emit('showDialog', {
          messages: ['Kupon kodu kullanılmıştır'],
        })
      } else {
        api
          .getCoupons(this.userCoupon)
          .then((response) => {
            if (response.data.length == 0) {
              this.$emit('showDialog', {
                messages: ['Bu kode ile tanimlanmis bir kupon bulunamadi, lutfen kupon kodunu tekrar kontrol edin'],
              })
            } else {
              const validCoupon = response.data.filter((coupon) => {
                return new Date(coupon.expiration_at) > Date.now()
              })
              if (validCoupon.length > 0) {
                const priceAfterCoupon = this.reservationDetails.price - validCoupon[0].discount_ammount
                this.$store.commit('reservationDetails', {
                  price: priceAfterCoupon,
                  coupon_code: validCoupon[0].code,
                })
                this.$store.commit('coupon', validCoupon[0])
              } else {
                this.$emit('showDialog', {
                  messages: ['Kupon kodu son kullanma tarihi bitmistir'],
                })
              }
            }
          })
          .catch(() => {
            this.$emit('showDialog', {
              messages: ['Bir Hata olustu lutfen tekrar deneyiniz'],
            })
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.v-btn {
  font-size: 13px;
  text-transform: capitalize;
}

.total-price {
  border-top: 1px solid #ccc;
  padding-top: 14px;
  margin-top: 10px;
}
.checkout {
  &__right {
    background-color: #eee;
    border-radius: 10px;
  }
  &__price-details {
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
  }

  &__details {
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 10px;
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
}
</style>
