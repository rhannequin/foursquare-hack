/*global define */
define([], function () {
  'use strict';

  if (navigator.geolocation) {
    var apiUrl = 'https://api.foursquare.com/v2/',
      oauth_token  = 'L3DMOWACH200L0QKG1GK5DVGS1EEFMO5K4ND5WCI3JQ1RZ3I';

    navigator.geolocation.getCurrentPosition(function (position) {
      // User's location
      var latitude = position.coords.latitude,
          longitude = position.coords.longitude;
      var center = new google.maps.LatLng(latitude, longitude);
      var mapOptions = {
        center: center,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

      // User's location marker
      // Credit: http://stackoverflow.com/users/3800/jack-b-nimble
      var pinColor = "37c855";
      var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34)
      );
      var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35)
      );

      var marker = new google.maps.Marker({
        position: center,
        map: map,
        title: 'You are here!',
        icon: pinImage,
        shadow: pinShadow
      });

      var showNearVenues = function (items) {
        for(var k in items) {
          var item = items[k];
          var location = item.location;
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(location.lat, location.lng),
            map: map,
            title: item.name
          });
        }
      };

      var request = $.ajax({
        url: apiUrl + 'venues/search',
        dataType: 'jsonp',
        type: 'get',
        data: {
          oauth_token: oauth_token,
          ll: latitude + ',' + longitude,
          intent: 'browse',
          limit: 50,
          radius: 5000, // 5000 meters around user's location
          categoryId: '4bf58dd8d48988d1c4941735' // "Restaurant" categoryId
        }
      });

      request.done(function (results) {
        var items = results.response.groups[0].items;
        showNearVenues(items);
      });
    });
  }
});