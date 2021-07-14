# NBAVisual
A simple web application writen in React JSX that provide shot charts and player profile.

## stats.nba.com referer header
For some reason [stats.nba.com](stats.nba.com) has recently starting to check the "Referer" header in http requests. It seems that even though NBA is making the API public, they are restricting the people who can use it. Due to the fact that many modern browsers dissallow modification of the header, the app will not work. However, if you are using firefox, you can install two extensions: [CORS Everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/) and [Refer Control](https://addons.mozilla.org/en-US/firefox/addon/referercontrol/). Set Refer Control to send target domain for stats.nba.com/* or for all sites. Unfortunately, unless NBA reopen their API, this is the only viable way I can find.


## Custom Python server
The main reason why this app don't work without the extensions is because modern browser secruity forbidden changing the origin and referrer header fields in HTTP requests. Therefore, I have written a simple python server that you can open and deploy on localhost:8080. The app will send request over to this server which will act like a middle man so that we can change the origin and referer header fields.