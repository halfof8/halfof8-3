import '../styles/index.scss'
import { PageTransitionProvider } from '../context/pageTransition.js'
import Layout from '../components/Layout/Layout.js'

function App({ Component, pageProps }) {
	return (
		<PageTransitionProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</PageTransitionProvider>
	)
}

export default App
