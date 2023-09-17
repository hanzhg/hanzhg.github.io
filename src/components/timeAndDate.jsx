import { useState, useEffect } from 'react';

export default function TimeAndDate() {
	const [date, setDate] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(new Date());
		}, 100);

		return () => clearInterval(interval);
	}, []);

	function fixTime(n) {
		return n < 10 ? '0' + n : n.toString();
	}

	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const weekday = weekdays[date.getDay()];
	const month = months[date.getMonth()];
	const day = date.getDate();
	const year = date.getFullYear();

	const hour = fixTime(date.getHours());
	const min = fixTime(date.getMinutes());
	const sec = fixTime(date.getSeconds());

	return (
		<div id="text">
			{weekday}, {month} {day} {year}, {hour}:{min}:{sec}
		</div>
	);
}
