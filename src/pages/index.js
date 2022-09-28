import { m } from 'framer-motion'
import { useEffect } from 'react'
import { useIsPresent } from 'framer-motion'

function HomePage() {
    const isPresent = useIsPresent()

    useEffect(() => {
        !isPresent && console.log("I've been removed!")
    }, [isPresent])

    return (
        <div className="page page-index">
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <m.div initial={{ y: '100%' }} animate={{ y: '0', transition: { delay: 0.9 } }} exit={{ y: '-100%' }}>
                    Index page
                </m.div>
            </div>
        </div>
    )
}

export default HomePage
