export const convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();

    let day = (d.getDate()  < 10 ?'0':'')+d.getDate();
    let month = (d.getMonth()  < 10 ?'0':'')+d.getMonth();


    if (c.getDay() !== d.getDay()) {
      result = day + '-' + month + '-' + d.getFullYear();
    }
    return result;
  };
