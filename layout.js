function timelineLayout(){
  leftPosBot = 0;
  rightPosBot = 0;

  $(".marker").each(function(){
    corrBlock = $(this).nextAll("div").first();
    $(this).appendTo(".center");
    centPos = $(this).offset().top;
    console.log("cent" + centPos);

    if (corrBlock.is(".team")){
      corrBlock.appendTo(".left").css("top",centPos);
      leftPosTop = centPos;

      if (leftPosTop < leftPosBot){
        leftPosTop = leftPosBot;
        centPos = leftPosTop - centPos;
        corrBlock.css("top",leftPosTop);
        $(this).css("top",centPos);
      }

      leftPosBot = leftPosTop + corrBlock.outerHeight();
    }

    if (corrBlock.is(".comp")){
      corrBlock.appendTo(".right").css("top",centPos);
      rightPosTop = centPos;
      console.log("right" + rightPosTop + "prev" + rightPosBot);

      if (rightPosTop < rightPosBot){
        rightPosTop = rightPosBot;
        centPos = rightPosTop - centPos;
        corrBlock.css("top",rightPosTop);
        $(this).css("top",centPos);
      }

      console.log(rightPosTop + "testthing");
      console.log(corrBlock.outerHeight());
      rightPosBot = rightPosTop + corrBlock.outerHeight();
      console.log("newright" + rightPosTop + "newprev" + rightPosBot)
    }
  });
}
