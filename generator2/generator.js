$("form").on("submit",function(event) {
  event.preventDefault();

  $(".timeline-grid").empty();

  var mainPlayer = $("input[name='mainPlayer']").val();
	var genCode = $("input[name='genCode']").val();
  genCode = genCode.replace(/\s+/g, '');
	genArray = genCode.split(";");

  var player1 = new Object();
  player1.name = mainPlayer;
  player1.r = 1;
  player1.c = 1;

  activeplayers = [player1];

	for (i=0;i<genArray.length;i++){
		var eventType = genArray[i].charAt(0);

		if(eventType == "s"){
      for (drawcount=0;drawcount<activeplayers.length;drawcount++){
        $(".timeline-grid").append(
  				"<div class='timeline-straight' style='grid-column-start:" + activeplayers[drawcount].c + "; grid-row-start:" + activeplayers[drawcount].r + "'></div>"
  			);
        activeplayers[drawcount].c++;

        if (drawcount == activeplayers.length - 1){
          largestr=activeplayers[drawcount].r;
          largestc=activeplayers[drawcount].c;
        }
      }
		}

		else if(eventType == "o" || eventType == "n"){
      eventOuter = genArray[i].split("/");
      eventArray = eventOuter[1].split(",");
      eventDate = eventArray[0];
      eventNewPlayer = eventArray[1].split("-");
      eventOldTeam = eventArray[2].split("-");
      concurrent = eventArray[3];

      pastplayers = activeplayers.length;

      for (pastobjcount=0;pastobjcount<activeplayers.length;pastobjcount++){

        $(".timeline-grid").append(
  				"<div class='timeline-straight timeline-down' style='grid-column-start:" + activeplayers[pastobjcount].c + "; grid-row-start:" + activeplayers[pastobjcount].r + "'></div>"
  			);
  			activeplayers[pastobjcount].r++;
  			activeplayers[pastobjcount].c++;

        if(eventType == "o"){
          iconhtml = "<span>ORG</span>"
        }

        if(eventType == "n"){
          iconhtml = "<i class='fa fa-plus' aria-hidden='true'></i>"
        }

  			$(".timeline-grid").append(
  				"<div class='timeline-straight' style='grid-column-start:" + activeplayers[pastobjcount].c + "; grid-row-start:" + activeplayers[pastobjcount].r + `'>
            <div class='timeline-icon ` + eventDate + "'>" + iconhtml + `
          </div>
          <div class='timeline-name'><span>` + activeplayers[pastobjcount].name + `</span></div>
				</div>`
  			);

  			activeplayers[pastobjcount].c++;
        $(".timeline-grid").append(
  				"<div class='timeline-straight' style='grid-column-start:" + activeplayers[pastobjcount].c + "; grid-row-start:" + activeplayers[pastobjcount].r + "'></div>"
  			);
  			activeplayers[pastobjcount].c++;

        if (pastobjcount == activeplayers.length - 1){
          largestr=activeplayers[pastobjcount].r;
          largestc=activeplayers[pastobjcount].c-3;
        }
      }

      for (newobjcount=0;newobjcount<eventNewPlayer.length;newobjcount++){
        if (eventNewPlayer[newobjcount] !== "0"){
          activeplayers.push({"name":eventNewPlayer[newobjcount],"r":largestr+1,"c":largestc+1});
          largestr++;
        }
      }

      for (newobjcount=pastplayers,eventCount=0;newobjcount<activeplayers.length;newobjcount++,eventCount++){
        activeplayers[newobjcount].c--;
  			$(".timeline-grid").append(
  				"<div class='timeline-straight timeline-dashed timeline-half-right' style='grid-row-start:" + activeplayers[newobjcount].r + "; grid-column-start:" + activeplayers[newobjcount].c +`;'>
  					<div class='timeline-team'><span>` + eventOldTeam[eventCount] + `</span></div>
  				</div>
  				`
  			);
  			activeplayers[newobjcount].c++;

        if(eventType == "o"){
          iconhtml = "<span>ORG</span>"
        }

        if(eventType == "n"){
          iconhtml = "<i class='fa fa-plus' aria-hidden='true'></i>"
        }

  			$(".timeline-grid").append(
  				"<div class='timeline-straight' style='grid-row-start:" + activeplayers[newobjcount].r + "; grid-column-start:" + activeplayers[newobjcount].c +`;'>
  					<div class='timeline-icon ` + eventDate + `'>` + iconhtml + `</div>
  					<div class='timeline-name'><span>` + activeplayers[newobjcount].name + `</span></div>
  				</div>
  				`
  			);
  			activeplayers[newobjcount].c++;
        $(".timeline-grid").append(
  				"<div class='timeline-straight' style='grid-column-start:" + activeplayers[newobjcount].c + "; grid-row-start:" + activeplayers[newobjcount].r + "'></div>"
  			);
  			activeplayers[newobjcount].c++;
      }
		}

		else if(eventType == "l"){
      eventOuter = genArray[i].split("/");
      eventArray = eventOuter[1].split(",");
      eventDate = eventArray[0];
      eventNewPlayer = eventArray[1].split("-");
      eventOldTeam = eventArray[2].split("-");
      concurrent = eventArray[3];

      for (n=0;n<eventNewPlayer.length;n++){
        var test = activeplayers.indexOf({"name":eventNewPlayer[n]});
      }

      console.log(test);

		}

		else if(eventType == "j"){

		}

	}
});
