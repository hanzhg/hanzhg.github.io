import { useState, useEffect } from 'react';

export default function Clock(){
    const [date, setDate] = useState(new Date());
    
    function refreshClock() {
      setDate(new Date());
    }
    useEffect(() => {
      setInterval(refreshClock, 100);
    }, []);

    function fixTime(n) {
        return (n < 10 ? "0" + n : n)
    }

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];

    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()];

    var day = date.getDate();
    var year = date.getFullYear().toString();

    var hour = fixTime(date.getHours());
    var min = fixTime(date.getMinutes());
    var sec = fixTime(date.getSeconds());

    return (
      <div id = "text" >
        {weekday + " " + month + " " + day + " " + year + ", " + hour + ":" + min + ":" + sec}
      </div>
    );
}