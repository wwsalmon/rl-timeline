function timelineLayout(){
  leftPosBot = 0;
  rightPosBot = 0;

  $(".marker").each(function(){
    corrBlock = $(this).nextAll("div").first();
    $(this).appendTo(".center");
    centPos = $(this).position().top;
    console.log("cent" + centPos);

    if (corrBlock.is(".team")){
      corrBlock.appendTo(".left").css("top",centPos);
      leftPosTop = corrBlock.position().top;
      console.log("left" + leftPosTop);

      if (leftPosTop < leftPosBot){
        leftPosTop = leftPosBot;
        centPos = leftPosTop - centPos;
        corrBlock.css("top",leftPosTop);
        $(this).css("top",centPos);
      }

      leftPosBot = corrBlock.position().top + corrBlock.outerHeight(true);
    }

    if (corrBlock.is(".comp")){
      corrBlock.appendTo(".right").css("top",centPos);
      rightPosTop = corrBlock.position().top;
      console.log("right" + rightPosTop + "prev" + rightPosBot);

      if (rightPosTop < rightPosBot){
        rightPosTop = rightPosBot;
        centPos = rightPosTop - centPos;
        corrBlock.css("top",rightPosTop);
        $(this).css("top",centPos);
      }

      rightPosBot = rightPosTop + corrBlock.outerHeight(true);
    }
  });
}
