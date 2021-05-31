import Vue from 'vue'
import Vuex from 'vuex'
import * as _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hotels: [],
    hotelDetails: [],
    coupon: null,
    selectedHotelName: '',
    rate: 0,
    roomPriceWithDays: 0,
    roomUnitPrice: 0,
    roomPriceWithScenic: 0,
    roomTitle: '',
    scenicTitle: '',
    finishReservation: false,
    reservationDetails: {},
    reservedId: null,
    isUpdate: false,
  },

  mutations: {
    hotels(state, payload) {
      state.hotels = payload
    },

    hotelDetails(state, payload) {
      state.hotelDetails = payload
    },

    selectedHotel(state, payload) {
      state.selectedHotel = payload
    },

    coupon(state, payload) {
      state.coupon = payload
    },

    reservationDetails(state, details) {
      _.map(details, (v, k) => {
        _.set(state.reservationDetails, k, v)
      })
    },

    finishReservation(state, payload) {
      state.finishReservation = payload
    },

    reservedId(state, id) {
      state.reservedId = id
    },

    isUpdate(state, payload) {
      state.isUpdate = payload
    },

    setForms(state, payload) {
      _.map(payload, (v, k) => {
        Vue.set(state.reservationDetails, k, v)
      })
    },
  },

  actions: {
    getHotels({ commit }, payload) {
      commit('hotels', payload)
    },
    hotelDetails({ commit }, payload) {
      commit('hotelDetails', payload)
    },
    selectedHotel({ commit }, payload) {
      commit('selectedHotel', payload)
    },
    coupons({ commit }, payload) {
      commit('coupons', payload)
    },
    setForms({ commit }, payload) {
      commit('setForms', payload)
    },
  },

  getters: {
    reservationDetails: (state) => {
      return state.reservationDetails
    },
    hotelDetail: (state) => {
      return _.head(_.values(_.pickBy(state.hotelDetails, (h) => h.id == state.reservationDetails.hotel_id)))
    },

    hotelName: (state) => {
      let selectedHotel = _.pickBy(state.hotels, (h) => h.id == state.reservationDetails.hotel_id)
      return _.get(_.head(_.values(selectedHotel)), 'hotel_name')
    },
    cityName: (state, getters) => {
      return getters.hotelDetail ? getters.hotelDetail.city : null
    },

    roomTypes: (state, getters) => {
      return getters.hotelDetail ? getters.hotelDetail.room_type : null
    },

    roomScenics: (state, getters) => {
      return getters.hotelDetail ? getters.hotelDetail.room_scenic : null
    },

    days: (state) => {
      let miliSecs = new Date(state.reservationDetails.end_date) - new Date(state.reservationDetails.start_date)
      let days = miliSecs / (1000 * 60 * 60) / 24
      return days
    },

    rate: (state, getters) => {
      let id = state.reservationDetails.room_scenic
      let scenic = _.values(_.pickBy(getters.roomScenics, (s) => s.id == id))[0]
      return _.get(scenic, 'price_rate', 0)
    },

    roomUnitPrice: (state, getters) => {
      let id = state.reservationDetails.room_type
      let type = _.values(_.pickBy(getters.roomTypes, (t) => t.id == id))[0]
      return _.get(type, 'price', 0)
    },

    roomPriceWithDays: (state, getters) => {
      return getters.roomUnitPrice * getters.days * state.reservationDetails.adult
    },

    roomPriceWithScenic: (state, getters) => {
      return parseInt(getters.roomPriceWithDays * (getters.rate / 100) + getters.roomPriceWithDays)
    },

    roomTitle: (state, getters) => {
      let id = state.reservationDetails.room_type
      let type = _.values(_.pickBy(getters.roomTypes, (t) => t.id == id))[0]
      return _.get(type, 'title')
    },

    scenicTitle: (state, getters) => {
      let id = state.reservationDetails.room_scenic
      let scenic = _.values(_.pickBy(getters.roomScenics, (s) => s.id == id))[0]
      return _.get(scenic, 'title')
    },
  },
})
