//ShotChart component for the shotchart of specified player

//imports
import React from 'react';
import nba from 'nba';
import * as d3 from 'd3'; //https://github.com/d3
import d3Tip from 'd3-tip';
import {hexbin} from 'd3-hexbin';
import PropTypes from 'prop-types';
import { timeParse } from 'd3';

window.d3_hexbin = {hexbin : hexbin} //workaround library problem



/* The follow code is from here: https://github.com/mc-buckets/d3-shotchart.
Due to the fact that this library is quite old and not updated for a while
some functions are broken and no longer works for current d3 version.*/

// SCALES USED TO INVERT COURT Y COORDS AND MAP SHOOTING PERCENTAGES OF BINS TO A FILL COLOR 
var yScale = d3.scaleLinear().domain([0, 47]).rangeRound([47, 0]);

export function court () {
    // NBA court dimensions are 50ft sideline to sideline and 94feet baseline to baseline (47ft half court)
    // Forcing at least a 500x470 ratio for the court in order to paint shots appropriately        
    var width = 500,
        height = .94 * width;

    function court(selection){
        
        selection.each(function(data){
            // Responsive container for the shotchart
            d3.select(this).style("max-width", width/16 + "em");
            // Select the SVG if it exists
            if (!d3.select(this).selectAll("svg").empty()){
                var svg = d3.select(this).selectAll("svg");
            }
            else {
                var svg = d3.select(this).append("svg")
                    .attr("viewBox", "0, 0, " + 50 + ", " + 47 + "")
                    .classed("court", true);
            // Append the outer paint rectangle
                svg.append("g")
                    .classed("court-paint", true)
                    .append("rect")
                    .attr("width", 16)
                    .attr("height", 19) 
                    .attr("x", 25)
                    .attr("transform", "translate(" + -8 + "," + 0 + ")")
                    .attr("y", yScale(19));
                // Append inner paint lines
                svg.append("g")
                    .classed("inner-court-paint", true)
                    .append("line")
                    .attr("x1", 19)
                    .attr("x2", 19)
                    .attr("y1", yScale(19))
                    .attr("y2", yScale(0));
                svg.append("g")
                    .classed("inner-court-paint", true)
                    .append("line")        
                    .attr("x1", 31)
                    .attr("x2", 31)
                    .attr("y1", yScale(19))
                    .attr("y2", yScale(0));
                // Append foul circle
                // Add clipPaths w/ rectangles to make the 2 semi-circles with our desired styles
                var dashedFoulCircle = svg.append("g").classed("foul-circle dashed", true);
                dashedFoulCircle.append("defs").append("clipPath")
                    .attr("id", "cut-off-top")
                    .append("rect")
                    .attr("width", 12)
                    .attr("height", 6) 
                    .attr("x", 25)
                    .attr("y", yScale(19)) // 47-19 (top of rectangle is pinned to foul line, which is at 19 ft)
                    .attr("transform", "translate(" + -6 + "," + 0 + ")");
                dashedFoulCircle.append("circle")
                    .attr("cx", 25)
                    .attr("cy", yScale(19)) // 47-19
                    .attr("r", 6)
                    .attr("stroke-dasharray", 1 + "," + 1)
                    .attr("clip-path", "url(#cut-off-top)");
                var solidFoulCircle = svg.append("g").classed("foul-circle solid", true);
                solidFoulCircle.append("defs").append("clipPath")
                    .attr("id", "cut-off-bottom")
                    .append("rect")
                    .attr("width", 12)
                    .attr("height", 6) 
                    .attr("x", 25)
                    .attr("y", yScale(19)) /*foul line is 19 feet, then transform by 6 feet (circle radius) to pin rectangle above foul line..clip paths only render the parts of the circle that are in the rectangle path */
                    .attr("transform", "translate(" + -6 + "," + -6 + ")");
                solidFoulCircle.append("circle")
                    .attr("cx", 25)
                    .attr("cy", yScale(19))
                    .attr("r", 6)
                    .attr("clip-path", "url(#cut-off-bottom)");
                // Add backboard and rim
                svg.append("g").classed("backboard", true)
                    .append("line")        
                    .attr("x1", 22)
                    .attr("x2", 28)
                    .attr("y1", yScale(4)) // 47-4
                    .attr("y2", yScale(4)); // 47-4
                svg.append("g").classed("rim", true)
                    .append("circle")
                    .attr("cx", 25)
                    .attr("cy", yScale(4.75)) // 47-4.75 need to set center point of circle to be 'r' above backboard
                    .attr("r", .75); //regulation rim is 18 inches
                // Add restricted area -- a 4ft radius circle from the center of the rim
                var restrictedArea = svg.append("g").classed("restricted-area", true);
                restrictedArea.append("defs").append("clipPath")
                    .attr("id", "restricted-cut-off")
                    .append("rect")
                    .attr("width", 8) // width is 2r of the circle it's cutting off
                    .attr("height", 4) // height is 1r of the circle it's cutting off
                    .attr("x", 25) // center rectangle
                    .attr("y", yScale(4.75))
                    .attr("transform", "translate(" + -4 + "," + -4 + ")");
                restrictedArea.append("circle")
                    .attr("cx", 25)
                    .attr("cy", yScale(4.75))
                    .attr("r", 4)
                    .attr("clip-path", "url(#restricted-cut-off)");
                restrictedArea.append("line")
                    .attr("x1", 21)
                    .attr("x2", 21)
                    .attr("y1", yScale(5.25))
                    .attr("y2", yScale(4));
                restrictedArea.append("line")
                    .attr("x1", 29)
                    .attr("x2", 29)
                    .attr("y1", yScale(5.25))
                    .attr("y2", yScale(4));
                // Add 3 point arc
                var threePointArea = svg.append("g").classed("three-point-area", true);
                threePointArea.append("defs").append("clipPath")
                    .attr("id", "three-point-cut-off")
                    .append("rect")
                    .attr("width", 44)
                    .attr("height", 23.75)
                    .attr("x", 25)
                    .attr("y", yScale(4.75)) // put recentagle at centerpoint of circle then translate by the inverse of the circle radius to cut off top half
                    .attr("transform", "translate(" + -22 + "," + -23.75 + ")");                
                threePointArea.append("circle")
                    .attr("cx", 25)
                    .attr("cy", yScale(4.75))
                    .attr("r", 23.75)
                    .attr("clip-path", "url(#three-point-cut-off)");                   
                threePointArea.append("line")
                    .attr("x1", 3)
                    .attr("x2", 3)
                    .attr("y1", yScale(14))
                    .attr("y2", yScale(0));
                threePointArea.append("line")
                    .attr("x1", 47)
                    .attr("x2", 47)
                    .attr("y1", yScale(14))
                    .attr("y2", yScale(0)); 
                // Add key lines
                var keyLines = svg.append("g").classed("key-lines", true);
                keyLines.append("line")
                    .attr("x1", 16)
                    .attr("x2", 17)
                    .attr("y1", yScale(7))
                    .attr("y2", yScale(7));
                keyLines.append("line")
                    .attr("x1", 16)
                    .attr("x2", 17)
                    .attr("y1", yScale(8))
                    .attr("y2", yScale(8));
                keyLines.append("line")
                    .attr("x1", 16)
                    .attr("x2", 17)
                    .attr("y1", yScale(11))
                    .attr("y2", yScale(11));
                keyLines.append("line")
                    .attr("x1", 16)
                    .attr("x2", 17)
                    .attr("y1", yScale(14))
                    .attr("y2", yScale(14));
                keyLines.append("line")
                    .attr("x1", 33)
                    .attr("x2", 34)
                    .attr("y1", yScale(7))
                    .attr("y2", yScale(7));
                keyLines.append("line")
                    .attr("x1", 33)
                    .attr("x2", 34)
                    .attr("y1", yScale(8))
                    .attr("y2", yScale(8));
                keyLines.append("line")
                    .attr("x1", 33)
                    .attr("x2", 34)
                    .attr("y1", yScale(11))
                    .attr("y2", yScale(11));
                keyLines.append("line")
                    .attr("x1", 33)
                    .attr("x2", 34)
                    .attr("y1", yScale(14))
                    .attr("y2", yScale(14));
                // Append baseline
                svg.append("g")
                    .classed("court-baseline", true)
                    .append("line")
                    .attr("x1", 0)
                    .attr("x2", 50)
                    .attr("y1", yScale(0))
                    .attr("y2", yScale(0)); 

                svg.append("g").classed("shots", true);
                
            };            
        });
    };

  court.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    height = .94 * _;
    return court;
  };

    return court;
};


var activeDisplay = "scatter";
var activeTheme = "day";
// SCALES USED TO INVERT COURT Y COORDS AND MAP SHOOTING PERCENTAGES OF BINS TO A FILL COLOR 
yScale = d3.scaleLinear().domain([0, 47]).rangeRound([47, 0]);
var percentFormatter = d3.format(".2%");

function shots() {
    
    var hexRadiusValues = [.8, 1, 1.2],
        hexMinShotThreshold = 1,
        heatScale = d3.scaleQuantize().domain([0, 1]).range(['#5458A2', '#6689BB', '#FADC97', '#F08460', '#B02B48']),
        hexRadiusScale = d3.scaleQuantize().domain([0, 2]).range(hexRadiusValues),
        toolTips = false,
        hexbin = window.d3_hexbin.hexbin()
                .radius(1.2)
                .x(function(d) { return d.key[0]; }) // accessing the x, y coords from the nested json key
                .y(function(d) { return yScale(d.key[1]); });        
    
    var _nestShotsByLocation = function(data) {
        var nestedData = d3.nest()
            .key(function(d) {
                return [d.x, d.y];
            })
            .rollup(function(v) { return {
                "made": d3.sum(v, function(d) { return d.shot_made_flag }),
                "attempts": v.length,
                "shootingPercentage":  d3.sum(v, function(d) { return d.shot_made_flag })/v.length
            }})
            .entries(data);
        // change to use a string split and force cast to int
        nestedData.forEach(function(a){
            a.key = JSON.parse("[" + a.key + "]");
		});
		

        return nestedData;
    };

    var _getHexBinShootingStats = function(data, index) {
        var attempts = d3.sum(data, function(d) { return d.value.attempts; })
        var makes = d3.sum(data, function(d) { return d.value.made; })
        var shootingPercentage = makes/attempts;
        data.shootingPercentage = shootingPercentage;
        data.attempts = attempts;
		data.makes = makes;
		

        return data;
    };
    

    function shots(selection){

        selection.each(function(data){

            var shotsGroup = d3.select(this).select("svg").select(".shots"),
                legends = d3.select(this).select("#legends"),
                nestedData = _nestShotsByLocation(data),
				hexBinCoords = hexbin(nestedData).map(_getHexBinShootingStats);
			
			console.log(data);
			console.log(shotsGroup);

			
            if (activeDisplay === "scatter"){
                if (legends.empty() === false){
                    legends.remove();
                }
                
                var shots = shotsGroup.selectAll(".shot")
                                    .data(data, function(d){ return [d.x, d.y]; });
                shots.exit()
                    .transition().duration(1000)
                    .attr("r", 0)
                    .attr("d", hexbin.hexagon(0))
                    .remove();

                if (toolTips) {
                    var tool_tip = d3Tip()
                      .attr("class", "d3-tip")
                      .offset([-8, 0])
                      .html(function(d) { 
                            return d.originalTarget.__data__.shot_distance + "' " + d.originalTarget.__data__.action_type; 
                        });
                    
                    shotsGroup.call(tool_tip);
                }

                shots.enter()
                    .append("circle")
                    .classed("shot", true)
                    .classed("make", function(d){
                          return d.shot_made_flag === 1; // used to set fill color to green if it's a made shot
                    })
                    .classed("miss", function(d){
                          return d.shot_made_flag === 0; // used to set fill color to red if it's a miss
                    })
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return yScale(d.y); })
                    .attr("r", 0)
                    .on('mouseover', function(d) { if (toolTips) {tool_tip.show(d, this);} })
                    .on('mouseout', function(d) { if (toolTips) {tool_tip.hide(d, this);} })
                    .transition().duration(1000)
                    .attr("r", .5);
                
            }
            else if (activeDisplay === "hexbin"){

                var shots = shotsGroup.selectAll(".shot")
									.data(hexBinCoords, function(d){ return [d.x, d.y]; });
									
				
                shots.exit()
                    .transition().duration(1000)
                    .attr("r", 0)
                    .attr("d", hexbin.hexagon(0))                
					.remove();
				
                
                if (toolTips) {
                    var tool_tip = d3Tip()
                      .attr("class", "d3-tip")
                      .offset([-8, 0])
                      .html(function(d) { 
						  	console.log(d);
							return d.originalTarget.__data__.makes + " / " +
							 d.originalTarget.__data__.attempts +
							  " (" + percentFormatter(d.originalTarget.__data__.shootingPercentage) + ")"; 
                        });
                    
					shotsGroup.call(tool_tip);
				}
				
                shots.enter()                
                    .append("path")
                    .classed("shot", true)
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .attr("d", hexbin.hexagon(0))
                    .on('mouseover', function(d) { if (toolTips) {tool_tip.show(d, this);} })
                    .on('mouseout', function(d) { if (toolTips) {tool_tip.hide(d, this);} })
                    .transition().duration(1000)
                    .attr("d", function(d) { 
                                if (d.length >= hexMinShotThreshold) {
                                    if (d.length <= 3){
                                        return hexbin.hexagon(hexRadiusScale(0));
                                    }
                                    else if (3 < d.length && d.length <= 8){
                                        return hexbin.hexagon(hexRadiusScale(1));
                                    }
                                    else {
                                        return hexbin.hexagon(hexRadiusScale(2));
                                    }
                                } 
                            })
                    .style("fill", function(d) { return heatScale(d.shootingPercentage); });
                
                // CHANGE TO USE SELECTION.EMPTY()
                if (legends.empty() === true){
                    var legendSVG = d3.select(this).append('svg').attr("viewBox", "0, 0, " + 50 + ", " + 10 + "").attr('id', 'legends'),
                        efficiencyLegend = legendSVG.append('g').classed('legend', true),
                        frequencyLegend = legendSVG.append('g').classed('legend', true)
                                                            .classed('frequency', true),
                        frequencyLegendXStart = 7;

                    efficiencyLegend.append("text")
                                    .classed('legend-text', true)
                                    .attr("x", 40)             
                                    .attr("y", 5)
                                    .attr("text-anchor", "middle") 
                                    .text("Efficiency");
                    efficiencyLegend.append("text")
                                    .classed("legend-text", true)
                                    .attr("x", 34.25)             
                                    .attr("y", 2.5)
                                    .attr("text-anchor", "end") 
                                    .text("cold");
                    efficiencyLegend.append("text")
                                    .classed("legend-text", true)
                                    .attr("x", 45.75)             
                                    .attr("y", 2.5)
                                    .attr("text-anchor", "start") 
                                    .text("hot");
                    efficiencyLegend.selectAll('path').data(heatScale.range())
                                    .enter()
                                    .append('path')
                                    .attr("transform", function (d, i) {
                                      return "translate(" + 
                                        (35 + ((1 + i*2) * 1)) + ", " + 2 + ")";
                                    })
                                    .attr('d', hexbin.hexagon(0))
                                    .transition().duration(1000)
                                    .attr('d', hexbin.hexagon(1))
                                    .style('fill', function (d) { return d; });
                    efficiencyLegend.selectAll("text").style("fill", function(){ 
                                        if (activeTheme === "night"){ return "white"; }
                                        else if (activeTheme === "day"){ return "black"; };
                                    });
                    
                    frequencyLegend.append("text")
                                    .classed('legend-text', true)
                                    .attr("x", 10.25)             
                                    .attr("y", 5)
                                    .attr("text-anchor", "middle")  
                                    .text("Frequency");
                    frequencyLegend.append("text")
                                    .classed("legend-text", true)
                                    .attr("x", 6.25)             
                                    .attr("y", 2.5)
                                    .attr("text-anchor", "end")  
                                    .text("low");
                    frequencyLegend.selectAll('path').data(hexRadiusValues)
                                    .enter()
                                    .append('path')
                                    .attr("transform", function (d, i) {
                                        frequencyLegendXStart += d * 2;
                                        return "translate(" + (frequencyLegendXStart - d) + ", " + 2 + ")";
                                    })
                                    .attr('d', hexbin.hexagon(0))
                                    .transition().duration(1000)
                                    .attr('d', function (d) { return hexbin.hexagon(d); })
                    frequencyLegend.append("text")
                                    .classed("legend-text", true)
                                    .attr("x", 13.75)             
                                    .attr("y", 2.5)
                                    .attr("text-anchor", "start")  
                                    .text("high");
                    
                    frequencyLegend.selectAll("text").style("fill", function(){ 
                                        if (activeTheme === "night"){ return "white"; }
                                        else if (activeTheme === "day"){ return "black"; };
                                    })
                    frequencyLegend.selectAll("path").style("fill", function(){ 
                                        if (activeTheme === "night"){ return "none"; }
                                        else if (activeTheme === "day"){ return "grey"; };
                                    });
                };                                                      
            };
        });
    };
  
  shots.displayType = function(_) {
    if (!arguments.length) return activeDisplay;
    activeDisplay = _;
    return shots;
  };
  
  shots.shotRenderThreshold = function(_) {
    if (!arguments.length) return hexMinShotThreshold;
    hexMinShotThreshold = _;
    return shots;
  }; 
  
  shots.displayToolTips = function(_) {
    if (!arguments.length) return toolTips;
    toolTips = _;
    return shots;
  };

  shots.theme = function(_) {
    if (!arguments.length) return activeTheme;
    activeTheme = _;
    return shots;
  };


    return shots;
};


/*=================================*/





//Declaration for the shortchart component class
export class ShotChart extends React.Component {

	//proptypes for type checking
	static propTypes = {
		//require player id
		playerId: PropTypes.number.isRequired,
		//mincount must be number
		minCount: PropTypes.number,
		//charttype must be a string
		chartType: PropTypes.string,
		//option for displaying tip must be a boolean
		displayTooltip: PropTypes.bool
	}

	componentDidUpdate() {
		//renew shot data after the chart renders
		nba.stats.shots({
			PlayerID: this.props.playerId
		}).then((response) => {
			//map reponse data to custom objects
			const final_shots = response.shot_Chart_Detail.map(shot => ({
				//we need to transform the x and y value for beauty
				x: (shot.locX + 250) / 10,
				y: (shot.locY + 50) / 10,

				//get shot attributes
				action_type: shot.actionType,
				shot_distance: shot.shotDistance,
				shot_made_flag: shot.shotMadeFlag,
			}));

			//log the shots
			console.log(final_shots);
			//select the type of chart
			const courtSelection = d3.select('#shot-chart');
			courtSelection.html('');
			//select the dimension of the court
			const chart_court = court().width(500);

			//settings for each shot
			const chart_shots = 
			shots()
				.shotRenderThreshold(this.props.minCount)
				.displayToolTips(this.props.displayTooltip)
				.displayType(this.props.chartType);

			//create and configure the chart
			courtSelection.call(chart_court);
			courtSelection.datum(final_shots).call(chart_shots);
		});
	}

	render() {
		//render the chart
		return (
			<div id="shot-chart"></div>
		)
	}
}
