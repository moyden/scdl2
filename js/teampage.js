'use strict';

/* global Vue, XMLHttpRequest, dataPath */

var sortPlayers = function sortPlayers(a, b) {
  var positions = ['QB', 'RB', 'WR', 'TE'];
  var posOrder = positions.indexOf(a.position) - positions.indexOf(b.position);
  return posOrder || b.cost - a.cost || b.year - a.year;
};

// eslint-disable-next-line no-unused-vars
var vm = new Vue({
  el: '.j-team__vm',

  delimiters: ['${', '}'],

  data: {
    showControls: false,
    salaryCap: 0,
    contracts: []
  },

  created: function created() {
    this.fetchData();
  },

  computed: {
    rosterCost: function rosterCost() {
      return this.contracts.reduce(function (sum, player) {
        if (player.drop) return sum;else return sum + player.cost;
      }, 0);
    },
    rosterYears: function rosterYears() {
      return this.contracts.reduce(function (sum, player) {
        if (player.drop) return sum;else return sum + player.year;
      }, 0);
    },
    droppedCost: function droppedCost() {
      return this.contracts.reduce(function (sum, player) {
        if (player.drop) return sum + player.cost;else return sum;
      }, 0);
    },
    droppedCap: function droppedCap() {
      return Math.ceil(this.droppedCost / 2);
    },
    capHit: function capHit() {
      return this.rosterCost + this.droppedCap;
    },
    capSpace: function capSpace() {
      return this.salaryCap - this.capHit;
    }
  },

  methods: {
    fetchData: function fetchData() {
      var xhr = new XMLHttpRequest();
      var self = this;
      xhr.open('GET', dataPath);
      xhr.responseType = 'json';
      xhr.send();
      xhr.onload = function () {
        self.salaryCap = xhr.response.salaryCap;
        self.contracts = xhr.response.contracts;
        self.contracts.forEach(function (player) {
          if (player.drop) player.fixed = true;
        });
        self.contracts.sort(sortPlayers);
      };
    },
    addPlayer: function addPlayer(player) {
      player.drop = false;
    },
    dropPlayer: function dropPlayer(player) {
      player.drop = true;
    },
    toggleControls: function toggleControls() {
      if (this.showControls) {
        this.contracts.forEach(function (player) {
          if (!player.fixed) player.drop = false;
        });
        this.showControls = false;
      } else {
        this.showControls = true;
      }
    }
  }
});