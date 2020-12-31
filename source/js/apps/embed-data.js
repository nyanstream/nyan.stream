'use strict'

moment.tz.setDefault('Europe/Moscow')

DOMAINS.radio = 'myradio24.com'

let dataContainer = $make.qs('.data')

let $embed = {
	sched: () => doFetch({ fetchURL: API.schedule, handler: ({ data = [] }) => {
		let dayToday =      moment().format('DDD YY')
		let dayTodayFull =  moment().format('D MMMM (dddd)')

		let cutToHour = false

		dataContainer.innerText = ''
		dataContainer.appendChild($create.elem('p', dayTodayFull))

		/*
		 * @TODO сделать работу cut и в обратную сторону
		 */

		if ($check.get('cut')) {
			cutToHour = Number($check.get('cut'))
		}

		data.forEach(item => {
			let itemStartTime =  moment.unix(item.s)
			let itemEndTime =    moment.unix(item.s + item.d)

			let itemStartTimeDay =   itemStartTime.format('DDD YY')
			let itemStartTimeHour =  itemStartTime.format('HH')

			if (itemStartTimeDay == dayToday) {
				if (
					cutToHour &&
					cutToHour > itemStartTimeHour
				) { return }

				dataContainer.appendChild(
					$create.elem(
						'p',
							`<span class="sched--time">${itemStartTime.format('HH:mm')}` +
							`&ndash; ${itemEndTime.format('HH:mm')}:</span>` +
							`<span class="sched--title">${item.title}</span>`
					)
				)
			}
		})
	}}),

	schedNext: () => doFetch({ fetchURL: API.schedule, handler: ({ data = [] }) => {
		let nextAirs = data.filter(e => e.s > moment().unix())

		if (nextAirs.length == 0) { return }

		dataContainer.innerHTML =
			`Далее будет:<br>${moment.unix(nextAirs[0].s).format('HH:mm')}` +
			`&ndash; ${nextAirs[0].title}`
	}}),

	song: () => doFetch({ fetchURL: `https://${DOMAINS.radio}/users/7934/status.json`, handler: ({ data = {} }) => {
		let song = data.song
		dataContainer.innerHTML = song.replace(' - ', ' &ndash; ')
	}}),

	time: () => dataContainer.innerText = moment().format('HH:mm:ss')
}

document.addEventListener('DOMContentLoaded', () => {
	let updTime = 5000

	if ($check.get('updtime')) {
		updTime = Number($check.get('updtime') + '000')
	}

	let URLData = $check.get('data')

	if (URLData) {
		dataContainer.classList.add(`data__${URLData}`)
	}

	switch (URLData) {
		case 'sched':
			$embed.sched()
			setInterval(() => { $embed.sched() }, updTime)
			break
		case 'sched-next':
			$embed.schedNext()
			setInterval(() => { $embed.schedNext() }, updTime)
			break
		case 'song':
			$embed.song()
			setInterval(() => { $embed.song() }, updTime)
			break
		case 'time':
			setInterval(() => { $embed.time() }, 250)
			break
	}
})
