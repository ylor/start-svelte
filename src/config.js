/*
  At minimum each entry requires `url` & `keys` properties.
  If you want it to show in the
  `url` must be a string
  `keys` must be an array, even if it's a single entry
 */

export const config = {
  user: "roly",
  sites: [
    // Search
    {
      name: "Google",
      keys: ["google", "*"],
      url: "https://google.com",
      search: "https://google.com/search?q={}",
      hidden: true,
    },
    {
      name: "DuckDuckGo",
      keys: ["duckduckgo", "duck", "ddg", "d"],
      url: "https://duckduckgo.com",
      search: "https://duckduckgo.com/?q={}",
      hidden: true,
    },
    // Me
    {
      category: "🤓 Me",
      name: "About",
      keys: ["about"],
      url: "https://about.rolyreyes.com",
    },
    {
      category: "🤓 Me",
      name: "Blog",
      keys: ["blog"],
      url: "https://rolyreyes.com",
    },
    {
      category: "🤓 Me",
      name: "Dotfiles",
      keys: ["dot"],
      url: "https://github.com/ylor/dotfiles",
    },
    {
      category: "🤓 Me",
      name: "Github",
      keys: ["github", "git"],
      url: "https://github.com/",
      search: "https://github.com/search?q={}",
    },
    {
      category: "🤓 Me",
      name: "Start",
      keys: ["start"],
      url: "https://start.rolyreyes.com",
    },
    // Server
    {
      category: "👨🏽‍💻 Server",

      name: "Homebridge",
      keys: ["homebridge", "hb"],
      url: "http://docker.lan:8181",
    },
    {
      category: "👨🏽‍💻 Server",
      name: "Pi-hole",
      keys: ["pihole", "pi", "dns"],
      url: "http://pi.hole/admin",
    },
    {
      category: "👨🏽‍💻 Server",

      name: "Plex",
      keys: ["plex"],
      url: "http://server.local:32400/web/index.html",
      search: "http://server.local:32400/web/index.html#!/search?query={}",
    },
    {
      category: "👨🏽‍💻 Server",

      name: "Radarr",
      keys: ["radarr", "movies", "m"],
      url: "http://server.lan:7878",
      search: "http://server.lan:7878/add/new?term={}",
    },
    {
      category: "👨🏽‍💻 Server",

      name: "Sonarr",
      keys: ["sonarr", "tv"],
      url: "http://server.lan:8989",
      search: "http://server.lan:8989/add/new?term={}",
    },
    {
      category: "👨🏽‍💻 Server",

      name: "Transmission",
      keys: ["transmission", "bt"],
      url: "http://server.lan:9091",
    },
    {
      category: "👨🏽‍💻 Server",
      name: "UniFi Controller",
      keys: ["unifi"],
      url: "http://docker.lan:8080",
    },
    //Work
    {
      category: "🎓 MDC",
      name: "Apple School Manager",
      keys: ["apple school manager", "asm"],
      url: "http://school.apple.com",
    },
    {
      category: "🎓 MDC",
      name: "Duo",
      keys: ["duo"],
      url: "http://admin.duosecurity.com",
    },
    {
      category: "🎓 MDC",
      name: "Forms",
      keys: ["form", "forms"],
      url:
        "https://forms.office.com/Pages/ResponsePage.aspx?id=BmhisP_Ok0OCHvmj5maJOxTM7A6YzXlAmKCvVMMrgsFUMzJaTFhGOEY0STlLWkVMR1JKMU4zMThFTC4u",
    },
    {
      category: "🎓 MDC",
      name: "Fusion",
      keys: ["fusion", "kfusion"],
      url: "http://kfusion1.kendall.mdcc.edu/",
    },
    {
      category: "🎓 MDC",
      name: "JAMF",
      keys: ["jamf"],
      url: "https://kmacdep.kendall.mdcc.edu:8443",
    },
    {
      category: "🎓 MDC",
      name: "Kaseya",
      keys: ["kaseya"],
      url: "https://kaseya.mdc.edu/",
    },
    {
      category: "🎓 MDC",
      name: "Miami Dade College",
      keys: ["mdc"],
      url: "http://www.mdc.edu",
      hidden: true,
    },
    {
      category: "🎓 MDC",
      name: "NTAuth",
      keys: ["ntauth"],
      url: "http://ntauth.mdc.edu",
    },
    {
      category: "🎓 MDC",
      name: "NTAuth - Employee",
      keys: ["emp"],
      url: "https://mdcwapi.mdc.edu:8001/ntauth_hd/",
      search:
        "https://mdcwapi.mdc.edu:8001/ntauth_hd/ManageAccount?domainValue=MDCC&personnelID={}",
    },
    {
      category: "🎓 MDC",
      name: "NTAuth - Student",
      keys: ["stu"],
      url: "https://mdcwapi.mdc.edu:8001/ntauth_hd/",
      search:
        "https://mdcwapi.mdc.edu:8001/ntauth_hd/ManageAccount?domainValue=MYMDC&personnelID={}",
    },
    {
      category: "🎓 MDC",
      name: "Service Requests",
      keys: ["kloadbal", "sr"],
      url: "http://kloadbal.kendall.mdcc.edu/",
    },
    {
      category: "🎓 MDC",
      name: "Sharepoint",
      keys: ["cns", "sharepoint"],
      url:
        "https://miamidadecollegeprod.sharepoint.com/teams/MDC_Kendall_CampusNetworkServices/SitePages/CNS%20Department%20Policies%20and%20Procedures.aspx",
    },
    {
      category: "🎓 MDC",
      name: "Sharepoint-old",
      keys: ["cns-old", "sharepoint-old"],
      url:
        "https://sharepoint.mdc.edu/kendall/departments/cns/SitePages/CNS%20Department%20Policies%20and%20Procedures.aspx",
      hidden: true,
    },
    {
      category: "🎓 MDC",
      name: "Timeclock",
      keys: ["timeclock", "tc"],
      url: "https://timeclock.mdc.edu",
    },
    // Media
    {
      category: "📼 Media",
      name: "Giant Bomb",
      keys: ["giant bomb", "gb"],
      url: "https://www.giantbomb.com/",
      search: "https://www.giantbomb.com/search/?i=&q={}",
    },
    {
      category: "📼 Media",
      name: "Giant Bomb Infinite",
      keys: ["giant bomb infinite", "gb8"],
      url: "https://www.giantbomb.com/infinite",
    },
    {
      category: "📼 Media",
      name: "Letterboxd",
      keys: ["letterboxd", "lb"],
      url: "https://letterboxd.com/films/popular/this/week/size/large/",
      search: "https://letterboxd.com/search/films/{}/",
    },
    {
      category: "📼 Media",
      name: "Netflix",
      keys: ["netflix", "nf"],
      url: "https://www.netflix.com",
      search: "https://www.netflix.com/search?q={}",
    },
    {
      category: "📼 Media",
      name: "Plex",
      keys: ["plexapp", "plextv", "plexr"],
      url: "https://app.plex.tv/desktop",
      search: "https://app.plex.tv/desktop#!/search?query={}",
    },
    {
      category: "📼 Media",
      name: "Spotify",
      keys: ["spotify"],
      url: "https://open.spotify.com",
    },
    {
      category: "📼 Media",
      name: "Twitch",
      keys: ["twitch"],
      url: "https://twitch.tv/directory",
    },
    {
      category: "📼 Media",
      name: "YouTube",
      keys: ["youtube", "yt"],
      url: "https://youtube.com",
      search: "https://youtube.com/results?search_query={}",
    },
    // Destiny
    {
      category: "🎮 Destiny",
      name: "Braytech",
      keys: ["braytech"],
      url: "https://braytech.org",
    },
    {
      category: "🎮 Destiny",
      name: "D2Checklist",
      keys: ["d2checklist", "d2c"],
      url: "https://www.d2checklist.com",
    },
    {
      category: "🎮 Destiny",
      name: "Destiny Item Manager",
      keys: ["destiny item manager", "dim"],
      url: "https://app.destinyitemmanager.com",
    },
    {
      category: "🎮 Destiny",
      name: "Destiny Sets",
      keys: ["destiny sets", "sets"],
      url: "https://destinysets.com",
    },
    {
      category: "🎮 Destiny",
      name: "Guardian.gg",
      keys: ["guardian", "ggg"],
      url: "https://guardian.gg",
    },
    {
      category: "🎮 Destiny",
      name: "Light.gg",
      keys: ["lightgg", "light"],
      url: "https://light.gg",
      search: "https://www.light.gg/db/search/?q={}",
    },
    {
      category: "🎮 Destiny",
      name: "Today in Destiny",
      keys: ["todayindestiny", "tid"],
      url: "https://www.todayindestiny.com/",
    },
    // Reddit
    {
      category: "💩 Reddit",
      name: "/r/Battlestations",
      keys: ["r/battlestations", "r/bs"],
      url: "https://www.reddit.com/r/battlestations",
      search:
        "https://www.reddit.com/r/battlestations/search?q={}&restrict_sr=1",
    },
    {
      category: "💩 Reddit",
      name: "/r/DestinyTheGame",
      keys: ["r/destinythegame", "r/dtg", "dtg"],
      url: "https://www.reddit.com/r/destinythegame",
      search:
        "https://www.reddit.com/r/destinythegame/search?q={}&restrict_sr=1",
    },
    {
      category: "💩 Reddit",
      name: "/r/RaidSecrets",
      keys: ["r/raidsecrets", "r/rs", "rs"],
      url: "https://www.reddit.com/r/raidsecrets",
      search: "https://www.reddit.com/r/raidsecrets/search?q={}&restrict_sr=1",
    },
    {
      category: "💩 Reddit",
      name: "/r/HipHopHeads",
      keys: ["r/hiphopheads", "r/hhh", "hhh"],
      url: "https://www.reddit.com/r/hiphopheads",
      search: "https://www.reddit.com/r/hiphopheads/search?q={}&restrict_sr=1",
    },
    {
      category: "💩 Reddit",
      name: "/r/MechanicalKeyboards",
      keys: ["r/mechanicalkeyboards", "r/mk", "rmk"],
      url: "https://www.reddit.com/r/mechanicalkeyboards",
      search:
        "https://www.reddit.com/r/mechanicalkeyboards/search?q={}&restrict_sr=1",
    },
    {
      category: "💩 Reddit",
      name: "/r/MechMarket",
      keys: ["r/mechmarket", "r/mm", "mm"],
      url: "https://www.reddit.com/r/mechmarket",
      search: "https://www.reddit.com/r/mechmarket/search?q={}&restrict_sr=1",
    },
    {
      category: "💩 Reddit",
      name: "/r/SquaredCircle",
      keys: ["r/squaredcircle", "r/sc"],
      url: "https://www.reddit.com/r/squaredcircle",
      search:
        "https://www.reddit.com/r/squaredcircle/search?q={}&restrict_sr=1",
    },
    // Infosec
    {
      name: "1Password Generator",
      keys: ["pw"],
      url: "https://1password.com/password-generator",
    },
    {
      name: "Bitwarden",
      keys: ["bitwarden", "bw"],
      url: "https://vault.bitwarden.com",
    },
    // Internet
    {
      name: "Amazon",
      keys: ["amazon", "a"],
      url: "https://www.amazon.com",
      search: "https://www.amazon.com/s?k={}",
    },
    {
      name: "CamelCamelCamel",
      keys: ["camelcamelcamel", "ccc"],
      url: "https://camelcamelcamel.com/",
      search: "https://camelcamelcamel.com/search?sq={}",
    },
    {
      name: "Discord",
      keys: ["discord"],
      url: "https://discordapp.com/activity",
    },
    {
      name: "Drive",
      keys: ["drive", "gdrive"],
      url: "https://drive.google.com",
    },
    {
      name: "Epic Game Store",
      keys: ["epic game store", "egs"],
      url: "https://www.epicgames.com/store",
      search: "https://www.epicgames.com/store/store-search/?q={}",
    },
    {
      name: "Geekhack",
      keys: ["geekhack", "gh"],
      url: "https://geekhack.org/",
    },
    {
      name: "Geekhack - Interest Check",
      keys: ["ghic", "ghi"],
      url: "https://geekhack.org/index.php?board=132.0",
    },
    {
      name: "Geekhack - Group Buys and Preorders",
      keys: ["ghgb", "ghb"],
      url: "https://geekhack.org/index.php?board=70.0",
    },
    {
      name: "Giphy",
      keys: ["giphy", "gif"],
      url: "https://giphy.com",
      search: "https://giphy.com/search/{}",
      hidden: true,
    },
    {
      name: "Guess My Word",
      keys: ["guessmyword", "gmw"],
      url: "https://hryanjones.com/guess-my-word/",
    },
    {
      name: "Hacker News",
      keys: ["hacker news", "hn"],
      url: "https://news.ycombinator.com",
      search: "https://hn.algolia.com/?&query={}",
    },
    {
      name: "How Long to Beat",
      keys: ["how lont to beat", "hltb"],
      url: "https://howlongtobeat.com",
      search: "https://howlongtobeat.com/?q={}",
    },
    {
      name: "iCloud",
      keys: ["icloud"],
      url: "https://www.icloud.com",
    },
    {
      name: "iCloud Mail",
      keys: ["mail"],
      url: "https://www.icloud.com/#mail",
    },
    {
      name: "Instagram",
      keys: ["instagram", "insta", "ig"],
      url: "https://www.instagram.com",
    },
    {
      name: "JSFiddle",
      keys: ["jsfiddle", "fiddle"],
      url: "https://jsfiddle.net",
    },
    {
      name: "Keebtalk",
      keys: ["keebtalk", "kt"],
      url: "https://www.keebtalk.com/",
    },
    {
      name: "MyAnimeList",
      keys: ["myanimelist", "mal"],
      url: "https://myanimelist.net",
      search: "https://myanimelist.net/search/all?q={}",
    },
    {
      name: "Netlify",
      keys: ["netlify"],
      url: "https://app.netlify.com",
    },
    {
      name: "Node Package Manager",
      keys: ["npm"],
      url: "https://www.npmjs.com",
      search: "https://www.npmjs.com/search?q={}",
    },
    {
      name: "Nyaa",
      keys: ["nyaa"],
      url: "https://nyaa.si",
      search: "https://nyaa.si/?f=0&c=0_0&q={}",
    },
    {
      name: "OneDrive",
      keys: ["onedrive", "od"],
      url: "https://onedrive.live.com",
    },
    {
      name: "Reddit",
      keys: ["reddit", "r"],
      url: "https://www.reddit.com/r",
      search: "https://www.reddit.com/search?q={}",
    },
    {
      name: "Reddit User",
      keys: ["u"],
      url: "https://www.reddit.com/u",
      search: "https://www.reddit.com/u/search?q={}",
      hidden: true,
    },
    {
      name: "Simplenote",
      keys: ["simplenote", "sn"],
      url: "https://app.simplenote.com",
    },
    {
      name: "ResetERA",
      keys: ["resetera", "reset", "era", "re"],
      url: "https://www.resetera.com",
    },
    {
      name: "Steam",
      keys: ["steam"],
      url: "https://store.steampowered.com",
      search: "https://store.steampowered.com/search/?term={}",
    },
    {
      name: "Tumblr",
      keys: ["tumblr"],
      url: "https://tumblr.com",
    },
    {
      name: "The Movie Database",
      keys: ["tmdb"],
      url: "https://www.themoviedb.org",
      search: "https://www.themoviedb.org/search?query={}&language=en-US",
    },
    {
      name: "The TVDB",
      keys: ["tvdb"],
      url: "https://thetvdb.com",
      search: "https://thetvdb.com/search?query={}",
    },
    {
      name: "Twitter",
      keys: ["twitter"],
      url: "https://twitter.com",
      search: "https://twitter.com/search?q={}",
    },
    {
      name: "WhatsApp",
      keys: ["whatsapp", "wa"],
      url: "https://web.whatsapp.com/",
    },
    {
      name: "Wirecutter",
      keys: ["wirecutter", "wc"],
      url: "https://thewirecutter.com/",
    },
    {
      name: "Wikipedia",
      keys: ["wikipedia", "wiki"],
      url: "https://www.wikipedia.org/",
      url: "https://en.wikipedia.org/wiki/{}",
    },
    {
      name: "Yarn",
      keys: ["yarn"],
      url: "https://yarnpkg.com",
      search: "https://classic.yarnpkg.com/en/packages?q={}&p=1",
    },
    // 🏴‍☠️
    {
      name: "RARBG",
      keys: ["rarbg"],
      url: "https://rarbg.to/torrents",
      search: "https://rarbg.to/torrents?search={}",
    },
    {
      name: "1337x",
      keys: ["1337x", "1337"],
      url: "https://www.1377x.to/",
      search: "https://www.1377x.to/sort-search/{}/seeders/desc/1/",
    },
    // 🗑️
    {
      name: "/g/ - Technology",
      keys: ["g"],
      url: "https://boards.4chan.org/g/catalog",
      hidden: true,
    },
    {
      name: "/w/ - Wallpapers",
      keys: ["w"],
      url: "https://boards.4chan.org/w/catalog",
      hidden: true,
    },
    {
      name: "/wg/ - Wallpapers General",
      keys: ["wg"],
      url: "https://boards.4chan.org/wg/catalog",
      hidden: true,
    },
  ],
};
