var playername = "kronovi";
var date = "mar15";
var leftteam = "lft";
var jointeam = "take3";

$("form").on("submit",function(event) {
  event.preventDefault();
	var userString = $("input[type='text']").val();
	userArray = userString.split(";");
	console.log(userString);
	for (i=0,r=1,c=1;i<userArray.length;i++,c++){
		var eventType = userArray[i].charAt(0);
		if(eventType == "s"){
			$(".timeline-grid").append(
				"<div class='timeline-straight' style='grid-column-start:" + c + "; grid-row-start:" + r + "'></div>"
			);
		}
		else if(eventType == "o"){
			$(".timeline-grid").append(
				"<div class='timeline-straight timeline-down' style='grid-column-start:" + c + "; grid-row-start:" + r + "'></div>"
			);
			r+=1;
			c+=1;
			$(".timeline-grid").append(
				"<div class='timeline-straight' style='grid-column-start:" + c + "; grid-row-start:" + r + `'>
          <div class='timeline-icon ` + date + `'><span>ORG</span></div>
          <div class='timeline-name'><span>` + playername + `</span></div>
				</div>`
			);
			c+=1;
			$(".timeline-grid").append(
				"<div class='timeline-straight' style='grid-column-start:" + c + "; grid-row-start:" + r + "'></div>"
			);
		}
		else if(eventType == "n"){
			$(".timeline-grid").append(
				"<div class='timeline-straight timeline-down' style='grid-column-start:" + c + "; grid-row-start:" + r + "'></div>"
			);
			r+=1;
			c+=1;
			$(".timeline-grid").append(
				"<div class='timeline-straight' style='grid-column-start:" + c + "; grid-row-start:" + r + `'>
          <div class='timeline-icon ` + date + `'><i class="fa fa-plus" aria-hidden="true"></i></div>
          <div class='timeline-name'><span>` + playername + `</span></div>
				</div>`
			);
			c+=1;
			$(".timeline-grid").append(
				"<div class='timeline-straight' style='grid-column-start:" + c + "; grid-row-start:" + r + "'></div>"
			);
		}
		else if(eventType == "l"){
			$(".timeline-grid").append(
				"<div class='timeline-straight timeline-dashed timeline-half-left' style='grid-row-start:" + r + "; grid-column-start:" + c +`;'>
					<div class='timeline-icon ` + date + `'>
						<div class='timeline-icon-inner timeline-icon-leave'>
							<div class='timeline-icon-hor'></div>
							<div class='timeline-icon-slant'></div>
							<div class='timeline-icon-arrow'></div>
						</div>
					</div>
					<div class='timeline-team'><span>` + leftteam + `</span></div>
				</div>
				`
			);
		}
		else if(eventType == "j"){
			if (c>1){
				c-=1;
			} else{

			};
			$(".timeline-grid").append(
				"<div class='timeline-straight timeline-dashed timeline-half-right' style='grid-row-start:" + r + "; grid-column-start:" + c +`;'>
					<div class='timeline-team'><span>` + jointeam + `</span></div>
				</div>
				`
			);
			c+=1;
			$(".timeline-grid").append(
				"<div class='timeline-straight' style='grid-row-start:" + r + "; grid-column-start:" + c +`;'>
					<div class='timeline-icon ` + date + `'>
						<div class='timeline-icon-inner timeline-icon-join'>
							<div class='timeline-icon-hor'></div>
							<div class='timeline-icon-slant'></div>
							<div class='timeline-icon-arrow'></div>
						</div>
					</div>
					<div class='timeline-name'><span>` + playername + `</span></div>
				</div>
				`
			);
			c+=1;
			$(".timeline-grid").append(
				"<div class='timeline-straight' style='grid-column-start:" + c + "; grid-row-start:" + r + "'></div>"
			);
		}
	}
});
