import { useState, useEffect } from 'react';

export default function TimeAndDate() {
	const [date, setDate] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(new Date());
		}, 100);

		return () => clearInterval(interval);
	}, []);

	const formatDate = (date) => {
		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		};
		return date.toLocaleString('en-US', options).replace(' at ', ', ');
	};

	return (
		<div>
			{formatDate(date)}
		</div>
	);
}
