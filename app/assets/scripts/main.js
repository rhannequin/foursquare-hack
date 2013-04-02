define(['jquery', 'backbone'], function ($, Backbone) {
  'use strict';

  var MainView = Backbone.View.extend({

    el: 'body',
    $categories: $('.categories'),
    $actions: $('.actions'),
    foursquareApiUrl: 'https://api.foursquare.com/v2/',
    foursquareOauthToken: 'CKTMK32OZVMXUXXHSHBUJXGLIV2AYFUN00SG5ICMET3B5TQN',
    params: {
      foursquareCategories: JSON.parse('[{"name":"Boulangerie","id":"4bf58dd8d48988d16a941735"},{"name":"Brasserie","id":"50327c8591d4c4b30a586d5d"},{"name":"Lieu servant des hamburgers","id":"4bf58dd8d48988d16c941735"},{"name":"Restaurant chinois","id":"4bf58dd8d48988d145941735"},{"name":"Café-restaurant","id":"4bf58dd8d48988d147941735"},{"name":"Fast-food","id":"4bf58dd8d48988d16e941735"},{"name":"Restaurant français","id":"4bf58dd8d48988d10c941735"},{"name":"Restaurant grec","id":"4bf58dd8d48988d10e941735"},{"name":"Restaurant indien","id":"4bf58dd8d48988d10f941735"},{"name":"Restaurant japonais","id":"4bf58dd8d48988d111941735"},{"name":"Restaurant coréen","id":"4bf58dd8d48988d113941735"},{"name":"Pizzeria","id":"4bf58dd8d48988d1ca941735"},{"name":"Sandwicherie","id":"4bf58dd8d48988d1c5941735"},{"name":"Restaurant de fruits de mer","id":"4bf58dd8d48988d1ce941735"},{"name":"Snack","id":"4bf58dd8d48988d1c7941735"},{"name":"Restaurant-grill","id":"4bf58dd8d48988d1cc941735"},{"name":"Bar à sushis","id":"4bf58dd8d48988d1d2941735"},{"name":"Bar à tapas","id":"4bf58dd8d48988d1db931735"},{"name":"Restaurant thaïlandais","id":"4bf58dd8d48988d149941735"},{"name":"Restaurant turc","id":"4f04af1f2fb6e1c99f3db0bb"},{"name":"Restaurant végétarien/végétalien","id":"4bf58dd8d48988d1d3941735"}]')
    },
    map: null,

    events: {
      'click .find-venues': 'fireVenuesSearch',
      'click .check-all':   'checkAllCategories',
      'click .uncheck-all': 'uncheckAllCategories'
    },

    initialize: function () {
      var self = this;
      this.foursquareCategories = this.params.foursquareCategories;
      if (this.geolocIsAvailable()) {
        navigator.geolocation.getCurrentPosition(function (position) {
          self.renderMap(position);
          self.renderCategoryList(self.foursquareCategories);
        });
      } else {
        console.warn('You don\'t have HTML Geolocation API available on this browser.');
      }
    },



    /*
     * LOCATION
     */

    // Check is geolocation is available on this browser
    geolocIsAvailable: function () {
      return typeof navigator.geolocation !== 'undefined';
    },

    // Display Google Maps
    renderMap: function (position) {
      // User's location
      this.userLatitude = position.coords.latitude;
      this.userLongitude = position.coords.longitude;

      var center = new google.maps.LatLng(this.userLatitude, this.userLongitude);
      var mapOptions = {
        center: center,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
      this.renderUserLocation(this.map);
    },

    // Create marker to display user's location
    renderUserLocation: function (map) {
      var position = new google.maps.LatLng(this.userLatitude, this.userLongitude);
      var customMarker = this.customMarker();
      var marker = this.addMarker(map, 'users', position, 'You are here!', customMarker);
      var infowindow = this.addInfoWindow (map, marker, {label: 'You are here!'});
    },



    /*
     * VENUES
     */

    // Foursquare API Request maker
    foursquareRequest: function (url, params) {
      if(!params) params = {};
      params.oauth_token = this.foursquareOauthToken;
      return $.ajax({
        url: this.foursquareApiUrl + url,
        dataType: 'jsonp',
        type: 'get',
        data: params
      });
    },

    // Handle venues request
    fireVenuesSearch: function (e) {
      var choices = [],
          self = this;
      var inputs = this.$categories.find('input:checked');
      if(inputs.length > 0) {
        inputs.each(function (k, v) {
          choices.push($(v).attr('name'));
        });
        choices = choices.join(',');

        var venuesRequest = this.foursquareRequest('venues/search', {
          ll: this.userLatitude + ',' + this.userLongitude,
          intent: 'browse',
          limit: 50,
          radius: 5000, // 5000 meters around user's location
          categoryId: choices
        }).done(function (results) {
          var items = results.response.groups[0].items;
          self.showNearVenues(self.map, items);
        });
      } else {
        alert('You must choose at least one category.');
      }
    },

    // Display venue markers to a map
    showNearVenues: function (map, items) {
      this.clearMap(map, 'venues');
      for(var k in items) {
        var item = items[k];
        var location = item.location;
        var marker = this.addMarker(map, 'venues', new google.maps.LatLng(location.lat, location.lng), item.name);
        var infowindow = this.addInfoWindow(map, marker, {label: item.name});
      }
    },

    // Render list of checkboxes to Categories div
    renderCategoryList: function (categories) {
      var inputs = '';
      for(var i in categories) {
        var category = categories[i];
        inputs += '<label><input type="checkbox" name="' + category.id + '" checked /> ' + category.name + '</label>';
      }
      this.$actions.show();
      this.$categories.append(inputs);
    },



    /*
     * Checkboxes
     */

    checkAllCategories: function (e) {
      e.preventDefault();
      this.$categories.find('input').each(function (k, input) {
        $(input).prop('checked', true);
      });
    },

    uncheckAllCategories: function (e) {
      e.preventDefault();
      this.$categories.find('input').each(function (k, input) {
        $(input).prop('checked', false);
      });
    },



    /*
     * MARKERS
     */

    // Add one marker to a map
    addMarker: function (map, type, position, title, layout) {
      map.markers = map.markers || {};
      map.markers[type] = map.markers[type] || [];
      var params = {
        position: position,
        title: title
      };
      if(typeof layout !== 'undefined') {
        params = _.extend(params, layout);
      }
      var marker = new google.maps.Marker(params);
      map.markers[type].push(marker);
      marker.setMap(map);
      return marker;
    },

    // Add one infowindow to a marker from a map
    addInfoWindow: function (map, marker, label) {
      var contentString = label.hasOwnProperty('id') ? '<h2><img width="70" src="images/' + label.id + '.jpg" alt="" />' + label.label + '</h2>' : '<h2>' + label.label + '</h2>',
          infowindow = new google.maps.InfoWindow({ content: contentString });
      map.infowindows = map.infowindows || [];
      map.infowindows.push(infowindow);
      google.maps.event.addListener(marker, 'click', function() {
        for(var j in map.infowindows) {
          var mapinfowindow = map.infowindows[j];
          mapinfowindow.close();
        }
        infowindow.open(map, marker);
      });
      return infowindow;
    },

    // Remove one marker from a map
    removeMarker: function (marker, map) {
      marker.setMap(null);
      return map;
    },

    // Remove all the markers from a map
    clearMap: function (map, type) {
      for(var i in map.markers[type]) {
        var marker = map.markers[type][i];
        this.removeMarker(marker);
      }
      return map;
    },

    // Create green marker to make difference with venue markers
    customMarker: function () {
      // User's location marker
      // Credit: http://stackoverflow.com/users/3800/jack-b-nimble
      var pinColor = "37c855";
      var GMaps = google.maps;
      var pinImage = new GMaps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new GMaps.Size(21, 34),
        new GMaps.Point(0, 0),
        new GMaps.Point(10, 34)
      );
      var pinShadow = new GMaps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new GMaps.Size(40, 37),
        new GMaps.Point(0, 0),
        new GMaps.Point(12, 35)
      );
      return { icon: pinImage, shadow: pinShadow };
    }

  });

  return new MainView();
});