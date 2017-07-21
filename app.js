$(document).ready(function() {

  var flightRequest;
  var obj;
  var code1;
  var code2;
  var airCode1;
  var airCode2;
  var guess;
  var sampleInfo;
  var sample1Info;
  var sample2Info;
  var days;
$(".s1").click(function() {

// code for converting cities to airport codes

  code1 = $(".o").val()
  code2 = $(".d").val()
  guess = $(".guess1").val()

var d1 = $(".sd").val()
var d2 = $(".ed").val()
var arr1 = d1.split("-").join(",")
var arr2 = d2.split("-").join(",")
var firstDate = new Date(arr1);
var secondDate = new Date(arr2);

days = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(86400000)));
console.log(days);



//
$.ajax({
    url: `https://cometari-airportsfinder-v1.p.mashape.com/api/airports/by-text?text=${code1}`, // The URL to the API. You can get this in the API page of the API you intend to consume
    type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
    data: {}, // Additional parameters here
    dataType: 'json',
    success: function(data) {

      var airCode1 = data[0].code;
      if (airCode1 === "LSQ") {
        airCode1 = "LAX";
      } else if (airCode1 === "LCY") {
        airCode1 = "LON";
      }
      console.log(airCode1)

      $.ajax({
          url: `https://cometari-airportsfinder-v1.p.mashape.com/api/airports/by-text?text=${code2}`, // The URL to the API. You can get this in the API page of the API you intend to consume
          type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
          data: {}, // Additional parameters here
          dataType: 'json',
          success: function(data) {

            var airCode2 = data[0].code
            if (airCode2 === "LSQ") {
              airCode2 = "LAX"
            } else if (airCode2 === "LCY") {
              airCode2 = "LON";
            }
            console.log(airCode2)

            obj = {"airport1": airCode1,"airport2": airCode2,"date1": $(".sd").val(),"date2": $(".ed").val() };
            console.log(obj);


            flightRequest =  {
              "request": {
                "slice": [
                  {
                    "origin": obj.airport1,
                    "destination": obj.airport2,
                    "date": obj.date1
                  },
                  {
                    "origin": obj.airport2,
                    "destination": obj.airport1,
                    "date": obj.date2
                  }
                ],
                "passengers": {
                  "adultCount": 1,
                  "infantInLapCount": 0,
                  "infantInSeatCount": 0,
                  "childCount": 0,
                  "seniorCount": 0
                },
                "solutions": 10,
                "refundable": false
              }
            };

            $.ajax({
                 type: "POST",
                 //Set up your request URL and API Key.
                 url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyB5GjS_oxiOZzzZj_1WONYmIrA1Gxbd3Zk",
                 contentType: 'application/json', // Set Content-type: application/json
                 dataType: 'json',
                 // The query we want from Google QPX, This will be the variable we created in the beginning
                 data: JSON.stringify(flightRequest),
                 success: function (data) {
                  //Once we get the result you can either send it to console or use it anywhere you like.
                  $(".flightInfo").empty()

                  for(var i = 0; i < data.trips.tripOption.length; i++) {
                  $('.flightInfo').append('<div class="sample" id="fl'+ i +'" />')
                  var flight = obj.airport1 + " <-> " + obj.airport2 + "<br>"
                  var durations = "depart duration: " + Math.round((data.trips.tripOption[i].slice[0].duration)/60 *100)/100 +"hr"+ "<br>" +  "return duration: " + Math.round((data.trips.tripOption[i].slice[1].duration)/60 *100)/100 +"hr" + "<br>"
                  var cost = data.trips.tripOption[i].saleTotal
                  $('#fl'+ i).append(flight + durations + cost)
                }
                  console.log(data.trips.tripOption[0])



                  $(".todoInfo").empty()
                  for (var i = 0; i < 10; i ++) {
                    $('.todoInfo').append('<div class="sample1" id="td'+ i +'" />')
                    $('#td'+ i).append(`$${10 + 10*i}/day`)
                  }
                  $('#td5').append(`<br><strong><i>*recommended*</i></strong>`)

                  $(".sample1").click(function(){
                    $(".sample1").css("background-color", "white")
                    $(this).css("background-color", "rgba(81, 161, 68, 0.60)")
                    var tempInfo1 = $(this).text().split("/")
                    tempInfo4 = tempInfo1[0].substr(1)
                    sample1Info = 0;
                    sample1Info = Number(tempInfo4) * days
                    console.log(sample1Info);
                  });

                  $(".sample").click(function(){
                    $(".sample").css("background-color", "white")
                    $(this).css("background-color", "rgba(81, 161, 68, 0.60)")
                    var tempInfo = $(this).text().split("D")
                    sampleInfo = tempInfo[tempInfo.length-1]
                    console.log(sampleInfo);
                  });

                  $(".sample2").click(function(){
                    $(".sample2").css("background-color", "white")
                    $(this).css("background-color", "rgba(81, 161, 68, 0.60)")
                    sample2Info = 0;
                    var tempInfo2 = $(this).text().split("$")
                    var tempInfo3 = tempInfo2[tempInfo2.length-1]

                    sample2Info = Number(tempInfo3) * days

                    console.log(sample2Info);
                  });



                  $(".s2").click(function(){
                    var spent1 = sample2Info + Number(sampleInfo) + Number(sample1Info)
                    var spent = Math.round(spent1 *100)/100
                    $(".totalInfo").empty();
                    $(".totalInfo").append("Total: $"+ (spent))
                    console.log(guess);
                    console.log(spent);
                    if (spent < guess) {
                      $(".totalInfo").append("<br><h1>$"+ `${Math.round((guess - spent) *100)/100} less than you expected</h1>`)
                    } else {
                      $(".totalInfo").append("<br><h1>$"+ `${Math.round((spent - guess)*100)/100} more than you expected</h1>`)
                    }

                  });




                },
                  error: function(){
                   //Error Handling for our request
                   alert("Access to Google QPX Failed.");
                 }
                });




             },
          error: function(err) { alert(err); },
          beforeSend: function(xhr) {
          xhr.setRequestHeader("X-Mashape-Authorization", "cPjw7xAb2nmsh58MQkHQ6j0wspYWp11zLy9jsnTqvBFEq65Zbk"); // Enter here your Mashape key
          }

          });





      },
    error: function(err) { alert(err); },
    beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "cPjw7xAb2nmsh58MQkHQ6j0wspYWp11zLy9jsnTqvBFEq65Zbk"); // Enter here your Mashape key
    }


});


// code for grabbing hotels
//
$.ajax({
    type: 'GET',
    url:`https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+${code2}&key=AIzaSyB5GjS_oxiOZzzZj_1WONYmIrA1Gxbd3Zk`,
    dataType: 'json',
    data: {},
    headers: {"Access-Control-Allow-Origin": "*", "X-Requested-With": "XMLHttpRequest"},
    crossDomain: true,
    success: function(data) {

        $(".sleepInfo").empty()
        console.log(data.results)
        for (var i = 0; i < 10; i ++) {
          $('.sleepInfo').append('<div class="sample2" id="sd'+ i +'" />')
          var ranNum = (Math.random() * (250 - 20) + 20);
          $('#sd'+ i).append(data.results[i].name + "<br>$" + Math.floor(ranNum))
      }


    }
});




// code for todo




});




});
