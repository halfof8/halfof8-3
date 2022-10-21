export function cls(...classes) {
	return classes.filter((i) => !!i).join(' ')
}
