const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const initRoutes = require("./src/routes/index")
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const { Post, Overview } = require(('./src/models/index'))
const { Op } = require('sequelize');

dotenv.config()
const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    method: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initRoutes(app)
const port = process.env.PORT || 3333
app.listen(port, () => {
    console.log("Servers runs successfully!")
})
// 
// Schedule a task to run every hour
cron.schedule('0 * * * *', async () => {
    try {
        // Find all overviews where expire date is less than now
        const expiredOverviews = await Overview.findAll({
            where: {
                expire: {
                    [Op.lt]: new Date()
                }
            }
        });

        const expiredOverviewIds = expiredOverviews.map(overview => overview.id);

        // Update status of posts with expired overviews
        await Post.update(
            { status: 1 },
            {
                where: {
                    overview_id: {
                        [Op.in]: expiredOverviewIds
                    },
                    status: 0 // Optional: only update posts that are currently active
                }
            }
        );

        console.log(`Updated status of ${expiredOverviewIds.length} expired posts.`);
    } catch (error) {
        console.error('Error updating expired posts:', error);
    }
});
