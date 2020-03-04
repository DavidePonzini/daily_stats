export function getDegrees(val, maxVal, degrees=90) {
  let perc = val/maxVal;
  
  if (perc < 0) perc = 0;
  else if (perc > 1) perc = 1;
  
  return degrees * perc;
}

export function drawArc(arc, val, maxVal, degrees=90) {
  if (arc != null)
    arc.sweepAngle = getDegrees(val, maxVal, degrees);
}

export function drawArc2(arc, cap, val, maxVal, degrees=90) {
  if (arc != null)
    arc.sweepAngle = getDegrees(val, maxVal, degrees);
  if (cap != null)
    cap.groupTransform.rotate.angle = getDegrees(val, maxVal, degrees);
}


export function setVisibility(visibility, elem) {
  elem.style.display = (visibility) ? "inline" : "none";
}