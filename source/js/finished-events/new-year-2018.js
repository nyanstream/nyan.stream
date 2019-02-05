	/*
	 * Новогодняя поздравлялка (топорная, но какая есть)
	 */

	void(() => {
		let nyTime = 1546290000 // таймштамп нового года по Москве

		let headerBrand = $make.qs('.header .brand')

		let headerBrandSub = $create.elem('div', '', 'brand--sub')

		let headerBrandSub_sub1 = $create.elem(
			'span',
			'&nbsp;/&nbsp;',
			'brand__text'
		)
		headerBrandSub_sub1.dataset.style = 'no-hover'

		headerBrandSub.appendChild(headerBrandSub_sub1)

		let headerBrandSub_sub2 = $create.elem(
			'span',
			getString('happy_ny'),
			'brand__text'
		)

		headerBrandSub.appendChild(headerBrandSub_sub2)

		let headerBrandSub_sub3 = $create.elem(
			'span',
			'&nbsp;🎉',
			'brand__text'
		)
		headerBrandSub_sub3.dataset.style = 'no-hover'

		headerBrandSub.appendChild(headerBrandSub_sub3)

		let NYtimer = setInterval(() => {
			if (moment().unix() >= nyTime) {
				headerBrand.appendChild(headerBrandSub)

				clearInterval(NYtimer)
			}
		}, 500)
	})()
