/* global Vue, XMLHttpRequest, dataPath */

const sortPlayers = function (a, b) {
  const positions = ['QB', 'RB', 'WR', 'TE']
  const posOrder = positions.indexOf(a.position) - positions.indexOf(b.position)
  return posOrder || b.cost - a.cost || b.year - a.year
}

// eslint-disable-next-line no-unused-vars
const vm = new Vue({
  el: '.j-team__vm',

  delimiters: ['${', '}'],

  data: {
    showControls: false,
    salaryCap: 0,
    contracts: []
  },

  created: function () {
    this.fetchData()
  },

  computed: {
    rosterCost: function () {
      return this.contracts.reduce(function (sum, player) {
        if (player.drop) return sum
        else return sum + player.cost
      }, 0)
    },
    rosterYears: function () {
      return this.contracts.reduce(function (sum, player) {
        if (player.drop) return sum
        else return sum + player.year
      }, 0)
    },
    droppedCost: function () {
      return this.contracts.reduce(function (sum, player) {
        if (player.drop) return sum + player.cost
        else return sum
      }, 0)
    },
    droppedCap: function () {
      return Math.ceil(this.droppedCost / 2)
    },
    capHit: function () {
      return this.rosterCost + this.droppedCap
    },
    capSpace: function () {
      return this.salaryCap - this.capHit
    }
  },

  methods: {
    fetchData: function () {
      const xhr = new XMLHttpRequest()
      const self = this
      xhr.open('GET', dataPath)
      xhr.responseType = 'json'
      xhr.send()
      xhr.onload = function () {
        self.salaryCap = xhr.response.salaryCap
        self.contracts = xhr.response.contracts
        self.contracts.forEach(function (player) {
          if (player.drop) player.fixed = true
        })
        self.contracts.sort(sortPlayers)
      }
    },
    addPlayer: function (player) {
      player.drop = false
    },
    dropPlayer: function (player) {
      player.drop = true
    },
    toggleControls: function () {
      if (this.showControls) {
        this.contracts.forEach(function (player) {
          if (!player.fixed) player.drop = false
        })
        this.showControls = false
      } else {
        this.showControls = true
      }
    }
  }
})
