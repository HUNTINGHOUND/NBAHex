# NBAVisual
A simple web application writen in React JSX that provide shot charts and player profile.

## stats.nba.com referer header
For some reason [stats.nba.com](stats.nba.com) has recently starting to check the "Referer" header in http requests. It seems that even though NBA is making the API public, they are restricting the people who can use it. Due to the fact that many modern browsers dissallow modification of the header, the app will not work. However, if you are using firefox, you can install two extensions: [CORS Everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/) and [Refer Control](https://addons.mozilla.org/en-US/firefox/addon/referercontrol/). Set Refer Control to send target domain for stats.nba.com/* or for all sites. Unfortunately, unless NBA reopen their API, this is the only viable way I can find.

In addition, it seems that NBA has also blocked a range of ip addresses to hang API calls from cloud servers such as AWS. Once again nothing I can do about this. Right now the only option is to deploy the app on a local host.

## Proxy Server
Switch to the "with_custom_server" branch to see a simple python proxy server.
