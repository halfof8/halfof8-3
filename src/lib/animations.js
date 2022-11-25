export const pageAnimation = {
	variants: {
		initial: {
			x: '100vw',
			opacity: 1,
			transition: {
				duration: 0.6
			}
		},
		animate: {
			x: '0vw',
			opacity: 1,
			transition: {
				duration: 0.6
			}
		},
		exit: {
			x: '-10vw',
			opacity: 0.5,
			transition: {
				duration: 0.6,
				x: {
					duration: 0.6
				}
			}
		}
	}
}
