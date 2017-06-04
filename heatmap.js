
var svg = d3.select("svg"),
    margin = {top: 30, right: 30, bottom: 130, left: 30},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var  xScale = d3.scaleLinear().rangeRound([margin.right, width]);

var  yScale = d3.scaleLinear().rangeRound([height, 0]);

var colors = ['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695'].reverse();
var months = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];

function convert_month(num) {
  return months[num-1];
};

var cScale = d3.scaleQuantile()
  .range(colors);


var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url, function(error, data) {

      var avg = data.baseTemperature;
      xScale.domain(d3.extent(data.monthlyVariance, function(d){ return d.year}));
      console.log();
      yScale.domain(d3.extent(data.monthlyVariance, function(d){ return d.month}).reverse());
   //yScale.domain(months);
      // cScale.domain(d3.extent(data.monthlyVariance, function(d){ return d.variance}));
      cScale.domain(d3.extent(data.monthlyVariance, function(d){ return avg + d.variance}))
      // console.log(cScale(-1));

      var row_items = data.monthlyVariance.length/12;
      var rowheight = height/12+5;//"35px";
      var recwidth = Math.floor(width / row_items)+1;
      var tempformat = d3.format(",.2")


      var blocks = svg.selectAll(".blocks")
                     .data(data.monthlyVariance)
                     .enter()
                     .append("rect")
                     .attr("x", function(d) {
                         var x_ = xScale( d.year )+1;
                         return x_;
                     })
                     .attr("width", recwidth)
                     .attr("y", function(d) {
                             var y_ = yScale( d.month )+10;
                             return y_;
                       })
                       .attr("height", rowheight)
                      .attr("fill", function(d) {
                        var c_ = cScale( avg + d.variance );
                        return c_;
                      })
                      .on("mouseover", function(d){
                           $(".tooltip").html("<p> year: "+d.year+" <br> month: "+months[d.month-1]+" <br> "+tempformat(avg + Number(d.variance))+" degrees C </p>");
                           $(".tooltip").addClass("lit");
                           $(".tooltip").css({"top": d3.event.pageY, "left": d3.event.pageX+5, "border":"3px outset "+cScale( avg + d.variance )});

                         })//on mouseover
                      .on("mouseout", function(d){
                          $(".tooltip").empty().removeClass("lit");
                        });

        //x axis
        g.append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate("+(-margin.left)+"," + height*1.05+ ")")
              .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));



        //y axis
        g.append("g")
              .attr("class", "axis axis--y")
              .call(d3.axisLeft(yScale).tickFormat(function (d) {
          return months[d-1];
          }));
    svg.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate("+(width/4)+","+(height+2*margin.bottom/3)+")");

    var legendLinear = d3.legendColor()
      .shapeWidth(30)
      .orient('horizontal')
      .scale(cScale)
      .cells(colors.length)
      .labelDelimiter("-")
      .shapeWidth(55)
      .title("Temperature in Degrees C");

    svg.select(".legendLinear")
      .call(legendLinear);


  //3153 data points
  //monthly = 12 rows. append rect to row # d.month (-1?), rect gets color according to d.variance
  //for tooltip, calculate temp based on avg temp +/- d.variance
});//d3.json
