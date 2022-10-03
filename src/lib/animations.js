export const slideUp = {
	name: 'Slide Up',
	variants: {
		initial: {
			y: '100vh',
			clipPath: 'inset(0 0 0 0)',
			opacity: 1,
			transition: {
				delay: 0.3,
				duration: 0.6
			}
		},
		animate: {
			y: '0vh',
			clipPath: 'inset(0 0 0 0)',
			opacity: 1,
			transition: {
				delay: 0.3,
				duration: 0.6
			}
		},
		exit: {
			y: '-10vh',
			clipPath: 'inset(0 20px 0 20px)',
			opacity: 0.5,
			transition: {
				duration: 0.9,
				y: {
					delay: 0.3,
					duration: 0.6
				}
			}
		}
	}
}

export const fadeIn = {
	name: 'Fade In',
	variants: {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { delay: 0.9 } },
		exit: { opacity: 1 }
	}
}
