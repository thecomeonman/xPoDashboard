fBuildVisualisation = function (
    allSetNames,
    allSetCodes,
    selectedSetCode,
    nBlockWidth,
    bExplainerTest,
    postCode,
    cContentPanelId,
    cDashboardPanelId,
    cDashboardParentPanelId,
    setSelectionContentPanelId,
    setSelectionDashboardPanelId
) {

    cPassColour = '#00BBBB'
    cRunColour = '#FF0000'
    cShotColour = '#000000'
    
    nFullWidth = 0.98 * window.screen.availWidth
    nRatioOfScreenSize = 0.95 * ( window.screen.availWidth / 1900 ).toFixed(2)

    iPlotsHighlightedEventsInARow = 6
    iPlotsHighlightedEventsInAColumn = 4

    GoalProbabilityAlphaWeight = 0.2

    function clearSelection() {
        if(document.selection && document.selection.empty) {
            document.selection.empty();
        } else if(window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
        }
    }
    
    d3.selectAll('#'+cDashboardParentPanelId)
        .style('width', ( nFullWidth ) + 'px')

    document.body.style.width = ( nFullWidth ) + 'px';


    wrap = function(
        text, 
        width
    ) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                x = text.attr("x"),
                y = text.attr("y"),
                dy = 0, //parseFloat(text.attr("dy")),
                tspan = text.text(null)
                            .append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                                .attr("x", x)
                                .attr("y", y)
                                .attr("dy", ++lineNumber * lineHeight + dy + "em")
                                .text(word);
                }
            }
        });
    }

    mouseHoverTimeout = []
    mouseHoverTimeout['pitchElementOriginPanel3'] = setTimeout(function(){}, 0)
    mouseHoverTimeout['pitchElementOriginCumulativePanel3'] = setTimeout(function(){}, 0)
    mouseHoverTimeout['pitchElementShotPanel3'] = setTimeout(function(){}, 0)
    mouseHoverTimeout['pitchElementShotCumulativePanel3'] = setTimeout(function(){}, 0)
    mouseHoverTimeout['pitchElementPassPanel3'] = setTimeout(function(){}, 0)
    mouseHoverTimeout['pitchElementPassCumulativePanel3'] = setTimeout(function(){}, 0)
    mouseHoverTimeout['pitchElementRunPanel3'] = setTimeout(function(){}, 0)
    mouseHoverTimeout['pitchElementRunCumulativePanel3'] = setTimeout(function(){}, 0)
    

    dblclickTimeout = []
    dblclickTimeout['pitchElementOriginPanel3'] = setTimeout(function(){},0)
    dblclickTimeout['pitchElementOriginCumulativePanel3'] = setTimeout(function(){},0)
    dblclickTimeout['pitchElementShotPanel3'] = setTimeout(function(){},0)
    dblclickTimeout['pitchElementShotCumulativePanel3'] = setTimeout(function(){},0)
    dblclickTimeout['pitchElementPassPanel3'] = setTimeout(function(){},0)
    dblclickTimeout['pitchElementPassCumulativePanel3'] = setTimeout(function(){},0)
    dblclickTimeout['pitchElementRunPanel3'] = setTimeout(function(){},0)
    dblclickTimeout['pitchElementRunCumulativePanel3'] = setTimeout(function(){},0)

    mouseHoverTimeoutValue = 100
    dblclickTimeoutValue = 300

    nRunMinimumLength = 20

    nSizeRatioWithBufferForTiles = 1.1

    AllPositions = [
        [],
        'GK',
        'LB',
        'LCB',
        'RCB',
        'RB',
        'CDM',
        'LCM',
        'RCM',
        'LW',
        'CF',
        'RW',
        []
    ]

    selectedSetName = allSetNames[allSetCodes.indexOf(selectedSetCode)]
    PositionsToInclude = []
    cWhatScaleToUse = ''

    updatePositionsToIncludeScale = function (
        selectedSetCode
    ) {

        if ( 
            selectedSetCode == 'Barcelona200809LaLiga_For_Scoring_Team' |
            selectedSetCode == 'Barcelona200809LaLiga_Against_Scoring_Team'
        ) {

            cWhatScaleToUse = 'Team'
            
        } else {

            cWhatScaleToUse = 'Player'
        }

        PositionsToInclude = AllPositions[
            allSetCodes.indexOf(selectedSetCode)
        ]

    }

    updatePositionsToIncludeScale(selectedSetCode)

    nTwoDimSearchRadius = 13.333
    nOneDimSearchRadius = 6.667
        

    Panel3Click = {}
    Panel3Click['x'] = null
    Panel3Click['y'] = null
    Panel3Click['endX'] = null
    Panel3Click['endY'] = null
    Panel3Click['event'] = null
    Panel3Click['PlayPanelOpen'] = false

    // common constants
    if ( true ) {

        cHighlightColour = '#FF69B4'

        // https://codepen.io/fieldwork/pen/RaKLrJ pitch code

        panel3titlespace = 20
        pitch = {
            width: 80,
            length: 120,
            centerCircleRadius: 10,
            penaltyArea: {
                width: 36,
                height: 18
            },
            padding: {
                top: 12,
                bottom: 12,
                right: 8,
                left: 8
            },
            paintColor: "#FFFFFF",
            // grassColor: "#000000"
            grassColor: "#CCCCCC",
        };

        zeroColour = "#000000"
        // zeroColour = pitch.grassColor

        colorPalette = [
            // '#b3e2cd',
            // '#fdcdac',
            // '#cbd5e8',
            // '#f4cae4',
            // '#e6f5c9',
            // '#fff2ae',
            // '#f1e2cc',
            // '#cccccc'

            // '#1b9e77',
            // '#d95f02',
            // '#7570b3',
            // '#e7298a',
            // '#66a61e',
            // '#e6ab02',
            // '#a6761d',
            // '#666666'

            // '#e41a1c',
            // '#377eb8',
            // '#4daf4a',
            // '#984ea3',
            // '#ff7f00',
            // '#ffff33',
            // '#ffffff',
            // // '#a65628',
            // "#e7298a"
            // // '#f781bf'

            '#a65628',
            '#ffffff',

            '#ff0000',
            // '#e31a1c',
            '#00ff00',
            // '#33a02c',

            // '#1f78b4',
            '#0092FF',
            '#ff7f00',

            '#ffff33',
            '#984ea3'
            // '#a6cee3',
            // '#b2df8a',
            // '#fb9a99',
            // '#fdbf6f',

        ]

        // it's a little confusing with the widths and lengths
        pitch['frame'] = []
        pitch['frame']['width'] = pitch.padding.left + pitch.length + pitch.padding.right
        pitch['frame']['length'] = pitch.padding.top + pitch.width + pitch.padding.bottom

        nPitchDomainSize4 = window.screen.availWidth * 300/1900

    }





    // global functions
    if ( true ) {

        xScale6 = d3.scaleLinear()
            .domain([0, 120])
            .range([0, 0.8 * nPitchDomainSize4]);

        yScale6 = d3.scaleLinear()
            .domain([80, 0])
            .range([0, 0.8 * nPitchDomainSize4 * 80 / 120]);

        xScale4 = d3.scaleLinear()
            .domain([0, 120])
            .range([0, nPitchDomainSize4]);

        yScale4 = d3.scaleLinear()
            .domain([80, 0])
            .range([0, nPitchDomainSize4 * 80 / 120]);

        xScale3 = d3.scaleLinear()
            .domain([0, 120])
            .range([0, 1.25 * nPitchDomainSize4]);

        yScale3 = d3.scaleLinear()
            .domain([80, 0])
            .range([0, 1.25 * nPitchDomainSize4 * 80 / 120]);

        xScale2 = d3.scaleLinear()
            .domain([0, 120])
            .range([0, 2.2 * nPitchDomainSize4]);

        yScale2 = d3.scaleLinear()
            .domain([80, 0])
            .range([0, 2.2 * nPitchDomainSize4 * 80 / 120]);

        xScale1 = d3.scaleLinear()
            .domain([0, 120])
            .range([0, 4 * nPitchDomainSize4]);

        yScale1 = d3.scaleLinear()
            .domain([80, 0])
            .range([0, 4 * nPitchDomainSize4 * 80 / 120]);


        svgPanel3Width = 4.1 * xScale3(pitch.frame.width)


        addPitchOutlines = function ( 
            pitchElementMarkings,
            xScale
        ) {

            pitchElementMarkings.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", xScale(pitch.width))
                .attr("width", xScale(pitch.length))
                .attr("stroke", pitch.paintColor)
                .attr("fill", "none")
                .style('pointer-events', 'none')


            var centerSpot = pitchElementMarkings.append("circle")
                .attr("cy", xScale(pitch.width/2))
                .attr("cx", xScale(pitch.length/2))
                .attr("r", 1)
                .attr("fill", pitch.paintColor)
                .style('pointer-events', 'none')

            var centerCircle = pitchElementMarkings.append("circle")
                .attr("cy", xScale(pitch.width/2))
                .attr("cx", xScale(pitch.length/2))
                .attr("r", xScale(pitch.centerCircleRadius))
                .attr("fill", 'none')
                .attr("stroke", pitch.paintColor)
                .style('pointer-events', 'none')

            var halfwayLine = pitchElementMarkings.append("line")
                .attr("x1", xScale(pitch.length/2))
                .attr("x2", xScale(pitch.length/2))
                .attr("y1", 0)
                .attr("y2", xScale(pitch.width))
                .attr("stroke", pitch.paintColor)
                .style('pointer-events', 'none')

            // corners

            function addPath(pathData, parentElement){
                parentElement.append("path")
                    .attr("d", pathData)
                    .attr("stroke", pitch.paintColor)
                    .attr("fill", "none") 
                    .style('pointer-events', 'none')
            }

            // top left
            var pathData = "M0," + xScale(1) + "A " + xScale(1) +" " + xScale(1) + " 45 0 0" + xScale(1) + ",0";
            addPath(pathData, pitchElementMarkings);

            // top right
            var pathData = "M"+xScale(pitch.length - 1)+",0 A " + xScale(1) +" " + xScale(1) + " 45 0 0" + xScale(pitch.length) + ","+ xScale(1);
            addPath(pathData, pitchElementMarkings);

            // bottom left
            var pathData = "M0," + xScale(pitch.width-1) + "A " + xScale(1) +" " + xScale(1) + " 45 0 1" + xScale(1) + "," + xScale(pitch.width);
            addPath(pathData, pitchElementMarkings);

            // bottom right
            var pathData = "M" + xScale(pitch.length - 1) + ',' + xScale(pitch.width) + "A " + xScale(1) +" " + xScale(1) + " 45 0 1" + xScale(pitch.length) + "," + xScale(pitch.width - 1);
            addPath(pathData, pitchElementMarkings);

            // Top Penalty Area
            var penaltyAreaTop = pitchElementMarkings.append("g");
            var pathData = "M0," + xScale(pitch.width/2 - 4 - 18) +"L" + xScale(18) + "," + xScale(pitch.width/2 - 4 - 18) + "V" + xScale(pitch.width/2 + 4 + 18) + "H0";
            addPath(pathData, penaltyAreaTop);

            // Top Penalty Area
            var pathData = "M0," + xScale(pitch.width/2 - 4 - 6) +"L" + xScale(6) + "," + xScale(pitch.width/2 - 4 - 6) + "v" + xScale(20) + "H0";
            // var pathData = "M" + xScale(pitch.width/2 - 4 - 6) +",0L" + xScale(pitch.width/2 - 4 - 6) + "," + xScale(6) + "h" + xScale(20) + "V0";
            addPath(pathData, penaltyAreaTop);

            // Top D
            var pathData = "M" + xScale(18) + "," + xScale(pitch.width/2 - 8) + "A" + xScale(10) + " " + xScale(10) + " 5 0 1 " + xScale(18) + "," + xScale(pitch.width/2 + 8);
            // var pathData = "M" + xScale(pitch.width/2 - 8) +","+xScale(18)+"A "+xScale(10)+" "+ xScale(10) +" 5 0 0 " + xScale(pitch.width/2 + 8) +","+xScale(18);
            addPath(pathData, penaltyAreaTop);

            // Top Penalty Spot
            var penaltySpotTop = penaltyAreaTop.append("circle")
                .attr("cy", xScale(pitch.width/2))
                .attr("cx", xScale(12))
                .attr("r", 1)
                .attr("fill", pitch.paintColor)
                .attr("stroke", pitch.paintColor)
                .style('pointer-events', 'none')

            penaltyAreaBottom = pitchElementMarkings.append("g");
            penaltyAreaBottom.html(penaltyAreaTop.html());
            penaltyAreaBottom
                .attr("transform", "rotate(180) translate(-" + xScale(pitch.length)+",-"+xScale(pitch.width)+")")
                .style('pointer-events', 'none')


            // Direction of attack
            nOffsetFromPitch = 3
            nVerticalHeight = 3
            var pathData = "M" + xScale(0) + "," + xScale(pitch.width + nOffsetFromPitch) + 
                "V" + ( xScale4(nVerticalHeight) + xScale(pitch.width + nOffsetFromPitch) ) + 
                "L" + ( xScale(0) + xScale4(5) ) + "," + ( xScale(pitch.width + nOffsetFromPitch) + xScale4(nVerticalHeight/2) ) + 
                "L" + xScale(0) + "," + xScale(pitch.width + nOffsetFromPitch);
            // var pathData = "M" + xScale(pitch.length/2) + "," + xScale(pitch.width + nOffsetFromPitch) + 
            //     "V" + xScale(pitch.width + nVerticalHeight + nOffsetFromPitch) + 
            //     "L" + xScale((pitch.length/2) + 5) + "," + xScale(pitch.width + (nVerticalHeight/2) + nOffsetFromPitch) + 
            //     "L" + xScale(pitch.length/2) + "," + xScale(pitch.width + nOffsetFromPitch);

            // var pathData = "M" + xScale(pitch.width/2 - 4 - 6) +",0L" + xScale(pitch.width/2 - 4 - 6) + "," + xScale(6) + "h" + xScale(20) + "V0";
            pitchElementMarkings.append("path")
                .attr("d", pathData)
                .attr("stroke", pitch.grassColor)
                .attr("fill", pitch.grassColor)
                .style('pointer-events', 'none')
            
            pitchElementMarkings.append("text")
                .attr("text-anchor", "start")
                // .attr("alignment-baseline", "central")
                .attr("font-size", ( 0.9 * nRatioOfScreenSize ) + "em")
                // .style("user-select", "none")
                .attr("x", xScale4( nOffsetFromPitch + nVerticalHeight ) )//padding of 4px
                .attr("y", ( xScale(pitch.width + nOffsetFromPitch) + xScale4(nVerticalHeight) ))
                .text("Direction of Barcelona's attack")
                .style('fill', 'white')
                .style('pointer-events', 'none')


            // top right
            // var pathData = "M"+xScale(pitch.length - 1)+","+xScale(pitch.width)+" A " + xScale(1) +" " + xScale(1) + " 45 0 1" + xScale(pitch.length) + ","+ xScale(pitch.length-1);
            // addPath(pathData, pitchElementMarkings);



        }

        
        addPitchColor = function ( 
            pitchElement,
            xScale
        ) {

            pitchElement.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", xScale(pitch.width))
                .attr("width", xScale(pitch.length))
                // .attr("x", -nBlockWidth / 2)
                // .attr("y", -nBlockWidth / 2)
                // .attr("height", xScale(pitch.width + (nBlockWidth)))
                // .attr("width", xScale(pitch.length + (nBlockWidth)))
                .attr("fill", pitch.grassColor)

                return pitchElement

        }

        addPlotTitle = function ( 
            pitchElement,
            titleText,
            xScale,
            nBlockWidth,
            selectedSetName,
            cContentPanelId
        ) {

            pitchElement
                .append('text')
                .attr('class', 'plotTitle ' + cContentPanelId)
                .text(selectedSetName)
                .attr("alignment-baseline", "bottom")
                .attr('x', 0)
                .attr('y', -xScale(1 * nBlockWidth) - 15)

            pitchElement
                .append('text')
                .attr('class', 'plotTitle ' + cContentPanelId)
                .text(titleText)
                .attr("alignment-baseline", "bottom")
                .attr('x', 0)
                .attr('y', -xScale(1 * nBlockWidth))

        }

        addPlotLegend = function ( 
            pitchElement,
            xScale,
            nBlockWidth,
            colorScale,
            pitchlength
        ) {

            pitchElement
                .append('rect')
                .attr("alignment-baseline", "bottom")
                .attr('x', xScale(pitchlength - (nBlockWidth * 1)))
                .attr('y', -xScale(1.8 * nBlockWidth))
                .attr('height',xScale(nBlockWidth))
                .attr('width', xScale(nBlockWidth * 1))
                .attr('fill', colorScale(colorScale.domain()[1]) )

        }


        addPitchData = function(
            pitchElement,
            data,
            PlottingWhichCoordinate,
            className,
            xScale,
            yScale,
            nBlockWidth,
            colorScale,
            PlottingWhichColumn
        ) {

            pitchElement.selectAll()
                .data(
                    data
                )
                .enter()
                .append("rect")
                .attr('class', function(d) { 
                    return className +  ' x' + d.x + '_y' + d.y 
                })
                .attr("x", function(d) { 
                    if ( PlottingWhichCoordinate == 'Origin' ) {
                        return xScale(d.x) - xScale(nSizeRatioWithBufferForTiles*nBlockWidth/2)
                    } else {
                        return xScale(d.endX) - xScale(nSizeRatioWithBufferForTiles*nBlockWidth/2)
                    } 
                })
                .attr("y", function(d) { 
                    if ( PlottingWhichCoordinate == 'Origin' ) {
                        return yScale(d.y) - xScale(nSizeRatioWithBufferForTiles*nBlockWidth/2)
                    } else {
                        return yScale(d.endY) - xScale(nSizeRatioWithBufferForTiles*nBlockWidth/2)
                    } 
                })
                .attr("width", xScale(nBlockWidth * nSizeRatioWithBufferForTiles) )
                .attr("height", xScale(nBlockWidth * nSizeRatioWithBufferForTiles) )
                // .attr("x", function(d) { return xScale4(d.x) - xScale4(nBlockWidth/2) })
                // .attr("y", function(d) { return xScale4(d.y) - xScale4(nBlockWidth/2) })
                // .attr("width", xScale4(nBlockWidth) )
                // .attr("height", xScale4(nBlockWidth) )
                .style("color", function(d) { return colorScale(d[PlottingWhichColumn])} )
                .style("fill", function(d) { return colorScale(d[PlottingWhichColumn])} )
                .style("fill-opacity", 1 )
                .style("stroke-opacity", 1 )

        }

        d3.selection.prototype.moveToFront = function() {
            return this.each(function(){
            this.parentNode.appendChild(this);
            });
        };



        addHighlightObject = function (
            pitchElement,
            className,
            color = '#FF69B4'
        ) {

            if ( false ) {
                    
                pitchElement.selectAll()
                    .data(
                        dataOriginProbabilitiesFor,
                        function(d) { 

                            return 'x' + d.x + '_y' + d.y

                        }
                    )
                    .enter()
                    .append("rect")
                    .attr('class', function(d) { return eventName +  ' x' + d.endX + '_y' + d.endY })
                    .attr("x", function(d) { 

                        return xScale4(d.x) - xScale4(nBlockWidth/2) 
                    })
                    .attr("y", function(d) { 

                        return yScale4(d.y) - xScale4(nBlockWidth/2) 

                    })
                    .attr("width", xScale4(nBlockWidth) )
                    .attr("height", xScale4(nBlockWidth) )
                    // .style("fill-opacity", 0 )
                    // .style("stroke-opacity", 0 )
                    // .attr("width", 10 )
                    // .attr("height", 10 )
                    .style("fill-opacity", 1 )
                    .style("stroke-opacity", 1 )
                    .style("color", function(d) { return colorScales['myShotProbabilityColor'](0)} )
                    .style("fill", function(d) { return colorScales['myShotProbabilityColor'](0)} )

            }


            pitchElement
                .append("circle")
                .attr('class', className)
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", xScale4(12 * ( nSizeRatioWithBufferForTiles / 4 ) ) )
                // .style("fill-opacity", 0 )
                // .style("stroke-opacity", 0 )
                // .attr("width", 10 )
                // .attr("height", 10 )
                .style("fill-opacity", '0' )
                .style("stroke-opacity", '0' )
                .style(
                    "stroke", 
                    color
                )
                .style(
                    "fill", 
                    // cHighlightColour
                    // 'none'
                    '#cccccc'
                    // "url(#circles-1)"
                )
                .style(
                    "stroke-width",
                    '4px'
                )
                .style(
                    'pointer-events',
                    'none'
                )

        }


        restoreBaseDestinationData = function (
            pitchElementPassPanel3,
            pitchElementPassCumulativePanel3,
            pitchElementRunPanel3,
            pitchElementRunCumulativePanel3,
        ) {
        
            pitchElementPassPanel3.selectAll('.Pass')
                .remove()

            pitchElementPassPanel3.selectAll('.BaseDestinationPanel3')
                .attr('opacity', 1)
                .style("pointer-events","all")
                .moveToFront()
            pitchElementPassPanel3.selectAll('.highlightDestination').moveToFront()
            pitchElementPassPanel3.selectAll('.pitchMarkings').moveToFront()
            

        
            pitchElementPassCumulativePanel3.selectAll('.Pass')
                .remove()

            pitchElementPassCumulativePanel3.selectAll('.BaseDestinationPanel3')
                .attr('opacity', 1)
                .style("pointer-events","all")
                .moveToFront()
                pitchElementPassCumulativePanel3.selectAll('.highlightDestination').moveToFront()
            pitchElementPassCumulativePanel3.selectAll('.pitchMarkings').moveToFront()



            pitchElementRunPanel3.selectAll('.Run')
                .remove()

            pitchElementRunPanel3.selectAll('.BaseDestinationPanel3')
                .attr('opacity', 1)
                .style("pointer-events","all")
                .moveToFront()
            pitchElementRunPanel3.selectAll('.highlightDestination').moveToFront()
            pitchElementRunPanel3.selectAll('.pitchMarkings').moveToFront()




            pitchElementRunCumulativePanel3.selectAll('.Run')
                .remove()

            pitchElementRunCumulativePanel3.selectAll('.BaseDestinationPanel3')
                .attr('opacity', 1)
                .style("pointer-events","all")
                .moveToFront()
            pitchElementRunCumulativePanel3.selectAll('.highlightDestination').moveToFront()
            pitchElementRunCumulativePanel3.selectAll('.pitchMarkings').moveToFront()

        }

            

        hideBaseDestinationData = function (
            pitchElementPassPanel3,
            pitchElementPassCumulativePanel3,
            pitchElementRunPanel3,
            pitchElementRunCumulativePanel3,
        ) {
        
            pitchElementPassPanel3.selectAll('.BaseDestinationPanel3')
                .attr('opacity', 0)
                .style("pointer-events","none")

            pitchElementPassCumulativePanel3.selectAll('.BaseDestinationPanel3')
                .attr('opacity', 0)
                .style("pointer-events","none")

            pitchElementRunPanel3.selectAll('.BaseDestinationPanel3')
                .attr('opacity', 0)
                .style("pointer-events","none")

            pitchElementRunCumulativePanel3.selectAll('.BaseDestinationPanel3')
                .attr('opacity', 0)
                .style("pointer-events","none")

        }

            

        hideBaseOriginData = function (
            pitchElementOriginPanel3,
            pitchElementOriginCumulativePanel3
        ) {
        
            pitchElementOriginPanel3.selectAll('.BaseOriginProbabilities')
                .attr('opacity', 0)
                .style("pointer-events","none")

            pitchElementOriginCumulativePanel3.selectAll('.BaseOriginProbabilities')
                .attr('opacity', 0)
                .style("pointer-events","none")

        }

        
        restoreBaseOriginData = function (
            pitchElementOriginPanel3,
            pitchElementOriginCumulativePanel3
        ) {
        
            pitchElementOriginPanel3.selectAll('.BaseOriginProbabilities')                
                .attr('opacity', 1)
                .style("pointer-events","all")
                .moveToFront()

            pitchElementOriginPanel3.selectAll('.pitchMarkings').moveToFront()
            pitchElementOriginPanel3.selectAll('.highlightOrigin').moveToFront()
        
            pitchElementOriginCumulativePanel3.selectAll('.BaseOriginProbabilities')
                .attr('opacity', 1)
                .style("pointer-events","all")
                .moveToFront()            

            pitchElementOriginCumulativePanel3.selectAll('.pitchMarkings').moveToFront()
            pitchElementOriginCumulativePanel3.selectAll('.highlightOrigin').moveToFront()

        }

            

        updateDestinationHeatmap = function (
            pitchElement,
            pitchElementName,
            xHovered,
            yHovered,
            eventName,
            dataGranularDestination,
            cumulative = false,
            colorScales,
            xScale,
            yScale,
            dataAllEvents,
            pitchElementOriginPanel3,
            pitchElementOriginCumulativePanel3,
            pitchElementShotPanel3,
            pitchElementShotCumulativePanel3,
            pitchElementPassPanel3,
            pitchElementPassCumulativePanel3,
            pitchElementRunPanel3,
            pitchElementRunCumulativePanel3,
            cContentPanelId,
            nTwoDimSearchRadius,
            svgPanel,
            PositionsToInclude
        ) {

            pitchElement.selectAll('.'+eventName)
                // .transition()
                // .duration(100)
                // .style("fill-opacity", 0.2 )
                // .style("stroke-opacity", 0.2 )
                .remove()


            pitchElement.selectAll()
                .data(
                    dataGranularDestination.filter(function(d) { 
                        return ( d.event == eventName ) 
                    })
                    // ,
                    // function(d) { 

                    //    if ( eventName == 'Shot' ) { 
                    //       plotX = d.x
                    //    } else {
                    //       plotX = d.endX 
                    //    }

                    //    if ( eventName == 'Shot' ) { 
                    //       plotY = d.y
                    //    } else {
                    //       plotY = d.endY 
                    //    }

                    //    return 'x' + plotX + '_y' + plotY

                    // }
                )
                .enter()
                .append("rect")
                .attr('class', function(d) { return eventName +  ' x' + d.endX + '_y' + d.endY })
                .attr("x", function(d) { 

                    if ( eventName == 'Shot' ) { 
                        plotX = d.x
                    } else {
                        plotX = d.endX 
                    }

                    return xScale(plotX) - xScale(nSizeRatioWithBufferForTiles * nBlockWidth/2) 
                })
                .attr("y", function(d) { 

                    if ( eventName == 'Shot' ) { 
                        plotY = d.y
                    } else {
                        plotY = d.endY 
                    }

                    return yScale(plotY) - xScale(nSizeRatioWithBufferForTiles * nBlockWidth/2) 

                })
                .attr("width", xScale(nBlockWidth * nSizeRatioWithBufferForTiles) )
                .attr("height", xScale(nBlockWidth * nSizeRatioWithBufferForTiles) )
                // .style("fill-opacity", 0 )
                // .style("stroke-opacity", 0 )
                // .attr("width", 10 )
                // .attr("height", 10 )
                .style("fill-opacity", 1 )
                .style("stroke-opacity", 0 )
                // .style(" shape-rendering", "geometricPrecision" )
                .style(
                    "color", 
                    function(d) { 
                        if (cumulative == true) {
                            return colorScales["myGranularNonShotGoalsColor"](d.WeightedExpectedGoals)
                        } else {
                            return colorScales["myGranularNonShotProbabilityColor"](d.GoalProbability)
                        }
                    } 
                )
                .style(
                    "fill", 
                    function(d) { 
                        if (cumulative == true) {
                            return colorScales["myGranularNonShotGoalsColor"](d.WeightedExpectedGoals)
                        } else {
                            return colorScales["myGranularNonShotProbabilityColor"](d.GoalProbability)
                        }
                    } 
                )
                .on('mouseout', function ( d ) {

                    clearTimeout(mouseHoverTimeout[pitchElementName])
                    mouseHoverTimeout[pitchElementName] = null
                        
                    if ( Panel3Click['x'] != null ) {                        

                        if ( Panel3Click['endX'] == null ) {

                            mouseHoverTimeout[pitchElementName] = setTimeout(
                                function () {

                                    svgPanel.selectAll(".histogramindicators")
                                        // .attr('opacity', 1)
                                        .attr("stroke-opacity", 0)
                                        .attr("stroke-width", 0)
                                        .attr("fill", 'white')
                                        .attr("r", 2)

                                    svgPanel.selectAll(".histogramindicatorsshot")
                                        .moveToFront()
                                        
                                    unhighlightHeatmapCoordinate(
                                        pitchElementOriginPanel3,
                                        'highlightDestination'
                                    )

                                    unhighlightHeatmapCoordinate(
                                        pitchElementOriginCumulativePanel3,
                                        'highlightDestination'
                                    )
                                        
                                    unhighlightHeatmapCoordinate(
                                        pitchElementPassPanel3,
                                        'highlightDestination'
                                    )

                                    unhighlightHeatmapCoordinate(
                                        pitchElementPassCumulativePanel3,
                                        'highlightDestination'
                                    )

                                    unhighlightHeatmapCoordinate(
                                        pitchElementRunPanel3,
                                        'highlightDestination'
                                    )

                                    unhighlightHeatmapCoordinate(
                                        pitchElementRunCumulativePanel3,
                                        'highlightDestination'
                                    )

                                        

                                },
                                mouseHoverTimeoutValue
                            )

                        }

                    }

                })
                .on('mouseover', function ( d ) {

                    if ( Panel3Click['x'] != null ) {
                            
                        clearTimeout(mouseHoverTimeout[pitchElementName])
                        mouseHoverTimeout[pitchElementName] = null
                            
                        if ( Panel3Click['endX'] == null ) {

                            updatePanel3HighlightsForDestinationHovers(
                                d.endX,
                                d.endY,
                                cContentPanelId,
                                pitchElementOriginPanel3,
                                pitchElementOriginCumulativePanel3,
                                pitchElementPassPanel3,
                                pitchElementPassCumulativePanel3,
                                pitchElementRunPanel3,
                                pitchElementRunCumulativePanel3,
                                xScale,
                                yScale,
                                svgPanel
                            )

                            mouseHoverTimeout[pitchElementName] = setTimeout(
                                function () {
                                    
                                    svgPanel.selectAll(".histogramindicators")
                                        // .attr('opacity', 0.5)
                                        .attr("stroke-opacity", 0)
                                        .attr("stroke-width", 0)
                                        .attr("fill", 'white')
                                        .attr("r", 2)

                                    svgPanel.selectAll(".histogramindicatorsshot")
                                        .moveToFront()
                                        
                                    svgPanel.selectAll(
                                        ".histogramindicators." + 
                                        d.event + '.x' + d.x + "_y" + d.y +
                                        '.endX' + d.endX + "_endY" + d.endY
                                    )
                                        // .attr('opacity', 1)
                                        .attr("stroke-opacity", 1)
                                        .attr("stroke-width", 4)
                                        .attr("fill", 'white')
                                        .attr("stroke", 'black')
                                        .attr("r", 8)
                                        .moveToFront()
                                    
                                },
                                mouseHoverTimeoutValue
                            )

                        }

                    }

                })
                .on('click', function ( d ) {
                    
                    if ( Panel3Click['x'] != null ) {
                                
                        clearTimeout(mouseHoverTimeout[pitchElementName]);
                        clearTimeout(dblclickTimeout[pitchElementName]);
                        mouseHoverTimeout[pitchElementName] = null
                        dblclickTimeout[pitchElementName] = null

                        Panel3Click['event'] = d.event

                        if ( d.event == 'Pass' | d.event == 'Run' ) {
                            
                            Panel3Click['endX'] = d.endX
                            Panel3Click['endY'] = d.endY

                        }
                        
                        dblclickTimeout[pitchElementName] = setTimeout(
                            function() {
            
                                d3.selectAll('.highlightDestination')
                                    .style(
                                        "stroke-width",
                                        '2px'
                                    )
                                
                                updatePanel3HighlightsForDestinationHovers(
                                    d.endX,
                                    d.endY,
                                    cContentPanelId,
                                    pitchElementOriginPanel3,
                                    pitchElementOriginCumulativePanel3,
                                    pitchElementPassPanel3,
                                    pitchElementPassCumulativePanel3,
                                    pitchElementRunPanel3,
                                    pitchElementRunCumulativePanel3,
                                    xScale,
                                    yScale,
                                    svgPanel
                                )

                                svgPanel.selectAll(".histogramindicators")
                                    // .attr('opacity', 0.5)
                                    // .attr('r')
                                    .attr("stroke-opacity", 0)
                                    .attr("stroke-width", 0)
                                    .attr("fill", 'white')
                                    .attr("r", 2)
                                    
                                svgPanel.selectAll(".histogramindicatorsshot")
                                    .moveToFront()

                                svgPanel.selectAll(".histogramindicators." + d.event + '.endX' + Panel3Click['endX'] + "_endY" + Panel3Click['endY'])
                                    // .attr('opacity', 1)
                                    .attr("stroke-opacity", 1)
                                    .attr("stroke-width", 4)
                                    .attr("fill", 'white')
                                    .attr("stroke", 'black')
                                    .attr("r", 8)
                                    .moveToFront()


            
                                Panel3Click['PlayPanelOpen'] = true
                                    
                                updatePanel3ForStartClickEndClick (
                                    pitch,
                                    svgPanel,
                                    dataAllEvents,
                                    d.event,
                                    d.x,
                                    d.y,
                                    d.endX,
                                    d.endY,
                                    PositionsToInclude,
                                    cPassColour,
                                    cRunColour,
                                    cShotColour,
                                    cDashboardPanelId
                                )
                                


                            },
                            dblclickTimeoutValue
                        )

                    }

                })
                .on('dblclick', function ( d ) {

                    if ( Panel3Click['x'] != null ) {
                                

                        clearTimeout(dblclickTimeout[pitchElementName]);
                        dblclickTimeout[pitchElementName] = null

                        Panel3Click['event'] = null
                        Panel3Click['endX'] = null
                        Panel3Click['endY'] = null 


                        d3.selectAll('.highlightDestination')
                            .style(
                                "stroke-width",
                                '4px'
                            )
                        
                                            
                        clearSelection()
                    
                    }

                    
                })

            
        }


        updateOriginHeatmap = function (
            pitchElement,
            pitchElementName,
            eventName,
            dataGranularOrigin,
            cumulative = false,
            colorScales,
            xScale,
            yScale,
            dataAllEvents,
            pitchElementOriginPanel3,
            pitchElementOriginCumulativePanel3,
            pitchElementShotPanel3,
            pitchElementShotCumulativePanel3,
            pitchElementPassPanel3,
            pitchElementPassCumulativePanel3,
            pitchElementRunPanel3,
            pitchElementRunCumulativePanel3,
            cContentPanelId,
            svgPanel,
            PositionsToInclude
        ) {

            pitchElement.selectAll('.GranularOrigin')
                // .transition()
                // .duration(100)
                // .style("fill-opacity", 0.2 )
                // .style("stroke-opacity", 0.2 )
                .remove()

            pitchElement.selectAll()
                .data(
                    dataGranularOrigin.filter(
                        function(d) {
                            return d.event == eventName
                        }
                    )
                )
                .enter()
                .append("rect")
                .attr('class', function(d) { return 'GranularOrigin ' + eventName +  ' x' + d.endX + '_y' + d.endY })
                .attr("x", function(d) { 
                    
                    plotX = d.x
                    return xScale(plotX) - xScale(nSizeRatioWithBufferForTiles * nBlockWidth/2) 

                })
                .attr("y", function(d) { 

                    plotY = d.y
                    return yScale(plotY) - xScale(nSizeRatioWithBufferForTiles * nBlockWidth/2) 

                })
                .attr("width", xScale(nBlockWidth * nSizeRatioWithBufferForTiles) )
                .attr("height", xScale(nBlockWidth * nSizeRatioWithBufferForTiles) )
                // .style("fill-opacity", 0 )
                // .style("stroke-opacity", 0 )
                // .attr("width", 10 )
                // .attr("height", 10 )
                .style("fill-opacity", 1 )
                .style("stroke-opacity", 0 )
                // .style(" shape-rendering", "geometricPrecision" )
                .style(
                    "color", 
                    function(d) { 
                        if (cumulative == true) {
                            return colorScales["myGranularNonShotGoalsColor"](d.WeightedExpectedGoals)
                        } else {
                            return colorScales["myGranularNonShotProbabilityColor"](d.GoalProbability)
                        }
                    } 
                )
                .style(
                    "fill", 
                    function(d) { 
                        if (cumulative == true) {
                            return colorScales["myGranularNonShotGoalsColor"](d.WeightedExpectedGoals)
                        } else {
                            return colorScales["myGranularNonShotProbabilityColor"](d.GoalProbability)
                        }
                    } 
                )
                .on('mouseout', function ( d ) {

                    clearTimeout(mouseHoverTimeout[pitchElementName])
                    mouseHoverTimeout[pitchElementName] = null
                    
                    if ( Panel3Click['endX'] != null ) {
                        
                        if ( Panel3Click['x'] == null ) {                        

                            mouseHoverTimeout[pitchElementName] = setTimeout(
                                function () {

                                    svgPanel.selectAll(".histogramindicators")
                                        // .attr('opacity', 1)
                                        .attr("stroke-opacity", 0)
                                        .attr("stroke-width", 0)
                                        .attr("fill", 'white')
                                        .attr("r", 2)

                                    svgPanel.selectAll(".histogramindicatorsshot")
                                        .moveToFront()
                                        
                                    unhighlightHeatmapCoordinate(
                                        pitchElementOriginPanel3,
                                        'highlightOrigin'
                                    )

                                    unhighlightHeatmapCoordinate(
                                        pitchElementOriginCumulativePanel3,
                                        'highlightOrigin'
                                    )
                                    
                                    unhighlightHeatmapCoordinate(
                                        pitchElementPassPanel3,
                                        'highlightOrigin'
                                    )

                                    unhighlightHeatmapCoordinate(
                                        pitchElementPassCumulativePanel3,
                                        'highlightOrigin'
                                    )

                                    unhighlightHeatmapCoordinate(
                                        pitchElementRunPanel3,
                                        'highlightOrigin'
                                    )

                                    unhighlightHeatmapCoordinate(
                                        pitchElementRunCumulativePanel3,
                                        'highlightOrigin'
                                    )
        
                                        

                                },
                                mouseHoverTimeoutValue
                            )

                        }

                    }

                })
                .on('mouseover', function ( d ) {

                    if ( Panel3Click['endX'] != null ) {
                        
                        clearTimeout(mouseHoverTimeout[pitchElementName])
                        mouseHoverTimeout[pitchElementName] = null
                        
                        if ( Panel3Click['x'] == null ) {

                            updatePanel3HighlightsForOriginHovers(
                                d.x,
                                d.y,
                                pitchElementOriginPanel3,
                                pitchElementOriginCumulativePanel3,
                                pitchElementShotPanel3,
                                pitchElementShotCumulativePanel3,
                                pitchElementPassPanel3,
                                pitchElementPassCumulativePanel3,
                                pitchElementRunPanel3,
                                pitchElementRunCumulativePanel3,
                                cContentPanelId,
                                xScale,
                                yScale,
                                Panel3Click
                            )

                            mouseHoverTimeout[pitchElementName] = setTimeout(
                                function () {

                                    svgPanel.selectAll(".histogramindicators")
                                        // .attr('opacity', 0.5)
                                        .attr("stroke-opacity", 0)
                                        .attr("stroke-width", 0)
                                        .attr("fill", 'white')
                                        .attr("r", 2)

                                    svgPanel.selectAll(".histogramindicatorsshot")
                                        .moveToFront()
                                        
                                    svgPanel.selectAll(".histogramindicators." + Panel3Click['event'] + '.x' + d.x + "_y" + d.y)
                                        // .attr('opacity', 1)
                                        .attr("stroke-opacity", 1)
                                        .attr("stroke-width", 4)
                                        .attr("fill", 'white')
                                        .attr("stroke", 'black')
                                        .attr("r", 8)
                                        .moveToFront()
                                    
                                },
                                mouseHoverTimeoutValue
                            )

                        }

                    }

                })
                .on('click', function ( d ) {
                    
                    if ( Panel3Click['endX'] != null ) {
                                
                        clearTimeout(mouseHoverTimeout[pitchElementName]);
                        clearTimeout(dblclickTimeout[pitchElementName]);
                        mouseHoverTimeout[pitchElementName] = null
                        dblclickTimeout[pitchElementName] = null

                        Panel3Click['x'] = d.x
                        Panel3Click['y'] = d.y

                        dblclickTimeout[pitchElementName] = setTimeout(
                            function() {
            
                                d3.selectAll('.highlightOrigin')
                                    .style(
                                        "stroke-width",
                                        '2px'
                                    )
                            
                                updatePanel3HighlightsForOriginHovers(
                                    d.x,
                                    d.y,
                                    pitchElementOriginPanel3,
                                    pitchElementOriginCumulativePanel3,
                                    pitchElementShotPanel3,
                                    pitchElementShotCumulativePanel3,
                                    pitchElementPassPanel3,
                                    pitchElementPassCumulativePanel3,
                                    pitchElementRunPanel3,
                                    pitchElementRunCumulativePanel3,
                                    cContentPanelId,
                                    xScale,
                                    yScale,
                                    Panel3Click
                                )

                                svgPanel.selectAll(".histogramindicators")
                                    // .attr('opacity', 0.5)
                                    // .attr('r')
                                    .attr("stroke-opacity", 0)
                                    .attr("stroke-width", 0)
                                    .attr("fill", 'white')
                                    .attr("r", 2)
                                    
                                svgPanel.selectAll(".histogramindicatorsshot")
                                    .moveToFront()

                                svgPanel.selectAll(".histogramindicators." + Panel3Click['event'] + '.x' + d.x + "_y" + d.y)
                                    // .attr('opacity', 1)
                                    .attr("stroke-opacity", 1)
                                    .attr("stroke-width", 4)
                                    .attr("fill", 'white')
                                    .attr("stroke", 'black')
                                    .attr("r", 8)
                                    .moveToFront()

                                Panel3Click['PlayPanelOpen'] = true
                                    
                                updatePanel3ForStartClickEndClick (
                                    pitch,
                                    svgPanel,
                                    dataAllEvents,
                                    Panel3Click['event'],
                                    Panel3Click['x'],
                                    Panel3Click['y'],
                                    Panel3Click['endX'],
                                    Panel3Click['endY'],
                                    PositionsToInclude,
                                    cPassColour,
                                    cRunColour,
                                    cShotColour,
                                    cDashboardPanelId
                                )
                                


                            },
                            dblclickTimeoutValue
                        )

                    }

                })
                .on('dblclick', function ( d ) {

                    if ( Panel3Click['endX'] != null ) {                                

                        clearTimeout(dblclickTimeout[pitchElementName]);
                        dblclickTimeout[pitchElementName] = null

                        Panel3Click['x'] = null
                        Panel3Click['y'] = null 

                        d3.selectAll('.highlightOrigin')
                            .style(
                                "stroke-width",
                                '4px'
                            )
                        
                                            
                        clearSelection()
                    
                    }

                    
                })

            
        }

        unhighlightHeatmapCoordinate = function (
            pitchElement,
            highlightClass
        ) {

            pitchElement.selectAll('.'+ highlightClass)
                // .append("circle")
                // .attr('class', 'highlight')
                // .attr("r", xScale4(nBlockWidth * ( nSizeRatioWithBufferForTiles / 2 ) ) )
                // .style("fill-opacity", 0 )
                // .style("stroke-opacity", 0 )
                // .attr("width", 10 )
                // .attr("height", 10 )
                // .style("fill-opacity", '1' )
                .style("stroke-opacity", '0' )
        }

        highlightHeatmapCoordinate = function (
            pitchElement,
            xHovered,
            yHovered,
            xScale,
            yScale,
            highlightClass
        ) {

            pitchElement.selectAll('.'+ highlightClass)
                // .append("circle")
                // .attr('class', 'highlight')
                // .attr("r", xScale4(nBlockWidth * ( nSizeRatioWithBufferForTiles / 2 ) ) )
                // .style("fill-opacity", 0 )
                // .style("stroke-opacity", 0 )
                // .attr("width", 10 )
                // .attr("height", 10 )
                // .style("fill-opacity", '1' )
                .style("stroke-opacity", '1' )
                // .style(
                //     "stroke", 
                //     cHighlightColour
                // )
                // .style(
                //     "fill", 
                //     // cHighlightColour
                //     'none'
                // )
                // .style(
                //     "stroke-width",
                //     '5px'
                // )
                .attr('cx', xScale(xHovered))
                .attr('cy', yScale(yHovered))
                .moveToFront()

        }


        fCreatePanel0 = function(
            cContentPanelId,
            dataOriginProbabilitiesShotFor,
            colorScales,
            selectedSetName
        ) {

            var svgPanel0 = d3.select("#" + cContentPanelId).append("svg")
                .attr(
                    "width", 
                    2 * xScale2(pitch.frame.width)
                )
                .attr(
                    "height", 
                    xScale2(pitch.frame.length)
                )
                // .attr(
                //     "style", 
                //     "display:block;"
                // )
                // .attr(
                //    "style", 
                //    "margin-left:-" + 0 * xScale4(pitch.frame.width) + "px;margin-top:-" + 0 * xScale4(pitch.frame.length)
                // )
                ;


            var pitchElementShotPanel0 = svgPanel0.append("g")
                .attr(
                    "transform", 
                    "translate(" + xScale2(pitch.padding.left) + "," + xScale2(pitch.padding.top) + ")"
                )
                
            addPlotTitle( 
                pitchElementShotPanel0,
                'xPo from shots',
                xScale2,
                nBlockWidth,
                null,
                cContentPanelId
            )

            // addPlotLegend( 
            //     pitchElementShotPanel0,
            //     xScale2,
            //     nBlockWidth,
            //     colorScales['myShotProbabilityColor'],
            //     pitch.length
            // )

            
            addPitchColor(
                pitchElementShotPanel0,
                xScale2
            )
                
            var pitchElementShotMarkingsPanel0 = pitchElementShotPanel0
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementShotMarkingsPanel0,
                xScale2
            )

            addPitchData(
                pitchElementShotPanel0,
                dataOriginProbabilitiesShotFor,
                'Origin',
                className = 'shot',
                xScale2,
                yScale2,
                nBlockWidth,
                colorScales['myShotProbabilityColor'],
                'GoalProbability'
            )

            pitchElementShotMarkingsPanel0.moveToFront()


            var pitchElementShotCumulativePanel0 = svgPanel0.append("g")
                .attr(
                    "transform", 
                    "translate(" +xScale2(pitch.frame.width + pitch.padding.left) + "," + xScale2(pitch.padding.top) + ")"
                )

            addPlotTitle( 
                pitchElementShotCumulativePanel0,
                'Total xPo generated p90 from shots',
                xScale2,
                nBlockWidth,
                null,
                cContentPanelId
            )

            addPitchColor(
                pitchElementShotCumulativePanel0,
                xScale2
            )
                
            var pitchElementShotMarkingsPanel0 = pitchElementShotCumulativePanel0
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementShotMarkingsPanel0,
                xScale2
            )
                

            addPitchData(
                pitchElementShotCumulativePanel0,
                dataOriginProbabilitiesShotFor,
                'Origin',
                className = 'shot',
                xScale2,
                yScale2,
                nBlockWidth,
                colorScales['myShotGoalsColor'],
                'WeightedExpectedGoals'
            )

            pitchElementShotMarkingsPanel0.moveToFront()

        }


        fCreatePanel4 = function(
            cContentPanelId,
            dataOriginProbabilitiesPassFor,
            colorScales,
            selectedSetName
        ) {
                
            var svgPanel4 = d3.select("#" + cContentPanelId).append("svg")
                .attr(
                    "width", 
                    2 * xScale2(pitch.frame.width)
                )
                .attr(
                    "height", 
                    xScale2(pitch.frame.length)
                )
                // .attr(
                //    "style", 
                //    "margin-left:-" + 0 * xScale4(pitch.frame.width) + "px;margin-top:-" + 0 * xScale4(pitch.frame.length)
                // )
                ;

            var pitchElementPassPanel4 = svgPanel4.append("g")
                .attr("transform", "translate(" + xScale2(pitch.padding.left) + "," + xScale2(pitch.padding.top) + ")")
            
            addPlotTitle(
                pitchElementPassPanel4,
                'xPo from passes',
                xScale2,
                nBlockWidth,
                null,
                cContentPanelId
            )

            addPitchColor(
                pitchElementPassPanel4,
                xScale2
            )
                
            var pitchElementMarkingsOriginPanel4 = pitchElementPassPanel4
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementMarkingsOriginPanel4,
                xScale2
            )         

            addPitchData(
                pitchElementPassPanel4,
                dataOriginProbabilitiesPassFor,
                'Origin',
                'BaseOriginProbabilities',
                xScale2,
                yScale2,
                nBlockWidth,
                colorScales['myNonShotProbabilityColorOrigin'],
                'GoalProbability'
            )
                
            pitchElementMarkingsOriginPanel4.moveToFront()


            var pitchElementPassCumulativePanel4 = svgPanel4.append("g")
                .attr("transform", "translate(" +xScale2(pitch.frame.width + pitch.padding.left) + "," + xScale2(pitch.padding.top) + ")")

            
            addPlotTitle(
                pitchElementPassCumulativePanel4,
                'Total xPo generated p90 from passes',
                xScale2,
                nBlockWidth,
                null,
                cContentPanelId
            )

            addPitchColor(
                pitchElementPassCumulativePanel4,
                xScale2
            )
                
            var pitchElementMarkingsOriginCumulativePanel4 = pitchElementPassCumulativePanel4
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementMarkingsOriginCumulativePanel4,
                xScale2
            )
            
            addPitchData(
                pitchElementPassCumulativePanel4,
                dataOriginProbabilitiesPassFor,
                'Origin',
                'OriginProbabilitiesCumulative',
                xScale2,
                yScale2,
                nBlockWidth,
                colorScales['myNonShotGoalsColorOrigin'],
                'WeightedExpectedGoals'
            )
                
            pitchElementMarkingsOriginCumulativePanel4.moveToFront()

        }


                            
        fCreatePanel5 = function(
            cContentPanelId,
            dataOriginProbabilitiesRunFor,
            colorScales,
            selectedSetName
        ) {        

            var svgPanel5 = d3.select("#" + cContentPanelId).append("svg")
                .attr(
                    "width", 
                    2 * xScale2(pitch.frame.width)
                )
                .attr(
                    "height", 
                    xScale2(pitch.frame.length)
                )
                // .attr(
                //    "style", 
                //    "margin-left:-" + 0 * xScale4(pitch.frame.width) + "px;margin-top:-" + 0 * xScale4(pitch.frame.length)
                // )
                ;

            var pitchElementRunPanel5 = svgPanel5.append("g")
                .attr("transform", "translate(" +xScale2(pitch.padding.left) + "," + xScale2(pitch.padding.top) + ")")

            
            addPlotTitle(
                pitchElementRunPanel5,
                'xPo from carries',
                xScale2,
                nBlockWidth,
                null,
                cContentPanelId
            )


            addPitchColor(
                pitchElementRunPanel5,
                xScale2
            )
                
            var pitchElementMarkingsOriginPanel5 = pitchElementRunPanel5
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementMarkingsOriginPanel5,
                xScale2
            )  

            addPitchData(
                pitchElementRunPanel5,
                dataOriginProbabilitiesRunFor,
                'Origin',
                'BaseOriginProbabilities',
                xScale2,
                yScale2,
                nBlockWidth,
                colorScales['myNonShotProbabilityColorOrigin'],
                'GoalProbability'
            )

            pitchElementMarkingsOriginPanel5.moveToFront()


            var pitchElementRunCumulativePanel5 = svgPanel5.append("g")
                .attr("transform", "translate(" +xScale2(pitch.frame.width + pitch.padding.left) + "," + xScale2(pitch.padding.top) + ")")

            addPlotTitle(
                pitchElementRunCumulativePanel5,
                'Total xPo generated p90 from carries',
                xScale2,
                nBlockWidth,
                null,
                cContentPanelId
            )

            addPitchColor(
                pitchElementRunCumulativePanel5,
                xScale2
            )
                
            var pitchElementMarkingsOriginCumulativePanel5 = pitchElementRunCumulativePanel5
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementMarkingsOriginCumulativePanel5,
                xScale2
            )

            addPitchData(
                pitchElementRunCumulativePanel5,
                dataOriginProbabilitiesRunFor,
                'Origin',
                'OriginProbabilitiesCumulative',
                xScale2,
                yScale2,
                nBlockWidth,
                colorScales['myNonShotGoalsColorOrigin'],
                'WeightedExpectedGoals'
            ) 

                
            pitchElementMarkingsOriginCumulativePanel5.moveToFront()

        }





        fCreatePanel1 = function(
            cContentPanelId,
            dataOriginProbabilitiesFor,
            colorScales,
            selectedSetName
        ) {
            

            var svgPanel1 = d3.select("#" + cContentPanelId).append("svg")
                .attr(
                    "width", 
                    2 * xScale2(pitch.frame.width)
                )
                .attr(
                    "height", 
                    xScale2(pitch.frame.length)
                )
                // .attr(
                //    "style", 
                //    "margin-left:-" + 0 * xScale4(pitch.frame.width) + "px;margin-top:-" + 0 * xScale4(pitch.frame.length)
                // )
                ;

            var pitchElementOriginPanel1 = svgPanel1.append("g")
                .attr("transform", "translate(" + xScale2(pitch.padding.left) + "," + xScale2(pitch.padding.top) + ")")

            addPlotTitle(
                pitchElementOriginPanel1,
                'xPo overall',
                xScale2,
                nBlockWidth,
                null,
                cContentPanelId
            )

            addPitchColor(
                pitchElementOriginPanel1,
                xScale2
            )
                
            var pitchElementMarkingsOriginPanel1 = pitchElementOriginPanel1
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementMarkingsOriginPanel1,
                xScale2
            )         

            addPitchData(
                pitchElementOriginPanel1,
                dataOriginProbabilitiesFor,
                'Origin',
                'BaseOriginProbabilities',
                xScale2,
                yScale2,
                nBlockWidth,
                colorScales['myProbabilityColorOrigin'],
                'GoalProbability'
            )

            pitchElementMarkingsOriginPanel1.moveToFront()


            var pitchElementOriginCumulativePanel1 = svgPanel1.append("g")
                .attr("transform", "translate(" + xScale2(pitch.frame.width + pitch.padding.left) + "," + xScale2(pitch.padding.top) + ")")

            addPlotTitle(
                pitchElementOriginCumulativePanel1,
                'Total xPo generated p90 overall',
                xScale2,
                nBlockWidth,
                null,
                cContentPanelId
            )

            addPitchColor(
                pitchElementOriginCumulativePanel1,
                xScale2
            )
                
            var pitchElementMarkingsOriginCumulativePanel1 = pitchElementOriginCumulativePanel1
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementMarkingsOriginCumulativePanel1,
                xScale2
            )             

            addPitchData(
                pitchElementOriginCumulativePanel1,
                dataOriginProbabilitiesFor,
                'Origin',
                'OriginProbabilitiesCumulative',
                xScale2,
                yScale2,
                nBlockWidth,
                colorScales['myGoalsColorOrigin'],
                'WeightedExpectedGoals'
            )

            pitchElementMarkingsOriginCumulativePanel1.moveToFront()

        }


        fCreatePanel3 = function(
            cContentPanelId,
            dataAllEvents,
            dataOriginProbabilitiesFor,
            dataOriginProbabilitiesShotFor,
            dataOriginProbabilitiesPassFor,
            dataOriginProbabilitiesRunFor,
            dataDestinationProbabilitiesFor,
            dataDestinationProbabilitiesPassFor,
            dataDestinationProbabilitiesRunFor,
            dataDistributionScale,
            colorScales,
            setCode,
            selectedSetName,
            nTwoDimSearchRadius,
            PositionsToInclude,
            dataActionDistribution,
            typeOfDataset
        ) {

            
            var svgPanel3 = d3.select("#" + cContentPanelId).append("svg")
                .attr('id','svgPanel3')
                .attr(
                    "width", 
                    ( svgPanel3Width )
                    // nFullWidth
                )
                .attr(
                    "height", 
                    // ( 1 * xScale3(pitch.frame.length)) +
                    ( xScale3(panel3titlespace + ( 3 * pitch.frame.length ) ) )
                )
                // .attr(
                //    "transform", 
                //    "translate(" +xScale3(pitch.padding.left) + "," + xScale3(xScale3(pitch.frame.length)) + ")"
                // )
                // .attr(
                //    "style", 
                //    "margin-left:-" + 0 * xScale3(pitch.frame.width) + "px;margin-top:-" + 0 * xScale3(pitch.frame.length)
                // )
                ;

            svgPanel3
                .append('text')
                .attr('x', xScale3((pitch.frame.width/2)))
                .attr('y', xScale3(pitch.padding.top))
                .style("text-anchor", "middle")
                .text('From')
                .attr("font-size", "0.7em")
                .attr('fill','white')

            svgPanel3
                .append('line')
                .attr('x1', xScale3((pitch.padding.left)))
                .attr('x2', xScale3((pitch.padding.left + pitch.length)))
                .attr('y1', xScale3(pitch.padding.top + 2))
                .attr('y2', xScale3(pitch.padding.top + 2))
                .attr('stroke','white')

            svgPanel3
                .append('text')
                .attr('x', xScale3(pitch.padding.left + (2 * pitch.frame.width)))
                .attr('y', xScale3(pitch.padding.top))
                .style("text-anchor", "middle")
                .text('To')
                .attr("font-size", "0.7em")
                .attr('fill','white')

            svgPanel3
                .append('line')
                .attr('x1', xScale3(pitch.padding.left + pitch.padding.left + pitch.frame.width))
                .attr('x2', xScale3(pitch.padding.left + pitch.padding.left + pitch.frame.width + pitch.length + pitch.frame.width))
                .attr('y1', xScale3(pitch.padding.top + 2))
                .attr('y2', xScale3(pitch.padding.top + 2))
                .attr('stroke','white')

            svgPanel3
                .append('text')
                .attr('x', xScale3(( 4 * pitch.padding.left ) + ( 3 * pitch.frame.width ) + ( 0.5 * pitch.length )))
                .attr('y', xScale3(pitch.padding.top))
                .style("text-anchor", "middle")
                .text('xPo Perspective')
                .attr("font-size", "0.7em")
                .attr('fill','white')

            svgPanel3
                .append('line')
                .attr('x1', xScale3(( 4 * pitch.padding.left ) + ( 3 * pitch.frame.width ) + ( 0 * pitch.length )))
                .attr('x2', xScale3(( 4 * pitch.padding.left ) + ( 3 * pitch.frame.width ) + ( 1 * pitch.length )))
                .attr('y1', xScale3(pitch.padding.top + 2))
                .attr('y2', xScale3(pitch.padding.top + 2))
                .attr('stroke','white')


            // var svgBorderPanel3 = svgPanel3
            //     .append('rect')
            //     .attr('y',0)
            //     .attr('x',0)
            //     .attr(
            //         "width", 
            //         ( 4 * xScale3(pitch.frame.width) )
            //     )
            //     .attr(
            //         "height", 
            //         // ( 1 * xScale3(pitch.frame.length)) +
            //         ( 3 * xScale3(pitch.frame.length))
            //     )
            //     .attr('fill-opacity', 0)
            //     .attr('fill', 'white')
            //     .attr('stroke-opacity', 1)
            //     .attr('stroke', 'black')
                
            var pitchElementOriginPanel3 = svgPanel3.append("g")
                .attr('id','pitchElementOriginPanel3')
                .attr("transform", "translate(" +xScale3(pitch.padding.left) + "," + xScale3(pitch.padding.top + panel3titlespace) + ")")



            var pitchElementOriginCumulativePanel3 = svgPanel3.append("g")
                .attr('id','pitchElementOriginCumulativePanel3')
                .attr("transform", "translate(" +xScale3(pitch.padding.left) + "," + xScale3( panel3titlespace + pitch.padding.top + pitch.frame.length) + ")")
  


            var pitchElementShotPanel3 = svgPanel3.append("g")
                .attr('id','pitchElementShotPanel3')
                .attr(
                    "transform", 
                    "translate(" + xScale3( pitch.padding.left + pitch.padding.left + pitch.frame.width ) + "," + xScale3(panel3titlespace + pitch.padding.top + pitch.frame.length + pitch.frame.length) + ")"
                    // "translate(" +xScale3(pitch.frame.width + pitch.frame.width + pitch.frame.width + pitch.padding.left) + "," + xScale3(pitch.padding.top) + ")"
                )

            addPlotTitle(
                pitchElementShotPanel3,
                'xPo from shots',
                xScale3,
                nBlockWidth,
                null,
                cContentPanelId
            )

            addPitchColor(
                pitchElementShotPanel3,
                xScale3
            )

            var pitchElementShotMarkingsPanel3 = pitchElementShotPanel3
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementShotMarkingsPanel3,
                xScale3
            )

            pitchElementShotPanel3.selectAll()
                .data(
                    dataOriginProbabilitiesShotFor
                )
                .enter()
                .append("rect")
                .attr('class', function(d) { 
                    return 'Shot' +  ' x' + d.x + '_y' + d.y 
                })
                .attr("x", function(d) { return xScale3(d.x) - xScale3(nSizeRatioWithBufferForTiles*nBlockWidth/2) })
                .attr("y", function(d) { return yScale3(d.y) - xScale3(nSizeRatioWithBufferForTiles*nBlockWidth/2) })
                .attr("width", xScale3(nBlockWidth * nSizeRatioWithBufferForTiles) )
                .attr("height", xScale3(nBlockWidth * nSizeRatioWithBufferForTiles) )
                // .attr("x", function(d) { return xScale3(d.x) - xScale3(nBlockWidth/2) })
                // .attr("y", function(d) { return xScale3(d.y) - xScale3(nBlockWidth/2) })
                // .attr("width", xScale3(nBlockWidth) )
                // .attr("height", xScale3(nBlockWidth) )
                .style("color", function(d) { return colorScales['myShotProbabilityColor'](d.GoalProbability)} )
                .style("fill", function(d) { return colorScales['myShotProbabilityColor'](d.GoalProbability)} )
                .style("fill-opacity", 1 )
                .style("stroke-opacity", 1 )

            pitchElementShotMarkingsPanel3.moveToFront()

            var pitchElementShotCumulativePanel3 = svgPanel3.append("g")
                .attr('id','pitchElementShotPanel3')
                .attr(
                    "transform", 
                    "translate(" + xScale3( pitch.padding.left + pitch.padding.left + pitch.frame.width + pitch.frame.width ) + "," + xScale3(panel3titlespace + pitch.padding.top + pitch.frame.length + pitch.frame.length) + ")"
                )

            addPlotTitle(
                pitchElementShotCumulativePanel3,
                'Total xPo generated p90 from shots',
                xScale3,
                nBlockWidth,
                null,
                cContentPanelId
            )

            addPitchColor(
                pitchElementShotCumulativePanel3,
                xScale3
            )
                
            var pitchElementShotMarkingsPanel3 = pitchElementShotCumulativePanel3
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementShotMarkingsPanel3,
                xScale3
            )
                
            pitchElementShotCumulativePanel3.selectAll()
                .data(
                    dataOriginProbabilitiesShotFor
                )
                .enter()
                .append("rect")
                .attr('class', function(d) {
                    return 'Shot' +  ' x' + d.x + '_y' + d.y 
                })
                .attr("x", function(d) { return xScale3(d.x) - xScale3(nSizeRatioWithBufferForTiles*nBlockWidth/2) })
                .attr("y", function(d) { return yScale3(d.y) - xScale3(nSizeRatioWithBufferForTiles*nBlockWidth/2) })
                .attr("width", xScale3(nBlockWidth * nSizeRatioWithBufferForTiles) )
                .attr("height", xScale3(nBlockWidth * nSizeRatioWithBufferForTiles) )
                // .attr("x", function(d) { return xScale3(d.x) - xScale3(nBlockWidth/2) })
                // .attr("y", function(d) { return xScale3(d.y) - xScale3(nBlockWidth/2) })
                // .attr("width", xScale3(nBlockWidth) )
                // .attr("height", xScale3(nBlockWidth) )
                .style("color", function(d) { return colorScales['myShotGoalsColor'](d.WeightedExpectedGoals)} )
                .style("fill", function(d) { return colorScales['myShotGoalsColor'](d.WeightedExpectedGoals)} )
                .style("fill-opacity", 1 )
                .style("stroke-opacity", 1 )

            pitchElementShotMarkingsPanel3.moveToFront()






            var pitchElementRunCumulativePanel3 = svgPanel3.append("g")
                .attr('id','pitchElementRunCumulativePanel3')
                .attr(
                    "transform", 
                    "translate(" + ( xScale3(pitch.padding.left + pitch.padding.left + pitch.frame.width + pitch.frame.width ) ) + "," + ( xScale3(panel3titlespace + pitch.frame.length + pitch.padding.top) ) + ")"               
                )        

            var pitchElementPassPanel3 = svgPanel3.append("g")
                .attr('id','pitchElementPassPanel3')
                .attr(
                    "transform", 
                    "translate(" + ( xScale3(pitch.padding.left + pitch.padding.left + pitch.frame.width) ) + "," + xScale3(panel3titlespace + pitch.padding.top) + ")"
                    
                )
                
            var pitchElementPassCumulativePanel3 = svgPanel3.append("g")
                .attr('id','pitchElementPassCumulativePanel3')
                .attr(
                    "transform", 
                    "translate(" + ( xScale3(pitch.padding.left + pitch.padding.left + pitch.frame.width + pitch.frame.width ) ) + "," + xScale3(panel3titlespace + pitch.padding.top) + ")"
                )

            var pitchElementRunPanel3 = svgPanel3.append("g")
                .attr('id','pitchElementRunPanel3')
                .attr(
                    "transform", 
                    "translate(" + ( xScale3(pitch.padding.left + pitch.padding.left + pitch.frame.width) ) + "," + ( xScale3(panel3titlespace + pitch.frame.length + pitch.padding.top) ) + ")"
                )            





                
            fDrawAllEventsOrigin(
                pitchElementOriginCumulativePanel3,
                'pitchElementOriginCumulativePanel3',
                xScale3,
                nBlockWidth,
                selectedSetName,
                cContentPanelId,
                // 'Origin',
                'BaseOriginProbabilities',
                'WeightedExpectedGoals',
                colorScales,
                'myGoalsColorOrigin',
                // 'Pass',
                dataOriginProbabilitiesFor,
                pitchElementOriginPanel3,
                pitchElementOriginCumulativePanel3,
                pitchElementShotPanel3,
                pitchElementShotCumulativePanel3,
                pitchElementPassPanel3,
                pitchElementPassCumulativePanel3,
                pitchElementRunPanel3,
                pitchElementRunCumulativePanel3,
                setCode,
                dataAllEvents,
                svgPanel3,
                'Total xPo generated p90 from this area',
                dataOriginProbabilitiesFor,
                dataOriginProbabilitiesShotFor,
                dataOriginProbabilitiesPassFor,
                dataOriginProbabilitiesRunFor
            )
            
    
                
            fDrawAllEventsOrigin(
                pitchElementOriginPanel3,
                'pitchElementOriginPanel3',
                xScale3,
                nBlockWidth,
                selectedSetName,
                cContentPanelId,
                // 'Origin',
                'BaseOriginProbabilities',
                'GoalProbability',
                colorScales,
                'myProbabilityColorOrigin',
                // 'Pass',
                dataOriginProbabilitiesFor,
                pitchElementOriginPanel3,
                pitchElementOriginCumulativePanel3,
                pitchElementShotPanel3,
                pitchElementShotCumulativePanel3,
                pitchElementPassPanel3,
                pitchElementPassCumulativePanel3,
                pitchElementRunPanel3,
                pitchElementRunCumulativePanel3,
                setCode,
                dataAllEvents,
                svgPanel3,
                'xPo from this area',
                dataOriginProbabilitiesFor,
                dataOriginProbabilitiesShotFor,
                dataOriginProbabilitiesPassFor,
                dataOriginProbabilitiesRunFor
            )
            
    

            fDrawEventDestination(
                pitchElementPassPanel3,
                'pitchElementPassPanel3',
                xScale3,
                nBlockWidth,
                selectedSetName,
                cContentPanelId,
                'Destination',
                'BaseDestinationPanel3',
                'GoalProbability',
                colorScales,
                'myNonShotProbabilityColorDestination',
                'Pass',
                dataDestinationProbabilitiesPassFor,
                pitchElementOriginPanel3,
                pitchElementOriginCumulativePanel3,
                pitchElementShotPanel3,
                pitchElementShotCumulativePanel3,
                pitchElementPassPanel3,
                pitchElementPassCumulativePanel3,
                pitchElementRunPanel3,
                pitchElementRunCumulativePanel3,
                setCode,
                dataAllEvents,
                svgPanel3,
                'xPo from passing to this area',
                dataOriginProbabilitiesFor,
                dataOriginProbabilitiesShotFor,
                dataOriginProbabilitiesPassFor,
                dataOriginProbabilitiesRunFor
            )

                

            fDrawEventDestination(
                pitchElementPassCumulativePanel3,
                'pitchElementPassCumulativePanel3',
                xScale3,
                nBlockWidth,
                selectedSetName,
                cContentPanelId,
                'Destination',
                'BaseDestinationPanel3',
                'WeightedExpectedGoals',
                colorScales,
                'myNonShotGoalsColorDestination',
                'Pass',
                dataDestinationProbabilitiesPassFor,
                pitchElementOriginPanel3,
                pitchElementOriginCumulativePanel3,
                pitchElementShotPanel3,
                pitchElementShotCumulativePanel3,
                pitchElementPassPanel3,
                pitchElementPassCumulativePanel3,
                pitchElementRunPanel3,
                pitchElementRunCumulativePanel3,
                setCode,
                dataAllEvents,
                svgPanel3,
                'Total xPo generated p90 by passing to this area',
                dataOriginProbabilitiesFor,
                dataOriginProbabilitiesShotFor,
                dataOriginProbabilitiesPassFor,
                dataOriginProbabilitiesRunFor
            )

                

            fDrawEventDestination(
                pitchElementRunPanel3,
                'pitchElementRunPanel3',
                xScale3,
                nBlockWidth,
                selectedSetName,
                cContentPanelId,
                'Destination',
                'BaseDestinationPanel3',
                'GoalProbability',
                colorScales,
                'myNonShotProbabilityColorDestination',
                'Run',
                dataDestinationProbabilitiesRunFor,
                pitchElementOriginPanel3,
                pitchElementOriginCumulativePanel3,
                pitchElementShotPanel3,
                pitchElementShotCumulativePanel3,
                pitchElementPassPanel3,
                pitchElementPassCumulativePanel3,
                pitchElementRunPanel3,
                pitchElementRunCumulativePanel3,
                setCode,
                dataAllEvents,
                svgPanel3,
                'xPo from carrying to this area',
                dataOriginProbabilitiesFor,
                dataOriginProbabilitiesShotFor,
                dataOriginProbabilitiesPassFor,
                dataOriginProbabilitiesRunFor
            )

                

            fDrawEventDestination(
                pitchElementRunCumulativePanel3,
                'pitchElementRunPanel3',
                xScale3,
                nBlockWidth,
                selectedSetName,
                cContentPanelId,
                'Destination',
                'BaseDestinationPanel3',
                'WeightedExpectedGoals',
                colorScales,
                'myNonShotGoalsColorDestination',
                'Run',
                dataDestinationProbabilitiesRunFor,
                pitchElementOriginPanel3,
                pitchElementOriginCumulativePanel3,
                pitchElementShotPanel3,
                pitchElementShotCumulativePanel3,
                pitchElementPassPanel3,
                pitchElementPassCumulativePanel3,
                pitchElementRunPanel3,
                pitchElementRunCumulativePanel3,
                setCode,
                dataAllEvents,
                svgPanel3,
                'Total xPo generated p90 by running to this area',
                dataOriginProbabilitiesFor,
                dataOriginProbabilitiesShotFor,
                dataOriginProbabilitiesPassFor,
                dataOriginProbabilitiesRunFor
            )

                











            addHighlightObject(
                pitchElementOriginPanel3,
                'highlightOrigin'
            )

            addHighlightObject(
                pitchElementOriginCumulativePanel3,
                'highlightOrigin'
            )

            addHighlightObject(
                pitchElementShotPanel3,
                'highlightOrigin'
            )

            addHighlightObject(
                pitchElementShotCumulativePanel3,
                'highlightOrigin'
            )

            addHighlightObject(
                pitchElementPassPanel3,
                'highlightOrigin'
            )

            addHighlightObject(
                pitchElementRunPanel3,
                'highlightOrigin'
            )

            addHighlightObject(
                pitchElementPassCumulativePanel3,
                'highlightOrigin'
            )

            addHighlightObject(
                pitchElementRunCumulativePanel3,
                'highlightOrigin',
                color = cHighlightColour
            )

            addHighlightObject(
                pitchElementOriginPanel3,
                'highlightDestination',
                color = '#55c6f8'
            )

            addHighlightObject(
                pitchElementOriginCumulativePanel3,
                'highlightDestination',
                color = '#55c6f8'
            )

            addHighlightObject(
                pitchElementPassPanel3,
                'highlightDestination',
                color = '#55c6f8'
            )

            addHighlightObject(
                pitchElementRunPanel3,
                'highlightDestination',
                color = '#55c6f8'
            )

            addHighlightObject(
                pitchElementPassCumulativePanel3,
                'highlightDestination',
                color = '#55c6f8'
            )

            addHighlightObject(
                pitchElementRunCumulativePanel3,
                'highlightDestination',
                color = '#55c6f8'
            )

            if ( whichColourScale == selectedSetCode + '/' ) {
                nUpperLimitGoalProbability = d3.max(dataActionDistribution, function(d) { return d.GoalProbability; })
                nUpperLimitWeightedExpectedGoals = d3.max(dataActionDistribution, function(d) { return d.WeightedExpectedGoals; })                            
                nUpperLimitWeightedCount = d3.max(dataActionDistribution, function(d) { return d.WeightedCount; })
            } else {
                nUpperLimitGoalProbability = d3.max(dataDistributionScale, function(d) { return d.GoalProbability; })                            
                nUpperLimitWeightedExpectedGoals = d3.max(dataDistributionScale, function(d) { return d.WeightedExpectedGoals; })
                nUpperLimitWeightedCount = d3.max(dataDistributionScale, function(d) { return d.WeightedCount; })
            }


            histogramProbabilityTotalScaleGoalProbability = d3.scaleLinear()
                .domain(
                    [
                        0,
                        nUpperLimitGoalProbability * 1.05
                    ]
                )
                .range(
                    [
                        xScale3(pitch.padding.left + pitch.padding.left + pitch.padding.left + pitch.padding.left + pitch.frame.width + pitch.frame.width + pitch.frame.width) + 0, 
                        xScale3(pitch.padding.left + pitch.padding.left + pitch.padding.left + pitch.padding.left + pitch.frame.width + pitch.frame.width + pitch.frame.width) + xScale3( pitch.length )
                    ]
                )
                
            histogramProbabilityTotalScaleWeightedExpectedGoals = d3.scaleLinear()
                .domain(
                    [
                        0,
                        nUpperLimitWeightedExpectedGoals * 1.05
                    ]
                )
                .range(
                    [
                        xScale3(panel3titlespace + pitch.padding.top) + xScale3(pitch.width),
                        xScale3(panel3titlespace + pitch.padding.top)
                    ]
                )

            histogramProbabilityTotalScaleWeightedCount = d3.scaleLinear()
                .domain(
                    [
                        0,
                        nUpperLimitWeightedCount * 1.05
                    ]
                )
                .range(
                    [
                        'white',
                        'red'
                    ]
                )

            
            // Add the y Axis
            svgPanel3.append("g")
                .attr(
                    "transform", 
                    "translate(" + histogramProbabilityTotalScaleGoalProbability.range()[0] + "," + 0 + ")"
                )
                .attr("class", "axiswhite")
                .call(d3.axisLeft(histogramProbabilityTotalScaleWeightedExpectedGoals).ticks(4))
                
                // .call(d3.axisLeft(histogramProbabilityTotalScaleWeightedExpectedGoals));

            // text label for the y axis
            svgPanel3.append("text")
                .attr(
                    "transform", 
                    "translate(" + ( histogramProbabilityTotalScaleGoalProbability.range()[0] - 40 ) + "," + ( histogramProbabilityTotalScaleWeightedExpectedGoals.range()[0] + histogramProbabilityTotalScaleWeightedExpectedGoals.range()[1] ) / 2 + ")rotate(-90)"
                    // "translate(100,100)"
                )
                .style("text-anchor", "middle")
                .attr("fill", "white")
                .attr("font-size", ( 0.9 * nRatioOfScreenSize ) + "em")
                .text("Total xPo generated p90");

            
            // Add the y Axis
            svgPanel3.append("g")
                .attr(
                    "transform", 
                    "translate(" + 0 + "," + histogramProbabilityTotalScaleWeightedExpectedGoals.range()[0] + ")"
                    // "translate(0,100)"
                )
                .attr("class", "axiswhite")
                .call(d3.axisBottom(histogramProbabilityTotalScaleGoalProbability).ticks(4));
                // .call(d3.axisBottom(histogramProbabilityTotalScaleGoalProbability));

            // text label for the x axis
            svgPanel3.append("text")             
                .attr(
                    "transform", 
                    "translate(" + ( ( histogramProbabilityTotalScaleGoalProbability.range()[0] + histogramProbabilityTotalScaleGoalProbability.range()[1] ) / 2 ) + "," + ( histogramProbabilityTotalScaleWeightedExpectedGoals.range()[0] + 35 ) + ")"
                    // "translate(100,100)"
                )
                .style("text-anchor", "middle")
                .attr("fill", "white")
                .attr("font-size", ( 0.9 * nRatioOfScreenSize ) + "em")
                .text("xPo");


            svgPanel3.selectAll()
                .data(dataActionDistribution)
                .enter()
                .append("circle")
                .attr("cx", function(d) { return histogramProbabilityTotalScaleGoalProbability(d.GoalProbability) })
                .attr("cy", function(d) { return histogramProbabilityTotalScaleWeightedExpectedGoals(d.WeightedExpectedGoals) })
                .attr("fill", function(d) { return histogramProbabilityTotalScaleWeightedCount(d.WeightedCount) })
                .attr("stroke", function(d) { return histogramProbabilityTotalScaleWeightedCount(d.WeightedCount) })
                // .attr("stroke", function(d) { console.log(d.WeightedCount);console.log(d.WeightedCount/histogramProbabilityTotalScaleWeightedCount.domain()[1]);console.log(histogramProbabilityTotalScaleWeightedCount(d.WeightedCount) );return histogramProbabilityTotalScaleWeightedCount(d.WeightedCount) })
                .attr("r", '1px' )
                .attr("fill-opacity", 0.5)
                .attr("stroke-opacity", 0.5)
                .attr("fill", function(d) { return histogramProbabilityTotalScaleWeightedCount(d.WeightedCount) })


        }


        updatePanel3HighlightsForDestinationHovers = function (
            plotX,
            plotY,
            cContentPanelId,
            pitchElementOriginPanel3,
            pitchElementOriginCumulativePanel3,
            pitchElementPassPanel3,
            pitchElementPassCumulativePanel3,
            pitchElementRunPanel3,
            pitchElementRunCumulativePanel3,
            xScale,
            yScale,
            Panel3Click
        ) {

            if ( Panel3Click['endX'] == null ) {

                highlightHeatmapCoordinate(
                    pitchElementOriginPanel3,
                    plotX,
                    plotY,
                    xScale,
                    yScale,
                    'highlightDestination'
                )

                highlightHeatmapCoordinate(
                    pitchElementOriginCumulativePanel3,
                    plotX,
                    plotY,
                    xScale,
                    yScale,
                    'highlightDestination'
                )

                highlightHeatmapCoordinate(
                    pitchElementPassPanel3,
                    plotX,
                    plotY,
                    xScale,
                    yScale,
                    'highlightDestination'
                )

                highlightHeatmapCoordinate(
                    pitchElementPassCumulativePanel3,
                    plotX,
                    plotY,
                    xScale,
                    yScale,
                    'highlightDestination'
                )

                highlightHeatmapCoordinate(
                    pitchElementRunPanel3,
                    plotX,
                    plotY,
                    xScale,
                    yScale,
                    'highlightDestination'
                )

                highlightHeatmapCoordinate(
                    pitchElementRunCumulativePanel3,
                    plotX,
                    plotY,
                    xScale,
                    yScale,
                    'highlightDestination'
                )       
                
            }
            
        }

        updatePanel3HighlightsForOriginHovers = function(
            x,
            y,
            pitchElementOriginPanel3,
            pitchElementOriginCumulativePanel3,
            pitchElementShotPanel3,
            pitchElementShotCumulativePanel3,
            pitchElementPassPanel3,
            pitchElementPassCumulativePanel3,
            pitchElementRunPanel3,
            pitchElementRunCumulativePanel3,
            cContentPanelId,
            xScale,
            yScale,
            Panel3Click
        ) {


            highlightHeatmapCoordinate(
                pitchElementOriginPanel3,
                x,
                y,
                xScale,
                yScale,
                'highlightOrigin'
            )

            highlightHeatmapCoordinate(
                pitchElementOriginCumulativePanel3,
                x,
                y,
                xScale,
                yScale,
                'highlightOrigin'
            )

            highlightHeatmapCoordinate(
                pitchElementShotPanel3,
                x,
                y,
                xScale,
                yScale,
                'highlightOrigin'
            )

            highlightHeatmapCoordinate(
                pitchElementShotCumulativePanel3,
                x,
                y,
                xScale,
                yScale,
                'highlightOrigin'
            )

            highlightHeatmapCoordinate(
                pitchElementShotPanel3,
                x,
                y,
                xScale,
                yScale,
                'highlightOrigin'
            )

            highlightHeatmapCoordinate(
                pitchElementShotCumulativePanel3,
                x,
                y,
                xScale,
                yScale,
                'highlightOrigin'
            )


            highlightHeatmapCoordinate(
                pitchElementPassPanel3,
                x,
                y,
                xScale,
                yScale,
                'highlightOrigin'
            )

            highlightHeatmapCoordinate(
                pitchElementRunPanel3,
                x,
                y,
                xScale,
                yScale,
                'highlightOrigin'
            )
            
            highlightHeatmapCoordinate(
                pitchElementPassCumulativePanel3,
                x,
                y,
                xScale,
                yScale,
                'highlightOrigin'
            )
            
            highlightHeatmapCoordinate(
                pitchElementRunCumulativePanel3,
                x,
                y,
                xScale,
                yScale,
                'highlightOrigin'
            )


        }
            

        updatePanel3ForStartClickEndClick = function (
            pitch,
            svgPanel,
            dataAllEvents,            
            eventName,
            x,
            y,
            endX,
            endY,
            PositionsToInclude,
            cPassColour,
            cRunColour,
            cShotColour,
            cDashboardPanelId
        ) {

            // Define the div for the tooltip

            d3.selectAll('.tooltip').remove()
            var divTooltip = d3.select("#" + cDashboardPanelId).append("div")	
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("pointer-events","none");
            
            PanelWidth = pitch.padding.left + pitch.padding.left + pitch.frame.width + pitch.frame.width + pitch.frame.width
            
            var pitchElementPlaysBackground = svgPanel.append('rect')
                .attr('id','pitchElementPlaysBackground')
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', xScale3(panel3titlespace + pitch.frame.length + pitch.frame.length + pitch.frame.length))
                .attr('width', xScale3(PanelWidth))
                .attr('fill', 'black' )
                .style('fill-opacity', 1 )
                
            var pitchElementPlays = svgPanel.append("g")
                .attr('id','pitchElementPlays')
                .attr(
                    "transform", 
                    "translate(" + 
                    ( xScale3( PanelWidth / 2 ) - xScale1(pitch.length/2) ) + "," + 
                    xScale2( pitch.padding.top ) + ")"
                    // xScale2( pitch.padding.left ) + "," + 
                    // xScale2( pitch.padding.top ) + ")"
                )
                

            // addPlotLegend( 
            //     pitchElementShotPanel0,
            //     xScale2,
            //     nBlockWidth,
            //     colorScales['myShotProbabilityColor'],
            //     pitch.length
            // )
            
            addPitchColor(
                pitchElementPlays,
                xScale1
            )
                
            var pitchElementPlaysMarkingsPanel0 = pitchElementPlays
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementPlaysMarkingsPanel0,
                xScale1
            )

            console.log(dataAllEvents)
            console.log(eventName)
            console.log(x)
            console.log(y)
            console.log(endX)
            console.log(endY)

            dataAllEventsSubset = dataAllEvents.filter(
                function(p) {

                    bMeetsCriterion = true

                    bMeetsCriterion = bMeetsCriterion & (
                        p.event == eventName
                    )

                    if ( bMeetsCriterion == true ) {

                        if ( PositionsToInclude.length > 0 ) {

                            bMeetsCriterion = bMeetsCriterion & (
                                PositionsToInclude.indexOf(p.positionName) != -1
                            )

                        }

                    }

                    if ( bMeetsCriterion == true & eventName == 'Run' ) {
                        
                        bMeetsCriterion = bMeetsCriterion & (
                            ( 
                                Math.pow(
                                    Math.pow( ( p.endX - p.x ), 2 ) +
                                    Math.pow( ( p.endY - p.y ), 2 ), 
                                    0.5 
                                )
                            ) >= nRunMinimumLength
                        )

                    }


                    if ( bMeetsCriterion == true &
                        eventName != 'Shot'
                    ) {
                    
                        bMeetsCriterion = bMeetsCriterion & (
                            ( 
                                Math.pow(
                                    Math.pow( ( p.endX - endX ), 2 ) +
                                    Math.pow( ( p.endY - endY ), 2 ), 
                                    0.5 
                                )
                            ) <= nTwoDimSearchRadius 
                        )

                    }

                    if ( 
                        bMeetsCriterion == true
                    ) {

                        bMeetsCriterion = bMeetsCriterion & (
                            ( 
                                Math.pow(
                                    Math.pow( ( p.x - x ), 2 ) +
                                    Math.pow( ( p.y - y ), 2 ), 
                                    0.5
                                )
                            ) <= nTwoDimSearchRadius 
                        )

                    }
                    
                    return bMeetsCriterion
                }
            )

            console.log(dataAllEventsSubset)

            dataAllPlaysSubset = []

            for (var j=0; j<dataAllEventsSubset.length; j++) {

                dataAllPlaysSubset[j] = dataAllEvents.filter(
                    function( d ) {

                        bKeep = true

                        bKeep = bKeep & (
                            d.playId == dataAllEventsSubset[j].playId &
                            d.matchId == dataAllEventsSubset[j].matchId &
                            d.eventSequence >= dataAllEventsSubset[j].eventSequence
                        )

                        return bKeep

                    }
                )

                dataAllPlaysSubset[j].sort(function(x, y){
                    return d3.ascending(x.eventSequence, y.eventSequence);
                })

            }

            dataAllPlaysSubsetPivoted = [[]]

            for (var j=0; j<dataAllPlaysSubset.length; j++) {
            
                for (var i=0; i<dataAllPlaysSubset[j].length; i++) {
                // for (var i=0; i<Math.min(dataAllPlaysSubset[j].length, 5); i++) {

                    if ( dataAllPlaysSubsetPivoted.length < i + 1 ) {
                        dataAllPlaysSubsetPivoted.push([])
                    }

                    dataAllPlaysSubsetPivoted[i].push(
                        dataAllPlaysSubset[j][i]
                    )

                }

            }

            // pitchElement,
            // xHovered,
            // yHovered,
            // eventName,
            // dataGranularDestination,
            // cumulative = false,
            // colorScales,
            // xScale,
            // yScale,
            // dataAllEvents,
            // pitchElementOriginPanel3,
            // pitchElementOriginCumulativePanel3,
            // pitchElementShotPanel3,
            // pitchElementShotCumulativePanel3,
            // pitchElementPassPanel3,
            // pitchElementPassCumulativePanel3,
            // pitchElementRunPanel3,
            // pitchElementRunCumulativePanel3,
            // cContentPanelId,
            // nTwoDimSearchRadius                            

            for (var j=0; j<dataAllPlaysSubsetPivoted.length; j++) {

                pitchElementPlays.selectAll()
                    .data(
                        dataAllPlaysSubsetPivoted[j].filter(
                            function ( d ) {
                                return d.event == 'Pass';
                            }
                        )
                    )
                    .enter()
                    .append('line')
                    .attr("class", 'playdata To' + j )
                    .style("stroke", cPassColour)
                    .style("stroke-width", 2)
                    .style("fill-opacity", function( d ) { return ( GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * +d.MaxPossessionGoalProbabilty ) ) } )
                    .style("stroke-opacity", function( d ) { return ( GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * +d.MaxPossessionGoalProbabilty ) ) } )
                    // .attr("x", function (d) { return xScale1(d.x) })
                    // .attr("y", function (d) { return yScale1(d.y) })
                    // .attr("height", function (d) { return xScale1(d.endX) })
                    // .attr("width", function (d) { return yScale1(d.endY) }); 
                    .attr("x1", function (d) { return xScale1(d.x) })
                    .attr("y1", function (d) { return yScale1(d.y) })
                    .attr("x2", function (d) { return xScale1(d.endX) })
                    .attr("y2", function (d) { return yScale1(d.endY) })
                    .on("mouseover", function(d) {		

                        if ( d3.select(this).style('fill-opacity')  >= GoalProbabilityAlphaWeight ) {

                            divTooltip.transition()		
                                .duration(200)		
                                .style("opacity", .9);		

                            divTooltip
                                .html(
                                    d.matchDetails + '<br>' +
                                    ' ' + 
                                    ((d.period == 1) ? '1st' : '2nd') + ' half, ' + d.minute + ':' + d.second
                                    
                                )	
                                .style("left", (d3.event.pageX ) + "px")		
                                .style("top", (d3.event.pageY - 50) + "px");	

                        }
                    })
                    .on("mouseout", function(d) {

                        if ( d3.select(this).style('fill-opacity') >= GoalProbabilityAlphaWeight ) {
                                    
                            divTooltip.transition()		
                                .duration(500)		
                                .style("opacity", 0);	

                        }
                    })


                pitchElementPlays.selectAll()
                    .data(
                        dataAllPlaysSubsetPivoted[j].filter(
                            function ( d ) {
                                return d.event == 'Run';
                            }
                        )
                    )
                    .enter()
                    .append('line')
                    .attr("class", 'playdata To' + j )
                    .style("stroke", cRunColour)
                    .style("stroke-width", 2)
                    .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                    // .attr("x", function (d) { return xScale1(d.x) })
                    // .attr("y", function (d) { return yScale1(d.y) })
                    // .attr("height", function (d) { return xScale1(d.endX) })
                    // .attr("width", function (d) { return yScale1(d.endY) }); 
                    .attr("x1", function (d) { return xScale1(d.x) })
                    .attr("y1", function (d) { return yScale1(d.y) })
                    .attr("x2", function (d) { return xScale1(d.endX) })
                    .attr("y2", function (d) { return yScale1(d.endY) })
                    .on("mouseover", function(d) {		

                        if ( d3.select(this).style('fill-opacity')  >= GoalProbabilityAlphaWeight ) {

                            divTooltip.transition()		
                                .duration(200)		
                                .style("opacity", .9);		

                            divTooltip
                                .html(
                                    d.matchDetails + '<br>' +
                                    ' ' + 
                                    ((d.period == 1) ? '1st' : '2nd') + ' half, ' + d.minute + ':' + d.second
                                    
                                )	
                                .style("left", (d3.event.pageX ) + "px")		
                                .style("top", (d3.event.pageY - 50) + "px");	

                        }
                    })
                    .on("mouseout", function(d) {

                        if ( d3.select(this).style('fill-opacity') >= GoalProbabilityAlphaWeight ) {
                                    
                            divTooltip.transition()		
                                .duration(500)		
                                .style("opacity", 0);	

                        }
                    })

            

                pitchElementPlays.selectAll()
                    .data(
                        dataAllPlaysSubsetPivoted[j].filter(
                            function ( d ) {
                                return d.event == 'Pass';
                            }
                        )
                    )
                    .enter()
                    .append('circle')
                    .attr("class", 'playdata To' + j )
                    .style("stroke", cPassColour)
                    .style("fill", cPassColour)
                    .style("stroke-width", 1)
                    .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                    .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                    // .style("fill-opacity", 1)
                    // .attr("x", function (d) { return xScale1(d.x) })
                    // .attr("y", function (d) { return yScale1(d.y) })
                    // .attr("height", function (d) { return xScale1(d.endX) })
                    // .attr("width", function (d) { return yScale1(d.endY) }); 
                    .attr("cx", function (d) { return xScale1(d.endX) })
                    .attr("cy", function (d) { return yScale1(d.endY) })
                    .attr('r', xScale1(0.5))
                    .on("mouseover", function(d) {		

                        if ( d3.select(this).style('fill-opacity')  >= GoalProbabilityAlphaWeight ) {

                            divTooltip.transition()		
                                .duration(200)		
                                .style("opacity", .9);		

                            divTooltip
                                .html(
                                    d.matchDetails + '<br>' +
                                    ' ' + 
                                    ((d.period == 1) ? '1st' : '2nd') + ' half, ' + d.minute + ':' + d.second
                                    
                                )	
                                .style("left", (d3.event.pageX ) + "px")		
                                .style("top", (d3.event.pageY - 50) + "px");	

                        }
                    })
                    .on("mouseout", function(d) {

                        if ( d3.select(this).style('fill-opacity') >= GoalProbabilityAlphaWeight ) {
                                    
                            divTooltip.transition()		
                                .duration(500)		
                                .style("opacity", 0);	

                        }
                    })


                pitchElementPlays.selectAll()
                    .data(
                        dataAllPlaysSubsetPivoted[j].filter(
                            function ( d ) {
                                return d.event == 'Run';
                            }
                        )
                    )
                    .enter()
                    .append('circle')
                    .attr("class", 'playdata To' + j )
                    .style("stroke", cRunColour)
                    .style("fill", cRunColour)
                    .style("stroke-width", 1)
                    .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                    .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                    // .style("fill-opacity", 1)
                    // .attr("x", function (d) { return xScale1(d.x) })
                    // .attr("y", function (d) { return yScale1(d.y) })
                    // .attr("height", function (d) { return xScale1(d.endX) })
                    // .attr("width", function (d) { return yScale1(d.endY) }); 
                    .attr("cx", function (d) { return xScale1(d.endX) })
                    .attr("cy", function (d) { return yScale1(d.endY) })
                    .attr('r', xScale1(0.5))
                    .on("mouseover", function(d) {		

                        if ( d3.select(this).style('fill-opacity')  >= GoalProbabilityAlphaWeight ) {

                            divTooltip.transition()		
                                .duration(200)		
                                .style("opacity", .9);		

                            divTooltip
                                .html(
                                    d.matchDetails + '<br>' +
                                    ' ' + 
                                    ((d.period == 1) ? '1st' : '2nd') + ' half, ' + d.minute + ':' + d.second
                                    
                                )	
                                .style("left", (d3.event.pageX ) + "px")		
                                .style("top", (d3.event.pageY - 50) + "px");	

                        }
                    })
                    .on("mouseout", function(d) {

                        if ( d3.select(this).style('fill-opacity') >= GoalProbabilityAlphaWeight ) {
                                    
                            divTooltip.transition()		
                                .duration(500)		
                                .style("opacity", 0);	

                        }
                    })



                pitchElementPlays.selectAll()
                    .data(
                        dataAllPlaysSubsetPivoted[j].filter(
                            function ( d ) {
                                return d.event == 'Shot';
                            }
                        )
                    )
                    .enter()
                    .append('circle')
                    .attr("class", 'playdata To' + j )
                    .style("stroke", cShotColour)
                    .style("fill", cShotColour)
                    .style("stroke-width", 1)
                    .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                    .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                    // .style("fill-opacity", 1)
                    // .attr("x", function (d) { return xScale1(d.x) })
                    // .attr("y", function (d) { return yScale1(d.y) })
                    // .attr("height", function (d) { return xScale1(d.endX) })
                    // .attr("width", function (d) { return yScale1(d.endY) }); 
                    .attr("cx", function (d) { return xScale1(d.x) })
                    .attr("cy", function (d) { return yScale1(d.y) })
                    .attr('r', xScale1(1))
                    .on("mouseover", function(d) {		

                        if ( d3.select(this).style('fill-opacity')  >= GoalProbabilityAlphaWeight ) {

                            divTooltip.transition()		
                                .duration(200)		
                                .style("opacity", .9);		

                            divTooltip
                                .html(
                                    d.matchDetails + '<br>' +
                                    ' ' + 
                                    ((d.period == 1) ? '1st' : '2nd') + ' half, ' + d.minute + ':' + d.second
                                    
                                )	
                                .style("left", (d3.event.pageX ) + "px")		
                                .style("top", (d3.event.pageY - 50) + "px");	

                        }
                    })
                    .on("mouseout", function(d) {

                        if ( d3.select(this).style('fill-opacity') >= GoalProbabilityAlphaWeight ) {
                                    
                            divTooltip.transition()		
                                .duration(500)		
                                .style("opacity", 0);	

                        }
                    })

        
            }


            pitchElementPlays.selectAll('.playdata')
                .style('stroke-opacity', 0)
                .style('fill-opacity', 0)


            pitchElementPlays.selectAll('.playdata.To0')
                .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                .moveToFront()
                

            pitchElementPlays.selectAll('.playdata.To1')
                .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                .moveToFront()
                
            
            nFirstBlockRightSide = 0.1 * nRatioOfScreenSize
            iOptionSpace = 0.02 * nRatioOfScreenSize

            pitchElementPlays
                .append('text')
                .text('Show the next')
                .attr("text-anchor", "start")
                .attr("alignment-baseline", "bottom")
                .attr("fill", "white")
                .attr('x', xScale1( nFirstBlockRightSide ))
                .attr('y', -xScale1(1 * nBlockWidth))
                .attr("font-size", ( 1.2 * nRatioOfScreenSize ) + "em")
            

            pitchElementPlays
                .append('text')
                .text('0')
                .attr("alignment-baseline", "bottom")
                .attr("class", "PlayOptions")
                .attr("text-anchor", "start")
                .attr('y', -xScale1(1 * nBlockWidth))
                .attr('x', xScale1( ( 13 + nFirstBlockRightSide + (1 * iOptionSpace) )))
                .attr("font-size", ( 1.2 * nRatioOfScreenSize ) + "em")
                .attr("fill", "#444444")
                .on('click', function() {

                    d3.selectAll('.PlayOptions').attr("fill", "#444444");
                    d3.select(this).attr("fill", "white");
                    
                    pitchElementPlays.selectAll('.playdata')
                        .style('stroke-opacity', 0)
                        .style('fill-opacity', 0)


                    pitchElementPlays.selectAll('.playdata.To0')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()
                        

                })
                .on("mouseover", function(d) {
                    d3.select(this).style("cursor", "pointer"); 
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("cursor", "default"); 
                })
            

            pitchElementPlays
                .append('text')
                .text('1')
                .attr("alignment-baseline", "bottom")
                .attr("class", "PlayOptions")
                .attr("text-anchor", "middle")
                .attr('y', -xScale1(1 * nBlockWidth))
                .attr('x', xScale1( ( 16 + nFirstBlockRightSide + (1 * iOptionSpace) )))
                .attr("font-size", ( 1.2 * nRatioOfScreenSize ) + "em")
                .attr("fill", "white")
                .on('click', function() {

                    d3.selectAll('.PlayOptions').attr("fill", "#444444");
                    d3.select(this).attr("fill", "white");
                    
                    pitchElementPlays.selectAll('.playdata')
                        .style('stroke-opacity', 0)
                        .style('fill-opacity', 0)


                    pitchElementPlays.selectAll('.playdata.To0')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()
                        

                    pitchElementPlays.selectAll('.playdata.To1')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()
                        
                    
                })
                .on("mouseover", function(d) {
                    d3.select(this).style("cursor", "pointer"); 
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("cursor", "default"); 
                })
            
            

            pitchElementPlays
                .append('text')
                .text('2')
                .attr("alignment-baseline", "bottom")
                .attr("class", "PlayOptions")
                .attr("text-anchor", "middle")
                .attr('y', -xScale1(1 * nBlockWidth))
                .attr('x', xScale1( ( 18 + nFirstBlockRightSide + (1 * iOptionSpace) )))
                .attr("font-size", ( 1.2 * nRatioOfScreenSize ) + "em")
                .attr("fill", "#444444")
                .on('click', function() {

                    d3.selectAll('.PlayOptions').attr("fill", "#444444");
                    d3.select(this).attr("fill", "white");
                    
                    pitchElementPlays.selectAll('.playdata')
                        .style('stroke-opacity', 0)
                        .style('fill-opacity', 0)


                    pitchElementPlays.selectAll('.playdata.To0')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()
                        

                    pitchElementPlays.selectAll('.playdata.To1')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()
                        

                    pitchElementPlays.selectAll('.playdata.To2')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()

                })
                .on("mouseover", function(d) {
                    d3.select(this).style("cursor", "pointer"); 
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("cursor", "default"); 
                })
            
            

            pitchElementPlays
                .append('text')
                .text('3')
                .attr("alignment-baseline", "bottom")
                .attr("class", "PlayOptions")
                .attr("text-anchor", "middle")
                .attr('y', -xScale1(1 * nBlockWidth))
                .attr('x', xScale1( ( 20 + nFirstBlockRightSide + (1 * iOptionSpace) )))
                .attr("font-size", ( 1.2 * nRatioOfScreenSize ) + "em")
                .attr("fill", "#444444")
                .on('click', function() {

                    d3.selectAll('.PlayOptions').attr("fill", "#444444");
                    d3.select(this).attr("fill", "white");

                    pitchElementPlays.selectAll('.playdata')
                        .style('stroke-opacity', 0)
                        .style('fill-opacity', 0)


                    pitchElementPlays.selectAll('.playdata.To0')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()
                        

                    pitchElementPlays.selectAll('.playdata.To1')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()
                        

                    pitchElementPlays.selectAll('.playdata.To2')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()

                    pitchElementPlays.selectAll('.playdata.To3')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()

                })
                .on("mouseover", function(d) {
                    d3.select(this).style("cursor", "pointer"); 
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("cursor", "default"); 
                })
            
            

            pitchElementPlays
                .append('text')
                .text('4')
                .attr("alignment-baseline", "bottom")
                .attr("class", "PlayOptions")
                .attr("text-anchor", "middle")
                .attr('y', -xScale1(1 * nBlockWidth))
                .attr('x', xScale1( ( 22 + nFirstBlockRightSide + (1 * iOptionSpace) )))
                .attr("font-size", ( 1.2 * nRatioOfScreenSize ) + "em")
                .attr("fill", "#444444")
                .on('click', function() {

                    d3.selectAll('.PlayOptions').attr("fill", "#444444");
                    d3.select(this).attr("fill", "white");
                    
                    pitchElementPlays.selectAll('.playdata')
                        .style('stroke-opacity', 0)
                        .style('fill-opacity', 0)


                    pitchElementPlays.selectAll('.playdata.To0')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()
                        

                    pitchElementPlays.selectAll('.playdata.To1')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()

                    pitchElementPlays.selectAll('.playdata.To2')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()

                    pitchElementPlays.selectAll('.playdata.To3')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()

                    pitchElementPlays.selectAll('.playdata.To4')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()
                        
                })
                .on("mouseover", function(d) {
                    d3.select(this).style("cursor", "pointer"); 
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("cursor", "default"); 
                })
            
            
            pitchElementPlays
                .append('text')
                .text('all')
                .attr("class", "PlayOptions")
                .attr("alignment-baseline", "bottom")
                .attr("text-anchor", "middle")
                .attr('y', -xScale1(1 * nBlockWidth))
                .attr('x', xScale1( ( 25 + nFirstBlockRightSide + (1 * iOptionSpace) )))
                .attr("font-size", ( 1.2 * nRatioOfScreenSize ) + "em")
                .attr("fill", "#444444")
                .on('click', function() {

                    d3.selectAll('.PlayOptions').attr("fill", "#444444");
                    d3.select(this).attr("fill", "white");

                    pitchElementPlays.selectAll('.playdata')
                        .style("stroke-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .style("fill-opacity", function( d ) { return GoalProbabilityAlphaWeight + ( ( 1 - GoalProbabilityAlphaWeight ) * d.MaxPossessionGoalProbabilty ) } )
                        .moveToFront()
                        
                })
                .on("mouseover", function(d) {
                    d3.select(this).style("cursor", "pointer"); 
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("cursor", "default"); 
                })
            
            pitchElementPlays
                .append('text')
                .text(' events by the team in possession')
                .attr("alignment-baseline", "bottom")
                .attr("text-anchor", "start")
                .attr("fill", "white")
                // .attr('x', xScale1(pitch.frame.length * (nFirstBlockRightSide + (7 * iOptionSpace))))
                .attr('x', xScale1( ( 27 + nFirstBlockRightSide + (1 * iOptionSpace) )))
                .attr("font-size", ( 1.2 * nRatioOfScreenSize ) + "em")
                .attr('y', -xScale1(1 * nBlockWidth))


            pitchElementPlays
                .append('text')
                .text('Pass')
                .attr("fill", cPassColour)
                .attr("alignment-baseline", "hanging")
                .attr("text-anchor", "end")
                .attr("font-size", ( 1.2 * nRatioOfScreenSize ) + "em")
                .attr('x', xScale1(0.5 * pitch.length))
                .attr('y', xScale1( pitch.width + ( 1 * nBlockWidth ) ) )
            

            pitchElementPlays
                .append('text')
                .text('Shot')
                .attr("fill", "#666666")
                .attr("alignment-baseline", "hanging")
                .attr("text-anchor", "end")
                .attr("font-size", ( 1.2 * nRatioOfScreenSize ) + "em")
                .attr('x', xScale1(0.55 * pitch.length))
                .attr('y', xScale1( pitch.width + ( 1 * nBlockWidth ) ) )
            
            
            pitchElementPlays
                .append('text')
                .text('Run')
                .attr("fill", cRunColour)
                .attr("alignment-baseline", "hanging")
                .attr("text-anchor", "end")
                .attr("font-size", ( 1.2 * nRatioOfScreenSize ) + "em")
                .attr('x', xScale1(0.6 * pitch.length))
                .attr('y', xScale1( pitch.width + ( 1 * nBlockWidth ) ) )
            

            pitchElementPlays
                .append('text')
                .text('Opacity indicates max xG generated in that possesion')
                .attr("fill", '#999999')
                .attr("alignment-baseline", "hanging")
                .attr("text-anchor", "end")
                .attr("font-size", ( 1.2 * nRatioOfScreenSize ) + "em")
                .attr('x', xScale1(pitch.length))
                .attr('y', xScale1( pitch.width + ( 1 * nBlockWidth ) ) )
            

            pitchElementPlays
                .append('text')
                .text('Close')
                .attr("alignment-baseline", "bottom")
                .attr("text-anchor", "end")
                .attr('x', xScale1(pitch.length))
                .attr('y', -xScale1(1 * nBlockWidth))
                .attr('fill','white')
                .attr("font-size", ( 0.9 * nRatioOfScreenSize ) + "em")
                .on('click', function() {
                    pitchElementPlays.remove();
                    pitchElementPlaysBackground.remove();
                    Panel3Click['PlayPanelOpen'] = false
                })
                .on("mouseover", function(d) {
                    d3.select(this).style("cursor", "pointer"); 
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("cursor", "default"); 
                })

        }
        

        updatePanel3ForEndHover = function(
            setCode,
            endX,
            endY,
            pitchElementOriginPanel3,
            pitchElementOriginCumulativePanel3,
            pitchElementShotPanel3,
            pitchElementShotCumulativePanel3,
            pitchElementPassPanel3,
            pitchElementPassCumulativePanel3,
            pitchElementRunPanel3,
            pitchElementRunCumulativePanel3,
            colorScales,
            cContentPanelId,
            xScale,
            yScale,
            dataAllEvents,
            nTwoDimSearchRadius,
            nOneDimSearchRadius,
            dataOriginProbabilitiesFor,
            dataOriginProbabilitiesShotFor,
            dataOriginProbabilitiesPassFor,
            dataOriginProbabilitiesRunFor,
            svgPanel,
            PositionsToInclude,
            histogramProbabilityTotalScaleGoalProbability, 
            histogramProbabilityTotalScaleWeightedExpectedGoals
        ) {
            
            d3.csv(
                './Data/' + setCode.replace(/_/g,'/') + "/DataGranular/x" + x + "_y" + y + "/AsOrigin.csv").then(
                function( dataGranularOrigin ) {

                    dataGranularOrigin.forEach(
                        function(d){ 
                            d['x'] = +d['x']; 
                            d['y'] = +d['y']; 
                            d['endX'] = +d['endX']; 
                            d['endY'] = +d['endY']; 
                            d['Count'] = +d['Count']; 
                            d['WeightedCount'] = +d['WeightedCount']; 
                            d['Goals'] = +d['Goals']; 
                            d['WeightedExpectedGoals'] = +d['WeightedExpectedGoals']; 
                            d['GoalProbability'] = +d['GoalProbability']; 
                        }
                    );   
                    
                    updateDestinationHeatmap(
                        pitchElementOriginPanel3,
                        'pitchElementOriginPanel3',
                        endX,
                        endY,
                        'Pass',
                        dataGranularOrigin,
                        cumulative = false,
                        colorScales,
                        xScale,
                        yScale,
                        dataAllEvents,
                        pitchElementOriginPanel3,
                        pitchElementOriginCumulativePanel3,
                        pitchElementShotPanel3,
                        pitchElementShotCumulativePanel3,
                        pitchElementPassPanel3,
                        pitchElementPassCumulativePanel3,
                        pitchElementRunPanel3,
                        pitchElementRunCumulativePanel3,
                        cContentPanelId,
                        nTwoDimSearchRadius,
                        svgPanel,
                        PositionsToInclude
                    )
                    pitchElementOriginPanel3.selectAll('.pitchMarkings').moveToFront();
                    pitchElementOriginPanel3.selectAll('.highlightOrigin').moveToFront();
                    pitchElementOriginPanel3.selectAll('.highlightDestination').moveToFront();
// 
                    updateDestinationHeatmap(
                        pitchElementOriginCumulativePanel3,
                        'pitchElementOriginCumulativePanel3',
                        endX,
                        endY,
                        'Run',
                        dataGranularOrigin,
                        cumulative = false,
                        colorScales,
                        xScale,
                        yScale,
                        dataAllEvents,
                        pitchElementOriginPanel3,
                        pitchElementOriginCumulativePanel3,
                        pitchElementShotPanel3,
                        pitchElementShotCumulativePanel3,
                        pitchElementPassPanel3,
                        pitchElementPassCumulativePanel3,
                        pitchElementRunPanel3,
                        pitchElementRunCumulativePanel3,
                        cContentPanelId,
                        nTwoDimSearchRadius,
                        svgPanel,
                        PositionsToInclude
                    )
                    pitchElementOriginCumulativePanel3.selectAll('.pitchMarkings').moveToFront();
                    pitchElementOriginCumulativePanel3.selectAll('.highlightOrigin').moveToFront();
                    pitchElementOriginCumulativePanel3.selectAll('.highlightDestination').moveToFront();

                    
                    svgPanel.selectAll('.histogramindicators').remove()
                    svgPanel.selectAll('.histogramindicatorsshot').remove()

                    svgPanel.selectAll()
                        .data(dataGranularOrigin)
                        .enter()
                        .append("circle")
                        .attr(
                            "class", 
                            function(d) { 
                                return "histogramindicators " + 
                                d.event + 
                                ' x' + d.x + "_y" + d.y + 
                                ' endX' + d.endX + "_endY" + d.endY
                            }
                        )
                        .attr("cx", function(d) { return histogramProbabilityTotalScaleGoalProbability(d.GoalProbability) })
                        .attr("cy", function(d) { return histogramProbabilityTotalScaleWeightedExpectedGoals(d.WeightedExpectedGoals) })
                        // .attr("fill", function(d) { return histogramProbabilityTotalScaleWeightedCount(d.WeightedCount) })
                        .attr("stroke", 'white')
                        .attr("fill", 'white')
                        .attr("stroke-opacity", 0)
                        .attr("stroke-width", 0)
                        .attr("r", 2 )

                    svgPanel.selectAll()
                        .data(
                            dataGranularOrigin.filter(
                                function(d) {
                                    return d.event == 'Shot';
                                }
                            )
                        )
                        .enter()
                        .append("circle")                        
                        .attr(
                            "class", 
                            function(d) { 
                                return "histogramindicatorsshot " + 
                                d.event + 
                                ' x' + d.x + "_y" + d.y +
                                ''
                            }
                        )
                        .attr("cx", function(d) { return histogramProbabilityTotalScaleGoalProbability(d.GoalProbability) })
                        .attr("cy", function(d) { return histogramProbabilityTotalScaleWeightedExpectedGoals(d.WeightedExpectedGoals) })
                        // .attr("fill", function(d) { return histogramProbabilityTotalScaleWeightedCount(d.WeightedCount) })
                        .attr("stroke", 'white')
                        .attr("stroke-opacity", 1)
                        .attr("stroke-width", 1)
                        .attr("fill", 'white')
                        .attr("r", 8 )

                    svgPanel.selectAll()
                        .data(
                            dataGranularOrigin.filter(
                                function(d) {
                                    return d.event == 'Shot';
                                }
                            )
                        )
                        .enter()
                        .append('text')
                        .attr(
                            "class", 
                            function(d) { 
                                return "histogramindicatorsshot " + 
                                d.event + 
                                ' x' + d.x + "_y" + d.y +
                                ''
                            }
                        )
                        .attr("x", function(d) { return histogramProbabilityTotalScaleGoalProbability(d.GoalProbability) })
                        .attr("y", function(d) { return histogramProbabilityTotalScaleWeightedExpectedGoals(d.WeightedExpectedGoals) })
                        .text('s')
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "central")
                        .attr("fill", "white")


                    hideBaseOriginData (
                        pitchElementOriginPanel3,
                        pitchElementOriginCumulativePanel3
                    )
                    
                }
            )
            
        

        }


        updatePanel3ForOriginHover = async function(
            setCode,
            x,
            y,
            pitchElementOriginPanel3,
            pitchElementOriginCumulativePanel3,
            pitchElementShotPanel3,
            pitchElementShotCumulativePanel3,
            pitchElementPassPanel3,
            pitchElementPassCumulativePanel3,
            pitchElementRunPanel3,
            pitchElementRunCumulativePanel3,
            colorScales,
            cContentPanelId,
            xScale,
            yScale,
            dataAllEvents,
            nTwoDimSearchRadius,
            nOneDimSearchRadius,
            dataOriginProbabilitiesFor,
            dataOriginProbabilitiesShotFor,
            dataOriginProbabilitiesPassFor,
            dataOriginProbabilitiesRunFor,
            svgPanel,
            PositionsToInclude,
            histogramProbabilityTotalScaleGoalProbability, 
            histogramProbabilityTotalScaleWeightedExpectedGoals
        ) {
            
            d3.select("#" + cContentPanelId)
                .select('#ScenarioText')
                .text(null)

            // when updated from the secnario drop down, that's taken care
            // of in the drop down's change function itself
            d3.select("#" + cContentPanelId)
                .select('#ScenarioSelection')
                .selectAll("option")
                .property(
                    "selected", 
                    function(d){ 
                        
                        return d === '--No Scenario--'; 

                    }
                )

            qwe = await d3.csv(
                './Data/' + setCode.replace(/_/g,'/') + "/DataGranular/x" + x + "_y" + y + "/AsOrigin.csv").then(
                function(dataGranularDestination) {

                    dataGranularDestination.forEach(
                        function(d){ 
                            d['x'] = +d['x']; 
                            d['y'] = +d['y']; 
                            d['endX'] = +d['endX']; 
                            d['endY'] = +d['endY']; 
                            d['Count'] = +d['Count']; 
                            d['WeightedCount'] = +d['WeightedCount']; 
                            d['Goals'] = +d['Goals']; 
                            d['WeightedExpectedGoals'] = +d['WeightedExpectedGoals']; 
                            d['GoalProbability'] = +d['GoalProbability']; 
                        }
                    );   
                    
                    updateDestinationHeatmap(
                        pitchElementPassPanel3,
                        'pitchElementPassPanel3',
                        x,
                        y,
                        'Pass',
                        dataGranularDestination,
                        cumulative = false,
                        colorScales,
                        xScale,
                        yScale,
                        dataAllEvents,
                        pitchElementOriginPanel3,
                        pitchElementOriginCumulativePanel3,
                        pitchElementShotPanel3,
                        pitchElementShotCumulativePanel3,
                        pitchElementPassPanel3,
                        pitchElementPassCumulativePanel3,
                        pitchElementRunPanel3,
                        pitchElementRunCumulativePanel3,
                        cContentPanelId,
                        nTwoDimSearchRadius,
                        svgPanel,
                        PositionsToInclude
                    )
                    pitchElementPassPanel3.selectAll('.pitchMarkings').moveToFront();
                    pitchElementPassPanel3.selectAll('.highlightOrigin').moveToFront();
                    pitchElementPassPanel3.selectAll('.highlightDestination').moveToFront();
// 
                    updateDestinationHeatmap(
                        pitchElementRunPanel3,
                        'pitchElementRunPanel3',
                        x,
                        y,
                        'Run',
                        dataGranularDestination,
                        cumulative = false,
                        colorScales,
                        xScale,
                        yScale,
                        dataAllEvents,
                        pitchElementOriginPanel3,
                        pitchElementOriginCumulativePanel3,
                        pitchElementShotPanel3,
                        pitchElementShotCumulativePanel3,
                        pitchElementPassPanel3,
                        pitchElementPassCumulativePanel3,
                        pitchElementRunPanel3,
                        pitchElementRunCumulativePanel3,
                        cContentPanelId,
                        nTwoDimSearchRadius,
                        svgPanel,
                        PositionsToInclude
                    )
                    pitchElementRunPanel3.selectAll('.pitchMarkings').moveToFront();
                    pitchElementRunPanel3.selectAll('.highlightOrigin').moveToFront();
                    pitchElementRunPanel3.selectAll('.highlightDestination').moveToFront();

                    updateDestinationHeatmap(
                        pitchElementPassCumulativePanel3,
                        'pitchElementPassCumulativePanel3',
                        x,
                        y,
                        'Pass',
                        dataGranularDestination,
                        cumulative = true,
                        colorScales,
                        xScale,
                        yScale,
                        dataAllEvents,
                        pitchElementOriginPanel3,
                        pitchElementOriginCumulativePanel3,
                        pitchElementShotPanel3,
                        pitchElementShotCumulativePanel3,
                        pitchElementPassPanel3,
                        pitchElementPassCumulativePanel3,
                        pitchElementRunPanel3,
                        pitchElementRunCumulativePanel3,
                        cContentPanelId,
                        nTwoDimSearchRadius,
                        svgPanel,
                        PositionsToInclude
                    )
                    pitchElementPassCumulativePanel3.selectAll('.pitchMarkings').moveToFront();
                    pitchElementPassCumulativePanel3.selectAll('.highlightOrigin').moveToFront();
                    pitchElementPassCumulativePanel3.selectAll('.highlightDestination').moveToFront();
                    
                    updateDestinationHeatmap(
                        pitchElementRunCumulativePanel3,
                        'pitchElementRunCumulativePanel3',
                        x,
                        y,
                        'Run',
                        dataGranularDestination,
                        cumulative = true,
                        colorScales,
                        xScale,
                        yScale,
                        dataAllEvents,
                        pitchElementOriginPanel3,
                        pitchElementOriginCumulativePanel3,
                        pitchElementShotPanel3,
                        pitchElementShotCumulativePanel3,
                        pitchElementPassPanel3,
                        pitchElementPassCumulativePanel3,
                        pitchElementRunPanel3,
                        pitchElementRunCumulativePanel3,
                        cContentPanelId,
                        nTwoDimSearchRadius,
                        svgPanel,
                        PositionsToInclude
                    )
                    pitchElementRunCumulativePanel3.selectAll('.pitchMarkings').moveToFront();
                    pitchElementRunCumulativePanel3.selectAll('.highlightOrigin').moveToFront();
                    pitchElementRunCumulativePanel3.selectAll('.highlightDestination').moveToFront();

                    
                    svgPanel.selectAll('.histogramindicators').remove()
                    svgPanel.selectAll('.histogramindicatorsshot').remove()

                    svgPanel.selectAll()
                        .data(dataGranularDestination)
                        .enter()
                        .append("circle")                        
                        .attr(
                            "class", 
                            function(d) { 
                                return "histogramindicators " + 
                                d.event + 
                                ' x' + d.x + "_y" + d.y + 
                                ' endX' + d.endX + "_endY" + d.endY +
                                ''
                            }
                        )
                        .attr("cx", function(d) { return histogramProbabilityTotalScaleGoalProbability(d.GoalProbability) })
                        .attr("cy", function(d) { return histogramProbabilityTotalScaleWeightedExpectedGoals(d.WeightedExpectedGoals) })
                        // .attr("fill", function(d) { return histogramProbabilityTotalScaleWeightedCount(d.WeightedCount) })
                        .attr("stroke", 'white')
                        .attr("fill", 'white')
                        .attr("stroke-opacity", 0)
                        .attr("stroke-width", 0)
                        .attr("r", 2 )

                    svgPanel.selectAll()
                        .data(
                            dataGranularDestination.filter(
                                function(d) {
                                    return d.event == 'Shot';
                                }
                            )
                        )
                        .enter()
                        .append("circle")                        
                        .attr(
                            "class", 
                            function(d) { 
                                return "histogramindicatorsshot " + 
                                d.event + 
                                ' x' + d.x + "_y" + d.y +
                                ''
                            }
                        )
                        .attr("cx", function(d) { return histogramProbabilityTotalScaleGoalProbability(d.GoalProbability) })
                        .attr("cy", function(d) { return histogramProbabilityTotalScaleWeightedExpectedGoals(d.WeightedExpectedGoals) })
                        // .attr("fill", function(d) { return histogramProbabilityTotalScaleWeightedCount(d.WeightedCount) })
                        .attr("stroke", 'white')
                        .attr("stroke-opacity", 1)
                        .attr("stroke-width", 1)
                        .attr("fill", 'black')
                        .attr("r", 8 )

                    svgPanel.selectAll()
                        .data(
                            dataGranularDestination.filter(
                                function(d) {
                                    return d.event == 'Shot';
                                }
                            )
                        )
                        .enter()
                        .append('text')
                                                
                        .attr(
                            "class", 
                            function(d) { 
                                return "histogramindicatorsshot " + 
                                d.event + 
                                ' x' + d.x + "_y" + d.y +
                                ''
                            }
                        )
                        .attr("x", function(d) { return histogramProbabilityTotalScaleGoalProbability(d.GoalProbability) })
                        .attr("y", function(d) { return histogramProbabilityTotalScaleWeightedExpectedGoals(d.WeightedExpectedGoals) })
                        .text('s')
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "central")
                        .attr("fill", "white")


                    hideBaseDestinationData (
                        pitchElementPassPanel3,
                        pitchElementPassCumulativePanel3,
                        pitchElementRunPanel3,
                        pitchElementRunCumulativePanel3,
                    )

                    return null
                    
                }
            )

            return qwe            
        

        }


        updatePanel3ForDestinationHover = function(
            setCode,
            x,
            y,
            eventName,
            pitchElementOriginPanel3,
            pitchElementOriginCumulativePanel3,
            pitchElementShotPanel3,
            pitchElementShotCumulativePanel3,
            pitchElementPassPanel3,
            pitchElementPassCumulativePanel3,
            pitchElementRunPanel3,
            pitchElementRunCumulativePanel3,
            colorScales,
            cContentPanelId,
            xScale,
            yScale,
            dataAllEvents,
            svgPanel,
            PositionsToInclude,
            histogramProbabilityTotalScaleGoalProbability, 
            histogramProbabilityTotalScaleWeightedExpectedGoals
        ) {
            

            d3.csv(
                './Data/' + setCode.replace(/_/g,'/') + "/DataGranular/x" + x + "_y" + y + "/AsDestination.csv"
            ).then( 
                function(dataGranularOrigin) {

                    dataGranularOrigin.forEach(
                        function(d){ 
                            d['x'] = +d['x']; 
                            d['y'] = +d['y']; 
                            d['endX'] = +d['endX']; 
                            d['endY'] = +d['endY']; 
                            d['Count'] = +d['Count']; 
                            d['WeightedCount'] = +d['WeightedCount']; 
                            d['Goals'] = +d['Goals']; 
                            d['WeightedExpectedGoals'] = +d['WeightedExpectedGoals']; 
                            d['GoalProbability'] = +d['GoalProbability']; 
                        }
                    );

                    updateOriginHeatmap (
                        pitchElementOriginPanel3,
                        'pitchElementOriginPanel3',
                        eventName,
                        dataGranularOrigin,
                        cumulative = false,
                        colorScales,
                        xScale,
                        yScale,
                        dataAllEvents,
                        pitchElementOriginPanel3,
                        pitchElementOriginCumulativePanel3,
                        pitchElementShotPanel3,
                        pitchElementShotCumulativePanel3,
                        pitchElementPassPanel3,
                        pitchElementPassCumulativePanel3,
                        pitchElementRunPanel3,
                        pitchElementRunCumulativePanel3,
                        cContentPanelId,
                        svgPanel,
                        PositionsToInclude
                    )

                    pitchElementOriginPanel3.selectAll('.pitchMarkings').moveToFront();
                    pitchElementOriginPanel3.selectAll('.highlightOrigin').moveToFront();
                    pitchElementOriginPanel3.selectAll('.highlightDestination').moveToFront();

                    updateOriginHeatmap (
                        pitchElementOriginCumulativePanel3,
                        'pitchElementOriginCumulativePanel3',
                        eventName,
                        dataGranularOrigin,
                        cumulative = true,
                        colorScales,
                        xScale,
                        yScale,
                        dataAllEvents,
                        pitchElementOriginPanel3,
                        pitchElementOriginCumulativePanel3,
                        pitchElementShotPanel3,
                        pitchElementShotCumulativePanel3,
                        pitchElementPassPanel3,
                        pitchElementPassCumulativePanel3,
                        pitchElementRunPanel3,
                        pitchElementRunCumulativePanel3,
                        cContentPanelId,
                        svgPanel,
                        PositionsToInclude
                    )

                    pitchElementOriginCumulativePanel3.selectAll('.pitchMarkings').moveToFront();
                    pitchElementOriginCumulativePanel3.selectAll('.highlightOrigin').moveToFront();
                    pitchElementOriginCumulativePanel3.selectAll('.highlightDestination').moveToFront();
                    
                    svgPanel.selectAll('.histogramindicators').remove()
                    svgPanel.selectAll('.histogramindicatorsshot').remove()

                    svgPanel.selectAll()
                        .data(
                            dataGranularOrigin.filter(
                                function( d ) {
                                    return d.event == eventName;
                                }
                            )
                        )
                        .enter()
                        .append("circle")
                        // .attr("class", function(d) { return "histogramindicators " + d.event + d.endX + "_" + d.endY } )
                        .attr(
                            'class',
                            function(d) {
                                return "histogramindicators " + 
                                Panel3Click['event'] + 
                                ' x' + d.x + "_y" + d.y +
                                ' endX' + d.endX + "_endY" + d.endY +
                                ''
                            }
                            // 'qweqwe'
                        )
                        .attr("cx", function(d) { return histogramProbabilityTotalScaleGoalProbability(d.GoalProbability) })
                        .attr("cy", function(d) { return histogramProbabilityTotalScaleWeightedExpectedGoals(d.WeightedExpectedGoals) })
                        // .attr("fill", function(d) { return histogramProbabilityTotalScaleWeightedCount(d.WeightedCount) })
                        .attr("stroke", 'white')
                        .attr("fill", 'white')
                        .attr("stroke-opacity", 0)
                        .attr("stroke-width", 0)
                        .attr("r", 2 )

                    svgPanel.selectAll()
                        .data(
                            dataGranularOrigin.filter(
                                function(d) {
                                    return d.event == 'Shot';
                                }
                            )
                        )
                        .enter()
                        .append("circle")
                        .attr(
                            'class',
                            function(d) {
                                return "histogramindicatorsshot " + 
                                d.event + 
                                ' x' + d.x + "_y" + d.y +
                                ''
                            }
                        )
                        .attr("cx", function(d) { return histogramProbabilityTotalScaleGoalProbability(d.GoalProbability) })
                        .attr("cy", function(d) { return histogramProbabilityTotalScaleWeightedExpectedGoals(d.WeightedExpectedGoals) })
                        // .attr("fill", function(d) { return histogramProbabilityTotalScaleWeightedCount(d.WeightedCount) })
                        .attr("stroke", 'white')
                        .attr("stroke-opacity", 1)
                        .attr("stroke-width", 1)
                        .attr("fill", 'black')
                        .attr("r", 8 )

                    svgPanel.selectAll()
                        .data(
                            dataGranularOrigin.filter(
                                function(d) {
                                    return d.event == 'Shot';
                                }
                            )
                        )
                        .enter()
                        .append('text')
                        .attr(
                            'class',
                            function(d) {
                                return "histogramindicatorsshot " + 
                                d.event + 
                                ' x' + d.x + "_y" + d.y +
                                ''
                            }
                        )
                        .attr("x", function(d) { return histogramProbabilityTotalScaleGoalProbability(d.GoalProbability) })
                        .attr("y", function(d) { return histogramProbabilityTotalScaleWeightedExpectedGoals(d.WeightedExpectedGoals) })
                        .text('s')
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "central")
                        .attr("fill", "white")


                    hideBaseOriginData (
                        pitchElementOriginPanel3,
                        pitchElementOriginCumulativePanel3
                    )
                    
                }
            )
            
        

        }


        fDrawEventDestination = function (
            pitchElement,
            pitchElementName,
            xScale3,
            nBlockWidth,
            selectedSetName,
            cContentPanelId,
            PlottingWhichCoordinate,
            ClassName,
            PlottingWhat,
            colorScales,
            WhichColorScale,
            EventName,
            dataDestinationProbabilities,
            pitchElementOriginPanel3,
            pitchElementOriginCumulativePanel3,
            pitchElementShotPanel3,
            pitchElementShotCumulativePanel3,
            pitchElementPassPanel3,
            pitchElementPassCumulativePanel3,
            pitchElementRunPanel3,
            pitchElementRunCumulativePanel3,
            setCode,
            dataAllEvents,
            svgPanel,
            titleText,
            dataOriginProbabilitiesFor,
            dataOriginProbabilitiesShotFor,
            dataOriginProbabilitiesPassFor,
            dataOriginProbabilitiesRunFor
        ) {

            addPlotTitle(
                pitchElement,
                titleText,
                xScale3,
                nBlockWidth,
                null,
                cContentPanelId
            )


            addPitchColor(
                pitchElement,
                xScale3
            )

            var pitchElementMarkingsPanel3 = pitchElement
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementMarkingsPanel3,
                xScale3
            )

            addPitchData(
                pitchElement,
                dataDestinationProbabilities,
                PlottingWhichCoordinate,
                ClassName,
                xScale3,
                yScale3,
                nBlockWidth,
                colorScales[WhichColorScale],
                PlottingWhat
            )

            pitchElement.selectAll('.' + ClassName)
                .on('mouseout', function ( d ) {
                    
                    clearTimeout(mouseHoverTimeout[pitchElementName]);
                    mouseHoverTimeout[pitchElementName] = null
                    
                    if ( Panel3Click['endX'] == null ) {
                    
                        if ( Panel3Click['x'] == null ) {
                            
                            svgPanel.selectAll(".histogramindicators").remove()
                            svgPanel.selectAll(".histogramindicatorsshot").remove()

                        }

                            
                        mouseHoverTimeout[pitchElementName] = setTimeout(
                            function () {

                                restoreBaseOriginData(
                                    pitchElementOriginPanel3,
                                    pitchElementOriginCumulativePanel3
                                )

                                unhighlightHeatmapCoordinate(
                                    pitchElementOriginPanel3,
                                    'highlightDestination'
                                )

                                unhighlightHeatmapCoordinate(
                                    pitchElementOriginCumulativePanel3,
                                    'highlightDestination'
                                )
                                            
                                unhighlightHeatmapCoordinate(
                                    pitchElementPassPanel3,
                                    'highlightDestination'
                                )

                                unhighlightHeatmapCoordinate(
                                    pitchElementPassCumulativePanel3,
                                    'highlightDestination'
                                )

                                unhighlightHeatmapCoordinate(
                                    pitchElementRunPanel3,
                                    'highlightDestination'
                                )

                                unhighlightHeatmapCoordinate(
                                    pitchElementRunCumulativePanel3,
                                    'highlightDestination'
                                )

                                
                            },
                            mouseHoverTimeoutValue
                        )
                    }

                })
                .on('mouseover', function ( d ) {                    

                    clearTimeout(mouseHoverTimeout[pitchElementName]);
                    mouseHoverTimeout[pitchElementName] = null

                    if ( Panel3Click['endX'] == null ) {

                        updatePanel3HighlightsForDestinationHovers(
                            d.endX,
                            d.endY,
                            cContentPanelId,
                            pitchElementOriginPanel3,
                            pitchElementOriginCumulativePanel3,
                            pitchElementPassPanel3,
                            pitchElementPassCumulativePanel3,
                            pitchElementRunPanel3,
                            pitchElementRunCumulativePanel3,
                            xScale3,
                            yScale3,
                            svgPanel
                        )
                    

                        mouseHoverTimeout[pitchElementName] = setTimeout(
                            function() {

                                 if ( Panel3Click['x'] == null ) {

                                    updatePanel3ForDestinationHover(
                                        setCode,
                                        d.endX,
                                        d.endY,
                                        EventName,
                                        pitchElementOriginPanel3,
                                        pitchElementOriginCumulativePanel3,
                                        pitchElementShotPanel3,
                                        pitchElementShotCumulativePanel3,
                                        pitchElementPassPanel3,
                                        pitchElementPassCumulativePanel3,
                                        pitchElementRunPanel3,
                                        pitchElementRunCumulativePanel3,
                                        colorScales,
                                        cContentPanelId,
                                        xScale3,
                                        yScale3,
                                        dataAllEvents,
                                        svgPanel,
                                        PositionsToInclude,
                                        histogramProbabilityTotalScaleGoalProbability, 
                                        histogramProbabilityTotalScaleWeightedExpectedGoals
                                    )

                                } else {


                                }
                                

                            },
                            mouseHoverTimeoutValue
                        )
                    }


                })
                .on('click', function ( d ) {
                    
                    clearTimeout(dblclickTimeout[pitchElementName]);
                    clearTimeout(mouseHoverTimeout[pitchElementName]);
                    dblclickTimeout[pitchElementName] = null                    
                    mouseHoverTimeout[pitchElementName] = null

                    Panel3Click['endX'] = d.endX
                    Panel3Click['endY'] = d.endY
                    Panel3Click['event'] = EventName

                    updatePanel3HighlightsForDestinationHovers(
                        d.endX,
                        d.endY,
                        cContentPanelId,
                        pitchElementOriginPanel3,
                        pitchElementOriginCumulativePanel3,
                        pitchElementPassPanel3,
                        pitchElementPassCumulativePanel3,
                        pitchElementRunPanel3,
                        pitchElementRunCumulativePanel3,
                        xScale3,
                        yScale3,
                        svgPanel
                    )                    

                    dblclickTimeout[pitchElementName] = setTimeout(
                        function() {

                            d3.selectAll('.highlightDestination')
                                .style(
                                    "stroke-width",
                                    '2px'
                                )
                            

                            d3.selectAll('.highlightOrigin')
                                .style(
                                    "stroke-width",
                                    '4px'
                                )
                            

                            updatePanel3ForDestinationHover(
                                setCode,
                                d.endX,
                                d.endY,
                                EventName,
                                pitchElementOriginPanel3,
                                pitchElementOriginCumulativePanel3,
                                pitchElementShotPanel3,
                                pitchElementShotCumulativePanel3,
                                pitchElementPassPanel3,
                                pitchElementPassCumulativePanel3,
                                pitchElementRunPanel3,
                                pitchElementRunCumulativePanel3,
                                colorScales,
                                cContentPanelId,
                                xScale3,
                                yScale3,
                                dataAllEvents,
                                svgPanel,
                                PositionsToInclude,
                                histogramProbabilityTotalScaleGoalProbability, 
                                histogramProbabilityTotalScaleWeightedExpectedGoals
                            )

                            Panel3Click['x'] = null
                            Panel3Click['y'] = null

                            

                        },
                        dblclickTimeoutValue
                    )


                })
                .on('dblclick', function ( d ) {

                    clearTimeout(dblclickTimeout[pitchElementName])
                    dblclickTimeout[pitchElementName] = null
                    
                    Panel3Click['endX'] = null
                    Panel3Click['endY'] = null
                    Panel3Click['event'] = null

                    d3.selectAll('.highlightDestination')
                        .style(
                            "stroke-width",
                            '4px'
                        )

                    if ( Panel3Click['x'] == null ) {


                        mouseHoverTimeout[pitchElementName] = setTimeout(
                            function() {

                                if ( Panel3Click['x'] == null ) {

                                    updatePanel3ForDestinationHover(
                                        setCode,
                                        d.endX,
                                        d.endY,
                                        EventName,
                                        pitchElementOriginPanel3,
                                        pitchElementOriginCumulativePanel3,
                                        pitchElementShotPanel3,
                                        pitchElementShotCumulativePanel3,
                                        pitchElementPassPanel3,
                                        pitchElementPassCumulativePanel3,
                                        pitchElementRunPanel3,
                                        pitchElementRunCumulativePanel3,
                                        colorScales,
                                        cContentPanelId,
                                        xScale3,
                                        yScale3,
                                        dataAllEvents,
                                        svgPanel,
                                        PositionsToInclude,
                                        histogramProbabilityTotalScaleGoalProbability, 
                                        histogramProbabilityTotalScaleWeightedExpectedGoals
                                    )

                                } else {

                                    // update perspective for these two set
                                    // of coordinates

                                }
                                

                            },
                            mouseHoverTimeoutValue
                        )

                        
                    } else {

                        hideBaseDestinationData (
                            pitchElementPassPanel3,
                            pitchElementPassCumulativePanel3,
                            pitchElementRunPanel3,
                            pitchElementRunCumulativePanel3,
                        )

                        restoreBaseOriginData(
                            pitchElementOriginPanel3,
                            pitchElementOriginCumulativePanel3
                        )        
                                
                        updatePanel3ForOriginHover(
                            setCode,
                            Panel3Click['x'],
                            Panel3Click['y'],
                            pitchElementOriginPanel3,
                            pitchElementOriginCumulativePanel3,
                            pitchElementShotPanel3,
                            pitchElementShotCumulativePanel3,
                            pitchElementPassPanel3,
                            pitchElementPassCumulativePanel3,
                            pitchElementRunPanel3,
                            pitchElementRunCumulativePanel3,
                            colorScales,
                            cContentPanelId,
                            xScale3,
                            yScale3,
                            dataAllEvents,
                            nTwoDimSearchRadius,
                            nOneDimSearchRadius,
                            dataOriginProbabilitiesFor,
                            dataOriginProbabilitiesShotFor,
                            dataOriginProbabilitiesPassFor,
                            dataOriginProbabilitiesRunFor,
                            svgPanel,
                            PositionsToInclude,
                            histogramProbabilityTotalScaleGoalProbability, 
                            histogramProbabilityTotalScaleWeightedExpectedGoals
                        )
                        

                    }

                    
                    clearSelection()

                })

        
            pitchElementMarkingsPanel3.moveToFront()

        }


            
        fDrawAllEventsOrigin = function(
            pitchElement,
            pitchElementName,
            xScale3,
            nBlockWidth,
            selectedSetName,
            cContentPanelId,
            // 'Origin',
            ClassName,
            PlottingWhat,
            colorScales,
            WhichColorScale,
            // 'Pass',
            dataOriginProbabilities,
            pitchElementOriginPanel3,
            pitchElementOriginCumulativePanel3,
            pitchElementShotPanel3,
            pitchElementShotCumulativePanel3,
            pitchElementPassPanel3,
            pitchElementPassCumulativePanel3,
            pitchElementRunPanel3,
            pitchElementRunCumulativePanel3,
            setCode,
            dataAllEvents,
            svgPanel3,
            titleText,
            dataOriginProbabilitiesFor,
            dataOriginProbabilitiesShotFor,
            dataOriginProbabilitiesPassFor,
            dataOriginProbabilitiesRunFor
        ) {

                
            addPlotTitle(
                pitchElement,
                titleText,
                xScale3,
                nBlockWidth,
                null,
                cContentPanelId
            )

            addPitchColor(
                pitchElement,
                xScale3
            )
            
            var pitchElementMarkings = pitchElement
                .append("g")
                .attr('class','pitchMarkings');

            addPitchOutlines(
                pitchElementMarkings,
                xScale3
            )         

            pitchElement.selectAll()
                .data(
                    dataOriginProbabilities
                )
                .enter()
                .append("rect")
                .attr('class', function(d) { 
                    return ClassName +  ' x' + d.x + '_y' + d.y 
                })
                .attr("x", function(d) { return xScale3(d.x) - xScale3(nSizeRatioWithBufferForTiles*nBlockWidth/2) })
                .attr("y", function(d) { return yScale3(d.y) - xScale3(nSizeRatioWithBufferForTiles*nBlockWidth/2) })
                .attr("width", xScale3(nBlockWidth * nSizeRatioWithBufferForTiles) )
                .attr("height", xScale3(nBlockWidth * nSizeRatioWithBufferForTiles) )
                // .attr("x", function(d) { return xScale3(d.x) - xScale3(nBlockWidth/2) })
                // .attr("y", function(d) { return xScale3(d.y) - xScale3(nBlockWidth/2) })
                // .attr("width", xScale3(nBlockWidth) )
                // .attr("height", xScale3(nBlockWidth) )
                .style("color", function(d) { return colorScales[WhichColorScale](d[PlottingWhat])} )
                .style("fill", function(d) { return colorScales[WhichColorScale](d[PlottingWhat])} )
                .style("fill-opacity", 1 )
                .style("stroke-opacity", 1 )
                .on('mouseout', function ( d ) {
                    
                    clearTimeout(mouseHoverTimeout[pitchElementName]);
                    mouseHoverTimeout[pitchElementName] = null
                    
                    if ( Panel3Click['x'] == null & Panel3Click['endX'] == null ) {
                        
                        mouseHoverTimeout[pitchElementName] = setTimeout(
                            function () {

                                restoreBaseDestinationData(
                                    pitchElementPassPanel3,
                                    pitchElementPassCumulativePanel3,
                                    pitchElementRunPanel3,
                                    pitchElementRunCumulativePanel3,
                                )

                                d3.selectAll('#svgPanel3').selectAll(".histogramindicators").remove()
                                d3.selectAll('#svgPanel3').selectAll(".histogramindicatorsshot").remove()

                                        
                                unhighlightHeatmapCoordinate(
                                    pitchElementOriginPanel3,
                                    'highlightOrigin'
                                )

                                unhighlightHeatmapCoordinate(
                                    pitchElementOriginCumulativePanel3,
                                    'highlightOrigin'
                                )
                                            
                                        
                                unhighlightHeatmapCoordinate(
                                    pitchElementShotPanel3,
                                    'highlightOrigin'
                                )

                                unhighlightHeatmapCoordinate(
                                    pitchElementShotCumulativePanel3,
                                    'highlightOrigin'
                                )
                                            
                                unhighlightHeatmapCoordinate(
                                    pitchElementPassPanel3,
                                    'highlightOrigin'
                                )

                                unhighlightHeatmapCoordinate(
                                    pitchElementPassCumulativePanel3,
                                    'highlightOrigin'
                                )

                                unhighlightHeatmapCoordinate(
                                    pitchElementRunPanel3,
                                    'highlightOrigin'
                                )

                                unhighlightHeatmapCoordinate(
                                    pitchElementRunCumulativePanel3,
                                    'highlightOrigin'
                                )

                                
                            },
                            mouseHoverTimeoutValue
                        )
                    }

                })
                .on('mouseover', function ( d ) {                    

                    clearTimeout(mouseHoverTimeout[pitchElementName]);
                    mouseHoverTimeout[pitchElementName] = null

                    if ( Panel3Click['x'] == null & Panel3Click['endX'] == null ) {

                        updatePanel3HighlightsForOriginHovers(
                            d.x,
                            d.y,
                            pitchElementOriginPanel3,
                            pitchElementOriginCumulativePanel3,
                            pitchElementShotPanel3,
                            pitchElementShotCumulativePanel3,
                            pitchElementPassPanel3,
                            pitchElementPassCumulativePanel3,
                            pitchElementRunPanel3,
                            pitchElementRunCumulativePanel3,
                            cContentPanelId,
                            xScale3,
                            yScale3,
                            Panel3Click
                        )
                        
    
                        mouseHoverTimeout[pitchElementName] = setTimeout(
                            function() {

                                updatePanel3ForOriginHover(
                                    setCode,
                                    d.x,
                                    d.y,
                                    pitchElementOriginPanel3,
                                    pitchElementOriginCumulativePanel3,
                                    pitchElementShotPanel3,
                                    pitchElementShotCumulativePanel3,
                                    pitchElementPassPanel3,
                                    pitchElementPassCumulativePanel3,
                                    pitchElementRunPanel3,
                                    pitchElementRunCumulativePanel3,
                                    colorScales,
                                    cContentPanelId,
                                    xScale3,
                                    yScale3,
                                    dataAllEvents,
                                    nTwoDimSearchRadius,
                                    nOneDimSearchRadius,
                                    dataOriginProbabilitiesFor,
                                    dataOriginProbabilitiesShotFor,
                                    dataOriginProbabilitiesPassFor,
                                    dataOriginProbabilitiesRunFor,
                                    svgPanel3,
                                    PositionsToInclude,
                                    histogramProbabilityTotalScaleGoalProbability, 
                                    histogramProbabilityTotalScaleWeightedExpectedGoals
                                )

                            },
                            mouseHoverTimeoutValue
                        )
                    }


                })
                .on('click', function ( d ) {
                    
                    clearTimeout(mouseHoverTimeout[pitchElementName]);
                    clearTimeout(dblclickTimeout[pitchElementName]);
                    mouseHoverTimeout[pitchElementName] = null
                    dblclickTimeout[pitchElementName] = null

                    Panel3Click['x'] = d.x
                    Panel3Click['y'] = d.y
                    
                    dblclickTimeout[pitchElementName] = setTimeout(
                        function() {

                            d3.selectAll('.highlightOrigin')
                                .style(
                                    "stroke-width",
                                    '2px'
                                )
                            

                            d3.selectAll('.highlightDestination')
                                .style(
                                    "stroke-width",
                                    '4px'
                                )
                        

                            updatePanel3HighlightsForOriginHovers(
                                d.x,
                                d.y,
                                pitchElementOriginPanel3,
                                pitchElementOriginCumulativePanel3,
                                pitchElementShotPanel3,
                                pitchElementShotCumulativePanel3,
                                pitchElementPassPanel3,
                                pitchElementPassCumulativePanel3,
                                pitchElementRunPanel3,
                                pitchElementRunCumulativePanel3,
                                cContentPanelId,
                                xScale3,
                                yScale3,
                                Panel3Click
                            )
                            
                            updatePanel3ForOriginHover(
                                setCode,
                                d.x,
                                d.y,
                                pitchElementOriginPanel3,
                                pitchElementOriginCumulativePanel3,
                                pitchElementShotPanel3,
                                pitchElementShotCumulativePanel3,
                                pitchElementPassPanel3,
                                pitchElementPassCumulativePanel3,
                                pitchElementRunPanel3,
                                pitchElementRunCumulativePanel3,
                                colorScales,
                                cContentPanelId,
                                xScale3,
                                yScale3,
                                dataAllEvents,
                                nTwoDimSearchRadius,
                                nOneDimSearchRadius,
                                dataOriginProbabilitiesFor,
                                dataOriginProbabilitiesShotFor,
                                dataOriginProbabilitiesPassFor,
                                dataOriginProbabilitiesRunFor,
                                svgPanel3,
                                PositionsToInclude,
                                histogramProbabilityTotalScaleGoalProbability, 
                                histogramProbabilityTotalScaleWeightedExpectedGoals
                            )

                            Panel3Click['endX'] = null
                            Panel3Click['endY'] = null
                            Panel3Click['event'] = null
                        },
                        dblclickTimeoutValue
                    )

                })
                .on('dblclick', function ( d ) {

                    clearTimeout(dblclickTimeout[pitchElementName])
                    dblclickTimeout[pitchElementName] = null
                    
                    Panel3Click['x'] = null
                    Panel3Click['y'] = null
                    Panel3Click['event'] == null


                    if ( Panel3Click['endX'] != null ) {
                        
                        hideBaseOriginData (
                            pitchElementPassPanel3,
                            pitchElementPassCumulativePanel3,
                            pitchElementRunPanel3,
                            pitchElementRunCumulativePanel3,
                        )

                        restoreBaseDestinationData(
                            pitchElementPassPanel3,
                            pitchElementPassCumulativePanel3,
                            pitchElementRunPanel3,
                            pitchElementRunCumulativePanel3,
                        )
                        
                        updatePanel3ForDestinationHover(
                            setCode,
                            Panel3Click['endX'],
                            Panel3Click['endY'],
                            Panel3Click['event'],
                            pitchElementOriginPanel3,
                            pitchElementOriginCumulativePanel3,
                            pitchElementShotPanel3,
                            pitchElementShotCumulativePanel3,
                            pitchElementPassPanel3,
                            pitchElementPassCumulativePanel3,
                            pitchElementRunPanel3,
                            pitchElementRunCumulativePanel3,
                            colorScales,
                            cContentPanelId,
                            xScale3,
                            yScale3,
                            dataAllEvents,
                            svgPanel3,
                            PositionsToInclude,
                            histogramProbabilityTotalScaleGoalProbability, 
                            histogramProbabilityTotalScaleWeightedExpectedGoals
                        )

                        
                    }

                    d3.selectAll('.highlightOrigin')
                        .style(
                            "stroke-width",
                            '4px'
                        )
                    

                    clearSelection()

                })
                
            pitchElementMarkings.moveToFront()

        }

    }

    var colorContentScaleChoice = d3.select("#" + setSelectionContentPanelId).selectAll("input")
        .data(['Scales only for selection'])
        .enter()
        .append('label')
            .attr('for',function(d,i){ return 'a'+i; })
            .text(function(d) { return d; })
        .append("input")
            // .attr("checked", true)
            .attr("type", "checkbox")
            .attr("id", "colorContentScaleCheckbox")

            


    var setSelectionDashboardPanelIdDiv = d3.select("#" + setSelectionDashboardPanelId)
        .append('div')
        .style('width', '350px')
        .style('height', '100%')
        .style(
            'margin-left', 
            (
                ( ( nFullWidth - svgPanel3Width ) / 2)
            ) + 'px'
        )
        .style('float', 'left')
        .attr('display', 'block')
        // .style('background','blue')
    
    var colorDashboardScaleChoiceDiv = d3.select("#" + setSelectionDashboardPanelId)
        .append('div')
        .style('width', '180px')
        .style('height', '100%')
        .style('float', 'left')
        .attr('display', 'block')
        // .style('background','red')

    var highlightedEventsDiv = d3.select("#" + setSelectionDashboardPanelId)
        .append('div')
        // .style('width', 'auto')
        // .style('height', '100%')
        .style('float', 'left')
        // .attr('display', 'block')
        .style('margin-top', '20px')        
        .style('margin-left', '20px')        
        .on("mouseover", function(d) {
            d3.select(this).style("cursor", "pointer"); 
        })
        .on("mouseout", function(d) {
            d3.select(this).style("cursor", "default"); 
        })
        .style('background','#DDD')

    var helpEntry = d3.select("#" + setSelectionDashboardPanelId)
        .append('div')
        // .style('width', 'auto')
        // .style('height', '100%')
        .style('float', 'right')
        // .attr('display', 'block')
        .style('margin-top', '20px')
        .style(
            'margin-right', 
            (
                ( ( nFullWidth - svgPanel3Width ) / 2)
            ) + 'px'
        )
        .on("mouseover", function(d) {
            d3.select(this).style("cursor", "pointer"); 
        })
        .on("mouseout", function(d) {
            d3.select(this).style("cursor", "default"); 
        })
        .style('background','#DDD')

    var goFullScreenDiv = d3.select("#" + setSelectionDashboardPanelId)
        .append('div')
        // .style('width', 'auto')
        // .style('height', '100%')
        .style('float', 'right')
        // .attr('display', 'block')
        .style('margin-top', '20px')
        .style(
            'margin-right', 
            (
                ( ( nFullWidth - svgPanel3Width ) / 2)
            ) + 'px'
        )
        .on("mouseover", function(d) {
            d3.select(this).style("cursor", "pointer"); 
        })
        .on("mouseout", function(d) {
            d3.select(this).style("cursor", "default"); 
        })
        .style('background','#DDD')

    colorDashboardScaleChoiceDiv
        .append('text')
        .text('Scaled to selection')
        .style("float", "right")
        .style('color','white')
        .style("margin", "20px 0px 0px 2px")


    var colorDashboardScaleChoice = colorDashboardScaleChoiceDiv
        // .selectAll("input")
        // .data(['Scales only for selection'])
        // .enter()
        // .append('label')
            // .attr('for',function(d,i){ return 'a'+i; })
            // .text(function(d) { return d; })
        .append("input")
        // .attr('position','relative')
        .style("float", "right")
        .attr("type", "checkbox")
        .style("margin", "23px 2px")
        .attr("id", "colorDashboardScaleCheckbox")

    var dropdownSetContent = d3.select("#" + setSelectionContentPanelId)
        .append("select")
        .attr("id","setSelectionContent")


    dropdownSetContent.selectAll("option")
        .data(allSetCodes)
        .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d, i) { return allSetNames[i]; })
        .property("selected", function(d){ return d === selectedSetCode; })


    var dropdownSetDashboard = setSelectionDashboardPanelIdDiv
        .append("select")
        .attr("id","setSelectionDashboard")

    dropdownSetDashboard.selectAll("option")
        .data(allSetCodes)
        .style("float", "right")
        .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d, i) { return allSetNames[i]; })
        .property("selected", function(d){ return d === selectedSetCode; })

    helpEntry
        .style('color', 'black')
        .style("padding", "2px 15px")
        .style('user-select','none')
    
    helpEntry
        .append('text')
        .text('Toggle help')

    helpEntry
        // .append("input")
        // .attr("type", "button")
        // .attr("value", "Toggle help")
        // .style("margin", "17px 5px")
        // .style("float", "left")
        .on("click", function() { 

            if ( d3.select('#HelpOverlay').empty() ) {

                var HelpOverlay = d3.selectAll('#svgPanel3')
                    .append('g')
                    .attr('id', 'HelpOverlay')

                HelpOverlay
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('height', d3.selectAll('#svgPanel3').style('height'))
                    .attr('width', d3.selectAll('#svgPanel3').style('width'))
                    .attr('fill','black')
                    .attr('opacity', 0.5)
                

                
                if ( d3.select('#HighlightedEventsPanel').empty() == false ) {

                    HelpOverlay
                        .append('rect')
                        .attr('x', 600 * nRatioOfScreenSize)
                        .attr('y', 50 * nRatioOfScreenSize)
                        .attr('width', 500 * nRatioOfScreenSize)
                        .attr('height',110 * nRatioOfScreenSize)
                        .attr('fill','white')
                        .attr('stroke','black')
                        .attr('opacity', 1)

                    HelpOverlay
                            .append('text')
                            .attr('x', 650 * nRatioOfScreenSize)
                            .attr('y', 100 * nRatioOfScreenSize)
                            .attr('font-size', +nRatioOfScreenSize + 'em')
                            .text(
                                'These are some actions with high xPo and high\
                                generated xPo in total. You can click on an action\
                                and see more details about it.'
                            )
                            .call(wrap, 400 * nRatioOfScreenSize)
                        

                } else if ( Panel3Click['PlayPanelOpen'] == true ) {                    

                    HelpOverlay
                        .append('rect')
                        .attr('x', 600 * nRatioOfScreenSize)
                        .attr('y', 50 * nRatioOfScreenSize)
                        .attr('width', 500 * nRatioOfScreenSize)
                        .attr('height',380 * nRatioOfScreenSize)
                        .attr('fill','white')
                        .attr('stroke','black')
                        .attr('opacity', 1)

                    HelpOverlay
                            .append('text')
                            .attr('x', 650 * nRatioOfScreenSize)
                            .attr('y', 100 * nRatioOfScreenSize)
                            .attr('font-size', +nRatioOfScreenSize + 'em')
                            .text(
                                'This is the play view. You\'ve chosen a set of origin\
                                coordinates, end coordinates, and an event and have\
                                reached here. This helps you find plays where an action\
                                similar to the one you selected occurred and you can\
                                then walk through the sequence and understand the patterns\
                                of play better.'
                            )
                            .call(wrap, 400 * nRatioOfScreenSize)
                        

                    HelpOverlay
                        .append('text')
                        .attr('x', 650 * nRatioOfScreenSize)
                        .attr('y', 230 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'How to interact:'
                        )
                        .call(wrap, 400 * nRatioOfScreenSize)

                    HelpOverlay
                        .append('text')
                        .attr('x', 650 * nRatioOfScreenSize)
                        .attr('y', 250 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'The numbers near the top left let you choose how many\
                            events after your selected event you are interested in viewing.'
                        )
                        .call(wrap, 400 * nRatioOfScreenSize)
                            

                    HelpOverlay
                        .append('text')
                        .attr('x', 650 * nRatioOfScreenSize)
                        .attr('y', 320 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'You can hover over the shown events and identify the\
                            match and time for that action. It would be great to\
                            integrate video footage from the match here.'
                        )
                        .call(wrap, 400 * nRatioOfScreenSize)
                            


                    HelpOverlay
                        .append('rect')
                        .attr('x', 1500 * nRatioOfScreenSize)
                        .attr('y', 200 * nRatioOfScreenSize)
                        .attr('width', 300 * nRatioOfScreenSize)
                        .attr('height', 170 * nRatioOfScreenSize)
                        .attr('fill','white')
                        .attr('stroke','black')
                        .attr('opacity', 1)

                    HelpOverlay
                        .append('text')
                        .attr('x', 1550 * nRatioOfScreenSize)
                        .attr('y', 250 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'This plot shows the overall spread of xPo and total xPo.\
                            The highlighted point corresponds to the xPo and the xPo\
                            generated from the selected action.'
                        )
                        .call(wrap, 200 * nRatioOfScreenSize)

                } else {



                    HelpOverlay
                        .append('rect')
                        .attr('x', 20 * nRatioOfScreenSize)
                        .attr('y', 10 * nRatioOfScreenSize)
                        .attr('width', 350 * nRatioOfScreenSize)
                        .attr('height', 130 * nRatioOfScreenSize)
                        .attr('fill','white')
                        .attr('stroke','black')
                        .attr('opacity', 1)

                    HelpOverlay
                        .append('text')
                        .attr('x', 40 * nRatioOfScreenSize)
                        .attr('y', 40 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'You can use the dropdown to select a particular position\
                            on the pitch or look at the whole team together or look\
                            at all actions that any of their opponents took in the game\
                            against them.'
                        )
                        .call(wrap, 300 * nRatioOfScreenSize)


                        



                    
                    HelpOverlay
                        .append('rect')
                        .attr('x', 420 * nRatioOfScreenSize)
                        .attr('y', 10 * nRatioOfScreenSize)
                        .attr('width', 500 * nRatioOfScreenSize)
                        .attr('height', 170 * nRatioOfScreenSize)
                        .attr('fill','white')
                        .attr('stroke','black')
                        .attr('opacity', 1)

                    HelpOverlay
                        .append('text')
                        .attr('x', 450 * nRatioOfScreenSize)
                        .attr('y', 40 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'The range of values used for the scales for the team level numbers\
                            are different from the range of values for the colour\
                            scales for the players. However, if you would like to rescale\
                            the colours to only the selected option\'s numbers, then check this box.\
                            You may find this useful to view patterns for options whose numbers\
                            are on the lower side and don\'t show prominently on the heatmaps.'
                            
                        )
                        .call(wrap, 450 * nRatioOfScreenSize)










                    
                    HelpOverlay
                        .append('rect')
                        .attr('x', 980 * nRatioOfScreenSize)
                        .attr('y', 10 * nRatioOfScreenSize)
                        .attr('width', 350 * nRatioOfScreenSize)
                        .attr('height', 170 * nRatioOfScreenSize)
                        .attr('fill','white')
                        .attr('stroke','black')
                        .attr('opacity', 1)

                    HelpOverlay
                        .append('text')
                        .attr('x', 1000 * nRatioOfScreenSize)
                        .attr('y', 40 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'The top moves are ones that have high xPo values and\
                            have also generated a high amount of total xPo, basically these\
                            are events that are dangerous and executed often.\
                            You can click on an event from that window to see the\
                            plays in which that event actually occurred.'
                        )
                        .call(wrap, 300 * nRatioOfScreenSize)


                    
                    HelpOverlay
                        .append('rect')
                        .attr('x', 1400 * nRatioOfScreenSize)
                        .attr('y', 10 * nRatioOfScreenSize)
                        .attr('width', 300 * nRatioOfScreenSize)
                        .attr('height', 170 * nRatioOfScreenSize)
                        .attr('fill','white')
                        .attr('stroke','black')
                        .attr('opacity', 1)

                    HelpOverlay
                        .append('text')
                        .attr('font-weight', 'bold')
                        .attr('x', 1420 * nRatioOfScreenSize)
                        .attr('y', 40 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'xPo is a way to assign a value to attacking actions.\
                            It is the probability that after performing a particular\
                            action, the possession will eventually culminate in a goal.\
                            More details about the methodology are in the first section.'                        
                        )
                        .call(wrap, 250 * nRatioOfScreenSize)












                    HelpOverlay
                        .append('rect')
                        .attr('x', 50 * nRatioOfScreenSize)
                        .attr('y', 200 * nRatioOfScreenSize)
                        .attr('width', 300 * nRatioOfScreenSize)
                        .attr('height', 350 * nRatioOfScreenSize)
                        .attr('fill','white')
                        .attr('stroke','black')
                        .attr('opacity', 1)

                    HelpOverlay
                        .append('text')
                        .attr('x', 100 * nRatioOfScreenSize)
                        .attr('y', 250 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'The two plots in this panel show an aggregated view of the\
                            xPo and the total xPo generated p90 from various parts of the\
                            pitch through runs, passes, or shots, which originated\
                            from there.'
                        )
                        .call(wrap, 200 * nRatioOfScreenSize)

                    HelpOverlay
                        .append('text')
                        .attr('x', 100 * nRatioOfScreenSize)
                        .attr('y', ( 250 + 135 ) * nRatioOfScreenSize )
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'Clicking on an area in either of the two pitches will\
                            fix the origin coordinate until you double click to unfix it.\
                            Hovering over an area will temporarily fix the origin coordinates\
                            to that until you move the cursor away.'
                        )
                        .call(wrap, 200 * nRatioOfScreenSize)
                            


                    HelpOverlay
                        .append('rect')
                        .attr('x', 600 * nRatioOfScreenSize)
                        .attr('y', 200 * nRatioOfScreenSize)
                        .attr('width', 500 * nRatioOfScreenSize)
                        .attr('height', 300 * nRatioOfScreenSize)
                        .attr('fill','white')
                        .attr('stroke','black')
                        .attr('opacity', 1)

                    HelpOverlay
                        .append('text')
                        .attr('x', 650 * nRatioOfScreenSize)
                        .attr('y', 250 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'The six plots in this panel show the impact of various\
                            actions which ended in those areas of the pitch. Shots\
                            are only a property of their start coordinate but passes\
                            and carries are a propery of both ther start and end\
                            coordinates.'
                        )
                        .call(wrap, 400 * nRatioOfScreenSize)
                        
                        
                    HelpOverlay
                    .append('text')
                    .attr('x', 650 * nRatioOfScreenSize)
                    .attr('y', ( 250 + 110 ) * nRatioOfScreenSize )
                    .attr('font-size', +nRatioOfScreenSize + 'em')
                    .text(
                        'Clicking on an area in either of the first four pitches will\
                        fix the destination coordinate and the type of event until you\
                        double click to unfix it.\
                        Hovering over an area will temporarily fix the destination coordinates\
                        and type of event until you move the cursor away.'
                    )
                    .call(wrap, 400 * nRatioOfScreenSize)
                        
                        
                    HelpOverlay
                    .append('text')
                    .attr('x', 650 * nRatioOfScreenSize)
                    .attr('y', ( 250 + 210 ) * nRatioOfScreenSize )
                    .attr('font-size', +nRatioOfScreenSize + 'em')
                    .text(
                        'There isn\'t any interactivity in the shots charts.'
                    )
                    .call(wrap, 400 * nRatioOfScreenSize)
                        




                    HelpOverlay
                        .append('rect')
                        .attr('x', 250 * nRatioOfScreenSize)
                        .attr('y', 600 * nRatioOfScreenSize)
                        .attr('width', 700 * nRatioOfScreenSize)
                        .attr('height', 190 * nRatioOfScreenSize)
                        .attr('fill','white')
                        .attr('stroke','black')
                        .attr('opacity', 1)

                    HelpOverlay
                        .append('text')
                        .attr('x', 300 * nRatioOfScreenSize)
                        .attr('y', 650 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'You can choose to interact with both panels by\
                            selecting the origin and destination coordinates.\
                            Whichever coordinate you select first, the other panel\
                            will update accordingly and you can then continue to\
                            choose the other coordinate.'
                        )
                        .call(wrap, 600 * nRatioOfScreenSize)



                    HelpOverlay
                        .append('text')
                        .attr('x', 300 * nRatioOfScreenSize)
                        .attr('y', 720 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'On selecting the second coordinate, a window will\
                            open to let you explore possessions where the event\
                            you selected actually occurred between the coordinates\
                            you selected.'
                        )
                        .call(wrap, 600 * nRatioOfScreenSize)








                    HelpOverlay
                        .append('rect')
                        .attr('x', 1500 * nRatioOfScreenSize)
                        .attr('y', 200 * nRatioOfScreenSize)
                        .attr('width', 300 * nRatioOfScreenSize)
                        .attr('height', 370 * nRatioOfScreenSize)
                        .attr('fill','white')
                        .attr('stroke','black')
                        .attr('opacity', 1)

                    HelpOverlay
                        .append('text')
                        .attr('x', 1550 * nRatioOfScreenSize)
                        .attr('y', 250 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'This plot shows the overall spread of xPo and generated xPo.\
                            When you\'re interacting with the two panels on the left,\
                            this will also highlight the xPo values that are seen\
                            from the respective coordinates and events. A point labelled\
                            \'s\' will also appear to indicate the values for shots\
                            taken from the selected origin coordinates.'
                        )
                        .call(wrap, 200 * nRatioOfScreenSize)

                    HelpOverlay
                        .append('text')
                        .attr('x', 1550 * nRatioOfScreenSize)
                        .attr('y', 500 * nRatioOfScreenSize)
                        .attr('font-size', +nRatioOfScreenSize + 'em')
                        .text(
                            'There isn\'t any interactivity in this plot.'
                        )
                        .call(wrap, 200 * nRatioOfScreenSize)


                }


                HelpOverlay
                    .append('text')
                    .text('Close')
                    .attr("fill", "white")
                    .attr("alignment-baseline", "top")
                    .attr("text-anchor", "end")
                    .attr(
                        "x", 
                        ( 4.1 * xScale3(pitch.frame.width) )
                    )
                    .attr(
                        "y", 
                        // ( 1 * xScale3(pitch.frame.length)) +
                        ( 0.05 * xScale3(pitch.frame.length))
                    )
                    .attr("font-size", "0.7em")
                    .on('click', function() {
                        HelpOverlay.remove();
                    })
                    .on("mouseover", function(d) {
                        d3.select(this).style("cursor", "pointer"); 
                    })
                    .on("mouseout", function(d) {
                        d3.select(this).style("cursor", "default"); 
                    })

                
            } else {

                d3.select('#HelpOverlay').remove()

            }

        });


    d3.select("body")
    // d3.select("#" + cDashboardParentPanelId)
        .on("keydown", function() {

            if ( d3.event.keyCode == 27 ) {

                if ( d3.select('#HelpOverlay').empty() == false ) {
                    
                    d3.select('#HelpOverlay').remove();

                }
                
                if ( d3.select('#HighlightedEventsPanel').empty() == false ) {

                    d3.select('#HighlightedEventsPanel').remove()
                    highlightedEventsDiv.text('Show top moves')

                }
                
                if ( Panel3Click['PlayPanelOpen'] == true ) {

                    Panel3Click['PlayPanelOpen'] = false
                    d3.select("#" + cDashboardPanelId)
                        .selectAll('.tooltip')
                        .transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                    d3.select('#pitchElementPlaysBackground').remove()
                    d3.select('#pitchElementPlays').remove()

                } 
                
                // event.preventDefault();
            }
            
        });
        
    goFullScreenDiv
        // .append("input")
        // .attr("type", "button")
        // .attr("value", "Toggle full screen")s        
        .style('color', 'black')
        .style("padding", "2px 15px")
        .style('user-select','none')

    goFullScreenDiv
        .append('text')
        .text('Go full screen')
        
    
    goFullScreenDiv
        .on("click", function() { toggleFullscreen(document.getElementById(cDashboardParentPanelId)) }); 
    
    highlightedEventsDiv
        .style('color', 'black')
        .style("padding", "2px 15px")
        .style('user-select','none')
    
    highlightedEventsDiv
        .append('text')
        .text('Show top moves')
    
    function toggleFullscreen(elem) {
        elem = elem || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
          !document.webkitFullscreenElement && !document.msFullscreenElement) {
          if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
          } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
          } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      }
      
    createDashboardPanelParent = function(
        setCode,
        cDashboardPanelId,
        bExplainerTest
    ) {


        // panel3
        if ( true ) {

            d3.select("#" + cDashboardPanelId)
                .append("div")
                .attr("id", cDashboardPanelId + "Panel3")                                    

        }


    }

    updateDashboardPanelParentWithData = function(
        setCode,
        cDashboardPanelId,
        typeOfDataset,
        whichColourScale,
        selectedSetName,
        postCode,
        PositionsToInclude
    ) {

        d3.select('#' + cDashboardPanelId)
            .selectAll('.setSpecificContent')
            .style(
                'display',
                'none'
            )


        d3.select('#' + cDashboardPanelId)
            .selectAll('.' + postCode + '.setSpecificContent.' + setCode)
            .style(
                'display',
                'block'
            )

            d3.csv('./Data/' + setCode.replace(/_/g,'/') + '/ActionDistribution.csv').then( function(dataActionDistribution) {

                d3.csv('./Data/' + (setCode.substring(0, setCode.indexOf('_', setCode.indexOf('_') + 1))).replace(/_/g,'/') + '/AllEvents.csv').then( function(dataAllEvents) {

                    d3.csv('./Data/' + setCode.replace(/_/g,'/') + '/DestinationProbabilities.csv').then( function(dataDestinationProbabilitiesFor) {

                        d3.csv('./Data/' + setCode.replace(/_/g,'/') + '/DestinationProbabilitiesPass.csv').then( function(dataDestinationProbabilitiesPassFor) {

                            d3.csv('./Data/' + setCode.replace(/_/g,'/') + '/DestinationProbabilitiesRun.csv').then( function(dataDestinationProbabilitiesRunFor) {

                                d3.csv('./Data/' + setCode.replace(/_/g,'/') + '/OriginProbabilities.csv').then( function(dataOriginProbabilitiesFor) {

                                    d3.csv('./Data/' + setCode.replace(/_/g,'/') + '/OriginProbabilitiesPass.csv').then( function(dataOriginProbabilitiesPassFor) {

                                        d3.csv('./Data/' + setCode.replace(/_/g,'/') + '/OriginProbabilitiesRun.csv').then( function(dataOriginProbabilitiesRunFor) {

                                            d3.csv('./Data/' + setCode.replace(/_/g,'/') + '/OriginProbabilitiesShot.csv').then( function(dataOriginProbabilitiesShotFor) {
                                                
                                                d3.csv('./Data/' + cWhatScaleToUse.replace(/_/g,'/') + 'DistributionScale.csv').then( function(dataDistributionScale) {
                                                
                                                    d3.csv('./Data/' + whichColourScale.replace(/_/g,'/') + 'OriginScale.csv').then( function(dataOriginScale) {
                                                    
                                                        d3.csv('./Data/' + whichColourScale.replace(/_/g,'/') + 'DestinationScale.csv').then( function(dataDestinationScale) {

                                                            d3.csv('./Data/' + whichColourScale.replace(/_/g,'/') + 'GranularScale.csv').then( function(dataGranularDestinationScale) {

                                                                dataGranularDestinationScale.forEach(
                                                                    function(d){ 
                                                                        d["WeightedExpectedGoals"] = +d["WeightedExpectedGoals"]; 
                                                                        d["GoalProbability"] = +d["GoalProbability"]; 
                                                                    }
                                                                );   

                                                                dataOriginScale.forEach(
                                                                    function(d){ 
                                                                        d["_WeightedExpectedGoals"] = +d["_WeightedExpectedGoals"]; 
                                                                        d["_GoalProbability"] = +d["_GoalProbability"]; 
                                                                        d["NonShot_WeightedExpectedGoals"] = +d["NonShot_WeightedExpectedGoals"]; 
                                                                        d["NonShot_GoalProbability"] = +d["NonShot_GoalProbability"]; 
                                                                        d["Shot_WeightedExpectedGoals"] = +d["Shot_WeightedExpectedGoals"]; 
                                                                        d["Shot_GoalProbability"] = +d["Shot_GoalProbability"]; 
                                                                    }
                                                                );   
                                                                    
                                                                dataDestinationScale.forEach(
                                                                    function(d){ 
                                                                        d["_WeightedExpectedGoals"] = +d["_WeightedExpectedGoals"]; 
                                                                        d["_GoalProbability"] = +d["_GoalProbability"]; 
                                                                        d["NonShot_WeightedExpectedGoals"] = +d["NonShot_WeightedExpectedGoals"]; 
                                                                        d["NonShot_GoalProbability"] = +d["NonShot_GoalProbability"]; 
                                                                        d["Shot_WeightedExpectedGoals"] = +d["Shot_WeightedExpectedGoals"]; 
                                                                        d["Shot_GoalProbability"] = +d["Shot_GoalProbability"]; 
                                                                    }
                                                                );   
                                                                    

                                                                dataOriginProbabilitiesShotFor.forEach(
                                                                    function(d){ 
                                                                        d['x'] = +d['x']; 
                                                                        d['y'] = +d['y']; 
                                                                        // d['endX'] = +d['endX']; 
                                                                        // d['endY'] = +d['endY']; 
                                                                        d['Count'] = +d['Count']; 
                                                                        d['WeightedCount'] = +d['WeightedCount']; 
                                                                        d['Goals'] = +d['Goals']; 
                                                                        d['WeightedExpectedGoals'] = +d['WeightedExpectedGoals']; 
                                                                        // d['MaxPossessionGoalProbabilty'] = +d['MaxPossessionGoalProbabilty']; 
                                                                        d['GoalProbability'] = +d['GoalProbability']; 
                                                                        // d['eventSequence'] = +d['eventSequence']; 
                                                                    }
                                                                );   
                                                                    

                                                                dataOriginProbabilitiesPassFor.forEach(
                                                                    function(d){ 
                                                                        d['x'] = +d['x']; 
                                                                        d['y'] = +d['y']; 
                                                                        // d['endX'] = +d['endX']; 
                                                                        // d['endY'] = +d['endY']; 
                                                                        // d['Count'] = +d['Count']; 
                                                                        d['WeightedCount'] = +d['WeightedCount']; 
                                                                        // d['Goals'] = +d['Goals']; 
                                                                        d['WeightedExpectedGoals'] = +d['WeightedExpectedGoals']; 
                                                                        // d['MaxPossessionGoalProbabilty'] = +d['MaxPossessionGoalProbabilty']; 
                                                                        d['GoalProbability'] = +d['GoalProbability']; 
                                                                        // d['eventSequence'] = +d['eventSequence']; 
                                                                    }
                                                                );   
                                                                    

                                                                dataOriginProbabilitiesFor.forEach(
                                                                    function(d){ 
                                                                        d['x'] = +d['x']; 
                                                                        d['y'] = +d['y']; 
                                                                        // d['endX'] = +d['endX']; 
                                                                        // d['endY'] = +d['endY']; 
                                                                        // d['Count'] = +d['Count']; 
                                                                        d['WeightedCount'] = +d['WeightedCount']; 
                                                                        // d['Goals'] = +d['Goals']; 
                                                                        d['WeightedExpectedGoals'] = +d['WeightedExpectedGoals']; 
                                                                        // d['MaxPossessionGoalProbabilty'] = +d['MaxPossessionGoalProbabilty']; 
                                                                        d['GoalProbability'] = +d['GoalProbability']; 
                                                                        // d['eventSequence'] = +d['eventSequence']; 
                                                                    }
                                                                );   
                                                                    

                                                                dataAllEvents.forEach(
                                                                    function(d){ 
                                                                        d['x'] = +d['x']; 
                                                                        d['y'] = +d['y']; 
                                                                        d['endX'] = +d['endX']; 
                                                                        d['endY'] = +d['endY']; 
                                                                        // d['Count'] = +d['Count']; 
                                                                        // d['WeightedCount'] = +d['WeightedCount']; 
                                                                        // d['Goals'] = +d['Goals']; 
                                                                        // d['WeightedExpectedGoals'] = +d['WeightedExpectedGoals']; 
                                                                        d['MaxPossessionGoalProbabilty'] = +d['MaxPossessionGoalProbabilty']; 
                                                                        d['GoalProbability'] = +d['GoalProbability']; 
                                                                        d['eventSequence'] = +d['eventSequence']; 
                                                                    }
                                                                );   
                                                                    
                                                                dataActionDistribution.forEach(
                                                                    function(d){ 
                                                                        // d['x'] = +d['x']; 
                                                                        // d['y'] = +d['y']; 
                                                                        // d['endX'] = +d['endX']; 
                                                                        // d['endY'] = +d['endY']; 
                                                                        // d['Count'] = +d['Count']; 
                                                                        d['WeightedCount'] = +d['WeightedCount']; 
                                                                        // d['Goals'] = +d['Goals']; 
                                                                        d['WeightedExpectedGoals'] = +d['WeightedExpectedGoals']; 
                                                                        d['GoalProbability'] = +d['GoalProbability']; 
                                                                    }
                                                                );   

                                                                // local functions
                                                                if ( true ) {


                                                                    var colorScales = {}

                                                                    // Build color scale
                                                                    colorScales["myGranularNonShotProbabilityColor"] = d3.scaleLinear()
                                                                        .range(
                                                                            [
                                                                                zeroColour, 
                                                                                colorPalette[0]
                                                                            ]
                                                                        )
                                                                        .domain(
                                                                            [
                                                                                0,
                                                                                dataGranularDestinationScale[0]['GoalProbability']
                                                                            ]
                                                                        )

                                                                    // Build color scale
                                                                    colorScales["myGranularNonShotGoalsColor"] = d3.scaleLinear()
                                                                        .range(
                                                                            [
                                                                                zeroColour, 
                                                                                // "#f781bf"
                                                                                colorPalette[1]
                                                                            ]
                                                                        )
                                                                        .domain(
                                                                            [
                                                                                0,
                                                                                dataGranularDestinationScale[0]['WeightedExpectedGoals']
                                                                            ]
                                                                        )

                                                                
                                                                    // Build color scale
                                                                    colorScales["myShotProbabilityColor"] = d3.scaleLinear()
                                                                        .range(
                                                                            [
                                                                                zeroColour, 
                                                                                // "#00003F",
                                                                                // "#00007F",
                                                                                colorPalette[2]
                                                                            ]
                                                                        )
                                                                        .domain(
                                                                            [
                                                                                0,
                                                                                // nMaxShotProbability / 64,
                                                                                // nMaxShotProbability / 16,
                                                                                // nMaxShotProbability / 4,
                                                                                // nMaxShotProbability
                                                                                dataOriginScale[0]['Shot_GoalProbability']
                                                                            ]
                                                                        )
                                                                        // .range(["#ffffff", "#FF0000"])
                                                                        // .domain([0,1])


                                                                    // Build color scale
                                                                    colorScales['myShotGoalsColor'] = d3.scaleLinear()
                                                                        .range(
                                                                            [
                                                                                zeroColour, 
                                                                                // "#00003F",
                                                                                // "#00007F",
                                                                                colorPalette[3]
                                                                            ]
                                                                        )
                                                                        .domain(
                                                                            [
                                                                                0,
                                                                                // nMaxNonShotProbability / 64,
                                                                                // nMaxNonShotProbability / 16,
                                                                                // nMaxNonShotProbability / 4,
                                                                                // nMaxShotGoals
                                                                                dataOriginScale[0]['Shot_WeightedExpectedGoals']
                                                                            ]
                                                                        )
                                                                        // .range(["#ffffff", "#FF0000"])
                                                                        // .domain([0,1])

                                                                    colorScales['myNonShotProbabilityColorOrigin'] = d3.scaleLinear()
                                                                        .range(
                                                                            [
                                                                                zeroColour, 
                                                                                // "#3F0000",
                                                                                // "#7F0000",
                                                                                colorPalette[4]
                                                                            ]
                                                                        )
                                                                        .domain(
                                                                            [
                                                                                0,
                                                                                // nMaxNonShotGoals / 64,
                                                                                // nMaxNonShotGoals / 16,
                                                                                // nMaxNonShotGoals / 4,
                                                                                // nMaxNonShotProbability
                                                                                dataOriginScale[0]['NonShot_GoalProbability']
                                                                            ]
                                                                        )


                                                                    colorScales['myNonShotGoalsColorOrigin'] = d3.scaleLinear()
                                                                        .range(
                                                                            [
                                                                                zeroColour, 
                                                                                // "#3F0000",
                                                                                // "#7F0000",
                                                                                colorPalette[5]
                                                                            ]
                                                                        )
                                                                        .domain(
                                                                            [
                                                                                0,
                                                                                // nMaxNonShotGoals / 64,
                                                                                // nMaxNonShotGoals / 16,
                                                                                // nMaxNonShotGoals / 4,
                                                                                // nMaxNonShotGoals
                                                                                dataOriginScale[0]['NonShot_WeightedExpectedGoals']
                                                                            ]
                                                                        )


                                                                    // Build color scale
                                                                    colorScales['myProbabilityColorOrigin'] = d3.scaleLinear()
                                                                        .range(
                                                                            [
                                                                                zeroColour, 
                                                                                colorPalette[6]
                                                                            ]
                                                                        )
                                                                        .domain(
                                                                            [
                                                                                0,
                                                                                // d3.max(
                                                                                //     [
                                                                                //         d3.max(dataOriginProbabilitiesFor, function (d) { return d.GoalProbability } )
                                                                                //         // d3.max(dataOriginProbabilitiesAgainst, function (d) { return d.GoalProbability } )
                                                                                //     ]
                                                                                // )
                                                                                dataOriginScale[0]['_GoalProbability']
                                                                            ]
                                                                        )
                                                                        // .range(["#ffffff", "#FF0000"])
                                                                        // .domain([0,1])

                                                                    // Build color scale
                                                                    colorScales['myGoalsColorOrigin'] = d3.scaleLinear()
                                                                        .range(
                                                                            [
                                                                                zeroColour, 
                                                                                colorPalette[7]
                                                                            ]
                                                                        )
                                                                        .domain(
                                                                            [
                                                                                0,
                                                                                // d3.max(
                                                                                //     [
                                                                                //         d3.max(dataOriginProbabilitiesFor, function (d) { return d.WeightedExpectedGoals } )
                                                                                //         // d3.max(dataOriginProbabilitiesAgainst, function (d) { return d.WeightedExpectedGoals } )
                                                                                //     ]
                                                                                // )
                                                                                dataOriginScale[0]['_WeightedExpectedGoals']
                                                                            ]
                                                                        )
                                                                        // .range(["#ffffff", "#FF0000"])
                                                                        // .domain([0,1])



                                                                    colorScales['myNonShotProbabilityColorDestination'] = d3.scaleLinear()
                                                                        .range(
                                                                            [
                                                                                zeroColour, 
                                                                                // "#3F0000",
                                                                                // "#7F0000",
                                                                                colorPalette[4]
                                                                            ]
                                                                        )
                                                                        .domain(
                                                                            [
                                                                                0,
                                                                                // nMaxNonShotGoals / 64,
                                                                                // nMaxNonShotGoals / 16,
                                                                                // nMaxNonShotGoals / 4,
                                                                                // nMaxNonShotProbability
                                                                                dataDestinationScale[0]['NonShot_GoalProbability']
                                                                            ]
                                                                        )


                                                                    colorScales['myNonShotGoalsColorDestination'] = d3.scaleLinear()
                                                                        .range(
                                                                            [
                                                                                zeroColour, 
                                                                                // "#3F0000",
                                                                                // "#7F0000",
                                                                                colorPalette[5]
                                                                            ]
                                                                        )
                                                                        .domain(
                                                                            [
                                                                                0,
                                                                                // nMaxNonShotGoals / 64,
                                                                                // nMaxNonShotGoals / 16,
                                                                                // nMaxNonShotGoals / 4,
                                                                                // nMaxNonShotGoals
                                                                                dataDestinationScale[0]['NonShot_WeightedExpectedGoals']
                                                                            ]
                                                                        )


                                                                    // Build color scale
                                                                    colorScales['myProbabilityColorDestination'] = d3.scaleLinear()
                                                                        .range(
                                                                            [
                                                                                zeroColour, 
                                                                                colorPalette[6]
                                                                            ]
                                                                        )
                                                                        .domain(
                                                                            [
                                                                                0,
                                                                                // d3.max(
                                                                                //     [
                                                                                //         d3.max(dataOriginProbabilitiesFor, function (d) { return d.GoalProbability } )
                                                                                //         // d3.max(dataOriginProbabilitiesAgainst, function (d) { return d.GoalProbability } )
                                                                                //     ]
                                                                                // )
                                                                                dataDestinationScale[0]['_GoalProbability']
                                                                            ]
                                                                        )
                                                                        // .range(["#ffffff", "#FF0000"])
                                                                        // .domain([0,1])

                                                                    // Build color scale
                                                                    colorScales['myGoalsColorDestination'] = d3.scaleLinear()
                                                                        .range(
                                                                            [
                                                                                zeroColour, 
                                                                                colorPalette[7]
                                                                            ]
                                                                        )
                                                                        .domain(
                                                                            [
                                                                                0,
                                                                                // d3.max(
                                                                                //     [
                                                                                //         d3.max(dataOriginProbabilitiesFor, function (d) { return d.WeightedExpectedGoals } )
                                                                                //         // d3.max(dataOriginProbabilitiesAgainst, function (d) { return d.WeightedExpectedGoals } )
                                                                                //     ]
                                                                                // )
                                                                                dataDestinationScale[0]['_WeightedExpectedGoals']
                                                                            ]
                                                                        )
                                                                        // .range(["#ffffff", "#FF0000"])
                                                                        // .domain([0,1])


                                                                }

                                                                
                                                                
                                                                var cContentPanel3Id = cDashboardPanelId + "Panel3"
                                                                d3.select('#' + cContentPanel3Id).selectAll('*').remove()

                                                                fCreatePanel3(
                                                                    cContentPanel3Id,
                                                                    dataAllEvents,
                                                                    dataOriginProbabilitiesFor,
                                                                    dataOriginProbabilitiesShotFor,
                                                                    dataOriginProbabilitiesPassFor,
                                                                    dataOriginProbabilitiesRunFor,
                                                                    dataDestinationProbabilitiesFor,
                                                                    dataDestinationProbabilitiesPassFor,
                                                                    dataDestinationProbabilitiesRunFor,
                                                                    dataDistributionScale,
                                                                    colorScales,
                                                                    setCode,
                                                                    selectedSetName,
                                                                    nTwoDimSearchRadius,
                                                                    PositionsToInclude,
                                                                    dataActionDistribution,
                                                                    typeOfDataset
                                                                )


                                                                highlightedEventsDiv
                                                                    .on("click", function() { 
                                                                        
                                                                        d3.select('#HelpOverlay').remove();
                                                                        d3.select('#pitchElementPlaysBackground').remove()
                                                                        d3.select('#pitchElementPlays').remove()

                                                                        if ( d3.select('#HighlightedEventsPanel').empty() ) {

                                                                            var HighlightedEventsPanel = d3.selectAll('#svgPanel3')
                                                                                .append('g')
                                                                                .attr('id', 'HighlightedEventsPanel')

                                                                            HighlightedEventsPanel
                                                                                .append('rect')
                                                                                .attr('x', 0)
                                                                                .attr('y', 0)
                                                                                .attr('height', d3.selectAll('#svgPanel3').style('height'))
                                                                                .attr('width', d3.selectAll('#svgPanel3').style('width'))
                                                                                .attr('fill','black')
                                                                                .attr('opacity', 1)


                                                                            pitchElementHighlightedEvents = []
                                                                            pitchElementHighlightedEventsMarkings = []

                                                                            // for (var j=0; j<iPlotsHighlightedEventsInARow; j++) {
                                                                            for (var index=0; index<iPlotsHighlightedEventsInARow*iPlotsHighlightedEventsInAColumn; index++) {
                                                                            // for (var index=0; index<dataHighlightedEvents.length; index++) {

                                                                                var i = Math.floor(index/iPlotsHighlightedEventsInARow);
                                                                                var j = index - ( i * iPlotsHighlightedEventsInARow );

                                                                                pitchElementHighlightedEvents[index] = HighlightedEventsPanel
                                                                                    .append("g")
                                                                                    .attr(
                                                                                        "transform", 
                                                                                        "translate(" + 
                                                                                            xScale6( ( 0 ) + ( j * ( pitch.padding.left + pitch.frame.width ) ) ) + "," + 
                                                                                            xScale6( ( 30 ) + ( i * ( pitch.padding.top + pitch.frame.length ) ) ) + 
                                                                                        ")"
                                                                                    )
                                                                                    

                                                                                addPitchColor(
                                                                                    pitchElementHighlightedEvents[index],
                                                                                    xScale6
                                                                                )
                                                                                    
                                                                                pitchElementHighlightedEventsMarkings[index] = pitchElementHighlightedEvents[index]
                                                                                    .append("g")
                                                                                    .attr('class','pitchMarkings');

                                                                                addPitchOutlines(
                                                                                    pitchElementHighlightedEventsMarkings[index],
                                                                                    xScale6
                                                                                )

                                                                                pitchElementHighlightedEvents[index]
                                                                                    .on('click', function(d) {

                                                                                        d3.select('#HighlightedEventsPanel').remove()

                                                                                        highlightedEventsDiv
                                                                                            .text('Show top moves')

                                                                                        d3.selectAll('#svgPanel3').selectAll(".histogramindicators").remove()
                                                                                        d3.selectAll('#svgPanel3').selectAll(".histogramindicatorsshot").remove()

                                                                                        restoreBaseOriginData(
                                                                                            d3.selectAll('#svgPanel3').selectAll('#pitchElementOriginPanel3'),
                                                                                            d3.selectAll('#svgPanel3').selectAll('#pitchElementOriginCumulativePanel3')
                                                                                        )

                                                                                        Panel3Click = {}
                                                                                        Panel3Click['x'] = d.x
                                                                                        Panel3Click['y'] = d.y
                                                                                        Panel3Click['event'] = d.event                            
                                                                                        selectedSetCode = dropdownSetDashboard.property("value")

                                                                                        updatePositionsToIncludeScale(selectedSetCode)                      

                                                                                        Panel3Click['PlayPanelOpen'] = false
                                                                                        
                                                                                        updatePanel3HighlightsForOriginHovers(
                                                                                            Panel3Click['x'],
                                                                                            Panel3Click['y'],
                                                                                            d3.selectAll('#pitchElementOriginPanel3'),
                                                                                            d3.selectAll('#pitchElementOriginCumulativePanel3'),
                                                                                            d3.selectAll('#pitchElementShotPanel3'),
                                                                                            d3.selectAll('#pitchElementShotCumulativePanel3'),
                                                                                            d3.selectAll('#pitchElementPassPanel3'),
                                                                                            d3.selectAll('#pitchElementPassCumulativePanel3'),
                                                                                            d3.selectAll('#pitchElementRunPanel3'),
                                                                                            d3.selectAll('#pitchElementRunCumulativePanel3'),
                                                                                            cContentPanelId,
                                                                                            xScale3,
                                                                                            yScale3,
                                                                                            Panel3Click
                                                                                        )
                                                                                        

                                                                                        updatePanel3ForOriginHover(
                                                                                            selectedSetCode,
                                                                                            Panel3Click['x'],
                                                                                            Panel3Click['y'],
                                                                                            d3.selectAll('#pitchElementOriginPanel3'),
                                                                                            d3.selectAll('#pitchElementOriginCumulativePanel3'),
                                                                                            d3.selectAll('#pitchElementShotPanel3'),
                                                                                            d3.selectAll('#pitchElementShotCumulativePanel3'),
                                                                                            d3.selectAll('#pitchElementPassPanel3'),
                                                                                            d3.selectAll('#pitchElementPassCumulativePanel3'),
                                                                                            d3.selectAll('#pitchElementRunPanel3'),
                                                                                            d3.selectAll('#pitchElementRunCumulativePanel3'),
                                                                                            colorScales,
                                                                                            cContentPanelId,
                                                                                            xScale3,
                                                                                            yScale3,
                                                                                            dataAllEvents,
                                                                                            nTwoDimSearchRadius,
                                                                                            nOneDimSearchRadius,
                                                                                            dataOriginProbabilitiesFor,
                                                                                            dataOriginProbabilitiesShotFor,
                                                                                            dataOriginProbabilitiesPassFor,
                                                                                            dataOriginProbabilitiesRunFor,
                                                                                            d3.selectAll('#svgPanel3'),
                                                                                            PositionsToInclude,
                                                                                            histogramProbabilityTotalScaleGoalProbability, 
                                                                                            histogramProbabilityTotalScaleWeightedExpectedGoals
                                                                                        ).then(
                                                                                        
                                                                                            function () {

                                                                                                
                                                                                                d3.selectAll('.highlightOrigin')
                                                                                                    .style(
                                                                                                        "stroke-width",
                                                                                                        '2px'
                                                                                                    )

                                                                                                if ( Panel3Click['event'] != 'Shot' ) {

                                                                                                    Panel3Click['endX'] = d.endX
                                                                                                    Panel3Click['endY'] = d.endY
                                                                                                    Panel3Click['PlayPanelOpen'] = true
                                                                                                                                                    

                                                                                                    d3.selectAll('.highlightDestination')
                                                                                                        .style(
                                                                                                            "stroke-width",
                                                                                                            '2px'
                                                                                                        )
                                                                                                    
                                                                                                    updatePanel3HighlightsForDestinationHovers(
                                                                                                        Panel3Click['endX'],
                                                                                                        Panel3Click['endY'],
                                                                                                        cContentPanelId,
                                                                                                        d3.selectAll('#pitchElementOriginPanel3'),
                                                                                                        d3.selectAll('#pitchElementOriginCumulativePanel3'),
                                                                                                        d3.selectAll('#pitchElementPassPanel3'),
                                                                                                        d3.selectAll('#pitchElementPassCumulativePanel3'),
                                                                                                        d3.selectAll('#pitchElementRunPanel3'),
                                                                                                        d3.selectAll('#pitchElementRunCumulativePanel3'),
                                                                                                        xScale3,
                                                                                                        yScale3,
                                                                                                        d3.selectAll('#svgPanel3')
                                                                                                    )

                                                                                                    Panel3Click['PlayPanelOpen'] = true
                                                                                                        
                                                                                                    updatePanel3ForStartClickEndClick (
                                                                                                        pitch,
                                                                                                        d3.selectAll('#svgPanel3'),
                                                                                                        dataAllEvents,
                                                                                                        Panel3Click['event'],
                                                                                                        Panel3Click['x'],
                                                                                                        Panel3Click['y'],
                                                                                                        Panel3Click['endX'],
                                                                                                        Panel3Click['endY'],
                                                                                                        PositionsToInclude,
                                                                                                        cPassColour,
                                                                                                        cRunColour,
                                                                                                        cShotColour,
                                                                                                        cDashboardPanelId
                                                                                                    )
                                                                                                
                                                                                                    classstring = ".histogramindicators." + 
                                                                                                        Panel3Click['event'] + 
                                                                                                        '.x' + Panel3Click['x'] + '_y' + Panel3Click['y'] +
                                                                                                        '.endX' + Panel3Click['endX'] + "_endY" + Panel3Click['endY']
    
                                                                                                    d3.selectAll('#svgPanel3').selectAll(
                                                                                                        classstring
                                                                                                    )
                                                                                                        // .attr('opacity', 1)
                                                                                                        .attr("stroke-opacity", 1)
                                                                                                        .attr("stroke-width", 4)
                                                                                                        .attr("fill", 'white')
                                                                                                        .attr("stroke", 'black')
                                                                                                        .attr("r", 8)
                                                                                                        .moveToFront()

                                                                                                }

                                                                                            }

                                                                                        )
                                                                                            
                                                                                    })

                                                                                pitchElementHighlightedEventsMarkings[index].moveToFront()  

                                                                        
                                                                            }


                                                                            selectedSetCode = dropdownSetDashboard.property("value")

                                                                            d3.csv(
                                                                                './Data/' + selectedSetCode.replace(/_/g,'/') + '/HighlightedEvents.csv').then( function(dataActionDistribution) {
                                                                                    
                                                                                // for (var j=0; j<iPlotsHighlightedEventsInARow; j++) {
                                                                                for (var index=0; index<dataActionDistribution.length; index++) {

                                                                                    var i = Math.floor(index/iPlotsHighlightedEventsInARow);
                                                                                    var j = index - ( i * iPlotsHighlightedEventsInARow );

                                                                                    pitchElementHighlightedEvents[index]
                                                                                        .datum(dataActionDistribution[index])

                                                                                    addPlotTitle ( 
                                                                                        pitchElementHighlightedEvents[index],
                                                                                        'xPo: ' + (+dataActionDistribution[index].GoalProbability).toFixed(2) + ', ' + 
                                                                                        'Generated p90: ' + (+dataActionDistribution[index].WeightedExpectedGoals).toFixed(2),
                                                                                        xScale6,
                                                                                        nBlockWidth,
                                                                                        dataActionDistribution[index].event,
                                                                                        cDashboardPanelId
                                                                                    )

                                                                                    if ( dataActionDistribution[index].event == 'Shot') {

                                                                                        pitchElementHighlightedEvents[index]
                                                                                            .append('circle')
                                                                                            .attr("class", 'HighlightedEvent')
                                                                                            .style("stroke", cShotColour)
                                                                                            .style("fill", cShotColour)
                                                                                            .style("stroke-width", 2)
                                                                                            .attr("cx", function (d) { return xScale6(dataActionDistribution[index].x) })
                                                                                            .attr("cy", function (d) { return yScale6(dataActionDistribution[index].y) })
                                                                                            .attr('r', xScale6(2))
                                                                                            
                                                                                    } else {

                                                                                        pitchElementHighlightedEvents[index]
                                                                                            .append('line')
                                                                                            .attr("class", 'HighlightedEvent')
                                                                                            .style("stroke", ((dataActionDistribution[index].event == 'Pass') ? cPassColour : cRunColour) )
                                                                                            .style("fill", ((dataActionDistribution[index].event == 'Pass') ? cPassColour : cRunColour) )
                                                                                            .style("stroke-width", 2)
                                                                                            .attr("x1", function (d) { return xScale6(dataActionDistribution[index].x) })
                                                                                            .attr("y1", function (d) { return yScale6(dataActionDistribution[index].y) })
                                                                                            .attr("x2", function (d) { return xScale6(dataActionDistribution[index].endX) })
                                                                                            .attr("y2", function (d) { return yScale6(dataActionDistribution[index].endY) })
                                                                                            
                                                                                        pitchElementHighlightedEvents[index]
                                                                                            .append('circle')
                                                                                            .attr("class", 'HighlightedEvent')
                                                                                            .style("stroke", ((dataActionDistribution[index].event == 'Pass') ? cPassColour : cRunColour) )
                                                                                            .style("fill", ((dataActionDistribution[index].event == 'Pass') ? cPassColour : cRunColour) )
                                                                                            .style("stroke-width", 2)
                                                                                            .attr("cx", function (d) { return xScale6(dataActionDistribution[index].endX) })
                                                                                            .attr("cy", function (d) { return yScale6(dataActionDistribution[index].endY) })
                                                                                            .attr('r', xScale6(2))
                                                                                            .attr(
                                                                                "width", 
                                                                                ( svgPanel3Width )
                                                                            )
                                                                            .attr(
                                                                                "height", 
                                                                                // ( 1 * xScale3(pitch.frame.length)) +
                                                                                ( 3 * xScale3(pitch.frame.length))
                                                                            )
                                                                                    }

                                                                                }

                                                                            })



                                                                            HighlightedEventsPanel
                                                                                .append('text')
                                                                                .text('Close')
                                                                                .attr("fill", "white")
                                                                                .attr("alignment-baseline", "top")
                                                                                .attr("text-anchor", "end")
                                                                                .attr(
                                                                                    "x", 
                                                                                    ( 4.1 * xScale3(pitch.frame.width) )
                                                                                )
                                                                                .attr(
                                                                                    "y", 
                                                                                    // ( 1 * xScale3(pitch.frame.length)) +
                                                                                    ( 0.1 * xScale3(pitch.frame.length))
                                                                                )
                                                                                .attr("font-size", "0.7em")
                                                                                .on('click', function() {
                                                                                    HighlightedEventsPanel.remove();
                                                                                    highlightedEventsDiv.text("Show top moves")
                                                                                })
                                                                                .on("mouseover", function(d) {
                                                                                    d3.select(this).style("cursor", "pointer"); 
                                                                                })
                                                                                .on("mouseout", function(d) {
                                                                                    d3.select(this).style("cursor", "default"); 
                                                                                })

                                                                                highlightedEventsDiv
                                                                                    .text('Hide top moves')
                                                                                    .style('color', 'black')
                                                                                    .style("padding", "2px 15px")


                                                                        } else {

                                                                            d3.select('#HighlightedEventsPanel').remove()
                                                                            highlightedEventsDiv.text("Show top moves")

                                                                        }
                                                                    }); 



                                                            });

                                                        });

                                                    });

                                                });

                                            });

                                        });

                                    });

                                });

                            });

                        });

                    });
                
                });

            });


    }


    initiateDashboardSetChange = function(
        selectedSetCode,
        cDashboardPanelId,
        selectedSetName,
        colorScaleRelativetoSelection,
        cWhatScaleToUse,
        PositionsToInclude
    ) {
            
        Panel3Click = {}
        Panel3Click['x'] = null
        Panel3Click['y'] = null
        Panel3Click['endX'] = null
        Panel3Click['endY'] = null
        Panel3Click['event'] = null
        Panel3Click['PlayPanelOpen'] = false


        d3.selectAll('.plotTitle.' + cDashboardPanelId).text('Updating')

        // d3.select('#' + cContentPanelId).selectAll('*').remove()

        // d3.select("#" + cContentPanelId).selectAll("*").remove()

        // createPanelParent(
        //     selectedSetCode,
        //     cContentPanelId
        // )

        if ( colorScaleRelativetoSelection == true ) {

            whichColourScale = selectedSetCode + '/'

        } else {
            
            whichColourScale = cWhatScaleToUse

        }

        updateDashboardPanelParentWithData(
            selectedSetCode,
            cDashboardPanelId,
            cWhatScaleToUse,
            whichColourScale,
            selectedSetName,
            postCode,
            PositionsToInclude
        )
        
    }
    
    colorContentScaleChoice
        .on("click", function(d) {

            selectedSetCode = dropdownSetContent.property("value")

            updatePositionsToIncludeScale(selectedSetCode)

            initiateContentSetChange(
                selectedSetCode,
                cContentPanelId,
                allSetNames[allSetCodes.indexOf(selectedSetCode)],
                d3.select(this).property('checked'),
                cWhatScaleToUse,
                PositionsToInclude
            )

        });

    dropdownSetContent
        .on("change", function(d) { 

            selectedSetCode = d3.select(this).property("value")

            updatePositionsToIncludeScale(selectedSetCode)

            initiateContentSetChange(
                selectedSetCode,
                cContentPanelId,
                allSetNames[allSetCodes.indexOf(selectedSetCode)],
                colorContentScaleChoice.property('checked'),
                cWhatScaleToUse,
                PositionsToInclude
            )

        });

        
    colorDashboardScaleChoice
        .on("click", function(d) {

            d3.select('#HighlightedEventsPanel').remove()
            d3.select('#HelpOverlay').remove()

            selectedSetCode = dropdownSetDashboard.property("value")
            
            updatePositionsToIncludeScale(selectedSetCode)

            initiateDashboardSetChange(
                selectedSetCode,
                cDashboardPanelId,
                allSetNames[allSetCodes.indexOf(selectedSetCode)],
                d3.select(this).property('checked'),
                cWhatScaleToUse,
                PositionsToInclude
            )

        });

    dropdownSetDashboard
        .on("change", function(d) { 

            Panel3Click = {}
            Panel3Click['x'] = null
            Panel3Click['y'] = null
            Panel3Click['endX'] = null
            Panel3Click['endY'] = null
            Panel3Click['event'] = null
            Panel3Click['PlayPanelOpen'] = false

            highlightedEventsDiv.text("Show top moves")

            selectedSetCode = d3.select(this).property("value")
            
            updatePositionsToIncludeScale(selectedSetCode)

            initiateDashboardSetChange(
                selectedSetCode,
                cDashboardPanelId,
                allSetNames[allSetCodes.indexOf(selectedSetCode)],
                colorDashboardScaleChoice.property('checked'),
                cWhatScaleToUse,
                PositionsToInclude
            )

        });

    // createContentPanelParent(
    //     selectedSetCode,
    //     cContentPanelId,
    //     bExplainerTest
    // )

    // updateContentPanelParentWithData(
    //     selectedSetCode,
    //     cContentPanelId,
    //     cWhatScaleToUse,
    //     selectedSetName,
    //     postCode,
    //     PositionsToInclude
    // )

    createDashboardPanelParent(
        selectedSetCode,
        cDashboardPanelId,
        bExplainerTest
    )


    if ( colorContentScaleChoice.property('checked') == true ) {

        whichColourScale = selectedSetCode + '/'

    } else {
        
        whichColourScale = cWhatScaleToUse

    }

    updateDashboardPanelParentWithData(
        selectedSetCode,
        cDashboardPanelId,
        cWhatScaleToUse,
        whichColourScale,
        selectedSetName,
        postCode,
        PositionsToInclude
    )
}