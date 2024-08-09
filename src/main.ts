import {app} from './applications/app'
import { logger } from './applications/logging'

app.listen(8000, () => {
    logger.info("Listening on port 8000")
})
