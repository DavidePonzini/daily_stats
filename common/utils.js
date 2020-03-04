// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}


export function dowToLetters(dow) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return days[dow];
}


export function dowToKanji(dow) {
  switch(dow) { 
    case 0:
      return '日';
    case 1:
      return '月';
    case 2:
      return '火';
    case 3:
      return '水';
    case 4:
      return '木';
    case 5:
      return '金';
    case 6:
      return '土';
    default:
      return dow;
  }
}

export function getElapsedSeconds(t2) {
  let t1 = new Date(t2.getFullYear(), t2.getMonth(), t2.getDate(), 0, 0, 0, 0);
  
  
  return (t2 - t1) / 1000;
}

export function getTime() {
  let now = new Date();
  
  return `${zeroPad(now.getHours())}:${zeroPad(now.getMinutes())}:${zeroPad(now.getSeconds())}`;
}